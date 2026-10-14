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

GRANT INSERT (nome, area, prazo, servicos, contato, negocio, dor, idioma, canal)
  ON site.leads TO site_writer;

GRANT SELECT ON site.leads, site.lead_eventos TO site_admin;
GRANT UPDATE (status) ON site.leads TO site_admin;
-- importação do Notion (feita com token de admin)
GRANT INSERT (nome, status, area, prazo, servicos, contato, negocio, dor, idioma, canal, criado_em, notion_id)
  ON site.leads TO site_admin;
