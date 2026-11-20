"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";
import type { ConciergeAgentResult } from "../lib/ai-agent-core";

const QUICK_PROMPTS = {
  pt: [
    "Como funciona o MiseOn + Totens Bravus?",
    "Como foi construído o SelectSys Jobs (Fujiarte)?",
    "Qual a arquitetura fiscal do mercadinhosys?",
    "Como contratar a Maldivas Tech para um sistema?",
  ],
  en: [
    "How do MiseOn + Bravus kiosks work?",
    "How was SelectSys Jobs (Fujiarte) architected?",
    "What is mercadinhosys's fiscal & BI architecture?",
    "How can we hire Maldivas Tech?",
  ],
} as const;

export function openPortfolioConcierge(initialQuestion?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("maldivas:open-concierge", {
      detail: { question: initialQuestion ?? "" },
    }),
  );
}

export default function PortfolioConcierge() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const pathname = usePathname() || "/";

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ConciergeAgentResult | null>(null);

  async function askAgent(queryText: string) {
    const clean = queryText.trim();
    if (clean.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agent/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: clean,
          lang,
          contextPath: pathname,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        data?: ConciergeAgentResult;
        reason?: string;
      };
      if (!res.ok || !json.ok || !json.data) {
        setError(
          res.status === 429
            ? pt
              ? "Muitas perguntas seguidas. Aguarde um instante."
              : "Too many requests. Please wait a moment."
            : pt
              ? "Não consegui consultar o agente agora. Tente novamente."
              : "Could not reach the agent right now. Please try again.",
        );
        return;
      }
      setResult(json.data);
    } catch {
      setError(
        pt
          ? "Falha de conexão ao consultar o Agente IA."
          : "Connection failed while reaching the AI Agent.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const onOpen = (ev: Event) => {
      const custom = ev as CustomEvent<{ question?: string }>;
      setOpen(true);
      const q = custom.detail?.question?.trim();
      if (q) {
        setQuestion(q);
        void askAgent(q);
      }
    };
    window.addEventListener("maldivas:open-concierge", onOpen);
    return () => window.removeEventListener("maldivas:open-concierge", onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, pathname]);

  return (
    <>
      <button
        type="button"
        className="concierge-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="maldivas-concierge-drawer"
      >
        <span className="concierge-fab-dot" aria-hidden="true" />
        <Bot size={18} aria-hidden="true" />
        <span>{pt ? "Agente IA · Projetos & B2B" : "AI Agent · Projects & B2B"}</span>
      </button>

      {open && (
        <aside
          id="maldivas-concierge-drawer"
          className="concierge-drawer"
          aria-label={pt ? "Concierge Técnico IA" : "Technical AI Concierge"}
        >
          <div className="concierge-head">
            <div className="concierge-title-wrap">
              <span className="concierge-badge">
                <Sparkles size={13} aria-hidden="true" />
                {pt ? "Concierge IA · Portfólio & B2B" : "AI Concierge · Portfolio & B2B"}
              </span>
              <h3>{pt ? "Tire dúvidas sobre nossos sistemas" : "Ask about our systems & stack"}</h3>
            </div>
            <button
              type="button"
              className="concierge-close"
              onClick={() => setOpen(false)}
              aria-label={pt ? "Fechar assistente" : "Close assistant"}
            >
              <X size={18} />
            </button>
          </div>

          <div className="concierge-body">
            <div className="concierge-prompts">
              {QUICK_PROMPTS[lang].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="concierge-chip"
                  onClick={() => {
                    setQuestion(prompt);
                    void askAgent(prompt);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="concierge-form"
              onSubmit={(e) => {
                e.preventDefault();
                void askAgent(question);
              }}
            >
              <label htmlFor="concierge-input" className="sr-only">
                {pt ? "Pergunte sobre projetos, arquitetura ou contratação" : "Ask about projects, architecture or hiring"}
              </label>
              <input
                id="concierge-input"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  pt
                    ? "Ex.: Como vocês fazem emissão NFC-e ou integração iFood?"
                    : "e.g. How do you handle fiscal POS or iFood API?"
                }
                maxLength={400}
              />
              <button
                type="submit"
                className="concierge-send"
                disabled={loading || question.trim().length < 2}
                aria-label={pt ? "Perguntar ao agente" : "Ask agent"}
              >
                {loading ? <Loader2 size={17} className="spin" /> : <Send size={17} />}
              </button>
            </form>

            {error && (
              <div className="concierge-error" role="alert">
                {error}
              </div>
            )}

            {loading && !result && (
              <div className="concierge-skeleton" aria-busy="true">
                <div className="concierge-skel-line" />
                <div className="concierge-skel-line is-short" />
                <div className="concierge-skel-line" />
              </div>
            )}

            {result && (
              <div className="concierge-answer" aria-live="polite">
                <div className="concierge-answer-meta">
                  <span>
                    {result.source === "gemini"
                      ? `Gemini (${result.model ?? "Flash"})`
                      : pt
                        ? "Base Verificada Maldivas Tech"
                        : "Verified Maldivas Knowledge"}
                  </span>
                </div>
                <p>{result.answer}</p>
                {result.highlights.length > 0 && (
                  <ul className="concierge-highlights">
                    {result.highlights.map((h) => (
                      <li key={h}>
                        <CheckCircle2 size={14} aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="concierge-actions">
                  <Link
                    href={localePath(result.recommendedRoute.replace(/^\/(pt|en)/, ""), lang)}
                    className="btn btn-ghost concierge-action-btn"
                    onClick={() => setOpen(false)}
                  >
                    <span>{result.recommendedRouteLabel}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                  <a
                    href={`${WHATSAPP}?text=${encodeURIComponent(result.whatsappPrefill)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary concierge-action-btn"
                    data-analytics="contact_click"
                  >
                    <MessageCircle size={15} />
                    <span>{pt ? "Levar ao WhatsApp" : "Continue on WhatsApp"}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

