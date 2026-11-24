import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { monthlyCost, pickPlan } from "../app/lib/whatsapp-cost.ts";

const close = (a, b) => assert.ok(Math.abs(a - b) < 0.005, `${a} != ${b}`);

describe("Calculadora de custo WhatsApp Cloud API", () => {
  it("reproduz o exemplo do PRICING.md (Start, 2.000 utilidade + 300 marketing)", () => {
    const r = monthlyCost({ utility: 2000, authentication: 0, marketing: 300, service: 500, numbers: 1, users: 3 });
    assert.equal(r.plan.id, "start");
    close(r.metaTotal, 166.51);
    close(r.total, 245.51);
  });

  it("cobra apenas o excedente das 1.000 conversas de serviço grátis por número", () => {
    const r = monthlyCost({ utility: 0, authentication: 0, marketing: 0, service: 3000, numbers: 2, users: 1 });
    assert.equal(r.billableService, 1000);
    close(r.metaTotal, 35);
  });

  it("escolhe o menor plano que cobre números e usuários e devolve null acima do Business", () => {
    assert.equal(pickPlan(1, 4).id, "pro");
    assert.equal(pickPlan(3, 10).id, "business");
    assert.equal(pickPlan(6, 1), null);
    const r = monthlyCost({ utility: 10, authentication: 0, marketing: 0, service: 0, numbers: 6, users: 1 });
    assert.equal(r.total, null);
  });

  it("ignora valores negativos ou inválidos", () => {
    const r = monthlyCost({ utility: -5, authentication: NaN, marketing: 0, service: -1, numbers: 0, users: 0 });
    assert.equal(r.metaTotal, 0);
    assert.equal(r.plan.id, "start");
  });
});
