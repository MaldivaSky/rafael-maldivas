-- ------------------------------------------------------------------
--  Banco de leads do site maldivastech.dev (Oracle Cloud)
--
--  Roda DENTRO do banco `maldivas_site` (isolado do mercadinhosys).
--  Idempotente: pode rodar de novo a cada deploy sem perder dados.
--
--  Acesso via PostgREST, por papel (o JWT emitido pelo site escolhe):
--    site_anon    -> nada (requisição sem token não vê nem grava)
--    site_writer  -> só INSERT em leads (formulário público)
--    site_admin   -> lê leads/eventos e muda status (painel /admin)
--  A senha do `maldivas_authenticator` é definida pelo setup-leads.sh.
-- ------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'site_anon')   THEN CREATE ROLE site_anon NOLOGIN;   END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'site_writer') THEN CREATE ROLE site_writer NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'site_admin')  THEN CREATE ROLE site_admin NOLOGIN;  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'maldivas_authenticator') THEN
    CREATE ROLE maldivas_authenticator LOGIN NOINHERIT;
  END IF;
END
$$;

GRANT site_anon, site_writer, site_admin TO maldivas_authenticator;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA IF NOT EXISTS site;
REVOKE ALL ON SCHEMA site FROM PUBLIC;

CREATE TABLE IF NOT EXISTS site.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criado_em   timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  nome        text NOT NULL DEFAULT 'Sem nome' CHECK (char_length(nome) <= 300),
  status      text NOT NULL DEFAULT 'Novo'
              CHECK (status IN ('Novo','Em contato','Proposta enviada','Ganho','Perdido','Descartado')),
  area        text NOT NULL DEFAULT 'Indefinido' CHECK (char_length(area) <= 60),
  prazo       text NOT NULL DEFAULT 'Estudando'  CHECK (char_length(prazo) <= 60),
  servicos    text[] NOT NULL DEFAULT '{}',
  contato     text NOT NULL DEFAULT '' CHECK (char_length(contato) <= 2000),
  negocio     text NOT NULL DEFAULT '' CHECK (char_length(negocio) <= 2000),
  dor         text NOT NULL DEFAULT '' CHECK (char_length(dor) <= 4000),
  idioma      text NOT NULL DEFAULT 'PT' CHECK (idioma IN ('PT','EN')),
  canal       text NOT NULL DEFAULT 'Site' CHECK (char_length(canal) <= 60),
  -- origem da importação do Notion (garante que importar 2x não duplica)
  notion_id   text UNIQUE
);

-- Origem do lead (de onde veio). O canal é decidido no servidor
-- (app/lib/origem.ts); aqui só se guarda. Tudo opcional: lead antigo e lead
-- sem rastro continuam válidos. Tamanhos limitados: o valor vem do navegador.
ALTER TABLE site.leads
  ADD COLUMN IF NOT EXISTS canal_certeza  text
    CHECK (canal_certeza IN ('confirmado','provavel','desconhecido')),
  ADD COLUMN IF NOT EXISTS utm_campaign   text CHECK (char_length(utm_campaign) <= 120),
  ADD COLUMN IF NOT EXISTS utm_content    text CHECK (char_length(utm_content) <= 120),
  ADD COLUMN IF NOT EXISTS referrer_host  text CHECK (char_length(referrer_host) <= 120),
  ADD COLUMN IF NOT EXISTS landing        text CHECK (char_length(landing) <= 200),
  ADD COLUMN IF NOT EXISTS origem_primeira jsonb CHECK (octet_length(origem_primeira::text) <= 1500),
  ADD COLUMN IF NOT EXISTS origem_ultima   jsonb CHECK (octet_length(origem_ultima::text) <= 1500);

