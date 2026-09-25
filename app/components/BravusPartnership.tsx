"use client";

import { CheckCircle2, ChevronRight, MonitorSmartphone, Receipt, Server } from "lucide-react";
import Image from "next/image";
import { Reveal, Spotlight } from "./fx";

export default function BravusPartnership() {
  return (
    <section id="bravus-partnership" style={{ padding: "120px 0", background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        
        {/* Header da Seção */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <Reveal>
            <div className="sec-tag" style={{ marginBottom: "24px", display: "inline-block", background: "rgba(2, 126, 246, 0.1)", color: "#027ef6", padding: "8px 16px", borderRadius: "100px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em" }}>
              PARCERIA ESTRATÉGICA
            </div>
            <h2 style={{ fontSize: "56px", fontWeight: 900, marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Solução Completa para <br />
              <span style={{ color: "#027ef6" }}>Food Service</span>
            </h2>
            <p style={{ fontSize: "20px", color: "var(--fg-muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              A inteligência do software <strong>MiseOn</strong> unida à robustez do hardware <strong>Bravus Core</strong> e <strong>Gertec</strong>.
              Entregamos desde o terminal de autoatendimento até a gestão de retaguarda para o seu restaurante.
            </p>
          </Reveal>
        </div>

        {/* Grid Principal de Apresentação */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "64px", alignItems: "center", marginBottom: "100px" }}>
          
          {/* Lado Esquerdo: Imagens dos Terminais */}
          <Reveal>
            <div style={{ display: "flex", gap: "16px", height: "100%", minHeight: "400px" }}>
              <div style={{ flex: 1, position: "relative", background: "var(--surface)", borderRadius: "24px", border: "1px solid var(--line)", overflow: "hidden" }}>
                <Image src="/partners/bravus-1.jpg" alt="Terminal Gertec" fill style={{ objectFit: "contain", padding: "8px" }} />
              </div>
              <div style={{ flex: 1, position: "relative", background: "var(--surface)", borderRadius: "24px", border: "1px solid var(--line)", overflow: "hidden" }}>
                <Image src="/partners/bravus-2.jpg" alt="Totem MiseOn" fill style={{ objectFit: "contain", padding: "8px" }} />
              </div>
            </div>
          </Reveal>

          {/* Lado Direito: Features da Solução Integrada */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "28px", fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>BRAVUS <span style={{ color: "#027ef6", fontWeight: 400 }}>CORE</span></h3>
                <span style={{ color: "var(--line-strong)" }}>|</span>
                <Image src="/logo-horiz-miseon.png" alt="MiseOn Logo" width={140} height={40} style={{ objectFit: "contain" }} />
              </div>
              
              <h3 style={{ fontSize: "32px", fontWeight: 800, lineHeight: 1.2 }}>
                Hardware e Software feitos para operarem juntos.
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <MonitorSmartphone size={24} color="#027ef6" style={{ flexShrink: 0, marginTop: "4px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Autoatendimento Inteligente</h4>
                    <p style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>Totens e terminais compactos rodando a interface otimizada do MiseOn. O cliente pede, paga e o pedido vai direto para a cozinha.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Receipt size={24} color="#027ef6" style={{ flexShrink: 0, marginTop: "4px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Pagamento e KDS Integrados</h4>
                    <p style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>Maquininha de cartão acoplada (Smart POS) com baixa automática no estoque e envio instantâneo para a tela de preparo (KDS).</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Server size={24} color="#027ef6" style={{ flexShrink: 0, marginTop: "4px" }} />
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Infraestrutura Bravus Core</h4>
                    <p style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>Equipamentos de grau comercial, suporte de ponta a ponta e processamento ultrarrápido para suportar o horário de pico sem travar.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Street Market Showcase */}
        <Reveal>
          <Spotlight style={{ borderRadius: "32px", border: "1px solid var(--line-strong)", padding: "64px", background: "var(--surface)", display: "flex", gap: "64px", alignItems: "center", overflow: "hidden", position: "relative" }}>
            <div style={{ flex: 1, zIndex: 2 }}>
              <h3 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "24px" }}>Do Restaurante Fino <br />ao Street Food</h3>
              <p style={{ fontSize: "18px", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: "32px" }}>
                Nossos terminais compactos com acabamento premium se adaptam a qualquer ambiente. Seja em um food truck ou em um restaurante de alta gastronomia, ofereça uma experiência de autoatendimento rápida, intuitiva e que aumenta o ticket médio.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: 600 }}><CheckCircle2 size={20} color="#22c55e" /> Redução de filas</li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: 600 }}><CheckCircle2 size={20} color="#22c55e" /> Aumento do ticket médio (upsell automático)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: 600 }}><CheckCircle2 size={20} color="#22c55e" /> Fechamento de caixa automatizado</li>
              </ul>
              <a href="#contato" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "16px", borderRadius: "12px", display: "inline-flex", gap: "12px" }}>
                Agendar uma demonstração <ChevronRight size={18} />
              </a>
            </div>
            <div style={{ flex: 1, position: "relative", height: "450px", borderRadius: "24px", overflow: "hidden", zIndex: 2, background: "var(--surface)", border: "1px solid var(--line)" }}>
              <Image src="/partners/bravus-3.jpg" alt="Terminal MiseOn em ambiente" fill style={{ objectFit: "contain", padding: "16px" }} />
            </div>
            {/* Background Blob */}
            <div style={{ position: "absolute", top: "50%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(2,126,246,0.15) 0%, rgba(0,0,0,0) 70%)", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }} />
          </Spotlight>
        </Reveal>

      </div>
    </section>
  );
}
