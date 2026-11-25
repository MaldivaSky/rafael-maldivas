"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useExitIntent } from "../hooks/useExitIntent";
import { useLang, localePath } from "../lib/i18n";
import { origemParaEnvio } from "../lib/origem-client";
import { trackSiteEvent } from "../lib/analytics";

/**
 * "Antes de ir…" — só exit-intent no desktop após 45s, 1x por sessão.
 * Oferta entregável de verdade: a calculadora de custo 2026 (na hora) ou um
 * diagnóstico respondido pela engenharia no WhatsApp (grava em /api/lead).
 */
export default function ExitToast() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const { isTriggered, dismiss } = useExitIntent(45_000);
  const [whats, setWhats] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  if (!isTriggered) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (whats.replace(/\D/g, "").length < 10) return setState("error");
    setState("busy");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interesse: "exit-intent", contato: whats, dor: "Pediu contato da engenharia ao sair da home", idioma: lang, ...origemParaEnvio() }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        trackSiteEvent("lead_submit");
        setState("done");
      } else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="exit-toast" role="dialog" aria-modal="false" aria-labelledby="exit-t">
      <button type="button" className="atol-modal-x" onClick={dismiss} aria-label={pt ? "Fechar" : "Close"}>
        <X size={18} />
      </button>
      {state === "done" ? (
        <div role="status">
          <CheckCircle2 size={30} className="atol-ok" aria-hidden="true" />
          <h3 id="exit-t">{pt ? "Recebido!" : "Received!"}</h3>
          <p>{pt ? "A engenharia te chama no WhatsApp com o custo estimado para o seu caso." : "Engineering will message you on WhatsApp with the estimated cost for your case."}</p>
        </div>
      ) : (
        <>
          <h3 id="exit-t">{pt ? "Antes de ir…" : "Before you go…"}</h3>
          <p>
            {pt
              ? "Deixe seu WhatsApp e conte o que trava a sua operação: a engenharia responde com o caminho — produto pronto ou sob medida. Ou comece agora o curso gratuito com certificado."
              : "Leave your WhatsApp and tell us what's blocking your operation: engineering replies with the path — ready product or custom. Or start the free certified course now."}
          </p>
          <Link className="btn btn-primary" href={localePath("/cursos/construa-seu-marketplace", lang)} onClick={dismiss}>
            {pt ? "Ver o curso gratuito" : "See the free course"} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <form onSubmit={submit} className="exit-toast-form">
            <input
              value={whats}
              onChange={(e) => setWhats(e.target.value)}
              placeholder={pt ? "Seu WhatsApp com DDD" : "Your WhatsApp with area code"}
              aria-label="WhatsApp"
              inputMode="tel"
              autoComplete="tel"
            />
            <button type="submit" className="btn btn-ghost" disabled={state === "busy"}>
              {state === "busy" ? "…" : pt ? "Quero contato" : "Contact me"}
            </button>
          </form>
          {state === "error" && <p className="atol-err">{pt ? "Confira o número com DDD e tente de novo." : "Check the number and try again."}</p>}
        </>
      )}
    </div>
  );
}
