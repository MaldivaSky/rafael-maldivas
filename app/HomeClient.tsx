"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Layout,
  MessageCircle,
  Server,
  ShieldCheck,
  Compass,
  Clapperboard,
} from "lucide-react";
import { useLang, localePath } from "./lib/i18n";
import { t } from "./lib/content";
import { rich } from "./lib/rich";
import { craftStack } from "./lib/credentials";
import { CANVA_REEL, GITHUB_USER, LINKEDIN, WHATSAPP, YOUTUBE, cdnIcon } from "./lib/site";
import PersonalIntro from "./components/PersonalIntro";
import CityStory from "./components/CityStory";
import StudioInvite from "./components/StudioInvite";
import PartnerBadges from "./components/PartnerBadges";
import ProductCards from "./components/ProductCards";
import Mission from "./components/Mission";
import VideoShowcase from "./components/VideoShowcase";
import BriefingForm from "./components/BriefingForm";
import CaseHighlights from "./components/CaseHighlights";
import { CountUp, Magnetic, Reveal, Spotlight, TechIcon } from "./components/fx";

const techs = [
  "python", "typescript", "react", "nextdotjs/white", "django/44B78B", "flask/white",
  "nodedotjs", "deno/70FFAF", "postgresql", "supabase", "redis", "docker",
  "tailwindcss", "pandas/E70488", "vercel/white", "threedotjs",
].map((s) => ({ n: s.split("/")[0], s: cdnIcon(s) }));
const allTechs = [...techs, { n: "Playwright", s: "/icons/playwright.svg" }];

const local = {
  pt: {
    mediaTag: "Audiovisual",
    mediaTitle: "Eu também filmo, edito e publico",
    mediaLead:
      "O sistema arruma a casa por dentro, mas não traz cliente sozinho. Eu faço as duas pontas: a vinheta da marca, a imagem aérea e o conteúdo que vai para as redes.",
    mediaBrand: ["Vinheta institucional", "Motion de marca em vídeo generativo, com pós-produção e trilha própria."],
    mediaDrone: ["Captação aérea com drone", "Piloto formado (ITARC, 2024). Imagem aérea de fachada, obra, evento e cidade."],
    mediaYT: ["Canal no YouTube", "Conteúdo em vídeo do MiseOn — tutorial, lançamento e material de apoio ao cliente."],
    mediaReel: ["Portfólio de vídeo", "Reel com os projetos de edição e motion."],
    craftTag: "Stack de criação",
    craftTitle: "Ferramentas que uso para criar",
    toolsTag: "Ferramentas gratuitas",
    toolsTitle: "Uma ajuda para o seu dia a dia",
    toolsLead:
      "Ferramentas gratuitas para conferir uma nota, calcular preços, consultar dados e preparar imagens. Escolha o que precisa e use, sem cadastro.",
    linkedinCta: "Ver meu perfil no LinkedIn",
  },
  en: {
    mediaTag: "Audiovisual",
    mediaTitle: "I also shoot, edit and publish",
    mediaLead:
      "Systems fix the process; content brings people into it. I deliver both — from brand idents to aerial footage.",
    mediaBrand: ["Brand ident", "Generative-video brand motion, with post-production and its own soundtrack."],
    mediaDrone: ["Aerial drone footage", "Certified pilot (ITARC, 2024). Aerial imagery of storefronts, sites, events and cities."],
    mediaYT: ["YouTube channel", "MiseOn video content — tutorials, launches and customer support material."],
    mediaReel: ["Video portfolio", "A reel of the editing and motion work."],
    craftTag: "Creation stack",
    craftTitle: "The tools I deliver in",
    toolsTag: "Free tools",
    toolsTitle: "Useful tools, ready to use.",
    toolsLead:
      "Free tools for checking invoices, calculating prices, looking up information and preparing images. Choose what you need and use it without an account.",
    linkedinCta: "See my LinkedIn profile",
  },
} as const;

