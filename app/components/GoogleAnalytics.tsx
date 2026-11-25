"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics 4 com Consent Mode v2 (LGPD).
 *
 * - Só carrega se NEXT_PUBLIC_GA_ID estiver definido (G-XXXXXXXXXX).
 * - Consentimento começa NEGADO: sem cookie de analytics até o visitante
 *   clicar em "Aceitar todos" no aviso (CookieConsent dispara
 *   "maldivas:consent"). Escolha anterior é lida do localStorage.
 * - App Router não recarrega a página: page_view é enviado a cada rota.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export const CONSENT_EVENT = "maldivas:consent";

/** Envia um evento ao GA4 se ele estiver ativo (no-op caso contrário). */
export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag && GA_ID) window.gtag("event", name, params);
}

function grantFor(choice: string | null) {
  return choice === "all" ? "granted" : "denied";
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_ID) return;
    const onConsent = (e: Event) => {
      const v = grantFor((e as CustomEvent<string>).detail);
      window.gtag?.("consent", "update", { analytics_storage: v });
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (!GA_ID || !pathname || last.current === pathname) return;
    last.current = pathname;
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  // Ordem garantida por construção: consent default → config → só então injeta o gtag.js.
  return (
    <Script id="ga-consent-default" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem("cookie_consent")}catch(e){}
gtag("consent","default",{analytics_storage:c==="all"?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});
gtag("js",new Date());gtag("config","${GA_ID}",{send_page_view:false,anonymize_ip:true});
var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}";document.head.appendChild(s);`}
    </Script>
  );
}
