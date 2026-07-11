"use client";

import { useState } from "react";

type Lang = "pt" | "en";

const GITHUB = "https://github.com/MaldivaSky";
const LINKEDIN =
  "https://www.linkedin.com/in/rafael-paiva-dias-da-silva-022b17122/";
const EMAIL = "rafaelmaldivas@gmail.com";

const projects = [
  {
    emoji: "🧾",
    name: "MercadinhoSys",
    desc: {
      pt: "ERP SaaS multi-tenant para varejo: PDV com emissão fiscal (NFC-e), estoque, fornecedores e BI com Curva ABC, análise RFM e DRE. 500+ commits, CI/CD e Docker.",
      en: "Multi-tenant SaaS ERP for retail: POS with Brazilian tax invoicing (NFC-e), inventory, suppliers and BI with ABC curve, RFM analysis and P&L. 500+ commits, CI/CD and Docker.",
    },
    tags: ["React", "TypeScript", "Python", "Flask", "PostgreSQL", "Docker"],
    repo: `${GITHUB}/mercadinhosys`,
    demo: "https://mercadinhosys.vercel.app",
  },
  {
    emoji: "🛒",
    name: "MySuperStore",
    desc: {
      pt: "Marketplace multi-vendedor headless: pagamentos PIX e cartão com split automático entre lojas (Efí Bank), frete em tempo real (Melhor Envio), Celery e Redis.",
      en: "Headless multi-vendor marketplace: PIX and credit-card payments with automatic revenue split (Efí Bank), real-time shipping quotes (Melhor Envio), Celery and Redis.",
    },
    tags: ["Django REST", "Next.js 15", "PostgreSQL", "Redis", "Celery"],
    repo: `${GITHUB}/MySuperStore`,
    demo: "https://mysuperstore-lime.vercel.app",
  },
  {
    emoji: "🍸",
    name: "Lagoon Gastrobar",
    desc: {
      pt: "Site premium com reservas de mesas em tempo real, mapa interativo do salão em SVG, painel admin e tour 360°. Backend 100% serverless com Supabase e RLS.",
      en: "Premium website with real-time table booking, interactive SVG floor map, admin panel and 360° tour. Fully serverless backend with Supabase and RLS.",
    },
    tags: ["JavaScript", "Supabase", "PostgreSQL", "RLS"],
    repo: `${GITHUB}/gastrobar-web`,
    demo: "https://maldivasky.github.io/gastrobar-web/",
  },
  {
    emoji: "👨‍🍳",
    name: "Mise",
    desc: {
      pt: "Gestão de cozinha com IA (Gemini): fichas técnicas em segundos, custo por porção, precificação por margem e tabela nutricional automática.",
      en: "AI-powered kitchen management (Gemini): instant recipe spec sheets, cost per serving, margin-based pricing and automatic nutrition tables.",
    },
    tags: ["React 18", "TypeScript", "Gemini AI", "Vite"],
    repo: `${GITHUB}/Mise-app-Gest-o-de-Cozinha`,
    demo: "https://mise-app-gest-o-de-cozinha.vercel.app",
  },
  {
    emoji: "💇",
    name: "Agenda Salão",
    desc: {
      pt: "Agenda e administração para salão de beleza: agendamentos, clientes e serviços sincronizados em tempo real via Firestore, com recursos de IA.",
      en: "Beauty salon scheduling and management: appointments, clients and services synced in real time via Firestore, with AI-assisted features.",
    },
    tags: ["React", "TypeScript", "Firebase", "Gemini AI"],
    repo: `${GITHUB}/Agenda-Sal-o-de-Beleza`,
    demo: "https://agenda-sal-o-de-beleza.vercel.app",
  },
  {
    emoji: "🐾",
    name: "Animaz Vitrine",
    desc: {
      pt: "Catálogo interativo para pet shop com carrinho persistente, exportação de orçamentos em PDF/Excel e fechamento de pedido via WhatsApp.",
      en: "Interactive pet shop catalog with persistent cart, PDF/Excel quote export and WhatsApp checkout flow.",
    },
    tags: ["JavaScript", "jsPDF", "SheetJS", "CSS3"],
    repo: `${GITHUB}/Animaz-Glassdoor`,
    demo: "https://animaz-glassdoor.vercel.app",
  },
];

const dataProjects = [
  {
    emoji: "📊",
    name: "Animaz DataAnalisys",
    desc: {
      pt: "Análise de dados em Python para operação de e-commerce: tratamento, exploração e visualização para decisões do time.",
      en: "Python data analysis for an e-commerce operation: wrangling, exploration and visualization to support team decisions.",
    },
    tags: ["Python", "Pandas", "Data Viz"],
    repo: `${GITHUB}/Animaz-DataAnalisys`,
    demo: null,
  },
  {
    emoji: "💰",
    name: "iContas",
    desc: {
      pt: "Controle financeiro com categorização automática de gastos, análise por período e visualização de dados.",
      en: "Personal finance tracker with automatic expense categorization, period analysis and data visualization.",
    },
    tags: ["Python"],
    repo: `${GITHUB}/iContas`,
    demo: null,
  },
];

