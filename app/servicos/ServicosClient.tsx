"use client";

import {
  Code2,
  Compass,
  Layout,
  Mail,
  Megaphone,
  MessageCircle,
  Server,
} from "lucide-react";
import { hiringModels, packs } from "../lib/services";
import { useLang } from "../lib/i18n";
import { EMAIL, LINKEDIN, WHATSAPP } from "../lib/site";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const icons: Record<string, typeof Server> = {
  server: Server,
  mail: Mail,
  layout: Layout,
  megaphone: Megaphone,
  code: Code2,
  compass: Compass,
};

const copy = {
  pt: {
    tag: "Serviços",
    h1a: "Primeiro eu entendo o problema. ",
    h1b: "O formato do contrato vem depois.",
    lead: "A conversa não começa por tabela de preço. Começa comigo entendendo o que está travando a sua operação e quanto isso está custando. Só depois disso a gente fala de formato — e aí existem quatro, do projeto fechado à minha entrada no seu time.",
    note: "Qualquer um dos serviços abaixo pode vir sozinho ou junto com os outros. **O diagnóstico do processo e a primeira conversa não custam nada** — eu preciso entender o seu negócio antes de saber o que proponho.",
    modelsTag: "Formas de contratar",
    modelsTitle: "Quatro formatos, escolhidos depois do diagnóstico",
    modelsLead: "Eu não empurro contrato mensal para todo mundo. Depois de ver a operação eu sei o tamanho real da demanda, e digo qual destes quatro resolve o seu caso. Às vezes é o menor deles.",
    modelsWho: "Serve para você se",
    modelsHow: "Como funciona",
    promoTag: "Condição de lançamento",
    promoTitle: "Contratação exclusiva",
    promoBody: "Estou abrindo um número limitado de contratos mensais nesta fase, com condição de entrada diferenciada e prioridade de agenda. Quem entra agora trava a condição pelos 12 meses de vigência.",
    promoItems: [
      "Diagnóstico do processo sem custo, antes de qualquer proposta",
      "Sem taxa de implantação — a licença de uso do sistema já entra no valor",
      "Horas não utilizadas acumulam até 50% para o mês seguinte",
      "90 dias de garantia técnica sobre tudo que estava no escopo",
    ],
    ctaTitle: "O que está travando a sua operação hoje?",
    ctaLead: "Me conte em duas linhas o que está pegando. Eu marco uma visita ou uma chamada para ver o problema acontecendo. Se depois disso eu não for a melhor saída para o seu caso, eu falo isso na hora e indico quem faz melhor.",
    ctaBtn: "Falar no WhatsApp",
    ctaAlt: "Chamar no LinkedIn",
  },
  en: {
    tag: "Services",
    h1a: "Every business needs a different kind of help. ",
    h1b: "I work in all four.",
    lead: "Some people need a whole system and want the price fixed before anything starts. Some only need one screen fixed. Some companies want someone from tech around every month. And some teams just need one more senior dev inside them. I take on all four, and we pick together which one fits you.",
    note: "Any of the services below can come on its own or bundled. **Pricing on request** — the first conversation and the process diagnosis are free.",
    modelsTag: "Ways to hire",
    modelsTitle: "How you'd rather work with me",
    modelsLead: "I don't push a retainer on everyone. On the first call I look at the size of your demand and tell you which of these four is cheapest for you — even when the cheapest is the one I earn least from.",
    modelsWho: "This fits you if",
    modelsHow: "How it works",
    promoTag: "Launch terms",
    promoTitle: "Limited onboarding",
    promoBody: "I'm opening a limited number of monthly contracts in this phase, with preferential entry terms and schedule priority. Whoever joins now locks the terms for the full 12-month period.",
    promoItems: [
      "Free process diagnosis before any proposal",
      "No setup fee — the licence to the existing system is included",
      "Unused hours roll over up to 50% into the following month",
      "90 days of technical warranty on everything in scope",
    ],
    ctaTitle: "Which of these is blocking you today?",
    ctaLead: "Tell me about the operation in two lines. I'll reply saying whether I can solve it, what it costs and how long it takes — or point you to someone better suited.",
    ctaBtn: "Message on WhatsApp",
    ctaAlt: "Reach out on LinkedIn",
  },
} as const;

export default function ServicosClient() {
  const { lang } = useLang();
  const c = copy[lang];

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
                <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> {c.ctaBtn}
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </header>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="packs">
            {packs.map((pk, i) => {
              const Ico = icons[pk.icon] ?? Server;
              return (
                <Reveal key={pk.id} delay={i * 0.06}>
                  <Spotlight className={`pack ${pk.featured ? "pack-featured" : ""}`}>
                    <div className="pack-icon">
                      <Ico size={24} />
                    </div>
                    <h3>{pk.name[lang]}</h3>
                    <p className="pack-pitch">{pk.pitch[lang]}</p>
                    <ul>
                      {pk.items[lang].map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                    <div className="pack-outcome">{pk.outcome[lang]}</div>
                  </Spotlight>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

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

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="mission">
              <div className="sec-tag">{c.promoTag}</div>
              <h2 className="mission-quote" style={{ maxWidth: "18ch" }}>
                {c.promoTitle}
              </h2>
              <div className="mission-body">
                <p>{c.promoBody}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {c.promoItems.map((it) => (
                    <li key={it} style={{ display: "flex", gap: 10, color: "var(--fg-muted)", fontSize: 16 }}>
                      <span style={{ color: "var(--accent)" }}>▹</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contato" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <Spotlight className="contact-box">
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 0 }}>
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
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
