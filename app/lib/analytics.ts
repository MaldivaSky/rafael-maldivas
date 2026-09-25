export const SITE_EVENTS = [
  "page_view",
  "contact_click",
  "service_click",
  "portfolio_click",
  "briefing_start",
  "lead_submit",
  "tool_click",
  "product_demo",
] as const;

export type SiteEvent = (typeof SITE_EVENTS)[number];

/** First-party, cookieless event delivery. Only a route and a fixed event name are sent. */
export function trackSiteEvent(event: SiteEvent, path?: string) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ event, path: path ?? window.location.pathname });
  const body = new Blob([payload], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics", body)) return;
  void fetch("/api/analytics", {
    method: "POST",
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}
