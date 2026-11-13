import type { Course } from "./courses";
import type { PainelAlunosAdmin } from "./oracle-students";

const DAY_MS = 24 * 60 * 60 * 1000;

export type RegraTelemetria = {
  diasFrequenciaJanela: number;
  diasJanelaRecorrencia: number;
  minDiasAtivosFrequencia: number;
  diasRiscoMax: number;
  diasOnboardingAbandono: number;
};

export const REGRAS_TELEMETRIA_PADRAO: RegraTelemetria = {
  diasFrequenciaJanela: 7,
  diasJanelaRecorrencia: 14,
  minDiasAtivosFrequencia: 2,
  diasRiscoMax: 21,
  diasOnboardingAbandono: 7,
};

export type EstagioAluno =
  | "mantendo_frequencia"
  | "ativo_esporadico"
  | "em_risco"
  | "abandonou"
  | "nao_iniciou_recente"
  | "abandonou_onboarding"
  | "em_avaliacao"
  | "concluido";

export const ESTAGIO_META: Record<
  EstagioAluno,
  {
    label: string;
    tone: "green" | "blue" | "amber" | "red" | "purple" | "muted";
    descricaoRegra: string;
  }
> = {
  mantendo_frequencia: {
    label: "Mantendo frequência",
    tone: "green",
    descricaoRegra: "Ativo nos últimos 7 dias com recorrência (>= 2 dias ativos/14d ou >= 2 aulas/7d).",
  },
  ativo_esporadico: {
    label: "Ativo recente",
    tone: "blue",
    descricaoRegra: "Estudou nos últimos 7 dias em sessão única; ainda consolidando frequência.",
  },
  em_risco: {
    label: "Em risco (8–21d)",
    tone: "amber",
    descricaoRegra: "Começou o curso, mas está há 8 a 21 dias sem atividade.",
  },
  abandonou: {
    label: "Abandonou o curso",
    tone: "red",
    descricaoRegra: "Começou o curso, não concluiu e está há mais de 21 dias sem atividade.",
  },
  nao_iniciou_recente: {
    label: "Recém-chegado (0 aulas)",
    tone: "muted",
    descricaoRegra: "Fez login nos últimos 7 dias, mas ainda não iniciou a 1ª aula.",
  },
  abandonou_onboarding: {
    label: "Só login · Nunca iniciou",
    tone: "red",
    descricaoRegra: "Fez login há mais de 7 dias e permanece com 0 aulas iniciadas.",
  },
  em_avaliacao: {
    label: "Em avaliação / Revisão",
    tone: "purple",
    descricaoRegra: "Enviou o Projeto Final para correção ou aguarda revisão.",
  },
  concluido: {
    label: "Concluído / Certificado",
    tone: "green",
    descricaoRegra: "Curso concluído com todas as aulas ou certificado emitido.",
  },
};

export type LicaoCurriculoRef = {
  index: number;
  id: string;
  slug: string;
  shortCode: string;
  title: string;
  moduleNumber: number;
  moduleTitle: string;
  durationMin: number;
};

export type LicaoStatusAluno = LicaoCurriculoRef & {
  status: "concluida" | "em_andamento" | "nao_iniciada";
  nota_quiz: number | null;
  atualizado_em: string | null;
  concluido_em: string | null;
};

export type AlunoTelemetria = PainelAlunosAdmin["alunos"][number] & {
  estagio: EstagioAluno;
  estagio_label: string;
  estagio_motivo: string;
  começou_nao_terminou: boolean;
  nunca_iniciou: boolean;
  total_logins: number;
  total_acessos: number;
  eventos_recentes: Array<{ tipo: string; licao_id?: string; criado_em: string }>;
  dias_desde_cadastro: number;
  dias_sem_acesso: number;
  dias_sem_atividade: number;
  dias_ativos_total: number;
  dias_ativos_14d: number;
  aulas_7d: number;
  aulas_30d: number;
  ritmo_semanal: number;
  aulas_concluidas_norm: number;
  aulas_em_andamento: number;
  total_aulas: number;
  percentual_conclusao: number;
  tempo_estudado_min: number;
  completude_perfil: number;
  parou_em_licao: LicaoCurriculoRef | null;
  ultima_licao_concluida: {
    shortCode: string;
    title: string;
    concluido_em: string | null;
  } | null;
  licoes_mapa: LicaoStatusAluno[];
};

