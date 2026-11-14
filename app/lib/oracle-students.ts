import { createHash } from "node:crypto";
import { assinarToken, oracleConfigurado, type Papel } from "./oracle-leads";
import type { AdmissionRecord } from "./course-admission";

/* ------------------------------------------------------------------ */
/*  Persistência de Alunos, Trilha e Certificados (Oracle PostgREST)   */
/* ------------------------------------------------------------------ */

export type Aluno = {
  id: string;
  google_sub: string;
  email: string;
  nome: string;
  nome_certificado: string;
  avatar_url: string;
  headline: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  objetivo: string;
  criado_em: string;
  atualizado_em: string;
  ultimo_acesso_em: string;
};

export type Matricula = {
  id: string;
  aluno_id: string;
  curso_slug: string;
  status: "ativo" | "concluido" | "pausado";
  iniciado_em: string;
  concluido_em: string | null;
};

export type ProgressoAula = {
  aluno_id: string;
  curso_slug: string;
  licao_id: string;
  status: "em_andamento" | "concluida";
  nota_quiz: number | null;
  tentativas_quiz: number;
  atualizado_em: string;
  concluido_em: string | null;
};

export type Certificado = {
  id: string;
  codigo_verificacao: string;
  aluno_id: string;
  curso_slug: string;
  nome_exibido: string;
  nota_final: number;
  carga_horaria_min: number;
  emitido_em: string;
};

export type AvaliacaoProjeto = {
  id?: string;
  aluno_id?: string;
  curso_slug: string;
  repo_url: string;
  deploy_url: string;
  nota_exame: number;
  resumo_tecnico: string;
  status: "pendente" | "aprovado" | "revisao_solicitada";
  parecer_avaliador: string;
  atualizado_em: string;
  avaliado_em: string | null;
};

export type CertificadoPublico = {
  valido: boolean;
  codigo: string;
  nome_exibido: string;
  curso_slug: string;
  nota_final: number;
  carga_horaria_min: number;
  emitido_em: string;
};

export type EventoAlunoAdmin = {
  aluno_id: string;
  tipo: string;
  curso_slug?: string;
  licao_id?: string;
  meta?: Record<string, unknown>;
  criado_em: string;
};

export type PainelAlunosAdmin = {
  eventos_disponiveis?: boolean;
  kpis: {
    total_alunos: number;
    ativos_7d: number;
    total_concluidas: number;
    certificados_emitidos: number;
    alunos_com_lead: number;
    avaliacoes_pendentes: number;
  };
  alunos: Array<{
    id: string;
    email: string;
    nome: string;
    nome_certificado: string;
    avatar_url: string;
    headline: string;
    bio: string;
    github_url: string;
    linkedin_url: string;
    objetivo: string;
    criado_em: string;
    ultimo_acesso_em: string;
    aulas_concluidas: number;
    media_quiz: number | null;
    ultima_licao_id: string | null;
    ultima_atividade_em: string | null;
    progresso: Array<{
      curso_slug: string;
      licao_id: string;
      status: string;
      nota_quiz: number | null;
      atualizado_em: string;
      concluido_em: string | null;
    }>;
    matriculas: Array<{
      curso_slug: string;
      status: string;
      iniciado_em: string;
    }>;
    certificados: Array<{
      codigo: string;
      curso_slug: string;
      nota_final: number;
      emitido_em: string;
    }>;
    avaliacao: AvaliacaoProjeto | null;
    lead: {
      id: string;
      status: string;
      canal: string;
      campanha: string | null;
      criado_em: string;
    } | null;
    eventos?: EventoAlunoAdmin[];
    admissao?: AdmissionRecord | null;
  }>;
};

export { oracleConfigurado };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function callOracle(
  papel: Papel,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const base = (process.env.ORACLE_LEADS_URL ?? "").replace(/\/+$/, "");
  const segredo = process.env.ORACLE_LEADS_JWT_SECRET ?? "";
  if (!base || !segredo) throw new Error("oracle não configurado");

  const r = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${assinarToken(papel, segredo)}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!r.ok) {
    throw new Error(`oracle ${r.status}: ${(await r.text()).slice(0, 300)}`);
  }
  return r;
}

export function calcularCompletudePerfil(a: Aluno): number {
  const campos = [
    a.nome_certificado || a.nome,
    a.headline,
    a.bio,
    a.objetivo,
    a.github_url || a.linkedin_url,
  ];
  const preenchidos = campos.filter((c) => typeof c === "string" && c.trim().length > 1).length;
  return Math.round((preenchidos / campos.length) * 100);
}

