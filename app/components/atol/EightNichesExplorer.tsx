"use client";

import { useMemo, useState } from "react";
import { Check, Clock, Copy, ExternalLink, ShieldCheck, Smartphone } from "lucide-react";
import {
  ATOL_NICHES,
  CATEGORY_LABEL,
  CATEGORY_PRICE_BRL,
  codeSample,
  webhookSample,
  type CodeLang,
} from "../../lib/atol-niches";

type Lang = "pt" | "en";
type Tab = CodeLang | "webhook";

const TABS: { id: Tab; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "node", label: "Node/TS" },
  { id: "python", label: "Python" },
  { id: "php", label: "PHP" },
  { id: "webhook", label: "Webhook HMAC-SHA256" },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: v < 1 ? 3 : 2, maximumFractionDigits: 4 });

export default function EightNichesExplorer({
  lang,
  initialSlug,
  showPageLinks = true,
}: {
  lang: Lang;
  initialSlug?: string;
  /** links para /whatsapp-api/nichos/[slug] (desligado na própria página do nicho) */
  showPageLinks?: boolean;
}) {
  const pt = lang === "pt";
  const [slug, setSlug] = useState(initialSlug ?? ATOL_NICHES[0].slug);
  const [tab, setTab] = useState<Tab>("curl");
  const [copied, setCopied] = useState(false);
  const n = ATOL_NICHES.find((x) => x.slug === slug) ?? ATOL_NICHES[0];

  const code = useMemo(() => {
    if (tab !== "webhook") return codeSample(n, tab);
    const w = webhookSample(n);
    return `${w.headers}\n\n${w.body}\n\n${w.verify}`;
  }, [n, tab]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard bloqueado: o usuário ainda pode selecionar o texto */
    }
  };

  const cat = n.template.category;

  return (
    <div className="nx" id="sandbox">
      <div className="nx-tabs" role="tablist" aria-label={pt ? "Nichos" : "Industries"}>
        {ATOL_NICHES.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={x.slug === slug}
            className={`nx-tab${x.slug === slug ? " is-on" : ""}`}
            onClick={() => setSlug(x.slug)}
          >
            <span aria-hidden="true">{x.emoji}</span>
            <span>
              {i + 1}. {x.name[lang]}
            </span>
          </button>
        ))}
      </div>

      <div className="nx-grid" role="tabpanel">
        {/* --------- painel esquerdo: operação no WhatsApp --------- */}
        <div className="nx-ops">
          <div className="nx-panel-head">
            <span className="nx-eyebrow">{pt ? "Visão operacional · WhatsApp" : "Operational view · WhatsApp"}</span>
            <span className={`nx-badge is-${cat}`}>
              {CATEGORY_LABEL[cat][lang]} · {brl(CATEGORY_PRICE_BRL[cat])}
            </span>
          </div>

          <div className="nx-phone" aria-label={pt ? "Exemplo de conversa" : "Sample conversation"}>
            <div className="nx-bubble is-business">
              <small>
                {pt ? "Modelo aprovado" : "Approved template"} · <code>{n.template.name}</code>
              </small>
              {n.template.preview[lang]}
            </div>
            <div className="nx-window">
              <Clock size={13} aria-hidden="true" />
              {pt ? "Janela de 24h aberta pela resposta do cliente" : "24h window opened by the customer's reply"}
            </div>
            {n.chat.map((l, i) => (
              <div key={i} className={`nx-bubble is-${l.from}`}>
                {l.from === "team" && (
                  <small>
                    <Smartphone size={12} aria-hidden="true" /> {pt ? "Equipe no celular · Coexistência · R$ 0,00" : "Team on phone · Coexistence · BRL 0.00"}
                  </small>
                )}
                {l.text[lang]}
              </div>
            ))}
          </div>

          <div className="nx-rule">
            <ShieldCheck size={18} aria-hidden="true" />
            <div>
              <strong>{n.rule.title[lang]}</strong>
              <p>{n.rule.body[lang]}</p>
              <div className="nx-rule-links">
                {n.rule.ecosystem && (
                  <a href={n.rule.ecosystem.href} target="_blank" rel="noopener noreferrer">
                    {n.rule.ecosystem.name} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                )}
                {showPageLinks && (
                  <a href={`/${lang}/whatsapp-api/nichos/${n.slug}`}>
                    {pt ? "Página do nicho e FAQ →" : "Niche page & FAQ →"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --------- painel direito: visão técnica --------- */}
        <div className="nx-dev">
          <div className="nx-panel-head">
            <span className="nx-eyebrow">{pt ? "Visão técnica · Dev" : "Technical view · Dev"}</span>
            <button type="button" className="nx-copy" onClick={copy} aria-live="polite">
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? (pt ? "Copiado" : "Copied") : pt ? "Copiar código" : "Copy code"}
            </button>
          </div>
          <div className="nx-code-tabs" role="tablist" aria-label={pt ? "Linguagem" : "Language"}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? "is-on" : ""}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <pre className="nx-code" tabIndex={0}>
            <code>{code}</code>
          </pre>
          <p className="nx-foot">
            {tab === "webhook"
              ? pt
                ? "Assinatura sobre `${X-Atol-Timestamp}.${corpo}` · até 8 tentativas com backoff exponencial."
                : "Signature over `${X-Atol-Timestamp}.${body}` · up to 8 retries with exponential backoff."
              : pt
                ? `Idempotency-Key "${n.idempotencyKey}": um retry do seu servidor nunca vira mensagem duplicada.`
                : `Idempotency-Key "${n.idempotencyKey}": a retry from your server never sends a duplicate.`}
          </p>
        </div>
      </div>
    </div>
  );
}
