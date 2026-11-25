"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { WHATSAPP } from "../../lib/site";
import { trackSiteEvent } from "../../lib/analytics";
import { origemParaEnvio } from "../../lib/origem-client";

/**
 * Bloco 6 — contato B2B enxuto. 5 opções de software, 4 campos.
 * Grava no /api/lead (Oracle → Notion). Se falhar, o WhatsApp já sai com
 * a mensagem montada: o contato nunca se perde.
 * Aceita pré-seleção por ?interesse=<id> (ex.: vindo do connect.maldivastech.dev).
 */

const OPTIONS = [
  { id: "atol", pt: "Atol Connect — Lista Prioritária / Sandbox / Programa Parceiros", en: "Atol Connect — Priority list / Sandbox / Partner program" },
  { id: "miseon", pt: "MiseOn — Restaurante, Delivery ou Totem", en: "MiseOn — Restaurant, delivery or kiosk" },
  { id: "mercadinhosys", pt: "MercadinhoSys — Varejo com IA", en: "MercadinhoSys — AI retail" },
  { id: "selectsys", pt: "SelectSys Jobs — Agência / Empreiteira Brasil–Japão", en: "SelectSys Jobs — Brazil–Japan agency / contractor" },
  { id: "sob-medida", pt: "Software Sob Medida, Integrações API ou BI", en: "Custom software, API integrations or BI" },
] as const;

const ALIASES: Record<string, string> = { implantacao: "atol", "google-whatsapp": "atol", parceiro: "atol" };

export default function HomeContactForm() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [interesse, setInteresse] = useState<string>("");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whats, setWhats] = useState("");
  const [linha, setLinha] = useState("");
  const [honey, setHoney] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("interesse") ?? "";
    const id = ALIASES[q] ?? q;
    if (OPTIONS.some((o) => o.id === id)) setInteresse(id);
  }, []);

  const opt = OPTIONS.find((o) => o.id === interesse);
  const msg = [
    pt ? "Olá! Vim pelo site da Maldivas Tech." : "Hi! I came from the Maldivas Tech website.",
    opt && `\n${pt ? "Interesse" : "Interest"}: ${opt.pt}`,
    nome && `\n${pt ? "Nome" : "Name"}: ${nome}`,
    empresa && `\n${pt ? "Empresa" : "Company"}: ${empresa}`,
    linha && `\n${pt ? "Preciso de" : "I need"}: ${linha}`,
  ]
    .filter(Boolean)
    .join("");
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(msg)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!interesse) return setErr(pt ? "Escolha uma das 5 opções." : "Pick one of the 5 options.");
    if (whats.replace(/\D/g, "").length < 10) return setErr(pt ? "Informe o WhatsApp com DDD." : "Enter your WhatsApp with area code.");
    setBusy(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interesse, nome, empresa, contato: whats, dor: linha, idioma: lang, honey, ...origemParaEnvio() }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        trackSiteEvent("lead_submit");
        setDone(true);
      } else {
        setErr(pt ? "Não conseguimos registrar agora — siga pelo WhatsApp, a mensagem já está pronta." : "We couldn't save it — continue on WhatsApp, the message is ready.");
      }
    } catch {
      setErr(pt ? "Sem conexão com o servidor — siga pelo WhatsApp." : "No server connection — continue on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="h6-sec h6-contact" id="contato" aria-labelledby="h6-contato">
      <div className="wrap">
        <div className="h6-head">
          <span className="h6-kicker">{pt ? "CONTATO B2B · RESPOSTA DA ENGENHARIA" : "B2B CONTACT · ANSWERED BY ENGINEERING"}</span>
          <h2 id="h6-contato">{pt ? "Qual sistema vamos colocar para rodar primeiro?" : "Which system do we put to work first?"}</h2>
          <p>{pt ? "Sem robô de triagem infinita: você fala direto com quem desenha, implanta e responde pelo sistema." : "No endless triage bot: you talk directly to whoever designs, deploys and owns the system."}</p>
        </div>

        {done ? (
          <div className="h6-done" role="status">
            <Check size={28} aria-hidden="true" />
            <div>
              <strong>{pt ? "Recebido. Respondemos no WhatsApp informado." : "Received. We'll reply on the WhatsApp you provided."}</strong>
              <p>{pt ? "Quer adiantar? Continue a conversa agora:" : "Want to speed it up? Continue now:"}</p>
              <a className="btn btn-primary" href={waHref} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
                <MessageCircle size={17} aria-hidden="true" /> {pt ? "Falar no WhatsApp" : "Message on WhatsApp"}
              </a>
            </div>
          </div>
        ) : (
          <form className="h6-form" onSubmit={submit} noValidate>
            <fieldset className="h6-options">
              <legend>{pt ? "O que você precisa?" : "What do you need?"}</legend>
              {OPTIONS.map((o) => (
                <label key={o.id} className={`h6-opt${interesse === o.id ? " is-on" : ""}`}>
                  <input type="radio" name="interesse" value={o.id} checked={interesse === o.id} onChange={() => setInteresse(o.id)} />
                  <span>{o[lang]}</span>
                </label>
              ))}
            </fieldset>
            <div className="h6-fields">
              <div>
                <label htmlFor="hc-nome">{pt ? "Seu nome" : "Your name"}</label>
                <input id="hc-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" maxLength={120} />
              </div>
              <div>
                <label htmlFor="hc-emp">{pt ? "Nome da empresa" : "Company name"}</label>
                <input id="hc-emp" value={empresa} onChange={(e) => setEmpresa(e.target.value)} autoComplete="organization" maxLength={200} />
              </div>
              <div>
                <label htmlFor="hc-wa">WhatsApp *</label>
                <input id="hc-wa" value={whats} onChange={(e) => setWhats(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" required maxLength={30} />
              </div>
              <div className="is-wide">
                <label htmlFor="hc-linha">{pt ? "Conte em 1 linha o que precisa" : "Tell us in one line what you need"}</label>
                <input id="hc-linha" value={linha} onChange={(e) => setLinha(e.target.value)} maxLength={300} />
              </div>
              <input type="text" name="empresa_site" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="atol-hp" />
            </div>
            {err && (
              <p className="atol-err" role="alert">
                {err}{" "}
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp →
                </a>
              </p>
            )}
            <div className="h6-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? (pt ? "Enviando…" : "Sending…") : pt ? "Enviar para a engenharia" : "Send to engineering"} <ArrowRight size={17} aria-hidden="true" />
              </button>
              <a className="btn btn-ghost" href={waHref} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
                <MessageCircle size={17} aria-hidden="true" /> {pt ? "Prefiro chamar no WhatsApp" : "I'd rather use WhatsApp"}
              </a>
            </div>
            <p className="h6-fine">{pt ? "Seu contato é usado só para responder este pedido (LGPD)." : "Your contact is only used to answer this request (LGPD)."}</p>
          </form>
        )}
      </div>
    </section>
  );
}