export type TelemetriaAlunosAdmin = {
  gerado_em: string;
  total_aulas_curso: number;
  eventos_disponiveis: boolean;
  regras_aplicadas: RegraTelemetria;
  resumo: {
    total_alunos: number;
    novos_7d: number;
    novos_30d: number;
    logins_24h: number;
    ativos_7d: number;
    ativos_30d: number;
    com_aulas_iniciadas: number;
    comecaram_nao_terminaram: number;
    nunca_iniciaram: number;
    mantendo_frequencia: number;
    ativos_esporadicos: number;
    em_risco: number;
    abandonaram_trilha: number;
    abandonaram_onboarding: number;
    abandonaram_total: number;
    em_avaliacao: number;
    concluidos: number;
    taxa_ativacao_pct: number;
    taxa_conclusao_pct: number;
    taxa_abandono_pct: number;
    media_conclusao_pct: number;
    media_quiz_global: number | null;
    total_concluidas: number;
    certificados_emitidos: number;
    avaliacoes_pendentes: number;
    alunos_com_lead: number;
  };
  funil_jornada: Array<{
    etapa: string;
    alunos: number;
    pct_total: number;
  }>;
  serie_diaria_30d: Array<{
    dia: string;
    rotulo: string;
    novos_logins: number;
    acessos_ativos: number;
    aulas_concluidas: number;
  }>;
  gargalo_aulas: Array<{
    id: string;
    slug: string;
    shortCode: string;
    title: string;
    moduleNumber: number;
    concluidas: number;
    em_andamento: number;
    parados_aqui: number;
    abandono_aqui: number;
    media_quiz: number | null;
  }>;
  objetivos: Array<{
    objetivo: string;
    count: number;
  }>;
  alunos: AlunoTelemetria[];
};

function shortCodeFromLesson(id: string, title: string, moduleNumber: number): string {
  const m = title.match(/^([FA]\d{2})\b/);
  if (m) return m[1];
  if (moduleNumber === 7 || id === "licao-12") return "Final";
  return `M${moduleNumber}`;
}

export function buildCurriculoFromCourse(course: Course): {
  lessons: LicaoCurriculoRef[];
  byKey: Map<string, LicaoCurriculoRef>;
} {
  const lessons: LicaoCurriculoRef[] = [];
  const byKey = new Map<string, LicaoCurriculoRef>();

  let index = 0;
  for (const mod of course.modules) {
    for (const l of mod.lessons) {
      const ref: LicaoCurriculoRef = {
        index,
        id: l.id,
        slug: l.slug,
        shortCode: shortCodeFromLesson(l.id, l.title, mod.number),
        title: l.title,
        moduleNumber: mod.number,
        moduleTitle: mod.title,
        durationMin: l.durationMin,
      };
      lessons.push(ref);
      byKey.set(l.id, ref);
      byKey.set(l.slug, ref);
      index += 1;
    }
  }

  return { lessons, byKey };
}

function dayKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  // Normaliza para BRT (-03:00) para alinhar dias ativos ao fuso do negócio
  const brt = new Date(ms - 3 * 60 * 60 * 1000);
  return brt.toISOString().slice(0, 10);
}

function parseMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function calcCompletude(a: PainelAlunosAdmin["alunos"][number]): number {
  const campos = [
    a.nome_certificado || a.nome,
    a.headline,
    a.bio,
    a.objetivo,
    a.github_url || a.linkedin_url,
  ];
  const filled = campos.filter((c) => typeof c === "string" && c.trim().length > 1).length;
  return Math.round((filled / campos.length) * 100);
}