CREATE INDEX IF NOT EXISTS leads_canal_idx     ON site.leads (canal);
CREATE INDEX IF NOT EXISTS leads_criado_em_idx ON site.leads (criado_em DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx    ON site.leads (status);

-- trilha de auditoria: toda criação e toda troca de status
CREATE TABLE IF NOT EXISTS site.lead_eventos (
  id          bigserial PRIMARY KEY,
  lead_id     uuid NOT NULL REFERENCES site.leads (id) ON DELETE CASCADE,
  em          timestamptz NOT NULL DEFAULT now(),
  acao        text NOT NULL,
  status_de   text,
  status_para text,
  papel       text NOT NULL DEFAULT current_user
);
CREATE INDEX IF NOT EXISTS lead_eventos_lead_idx ON site.lead_eventos (lead_id, em DESC);

-- ------------------------------------------------------------------
--  Telemetria do site (painel BI do /admin)
--
--  Sem IP, sem cookie, sem id persistente: `sessao` é um uuid que vive
--  só na aba do navegador e some ao fechá-la. Conta SESSÕES, não pessoas.
--  O servidor descarta robôs e aparelhos da equipe antes de gravar.
--  Retenção sugerida: 13 meses (site.expurgar_eventos()).
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site.eventos (
  id          bigserial PRIMARY KEY,
  em          timestamptz NOT NULL DEFAULT now(),
  evento      text NOT NULL CHECK (evento IN (
                'page_view','page_exit','contact_click','service_click','portfolio_click',
                'briefing_start','lead_submit','tool_click','product_demo')),
  caminho     text NOT NULL DEFAULT '/' CHECK (char_length(caminho) <= 160),
  canal       text NOT NULL DEFAULT 'Direto' CHECK (char_length(canal) <= 60),
  utm_content text CHECK (char_length(utm_content) <= 120),
  sessao      uuid,
  dispositivo text CHECK (dispositivo IN ('mobile','tablet','desktop')),
  idioma      text CHECK (idioma IN ('pt','en')),
  pais        text CHECK (pais ~ '^[A-Z]{2}$'),
  segundos    integer CHECK (segundos BETWEEN 0 AND 3600)
);
CREATE INDEX IF NOT EXISTS eventos_em_idx        ON site.eventos (em DESC);
CREATE INDEX IF NOT EXISTS eventos_evento_em_idx ON site.eventos (evento, em DESC);

CREATE OR REPLACE FUNCTION site.expurgar_eventos() RETURNS bigint
LANGUAGE sql AS $$
  WITH apagadas AS (DELETE FROM site.eventos WHERE em < now() - interval '13 months' RETURNING 1)
  SELECT count(*) FROM apagadas;
$$;

/*
 * Tudo que o painel mostra, numa chamada só (POST /rpc/painel {"p_dias":30}).
 * Dias no fuso de São Paulo. Período atual x anterior de mesma duração.
 * Leads vêm de site.leads (a verdade); visitas vêm de site.eventos.
 * Lead de teste (canal 'Interno (teste)') nunca entra na conta.
 */
CREATE OR REPLACE FUNCTION site.painel(p_dias integer DEFAULT 30) RETURNS jsonb
LANGUAGE plpgsql STABLE SET search_path = site, pg_temp AS $$
DECLARE
  d       integer := least(greatest(coalesce(p_dias, 30), 1), 365);
  hoje    timestamptz := date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo';
  ini     timestamptz := hoje - make_interval(days => d - 1);
  ini_ant timestamptz := hoje - make_interval(days => 2 * d - 1);
  r       jsonb;
BEGIN
  WITH ev AS (
    SELECT *, CASE WHEN em >= ini THEN 'atual' ELSE 'anterior' END AS per
    FROM eventos WHERE em >= ini_ant
  ),
  ld AS (
    SELECT *, CASE WHEN criado_em >= ini THEN 'atual' ELSE 'anterior' END AS per
    FROM leads WHERE criado_em >= ini_ant AND canal <> 'Interno (teste)'
  ),
  sess AS (   -- uma linha por sessão e período
    SELECT per, sessao,
           count(*) FILTER (WHERE evento = 'page_view')              AS pv,
           coalesce(sum(segundos) FILTER (WHERE evento = 'page_exit'), 0) AS seg,
           bool_or(evento IN ('contact_click','service_click','portfolio_click','product_demo','tool_click')) AS clicou,
           bool_or(evento = 'briefing_start')                        AS briefing,
           bool_or(evento = 'lead_submit')                           AS enviou
    FROM ev WHERE sessao IS NOT NULL GROUP BY per, sessao HAVING count(*) FILTER (WHERE evento = 'page_view') > 0
  ),
  kpi AS (
    SELECT p.per,
      (SELECT count(*) FROM sess s WHERE s.per = p.per)                                   AS sessoes,
      (SELECT count(*) FROM ev e WHERE e.per = p.per AND e.evento = 'page_view')          AS paginas,
      (SELECT count(*) FROM ld l WHERE l.per = p.per)                                     AS leads,
      (SELECT count(*) FROM sess s WHERE s.per = p.per AND s.pv = 1)                      AS rejeitaram,
      (SELECT round(avg(s.seg)) FROM sess s WHERE s.per = p.per AND s.seg > 0)            AS segundos_medio
    FROM (VALUES ('atual'), ('anterior')) AS p(per)
  )
  SELECT jsonb_build_object(
    'dias', d,
    'de', ini,
    'kpis', (SELECT jsonb_object_agg(per, to_jsonb(kpi) - 'per') FROM kpi),
    'diario', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('dia', to_char(g.dia, 'YYYY-MM-DD'),
                'sessoes', (SELECT count(DISTINCT e.sessao) FROM ev e WHERE e.per = 'atual' AND e.evento = 'page_view'
                              AND (e.em AT TIME ZONE 'America/Sao_Paulo')::date = g.dia),
                'leads', (SELECT count(*) FROM ld l WHERE l.per = 'atual'
                              AND (l.criado_em AT TIME ZONE 'America/Sao_Paulo')::date = g.dia)
              ) ORDER BY g.dia), '[]'::jsonb)
      FROM generate_series((ini AT TIME ZONE 'America/Sao_Paulo')::date,
                           (hoje AT TIME ZONE 'America/Sao_Paulo')::date, interval '1 day') AS g(dia)
    ),
    'canais', (
      SELECT coalesce(jsonb_agg(x ORDER BY (x->>'sessoes')::int DESC, (x->>'leads')::int DESC), '[]'::jsonb) FROM (
        SELECT jsonb_build_object('canal', c.canal,
                 'sessoes', coalesce(v.sessoes, 0), 'leads', coalesce(l.leads, 0)) AS x
        FROM (SELECT canal FROM ev WHERE per = 'atual' AND evento = 'page_view'
              UNION SELECT canal FROM ld WHERE per = 'atual') c
        LEFT JOIN (SELECT canal, count(DISTINCT sessao) AS sessoes FROM ev
                   WHERE per = 'atual' AND evento = 'page_view' GROUP BY canal) v USING (canal)
        LEFT JOIN (SELECT canal, count(*) AS leads FROM ld WHERE per = 'atual' GROUP BY canal) l USING (canal)
      ) t
    ),
    'posts', (
      SELECT coalesce(jsonb_agg(x ORDER BY (x->>'sessoes')::int DESC), '[]'::jsonb) FROM (
        SELECT jsonb_build_object('post', c.utm_content,
                 'sessoes', coalesce(v.sessoes, 0), 'leads', coalesce(l.leads, 0)) AS x
        FROM (SELECT utm_content FROM ev WHERE per = 'atual' AND evento = 'page_view' AND utm_content IS NOT NULL
              UNION SELECT utm_content FROM ld WHERE per = 'atual' AND utm_content IS NOT NULL) c
        LEFT JOIN (SELECT utm_content, count(DISTINCT sessao) AS sessoes FROM ev
                   WHERE per = 'atual' AND evento = 'page_view' GROUP BY utm_content) v USING (utm_content)
        LEFT JOIN (SELECT utm_content, count(*) AS leads FROM ld WHERE per = 'atual' GROUP BY utm_content) l USING (utm_content)
        LIMIT 20
      ) t
    ),
    'funil', (
      SELECT jsonb_build_object('visitaram', count(*), 'interagiram', count(*) FILTER (WHERE clicou OR briefing OR enviou),
               'briefing', count(*) FILTER (WHERE briefing OR enviou), 'enviaram', count(*) FILTER (WHERE enviou))
      FROM sess WHERE per = 'atual'
    ),
    'paginas', (
      SELECT coalesce(jsonb_agg(x ORDER BY (x->>'visitas')::int DESC), '[]'::jsonb) FROM (
        SELECT jsonb_build_object('caminho', e.caminho,
                 'visitas', count(*) FILTER (WHERE e.evento = 'page_view'),
                 'segundos_medio', round(avg(e.segundos) FILTER (WHERE e.evento = 'page_exit' AND e.segundos > 0)),
                 'leads', count(DISTINCT e.sessao) FILTER (WHERE e.evento = 'page_view'
                            AND e.sessao IN (SELECT s.sessao FROM sess s WHERE s.per = 'atual' AND s.enviou))) AS x
        FROM ev e WHERE e.per = 'atual' AND e.evento IN ('page_view','page_exit')
        GROUP BY e.caminho
        HAVING count(*) FILTER (WHERE e.evento = 'page_view') > 0
        ORDER BY count(*) FILTER (WHERE e.evento = 'page_view') DESC LIMIT 15
      ) t
    ),
    'dispositivos', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('nome', coalesce(dispositivo, 'desconhecido'), 'sessoes', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT dispositivo, count(DISTINCT sessao) AS n FROM ev WHERE per = 'atual' AND evento = 'page_view' GROUP BY dispositivo) t
    ),
    'paises', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('nome', coalesce(pais, '—'), 'sessoes', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT pais, count(DISTINCT sessao) AS n FROM ev WHERE per = 'atual' AND evento = 'page_view'
            GROUP BY pais ORDER BY n DESC LIMIT 8) t
    ),
    'idiomas', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('nome', coalesce(idioma, '—'), 'sessoes', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT idioma, count(DISTINCT sessao) AS n FROM ev WHERE per = 'atual' AND evento = 'page_view' GROUP BY idioma) t
    )
  ) INTO r;
  RETURN r;