export async function registrarEventoAluno(input: {
  alunoId: string;
  tipo: "login_google" | "acesso_portal" | "aula_iniciada" | "aula_concluida" | "perfil_atualizado" | "projeto_enviado";
  cursoSlug?: string;
  licaoId?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  if (!UUID_RE.test(input.alunoId)) return;
  try {
    await callOracle("site_student_api", "/aluno_eventos", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        aluno_id: input.alunoId,
        tipo: input.tipo,
        curso_slug: (input.cursoSlug ?? "construa-seu-marketplace").slice(0, 120),
        licao_id: (input.licaoId ?? "").slice(0, 120),
        meta: input.meta ?? {},
      }),
    });
  } catch {
    // Tabela opcional: não bloqueia o fluxo se o SQL ainda não foi aplicado no Oracle
  }
}

export async function touchAlunoAcesso(aluno: Aluno): Promise<void> {
  const prevMs = Date.parse(aluno.ultimo_acesso_em || "");
  const elapsedMs = Number.isFinite(prevMs) ? Date.now() - prevMs : Infinity;
  if (elapsedMs < 15 * 60 * 1000) return;

  const now = new Date().toISOString();
  try {
    await Promise.all([
      callOracle("site_student_api", `/alunos?id=eq.${aluno.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ ultimo_acesso_em: now }),
      }),
      registrarEventoAluno({ alunoId: aluno.id, tipo: "acesso_portal" }),
    ]);
  } catch {
    /* non-blocking */
  }
}

export async function upsertAlunoGoogle(input: {
  googleSub: string;
  email: string;
  nome: string;
  avatarUrl: string;
}): Promise<Aluno> {
  const now = new Date().toISOString();
  const r = await callOracle("site_student_api", "/alunos?on_conflict=email", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      google_sub: input.googleSub.slice(0, 120),
      email: input.email.toLowerCase().trim().slice(0, 320),
      nome: input.nome.trim().slice(0, 200) || "Aluno",
      avatar_url: input.avatarUrl.slice(0, 1000),
      ultimo_acesso_em: now,
      atualizado_em: now,
    }),
  });
  const rows = (await r.json()) as Aluno[];
  const aluno = rows[0];
  if (!aluno) throw new Error("falha ao salvar aluno");

  // Garante matrícula automática no curso principal na primeira entrada
  await Promise.all([
    callOracle("site_student_api", "/matriculas?on_conflict=aluno_id,curso_slug", {
      method: "POST",
      headers: {
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        aluno_id: aluno.id,
        curso_slug: "construa-seu-marketplace",
        status: "ativo",
      }),
    }),
    registrarEventoAluno({ alunoId: aluno.id, tipo: "login_google" }),
  ]);

  return aluno;
}

export async function getAlunoById(alunoId: string): Promise<Aluno | null> {
  if (!UUID_RE.test(alunoId)) return null;
  const r = await callOracle(
    "site_student_api",
    `/alunos?id=eq.${alunoId}&select=*&limit=1`,
  );
  const rows = (await r.json()) as Aluno[];
  return rows[0] ?? null;
}

export async function updateAlunoPerfil(
  alunoId: string,
  dados: Partial<{
    nome_certificado: string;
    headline: string;
    bio: string;
    github_url: string;
    linkedin_url: string;
    objetivo: string;
  }>,
): Promise<Aluno> {
  if (!UUID_RE.test(alunoId)) throw new Error("aluno inválido");
  const cleanUrl = (u: string | undefined, max = 300) => {
    const t = (u ?? "").trim().slice(0, max);
    if (!t) return "";
    if (!/^https?:\/\//i.test(t)) return `https://${t}`.slice(0, max);
    return t;
  };
  const body = {
    nome_certificado: (dados.nome_certificado ?? "").trim().slice(0, 200),
    headline: (dados.headline ?? "").trim().slice(0, 160),
    bio: (dados.bio ?? "").trim().slice(0, 1000),
    github_url: cleanUrl(dados.github_url),
    linkedin_url: cleanUrl(dados.linkedin_url),
    objetivo: (dados.objetivo ?? "").trim().slice(0, 160),
    atualizado_em: new Date().toISOString(),
  };

  const r = await callOracle("site_student_api", `/alunos?id=eq.${alunoId}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  const rows = (await r.json()) as Aluno[];
  if (!rows[0]) throw new Error("aluno não encontrado");
  await registrarEventoAluno({ alunoId, tipo: "perfil_atualizado" });
  return rows[0];
}

export async function getTrilhaAluno(alunoId: string): Promise<{
  matriculas: Matricula[];
  progresso: ProgressoAula[];
  certificados: Certificado[];
  avaliacoes: AvaliacaoProjeto[];
}> {
  if (!UUID_RE.test(alunoId)) {
    return { matriculas: [], progresso: [], certificados: [], avaliacoes: [] };
  }
  const [mRes, pRes, cRes, aRes] = await Promise.all([
    callOracle("site_student_api", `/matriculas?aluno_id=eq.${alunoId}&select=*`),
    callOracle(
      "site_student_api",
      `/progresso_aulas?aluno_id=eq.${alunoId}&select=*&order=atualizado_em.desc`,
    ),
    callOracle(
      "site_student_api",
      `/certificados?aluno_id=eq.${alunoId}&select=*&order=emitido_em.desc`,
    ),
    callOracle(
      "site_student_api",
      `/avaliacoes_projeto?aluno_id=eq.${alunoId}&select=*&order=atualizado_em.desc`,
    ),
  ]);
  const [matriculas, progresso, certificados, avaliacoes] = (await Promise.all([
    mRes.json(),
    pRes.json(),
    cRes.json(),
    aRes.json(),
  ])) as [Matricula[], ProgressoAula[], Certificado[], AvaliacaoProjeto[]];

  return { matriculas, progresso, certificados, avaliacoes };
}

export async function salvarProgressoAula(input: {
  alunoId: string;
  cursoSlug: string;
  licaoId: string;
  status: "em_andamento" | "concluida";
  notaQuiz?: number | null;
  ifNotExists?: boolean;
}): Promise<void> {
  if (!UUID_RE.test(input.alunoId)) throw new Error("aluno inválido");
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    aluno_id: input.alunoId,
    curso_slug: input.cursoSlug.slice(0, 120),
    licao_id: input.licaoId.slice(0, 120),
    status: input.status,
    atualizado_em: now,
    concluido_em: input.status === "concluida" ? now : null,
  };
  if (typeof input.notaQuiz === "number" && Number.isFinite(input.notaQuiz)) {
    payload.nota_quiz = Math.max(0, Math.min(100, Math.round(input.notaQuiz)));
    payload.tentativas_quiz = 1;
  }

  const prefer = input.ifNotExists
    ? "resolution=ignore-duplicates,return=minimal"
    : "resolution=merge-duplicates,return=minimal";

  await callOracle(
    "site_student_api",
    "/progresso_aulas?on_conflict=aluno_id,curso_slug,licao_id",
    {
      method: "POST",
      headers: { Prefer: prefer },
      body: JSON.stringify(payload),
    },
  );

  // Garante matrícula, atualiza ultimo_acesso_em e registra evento em paralelo
  await Promise.all([
    callOracle("site_student_api", "/matriculas?on_conflict=aluno_id,curso_slug", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({
        aluno_id: input.alunoId,
        curso_slug: input.cursoSlug.slice(0, 120),
        status: "ativo",
      }),
    }),
    callOracle("site_student_api", `/alunos?id=eq.${input.alunoId}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ultimo_acesso_em: now }),
    }),
    registrarEventoAluno({
      alunoId: input.alunoId,
      tipo: input.status === "concluida" ? "aula_concluida" : "aula_iniciada",
      cursoSlug: input.cursoSlug,
      licaoId: input.licaoId,
    }),
  ]);
}