function normalizeRegras(partial?: Partial<RegraTelemetria>): RegraTelemetria {
  const clamp = (n: number | undefined, fallback: number, min: number, max: number) => {
    const num = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
    return Math.min(max, Math.max(min, num));
  };
  const diasFrequenciaJanela = clamp(partial?.diasFrequenciaJanela, REGRAS_TELEMETRIA_PADRAO.diasFrequenciaJanela, 1, 60);
  const diasJanelaRecorrencia = clamp(
    partial?.diasJanelaRecorrencia,
    REGRAS_TELEMETRIA_PADRAO.diasJanelaRecorrencia,
    diasFrequenciaJanela,
    90,
  );
  const minDiasAtivosFrequencia = clamp(
    partial?.minDiasAtivosFrequencia,
    REGRAS_TELEMETRIA_PADRAO.minDiasAtivosFrequencia,
    1,
    30,
  );
  const diasRiscoMax = clamp(
    partial?.diasRiscoMax,
    REGRAS_TELEMETRIA_PADRAO.diasRiscoMax,
    diasFrequenciaJanela + 1,
    180,
  );
  const diasOnboardingAbandono = clamp(
    partial?.diasOnboardingAbandono,
    REGRAS_TELEMETRIA_PADRAO.diasOnboardingAbandono,
    1,
    90,
  );
  return {
    diasFrequenciaJanela,
    diasJanelaRecorrencia,
    minDiasAtivosFrequencia,
    diasRiscoMax,
    diasOnboardingAbandono,
  };
}

