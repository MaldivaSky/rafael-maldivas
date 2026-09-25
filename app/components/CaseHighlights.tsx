"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { works } from "../lib/projects";
import { useLang, localePath } from "../lib/i18n";
import { Reveal, Spotlight } from "./fx";

const copy = {
  pt: {
    tag: "Trabalho entregue",
    title: "Projetos que mostram o trabalho na prática",
    lead: "Cada exemplo descreve o contexto, a entrega e o resultado registrado. Sem métricas inventadas; os detalhes estão nas demonstrações.",
    open: "Abrir projeto",
    all: "Ver todos os projetos",
  },
  en: {
    tag: "Delivered work",
    title: "Projects that show the work in practice",
    lead: "Each example describes its context, delivery and documented outcome. No invented metrics; explore the live projects for details.",
    open: "Open project",
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
                  {work.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
                <div className="work-foot">
                  <a href={work.url} target="_blank" rel="noopener noreferrer" className="plink">
                    <ExternalLink size={16} /> {c.open}
                  </a>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <Link className="btn btn-ghost" href={localePath("/portfolio", lang)} data-analytics="portfolio_click">
          {c.all} <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
