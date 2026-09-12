"use client";

import { ExternalLink, MessageCircle } from "lucide-react";
import { works } from "../lib/projects";
import { useLang } from "../lib/i18n";
import { t } from "../lib/content";
import { CANVA_REEL, GITHUB_USER, WHATSAPP, YOUTUBE } from "../lib/site";
import ProductCards from "../components/ProductCards";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const copy = {
  pt: {
    tag: "Portfólio",
    h1a: "Cada um destes começou ",
    h1b: "com uma visita, não com um briefing",
    lead: "Antes de desenhar a primeira tela eu fui ver a operação por dentro: o caixa fechando, o pedido entrando, a nota saindo. É por isso que essas telas parecem com o dia de quem usa. Todo link desta página abre um sistema no ar, com cliente trabalhando nele agora.",
    saasTag: "Plataformas próprias",
    saasTitle: "Produto meu, que eu opero todo dia",
    worksTag: "Entregas a cliente",
    worksTitle: "Sistemas que outra pessoa usa para faturar",
    worksLead: "Nenhum deles é exercício de portfólio. Cada um começou num problema que estava custando dinheiro ao dono, e continua no ar porque virou parte da rotina da casa.",
    open: "Acessar o ambiente",
    mediaTag: "Audiovisual",
    mediaTitle: "Quem faz o sistema também faz o vídeo",
    mediaLead: "O sistema arruma a operação, mas não traz cliente sozinho. A maioria dos fornecedores entrega o site e manda você procurar uma agência. Aqui o vídeo, a imagem de drone e o post saem da mesma casa.",
    drone: ["Captação aérea — São Paulo", "Piloto formado (ITARC, 2024). Fachada, obra, evento e panorâmica urbana em 1080p."],
    brand: ["Vinheta da marca", "Motion em vídeo generativo com pós-produção — a mesma peça que abre a home."],
    pilot: ["Operação em campo", "Equipamento e piloto próprios — captação executada sem intermediários."],
    ctaTitle: "Qual destes gargalos é o seu?",
    ctaLead: "Me diga qual desses casos se parece mais com a sua casa. A partir daí eu já consigo falar de prazo e de preço logo na primeira conversa, sem custo.",
    ctaBtn: "Falar no WhatsApp",
  },
  en: {
    tag: "Portfolio",
    h1a: "What I've actually shipped ",
    h1b: "to production",
    lead: "SaaS platforms I operate, systems delivered to real clients, and the audiovisual production that promotes them. Every link below opens the real system — no mockups.",
    saasTag: "Own platforms",
    saasTitle: "SaaS I build and operate",
    worksTag: "Client deliveries",
    worksTitle: "Systems running inside someone else's operation",
    worksLead: "Smaller projects, each solving one specific bottleneck in a real business.",
    open: "Open the system",
    mediaTag: "Audiovisual",
    mediaTitle: "Video, drone and content",
    mediaLead: "The part that makes the system get found: brand films, aerial footage and social content.",
    drone: ["Aerial footage — São Paulo", "Certified pilot (ITARC, 2024). Storefronts, sites, events and urban panoramas in 1080p."],
    brand: ["Brand ident", "Generative-video motion with post-production — the same piece that opens the homepage."],
    pilot: ["Field operation", "The kit and the pilot are mine: no subcontracted capture."],
    ctaTitle: "Want one of these running in your business?",
    ctaLead: "Tell me which of the cases above looks most like your operation. From there I can size scope and timeline.",
    ctaBtn: "Message on WhatsApp",
  },
} as const;

export default function PortfolioClient() {
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

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.saasTag}</div>
            <h2>{c.saasTitle}</h2>
            <p className="sec-lead">{g.prodLead}</p>
          </Reveal>
          <ProductCards />
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.worksTag}</div>
            <h2>{c.worksTitle}</h2>
            <p className="sec-lead">{c.worksLead}</p>
          </Reveal>

          <div className="works">
            {works.map((w, i) => (
              <Reveal key={w.name} delay={i * 0.06}>
                <Spotlight className="work">
                  <div className="work-client">{w.client[lang]}</div>
                  <h3>{w.name}</h3>
                  <div className="work-kind">{w.kind[lang]}</div>
                  <p>{w.desc[lang]}</p>
                  <div className="work-proof">{w.proof[lang]}</div>
                  <div className="tags">
                    {w.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="work-foot">
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="plink">
                      <ExternalLink size={16} /> {c.open}
                    </a>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.mediaTag}</div>
            <h2>{c.mediaTitle}</h2>
            <p className="sec-lead">{c.mediaLead}</p>
          </Reveal>

          <div className="media-grid">
            <Reveal className="media-card">
              <video poster="/video/drone-sp-poster.jpg" autoPlay loop muted playsInline preload="none">
                <source src="/video/drone-sp.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.drone[0]}</h3>
                <p>{c.drone[1]}</p>
              </div>
            </Reveal>

            <div className="media-side">
              <Reveal className="media-card" delay={0.08}>
                <video
                  poster="/video/maldivas-hero-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                >
                  <source src="/video/maldivas-hero.webm" type="video/webm" />
                  <source src="/video/maldivas-hero.mp4" type="video/mp4" />
                </video>
                <div className="media-cap">
                  <h3>{c.brand[0]}</h3>
                  <p>{c.brand[1]}</p>
                </div>
              </Reveal>

              <Reveal className="media-card" delay={0.16}>
                <img src="/media/drone-pilot.jpg" alt="" />
                <div className="media-cap">
                  <h3>{c.pilot[0]}</h3>
                  <p>{c.pilot[1]}</p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="cta-row" style={{ marginTop: 28, marginBottom: 0 }}>
            <a className="btn btn-ghost" href={YOUTUBE} target="_blank" rel="noopener noreferrer">
              <TechIcon src="/icons/youtube.svg" size={18} /> YouTube
            </a>
            <a className="btn btn-ghost" href={CANVA_REEL} target="_blank" rel="noopener noreferrer">
              <TechIcon src="/icons/canva.svg" size={18} />
              {lang === "pt" ? "Reel de vídeo" : "Video reel"}
            </a>
            <a className="btn btn-ghost" href={GITHUB_USER} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
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
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