export function calcularTelemetriaAlunos(
  painel: PainelAlunosAdmin,
  course: Course,
  nowMs: number = Date.now(),
  regrasPartial?: Partial<RegraTelemetria>,
): TelemetriaAlunosAdmin {
  const regras = normalizeRegras(regrasPartial);
  const { lessons, byKey } = buildCurriculoFromCourse(course);
  const totalAulas = lessons.length;
  const cutoff24h = nowMs - DAY_MS;
  const cutoffFreq = nowMs - regras.diasFrequenciaJanela * DAY_MS;
  const cutoffRecorrencia = nowMs - regras.diasJanelaRecorrencia * DAY_MS;
  const cutoff30d = nowMs - 30 * DAY_MS;

  // Mapa diário dos últimos 30 dias (YYYY-MM-DD em BRT)
  const dailyMap = new Map<
    string,
    { novos_logins: number; acessos_set: Set<string>; aulas_concluidas: number }
  >();
  const orderedDays: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const key = dayKey(new Date(nowMs - i * DAY_MS).toISOString())!;
    orderedDays.push(key);
    dailyMap.set(key, { novos_logins: 0, acessos_set: new Set(), aulas_concluidas: 0 });
  }

  // Agregadores por aula
  const lessonStats = lessons.map((l) => ({
    ...l,
    concluidas: 0,
    em_andamento: 0,
    parados_aqui: 0,
    abandono_aqui: 0,
    quiz_scores: [] as number[],
  }));
  const objetivosMap = new Map<string, number>();

  const alunosEnriquecidos: AlunoTelemetria[] = painel.alunos.map((aluno) => {
    const criadoMs = parseMs(aluno.criado_em) ?? nowMs;
    const ultimoAcessoMs = parseMs(aluno.ultimo_acesso_em) ?? criadoMs;

    // Normaliza progresso por ID canônico da lição
    const progById = new Map<
      string,
      {
        status: "concluida" | "em_andamento";
        nota_quiz: number | null;
        atualizado_em: string | null;
        concluido_em: string | null;
        ms: number;
      }
    >();

    const activeDays = new Set<string>();
    const activeDays14d = new Set<string>();

    const addDay = (iso: string | null | undefined, trackAccessStudentId?: string) => {
      const k = dayKey(iso);
      const ms = parseMs(iso);
      if (!k || ms === null) return;
      activeDays.add(k);
      if (ms >= cutoffRecorrencia && ms <= nowMs + DAY_MS) activeDays14d.add(k);
      if (trackAccessStudentId && dailyMap.has(k)) {
        dailyMap.get(k)!.acessos_set.add(trackAccessStudentId);
      }
    };

    addDay(aluno.criado_em, aluno.id);
    addDay(aluno.ultimo_acesso_em, aluno.id);

    const createdKey = dayKey(aluno.criado_em);
    if (createdKey && dailyMap.has(createdKey)) {
      dailyMap.get(createdKey)!.novos_logins += 1;
    }

    let maxActivityMs = Math.max(criadoMs, ultimoAcessoMs);

    const rawEventos = aluno.eventos ?? [];
    let loginEventsCount = 0;
    let portalEventsCount = 0;
    for (const ev of rawEventos) {
      addDay(ev.criado_em, aluno.id);
      if (ev.tipo === "login_google") loginEventsCount += 1;
      if (ev.tipo === "acesso_portal") portalEventsCount += 1;
      const evMs = parseMs(ev.criado_em);
      if (evMs && evMs > maxActivityMs) maxActivityMs = evMs;
    }
    const eventosRecentes = [...rawEventos]
      .sort((a, b) => (parseMs(b.criado_em) ?? 0) - (parseMs(a.criado_em) ?? 0))
      .slice(0, 25)
      .map((ev) => ({
        tipo: ev.tipo,
        licao_id: ev.licao_id || undefined,
        criado_em: ev.criado_em,
      }));
    const totalLogins = Math.max(1, loginEventsCount);
    const fallbackAcessos = ultimoAcessoMs - criadoMs > 15 * 60 * 1000 ? 2 : 1;
    const totalAcessos =
      loginEventsCount + portalEventsCount > 0
        ? loginEventsCount + portalEventsCount
        : fallbackAcessos;

    for (const p of aluno.progresso ?? []) {
      const ref = byKey.get(p.licao_id);
      const normStatus = p.status === "concluida" ? "concluida" : "em_andamento";
      const actIso = p.concluido_em || p.atualizado_em;
      const actMs = parseMs(actIso) ?? ultimoAcessoMs;
      if (actMs > maxActivityMs) maxActivityMs = actMs;

      addDay(p.atualizado_em, aluno.id);
      addDay(p.concluido_em, aluno.id);

      if (normStatus === "concluida") {
        const doneKey = dayKey(p.concluido_em || p.atualizado_em);
        if (doneKey && dailyMap.has(doneKey)) {
          dailyMap.get(doneKey)!.aulas_concluidas += 1;
        }
      }

      if (!ref) continue;
      const prev = progById.get(ref.id);
      // Nunca rebaixa "concluida" se houver registro duplicado por slug e id
      if (
        !prev ||
        (prev.status !== "concluida" && normStatus === "concluida") ||
        (prev.status === normStatus && actMs > prev.ms)
      ) {
        progById.set(ref.id, {
          status: normStatus,
          nota_quiz: typeof p.nota_quiz === "number" ? p.nota_quiz : prev?.nota_quiz ?? null,
          atualizado_em: p.atualizado_em ?? null,
          concluido_em: p.concluido_em ?? null,
          ms: actMs,
        });
      }
    }

    if (aluno.avaliacao?.atualizado_em) {
      const avMs = parseMs(aluno.avaliacao.atualizado_em);
      if (avMs && avMs > maxActivityMs) maxActivityMs = avMs;
      addDay(aluno.avaliacao.atualizado_em, aluno.id);
    }

    let aulasConcluidasNorm = 0;
    let aulasEmAndamento = 0;
    let aulas7d = 0;
    let aulas30d = 0;
    let tempoEstudadoMin = 0;
    let ultimaConcluida: {
      shortCode: string;
      title: string;
      concluido_em: string | null;
      ms: number;
    } | null = null;

    const licoesMapa: LicaoStatusAluno[] = [];
    for (const ref of lessons) {
      const p = progById.get(ref.id);
      const status = p?.status ?? "nao_iniciada";
      if (status === "concluida") {
        aulasConcluidasNorm += 1;
        tempoEstudadoMin += ref.durationMin;
        lessonStats[ref.index].concluidas += 1;
        const doneMs = parseMs(p?.concluido_em || p?.atualizado_em) ?? 0;
        if (doneMs >= cutoffFreq) aulas7d += 1;
        if (doneMs >= cutoff30d) aulas30d += 1;
        if (!ultimaConcluida || doneMs > ultimaConcluida.ms) {
          ultimaConcluida = {
            shortCode: ref.shortCode,
            title: ref.title,
            concluido_em: p?.concluido_em || p?.atualizado_em || null,
            ms: doneMs,
          };
        }
      } else if (status === "em_andamento") {
        aulasEmAndamento += 1;
        lessonStats[ref.index].em_andamento += 1;
      }

      if (typeof p?.nota_quiz === "number") {
        lessonStats[ref.index].quiz_scores.push(p.nota_quiz);
      }

      licoesMapa.push({
        ...ref,
        status,
        nota_quiz: p?.nota_quiz ?? null,
        atualizado_em: p?.atualizado_em ?? null,
        concluido_em: p?.concluido_em ?? null,
      });
    }

    const diasDesdeCadastro = Math.max(0, Math.floor((nowMs - criadoMs) / DAY_MS));
    const diasSemAcesso = Math.max(0, Math.floor((nowMs - ultimoAcessoMs) / DAY_MS));
    const diasSemAtividade = Math.max(0, Math.floor((nowMs - maxActivityMs) / DAY_MS));
    const percentualConclusao =
      totalAulas > 0 ? Math.min(100, Math.round((aulasConcluidasNorm / totalAulas) * 100)) : 0;
    const ritmoSemanal = Number(
      (aulasConcluidasNorm / Math.max(1, Math.max(1, diasDesdeCadastro) / 7)).toFixed(1),
    );

    const hasCert = (aluno.certificados?.length ?? 0) > 0;
    const hasPendingOrReviewEval =
      aluno.avaliacao?.status === "pendente" || aluno.avaliacao?.status === "revisao_solicitada";
    const isCompleted = hasCert || (aulasConcluidasNorm >= totalAulas && !hasPendingOrReviewEval);

    let estagio: EstagioAluno;
    let estagioMotivo: string;

    if (isCompleted) {
      estagio = "concluido";
      estagioMotivo = hasCert
        ? `Certificado emitido (${aluno.certificados[0]?.codigo ?? ""})`
        : "100% das aulas concluídas";
    } else if (hasPendingOrReviewEval) {
      estagio = "em_avaliacao";
      estagioMotivo =
        aluno.avaliacao?.status === "pendente"
          ? "Projeto final aguardando correção do instrutor"
          : "Revisão solicitada no projeto final";
    } else if (aulasConcluidasNorm === 0 && aulasEmAndamento === 0) {
      if (diasSemAcesso > regras.diasOnboardingAbandono) {
        estagio = "abandonou_onboarding";
        estagioMotivo = `Fez login há ${diasSemAcesso} dias (> ${regras.diasOnboardingAbandono}d) e nunca iniciou nenhuma aula`;
      } else {
        estagio = "nao_iniciou_recente";
        estagioMotivo =
          diasSemAcesso === 0
            ? "Fez login hoje, ainda sem aulas registradas"
            : `Fez login há ${diasSemAcesso}d, ainda não concluiu a 1ª aula`;
      }
    } else if (diasSemAtividade <= regras.diasFrequenciaJanela) {
      if (
        activeDays14d.size >= regras.minDiasAtivosFrequencia ||
        aulas7d >= regras.minDiasAtivosFrequencia
      ) {
        estagio = "mantendo_frequencia";
        estagioMotivo = `Ativo há ${diasSemAtividade}d · ${activeDays14d.size} dias ativos/${regras.diasJanelaRecorrencia}d · ${aulas7d} aulas/${regras.diasFrequenciaJanela}d`;
      } else {
        estagio = "ativo_esporadico";
        estagioMotivo = `Atividade recente (há ${diasSemAtividade}d) abaixo da recorrência mínima (${regras.minDiasAtivosFrequencia})`;
      }
    } else if (diasSemAtividade <= regras.diasRiscoMax) {
      estagio = "em_risco";
      estagioMotivo = `Sem estudar há ${diasSemAtividade} dias (regra ${regras.diasFrequenciaJanela + 1}–${regras.diasRiscoMax}d · ${aulasConcluidasNorm}/${totalAulas} aulas)`;
    } else {
      estagio = "abandonou";
      estagioMotivo = `Sem atividade há ${diasSemAtividade} dias (> ${regras.diasRiscoMax}d · parou com ${aulasConcluidasNorm}/${totalAulas} aulas)`;
    }

    // Aula fronteira (onde parou ou próxima a cursar)
    const parouEmLicao = isCompleted
      ? null
      : (licoesMapa.find((l) => l.status === "em_andamento") ??
        licoesMapa.find((l) => l.status !== "concluida") ??
        null);

    if (parouEmLicao && (aulasConcluidasNorm > 0 || aulasEmAndamento > 0) && !isCompleted) {
      lessonStats[parouEmLicao.index].parados_aqui += 1;
      if (estagio === "abandonou" || estagio === "em_risco") {
        lessonStats[parouEmLicao.index].abandono_aqui += 1;
      }
    }

    const objLabel = aluno.objetivo?.trim() || "Não informado";
    objetivosMap.set(objLabel, (objetivosMap.get(objLabel) ?? 0) + 1);

    const startedAny = aulasConcluidasNorm > 0 || aulasEmAndamento > 0;
    const comecouNaoTerminou = startedAny && !isCompleted;

    return {
      ...aluno,
      aulas_concluidas: Math.max(aluno.aulas_concluidas, aulasConcluidasNorm),
      estagio,
      estagio_label: ESTAGIO_META[estagio].label,
      estagio_motivo: estagioMotivo,
      começou_nao_terminou: comecouNaoTerminou,
      nunca_iniciou: !startedAny,
      total_logins: totalLogins,
      total_acessos: totalAcessos,
      eventos_recentes: eventosRecentes,
      dias_desde_cadastro: diasDesdeCadastro,
      dias_sem_acesso: diasSemAcesso,
      dias_sem_atividade: diasSemAtividade,
      dias_ativos_total: activeDays.size,
      dias_ativos_14d: activeDays14d.size,
      aulas_7d: aulas7d,
      aulas_30d: aulas30d,
      ritmo_semanal: ritmoSemanal,
      aulas_concluidas_norm: aulasConcluidasNorm,
      aulas_em_andamento: aulasEmAndamento,
      total_aulas: totalAulas,
      percentual_conclusao: percentualConclusao,
      tempo_estudado_min: tempoEstudadoMin,
      completude_perfil: calcCompletude(aluno),
      parou_em_licao: parouEmLicao
        ? {
            index: parouEmLicao.index,
            id: parouEmLicao.id,
            slug: parouEmLicao.slug,
            shortCode: parouEmLicao.shortCode,
            title: parouEmLicao.title,
            moduleNumber: parouEmLicao.moduleNumber,
            moduleTitle: parouEmLicao.moduleTitle,
            durationMin: parouEmLicao.durationMin,
          }
        : null,
      ultima_licao_concluida: ultimaConcluida
        ? {
            shortCode: ultimaConcluida.shortCode,
            title: ultimaConcluida.title,
            concluido_em: ultimaConcluida.concluido_em,
          }
        : null,
      licoes_mapa: licoesMapa,
    };
  });

  const totalAlunos = alunosEnriquecidos.length;
  const novos7d = alunosEnriquecidos.filter((a) => (parseMs(a.criado_em) ?? 0) >= cutoffFreq).length;
  const novos30d = alunosEnriquecidos.filter((a) => (parseMs(a.criado_em) ?? 0) >= cutoff30d).length;
  const logins24h = alunosEnriquecidos.filter((a) => (parseMs(a.ultimo_acesso_em) ?? 0) >= cutoff24h).length;
  const ativos7d = alunosEnriquecidos.filter(
    (a) =>
      a.dias_sem_acesso <= regras.diasFrequenciaJanela ||
      a.dias_sem_atividade <= regras.diasFrequenciaJanela,
  ).length;
  const ativos30d = alunosEnriquecidos.filter((a) => a.dias_sem_acesso <= 30 || a.dias_sem_atividade <= 30).length;

  const comAulasIniciadas = alunosEnriquecidos.filter((a) => !a.nunca_iniciou).length;
  const comecaramNaoTerminaram = alunosEnriquecidos.filter((a) => a.começou_nao_terminou).length;
  const nuncaIniciaram = alunosEnriquecidos.filter((a) => a.nunca_iniciou).length;

  const countStage = (s: EstagioAluno) => alunosEnriquecidos.filter((a) => a.estagio === s).length;
  const mantendoFrequencia = countStage("mantendo_frequencia");
  const ativosEsporadicos = countStage("ativo_esporadico");
  const emRisco = countStage("em_risco");
  const abandonaramTrilha = countStage("abandonou");
  const abandonaramOnboarding = countStage("abandonou_onboarding");
  const abandonaramTotal = abandonaramTrilha + abandonaramOnboarding;
  const emAvaliacao = countStage("em_avaliacao");
  const concluidos = countStage("concluido");

  const pct = (part: number) => (totalAlunos > 0 ? Math.round((part / totalAlunos) * 100) : 0);

  const quizValues = alunosEnriquecidos
    .map((a) => a.media_quiz)
    .filter((n): n is number => typeof n === "number");
  const mediaQuizGlobal =
    quizValues.length > 0
      ? Math.round(quizValues.reduce((s, n) => s + n, 0) / quizValues.length)
      : null;

  const mediaConclusaoPct =
    totalAlunos > 0
      ? Math.round(
          alunosEnriquecidos.reduce((s, a) => s + a.percentual_conclusao, 0) / totalAlunos,
        )
      : 0;

  const funilEtapas = [
    { etapa: "Login Google (cadastrados)", alunos: totalAlunos },
    { etapa: "Iniciaram o curso (1+ aula)", alunos: comAulasIniciadas },
    {
      etapa: "Concluíram Módulo 0 (6+ aulas)",
      alunos: alunosEnriquecidos.filter((a) => a.aulas_concluidas_norm >= 6).length,
    },
    {
      etapa: "Metade do curso (9+ aulas)",
      alunos: alunosEnriquecidos.filter((a) => a.aulas_concluidas_norm >= 9).length,
    },
    {
      etapa: "Projeto Final / Exame",
      alunos: alunosEnriquecidos.filter(
        (a) => a.avaliacao !== null || a.aulas_concluidas_norm >= totalAulas,
      ).length,
    },
    {
      etapa: "Certificado emitido",
      alunos: alunosEnriquecidos.filter((a) => (a.certificados?.length ?? 0) > 0).length,
    },
  ].map((e) => ({ ...e, pct_total: pct(e.alunos) }));

  const serieDiaria30d = orderedDays.map((dia) => {
    const bucket = dailyMap.get(dia)!;
    return {
      dia,
      rotulo: `${dia.slice(8, 10)}/${dia.slice(5, 7)}`,
      novos_logins: bucket.novos_logins,
      acessos_ativos: bucket.acessos_set.size,
      aulas_concluidas: bucket.aulas_concluidas,
    };
  });

  const gargaloAulas = lessonStats.map((ls) => ({
    id: ls.id,
    slug: ls.slug,
    shortCode: ls.shortCode,
    title: ls.title,
    moduleNumber: ls.moduleNumber,
    concluidas: ls.concluidas,
    em_andamento: ls.em_andamento,
    parados_aqui: ls.parados_aqui,
    abandono_aqui: ls.abandono_aqui,
    media_quiz:
      ls.quiz_scores.length > 0
        ? Math.round(ls.quiz_scores.reduce((s, n) => s + n, 0) / ls.quiz_scores.length)
        : null,
  }));

  const objetivos = Array.from(objetivosMap.entries())
    .map(([objetivo, count]) => ({ objetivo, count }))
    .sort((a, b) => b.count - a.count);

  return {
    gerado_em: new Date(nowMs).toISOString(),
    total_aulas_curso: totalAulas,
    eventos_disponiveis: Boolean(painel.eventos_disponiveis),
    regras_aplicadas: regras,
    resumo: {
      total_alunos: totalAlunos,
      novos_7d: novos7d,
      novos_30d: novos30d,
      logins_24h: logins24h,
      ativos_7d: ativos7d,
      ativos_30d: ativos30d,
      com_aulas_iniciadas: comAulasIniciadas,
      comecaram_nao_terminaram: comecaramNaoTerminaram,
      nunca_iniciaram: nuncaIniciaram,
      mantendo_frequencia: mantendoFrequencia,
      ativos_esporadicos: ativosEsporadicos,
      em_risco: emRisco,
      abandonaram_trilha: abandonaramTrilha,
      abandonaram_onboarding: abandonaramOnboarding,
      abandonaram_total: abandonaramTotal,
      em_avaliacao: emAvaliacao,
      concluidos,
      taxa_ativacao_pct: pct(comAulasIniciadas),
      taxa_conclusao_pct: pct(concluidos),
      taxa_abandono_pct: pct(abandonaramTotal),
      media_conclusao_pct: mediaConclusaoPct,
      media_quiz_global: mediaQuizGlobal,
      total_concluidas: painel.kpis.total_concluidas,
      certificados_emitidos: painel.kpis.certificados_emitidos,
      avaliacoes_pendentes: painel.kpis.avaliacoes_pendentes,
      alunos_com_lead: painel.kpis.alunos_com_lead,
    },
    funil_jornada: funilEtapas,
    serie_diaria_30d: serieDiaria30d,
    gargalo_aulas: gargaloAulas,
    objetivos,
    alunos: alunosEnriquecidos,
  };
}