const t = {
  pt: {
    nav: { projects: "Projetos", skills: "Competências", exp: "Experiência", contact: "Contato" },
    heroKicker: "Desenvolvedor Fullstack · Análise de Dados & BI",
    heroTitle: (
      <>
        Construo <em>produtos digitais</em> que transformam dados em decisão.
      </>
    ),
    heroSub:
      "Graduado em Análise e Desenvolvimento de Sistemas (IFSP), com ERPs, marketplaces e apps com IA em produção. Uno engenharia de software, análise de dados e visão de negócio — de +10 anos de trajetória comercial.",
    ctaProjects: "Ver projetos",
    ctaContact: "Fale comigo",
    location: "📍 Guarulhos / São Paulo · Remoto ou Híbrido",
    projTitle: "Projetos em produção",
    projSub:
      "Sistemas completos — frontend, backend, banco e deploy — resolvendo problemas reais de negócios.",
    dataTitle: "Dados & BI",
    dataSub:
      "Análise de dados aplicada a negócio: dashboards, Curva ABC, RFM e relatórios gerenciais.",
    skillsTitle: "Competências",
    skillsSub: "Stack usada nos projetos e no dia a dia.",
    expTitle: "Experiência",
    expSub: "Tecnologia com base sólida em inteligência de mercado e vendas B2B.",
    exp: [
      {
        period: "2024 — 2025",
        role: "Analista de Inteligência de Mercado",
        company: "GP Alimentos",
        desc: "Dashboards em Power BI e relatórios gerenciais para monitoramento de KPIs. Coleta, tratamento e análise de dados de mercado para identificar tendências e movimentos da concorrência.",
      },
      {
        period: "2022",
        role: "Analista Comercial / Inteligência de Mercado",
        company: "Loft",
        desc: "Pesquisa de mercado, consolidação e análise de dados, apresentações com insights, gestão de CRM e apoio a dashboards de vendas.",
      },
      {
        period: "2015 — 2024",
        role: "Trajetória Comercial",
        company: "Heineken · Melhoramentos · Legrand",
        desc: "+10 anos em vendas e relacionamento B2B — visão de negócio que hoje aplico ao desenvolvimento de soluções.",
      },
    ],
    eduTitle: "Formação",
    edu: [
      "Análise e Desenvolvimento de Sistemas — IFSP",
      "Power BI Avançado (200h) — HashTag Treinamentos",
      "Inglês intermediário/avançado · Espanhol intermediário",
    ],
    contactTitle: "Vamos construir algo juntos?",
    contactSub:
      "Aberto a oportunidades como Desenvolvedor Fullstack Pleno, Analista de Dados ou Consultor de Soluções.",
    footer: "Feito com Next.js e TypeScript · Deploy na Vercel",
  },
  en: {
    nav: { projects: "Projects", skills: "Skills", exp: "Experience", contact: "Contact" },
    heroKicker: "Fullstack Developer · Data Analysis & BI",
    heroTitle: (
      <>
        I build <em>digital products</em> that turn data into decisions.
      </>
    ),
    heroSub:
      "Systems Analysis and Development graduate (IFSP), with ERPs, marketplaces and AI apps in production. I combine software engineering, data analysis and business sense — built over 10+ years in commercial roles.",
    ctaProjects: "View projects",
    ctaContact: "Get in touch",
    location: "📍 Guarulhos / São Paulo, Brazil · Remote or Hybrid",
    projTitle: "Projects in production",
    projSub:
      "Complete systems — frontend, backend, database and deployment — solving real business problems.",
    dataTitle: "Data & BI",
    dataSub:
      "Business-driven data analysis: dashboards, ABC curve, RFM segmentation and management reports.",
    skillsTitle: "Skills",
    skillsSub: "The stack behind my projects and daily work.",
    expTitle: "Experience",
    expSub: "Technology grounded in market intelligence and B2B sales.",
    exp: [
      {
        period: "2024 — 2025",
        role: "Market Intelligence Analyst",
        company: "GP Alimentos",
        desc: "Power BI dashboards and management reports for KPI monitoring. Collected, processed and analyzed market data to identify trends and competitor moves.",
      },
      {
        period: "2022",
        role: "Commercial / Market Intelligence Analyst",
        company: "Loft",
        desc: "Market research, data consolidation and analysis, insight presentations, CRM management and support for sales dashboards.",
      },
      {
        period: "2015 — 2024",
        role: "Commercial Career",
        company: "Heineken · Melhoramentos · Legrand",
        desc: "10+ years in B2B sales and relationship management — business acumen I now apply to building software solutions.",
      },
    ],
    eduTitle: "Education",
    edu: [
      "Systems Analysis and Development — IFSP",
      "Advanced Power BI (200h) — HashTag Treinamentos",
      "English intermediate/advanced · Spanish intermediate",
    ],
    contactTitle: "Let's build something together?",
    contactSub:
      "Open to Mid-level Fullstack Developer, Data Analyst or Solutions Consultant roles.",
    footer: "Built with Next.js and TypeScript · Deployed on Vercel",
  },
};

