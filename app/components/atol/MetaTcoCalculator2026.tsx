"use client";

import { useMemo, useState } from "react";
import {
  brl,
  computeTco,
  CRM_REFERENCE_PER_NUMBER,
  META_BRL,
  TCO_PRESETS,
  type TcoInput,
} from "../../lib/whatsapp-tco";

type Lang = "pt" | "en";

type Field = {
  key: keyof Pick<TcoInput, "respostasNoCelular" | "mensagensServicoAPI" | "mensagensUtilidade" | "mensagensMarketing" | "quantidadeNumeros" | "atendentes">;
  label: { pt: string; en: string };
  hint: { pt: string; en: string };
  max: number;
  step: number;
};

const FIELDS: Field[] = [
  { key: "respostasNoCelular", label: { pt: "Respostas no celular (Coexistência)", en: "Replies on the phone (Coexistence)" }, hint: { pt: "Sempre R$ 0,00 — não consome a franquia da API", en: "Always BRL 0.00 — doesn't use the API quota" }, max: 20000, step: 100 },
  { key: "mensagensServicoAPI", label: { pt: "Mensagens de serviço pela API (Inbox/IA)", en: "Service messages via API (Inbox/AI)" }, hint: { pt: "1.000 grátis por número/mês; excedente R$ 0,035", en: "1,000 free per number/month; then BRL 0.035" }, max: 50000, step: 100 },
  { key: "mensagensUtilidade", label: { pt: "Avisos de utilidade (pedido, PIX, lembrete)", en: "Utility notices (order, PIX, reminder)" }, hint: { pt: "R$ 0,035 cada — inclusive dentro da janela de 24h", en: "BRL 0.035 each — even inside the 24h window" }, max: 50000, step: 100 },
  { key: "mensagensMarketing", label: { pt: "Campanhas de marketing", en: "Marketing campaigns" }, hint: { pt: "R$ 0,3217 cada — só com opt-in", en: "BRL 0.3217 each — opt-in only" }, max: 20000, step: 50 },
  { key: "quantidadeNumeros", label: { pt: "Números de WhatsApp", en: "WhatsApp numbers" }, hint: { pt: "1 a 50", en: "1 to 50" }, max: 50, step: 1 },
  { key: "atendentes", label: { pt: "Atendentes", en: "Agents" }, hint: { pt: "Define o plano no modo empresa", en: "Sets the plan in business mode" }, max: 30, step: 1 },
];

