"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { t } from "../lib/content";
import { WHATSAPP } from "../lib/site";

export default function PersonalIntro({ about = false }: { about?: boolean }) {
  const { lang } = useLang();
  const pt = lang === "pt";
  const c = t[lang];
  const homeAnchor = (id: string) => about ? localePath(`/#${id}`, lang) : `#${id}`;
  return (
    <header className="personal-hero" id="top">
      <div className="wrap personal-grid">
        <div className="personal-copy">
          <div className="personal-eyebrow"><span />{pt ? "Rafael Maldivas / Maldivas Tech" : "Rafael Maldivas / Maldivas Tech"}</div>
          <h1>{about ? (pt ? "Sou Rafael." : "I’m Rafael.") : c.h1a}<br /><span className="hl">{about ? (pt ? "Prazer em conhecer você." : "Nice to meet you.") : c.h1b}</span></h1>
          <p className="personal-lead">{about ? (pt ? "Vendas, qualidade, processos, marcenaria, química e gastronomia fazem parte da minha história. Hoje trabalho com consultoria de tecnologia e desenvolvimento na minha empresa, a Maldivas Tech." : "Sales, quality, processes, woodworking, chemistry and gastronomy are part of my background. Today I work in technology consulting and development at my company, Maldivas Tech.") : c.lead}</p>
          <p className="personal-note">{pt ? "Gosto de entender o trabalho de quem me procura. O que toma tempo, o que dá problema e o que dá para fazer melhor." : "I like understanding the work of the people who reach out to me. What takes time, what causes problems and what we can improve."}</p>
          <div className="personal-actions">
            <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">{pt ? "Vamos conversar" : "Let’s talk"}<ArrowUpRight size={18} /></a>
            <Link className="personal-link" href={localePath(about ? "/portfolio" : "/servicos", lang)} data-analytics={about ? "portfolio_click" : "service_click"}>{about ? (pt ? "Conhecer meus projetos" : "Explore my projects") : (pt ? "Como posso ajudar" : "How I can help")}<ArrowUpRight size={17} /></Link>
          </div>
          <div className="personal-location"><MapPin size={14} />{pt ? "São Paulo · atendimento local e a distância" : "São Paulo · local and remote work"}</div>
        </div>
        <figure className="portrait-panel">
          <div className="portrait-frame"><Image src="/media/rafael-drone.jpg" alt={pt ? "Rafael Maldivas em campo, com o controle do drone" : "Rafael Maldivas in the field, holding a drone controller"} fill priority sizes="(max-width: 760px) 100vw, 45vw" quality={85} /></div>
          <span className="portrait-index" aria-hidden="true">01 / {pt ? "EM CAMPO" : "IN THE FIELD"}</span>
          <figcaption><span>{pt ? "Quem conversa com você também faz o trabalho." : "The person you talk to also does the work."}</span><strong>Rafael Maldivas</strong><small>{pt ? "Desenvolvimento · consultoria · audiovisual" : "Development · consulting · audiovisual"}</small></figcaption>
        </figure>
      </div>
      <div className="wrap personal-routes">
        <Link href={homeAnchor("produtos")}><span>01</span><div><strong>{pt ? "Ver sistemas e produtos" : "Explore systems and products"}</strong><small>{pt ? "O problema, a solução e a demonstração" : "The problem, solution and demo"}</small></div><ArrowUpRight size={20} /></Link>
        <Link href={homeAnchor("cases")}><span>02</span><div><strong>{pt ? "Ver projetos de clientes" : "See client projects"}</strong><small>{pt ? "Entregas e resultados documentados" : "Documented work and outcomes"}</small></div><ArrowUpRight size={20} /></Link>
        <Link href={homeAnchor("briefing")} data-analytics="contact_click"><span>03</span><div><strong>{pt ? "Descrever um projeto" : "Tell me about a project"}</strong><small>{pt ? "Receba uma conversa de escopo" : "Start a scoping conversation"}</small></div><ArrowUpRight size={20} /></Link>
      </div>
    </header>
  );
}