END
$$;

CREATE OR REPLACE FUNCTION site.registrar_evento() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = site, pg_temp AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO site.lead_eventos (lead_id, acao, status_para, papel)
    VALUES (NEW.id, 'criado', NEW.status, current_setting('role', true));
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.atualizado_em := now();
    INSERT INTO site.lead_eventos (lead_id, acao, status_de, status_para, papel)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, current_setting('role', true));
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS leads_auditoria_ins ON site.leads;
CREATE TRIGGER leads_auditoria_ins AFTER INSERT ON site.leads
  FOR EACH ROW EXECUTE FUNCTION site.registrar_evento();

DROP TRIGGER IF EXISTS leads_auditoria_upd ON site.leads;
CREATE TRIGGER leads_auditoria_upd BEFORE UPDATE ON site.leads
  FOR EACH ROW EXECUTE FUNCTION site.registrar_evento();

-- permissões mínimas por papel
REVOKE ALL ON ALL TABLES IN SCHEMA site FROM site_anon, site_writer, site_admin;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA site FROM site_anon, site_writer, site_admin;
REVOKE EXECUTE ON FUNCTION site.registrar_evento() FROM PUBLIC;

GRANT USAGE ON SCHEMA site TO site_writer, site_admin;

GRANT INSERT (nome, area, prazo, servicos, contato, negocio, dor, idioma, canal,
              canal_certeza, utm_campaign, utm_content, referrer_host, landing,
              origem_primeira, origem_ultima)
  ON site.leads TO site_writer;

