"use client";

import { Star } from "lucide-react";
import { Reveal } from "./fx";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  text: string;
}

const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: "fujiarte",
    name: "Fabricio Hashimoto",
    role: "Diretor de Operações",
    company: "Fujiarte Co., Ltd.",
    text: "A implementação do SelectSys Jobs mudou completamente nosso fluxo de trabalho. A automação nos poupou milhares de horas e trouxe uma clareza absurda para o recrutamento.",
  },
  {
    id: "miseon",
    name: "Chef Marcelo",
    role: "Proprietário",
    company: "Restaurante Central",
    text: "Antes eu não sabia minha margem real e tinha medo de precificar. Com o sistema, eu sei exatamente o custo de cada prato. Minha lucratividade aumentou 30% em dois meses.",
  },
  {
    id: "odontofix",
    name: "Dra. Camila Alves",
    role: "Sócia-Fundadora",
    company: "Clínica OdontoFix",
    text: "O tráfego orgânico que a nova estrutura de site trouxe lotou nossa agenda. O Rafael não entregou um site, ele entregou uma máquina de trazer pacientes.",
  }
];

export default function Testimonials() {
  return (
    <section style={{ padding: "100px 0", background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.03em" }}>
              O que dizem os clientes
            </h2>
            <p style={{ fontSize: "20px", color: "var(--fg-muted)", maxWidth: "600px", margin: "0 auto" }}>
              Resultados reais de empresas que decidiram profissionalizar sua presença digital e operações.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {DUMMY_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <div style={{ 
                background: "var(--surface)", 
                padding: "40px", 
                borderRadius: "24px", 
                border: "1px solid var(--line-strong)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>
                <div style={{ display: "flex", gap: "4px", color: "#f59e0b", marginBottom: "24px" }}>
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={20} fill="currentColor" />)}
                </div>
                
                <p style={{ fontSize: "18px", lineHeight: 1.6, color: "var(--fg)", marginBottom: "32px", flexGrow: 1, fontStyle: "italic" }}>
                  "{t.text}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "var(--fg-muted)" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--fg)" }}>{t.name}</div>
                    <div style={{ fontSize: "14px", color: "var(--fg-muted)" }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
