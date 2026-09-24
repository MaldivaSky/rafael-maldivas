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
  return (
    <header className="personal-hero" id="top">
      <div className="wrap personal-grid">
        <div className="personal-copy">
          <div className="personal-eyebrow"><span />{pt ? "Rafael Maldivas / Maldivas Tech" : "Rafael Maldivas / Maldivas Tech"}</div>
          <h1>{about ? (pt ? "Sou Rafael." : "I’m Rafael.") : c.h1a}<br /><span className="hl">{about ? (pt ? "Prazer em conhecer você." : "Nice to meet you.") : c.h1b}</span></h1>
          <p className="personal-lead">{about ? (pt ? "Vendas, qualidade, processos, marcenaria, química e gastronomia fazem parte da minha história. Hoje trabalho com consultoria de tecnologia e desenvolvimento na minha empresa, a Maldivas Tech." : "Sales, quality, processes, woodworking, chemistry and gastronomy are part of my background. Today I work in technology consulting and development at my company, Maldivas Tech.") : c.lead}</p>
          <p className="personal-note">{pt ? "Gosto de entender o trabalho de quem me procura. O que toma tempo, o que dá problema e o que dá para fazer melhor." : "I like understanding the work of the people who reach out to me. What takes time, what causes problems and what we can improve."}</p>
          <div className="personal-actions">
            <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">{pt ? "Vamos conversar" : "Let’s talk"}<ArrowUpRight size={18} /></a>
            <Link className="personal-link" href={localePath(about ? "/portfolio" : "/servicos", lang)}>{about ? (pt ? "Conhecer meus projetos" : "Explore my projects") : (pt ? "Como posso ajudar" : "How I can help")}<ArrowUpRight size={17} /></Link>
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
        <Link href={localePath("/portfolio", lang)}><span>01</span><div><strong>{pt ? "Conheça os projetos" : "Explore the projects"}</strong><small>{pt ? "Software, clientes e trabalho técnico" : "Software, clients and technical work"}</small></div><ArrowUpRight size={20} /></Link>
        <Link href={localePath("/ferramentas", lang)}><span>02</span><div><strong>{pt ? "Use as ferramentas" : "Use the tools"}</strong><small>{pt ? "Cálculos, consultas e imagens — grátis" : "Calculators, lookups and images — free"}</small></div><ArrowUpRight size={20} /></Link>
        <Link href={about ? "#trajetoria" : localePath("/about", lang)}><span>03</span><div><strong>{pt ? "Veja minha trajetória" : "Get to know me"}</strong><small>{pt ? "Experiência, formação e contato" : "Experience, education and contact"}</small></div><ArrowUpRight size={20} /></Link>
      </div>
    </header>
  );
}
