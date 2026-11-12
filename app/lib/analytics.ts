import { origemParaEnvio, sessaoDaAba } from "./origem-client";

export const SITE_EVENTS = [
  "page_view",
  "page_exit",
  "contact_click",
  "service_click",
  "portfolio_click",
  "briefing_start",
  "lead_submit",
  "tool_click",
  "product_demo",
] as const;

export type SiteEvent = (typeof SITE_EVENTS)[number];

/**
 * First-party, sem cookie e sem ID persistente. Vai só: o nome fixo do
 * evento, a rota, um id de sessão que vive na aba (some ao fechá-la), a
 * origem (UTM/referrer, o servidor decide o canal) e, na saída da página, os
 * segundos em que ela esteve visível. Nada digitado pela pessoa.
 */
export function trackSiteEvent(event: SiteEvent, path?: string, segundos?: number) {
  if (typeof window === "undefined") return;
  const { origem, interno } = origemParaEnvio();
  const payload = JSON.stringify({
    event,
    path: path ?? window.location.pathname,
    sessao: sessaoDaAba(),
    origem,
    interno,
    ...(segundos !== undefined ? { segundos } : {}),
  });
  const body = new Blob([payload], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics", body)) return;
  void fetch("/api/analytics", {
    method: "POST",
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}
