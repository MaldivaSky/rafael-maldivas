"use client";

import { useLang } from "../lib/i18n";
import { ArrowUpRight, CheckCircle2, Globe2, FileText, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Reveal, Spotlight } from "../components/fx";
import Image from "next/image";

const c = {
  pt: {
    tag: "Case de Sucesso",
    title: "Fujiarte Co., Ltd.",
    subtitle: "A digitalização do recrutamento dekassegui com a plataforma SelectSys Jobs.",
    overview: "A Fujiarte Do Brasil, conectando sonhos entre Brasil e Japão há mais de 60 anos, precisava de uma solução robusta para gerenciar o complexo funil de contratação. Entregamos a plataforma SelectSys Jobs, garantindo compliance, rastreabilidade e escala sem perder o lado humano.",
    missionLabel: "O Cliente",
    missionTitle: "Além do recrutamento, um compromisso social",
    missionText: "Mais do que uma vaga de emprego, a Fujiarte oferece acolhimento, suporte e cuidado em cada etapa — do primeiro contato ao embarque, e além dele. Transformar vidas é o compromisso deles. O nosso compromisso foi criar um sistema capaz de suportar essa promessa com excelência operacional.",
    stats: [
      { label: "Operação", value: "Brasil → Japão" },
      { label: "História", value: "60+ Anos" },
      { label: "Plataforma", value: "SelectSys Jobs" },
      { label: "Integração OCR", value: "Nativa" },
    ],
    challengeTitle: "O Desafio",
    challengeText: "Para manter o cuidado e a atenção em um recrutamento internacional de alto volume, é essencial eliminar o caos burocrático. O controle estrito de documentação (passaportes, vistos, certidões), formulários extensos e múltiplas etapas de entrevista gera gargalos. Fazer isso por e-mail e planilhas paralelas toma um tempo precioso que a equipe poderia usar para dar suporte aos candidatos.",
    solutionTitle: "A Solução Tecnológica",
    solutionText: "Uma instância exclusiva e bilíngue do SelectSys Jobs. O ATS foi adaptado para ler documentos via Tesseract OCR, centralizar o pipeline de candidatos em um Kanban intuitivo e exportar planilhas rigorosamente formatadas via ExcelJS. A tecnologia removeu a carga braçal da equipe, permitindo focar no que importa: as pessoas.",
    features: [
      { icon: Globe2, title: "Recrutamento Bilíngue", desc: "Suporte ponta a ponta para processos seletivos internacionais com candidatos e recrutadores de diferentes origens." },
      { icon: FileText, title: "OCR & Documentos", desc: "Leitura automática de passaportes e documentos vitais, extraindo dados sem digitação manual." },
      { icon: Database, title: "Exportação ExcelJS", desc: "Geração de planilhas formatadas exatamente como os padrões rígidos exigidos pelo governo japonês e matriz." },
      { icon: ShieldCheck, title: "Compliance & LGPD", desc: "Auditoria nativa e retenção de dados configurável para garantir a proteção total das informações sensíveis dos candidatos." },
    ],
    cta: "Conhecer o SelectSys Jobs",
  },
  en: {
    tag: "Case Study",
    title: "Fujiarte Co., Ltd.",
    subtitle: "Digitalising cross-border recruitment with the SelectSys Jobs platform.",
    overview: "Fujiarte Do Brasil, connecting dreams between Brazil and Japan for over 60 years, needed a robust solution to manage the complex hiring funnel. We delivered the SelectSys Jobs platform, ensuring compliance, traceability and scale without losing the human touch.",
    missionLabel: "The Client",
    missionTitle: "Beyond recruitment, a social commitment",
    missionText: "More than just a job, Fujiarte offers welcoming support and care at every step — from the first contact to boarding, and beyond. Transforming lives is their commitment. Our commitment was to build a system capable of supporting that promise with operational excellence.",
    stats: [
      { label: "Operation", value: "Brazil → Japan" },
      { label: "History", value: "60+ Years" },
      { label: "Platform", value: "SelectSys Jobs" },
      { label: "OCR Integration", value: "Native" },
    ],
    challengeTitle: "The Challenge",
    challengeText: "To maintain care and attention in high-volume international recruitment, it is essential to eliminate bureaucratic chaos. The strict control of documentation (passports, visas, certificates), extensive forms and multiple interview stages creates bottlenecks. Managing this via email and spreadsheets takes precious time the team could be using to support candidates.",
    solutionTitle: "The Technological Solution",
    solutionText: "An exclusive, bilingual instance of SelectSys Jobs. The ATS was tailored to read documents via Tesseract OCR, centralise candidate pipelines in an intuitive Kanban and export strictly formatted spreadsheets via ExcelJS. Technology removed the manual burden, allowing the team to focus on what matters: the people.",
    features: [
      { icon: Globe2, title: "Bilingual Recruitment", desc: "End-to-end support for international hiring pipelines with candidates and recruiters of different backgrounds." },
      { icon: FileText, title: "OCR & Documents", desc: "Automatic reading of passports and vital documents, extracting data without manual typing." },
      { icon: Database, title: "ExcelJS Export", desc: "Generation of spreadsheets formatted exactly to the strict standards required by the Japanese government and headquarters." },
      { icon: ShieldCheck, title: "LGPD & GDPR Compliance", desc: "Native audit trails and configurable data retention to ensure total protection of candidates' sensitive information." },
    ],
    cta: "Discover SelectSys Jobs",
  }
};