export async function sincronizarProgressoLocal(input: {
  alunoId: string;
  cursoSlug: string;
  licaoIds: string[];
}): Promise<void> {
  if (!UUID_RE.test(input.alunoId) || input.licaoIds.length === 0) return;
  const now = new Date().toISOString();
  const uniqueIds = Array.from(
    new Set(input.licaoIds.map((s) => s.trim()).filter((s) => s.length > 0 && s.length <= 120)),
  ).slice(0, 60);
  if (uniqueIds.length === 0) return;

  const rows = uniqueIds.map((licaoId) => ({
    aluno_id: input.alunoId,
    curso_slug: input.cursoSlug.slice(0, 120),
    licao_id: licaoId,
    status: "concluida",
    atualizado_em: now,
    concluido_em: now,
  }));

  await callOracle(
    "site_student_api",
    "/progresso_aulas?on_conflict=aluno_id,curso_slug,licao_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    },
  );
}

export function gerarCodigoCertificado(nome: string, notaFinal: number): string {
  const clean = nome
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const hashNum = Array.from(`${nome}:${notaFinal}:2026`).reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000,
    7,
  );
  return `MDV-MKT-2026-${clean}-${String(hashNum).padStart(4, "0")}`;
}

export async function emitirCertificado(input: {
  alunoId: string;
  cursoSlug: string;
  nomeExibido: string;
  notaFinal: number;
  cargaHorariaMin: number;
}): Promise<Certificado> {
  if (!UUID_RE.test(input.alunoId)) throw new Error("aluno inválido");
  const nome = input.nomeExibido.trim().slice(0, 200);
  if (nome.length < 3) throw new Error("nome inválido");
  const nota = Math.max(80, Math.min(100, Math.round(input.notaFinal)));
  const codigo = gerarCodigoCertificado(nome, nota);

  const r = await callOracle(
    "site_student_api",
    "/certificados?on_conflict=aluno_id,curso_slug",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        codigo_verificacao: codigo,
        aluno_id: input.alunoId,
        curso_slug: input.cursoSlug.slice(0, 120),
        nome_exibido: nome,
        nota_final: nota,
        carga_horaria_min: Math.max(0, Math.round(input.cargaHorariaMin)),
      }),
    },
  );
  const rows = (await r.json()) as Certificado[];
  const cert = rows[0];
  if (!cert) throw new Error("falha ao emitir certificado");

  await callOracle(
    "site_student_api",
    `/matriculas?aluno_id=eq.${input.alunoId}&curso_slug=eq.${encodeURIComponent(input.cursoSlug)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "concluido",
        concluido_em: new Date().toISOString(),
      }),
    },
  );

  return cert;
}

export async function validarCertificadoPublico(
  codigo: string,
): Promise<CertificadoPublico | null> {
  const clean = codigo.trim().slice(0, 64);
  if (!clean) return null;
  const r = await callOracle("site_student_api", "/rpc/validar_certificado", {
    method: "POST",
    body: JSON.stringify({ p_codigo: clean }),
  });
  const data = (await r.json()) as CertificadoPublico | null;
  return data && data.valido ? data : null;
}

export async function submeterProjetoParaAvaliacao(input: {
  alunoId: string;
  cursoSlug: string;
  nomeExibido: string;
  repoUrl: string;
  deployUrl?: string;
  resumoTecnico: string;
  notaExame: number;
}): Promise<AvaliacaoProjeto> {
  if (!UUID_RE.test(input.alunoId)) throw new Error("aluno inválido");
  const now = new Date().toISOString();

  if (input.nomeExibido.trim().length >= 3) {
    await callOracle("site_student_api", `/alunos?id=eq.${input.alunoId}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        nome_certificado: input.nomeExibido.trim().slice(0, 200),
        atualizado_em: now,
      }),
    });
  }

  const r = await callOracle(
    "site_student_api",
    "/avaliacoes_projeto?on_conflict=aluno_id,curso_slug",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        aluno_id: input.alunoId,
        curso_slug: input.cursoSlug.slice(0, 120),
        repo_url: input.repoUrl.trim().slice(0, 400),
        deploy_url: (input.deployUrl ?? "").trim().slice(0, 400),
        nota_exame: Math.max(0, Math.min(100, Math.round(input.notaExame))),
        resumo_tecnico: input.resumoTecnico.trim().slice(0, 2000),
        status: "pendente",
        atualizado_em: now,
      }),
    },
  );
  const rows = (await r.json()) as AvaliacaoProjeto[];
  if (!rows[0]) throw new Error("falha ao registrar entrega");
  await registrarEventoAluno({
    alunoId: input.alunoId,
    tipo: "projeto_enviado",
    cursoSlug: input.cursoSlug,
    meta: { nota_exame: input.notaExame },
  });
  return rows[0];
}