-- telemetria: o site só INSERE (rota /api/analytics); o painel só LÊ
GRANT INSERT ON site.eventos TO site_writer;
GRANT USAGE ON SEQUENCE site.eventos_id_seq TO site_writer;
GRANT SELECT ON site.eventos TO site_admin;
REVOKE EXECUTE ON FUNCTION site.painel(integer), site.expurgar_eventos() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION site.painel(integer) TO site_admin;

GRANT SELECT ON site.leads, site.lead_eventos TO site_admin;
GRANT UPDATE (status) ON site.leads TO site_admin;
-- importação do Notion (feita com token de admin)
GRANT INSERT (nome, status, area, prazo, servicos, contato, negocio, dor, idioma, canal, criado_em, notion_id)
  ON site.leads TO site_admin;

-- ------------------------------------------------------------------
--  Área do Aluno (Google OAuth, Perfil, Matrículas, Trilha e Certificados)
-- ------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'site_student_api') THEN
    CREATE ROLE site_student_api NOLOGIN;
  END IF;
END
$$;

GRANT site_student_api TO maldivas_authenticator;
GRANT USAGE ON SCHEMA site TO site_student_api;

CREATE TABLE IF NOT EXISTS site.alunos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub       text NOT NULL UNIQUE CHECK (char_length(google_sub) <= 120),
  email            text NOT NULL UNIQUE CHECK (char_length(email) <= 320),
  nome             text NOT NULL CHECK (char_length(nome) <= 200),
  nome_certificado text NOT NULL DEFAULT '' CHECK (char_length(nome_certificado) <= 200),
  avatar_url       text NOT NULL DEFAULT '' CHECK (char_length(avatar_url) <= 1000),
  headline         text NOT NULL DEFAULT '' CHECK (char_length(headline) <= 160),
  bio              text NOT NULL DEFAULT '' CHECK (char_length(bio) <= 1000),
  github_url       text NOT NULL DEFAULT '' CHECK (char_length(github_url) <= 300),
  linkedin_url     text NOT NULL DEFAULT '' CHECK (char_length(linkedin_url) <= 300),
  objetivo         text NOT NULL DEFAULT '' CHECK (char_length(objetivo) <= 160),
  criado_em        timestamptz NOT NULL DEFAULT now(),
  atualizado_em    timestamptz NOT NULL DEFAULT now(),
  ultimo_acesso_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site.matriculas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id     uuid NOT NULL REFERENCES site.alunos(id) ON DELETE CASCADE,
  curso_slug   text NOT NULL CHECK (char_length(curso_slug) <= 120),
  status       text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','concluido','pausado')),
  iniciado_em  timestamptz NOT NULL DEFAULT now(),
  concluido_em timestamptz,
  UNIQUE (aluno_id, curso_slug)
);

