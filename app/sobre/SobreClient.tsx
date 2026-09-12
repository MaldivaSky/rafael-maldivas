"use client";

import { MessageCircle } from "lucide-react";
import { useLang } from "../lib/i18n";
import { t } from "../lib/content";
import { rich } from "../lib/rich";
import { EMAIL, LINKEDIN, WHATSAPP } from "../lib/site";
import Mission from "../components/Mission";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const copy = {
  pt: {
    tag: "Sobre",
    h1a: "Quinze anos usando sistema ruim ",
    h1b: "antes de fazer o meu",
    lead: "Eu bati meta na rua com o sistema travando na minha mão, no meio da visita, com o cliente esperando. Foi ali que eu aprendi a enxergar onde o processo quebra de verdade — e é isso que eu levo para dentro de cada projeto hoje.",
    pathTag: "Trajetória",
    pathTitle: "De onde eu vim",
    path: [
      ["2007 — 2012", "Técnico em química e suporte técnico", "Laboratório, instrumentação analítica e atendimento a cliente — inclusive internacional. Foi aqui que eu aprendi a traduzir coisa técnica para quem não é técnico."],
      ["2015 — 2022", "Vendas externas — Heineken, Melhoramentos/Softys", "Seis anos batendo meta agressiva na Heineken e selecionado como mentor técnico no onboarding de novos vendedores. Rodei PDV, estoque, ruptura e merchandising na prática."],
      ["2022 — 2025", "Inteligência de mercado — Loft, GP Alimentos", "CRM Salesforce, qualificação de lead e migração de processo manual para dashboard em Power BI, cortando 40% do tempo de análise."],
      ["2024 — 2025", "Formação em tecnologia", "Análise e Desenvolvimento de Sistemas no IFSP, Marketing Digital pelo Google e pilotagem de drone pela ITARC."],
      ["2025 — hoje", "Instrutor de informática e facilitador digital", "Estruturei grade curricular de tecnologia e dei consultoria de dados a agricultores familiares, com planilhas de custo que aumentaram a rentabilidade deles."],
      ["2026 — hoje", "Maldivas Tech", "CNPJ próprio, contrato firmado com agência de recrutamento Brasil–Japão, verificação como Provedora de Tecnologia pela Meta e homologação no iFood."],
    ],
    stackTag: "Formação",
    stackTitle: "Formação e certificações",
    edu: [
      ["Tecnologia em Análise e Desenvolvimento de Sistemas", "IFSP — Instituto Federal de São Paulo"],
      ["Marketing Digital", "Google"],
      ["Pilotagem de Drone", "ITARC"],
      ["Técnico em Química", "ETEC Getúlio Vargas"],
      ["Idiomas", "Português nativo · Inglês avançado · Espanhol intermediário"],
    ],
    ctaTitle: "Vamos conversar?",
    ctaLead: "A primeira conversa não custa nada, e o diagnóstico da sua operação também não. Eu preciso ver o problema de perto antes de falar qualquer outra coisa. Se eu não for a melhor saída, eu digo isso na hora.",
    ctaBtn: "Falar no WhatsApp",
    ctaAlt: "Ver perfil no LinkedIn",
  },
  en: {
    tag: "About",
    h1a: "Fifteen years in sales before ",
    h1b: "writing the first line of code",
    lead: "That's why I start with the process, not the stack. I've been the guy who had to use the bad system out in the field.",
    pathTag: "Track record",
    pathTitle: "How I got here",
    path: [
      ["2007 — 2012", "Chemistry technician and technical support", "Lab work, analytical instrumentation and customer support, including international clients. This is where I learned to translate technical things for non-technical people."],
      ["2015 — 2022", "Field sales — Heineken, Melhoramentos/Softys", "Six years hitting aggressive targets at Heineken and picked as technical mentor for onboarding new reps. I lived POS, inventory, stockouts and merchandising firsthand."],
      ["2022 — 2025", "Market intelligence — Loft, GP Alimentos", "Salesforce CRM, lead qualification and migration from manual processes to Power BI dashboards, cutting analysis time by 40%."],
      ["2024 — 2025", "Technology education", "Systems Analysis and Development at IFSP, Digital Marketing by Google and drone piloting certified by ITARC."],
      ["2025 — today", "IT instructor and digital facilitator", "Built a technology curriculum and advised family farmers on data, with cost spreadsheets that raised their profitability."],
      ["2026 — today", "Maldivas Tech", "Own registered company, a signed contract with a Brazil–Japan recruitment agency, Meta Technology Provider verification and iFood approval."],
    ],
    stackTag: "Education",
    stackTitle: "Education and certifications",
    edu: [
      ["Technology in Systems Analysis and Development", "IFSP — Federal Institute of São Paulo"],
      ["Digital Marketing", "Google"],
      ["Drone Piloting", "ITARC"],
      ["Chemistry Technician", "ETEC Getúlio Vargas"],
      ["Languages", "Portuguese native · English advanced · Spanish intermediate"],
    ],
    ctaTitle: "Shall we talk?",
    ctaLead: "The first conversation and the process diagnosis are free. If I'm not the best fit for your case, I'll tell you in the first meeting.",
    ctaBtn: "Message on WhatsApp",
    ctaAlt: "View LinkedIn profile",
  },
} as const;

export default function SobreClient() {
  const { lang } = useLang();
  const c = copy[lang];
  const g = t[lang];

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.tag}</div>
            <h1>
              {c.h1a}
              <span className="hl">{c.h1b}</span>
            </h1>
            <p className="hero-lead">{c.lead}</p>
          </Reveal>
        </div>
      </header>

      <Mission />

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="about">
            {/* texto corrido sempre sobre uma superfície opaca */}
            <Reveal className="about-body plate">
              {g.aboutBody.map((p, i) => (
                <p key={i}>{rich(p)}</p>
              ))}
            </Reveal>

            <Reveal className="card-corp">
              <h3>{g.corp}</h3>
              {g.kv.map(([k, v]) => (
                <div className="kv" key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.pathTag}</div>
            <h2>{c.pathTitle}</h2>
            <div style={{ height: 34 }} />
          </Reveal>
          <div className="works">
            {c.path.map(([when, role, desc], i) => (
              <Reveal key={role} delay={i * 0.05}>
                <Spotlight className="work">
                  <div className="work-client">{when}</div>
                  <h3 style={{ fontSize: 21 }}>{role}</h3>
                  <p style={{ marginTop: 12, marginBottom: 0 }}>{desc}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.stackTag}</div>
            <h2>{c.stackTitle}</h2>
            <div style={{ height: 30 }} />
          </Reveal>
          <div className="perks">
            {c.edu.map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.05}>
                <div className="perk">
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <Spotlight className="contact-box">
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
                <Magnetic>
                  <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} /> {c.ctaBtn}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                    <TechIcon src="/icons/linkedin.svg" size={18} /> {c.ctaAlt}
                  </a>
                </Magnetic>
              </div>
              <p className="contact-fine">{EMAIL}</p>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
