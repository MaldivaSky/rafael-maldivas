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
  // aceitos no banco a partir da migração em scripts/oracle/leads-schema.sql
  // (eventos_evento_check); antes dela a API registra erro e responde 204
  "product_click",
  "cert_click",
  "course_start",
  "course_syllabus",
  "atol_connect_click",
  "atol_signup",
  "atol_sandbox",
  "atol_priority_open",
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
  // conversões que não vêm de clique marcado vão também ao GA4 (cliques o SiteAnalytics já envia)
  const w = window as Window & { gtag?: (...a: unknown[]) => void };
  if (event === "lead_submit") w.gtag?.("event", "generate_lead", { page_path: path ?? window.location.pathname });
  else if (event === "briefing_start") w.gtag?.("event", "briefing_start");
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
