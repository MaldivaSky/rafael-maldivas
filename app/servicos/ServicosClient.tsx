"use client";

import {
  BarChart3,
  Clapperboard,
  Code2,
  Compass,
  Layout,
  Mail,
  Map,
  Megaphone,
  MessageCircle,
  Palette,
  PlaneTakeoff,
  Plug,
  Scissors,
  Server,
  Share2,
} from "lucide-react";
import { AREAS, servicos, type Area } from "../lib/catalog";
import { hiringModels } from "../lib/services";
import { useLang } from "../lib/i18n";
import { EMAIL, LINKEDIN, WHATSAPP } from "../lib/site";
import BriefingForm from "../components/BriefingForm";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const ICONS: Record<string, typeof Server> = {
  code: Code2,
  plug: Plug,
  chart: BarChart3,
  compass: Compass,
  server: Server,
  mail: Mail,
  layout: Layout,
  map: Map,
  megaphone: Megaphone,
  palette: Palette,
  clapper: Clapperboard,
  scissors: Scissors,
  drone: PlaneTakeoff,
  instagram: Share2,
};

const copy = {
  "pt": {
    "tag": "Serviços",
    "h1a": "Como posso ajudar ",
    "h1b": "a sua empresa.",
    "lead": "Desenvolvimento de sistemas, consultoria de TI, sites e produção de conteúdo. Você pode contratar um trabalho específico ou combinar acompanhamento para o que precisa de continuidade.",
    "note": "**A primeira conversa é gratuita.** Me conte o que você precisa para avaliarmos as possibilidades.",
    "modelsTag": "Formas de contratar",
    "modelsTitle": "Um formato que caiba no seu projeto",
    "modelsLead": "Podemos combinar uma entrega com escopo definido, horas de trabalho ou acompanhamento mensal. Prazo, responsabilidades e valores ficam na proposta.",
    "modelsWho": "Serve para você se",
    "start": "Contar o que preciso",
    "ctaTitle": "O que você precisa resolver?",
    "ctaLead": "Use o formulário ou me chame pelo WhatsApp. Podemos combinar uma chamada para conversar.",
    "ctaBtn": "Falar no WhatsApp",
    "ctaAlt": "Chamar no LinkedIn",
    "frentes": "frentes"
  },
  "en": {
    "tag": "Services",
    "h1a": "How I can help ",
    "h1b": "your business.",
    "lead": "Software development, IT consulting, websites and content production. Hire a specific service or arrange ongoing support.",
    "note": "**The first conversation is free.** Tell me what you need so we can look at the options.",
    "modelsTag": "Ways to hire",
    "modelsTitle": "An arrangement that fits your project",
    "modelsLead": "We can agree on a defined deliverable, hourly work or ongoing support. The proposal sets out the timeline, responsibilities and price.",
    "modelsWho": "This fits you if",
    "start": "Tell me what you need",
    "ctaTitle": "What do you need help with?",
    "ctaLead": "Use the form or message me on WhatsApp. We can arrange a call.",
    "ctaBtn": "Message on WhatsApp",
    "ctaAlt": "Reach out on LinkedIn",
    "frentes": "areas"
  }
} as const;

export default function ServicosClient() {
  const { lang } = useLang();
  const c = copy[lang];
  const areas = Object.keys(AREAS) as Area[];

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
            <p className="hero-note">
              {c.note.split("**").map((part, i) =>
                i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
              )}
            </p>
            <div className="cta-row">
              <Magnetic>
                <a className="btn btn-primary" href="#briefing">
                  {c.start} →
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-ghost" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> {c.ctaBtn}
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- serviços separados por tipo de trabalho ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {areas.map((area) => {
            const itens = servicos.filter((s) => s.area === area);
            return (
              <div className="area-block" key={area} id={area}>
                <Reveal>
                  <div className="area-head">
                    <h3>{AREAS[area][lang]}</h3>
                    <span className="area-count">
                      {itens.length} {c.frentes}
                    </span>
                    <p>{AREAS[area].lead[lang]}</p>
                  </div>
                </Reveal>

                <div className="area-grid">
                  {itens.map((s, i) => {
                    const Ico = ICONS[s.icon] ?? Server;
                    return (
                      <Reveal key={s.id} delay={i * 0.05}>
                        <Spotlight className="servico">
                          <div className="servico-top">
                            <span className="servico-icon">
                              <Ico size={21} />
                            </span>
                            <h4>{s.nome[lang]}</h4>
                          </div>
                          <p className="servico-resumo">{s.resumo[lang]}</p>
                          <ul>
                            {s.entrega[lang].map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                          <div className="servico-res">{s.resultado[lang]}</div>
                        </Spotlight>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <BriefingForm />

      {/* ---------- formas de contratar ---------- */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.modelsTag}</div>
            <h2>{c.modelsTitle}</h2>
            <p className="sec-lead">{c.modelsLead}</p>
          </Reveal>

          <div className="works">
            {hiringModels.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.06}>
                <Spotlight className="work">
                  <div className="work-client">{c.modelsWho}</div>
                  <h3>{m.name[lang]}</h3>
                  <div className="work-kind">{m.who[lang]}</div>
                  <p>{m.how[lang]}</p>
                  <div className="tags">
                    {m.terms[lang].map((tg) => (
                      <span className="tag" key={tg}>
                        {tg}
                      </span>
                    ))}
                  </div>
                </Spotlight>
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
