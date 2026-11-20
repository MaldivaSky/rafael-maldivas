"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, ExternalLink, Sparkles } from "lucide-react";
import { works, workTags } from "../lib/projects";
import { useLang, localePath } from "../lib/i18n";
import { Reveal, Spotlight } from "./fx";
import { openPortfolioConcierge } from "./PortfolioConcierge";

const copy = {
  pt: {
    tag: "03 / TRABALHO ENTREGUE · CASOS REAIS",
    title: "Projetos que mostram o trabalho na prática",
    lead: "Cada entrega resolve um gargalo real de negócio — com link de demonstração em produção e transparência técnica.",
    open: "Abrir em produção",
    askAi: "Raio-X IA",
    ctaTitle: "Quer enxergar uma arquitetura parecida para a sua operação?",
    ctaSub: "Gere um plano técnico gratuito com o Arquiteto IA em 30 segundos ou explore todo o portfólio.",
    ctaPrimary: "Gerar Diagnóstico IA",
    all: "Ver todos os projetos",
  },
  en: {
    tag: "03 / DELIVERED WORK · REAL CASES",
    title: "Projects that show the work in practice",
    lead: "Every delivery solves an operational bottleneck — with live links and full architectural clarity.",
    open: "Open live project",
    askAi: "AI X-Ray",
    ctaTitle: "Want a similar architecture tailored to your business?",
    ctaSub: "Generate a free technical roadmap with our AI Architect in 30 seconds or browse the full portfolio.",
    ctaPrimary: "Generate AI Roadmap",
    all: "See all projects",
  },
} as const;

export default function CaseHighlights() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <section id="cases" aria-labelledby="case-highlights-title">
      <div className="wrap">
        <Reveal>
          <div className="sec-tag">{c.tag}</div>
          <h2 id="case-highlights-title">{c.title}</h2>
          <p className="sec-lead">{c.lead}</p>
        </Reveal>

        <div className="works">
          {works.slice(0, 3).map((work, index) => (
            <Reveal key={work.name} delay={index * 0.06}>
              <Spotlight className="work">
                <div className="work-client">{work.client[lang]}</div>
                <h3>{work.name}</h3>
                <div className="work-kind">{work.kind[lang]}</div>
                <p>{work.desc[lang]}</p>
                <div className="work-proof">{work.proof[lang]}</div>
                <div className="tags">
                  {workTags(work, lang).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="work-foot">
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="plink solid"
                    data-analytics="portfolio_click"
                  >
                    <ExternalLink size={16} />
                    <span>{c.open}</span>
                  </a>
                  <button
                    type="button"
                    className="plink"
                    onClick={() =>
                      openPortfolioConcierge(
                        lang === "pt"
                          ? `Como foi desenvolvido o projeto ${work.name} (${work.client[lang]})?`
                          : `How was ${work.name} built for ${work.client[lang]}?`,
                      )
                    }
                  >
                    <Bot size={15} aria-hidden="true" />
                    <span>{c.askAi}</span>
                  </button>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <div className="cases-conversion-bar">
          <div>
            <strong>{c.ctaTitle}</strong>
            <p>{c.ctaSub}</p>
          </div>
          <div className="cases-conversion-actions">
            <a href="#diagnostico" className="btn btn-primary">
              <Sparkles size={17} aria-hidden="true" />
              <span>{c.ctaPrimary}</span>
            </a>
            <Link
              className="btn btn-ghost"
              href={localePath("/portfolio", lang)}
              data-analytics="portfolio_click"
            >
              <span>{c.all}</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