CREATE TABLE IF NOT EXISTS site.progresso_aulas (
  aluno_id        uuid NOT NULL REFERENCES site.alunos(id) ON DELETE CASCADE,
  curso_slug      text NOT NULL CHECK (char_length(curso_slug) <= 120),
  licao_id        text NOT NULL CHECK (char_length(licao_id) <= 120),
  status          text NOT NULL DEFAULT 'concluida' CHECK (status IN ('em_andamento','concluida')),
  nota_quiz       integer CHECK (nota_quiz IS NULL OR (nota_quiz >= 0 AND nota_quiz <= 100)),
  tentativas_quiz integer NOT NULL DEFAULT 0 CHECK (tentativas_quiz >= 0),
  atualizado_em   timestamptz NOT NULL DEFAULT now(),
  concluido_em    timestamptz,
  PRIMARY KEY (aluno_id, curso_slug, licao_id)
);

CREATE INDEX IF NOT EXISTS progresso_aulas_aluno_curso_idx
  ON site.progresso_aulas (aluno_id, curso_slug);

CREATE TABLE IF NOT EXISTS site.certificados (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_verificacao  text NOT NULL UNIQUE CHECK (char_length(codigo_verificacao) <= 64),
  aluno_id            uuid NOT NULL REFERENCES site.alunos(id) ON DELETE CASCADE,
  curso_slug          text NOT NULL CHECK (char_length(curso_slug) <= 120),
  nome_exibido        text NOT NULL CHECK (char_length(nome_exibido) <= 200),
  nota_final          integer NOT NULL CHECK (nota_final >= 0 AND nota_final <= 100),
  carga_horaria_min   integer NOT NULL DEFAULT 0 CHECK (carga_horaria_min >= 0),
  emitido_em          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (aluno_id, curso_slug)
);

