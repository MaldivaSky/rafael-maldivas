"use client";

import { useState } from "react";
import { Check, MessageCircle, Send } from "lucide-react";
import type { Lang } from "@/app/lib/seo";
import { WHATSAPP } from "@/app/lib/site";
import { trackSiteEvent } from "@/app/lib/analytics";

const copy = {
  pt: {
    tag: "Lista de espera",
    title: "Avise-me quando os módulos 2 a 9 abrirem",
    desc: "Deixe seu contato para ser avisado da abertura das próximas turmas e novos módulos. Sem spam.",
    nameLabel: "Seu nome",
    namePh: "Ex.: Ana Souza",
    contactLabel: "WhatsApp ou e-mail",
    contactPh: "Ex.: (11) 99999-9999 ou ana@exemplo.com",
    profileLabel: "Qual é o seu momento atual? (opcional)",
    profilePh: "Ex.: dev back-end Python/Django querendo aprender pagamentos e produção",
    submit: "Entrar na lista de espera",
    sending: "Registrando…",
    sentTitle: "Contato registrado na lista de espera.",
    sentDesc: "Obrigado! Você receberá um aviso quando os módulos completos estiverem disponíveis.",
    orWhats: "Falar no WhatsApp",
    missingError: "Informe seu nome e um WhatsApp ou e-mail para contato.",
    privacy: "Seus dados são usados apenas para avisar sobre este curso.",
  },
  en: {
    tag: "Waitlist",
    title: "Notify me when modules 2–9 open",
    desc: "Leave your contact details to be notified when the full course modules open. No spam.",
    nameLabel: "Your name",
    namePh: "e.g. Alex Silva",
    contactLabel: "Email or WhatsApp",
    contactPh: "e.g. alex@example.com",
    profileLabel: "Current background (optional)",
    profilePh: "e.g. backend developer learning marketplace payments and production ops",
    submit: "Join waitlist",
    sending: "Sending…",
    sentTitle: "You are on the waitlist.",
    sentDesc: "Thank you! We will reach out when the full modules are released.",
    orWhats: "Message on WhatsApp",
    missingError: "Please enter your name and an email or WhatsApp contact.",
    privacy: "Your contact details are used solely to notify you about this course.",
  },
} as const;

export default function CourseWaitlistForm({
  lang,
  courseName,
}: {
  lang: Lang;
  courseName: string;
}) {
  const t = copy[lang];
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [perfil, setPerfil] = useState("");
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const whatsMsg =
    lang === "pt"
      ? `Olá Rafael! Quero entrar na lista de espera do curso "${courseName}". Meu nome é ${nome || "—"}.`
      : `Hi Rafael! I would like to join the waitlist for "${courseName}". My name is ${nome || "—"}.`;
  const whatsHref = `${WHATSAPP}?text=${encodeURIComponent(whatsMsg)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 2 || contato.trim().length < 4) {
      setError(t.missingError);
      return;
    }
    setError("");
    setSending(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          contato: contato.trim(),
          negocio: perfil.trim() || (lang === "pt" ? "Interessado no curso" : "Course waitlist"),
          dor: `Lista de espera — Curso: ${courseName}`,
          escolhas: [],
          prazo: "estudando",
          idioma: lang,
          honey,
        }),
      });
      const data = (await r.json()) as { ok?: boolean };
      if (data.ok) {
        trackSiteEvent("lead_submit");
        setSent(true);
      } else {
        trackSiteEvent("contact_click");
        window.open(whatsHref, "_blank", "noopener,noreferrer");
      }
    } catch {
      trackSiteEvent("contact_click");
      window.open(whatsHref, "_blank", "noopener,noreferrer");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="curso-waitlist-card">
      <div className="sec-tag">{t.tag}</div>
      <h3>{t.title}</h3>
      <p className="curso-muted">{t.desc}</p>

      {sent ? (
        <div className="curso-alert-ok" role="status" aria-live="polite">
          <Check size={20} />
          <div>
            <strong>{t.sentTitle}</strong>
            <p>{t.sentDesc}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="curso-form" noValidate>
          <div className="curso-honeypot" aria-hidden="true">
            <label htmlFor="curso-honey">Website</label>
            <input
              id="curso-honey"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </div>

          <div className="curso-form-grid">
            <div className="curso-field">
              <label htmlFor="waitlist-nome">{t.nameLabel}</label>
              <input
                id="waitlist-nome"
                type="text"
                required
                placeholder={t.namePh}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="curso-field">
              <label htmlFor="waitlist-contato">{t.contactLabel}</label>
              <input
                id="waitlist-contato"
                type="text"
                required
                placeholder={t.contactPh}
                value={contato}
                onChange={(e) => setContato(e.target.value)}
              />
            </div>
          </div>

          <div className="curso-field">
            <label htmlFor="waitlist-perfil">{t.profileLabel}</label>
            <input
              id="waitlist-perfil"
              type="text"
              placeholder={t.profilePh}
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            />
          </div>

          {error && (
            <p className="curso-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="cta-row">
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <Send size={16} />
              {sending ? t.sending : t.submit}
            </button>
            <a
              href={whatsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <MessageCircle size={16} />
              {t.orWhats}
            </a>
          </div>
          <p className="curso-fine">{t.privacy}</p>
        </form>
      )}
    </div>
  );
}