const skills = [
  {
    title: { pt: "Dados & BI", en: "Data & BI" },
    items: ["Power BI", "Python · Pandas", "SQL · PostgreSQL", "Excel avançado"],
  },
  {
    title: { pt: "Backend", en: "Backend" },
    items: ["Django · Flask", "Node.js", "APIs REST", "Supabase · Firebase"],
  },
  {
    title: { pt: "Frontend", en: "Frontend" },
    items: ["React · Next.js", "TypeScript", "JavaScript ES6+", "HTML5 · CSS3 · Tailwind"],
  },
  {
    title: { pt: "DevOps & Ferramentas", en: "DevOps & Tools" },
    items: ["Git · GitHub Actions", "Docker", "Vercel · Render · Railway", "CI/CD"],
  },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("pt");
  const s = t[lang];

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-logo">
            Rafael<span>.Paiva</span>
          </div>
          <div className="nav-links">
            <a href="#projetos" className="nav-hide">{s.nav.projects}</a>
            <a href="#skills" className="nav-hide">{s.nav.skills}</a>
            <a href="#experiencia" className="nav-hide">{s.nav.exp}</a>
            <a href="#contato" className="nav-hide">{s.nav.contact}</a>
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              aria-label="Switch language"
            >
              {lang === "pt" ? "🇺🇸 EN" : "🇧🇷 PT"}
            </button>
          </div>
        </div>
      </nav>

      <header className="hero container">
        <p className="hero-kicker">{s.heroKicker}</p>
        <h1>{s.heroTitle}</h1>
        <p className="hero-sub">{s.heroSub}</p>
        <div className="hero-cta">
          <a href="#projetos" className="btn btn-primary">
            {s.ctaProjects}
          </a>
          <a href={`mailto:${EMAIL}`} className="btn btn-ghost">
            {s.ctaContact}
          </a>
        </div>
        <div className="hero-badges">
          <span className="chip">{s.location}</span>
          <span className="chip">Python</span>
          <span className="chip">TypeScript</span>
          <span className="chip">React · Next.js</span>
          <span className="chip">Django</span>
          <span className="chip">PostgreSQL</span>
          <span className="chip">Power BI</span>
        </div>
      </header>

      <section id="projetos">
        <div className="container">
          <h2 className="section-title">
            <span>/</span> {s.projTitle}
          </h2>
          <p className="section-sub">{s.projSub}</p>
          <div className="grid">
            {projects.map((p) => (
              <article className="card" key={p.name}>
                <div className="card-emoji">{p.emoji}</div>
                <h3>{p.name}</h3>
                <p>{p.desc[lang]}</p>
                <div className="card-tags">
                  {p.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="card-links">
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer">
                      {lang === "pt" ? "Demo ao vivo" : "Live demo"} ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dados">
        <div className="container">
          <h2 className="section-title">
            <span>/</span> {s.dataTitle}
          </h2>
          <p className="section-sub">{s.dataSub}</p>
          <div className="grid">
            {dataProjects.map((p) => (
              <article className="card" key={p.name}>
                <div className="card-emoji">{p.emoji}</div>
                <h3>{p.name}</h3>
                <p>{p.desc[lang]}</p>
                <div className="card-tags">
                  {p.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="card-links">
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="container">
          <h2 className="section-title">
            <span>/</span> {s.skillsTitle}
          </h2>
          <p className="section-sub">{s.skillsSub}</p>
          <div className="skills-grid">
            {skills.map((g) => (
              <div className="skill-group" key={g.title.en}>
                <h4>{g.title[lang]}</h4>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia">
        <div className="container">
          <h2 className="section-title">
            <span>/</span> {s.expTitle}
          </h2>
          <p className="section-sub">{s.expSub}</p>
          <div className="timeline">
            {s.exp.map((e) => (
              <div className="tl-item" key={e.role}>
                <div className="tl-period">{e.period}</div>
                <h3>{e.role}</h3>
                <div className="tl-company">{e.company}</div>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
          <h2 className="section-title" style={{ marginTop: 48 }}>
            <span>/</span> {s.eduTitle}
          </h2>
          <div className="hero-badges">
            {s.edu.map((e) => (
              <span className="chip" key={e}>
                🎓 {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="contato">
        <div className="container">
          <div className="contact-box">
            <h2>{s.contactTitle}</h2>
            <p>{s.contactSub}</p>
            <div className="hero-cta" style={{ justifyContent: "center" }}>
              <a href={`mailto:${EMAIL}`} className="btn btn-primary">
                ✉️ {EMAIL}
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                LinkedIn ↗
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} Rafael Paiva Dias da Silva · {s.footer}
        </div>
      </footer>
    </>
  );
}
