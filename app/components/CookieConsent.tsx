"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { useLang } from "../lib/i18n";
import { Reveal } from "./fx";

export default function CookieConsent() {
  const { lang } = useLang();
  const pt = lang === "pt";

  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        // Delay para não interferir na primeira renderização / LCP
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback seguro em caso de bloqueio de localStorage (modo anônimo estrito)
    }
  }, []);

  if (!show) return null;

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("cookie_consent", "all");
    } catch {}
    setShow(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("cookie_consent", "essential");
    } catch {}
    setShow(false);
  };

  return (
    <aside
      aria-label={pt ? "Aviso de privacidade e cookies" : "Privacy and cookies consent"}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
        maxWidth: "420px",
        width: "calc(100% - 40px)",
      }}
    >
      <Reveal y={20}>
        <div
          style={{
            background: "var(--surface)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid var(--line-strong)",
            borderRadius: "16px",
            padding: "20px 22px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--fg)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "var(--accent-glow, rgba(1, 129, 238, 0.13))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cookie size={18} color="var(--accent-bright, #01A9EF)" />
              </div>
              <h4 style={{ fontWeight: 700, margin: 0, fontSize: "15px" }}>
                {pt ? "Privacidade e Cookies" : "Privacy & Cookies"}
              </h4>
            </div>
            <button
              onClick={handleEssentialOnly}
              style={{
                background: "none",
                border: "none",
                color: "var(--fg-muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
              }}
              aria-label={pt ? "Fechar aviso" : "Close notice"}
            >
              <X size={16} />
            </button>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "var(--fg-muted)",
              lineHeight: 1.55,
            }}
          >
            {pt
              ? "Utilizamos cookies e tecnologias essenciais para garantir o funcionamento seguro do site, medir audiência e aprimorar sua experiência. Você pode aceitar todos ou manter apenas os estritamente necessários."
              : "We use essential cookies and telemetry to ensure site security, analyze traffic and enhance your experience. You can accept all or keep essential only."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "4px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleAcceptAll}
              style={{
                flex: "1 1 140px",
                padding: "9px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                background: "var(--accent, #0166BB)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              {pt ? "Aceitar todos" : "Accept all"}
            </button>
            <button
              onClick={handleEssentialOnly}
              style={{
                flex: "1 1 130px",
                padding: "9px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                background: "var(--surface-2, rgba(255,255,255,0.06))",
                color: "var(--fg, #EEF3FA)",
                border: "1px solid var(--line, rgba(255,255,255,0.1))",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              {pt ? "Apenas essenciais" : "Essential only"}
            </button>
          </div>
        </div>
      </Reveal>
    </aside>
  );
}
