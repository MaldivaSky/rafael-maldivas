"use client";

import { useState } from "react";
import { CheckSquare, Square, ShieldAlert } from "lucide-react";

type CheckItem = {
  id: string;
  title: string;
  detail: string;
  tag: string;
};

const ITEMS: CheckItem[] = [
  {
    id: "cnae",
    title: "CNPJ e CNAE compatíveis com intermediação ou ensino",
    detail:
      "Confirmar com contador o enquadramento tributário (ex.: intermediação de negócios ou treinamento) e emissão de NFS-e sobre a comissão.",
    tag: "Contador",
  },
  {
    id: "gateway",
    title: "Contrato e tarifas reais no provedor de pagamento",
    detail:
      "Validar taxas de PIX, cartão, antecipação, estorno e prazos de liquidação no contrato real (nunca usar placeholders em produção).",
    tag: "Financeiro",
  },
  {
    id: "termos",
    title: "Termos de uso da plataforma e regras de repasse [A DEFINIR COM ADVOGADO]",
    detail:
      "Definir responsabilidades entre plataforma, lojista e comprador, prazos de repasse, retenção por disputa e comissão.",
    tag: "[A DEFINIR COM ADVOGADO]",
  },
  {
    id: "reembolso",
    title: "Política de reembolso e direito de arrependimento [A DEFINIR COM ADVOGADO]",
    detail:
      "Alinhar fluxo de estorno e devolução com o Código de Defesa do Consumidor (art. 49) junto a assessoria jurídica.",
    tag: "[A DEFINIR COM ADVOGADO]",
  },
  {
    id: "lgpd",
    title: "Política de privacidade e adequação à LGPD",
    detail:
      "Mapear dados pessoais coletados (endereço, CPF/CNPJ, histórico de pedidos), base legal, prazo de retenção e canal do titular.",
    tag: "LGPD",
  },
  {
    id: "conciliacao",
    title: "Rotina de conciliação e auditoria de estornos",
    detail:
      "Conferir diariamente pagamentos recebidos, webhooks processados, repasses executados e saldos de devolução.",
    tag: "Operação",
  },
];

export default function LegalChecklistInteractive({
  onInteract,
}: {
  onInteract?: () => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);

  function toggle(id: string) {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    onInteract?.();
  }

  const doneCount = checked.length;
  const total = ITEMS.length;

  return (
    <section className="curso-sim-card" aria-labelledby="checklist-legal-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Prática 4 · Checklist legal e fiscal</span>
          <h3 id="checklist-legal-title">
            <ShieldAlert size={20} aria-hidden="true" />
            O que conferir antes de colocar dinheiro real no ar
          </h3>
        </div>
        <span className="curso-pill" aria-live="polite">
          {doneCount}/{total} conferidos
        </span>
      </div>

      <p className="curso-muted">
        Este checklist é um guia prático de preparação operacional. Itens jurídicos e tributários
        exigem validação com contador e advogado antes de operar.
      </p>

      <ul className="curso-checklist">
        {ITEMS.map((item) => {
          const isDone = checked.includes(item.id);
          return (
            <li key={item.id} className={`curso-check-item ${isDone ? "done" : ""}`}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                onClick={() => toggle(item.id)}
                className="curso-check-btn"
              >
                <span className="curso-check-icon" aria-hidden="true">
                  {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                </span>
                <span className="curso-check-body">
                  <span className="curso-check-top">
                    <strong>{item.title}</strong>
                    <span className="curso-pill">{item.tag}</span>
                  </span>
                  <span className="curso-check-desc">{item.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