export async function avaliarProjetoAdmin(input: {
  alunoId: string;
  cursoSlug: string;
  decisao: "aprovado" | "revisao_solicitada";
  parecer: string;
  cargaHorariaMin: number;
}): Promise<{ avaliacao: AvaliacaoProjeto; certificado: Certificado | null }> {
  if (!UUID_RE.test(input.alunoId)) throw new Error("aluno inválido");
  const now = new Date().toISOString();

  const avRes = await callOracle(
    "site_admin",
    `/avaliacoes_projeto?aluno_id=eq.${input.alunoId}&curso_slug=eq.${encodeURIComponent(input.cursoSlug)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: input.decisao,
        parecer_avaliador: input.parecer.trim().slice(0, 2000),
        avaliado_em: now,
        atualizado_em: now,
      }),
    },
  );
  const avRows = (await avRes.json()) as AvaliacaoProjeto[];
  const avaliacao = avRows[0];
  if (!avaliacao) throw new Error("avaliação não encontrada");

  if (input.decisao !== "aprovado") {
    return { avaliacao, certificado: null };
  }

  const alunoRes = await callOracle(
    "site_admin",
    `/alunos?id=eq.${input.alunoId}&select=nome,nome_certificado&limit=1`,
  );
  const [aluno] = (await alunoRes.json()) as Array<{ nome: string; nome_certificado: string }>;
  const nomeExibido = (aluno?.nome_certificado || aluno?.nome || "Aluno").trim();
  const notaFinal = Math.max(80, Math.min(100, avaliacao.nota_exame));
  const codigo = gerarCodigoCertificado(nomeExibido, notaFinal);

  const certRes = await callOracle(
    "site_admin",
    "/certificados?on_conflict=aluno_id,curso_slug",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        codigo_verificacao: codigo,
        aluno_id: input.alunoId,
        curso_slug: input.cursoSlug.slice(0, 120),
        nome_exibido: nomeExibido.slice(0, 200),
        nota_final: notaFinal,
        carga_horaria_min: Math.max(0, Math.round(input.cargaHorariaMin)),
      }),
    },
  );
  const [certificado] = (await certRes.json()) as Certificado[];

  await callOracle(
    "site_admin",
    `/matriculas?aluno_id=eq.${input.alunoId}&curso_slug=eq.${encodeURIComponent(input.cursoSlug)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "concluido", concluido_em: now }),
    },
  );

  return { avaliacao, certificado: certificado ?? null };
}

