import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { computeTco, partnerUnit, pickPlatformPlan, TCO_PRESETS } from "../app/lib/whatsapp-tco.ts";
import { parseFlag } from "../app/lib/flags.ts";
import { analyzeTemplate } from "../app/lib/template-analyzer.ts";

describe("Analisador de template utilidade x marketing", () => {
  it("aviso transacional neutro fica com risco baixo", () => {
    const r = analyzeTemplate("Olá, Maria! Seu pedido #1042 saiu para entrega. Previsão: 25 min.");
    assert.equal(r.risk, "baixo");
    assert.equal(r.triggers.length, 0);
  });

  it("detecta desconto, urgência e chamada de compra mesmo com acento e maiúscula", () => {
    const r = analyzeTemplate("ÚLTIMA CHANCE!!! Aproveite 20% de desconto com o cupom VOLTA 🔥");
    assert.equal(r.risk, "alto");
    const kinds = new Set(r.triggers.map((t) => t.kind));
    for (const k of ["urgencia", "venda", "promo", "pontuacao", "emoji"]) assert.ok(kinds.has(k), k);
    assert.ok(r.triggers.some((t) => t.match === "ÚLTIMA CHANCE"), "match preserva o texto original");
  });

  it("a sugestão remove gatilhos e não deixa exclamação", () => {
    const r = analyzeTemplate("Seu boleto vence amanhã! Aproveite e confira nossas novidades!!");
    assert.ok(!/aproveite/i.test(r.suggestion));
    assert.ok(!r.suggestion.includes("!"));
    assert.ok(r.suggestion.startsWith("Seu boleto vence amanhã"));
  });
});

const close = (a, b) => assert.ok(Math.abs(a - b) < 0.005, `${a} != ${b}`);
const base = { respostasNoCelular: 0, mensagensServicoAPI: 0, mensagensUtilidade: 0, mensagensMarketing: 0, quantidadeNumeros: 1, atendentes: 1, modo: "empresa" };

describe("TCO WhatsApp pós-01/10/2026", () => {
  it("respostas no celular (Coexistência) nunca custam nada, em qualquer volume", () => {
    const r = computeTco({ ...base, respostasNoCelular: 1_000_000 });
    assert.equal(r.meta.app, 0);
    assert.equal(r.meta.total, 0);
    assert.equal(r.atolTotal, 79);
  });

  it("franquia de 1.000 mensagens de serviço é por número", () => {
    const r1 = computeTco({ ...base, mensagensServicoAPI: 1500 });
    assert.equal(r1.billableService, 500);
    close(r1.meta.service, 17.5);
    const r2 = computeTco({ ...base, mensagensServicoAPI: 1500, quantidadeNumeros: 2 });
    assert.equal(r2.billableService, 0);
    assert.equal(r2.meta.service, 0);
  });

  it("utilidade e marketing são cobrados por mensagem, sem franquia", () => {
    const r = computeTco({ ...base, mensagensUtilidade: 2000, mensagensMarketing: 300 });
    close(r.meta.utility, 70);
    close(r.meta.marketing, 96.51);
    close(r.meta.total, 166.51);
    close(r.atolTotal, 245.51);
  });

  it("modo empresa escolhe o plano real do checkout e pede proposta acima de 5 números", () => {
    assert.equal(pickPlatformPlan(1, 3).id, "starter");
    assert.equal(pickPlatformPlan(1, 4).id, "growth");
    assert.equal(pickPlatformPlan(2, 8).priceBRL, 149);
    assert.equal(pickPlatformPlan(5, 25).id, "scale");
    const r = computeTco({ ...base, quantidadeNumeros: 6 });
    assert.equal(r.atolTotal, null);
    assert.equal(r.economiaAnualVsCRM, null);
  });

  it("parceiro: R$ 59/número sem mínimo e R$ 49 a partir do 21º", () => {
    assert.equal(partnerUnit(1), 59);
    assert.equal(partnerUnit(20), 59);
    assert.equal(partnerUnit(21), 49);
    const r = computeTco({ ...base, modo: "software-house", quantidadeNumeros: 1 });
    assert.equal(r.platform.monthly, 59);
    const r30 = computeTco({ ...base, modo: "software-house", quantidadeNumeros: 30 });
    assert.equal(r30.platform.monthly, 30 * 49);
  });

  it("economia anual vs CRM de referência = (249×n − plataforma) × 12, tarifa Meta igual dos dois lados", () => {
    const r = computeTco({ ...base, mensagensUtilidade: 1000 });
    close(r.economiaAnualVsCRM, (249 - 79) * 12);
  });

  it("entradas inválidas viram zero e números ficam entre 1 e 50", () => {
    const r = computeTco({ ...base, mensagensUtilidade: -10, mensagensMarketing: NaN, quantidadeNumeros: 999 });
    assert.equal(r.meta.total, 0);
    assert.equal(r.numeros, 50);
    assert.equal(computeTco({ ...base, quantidadeNumeros: 0 }).numeros, 1);
  });

  it("todos os presets produzem total calculável", () => {
    for (const p of TCO_PRESETS) {
      const r = computeTco(p.input);
      assert.ok(r.atolTotal !== null && r.atolTotal > 0, p.id);
    }
  });
});

describe("Feature flag de pré-aprovação Meta", () => {
  it("só a string 'true' liga o modo self-serve", () => {
    assert.equal(parseFlag("true"), true);
    for (const v of [undefined, "", "false", "1", "TRUE", " true"]) assert.equal(parseFlag(v), false);
  });
});
