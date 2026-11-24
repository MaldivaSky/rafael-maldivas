/**
 * Custo total mensal do WhatsApp Business Platform no Brasil:
 * plano da plataforma (Atol Connect) + tarifas da Meta, pagas direto à Meta.
 * Fonte das tarifas e planos: docs/PRICING.md do Atol Connect (referência nov/2026).
 */

export const META_RATES_BRL = {
  marketing: 0.3217,
  utility: 0.035,
  authentication: 0.035,
  service: 0.035,
  freeServicePerNumber: 1000,
  updated: "2026-11",
} as const;

export const ATOL_PLANS = [
  { id: "start", name: "Start", priceBRL: 79, numbers: 1, users: 3 },
  { id: "pro", name: "Pro", priceBRL: 199, numbers: 2, users: 8 },
  { id: "business", name: "Business", priceBRL: 499, numbers: 5, users: 25 },
] as const;

export type CostInput = {
  utility: number;
  authentication: number;
  marketing: number;
  service: number;
  numbers: number;
  users: number;
};

export type CostResult = {
  plan: (typeof ATOL_PLANS)[number] | null;
  metaTotal: number;
  platformTotal: number | null;
  total: number | null;
  billableService: number;
};

const nonNegative = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function pickPlan(numbers: number, users: number) {
  return ATOL_PLANS.find((p) => p.numbers >= Math.max(1, numbers) && p.users >= Math.max(1, users)) ?? null;
}

export function monthlyCost(input: CostInput): CostResult {
  const numbers = Math.max(1, Math.floor(nonNegative(input.numbers)));
  const billableService = Math.max(
    0,
    nonNegative(input.service) - META_RATES_BRL.freeServicePerNumber * numbers,
  );
  const metaTotal =
    nonNegative(input.utility) * META_RATES_BRL.utility +
    nonNegative(input.authentication) * META_RATES_BRL.authentication +
    nonNegative(input.marketing) * META_RATES_BRL.marketing +
    billableService * META_RATES_BRL.service;
  const plan = pickPlan(numbers, nonNegative(input.users));
  const platformTotal = plan ? plan.priceBRL : null;
  return {
    plan,
    metaTotal,
    platformTotal,
    total: platformTotal === null ? null : platformTotal + metaTotal,
    billableService,
  };
}