export async function getWorkspaceAluno(
  alunoId: string,
): Promise<{ dados: Record<string, unknown>; atualizado_em: string } | null> {
  if (!UUID_RE.test(alunoId)) return null;
  try {
    const r = await callOracle(
      "site_student_api",
      `/aluno_workspace?aluno_id=eq.${alunoId}&select=dados,atualizado_em&limit=1`,
    );
    const rows = (await r.json()) as Array<{
      dados: Record<string, unknown>;
      atualizado_em: string;
    }>;
    return rows[0] ?? null;
  } catch {
    // Tabela opcional: retorna null se SQL ainda não foi aplicado no Oracle
    return null;
  }
}

export async function upsertWorkspaceAluno(
  alunoId: string,
  dados: Record<string, unknown>,
): Promise<boolean> {
  if (!UUID_RE.test(alunoId)) return false;
  const serialized = JSON.stringify(dados);
  if (serialized.length > 250_000) {
    throw new Error("workspace payload too large");
  }
  try {
    await callOracle(
      "site_student_api",
      "/aluno_workspace?on_conflict=aluno_id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          aluno_id: alunoId,
          dados,
          atualizado_em: new Date().toISOString(),
        }),
      },
    );
    return true;
  } catch {
    // Tabela opcional: mantém funcionamento local sem erro 502
    return false;
  }
}

