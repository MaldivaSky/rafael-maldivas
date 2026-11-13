import test from "node:test";
import assert from "node:assert/strict";
import { COURSES } from "../app/lib/courses.ts";
import { calcularTelemetriaAlunos } from "../app/lib/course-telemetry.ts";

const COURSE = COURSES["construa-seu-marketplace"];

const NOW = Date.UTC(2026, 10, 13, 18, 0, 0);
const DAY = 24 * 60 * 60 * 1000;
const isoDaysAgo = (d) => new Date(NOW - d * DAY).toISOString();

function makeAluno(id, overrides = {}) {
  return {
    id,
    email: `${id}@teste.com`,
    nome: `Aluno ${id}`,
    nome_certificado: "",
    avatar_url: "",
    headline: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    objetivo: "Construir meu próprio marketplace / SaaS",
    criado_em: isoDaysAgo(10),
    ultimo_acesso_em: isoDaysAgo(0),
    aulas_concluidas: 0,
    media_quiz: null,
    ultima_licao_id: null,
    ultima_atividade_em: null,
    progresso: [],
    matriculas: [{ curso_slug: "construa-seu-marketplace", status: "ativo", iniciado_em: isoDaysAgo(10) }],
    certificados: [],
    avaliacao: null,
    lead: null,
    ...overrides,
  };
}

test("classifica corretamente todos os estágios de ciclo de vida do aluno", () => {
  const painel = {
    kpis: {
      total_alunos: 7,
      ativos_7d: 3,
      total_concluidas: 10,
      certificados_emitidos: 1,
      alunos_com_lead: 1,
      avaliacoes_pendentes: 1,
    },
    alunos: [
      // 1. Mantendo frequência: 2+ dias ativos nos últimos 14d e atividade recente
      makeAluno("freq", {
        criado_em: isoDaysAgo(12),
        ultimo_acesso_em: isoDaysAgo(1),
        aulas_concluidas: 3,
        progresso: [
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f01-o-mapa", status: "concluida", nota_quiz: 90, atualizado_em: isoDaysAgo(5), concluido_em: isoDaysAgo(5) },
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f02-preparando-a-bancada", status: "concluida", nota_quiz: 85, atualizado_em: isoDaysAgo(2), concluido_em: isoDaysAgo(2) },
          { curso_slug: "construa-seu-marketplace", licao_id: "licao-f03", status: "concluida", nota_quiz: null, atualizado_em: isoDaysAgo(1), concluido_em: isoDaysAgo(1) },
        ],
      }),
      // 2. Ativo esporádico: 1 única atividade nos últimos 7d
      makeAluno("esp", {
        criado_em: isoDaysAgo(2),
        ultimo_acesso_em: isoDaysAgo(2),
        aulas_concluidas: 1,
        progresso: [
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f01-o-mapa", status: "concluida", nota_quiz: 80, atualizado_em: isoDaysAgo(2), concluido_em: isoDaysAgo(2) },
        ],
      }),
      // 3. Em risco (8-21d sem atividade)
      makeAluno("risco", {
        criado_em: isoDaysAgo(20),
        ultimo_acesso_em: isoDaysAgo(14),
        aulas_concluidas: 2,
        progresso: [
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f01-o-mapa", status: "concluida", nota_quiz: 75, atualizado_em: isoDaysAgo(15), concluido_em: isoDaysAgo(15) },
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f02-preparando-a-bancada", status: "concluida", nota_quiz: null, atualizado_em: isoDaysAgo(14), concluido_em: isoDaysAgo(14) },
        ],
      }),
      // 4. Abandonou (>21d sem atividade após iniciar)
      makeAluno("churn", {
        criado_em: isoDaysAgo(40),
        ultimo_acesso_em: isoDaysAgo(28),
        aulas_concluidas: 1,
        progresso: [
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f01-o-mapa", status: "concluida", nota_quiz: 70, atualizado_em: isoDaysAgo(28), concluido_em: isoDaysAgo(28) },
        ],
      }),
      // 5. Só login recente (0 aulas, <=7d)
      makeAluno("novo0", {
        criado_em: isoDaysAgo(2),
        ultimo_acesso_em: isoDaysAgo(2),
      }),
      // 6. Abandonou no onboarding (0 aulas, >7d)
      makeAluno("onbchurn", {
        criado_em: isoDaysAgo(15),
        ultimo_acesso_em: isoDaysAgo(12),
      }),
      // 7. Concluído com certificado
      makeAluno("cert", {
        criado_em: isoDaysAgo(35),
        ultimo_acesso_em: isoDaysAgo(3),
        certificados: [
          { codigo: "MDV-MKT-2026-CERT-1234", curso_slug: "construa-seu-marketplace", nota_final: 95, emitido_em: isoDaysAgo(3) },
        ],
      }),
    ],
  };

  const t = calcularTelemetriaAlunos(painel, COURSE, NOW);
  const byId = new Map(t.alunos.map((a) => [a.id, a]));

  assert.equal(byId.get("freq").estagio, "mantendo_frequencia");
  assert.equal(byId.get("freq").parou_em_licao.shortCode, "F04");
  assert.equal(byId.get("esp").estagio, "ativo_esporadico");
  assert.equal(byId.get("risco").estagio, "em_risco");
  assert.equal(byId.get("churn").estagio, "abandonou");
  assert.equal(byId.get("churn").parou_em_licao.shortCode, "F02");
  assert.equal(byId.get("novo0").estagio, "nao_iniciou_recente");
  assert.equal(byId.get("onbchurn").estagio, "abandonou_onboarding");
  assert.equal(byId.get("cert").estagio, "concluido");

  assert.equal(t.resumo.total_alunos, 7);
  assert.equal(t.resumo.mantendo_frequencia, 1);
  assert.equal(t.resumo.em_risco, 1);
  assert.equal(t.resumo.abandonaram_trilha, 1);
  assert.equal(t.resumo.abandonaram_onboarding, 1);
  assert.equal(t.resumo.abandonaram_total, 2);
  assert.equal(t.resumo.comecaram_nao_terminaram, 4); // freq, esp, risco, churn
  assert.equal(t.resumo.nunca_iniciaram, 3); // novo0, onbchurn, cert (0 aulas no array progresso)

  // Gargalo na aula F02 (esp + churn pararam aqui, e churn abandonou aqui)
  const f02 = t.gargalo_aulas.find((g) => g.shortCode === "F02");
  assert.ok(f02);
  assert.equal(f02.parados_aqui, 2);
  assert.equal(f02.abandono_aqui, 1);
});

test("normaliza slug e id da mesma aula sem rebaixar concluida para em_andamento", () => {
  const painel = {
    kpis: {
      total_alunos: 1,
      ativos_7d: 1,
      total_concluidas: 1,
      certificados_emitidos: 0,
      alunos_com_lead: 0,
      avaliacoes_pendentes: 0,
    },
    alunos: [
      makeAluno("dup", {
        progresso: [
          { curso_slug: "construa-seu-marketplace", licao_id: "licao-f01", status: "concluida", nota_quiz: 90, atualizado_em: isoDaysAgo(3), concluido_em: isoDaysAgo(3) },
          { curso_slug: "construa-seu-marketplace", licao_id: "modulo-0-f01-o-mapa", status: "em_andamento", nota_quiz: null, atualizado_em: isoDaysAgo(1), concluido_em: null },
        ],
      }),
    ],
  };

  const t = calcularTelemetriaAlunos(painel, COURSE, NOW);
  assert.equal(t.alunos[0].aulas_concluidas_norm, 1);
  assert.equal(t.alunos[0].licoes_mapa[0].status, "concluida");
});
