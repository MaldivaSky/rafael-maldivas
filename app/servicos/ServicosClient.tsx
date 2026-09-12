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
  pt: {
    tag: "Serviços",
    h1a: "Primeiro eu entendo o problema. ",
    h1b: "O formato do contrato vem depois.",
    lead: "A conversa não começa por tabela de preço. Começa comigo entendendo o que está travando a sua operação e quanto isso está custando. Abaixo estão as quatorze frentes que eu atendo, separadas por tipo de trabalho — cada uma pode ser contratada sozinha.",
    note: "**O diagnóstico do processo e a primeira conversa não custam nada.** Eu preciso entender o seu negócio antes de saber o que proponho.",
    modelsTag: "Formas de contratar",
    modelsTitle: "Quatro formatos, escolhidos depois do diagnóstico",
    modelsLead: "Eu não empurro contrato mensal para todo mundo. Depois de ver a operação eu sei o tamanho real da demanda, e digo qual destes quatro resolve o seu caso. Às vezes é o menor deles.",
    modelsWho: "Serve para você se",
    start: "Fazer o levantamento",
    ctaTitle: "O que está travando a sua operação hoje?",
    ctaLead: "Preencha o levantamento acima, ou me chame direto. Eu marco uma visita ou uma chamada para ver o problema acontecendo.",
    ctaBtn: "Falar no WhatsApp",
    ctaAlt: "Chamar no LinkedIn",
    frentes: "frentes",
  },
  en: {
    tag: "Services",
    h1a: "First I understand the problem. ",
    h1b: "The contract format comes after.",
    lead: "The conversation doesn't start with a price list. It starts with me understanding what's blocking your operation and what it's costing. Below are the fourteen areas I work in, split by kind of work — each one can be hired on its own.",
    note: "**The process diagnosis and the first conversation are free.** I need to understand your business before I know what to propose.",
    modelsTag: "Ways to hire",
    modelsTitle: "Four formats, chosen after the diagnosis",
    modelsLead: "I don't push a retainer on everyone. After seeing the operation I know the real size of the demand, and I'll say which of these four fits. Sometimes it's the smallest one.",
    modelsWho: "This fits you if",
    start: "Start the discovery",
    ctaTitle: "What's blocking your operation today?",
    ctaLead: "Fill in the discovery form above, or message me directly. I'll set up a visit or a call to see the problem happening.",
    ctaBtn: "Message on WhatsApp",
    ctaAlt: "Reach out on LinkedIn",
    frentes: "areas",
  },
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
