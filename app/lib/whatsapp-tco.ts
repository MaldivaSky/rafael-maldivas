/* ------------------------------------------------------------------ */
/*  TCO WhatsApp Business Platform — Brasil, regras desde 01/10/2026    */
/*                                                                     */
/*  Puro (sem imports relativos): testado direto em scripts/*.test.mjs  */
/*                                                                     */
/*  Regras da Meta (por mensagem ENTREGUE, BRL):                       */
/*   • Resposta humana no app WhatsApp Business (Coexistência): R$ 0   */
/*     — não passa pela API e não consome a franquia.                  */
/*   • Serviço via API: 1.000 grátis/mês POR NÚMERO; excedente 0,035.  */
/*   • Utilidade: 0,035 — cobrada mesmo com a janela de 24h aberta.    */
/*   • Autenticação: 0,035.  • Marketing: 0,3217.                      */
/*                                                                     */
/*  Plataforma (Atol Connect) — tem de bater com lib/catalog.ts do     */
/*  repo atol-connect, que é o que o checkout cobra:                   */
/*   • Start R$ 79 (1 número, 3 atendentes)                            */
/*   • Pro R$ 149 (2 números, 8 atendentes)                            */
/*   • Business R$ 499 (5 números, 25 atendentes)                      */
/*   • Parceiro (software house): R$ 59/número; R$ 49/número a partir  */
/*     do 21º número (faixa aplicada ao total), sem mínimo de números. */
/* ------------------------------------------------------------------ */

export const META_BRL = {
  appCoexistence: 0,
  serviceFreePerNumber: 1000,
  service: 0.035,
  utility: 0.035,
  authentication: 0.035,
  marketing: 0.3217,
  effectiveFrom: "2026-10-01",
} as const;

export const PLATFORM_PLANS = [
  { id: "starter", name: "Start", priceBRL: 79, numbers: 1, users: 3 },
  { id: "growth", name: "Pro", priceBRL: 149, numbers: 2, users: 8 },
  { id: "scale", name: "Business", priceBRL: 499, numbers: 5, users: 25 },
] as const;

export const PARTNER_PRICING = {
  perNumber: 59,
  volumePerNumber: 49,
  /** a partir deste número de linhas, todas saem a volumePerNumber */
  volumeFrom: 21,
  apiRequestsPerNumber: 100_000,
} as const;

/** Referência de mercado para "plataforma oficial + CRM" (faixa pública R$ 197–497/mês). Estimativa. */
export const CRM_REFERENCE_PER_NUMBER = 249;

export type TcoMode = "empresa" | "software-house";

export type TcoInput = {
  /** respostas digitadas no app do celular (Coexistência) — sempre R$ 0 */
  respostasNoCelular: number;
  /** mensagens de serviço enviadas pela API (inbox web, IA, bot) */
  mensagensServicoAPI: number;
  /** avisos de pedido, PIX, lembretes */
  mensagensUtilidade: number;
  /** códigos de verificação */
  mensagensAutenticacao?: number;
  /** campanhas e promoções */
  mensagensMarketing: number;
  quantidadeNumeros: number;
  /** atendentes simultâneos — só define o plano no modo empresa */
  atendentes?: number;
  modo: TcoMode;
};

export type TcoResult = {
  numeros: number;
  meta: { service: number; utility: number; authentication: number; marketing: number; app: number; total: number };
  billableService: number;
  freeServiceUsed: number;
  platform: { label: string; monthly: number | null; unit: number | null; planId: string | null };
  /** null quando nenhum plano self-serve cobre (ex.: empresa com 6+ números) */
  atolTotal: number | null;
  crmReferenceTotal: number;
  /** (CRM de referência − Atol) × 12; null se o Atol precisa de proposta */
  economiaAnualVsCRM: number | null;
};

const n0 = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) && x > 0 ? x : 0;
};
const cents = (v: number) => Math.round(v * 100) / 100;

