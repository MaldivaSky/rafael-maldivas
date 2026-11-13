/* ------------------------------------------------------------------ */
/*  Cálculo puro de margem e ponto de equilíbrio de marketplace        */
/*                                                                     */
/*  Baseado nas regras reais do MySuperStore:                          */
/*   • backend/apps/orders/serializers.py:278-298                      */
/*   • backend/apps/orders/models.py:78-83                             */
/*                                                                     */
/*  Todos os valores monetários são inteiros em CENTAVOS (nunca float) */
/*  e as taxas são inteiros em BASIS POINTS (1% = 100 bps).            */
/*  Arredondamento: meio-para-cima (ROUND_HALF_UP).                    */
/* ------------------------------------------------------------------ */

export type PaymentMethod = "pix" | "card";

export type MarginInput = {
  /** Subtotal dos produtos em centavos (>= 0) */
  subtotalCents: number;
  /** Desconto de cupom em centavos (>= 0) */
  discountCents?: number;
  /** Frete informado em centavos (>= 0) */
  shippingCents?: number;
  /** Valor mínimo para frete grátis em centavos (>= 0) */
  freeShippingThresholdCents?: number;
  /** Taxa de comissão da plataforma em basis points (ex: 1200 = 12,00%) */
  commissionBps?: number;
  /** Método de pagamento escolhido */
  paymentMethod: PaymentMethod;
  /** Taxa do provedor para PIX em basis points (ex: 99 = 0,99%) */
  pixFeeBps?: number;
  /** Taxa fixa do provedor para PIX em centavos (ex: 0) */
  pixFixedCents?: number;
  /** Taxa do provedor para cartão em basis points (ex: 399 = 3,99%) */
  cardFeeBps?: number;
  /** Taxa fixa do provedor para cartão em centavos (ex: 39 = R$ 0,39) */
  cardFixedCents?: number;
};

export type MarginResult = {
  /** Subtotal após desconto: max(0, subtotal - desconto) */
  effectiveSubtotalCents: number;
  /** Frete efetivamente cobrado do cliente (0 se atingiu frete grátis) */
  chargedShippingCents: number;
  /** Indica se a regra de frete grátis foi aplicada */
  freeShippingApplied: boolean;
  /** Total pago pelo cliente = subtotal efetivo + frete cobrado */
  customerTotalCents: number;
  /** Comissão bruta da plataforma (não incide sobre o frete) */
  commissionCents: number;
  /** Taxa do provedor de pagamento (incide sobre o total pago pelo cliente) */
  providerFeeCents: number;
  /** Sobra líquida da plataforma = comissão - taxa do provedor */
  platformNetCents: number;
  /** Repasse ao lojista = (subtotal efetivo - comissão) + frete cobrado */
  sellerAmountCents: number;
  /** Verificação de conservação: sellerAmountCents + commissionCents === customerTotalCents */
  conservationValid: boolean;
};

export type BreakEvenInput = {
  /** Custos fixos mensais em centavos (>= 0) */
  fixedCostsCents: number;
  /** Volume estimado de pedidos por mês (>= 0) */
  ordersPerMonth: number;
  /** Ticket médio (subtotal de produtos) em centavos (>= 0) */
  avgTicketCents: number;
  /** Método de pagamento predominante */
  paymentMethod: PaymentMethod;
  /** Taxa de comissão em basis points (padrão 1200 = 12%) */
  commissionBps?: number;
  /** Frete médio cobrado em centavos (padrão 0) */
  avgShippingCents?: number;
};

export type BreakEvenResult = {
  /** Sobra média da plataforma por pedido em centavos */
  avgNetPerOrderCents: number;
  /** Sobra mensal total da plataforma em centavos */
  monthlyNetCents: number;
  /** Saldo após custos fixos (sobra mensal - custos fixos) em centavos */
  monthlyBalanceCents: number;
  /** Pedidos/mês necessários para cobrir os custos fixos (null se sobra <= 0) */
  breakEvenOrdersPerMonth: number | null;
  /** Se o volume atual cobre os custos fixos */
  coversFixedCosts: boolean;
};

/** Valores padrão de exemplo (confirmar no contrato do provedor). */
export const DEFAULT_MARKETPLACE_RATES = {
  commissionBps: 1200, // 12,00%
  pixFeeBps: 99, // 0,99%
  pixFixedCents: 0, // R$ 0,00
  cardFeeBps: 399, // 3,99%
  cardFixedCents: 39, // R$ 0,39
  freeShippingThresholdCents: 29900, // R$ 299,00
} as const;

function sanitizeNonNegativeInt(value: number | undefined, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.round(value));
}

/**
 * Multiplica um valor em centavos por uma taxa em basis points (1/10000)
 * com arredondamento meio-para-cima (ROUND_HALF_UP) usando apenas inteiros.
 */
