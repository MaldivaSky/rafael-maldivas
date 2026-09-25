
"use client";

import { ExternalLink, MessageCircle, ArrowUpRight } from "lucide-react";
import { works } from "../lib/projects";
import { useLang } from "../lib/i18n";
import { t } from "../lib/content";
import { CANVA_REEL, GITHUB_USER, WHATSAPP, YOUTUBE } from "../lib/site";
import ProductCards from "../components/ProductCards";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const copy = {
  "pt": {
    "tag": "Portfólio",
    "h1a": "Uma seleção ",
    "h1b": "do meu trabalho.",
    "lead": "Sistemas próprios, projetos para clientes e produção audiovisual. Em cada trabalho, você encontra o contexto, as tecnologias e o link para conhecer.",
    "saasTag": "Plataformas próprias",
    "saasTitle": "Meus projetos de software",
    "worksTag": "Entregas a cliente",
    "worksTitle": "Projetos para clientes",
    "worksLead": "Agendamento, sites e análise de dados: trabalhos com necessidades e entregas diferentes.",
    "open": "Acessar o ambiente",
    "mediaTag": "Audiovisual",
    "mediaTitle": "Também trabalho com imagem",
    "mediaLead": "Captação com drone, edição e conteúdo para apresentar negócios e produtos. Aqui estão alguns registros do meu trabalho.",
    "drone": [
      "Captação aérea — São Paulo",
      "Piloto formado (ITARC, 2024). Fachada, obra, evento e panorâmica urbana em 1080p."
    ],
    "brand": [
      "Vinheta da marca",
      "Motion em vídeo generativo com pós-produção — a mesma peça que abre a home."
    ],
    "pilot": [
      "Operação em campo",
      "Equipamento e piloto próprios — captação executada sem intermediários."
    ],
    "supermarket": [
      "Vídeo Promocional — Varejo",
      "Captação e edição focada na jornada do cliente em ambiente de varejo (supermercados)."
    ],
    "camera_ai": [
      "Imersão IA — Geração de Cena",
      "Experimentos de inteligência artificial aplicados à direção de arte e criação de mundos digitais."
    ],
    "casinhaamor": [
      "Casinha Amor — Marketing Digital",
      "Produção audiovisual focada no acolhimento e impacto social da instituição."
    ],
    "ctaTitle": "Tem um projeto em mente?",
    "ctaLead": "Me conte o que você quer fazer. Podemos conversar sobre as possibilidades e o tamanho do trabalho.",
    "ctaBtn": "Falar no WhatsApp"
  },
  "en": {
    "tag": "Portfolio",
    "h1a": "A selection ",
    "h1b": "of my work.",
    "lead": "My software products, client projects and audiovisual work. Explore the context, technologies and links for each project.",
    "saasTag": "Own platforms",
    "saasTitle": "SaaS I build and operate",
    "worksTag": "Client deliveries",
    "worksTitle": "Systems running inside someone else's operation",
    "worksLead": "Booking systems, websites and data analysis for different business needs.",
    "open": "Open the system",
    "mediaTag": "Audiovisual",
    "mediaTitle": "Video, drone and content",
    "mediaLead": "The part that makes the system get found: brand films, aerial footage and social content.",
    "drone": [
      "Aerial footage — São Paulo",
      "Certified pilot (ITARC, 2024). Storefronts, sites, events and urban panoramas in 1080p."
    ],
    "brand": [
      "Brand ident",
      "Generative-video motion with post-production — the same piece that opens the homepage."
    ],
    "pilot": [
      "Field operation",
      "The kit and the pilot are mine: no subcontracted capture."
    ],
    "ctaTitle": "Have a project in mind?",
    "ctaLead": "Tell me what you want to build. We can discuss the options and scope.",
    "ctaBtn": "Message on WhatsApp"
  }
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

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="wrap">
          <Reveal>
            <Spotlight className="highlight-banner" style={{ display: "flex", flexWrap: "wrap", gap: "40px", padding: "48px", borderRadius: "24px", background: "var(--surface)", border: "1px solid var(--line-strong)", alignItems: "center" }}>
              <div style={{ flex: "1 1 300px" }}>
                <div className="sec-tag" style={{ color: "#d91f27", border: "1px solid #d91f27", background: "transparent", display: "inline-block", marginBottom: "16px" }}>
                  {lang === "pt" ? "Case em Destaque" : "Featured Case Study"}
                </div>
                <h2 style={{ fontSize: "36px", marginBottom: "16px" }}>Fujiarte Co., Ltd.</h2>
                <p style={{ fontSize: "16px", color: "var(--fg-muted)", lineHeight: 1.7, marginBottom: "32px" }}>
                  {lang === "pt" ? 
                    "A digitalização do recrutamento Brasil–Japão. Conectando sonhos e mantendo o compromisso social de suporte e acolhimento através do SelectSys Jobs." : 
                    "Digitalising Brazil-Japan recruitment. Connecting dreams and maintaining the social commitment of support and care through SelectSys Jobs."}
                </p>
                <a href={`/${lang}/portfolio/fujiarte`} className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  {lang === "pt" ? "Ver Case Completo" : "Read Full Case Study"} <ArrowUpRight size={18} />
                </a>
              </div>
              <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "24px", background: "var(--bg)", borderRadius: "16px", border: "1px solid var(--line)", width: "100%", maxWidth: "300px" }}>
                  <img src="/clients/fujiarte.png" alt="Fujiarte Logo" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
                </div>
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </section>

      <section id="saas" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.saasTag}</div>
            <h2>{c.saasTitle}</h2>
            <p className="sec-lead">{g.prodLead}</p>
          </Reveal>
          <ProductCards />
        </div>
      </section>

      <section id="clientes">
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

            <section id="audiovisual">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.mediaTag}</div>
            <h2>{c.mediaTitle}</h2>
            <p className="sec-lead">{c.mediaLead}</p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
            
            {/* 1. Drone SP */}
            <Reveal className="media-card" delay={0.0}>
              <video poster="/video/drone-sp-poster.jpg" autoPlay loop muted playsInline preload="none">
                <source src="/video/drone-sp.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.drone[0]}</h3>
                <p>{c.drone[1]}</p>
              </div>
            </Reveal>

            {/* 2. Supermercado */}
            <Reveal className="media-card" delay={0.05}>
              <video autoPlay loop muted playsInline preload="none">
                <source src="/video/supermercado.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.supermarket[0]}</h3>
                <p>{c.supermarket[1]}</p>
              </div>
            </Reveal>

            {/* 3. Casinha Amor */}
            <Reveal className="media-card" delay={0.10}>
              <video autoPlay loop muted playsInline preload="none">
                <source src="/video/casinhaamor.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.casinhaamor[0]}</h3>
                <p>{c.casinhaamor[1]}</p>
              </div>
            </Reveal>

            {/* 4. IA Camera */}
            <Reveal className="media-card" delay={0.15}>
              <video autoPlay loop muted playsInline preload="none">
                <source src="/video/camera_ai.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.camera_ai[0]}</h3>
                <p>{c.camera_ai[1]}</p>
              </div>
            </Reveal>

            {/* 5. Maldivas Hero */}
            <Reveal className="media-card" delay={0.20}>
              <video poster="/video/maldivas-hero-poster.jpg" autoPlay loop muted playsInline preload="none">
                <source src="/video/maldivas-hero.mp4" type="video/mp4" />
              </video>
              <div className="media-cap">
                <h3>{c.brand[0]}</h3>
                <p>{c.brand[1]}</p>
              </div>
            </Reveal>

            {/* 6. Piloto de Drone (Imagem) */}
            <Reveal className="media-card" delay={0.25}>
              <img src="/media/cidade-avenida.jpg" alt="Operação em campo" />
              <div className="media-cap">
                <h3>{c.pilot[0]}</h3>
                <p>{c.pilot[1]}</p>
              </div>
            </Reveal>

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