export function pickPlatformPlan(numbers: number, users: number) {
  return (
    PLATFORM_PLANS.find((p) => p.numbers >= Math.max(1, numbers) && p.users >= Math.max(1, users)) ?? null
  );
}

export function partnerUnit(numbers: number): number {
  return numbers >= PARTNER_PRICING.volumeFrom ? PARTNER_PRICING.volumePerNumber : PARTNER_PRICING.perNumber;
}

export function computeTco(input: TcoInput): TcoResult {
  const numeros = Math.min(50, Math.max(1, Math.floor(n0(input.quantidadeNumeros)) || 1));
  const freeQuota = META_BRL.serviceFreePerNumber * numeros;
  const servico = Math.floor(n0(input.mensagensServicoAPI));
  const billableService = Math.max(0, servico - freeQuota);

  const meta = {
    app: 0, // Coexistência: nunca cobrado, independentemente do volume
    service: cents(billableService * META_BRL.service),
    utility: cents(Math.floor(n0(input.mensagensUtilidade)) * META_BRL.utility),
    authentication: cents(Math.floor(n0(input.mensagensAutenticacao)) * META_BRL.authentication),
    marketing: cents(Math.floor(n0(input.mensagensMarketing)) * META_BRL.marketing),
    total: 0,
  };
  meta.total = cents(meta.service + meta.utility + meta.authentication + meta.marketing);

  let platform: TcoResult["platform"];
  if (input.modo === "software-house") {
    const unit = partnerUnit(numeros);
    platform = { label: `Parceiro · R$ ${unit}/número`, monthly: unit * numeros, unit, planId: "partner" };
  } else {
    const plan = pickPlatformPlan(numeros, Math.floor(n0(input.atendentes)) || 1);
    platform = plan
      ? { label: plan.name, monthly: plan.priceBRL, unit: null, planId: plan.id }
      : { label: "Proposta sob medida", monthly: null, unit: null, planId: null };
  }

  const atolTotal = platform.monthly === null ? null : cents(platform.monthly + meta.total);
  const crmReferenceTotal = cents(CRM_REFERENCE_PER_NUMBER * numeros + meta.total);

  return {
    numeros,
    meta,
    billableService,
    freeServiceUsed: Math.min(servico, freeQuota),
    platform,
    atolTotal,
    crmReferenceTotal,
    economiaAnualVsCRM: atolTotal === null ? null : cents((crmReferenceTotal - atolTotal) * 12),
  };
}

export type TcoPreset = { id: string; label: { pt: string; en: string }; input: TcoInput };

export const TCO_PRESETS: TcoPreset[] = [
  {
    id: "clinica",
    label: { pt: "Clínica", en: "Clinic" },
    input: { respostasNoCelular: 1500, mensagensServicoAPI: 600, mensagensUtilidade: 800, mensagensMarketing: 0, quantidadeNumeros: 1, atendentes: 3, modo: "empresa" },
  },
  {
    id: "delivery",
    label: { pt: "Delivery / Restaurante", en: "Delivery / Restaurant" },
    input: { respostasNoCelular: 2500, mensagensServicoAPI: 1800, mensagensUtilidade: 3000, mensagensMarketing: 400, quantidadeNumeros: 1, atendentes: 3, modo: "empresa" },
  },
  {
    id: "varejo",
    label: { pt: "Varejo", en: "Retail" },
    input: { respostasNoCelular: 1200, mensagensServicoAPI: 900, mensagensUtilidade: 1200, mensagensMarketing: 600, quantidadeNumeros: 2, atendentes: 5, modo: "empresa" },
  },
  {
    id: "software-house",
    label: { pt: "Software House · 15 clientes", en: "Software house · 15 clients" },
    input: { respostasNoCelular: 0, mensagensServicoAPI: 12000, mensagensUtilidade: 22500, mensagensMarketing: 0, quantidadeNumeros: 15, atendentes: 1, modo: "software-house" },
  },
];

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
