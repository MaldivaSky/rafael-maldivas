"use client";

import { ArrowRight, Building2, TrendingUp, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import { Reveal, Spotlight } from "./fx";

export default function EmpresasInvite() {
  return (
    <section style={{ padding: "120px 0", background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          
          <Reveal>
            <div className="sec-tag" style={{ marginBottom: "24px" }}>Para Empresas B2B</div>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Sua empresa está perdendo clientes para sites inferiores?
            </h2>
            <p style={{ fontSize: "20px", lineHeight: 1.6, color: "var(--fg-muted)", marginBottom: "40px" }}>
              Enquanto você depende de indicações e processos manuais, seus concorrentes usam a internet para capturar leads qualificados 24 horas por dia. Veja como transformo negócios através de sistemas e presença digital de alto nível.
            </p>
            
            <Link href="/pt/ferramentas/diagnostico-digital" className="btn btn-primary" style={{ padding: "20px 32px", fontSize: "18px", borderRadius: "12px", display: "inline-flex", gap: "12px" }}>
              Faça o Diagnóstico Digital Gratuito <ArrowRight size={20} />
            </Link>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <Spotlight style={{ padding: "32px", borderRadius: "24px", background: "var(--bg)", border: "1px solid var(--line)", display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "16px", borderRadius: "16px" }}>
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Conversão de Leads</h3>
                  <p style={{ fontSize: "16px", color: "var(--fg-muted)" }}>Sites focados em atrair e qualificar o decisor da empresa.</p>
                </div>
              </Spotlight>

              <Spotlight style={{ padding: "32px", borderRadius: "24px", background: "var(--bg)", border: "1px solid var(--line)", display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "16px", borderRadius: "16px" }}>
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Sistemas Internos (ERP/CRM)</h3>
                  <p style={{ fontSize: "16px", color: "var(--fg-muted)" }}>Automação que zera o trabalho braçal e centraliza a operação.</p>
                </div>
              </Spotlight>

              <Spotlight style={{ padding: "32px", borderRadius: "24px", background: "var(--bg)", border: "1px solid var(--line)", display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", padding: "16px", borderRadius: "16px" }}>
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Calculadora de ROI</h3>
                  <p style={{ fontSize: "16px", color: "var(--fg-muted)" }}>Mostre ao seu cliente exatamente quanto ele ganha investindo em você.</p>
                </div>
              </Spotlight>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
