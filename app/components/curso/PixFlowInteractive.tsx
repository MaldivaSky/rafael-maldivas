"use client";

import { useState } from "react";
import { ArrowRight, Code2 } from "lucide-react";

type FlowStep = {
  id: string;
  num: string;
  title: string;
  actor: string;
  fileRef: string;
  summary: string;
  code: string;
  why: string;
};

const STEPS: FlowStep[] = [
  {
    id: "checkout",
    num: "01",
    title: "Criação do pedido e reserva de estoque",
    actor: "Cliente → Backend",
    fileRef: "apps/orders/serializers.py:224-328",
    summary:
      "O cliente envia o carrinho. O servidor ignora qualquer preço vindo do navegador, recalcula subtotal, cupom, frete e comissão em Decimal, e faz baixa condicional de estoque dentro de uma transação.",
    code: `UPDATE catalog_productvariant
SET stock = stock - %s
WHERE id = %s AND stock >= %s`,
    why: "Impede que duas pessoas comprem a última unidade ao mesmo tempo. Se o pedido não for pago em 60 min, uma tarefa agendada devolve o estoque.",
  },
  {
    id: "pix-charge",
    num: "02",
    title: "Emissão da cobrança PIX",
    actor: "Backend → Provedor (Efí)",
    fileRef: "apps/payments/models.py:21",
    summary:
      "Com o pedido salvo no estado PENDING, o backend solicita a cobrança imediata ao provedor e grava um Payment (OneToOneField com Order) contendo efi_txid, valor e raw_response.",
    code: `class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.PROTECT)
    efi_txid = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=20, default="pending")`,
    why: "O on_delete=PROTECT impede apagar um pedido que possui pagamento vinculado, preservando a trilha de auditoria.",
  },
  {
    id: "webhook",
    num: "03",
    title: "Recebimento do webhook",
    actor: "Provedor → Backend",
    fileRef: "apps/payments/views.py",
    summary:
      "Quando o cliente paga o QR Code no banco, o provedor envia um POST assíncrono para o endpoint de webhook. O provedor pode reenviar o mesmo evento mais de uma vez se houver lentidão na resposta.",
    code: `POST /api/v1/payments/webhook/
{ "pix": [{ "txid": "abc123...", "valor": "100.00" }] }`,
    why: "Nunca confie apenas no retorno da tela do cliente: o webhook assíncrono é a confirmação oficial de que o dinheiro entrou.",
  },
  {
    id: "idempotency",
    num: "04",
    title: "Trava de linha e idempotência",
    actor: "Backend → PostgreSQL",
    fileRef: "apps/payments/processing.py:15-27",
    summary:
      "A função process_successful_payment abre transaction.atomic(), trava o registro do pedido com select_for_update() e verifica se o status já é CONFIRMED. Se já for, retorna sem fazer nada.",
    code: `with transaction.atomic():
    order = Order.objects.select_for_update().get(pk=order_id)
    if order.status == OrderStatus.CONFIRMED:
        return  # idempotente: webhook repetido não duplica repasse`,
    why: "Sem essa trava, dois webhooks simultâneos poderiam gerar duas comissões e dois repasses para o mesmo pedido.",
  },
  {
    id: "split",
    num: "05",
    title: "Split contábil por sub-pedido",
    actor: "Order → SubOrder → Payout + CommissionEntry",
    fileRef: "apps/orders/models.py:72-91",
    summary:
      "Para cada SubOrder (um por lojista no carrinho), o sistema registra a CommissionEntry com a taxa aplicada na época e gera o Payout com o valor líquido do vendedor.",
    code: `# Comissão = subtotal_efetivo × taxa (não incide sobre frete)
commission = (effective_subtotal * rate).quantize(Decimal("0.01"), ROUND_HALF_UP)
seller_amount = (effective_subtotal - commission) + shipping`,
    why: "Separar Order de SubOrder permite que cada loja envie seu pacote com rastreio próprio e receba exatamente sua parte.",
  },
  {
    id: "realtime",
    num: "06",
    title: "Notificação em tempo real",
    actor: "Backend → WebSocket → Cliente e Lojista",
    fileRef: "apps/notifications/",
    summary:
      "Após confirmar no banco, o backend publica um evento via WebSocket para atualizar a tela de pagamento do comprador instantaneamente e avisar o lojista sobre o novo pedido.",
    code: `channel_layer.group_send(
    f"order_{order.order_number}",
    {"type": "payment.confirmed", "status": "confirmed"}
)`,
    why: "Elimina a necessidade de o navegador ficar consultando a API em loop (polling) enquanto o cliente espera a compensação do PIX.",
  },
];

export default function PixFlowInteractive({
  onInteract,
}: {
  onInteract?: () => void;
}) {
  const [activeId, setActiveId] = useState<string>(STEPS[0].id);
  const current = STEPS.find((s) => s.id === activeId) ?? STEPS[0];

  return (
    <section className="curso-sim-card" aria-labelledby="pix-flow-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Prática 3 · Fluxo do PIX clicável</span>
          <h3 id="pix-flow-title">
            <Code2 size={20} aria-hidden="true" />
            Do clique no checkout ao repasse ao lojista no MySuperStore
          </h3>
        </div>
      </div>

      <p className="curso-muted">
        Selecione cada etapa abaixo para inspecionar o ator envolvido, a referência no código
        real e o motivo de engenharia por trás da decisão.
      </p>

      <div className="curso-flow-steps" role="tablist" aria-label="Etapas do fluxo PIX">
        {STEPS.map((step, idx) => {
          const isSelected = step.id === current.id;
          return (
            <div key={step.id} className="curso-flow-step-wrap">
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="pix-flow-panel"
                id={`tab-${step.id}`}
                className={`curso-flow-btn ${isSelected ? "on" : ""}`}
                onClick={() => {
                  setActiveId(step.id);
                  onInteract?.();
                }}
              >
                <span className="curso-flow-num">{step.num}</span>
                <span className="curso-flow-label">{step.title}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <ArrowRight
                  size={16}
                  className="curso-flow-arrow"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        id="pix-flow-panel"
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="curso-flow-detail"
        aria-live="polite"
      >
        <div className="curso-flow-meta">
          <span className="curso-pill">{current.actor}</span>
          <code className="curso-code-ref">{current.fileRef}</code>
        </div>
        <h4>
          {current.num}. {current.title}
        </h4>
        <p>{current.summary}</p>
        <pre className="curso-code-block">
          <code>{current.code}</code>
        </pre>
        <p className="curso-why">
          <strong>Por que importa:</strong> {current.why}
        </p>
      </div>
    </section>
  );
}