export default function FujiarteCase() {
  const { lang } = useLang();
  const content = c[lang];

  return (
    <div className="case-study-page">
      {/* Hero Section */}
      <section className="case-hero" style={{ padding: "120px 0 80px", textAlign: "center", borderBottom: "1px solid var(--line)", background: "radial-gradient(ellipse at top, rgba(235, 15, 33, 0.05), transparent 70%)" }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag" style={{ margin: "0 auto 24px", color: "#d91f27", border: "1px solid #d91f27", background: "transparent" }}>
              {content.tag}
            </div>
            <h1 style={{ fontSize: "56px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "24px" }}>
              {content.title}
            </h1>
            <p style={{ fontSize: "21px", color: "var(--fg-muted)", maxWidth: "700px", margin: "0 auto 40px" }}>
              {content.subtitle}
            </p>
            <div className="case-hero-logo" style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              background: "var(--surface)", 
              padding: "24px", 
              borderRadius: "24px", 
              border: "1px solid var(--line-strong)",
              maxWidth: "400px",
              margin: "0 auto",
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)"
            }}>
              <img src="/clients/fujiarte.png" alt="Fujiarte Logo" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission Section (Added based on user material) */}
      {/* Mission Section (Added based on user material) */}
      <section style={{ padding: "100px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center" }}>
          <Reveal>
            <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}>
              <img src="/clients/fujiarte-poster.png" alt="Fujiarte: Além do recrutamento, um compromisso social" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="sec-tag" style={{ marginBottom: "24px", fontSize: "14px", padding: "8px 16px" }}>{content.missionLabel}</div>
            <h2 style={{ fontSize: "52px", fontWeight: 900, marginBottom: "32px", color: "#d91f27", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              {content.missionTitle}
            </h2>
            <p style={{ fontSize: "24px", lineHeight: 1.6, color: "var(--fg)", fontWeight: 400 }}>
              {content.missionText}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
            {content.stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: "40px", border: "1px solid var(--line-strong)", borderRadius: "24px", background: "var(--surface)", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--fg-dim)", marginBottom: "16px", fontWeight: 700 }}>{stat.label}</div>
                  <div style={{ fontSize: "48px", fontWeight: 900, color: "var(--fg)", letterSpacing: "-0.04em" }}>{stat.value}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "100px 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "start" }}>
          <Reveal>
            <div style={{ position: "sticky", top: "120px" }}>
              <h2 style={{ fontSize: "56px", fontWeight: 900, marginBottom: "32px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>{content.challengeTitle}</h2>
              <p style={{ fontSize: "24px", lineHeight: 1.6, color: "var(--fg)", fontWeight: 400 }}>{content.challengeText}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ background: "var(--surface)", padding: "64px", borderRadius: "32px", border: "1px solid var(--line-strong)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
              <h2 style={{ fontSize: "44px", fontWeight: 900, marginBottom: "32px", letterSpacing: "-0.03em" }}>{content.solutionTitle}</h2>
              <p style={{ fontSize: "22px", lineHeight: 1.6, color: "var(--fg-muted)", marginBottom: "48px", fontWeight: 400 }}>{content.solutionText}</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {content.features.map((feat, i) => (
                  <Spotlight key={i} className="feat-card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--line)", display: "flex", gap: "24px", alignItems: "flex-start", background: "var(--bg)" }}>
                    <div style={{ background: "rgba(217, 31, 39, 0.1)", padding: "16px", borderRadius: "16px", color: "#d91f27", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <feat.icon size={32} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px", color: "var(--fg)", letterSpacing: "-0.02em" }}>{feat.title}</h3>
                      <p style={{ fontSize: "18px", color: "var(--fg-muted)", lineHeight: 1.6, fontWeight: 400 }}>{feat.desc}</p>
                    </div>
                  </Spotlight>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0 120px", textAlign: "center" }}>
        <div className="wrap">
          <Reveal>
            <Link href={`/${lang}/produtos/selectsys-jobs`} className="btn btn-primary" style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 700, borderRadius: "12px" }}>
              {content.cta} <ArrowUpRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