export default function HomeClient() {
  const { lang } = useLang();
  const c = t[lang];
  const l = local[lang];

  return (
    <>
      {/* ---------- hero com o vídeo institucional ---------- */}
      <PersonalIntro />

      {/* ---------- oferta e demonstrações antes do conteúdo institucional ---------- */}
      <section id="produtos" className="home-proof-section">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.prodTag}</div>
            <h2>{c.prodTitle}</h2>
            <p className="sec-lead">{c.prodLead}</p>
          </Reveal>
          <ProductCards />
          <div style={{ marginTop: 34 }}>
            <Link className="btn btn-ghost" href={localePath("/portfolio", lang)} data-analytics="portfolio_click">
              {lang === "pt" ? "Ver o portfólio completo" : "See the full portfolio"} →
            </Link>
          </div>
        </div>
      </section>

      <CaseHighlights />

      <section id="metodo" className="home-method-section">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.howTag}</div>
            <h2>{c.howTitle}</h2>
            <p className="sec-lead">{c.howLead}</p>
          </Reveal>
          <div className="steps">
            {c.steps.map((s, i) => (
              <Reveal className="step" key={s.h} delay={i * 0.07}>
                <div className="step-n">{i + 1}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BriefingForm />

      <Mission />
      <PartnerBadges />

      {/* ---------- faixa de tecnologias ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...allTechs, ...allTechs].map((x, i) => (
            <div className="tech" key={i}>
              <TechIcon src={x.s} size={19} />
              {x.n}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- engenharia ---------- */}
      <section id="engenharia">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.engTag}</div>
            <h2>{c.engTitle}</h2>
            <p className="sec-lead">{c.engLead}</p>
          </Reveal>
          <div className="eng">
            {c.eng.map((e, i) => (
              <Reveal key={e.h} delay={i * 0.08}>
                <Spotlight className="eng-card">
                  <div className="eng-n">0{i + 1}</div>
                  <h3>{e.h}</h3>
                  <p>{e.p}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- capacidades ---------- */}
      <section id="capacidades" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.capTag}</div>
            <h2>{c.capTitle}</h2>
            <div style={{ height: 40 }} />
          </Reveal>
          <div className="caps">
            {c.caps.map((cap, i) => {
              const icons = [Compass, Layout, Server, ShieldCheck, LineChart, Clapperboard];
              const Ico = icons[i % icons.length];
              return (
                <Reveal className="cap-wrapper" key={cap.h} delay={i * 0.06}>
                  <details className="cap-details">
                    <summary className="cap-front">
                      <div className="cap-icon-box">
                        <Ico size={36} strokeWidth={1.5} />
                      </div>
                      <h3>{cap.h}</h3>
                      <div
                        style={{
                          marginTop: "auto",
                          color: "var(--accent)",
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          opacity: 0.6,
                        }}
                      >
                        {lang === "pt" ? "Ver tecnologias e atividades +" : "View technologies and activities +"}
                      </div>
                    </summary>
                    <div className="cap-back">
                      <h3>{cap.h}</h3>
                      <ul>
                        {cap.i.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CityStory />
      <VideoShowcase />

      {/* ---------- stack de criação ---------- */}
      <section id="criacao" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{l.craftTag}</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 32 }}>{l.craftTitle}</h2>
          </Reveal>
          <div className="craft">
            {craftStack.map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.04}>
                <div className="craft-item">
                  <TechIcon src={tool.icon} size={26} />
                  <div>
                    <div className="craft-name">{tool.name}</div>
                    <div className="craft-use">{tool.use[lang]}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ferramentas gratuitas ---------- */}
      <section id="ferramentas" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{l.toolsTag}</div>
            <h2>{l.toolsTitle}</h2>
            <p className="sec-lead">{l.toolsLead}</p>
          </Reveal>

          <StudioInvite />
          <div className="home-tools-link">
            <p>{lang === "pt" ? "Consultas, calculadoras e utilitários gratuitos, organizados em uma página própria." : "Free lookups, calculators and utilities, collected on a dedicated page."}</p>
            <Link className="btn btn-ghost" href={localePath("/ferramentas", lang)} data-analytics="tool_click">
              {lang === "pt" ? "Explorar todas as ferramentas" : "Explore all tools"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- método ---------- */}
      {/* ---------- contato ---------- */}
      <section id="contato">
        <div className="wrap">
          <Reveal>
            <Spotlight className="contact-box">
              <h2>{c.contactTitle}</h2>
              <p>{c.contactLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
                <Magnetic>
                  <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
                    <MessageCircle size={18} /> {c.contactBtn}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                    <TechIcon src="/icons/linkedin.svg" size={18} /> {l.linkedinCta}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={GITHUB_USER} target="_blank" rel="noopener noreferrer">
                    {c.ctaGh}
                  </a>
                </Magnetic>
              </div>
              <p className="contact-fine">{c.contactFine}</p>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