export default function MetaTcoCalculator2026({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const pt = lang === "pt";
  const [preset, setPreset] = useState(TCO_PRESETS[1].id);
  const [input, setInput] = useState<TcoInput>({ ...TCO_PRESETS[1].input });
  const r = useMemo(() => computeTco(input), [input]);

  const set = (k: Field["key"], v: number) => {
    setPreset("");
    setInput((s) => ({ ...s, [k]: v }));
  };

  const fields = compact
    ? FIELDS.filter((f) => f.key !== "respostasNoCelular" && f.key !== "atendentes")
    : FIELDS.filter((f) => !(f.key === "atendentes" && input.modo === "software-house"));

  return (
    <div className={`tco${compact ? " is-compact" : ""}`}>
      <div className="tco-top">
        <div className="tco-presets" role="group" aria-label={pt ? "Cenários prontos" : "Presets"}>
          {TCO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={preset === p.id}
              className={preset === p.id ? "is-on" : ""}
              onClick={() => {
                setPreset(p.id);
                setInput({ ...p.input });
              }}
            >
              {p.label[lang]}
            </button>
          ))}
        </div>
        <div className="tco-mode" role="group" aria-label={pt ? "Tipo de conta" : "Account type"}>
          {(["empresa", "software-house"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={input.modo === m}
              className={input.modo === m ? "is-on" : ""}
              onClick={() => {
                setPreset("");
                setInput((s) => ({ ...s, modo: m }));
              }}
            >
              {m === "empresa" ? (pt ? "Minha empresa" : "My business") : pt ? "Software house (parceiro)" : "Software house (partner)"}
            </button>
          ))}
        </div>
      </div>

      <div className="tco-grid">
        <div className="tco-inputs">
          {fields.map((f) => {
            const v = Number(input[f.key] ?? 0);
            const min = f.key === "quantidadeNumeros" || f.key === "atendentes" ? 1 : 0;
            return (
              <div className="tco-field" key={f.key}>
                <div className="tco-field-head">
                  <label htmlFor={`tco-${f.key}`}>{f.label[lang]}</label>
                  <input
                    type="number"
                    aria-label={f.label[lang]}
                    min={min}
                    max={f.max}
                    value={v}
                    onChange={(e) => set(f.key, Math.max(min, Math.min(f.max, Number(e.target.value) || 0)))}
                  />
                </div>
                <input id={`tco-${f.key}`} type="range" min={min} max={f.max} step={f.step} value={v} onChange={(e) => set(f.key, Number(e.target.value))} />
                <small>{f.hint[lang]}</small>
              </div>
            );
          })}
        </div>

        <div className="tco-out" aria-live="polite">
          <div className="tco-total">
            <span>{pt ? "Custo total mensal no Atol Connect" : "Total monthly cost on Atol Connect"}</span>
            <strong>{r.atolTotal === null ? (pt ? "Sob proposta" : "By proposal") : brl(r.atolTotal)}</strong>
            <small>
              {pt ? "Plataforma" : "Platform"}: {r.platform.label}
              {r.platform.monthly !== null ? ` (${brl(r.platform.monthly)})` : ""} + {pt ? "Meta" : "Meta"} {brl(r.meta.total)}
            </small>
          </div>

          <table className="tco-table">
            <tbody>
              <tr><td>{pt ? "Respostas no celular" : "Phone replies"}</td><td className="is-free">{brl(0)}</td></tr>
              <tr>
                <td>
                  {pt ? "Serviço via API" : "API service"}{" "}
                  <small>
                    ({r.freeServiceUsed.toLocaleString("pt-BR")} {pt ? "grátis" : "free"} · {r.billableService.toLocaleString("pt-BR")} {pt ? "cobradas" : "billed"})
                  </small>
                </td>
                <td>{brl(r.meta.service)}</td>
              </tr>
              <tr><td>{pt ? "Utilidade" : "Utility"}</td><td>{brl(r.meta.utility)}</td></tr>
              <tr><td>Marketing</td><td>{brl(r.meta.marketing)}</td></tr>
              <tr className="is-sum"><td>{pt ? "Fatura direta da Meta" : "Billed directly by Meta"}</td><td>{brl(r.meta.total)}</td></tr>
              <tr><td>{pt ? "Markup Atol sobre a Meta" : "Atol markup on Meta"}</td><td className="is-free">{brl(0)}</td></tr>
            </tbody>
          </table>

          {r.economiaAnualVsCRM !== null && r.economiaAnualVsCRM > 0 && (
            <div className="tco-save">
              <span>{pt ? "Economia anual estimada vs. plataforma oficial + CRM" : "Estimated yearly savings vs. official platform + CRM"}</span>
              <strong>{brl(r.economiaAnualVsCRM)}</strong>
              <small>
                {pt
                  ? `Referência: R$ ${CRM_REFERENCE_PER_NUMBER}/número (meio da faixa pública R$ 197–497/mês), mesma tarifa Meta dos dois lados. Estimativa, não proposta de concorrente.`
                  : `Reference: BRL ${CRM_REFERENCE_PER_NUMBER}/number (middle of the public BRL 197–497/month range), same Meta fees on both sides. Estimate, not a competitor quote.`}
              </small>
            </div>
          )}
          {r.atolTotal === null && (
            <p className="tco-note">
              {pt
                ? "Acima de 5 números no modo empresa não há plano self-serve: fale com a engenharia ou use o modo parceiro."
                : "Above 5 numbers in business mode there's no self-serve plan: talk to engineering or use partner mode."}
            </p>
          )}
        </div>
      </div>

      <p className="tco-source">
        {pt
          ? `Tarifas Meta em BRL por mensagem entregue, regras vigentes desde ${new Date(META_BRL.effectiveFrom + "T12:00:00").toLocaleDateString("pt-BR")}. Pagas direto à Meta. Planos: Start R$ 79 · Pro R$ 149 · Business R$ 499 · Parceiro R$ 59/número (R$ 49 a partir de 21).`
          : `Meta fees in BRL per delivered message, rules in force since Oct 1, 2026. Paid directly to Meta. Plans: Start BRL 79 · Pro BRL 149 · Business BRL 499 · Partner BRL 59/number (BRL 49 from 21).`}
      </p>
    </div>
  );
}
