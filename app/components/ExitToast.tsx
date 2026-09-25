"use client";

import { useExitIntent } from "../hooks/useExitIntent";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Spotlight } from "./fx";

export default function ExitToast() {
  const { isTriggered, dismiss } = useExitIntent(120000, true); // 2 minutos ou exit
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isTriggered) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Aqui integraria com a API Route do Resend
      setSubmitted(true);
      setTimeout(() => dismiss(), 3000);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      maxWidth: "400px",
      width: "calc(100% - 48px)",
      animation: "slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      <Spotlight className="exit-toast" style={{ 
        background: "var(--surface)", 
        borderRadius: "24px", 
        border: "1px solid var(--line-strong)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        padding: "32px",
        position: "relative"
      }}>
        <button 
          onClick={dismiss}
          style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "var(--fg-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px", color: "var(--fg)" }}>
              Antes de ir...
            </h3>
            <p style={{ fontSize: "15px", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
              Receba um checklist gratuito de 12 pontos para avaliar se a presença digital da sua empresa está perdendo dinheiro.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input 
                type="email" 
                placeholder="Seu melhor e-mail corporativo" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "15px"
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "16px", width: "100%", justifyContent: "center" }}>
                Receber Checklist <ArrowRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ color: "#22c55e", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px", color: "var(--fg)" }}>Enviado!</h3>
            <p style={{ fontSize: "15px", color: "var(--fg-muted)" }}>Cheque sua caixa de entrada em alguns instantes.</p>
          </div>
        )}
      </Spotlight>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