export function mulBpsHalfUp(cents: number, bps: number): number {
  const safeCents = sanitizeNonNegativeInt(cents);
  const safeBps = sanitizeNonNegativeInt(bps);
  if (safeCents === 0 || safeBps === 0) return 0;
  return Math.floor((safeCents * safeBps + 5000) / 10000);
}

/**
 * Calcula a divisão financeira de um pedido de marketplace.
 */
export function calculateOrderMargin(input: MarginInput): MarginResult {
  const subtotalCents = sanitizeNonNegativeInt(input.subtotalCents);
  const discountCents = sanitizeNonNegativeInt(input.discountCents);
  const shippingCents = sanitizeNonNegativeInt(input.shippingCents);
  const freeShippingThresholdCents = sanitizeNonNegativeInt(
    input.freeShippingThresholdCents,
    DEFAULT_MARKETPLACE_RATES.freeShippingThresholdCents,
  );
  const commissionBps = sanitizeNonNegativeInt(
    input.commissionBps,
    DEFAULT_MARKETPLACE_RATES.commissionBps,
  );

  const effectiveSubtotalCents = Math.max(0, subtotalCents - discountCents);

  // Comissão incide apenas sobre o subtotal efetivo (não sobre o frete)
  const commissionCents = mulBpsHalfUp(effectiveSubtotalCents, commissionBps);

  // Frete grátis quando (subtotal - desconto) >= mínimo configurado
  const freeShippingApplied =
    subtotalCents - discountCents >= freeShippingThresholdCents &&
    freeShippingThresholdCents > 0;
  const chargedShippingCents = freeShippingApplied ? 0 : shippingCents;

  const customerTotalCents = effectiveSubtotalCents + chargedShippingCents;
  const sellerAmountCents =
    effectiveSubtotalCents - commissionCents + chargedShippingCents;

  let providerFeeCents = 0;
  if (customerTotalCents > 0) {
    if (input.paymentMethod === "pix") {
      const feeBps = sanitizeNonNegativeInt(
        input.pixFeeBps,
        DEFAULT_MARKETPLACE_RATES.pixFeeBps,
      );
      const fixedCents = sanitizeNonNegativeInt(
        input.pixFixedCents,
        DEFAULT_MARKETPLACE_RATES.pixFixedCents,
      );
      providerFeeCents = mulBpsHalfUp(customerTotalCents, feeBps) + fixedCents;
    } else {
      const feeBps = sanitizeNonNegativeInt(
        input.cardFeeBps,
        DEFAULT_MARKETPLACE_RATES.cardFeeBps,
      );
      const fixedCents = sanitizeNonNegativeInt(
        input.cardFixedCents,
        DEFAULT_MARKETPLACE_RATES.cardFixedCents,
      );
      providerFeeCents = mulBpsHalfUp(customerTotalCents, feeBps) + fixedCents;
    }
  }

  const platformNetCents = commissionCents - providerFeeCents;
  const conservationValid =
    sellerAmountCents + commissionCents === customerTotalCents;

  return {
    effectiveSubtotalCents,
    chargedShippingCents,
    freeShippingApplied,
    customerTotalCents,
    commissionCents,
    providerFeeCents,
    platformNetCents,
    sellerAmountCents,
    conservationValid,
  };
}

/**
 * Calcula o ponto de equilíbrio mensal da operação do marketplace.
 */
export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixedCostsCents = sanitizeNonNegativeInt(input.fixedCostsCents);
  const ordersPerMonth = sanitizeNonNegativeInt(input.ordersPerMonth);
  const avgTicketCents = sanitizeNonNegativeInt(input.avgTicketCents);
  const avgShippingCents = sanitizeNonNegativeInt(input.avgShippingCents);

  const sample = calculateOrderMargin({
    subtotalCents: avgTicketCents,
    shippingCents: avgShippingCents,
    paymentMethod: input.paymentMethod,
    commissionBps: input.commissionBps,
  });

  const avgNetPerOrderCents = sample.platformNetCents;
  const monthlyNetCents = avgNetPerOrderCents * ordersPerMonth;
  const monthlyBalanceCents = monthlyNetCents - fixedCostsCents;

  let breakEvenOrdersPerMonth: number | null = null;
  if (avgNetPerOrderCents > 0) {
    breakEvenOrdersPerMonth = Math.ceil(fixedCostsCents / avgNetPerOrderCents);
  }

  const coversFixedCosts =
    avgNetPerOrderCents > 0 ? monthlyNetCents >= fixedCostsCents : fixedCostsCents === 0;

  return {
    avgNetPerOrderCents,
    monthlyNetCents,
    monthlyBalanceCents,
    breakEvenOrdersPerMonth,
    coversFixedCosts,
  };
}

/** Formata centavos inteiros em BRL (ex: 1101 -> "R$ 11,01") */
export function formatBRLCents(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const reais = Math.floor(abs / 100);
  const rest = abs % 100;
  const reaisFormatted = reais
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const restFormatted = rest.toString().padStart(2, "0");
  return `${negative ? "-" : ""}R$ ${reaisFormatted},${restFormatted}`;
}