export async function listarPainelAlunosAdmin(): Promise<PainelAlunosAdmin> {
  const [r, evRes, wsRes] = await Promise.all([
    callOracle("site_admin", "/rpc/painel_alunos", {
      method: "POST",
      body: JSON.stringify({}),
    }),
    callOracle(
      "site_admin",
      "/aluno_eventos?select=aluno_id,tipo,curso_slug,licao_id,meta,criado_em&order=criado_em.desc&limit=2000",
    ).catch(() => null),
    callOracle(
      "site_admin",
      "/aluno_workspace?select=aluno_id,dados&limit=2000",
    ).catch(() => null),
  ]);

  const painel = (await r.json()) as PainelAlunosAdmin;

  const byAlunoAdmissao = new Map<string, AdmissionRecord>();
  if (wsRes) {
    try {
      const wsRows = (await wsRes.json()) as Array<{
        aluno_id: string;
        dados?: Record<string, unknown>;
      }>;
      for (const row of wsRows) {
        if (row.aluno_id && row.dados && typeof row.dados.admissionRecord === "object") {
          byAlunoAdmissao.set(row.aluno_id, row.dados.admissionRecord as AdmissionRecord);
        }
      }
    } catch {
      /* ignore optional workspace parse */
    }
  }

  if (!evRes) {
    return {
      ...painel,
      eventos_disponiveis: false,
      alunos: painel.alunos.map((a) => ({
        ...a,
        admissao: byAlunoAdmissao.get(a.id) ?? null,
      })),
    };
  }

  let evRows: EventoAlunoAdmin[] = [];
  try {
    evRows = (await evRes.json()) as EventoAlunoAdmin[];
  } catch {
    return {
      ...painel,
      eventos_disponiveis: false,
      alunos: painel.alunos.map((a) => ({
        ...a,
        admissao: byAlunoAdmissao.get(a.id) ?? null,
      })),
    };
  }

  const byAluno = new Map<string, EventoAlunoAdmin[]>();
  for (const ev of evRows) {
    if (!ev.aluno_id) continue;
    const list = byAluno.get(ev.aluno_id) ?? [];
    list.push(ev);
    byAluno.set(ev.aluno_id, list);

    // Fallback: se aluno_workspace ainda não existir na VM, extrai admissionRecord de aluno_eventos.meta
    const metaRec = ev.meta?.admissionRecord as AdmissionRecord | undefined;
    if (metaRec && typeof metaRec === "object" && "questionnaire" in metaRec) {
      const prev = byAlunoAdmissao.get(ev.aluno_id);
      if (!prev || (metaRec.emailActivated && !prev.emailActivated)) {
        byAlunoAdmissao.set(ev.aluno_id, metaRec);
      }
    }
    if (ev.meta?.evento === "email_ativado_com_sucesso") {
      const prev = byAlunoAdmissao.get(ev.aluno_id);
      if (prev && !prev.emailActivated) {
        byAlunoAdmissao.set(ev.aluno_id, {
          ...prev,
          emailActivated: true,
          activatedAt: ev.criado_em,
        });
      }
    }
  }

  return {
    ...painel,
    eventos_disponiveis: true,
    alunos: painel.alunos.map((a) => ({
      ...a,
      eventos: byAluno.get(a.id) ?? [],
      admissao: a.admissao ?? byAlunoAdmissao.get(a.id) ?? null,
    })),
  };
}

export async function upsertAlunoAdmissao(input: {
  email: string;
  nome: string;
  headline: string;
  bio: string;
  objetivo: string;
  admissao?: AdmissionRecord;
}): Promise<Aluno> {
  const cleanEmail = input.email.toLowerCase().trim().slice(0, 320);
  const emailSub = `email:${createHash("sha256").update(cleanEmail).digest("hex").slice(0, 32)}`;
  const now = new Date().toISOString();

  // Verifica se já existe aluno com esse email para preservar google_sub/avatar_url se houver
  const existRes = await callOracle(
    "site_student_api",
    `/alunos?email=eq.${encodeURIComponent(cleanEmail)}&select=*&limit=1`,
  ).catch(() => null);
  const existingRows = existRes ? ((await existRes.json()) as Aluno[]) : [];
  const existing = existingRows[0];

  const r = await callOracle("site_student_api", "/alunos?on_conflict=email", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      google_sub: existing?.google_sub || emailSub,
      email: cleanEmail,
      nome: input.nome.trim().slice(0, 200) || existing?.nome || "Aluno",
      nome_certificado: input.nome.trim().slice(0, 200),
      avatar_url: existing?.avatar_url || "",
      headline: input.headline.slice(0, 160),
      bio: input.bio.slice(0, 1000),
      objetivo: input.objetivo.slice(0, 160),
      ...(input.admissao ? { admissao: input.admissao } : {}),
      ultimo_acesso_em: now,
      atualizado_em: now,
    }),
  });
  const rows = (await r.json()) as Aluno[];
  const aluno = rows[0];
  if (!aluno) throw new Error("falha ao registrar admissão do aluno");

  await callOracle("site_student_api", "/matriculas?on_conflict=aluno_id,curso_slug", {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({
      aluno_id: aluno.id,
      curso_slug: "construa-seu-marketplace",
      status: "ativo",
    }),
  }).catch(() => null);

  return aluno;
}

