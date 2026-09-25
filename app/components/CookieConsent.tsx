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
    // Verifica se já aceitou
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Delay pequeno para não atrapalhar o carregamento inicial da página
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "24px",
      zIndex: 9999,
      maxWidth: "400px",
      width: "calc(100% - 48px)"
    }}>
      <Reveal y={20}>
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--line-strong)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--fg)" }}>
              <Cookie size={20} color="#027ef6" />
              <h4 style={{ fontWeight: 700, margin: 0, fontSize: "16px" }}>
                {pt ? "Privacidade e Cookies" : "Privacy & Cookies"}
              </h4>
            </div>
            <button 
              onClick={() => setShow(false)}
              style={{ background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", padding: "4px" }}
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
          
          <p style={{ margin: 0, fontSize: "14px", color: "var(--fg-muted)", lineHeight: 1.5 }}>
            {pt 
              ? "Utilizamos cookies para analisar o tráfego e personalizar sua experiência. Ao continuar navegando, você concorda com a nossa política."
              : "We use cookies to analyze traffic and personalize your experience. By continuing to browse, you agree to our policy."}
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button 
              onClick={handleAccept}
              className="btn btn-primary"
              style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "14px", background: "#027ef6", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              {pt ? "Aceitar e fechar" : "Accept & close"}
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