CREATE TABLE IF NOT EXISTS site.avaliacoes_projeto (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id          uuid NOT NULL REFERENCES site.alunos(id) ON DELETE CASCADE,
  curso_slug        text NOT NULL CHECK (char_length(curso_slug) <= 120),
  repo_url          text NOT NULL CHECK (char_length(repo_url) <= 400),
  deploy_url        text NOT NULL DEFAULT '' CHECK (char_length(deploy_url) <= 400),
  nota_exame        integer NOT NULL CHECK (nota_exame >= 0 AND nota_exame <= 100),
  resumo_tecnico    text NOT NULL DEFAULT '' CHECK (char_length(resumo_tecnico) <= 2000),
  status            text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aprovado','revisao_solicitada')),
  parecer_avaliador text NOT NULL DEFAULT '' CHECK (char_length(parecer_avaliador) <= 2000),
  avaliado_em       timestamptz,
  criado_em         timestamptz NOT NULL DEFAULT now(),
  atualizado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (aluno_id, curso_slug)
);

CREATE TABLE IF NOT EXISTS site.aluno_eventos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id   uuid NOT NULL REFERENCES site.alunos(id) ON DELETE CASCADE,
  tipo       text NOT NULL CHECK (tipo IN ('login_google','acesso_portal','aula_iniciada','aula_concluida','perfil_atualizado','projeto_enviado')),
  curso_slug text NOT NULL DEFAULT 'construa-seu-marketplace' CHECK (char_length(curso_slug) <= 120),
  licao_id   text NOT NULL DEFAULT '' CHECK (char_length(licao_id) <= 120),
  meta       jsonb NOT NULL DEFAULT '{}'::jsonb,
  criado_em  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aluno_eventos_aluno_criado_idx
  ON site.aluno_eventos (aluno_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS aluno_eventos_tipo_criado_idx
  ON site.aluno_eventos (tipo, criado_em DESC);

-- RPC para validação pública de certificado (não expõe e-mail nem dados pessoais sensíveis)
CREATE OR REPLACE FUNCTION site.validar_certificado(p_codigo text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = site, pg_temp AS $$
  SELECT jsonb_build_object(
    'valido', true,
    'codigo', c.codigo_verificacao,
    'nome_exibido', c.nome_exibido,
    'curso_slug', c.curso_slug,
    'nota_final', c.nota_final,
    'carga_horaria_min', c.carga_horaria_min,
    'emitido_em', c.emitido_em
  )
  FROM site.certificados c
  WHERE upper(trim(c.codigo_verificacao)) = upper(trim(p_codigo))
  LIMIT 1;
$$;

-- RPC agregada para o Superadmin (/admin -> aba Alunos & Trilhas)
-- Correlaciona alunos com site.leads por e-mail para visão de funil completo.
CREATE OR REPLACE FUNCTION site.painel_alunos() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = site, pg_temp AS $$
  WITH resumo_prog AS (
    SELECT
      p.aluno_id,
      count(*) FILTER (WHERE p.status = 'concluida') AS aulas_concluidas,
      round(avg(p.nota_quiz))::int AS media_quiz,
      max(p.atualizado_em) AS ultima_atividade_em,
      (
        SELECT p2.licao_id
        FROM site.progresso_aulas p2
        WHERE p2.aluno_id = p.aluno_id
        ORDER BY p2.atualizado_em DESC
        LIMIT 1
      ) AS ultima_licao_id,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'curso_slug', p.curso_slug,
            'licao_id', p.licao_id,
            'status', p.status,
            'nota_quiz', p.nota_quiz,
            'atualizado_em', p.atualizado_em,
            'concluido_em', p.concluido_em
          )
          ORDER BY p.atualizado_em DESC
        ),
        '[]'::jsonb
      ) AS progresso
    FROM site.progresso_aulas p
    GROUP BY p.aluno_id
  ),
  lead_match AS (
    SELECT DISTINCT ON (a.id)
      a.id AS aluno_id,
      l.id AS lead_id,
      l.status AS lead_status,
      l.canal AS lead_canal,
      l.utm_campaign AS lead_campanha,
      l.criado_em AS lead_criado_em
    FROM site.alunos a
    JOIN site.leads l
      ON lower(trim(l.contato)) = lower(trim(a.email))
      OR lower(l.contato) LIKE '%' || lower(trim(a.email)) || '%'
    ORDER BY a.id, l.criado_em DESC
  )
  SELECT jsonb_build_object(
    'kpis', jsonb_build_object(
      'total_alunos', (SELECT count(*) FROM site.alunos),
      'ativos_7d', (SELECT count(*) FROM site.alunos WHERE ultimo_acesso_em >= now() - interval '7 days'),
      'total_concluidas', (SELECT count(*) FROM site.progresso_aulas WHERE status = 'concluida'),
      'certificados_emitidos', (SELECT count(*) FROM site.certificados),
      'alunos_com_lead', (SELECT count(*) FROM lead_match),
      'avaliacoes_pendentes', (SELECT count(*) FROM site.avaliacoes_projeto WHERE status = 'pendente')
    ),
    'alunos', coalesce((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'email', a.email,
          'nome', a.nome,
          'nome_certificado', a.nome_certificado,
          'avatar_url', a.avatar_url,
          'headline', a.headline,
          'bio', a.bio,
          'github_url', a.github_url,
          'linkedin_url', a.linkedin_url,
          'objetivo', a.objetivo,
          'criado_em', a.criado_em,
          'ultimo_acesso_em', a.ultimo_acesso_em,
          'aulas_concluidas', coalesce(rp.aulas_concluidas, 0),
          'media_quiz', rp.media_quiz,
          'ultima_licao_id', rp.ultima_licao_id,
          'ultima_atividade_em', rp.ultima_atividade_em,
          'progresso', coalesce(rp.progresso, '[]'::jsonb),
          'matriculas', coalesce((
            SELECT jsonb_agg(jsonb_build_object('curso_slug', m.curso_slug, 'status', m.status, 'iniciado_em', m.iniciado_em))
            FROM site.matriculas m WHERE m.aluno_id = a.id
          ), '[]'::jsonb),
          'certificados', coalesce((
            SELECT jsonb_agg(jsonb_build_object('codigo', c.codigo_verificacao, 'curso_slug', c.curso_slug, 'nota_final', c.nota_final, 'emitido_em', c.emitido_em))
            FROM site.certificados c WHERE c.aluno_id = a.id
          ), '[]'::jsonb),
          'avaliacao', (
            SELECT jsonb_build_object(
              'curso_slug', av.curso_slug,
              'repo_url', av.repo_url,
              'deploy_url', av.deploy_url,
              'nota_exame', av.nota_exame,
              'resumo_tecnico', av.resumo_tecnico,
              'status', av.status,
              'parecer_avaliador', av.parecer_avaliador,
              'atualizado_em', av.atualizado_em,
              'avaliado_em', av.avaliado_em
            )
            FROM site.avaliacoes_projeto av
            WHERE av.aluno_id = a.id
            ORDER BY av.atualizado_em DESC
            LIMIT 1
          ),
          'lead', CASE WHEN lm.lead_id IS NOT NULL THEN jsonb_build_object(
            'id', lm.lead_id,
            'status', lm.lead_status,
            'canal', lm.lead_canal,
            'campanha', lm.lead_campanha,
            'criado_em', lm.lead_criado_em
          ) ELSE NULL END
        )
        ORDER BY a.ultimo_acesso_em DESC
      )
      FROM site.alunos a
      LEFT JOIN resumo_prog rp ON rp.aluno_id = a.id
      LEFT JOIN lead_match lm ON lm.aluno_id = a.id
    ), '[]'::jsonb)
  );
$$;

GRANT SELECT, INSERT, UPDATE ON site.alunos, site.matriculas, site.progresso_aulas, site.certificados, site.avaliacoes_projeto TO site_student_api;
GRANT SELECT, INSERT ON site.aluno_eventos TO site_student_api;
GRANT SELECT ON site.alunos, site.matriculas, site.progresso_aulas, site.certificados, site.avaliacoes_projeto, site.aluno_eventos TO site_admin;
GRANT UPDATE (status, parecer_avaliador, avaliado_em, atualizado_em) ON site.avaliacoes_projeto TO site_admin;
GRANT INSERT, UPDATE ON site.certificados TO site_admin;
GRANT UPDATE (status, concluido_em) ON site.matriculas TO site_admin;
REVOKE EXECUTE ON FUNCTION site.validar_certificado(text), site.painel_alunos() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION site.validar_certificado(text) TO site_student_api, site_admin;
GRANT EXECUTE ON FUNCTION site.painel_alunos() TO site_admin;
