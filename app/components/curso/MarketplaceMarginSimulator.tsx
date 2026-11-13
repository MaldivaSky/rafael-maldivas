"use client";

import { useMemo, useState } from "react";
import { Calculator, RotateCcw, Scale } from "lucide-react";
import {
  calculateBreakEven,
  calculateOrderMargin,
  DEFAULT_MARKETPLACE_RATES,
  formatBRLCents,
  type PaymentMethod,
} from "@/app/lib/marketplace-margin";

function parseReaisToCents(val: string): number {
  const cleaned = val.replace(/[^\d.,]/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

function parsePercentToBps(val: string): number {
  const cleaned = val.replace(/[^\d.,]/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

export default function MarketplaceMarginSimulator({
  onInteract,
}: {
  onInteract?: () => void;
}) {
  // Simulador por pedido
  const [subtotalStr, setSubtotalStr] = useState("100.00");
  const [discountStr, setDiscountStr] = useState("0.00");
  const [shippingStr, setShippingStr] = useState("0.00");
  const [freeShippingStr, setFreeShippingStr] = useState("299.00");
  const [commissionStr, setCommissionStr] = useState("12.00");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [pixFeeStr, setPixFeeStr] = useState("0.99");
  const [cardFeeStr, setCardFeeStr] = useState("3.99");
  const [cardFixedStr, setCardFixedStr] = useState("0.39");

  // Simulador de ponto de equilíbrio
  const [fixedCostsStr, setFixedCostsStr] = useState("2000.00");
  const [ordersMonthStr, setOrdersMonthStr] = useState("200");
  const [avgTicketStr, setAvgTicketStr] = useState("100.00");
  const [bePaymentMethod, setBePaymentMethod] = useState<PaymentMethod>("pix");

  const orderResult = useMemo(() => {
    return calculateOrderMargin({
      subtotalCents: parseReaisToCents(subtotalStr),
      discountCents: parseReaisToCents(discountStr),
      shippingCents: parseReaisToCents(shippingStr),
      freeShippingThresholdCents: parseReaisToCents(freeShippingStr),
      commissionBps: parsePercentToBps(commissionStr),
      paymentMethod,
      pixFeeBps: parsePercentToBps(pixFeeStr),
      pixFixedCents: DEFAULT_MARKETPLACE_RATES.pixFixedCents,
      cardFeeBps: parsePercentToBps(cardFeeStr),
      cardFixedCents: parseReaisToCents(cardFixedStr),
    });
  }, [
    subtotalStr,
    discountStr,
    shippingStr,
    freeShippingStr,
    commissionStr,
    paymentMethod,
    pixFeeStr,
    cardFeeStr,
    cardFixedStr,
  ]);

  const breakEvenResult = useMemo(() => {
    const orders = Math.max(0, Math.floor(Number(ordersMonthStr) || 0));
    return calculateBreakEven({
      fixedCostsCents: parseReaisToCents(fixedCostsStr),
      ordersPerMonth: orders,
      avgTicketCents: parseReaisToCents(avgTicketStr),
      paymentMethod: bePaymentMethod,
      commissionBps: parsePercentToBps(commissionStr),
    });
  }, [fixedCostsStr, ordersMonthStr, avgTicketStr, bePaymentMethod, commissionStr]);

  function resetDefaults() {
    setSubtotalStr("100.00");
    setDiscountStr("0.00");
    setShippingStr("0.00");
    setFreeShippingStr("299.00");
    setCommissionStr("12.00");
    setPaymentMethod("pix");
    setPixFeeStr("0.99");
    setCardFeeStr("3.99");
    setCardFixedStr("0.39");
    onInteract?.();
  }

  return (
    <div className="curso-interactive-stack">
      {/* 1. Simulador de margem por pedido */}
      <section className="curso-sim-card" aria-labelledby="sim-margem-title">
        <div className="curso-sim-head">
          <div>
            <span className="curso-badge">Prática 1 · Simulador por pedido</span>
            <h3 id="sim-margem-title">
              <Calculator size={20} aria-hidden="true" />
              Quanto sobra para a plataforma em cada pedido
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost curso-btn-sm"
            onClick={resetDefaults}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Restaurar exemplos
          </button>
        </div>

        <p className="curso-assumption">
          <strong>Suposição explícita:</strong> a taxa do provedor incide sobre o{" "}
          <strong>total pago pelo cliente</strong> (produtos com desconto + frete cobrado) e é
          absorvida pela plataforma (sai da comissão). A comissão da plataforma incide{" "}
          <strong>apenas sobre os produtos</strong> (não incide sobre o frete).
        </p>

        <div className="curso-sim-grid">
          <div className="curso-sim-inputs">
            <div className="curso-field-row">
              <div className="curso-field">
                <label htmlFor="sim-subtotal">Subtotal dos produtos (R$)</label>
                <input
                  id="sim-subtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={subtotalStr}
                  onChange={(e) => {
                    setSubtotalStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
              <div className="curso-field">
                <label htmlFor="sim-desconto">Desconto de cupom (R$)</label>
                <input
                  id="sim-desconto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountStr}
                  onChange={(e) => {
                    setDiscountStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
            </div>

            <div className="curso-field-row">
              <div className="curso-field">
                <label htmlFor="sim-frete">Frete informado (R$)</label>
                <input
                  id="sim-frete"
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingStr}
                  onChange={(e) => {
                    setShippingStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
              <div className="curso-field">
                <label htmlFor="sim-frete-gratis">Frete grátis a partir de (R$)</label>
                <input
                  id="sim-frete-gratis"
                  type="number"
                  min="0"
                  step="0.01"
                  value={freeShippingStr}
                  onChange={(e) => {
                    setFreeShippingStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
            </div>

            <div className="curso-field-row">
              <div className="curso-field">
                <label htmlFor="sim-comissao">Comissão da plataforma (%)</label>
                <input
                  id="sim-comissao"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={commissionStr}
                  onChange={(e) => {
                    setCommissionStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
              <div className="curso-field">
                <span className="curso-label-text" id="sim-metodo-label">
                  Método de pagamento
                </span>
                <div
                  className="curso-segmented"
                  role="group"
                  aria-labelledby="sim-metodo-label"
                >
                  <button
                    type="button"
                    className={paymentMethod === "pix" ? "on" : ""}
                    aria-pressed={paymentMethod === "pix"}
                    onClick={() => {
                      setPaymentMethod("pix");
                      onInteract?.();
                    }}
                  >
                    PIX
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === "card" ? "on" : ""}
                    aria-pressed={paymentMethod === "card"}
                    onClick={() => {
                      setPaymentMethod("card");
                      onInteract?.();
                    }}
                  >
                    Cartão
                  </button>
                </div>
              </div>
            </div>

            {paymentMethod === "pix" ? (
              <div className="curso-field">
                <label htmlFor="sim-taxa-pix">Taxa PIX do provedor (% — exemplo)</label>
                <input
                  id="sim-taxa-pix"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pixFeeStr}
                  onChange={(e) => {
                    setPixFeeStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
            ) : (
              <div className="curso-field-row">
                <div className="curso-field">
                  <label htmlFor="sim-taxa-cartao">Taxa cartão (%) — exemplo</label>
                  <input
                    id="sim-taxa-cartao"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cardFeeStr}
                    onChange={(e) => {
                      setCardFeeStr(e.target.value);
                      onInteract?.();
                    }}
                  />
                </div>
                <div className="curso-field">
                  <label htmlFor="sim-fixo-cartao">Taxa fixa cartão (R$) — exemplo</label>
                  <input
                    id="sim-fixo-cartao"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cardFixedStr}
                    onChange={(e) => {
                      setCardFixedStr(e.target.value);
                      onInteract?.();
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="curso-sim-results" aria-live="polite">
            <div className="curso-result-row">
              <span>Subtotal efetivo (produtos − cupom)</span>
              <strong>{formatBRLCents(orderResult.effectiveSubtotalCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>
                Frete cobrado{" "}
                {orderResult.freeShippingApplied ? "(frete grátis aplicado)" : ""}
              </span>
              <strong>{formatBRLCents(orderResult.chargedShippingCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>Total pago pelo cliente</span>
              <strong>{formatBRLCents(orderResult.customerTotalCents)}</strong>
            </div>
            <hr className="curso-divider" />
            <div className="curso-result-row">
              <span>Repasse ao lojista</span>
              <strong>{formatBRLCents(orderResult.sellerAmountCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>Comissão bruta da plataforma</span>
              <strong>{formatBRLCents(orderResult.commissionCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>Taxa do provedor (absorvida)</span>
              <strong>− {formatBRLCents(orderResult.providerFeeCents)}</strong>
            </div>
            <div
              className={`curso-result-highlight ${
                orderResult.platformNetCents < 0 ? "negative" : ""
              }`}
            >
              <span>Sobra líquida da plataforma</span>
              <strong>{formatBRLCents(orderResult.platformNetCents)}</strong>
            </div>
            <p className="curso-conservation">
              Conservação: {formatBRLCents(orderResult.sellerAmountCents)} +{" "}
              {formatBRLCents(orderResult.commissionCents)} ={" "}
              {formatBRLCents(orderResult.customerTotalCents)}{" "}
              {orderResult.conservationValid ? "✓" : "✗"}
            </p>
          </div>
        </div>

        <p className="curso-disclaimer">
          Aviso: os valores padrão (12% comissão; PIX 0,99%; cartão 3,99% + R$ 0,39; frete grátis
          a partir de R$ 299,00) são <strong>exemplos ilustrativos</strong> extraídos das
          configurações de referência do código. Confirme as tarifas no contrato do seu provedor.
          Esta simulação <strong>não é garantia de resultado financeiro</strong>.
        </p>
      </section>

      {/* 2. Simulador de ponto de equilíbrio */}
      <section className="curso-sim-card" aria-labelledby="sim-pe-title">
        <div className="curso-sim-head">
          <div>
            <span className="curso-badge">Prática 2 · Ponto de equilíbrio</span>
            <h3 id="sim-pe-title">
              <Scale size={20} aria-hidden="true" />
              Quantos pedidos/mês pagam o custo fixo da operação
            </h3>
          </div>
        </div>

        <div className="curso-sim-grid">
          <div className="curso-sim-inputs">
            <div className="curso-field-row">
              <div className="curso-field">
                <label htmlFor="pe-custos">Custos fixos mensais (R$)</label>
                <input
                  id="pe-custos"
                  type="number"
                  min="0"
                  step="10"
                  value={fixedCostsStr}
                  onChange={(e) => {
                    setFixedCostsStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
              <div className="curso-field">
                <label htmlFor="pe-pedidos">Pedidos por mês (estimativa)</label>
                <input
                  id="pe-pedidos"
                  type="number"
                  min="0"
                  step="1"
                  value={ordersMonthStr}
                  onChange={(e) => {
                    setOrdersMonthStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
            </div>

            <div className="curso-field-row">
              <div className="curso-field">
                <label htmlFor="pe-ticket">Ticket médio em produtos (R$)</label>
                <input
                  id="pe-ticket"
                  type="number"
                  min="0"
                  step="1"
                  value={avgTicketStr}
                  onChange={(e) => {
                    setAvgTicketStr(e.target.value);
                    onInteract?.();
                  }}
                />
              </div>
              <div className="curso-field">
                <span className="curso-label-text" id="pe-metodo-label">
                  Pagamento predominante
                </span>
                <div
                  className="curso-segmented"
                  role="group"
                  aria-labelledby="pe-metodo-label"
                >
                  <button
                    type="button"
                    className={bePaymentMethod === "pix" ? "on" : ""}
                    aria-pressed={bePaymentMethod === "pix"}
                    onClick={() => {
                      setBePaymentMethod("pix");
                      onInteract?.();
                    }}
                  >
                    PIX
                  </button>
                  <button
                    type="button"
                    className={bePaymentMethod === "card" ? "on" : ""}
                    aria-pressed={bePaymentMethod === "card"}
                    onClick={() => {
                      setBePaymentMethod("card");
                      onInteract?.();
                    }}
                  >
                    Cartão
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="curso-sim-results" aria-live="polite">
            <div className="curso-result-row">
              <span>Sobra média por pedido</span>
              <strong>{formatBRLCents(breakEvenResult.avgNetPerOrderCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>Sobra mensal bruta (pedidos × sobra)</span>
              <strong>{formatBRLCents(breakEvenResult.monthlyNetCents)}</strong>
            </div>
            <div className="curso-result-row">
              <span>Saldo após custos fixos</span>
              <strong>{formatBRLCents(breakEvenResult.monthlyBalanceCents)}</strong>
            </div>
            <div
              className={`curso-result-highlight ${
                !breakEvenResult.coversFixedCosts ? "negative" : ""
              }`}
            >
              <span>Ponto de equilíbrio</span>
              <strong>
                {breakEvenResult.breakEvenOrdersPerMonth === null
                  ? "Inviável (sobra ≤ R$ 0,00/pedido)"
                  : `${breakEvenResult.breakEvenOrdersPerMonth} pedidos/mês`}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
