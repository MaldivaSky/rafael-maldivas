"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { NICHE_SEGMENTS } from "../../lib/atol-niches";
import { origemParaEnvio } from "../../lib/origem-client";
import { trackSiteEvent } from "../../lib/analytics";
import { WHATSAPP } from "../../lib/site";

type Lang = "pt" | "en";

const T = {
  pt: {
    title: "Acesso prioritário ao Atol Connect",
    lead: "Você entra na fila de liberação com 14 dias grátis contados a partir da ativação. Food service já pode operar hoje via MiseOn.",
    name: "Seu nome",
    contact: "WhatsApp ou e-mail",
    segment: "Segmento",
    segmentPh: "Escolha o segmento",
    other: "Outro",
    lines: "Quantas linhas (números) pretende conectar?",
    submit: "Reservar meu acesso",
    sending: "Enviando…",
    doneTitle: "Acesso reservado",
    done: "Você vai receber o aviso de liberação no contato informado. Quer adiantar? Fale com a engenharia no WhatsApp.",
    whats: "Falar no WhatsApp",
    close: "Fechar",
    errContact: "Informe um WhatsApp com DDD ou um e-mail válido.",
    errGeneric: "Não foi possível registrar agora. Use o WhatsApp abaixo — a reserva é feita na hora.",
    privacy: "Usamos o contato só para avisar a liberação. Sem spam.",
  },
  en: {
    title: "Priority access to Atol Connect",
    lead: "You join the release queue with 14 free days counted from activation. Food service can already operate today via MiseOn.",
    name: "Your name",
    contact: "WhatsApp or email",
    segment: "Industry",
    segmentPh: "Pick an industry",
    other: "Other",
    lines: "How many lines (numbers) do you plan to connect?",
    submit: "Reserve my access",
    sending: "Sending…",
    doneTitle: "Access reserved",
    done: "You'll get the release notice at the contact you provided. Want to speed it up? Talk to engineering on WhatsApp.",
    whats: "Message on WhatsApp",
    close: "Close",
    errContact: "Enter a WhatsApp number with area code or a valid email.",
    errGeneric: "We couldn't save it right now. Use WhatsApp below — the reservation is made instantly.",
    privacy: "We only use your contact to notify you about the release. No spam.",
  },
} as const;

const contatoValido = (v: string) => v.replace(/\D/g, "").length >= 10 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function PriorityAccess({
  lang,
  label,
  className = "btn btn-primary",
  source,
  defaultSegment = "",
}: {
  lang: Lang;
  label?: string;
  className?: string;
  /** de onde veio o clique (analytics + CRM) */
  source: string;
  defaultSegment?: string;
}) {
  const c = T[lang];
  const id = useId();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [segmento, setSegmento] = useState(defaultSegment);
  const [linhas, setLinhas] = useState(1);
  const [honey, setHoney] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open]);

  const segName = NICHE_SEGMENTS.find((s) => s.slug === segmento)?.name.pt ?? (segmento === "outro" ? "Outro" : "");
  const waText = encodeURIComponent(
    `Olá! Quero reservar acesso prioritário ao Atol Connect.${nome ? `\nNome: ${nome}` : ""}${segName ? `\nSegmento: ${segName}` : ""}\nLinhas: ${linhas}`,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!contatoValido(contato)) {
      setErr(c.errContact);
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interesse: "atol-prioritario",
          nome,
          contato,
          segmento: segName,
          linhas,
          dor: `Origem: ${source}`,
          idioma: lang,
          honey,
          ...origemParaEnvio(),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        trackSiteEvent("lead_submit");
        setDone(true);
      } else {
        setErr(c.errGeneric);
      }
    } catch {
      setErr(c.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        data-analytics="atol_priority_open"
        onClick={() => {
          setOpen(true);
          setDone(false);
          setErr(null);
        }}
      >
        {label ?? (lang === "pt" ? "Reservar Acesso Prioritário (14 dias grátis na liberação)" : "Reserve Priority Access (14 free days at release)")}
      </button>

      {open && (
        <div className="atol-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div ref={dialogRef} className="atol-modal" role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
            <button type="button" className="atol-modal-x" aria-label={c.close} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            {done ? (
              <div role="status">
                <CheckCircle2 size={36} className="atol-ok" aria-hidden="true" />
                <h3 id={`${id}-t`}>{c.doneTitle}</h3>
                <p>{c.done}</p>
                <div className="atol-modal-actions">
                  <a className="btn btn-primary" href={`${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
                    {c.whats}
                  </a>
                  <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                    {c.close}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 id={`${id}-t`}>{c.title}</h3>
                <p className="atol-modal-lead">{c.lead}</p>
                <label htmlFor={`${id}-n`}>{c.name}</label>
                <input id={`${id}-n`} value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" maxLength={120} />
                <label htmlFor={`${id}-c`}>{c.contact} *</label>
                <input id={`${id}-c`} value={contato} onChange={(e) => setContato(e.target.value)} autoComplete="tel" required maxLength={160} placeholder="(11) 99999-9999" />
                <div className="atol-modal-row">
                  <div>
                    <label htmlFor={`${id}-s`}>{c.segment}</label>
                    <select id={`${id}-s`} value={segmento} onChange={(e) => setSegmento(e.target.value)}>
                      <option value="">{c.segmentPh}</option>
                      {NICHE_SEGMENTS.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name[lang]}
                        </option>
                      ))}
                      <option value="outro">{c.other}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${id}-l`}>{c.lines}</label>
                    <input
                      id={`${id}-l`}
                      type="number"
                      min={1}
                      max={500}
                      value={linhas}
                      onChange={(e) => setLinhas(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="empresa_site"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="atol-hp"
                />
                {err && (
                  <p className="atol-err" role="alert">
                    {err}{" "}
                    <a href={`${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                      {c.whats} →
                    </a>
                  </p>
                )}
                <div className="atol-modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? c.sending : c.submit}
                  </button>
                </div>
                <p className="atol-fine">{c.privacy}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
