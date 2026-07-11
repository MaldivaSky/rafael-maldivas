"use client";

import { useEffect, useState } from "react";

type Lang = "pt" | "en";

const GITHUB = "https://github.com/MaldivaSky";
const LINKEDIN =
  "https://www.linkedin.com/in/rafael-paiva-dias-da-silva-022b17122/";
const EMAIL = "rafaelmaldivas@gmail.com";

const icon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;
const POWERBI_ICON =
  "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg";

const techMarquee = [
  { name: "Python", src: icon("python") },
  { name: "TypeScript", src: icon("typescript") },
  { name: "React", src: icon("react") },
  { name: "Next.js", src: icon("nextdotjs/white") },
  { name: "Django", src: icon("django/44B78B") },
  { name: "Flask", src: icon("flask/white") },
  { name: "Node.js", src: icon("nodedotjs") },
  { name: "PostgreSQL", src: icon("postgresql") },
  { name: "Redis", src: icon("redis") },
  { name: "Supabase", src: icon("supabase") },
  { name: "Firebase", src: icon("firebase") },
  { name: "Docker", src: icon("docker") },
  { name: "Tailwind", src: icon("tailwindcss") },
  { name: "Power BI", src: POWERBI_ICON },
  { name: "Git", src: icon("git") },
  { name: "Vercel", src: icon("vercel/white") },
];

type Tag = { label: string; src?: string };

type Project = {
  emoji: string;
  name: string;
  repoSlug: string;
  desc: { pt: string; en: string };
  tags: Tag[];
  repo: string;
  demo: string | null;
};

const projects: Project[] = [
  {
    emoji: "🧾",
    name: "MercadinhoSys",
    repoSlug: "mercadinhosys",
    desc: {
      pt: "ERP SaaS multi-tenant para varejo: PDV com emissão fiscal (NFC-e), estoque, fornecedores e BI com Curva ABC, análise RFM e DRE. 500+ commits, CI/CD e Docker.",
      en: "Multi-tenant SaaS ERP for retail: POS with Brazilian tax invoicing (NFC-e), inventory, suppliers and BI with ABC curve, RFM analysis and P&L. 500+ commits, CI/CD and Docker.",
    },
    tags: [
      { label: "React", src: icon("react") },
      { label: "TypeScript", src: icon("typescript") },
      { label: "Flask", src: icon("flask/white") },
      { label: "PostgreSQL", src: icon("postgresql") },
      { label: "Docker", src: icon("docker") },
    ],
    repo: `${GITHUB}/mercadinhosys`,
    demo: "https://mercadinhosys.vercel.app",
  },
  {
    emoji: "🛒",
    name: "MySuperStore",
    repoSlug: "MySuperStore",
    desc: {
      pt: "Marketplace multi-vendedor headless: pagamentos PIX e cartão com split automático entre lojas (Efí Bank), frete em tempo real (Melhor Envio), Celery e Redis.",
      en: "Headless multi-vendor marketplace: PIX and credit-card payments with automatic revenue split (Efí Bank), real-time shipping quotes (Melhor Envio), Celery and Redis.",
    },
    tags: [
      { label: "Django", src: icon("django/44B78B") },
      { label: "Next.js 15", src: icon("nextdotjs/white") },
      { label: "PostgreSQL", src: icon("postgresql") },
      { label: "Redis", src: icon("redis") },
    ],
    repo: `${GITHUB}/MySuperStore`,
    demo: "https://mysuperstore-lime.vercel.app",
  },
  {
    emoji: "🍸",
    name: "Lagoon Gastrobar",
    repoSlug: "gastrobar-web",
    desc: {
      pt: "Site premium com reservas de mesas em tempo real, mapa interativo do salão em SVG, painel admin e tour 360°. Backend 100% serverless com Supabase e RLS.",
      en: "Premium website with real-time table booking, interactive SVG floor map, admin panel and 360° tour. Fully serverless backend with Supabase and RLS.",
    },
    tags: [
      { label: "JavaScript", src: icon("javascript") },
      { label: "Supabase", src: icon("supabase") },
      { label: "PostgreSQL", src: icon("postgresql") },
    ],
    repo: `${GITHUB}/gastrobar-web`,
    demo: "https://maldivasky.github.io/gastrobar-web/",
  },
  {
    emoji: "👨‍🍳",
    name: "Mise",
    repoSlug: "Mise-app-Gest-o-de-Cozinha",
    desc: {
      pt: "Gestão de cozinha com IA (Gemini): fichas técnicas em segundos, custo por porção, precificação por margem e tabela nutricional automática.",
      en: "AI-powered kitchen management (Gemini): instant recipe spec sheets, cost per serving, margin-based pricing and automatic nutrition tables.",
    },
    tags: [
      { label: "React 18", src: icon("react") },
      { label: "TypeScript", src: icon("typescript") },
      { label: "Gemini", src: icon("googlegemini") },
      { label: "Vite", src: icon("vite") },
    ],
    repo: `${GITHUB}/Mise-app-Gest-o-de-Cozinha`,
    demo: "https://mise-app-gest-o-de-cozinha.vercel.app",
  },
  {
    emoji: "💇",
    name: "Agenda Salão",
    repoSlug: "Agenda-Sal-o-de-Beleza",
    desc: {
      pt: "Agenda e administração para salão de beleza: agendamentos, clientes e serviços sincronizados em tempo real via Firestore, com recursos de IA.",
      en: "Beauty salon scheduling and management: appointments, clients and services synced in real time via Firestore, with AI-assisted features.",
    },
    tags: [
      { label: "React", src: icon("react") },
      { label: "TypeScript", src: icon("typescript") },
      { label: "Firebase", src: icon("firebase") },
    ],
    repo: `${GITHUB}/Agenda-Sal-o-de-Beleza`,
    demo: "https://agenda-sal-o-de-beleza.vercel.app",
  },
  {
    emoji: "🐾",
    name: "Animaz Vitrine",
    repoSlug: "Animaz-Glassdoor",
    desc: {
      pt: "Catálogo interativo para pet shop com carrinho persistente, exportação de orçamentos em PDF/Excel e fechamento de pedido via WhatsApp.",
      en: "Interactive pet shop catalog with persistent cart, PDF/Excel quote export and WhatsApp checkout flow.",
    },
    tags: [
      { label: "JavaScript", src: icon("javascript") },
      { label: "HTML5", src: icon("html5") },
      { label: "CSS3", src: icon("css/1572B6") },
    ],
    repo: `${GITHUB}/Animaz-Glassdoor`,
    demo: "https://animaz-glassdoor.vercel.app",
  },
];

const dataProjects: Project[] = [
  {
    emoji: "📊",
    name: "Animaz DataAnalisys",
    repoSlug: "Animaz-DataAnalisys",
    desc: {
      pt: "Análise de dados em Python para operação de e-commerce: tratamento, exploração e visualização para decisões do time.",
      en: "Python data analysis for an e-commerce operation: wrangling, exploration and visualization to support team decisions.",
    },
    tags: [
      { label: "Python", src: icon("python") },
      { label: "Pandas", src: icon("pandas/E70488") },
    ],
    repo: `${GITHUB}/Animaz-DataAnalisys`,
    demo: null,
  },
  {
    emoji: "💰",
    name: "iContas",
    repoSlug: "iContas",
    desc: {
      pt: "Controle financeiro com categorização automática de gastos, análise por período e visualização de dados.",
      en: "Personal finance tracker with automatic expense categorization, period analysis and data visualization.",
    },
    tags: [{ label: "Python", src: icon("python") }],
    repo: `${GITHUB}/iContas`,
    demo: null,
  },
];

const skills = [
  {
    title: { pt: "Dados & BI", en: "Data & BI" },
    items: [
      { label: "Power BI", src: POWERBI_ICON },
      { label: "Python · Pandas", src: icon("pandas/E70488") },
      { label: "SQL · PostgreSQL", src: icon("postgresql") },
      { label: "Excel avançado", fallback: "📈" },
    ],
  },
  {
    title: { pt: "Backend", en: "Backend" },
    items: [
      { label: "Django · Flask", src: icon("django/44B78B") },
      { label: "Node.js", src: icon("nodedotjs") },
      { label: "APIs REST · JWT", fallback: "🔗" },
      { label: "Supabase · Firebase", src: icon("supabase") },
    ],
  },
  {
    title: { pt: "Frontend", en: "Frontend" },
    items: [
      { label: "React · Next.js", src: icon("react") },
      { label: "TypeScript", src: icon("typescript") },
      { label: "JavaScript ES6+", src: icon("javascript") },
      { label: "Tailwind · CSS3", src: icon("tailwindcss") },
    ],
  },
  {
    title: { pt: "DevOps & Ferramentas", en: "DevOps & Tools" },
    items: [
      { label: "Git · GitHub Actions", src: icon("githubactions") },
      { label: "Docker", src: icon("docker") },
      { label: "Vercel · Render", src: icon("vercel/white") },
      { label: "CI/CD", fallback: "⚙️" },
    ],
  },
];

const t = {
  pt: {
    nav: { projects: "Projetos", skills: "Competências", exp: "Experiência", contact: "Contato" },
    status: "Disponível para novas oportunidades",
    heroKicker: "Desenvolvedor Fullstack · Análise de Dados & BI",
    heroL1: "Construo ",
    heroGrad: "produtos digitais",
    heroL2: " que transformam dados em decisão.",
    ctaProjects: "Ver projetos",
    ctaContact: "Fale comigo",
    projKicker: "Portfólio",
    projTitle: "Projetos em produção",
    projSub: "Sistemas completos — frontend, backend, banco e deploy — resolvendo problemas reais de negócios.",
    dataKicker: "Analytics",
    dataTitle: "Dados & BI",
    dataSub: "Análise de dados aplicada a negócio: dashboards, Curva ABC, RFM e relatórios gerenciais.",
    skillsKicker: "Stack",
    skillsTitle: "Competências",
    skillsSub: "As tecnologias por trás dos meus projetos e do meu dia a dia.",
    expKicker: "Trajetória",
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
      "🎓 Análise e Desenvolvimento de Sistemas — IFSP",
      "📊 Power BI Avançado (200h) — HashTag Treinamentos",
      "🌎 Inglês intermediário/avançado · Espanhol intermediário",
    ],
    contactTitle: "Vamos construir algo juntos?",
    contactSub: "Aberto a oportunidades como Desenvolvedor Fullstack Pleno, Analista de Dados ou Consultor de Soluções.",
    footer: "Feito com Next.js e TypeScript · Deploy na Vercel",
    live: "Demo ao vivo",
    code: "Código",
  },
  en: {
    nav: { projects: "Projects", skills: "Skills", exp: "Experience", contact: "Contact" },
    status: "Open to new opportunities",
    heroKicker: "Fullstack Developer · Data Analysis & BI",
    heroL1: "I build ",
    heroGrad: "digital products",
    heroL2: " that turn data into decisions.",
    ctaProjects: "View projects",
    ctaContact: "Get in touch",
    projKicker: "Portfolio",
    projTitle: "Projects in production",
    projSub: "Complete systems — frontend, backend, database and deployment — solving real business problems.",
    dataKicker: "Analytics",
    dataTitle: "Data & BI",
    dataSub: "Business-driven data analysis: dashboards, ABC curve, RFM segmentation and management reports.",
    skillsKicker: "Stack",
    skillsTitle: "Skills",
    skillsSub: "The technologies behind my projects and daily work.",
    expKicker: "Journey",
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
      "🎓 Systems Analysis and Development — IFSP",
      "📊 Advanced Power BI (200h) — HashTag Treinamentos",
      "🌎 English intermediate/advanced · Spanish intermediate",
    ],
    contactTitle: "Let's build something together?",
    contactSub: "Open to Mid-level Fullstack Developer, Data Analyst or Solutions Consultant roles.",
    footer: "Built with Next.js and TypeScript · Deployed on Vercel",
    live: "Live demo",
    code: "Code",
  },
};

function ogImage(slug: string) {
  return `https://opengraph.githubassets.com/portfolio/MaldivaSky/${slug}`;
}

function ProjectCard({
  p,
  lang,
  live,
  code,
}: {
  p: Project;
  lang: Lang;
  live: string;
  code: string;
}) {
  return (
    <article className="card reveal">
      <div className="card-cover">
        <img src={ogImage(p.repoSlug)} alt={p.name} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>{p.name}</h3>
          <span className="card-emoji">{p.emoji}</span>
        </div>
        <p>{p.desc[lang]}</p>
        <div className="card-tags">
          {p.tags.map((tag) => (
            <span className="tag" key={tag.label}>
              {tag.src && <img src={tag.src} alt="" loading="lazy" />}
              {tag.label}
            </span>
          ))}
        </div>
        <div className="card-links">
          <a href={p.repo} target="_blank" rel="noopener noreferrer">
            {code} ↗
          </a>
          {p.demo && (
            <a className="primary" href={p.demo} target="_blank" rel="noopener noreferrer">
              {live} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("pt");
  const s = t[lang];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grid" />

      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-logo">
            Rafael<span>.Maldivas</span>
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
        <div className="hero-status">
          <span className="pulse" />
          {s.status}
        </div>
        <p className="hero-kicker">{s.heroKicker}</p>
        <h1>
          {s.heroL1}
          <span className="grad">{s.heroGrad}</span>
          {s.heroL2}
        </h1>
        <p className="hero-sub">
          {lang === "pt" ? (
            <>
              Sou <strong>Rafael Maldivas</strong>, graduado em Análise e
              Desenvolvimento de Sistemas (IFSP), com ERPs, marketplaces e apps
              com IA <strong>em produção</strong>. Uno engenharia de software,
              análise de dados e visão de negócio construída em +10 anos de
              trajetória comercial.
            </>
          ) : (
            <>
              I&apos;m <strong>Rafael Maldivas</strong>, a Systems Analysis and
              Development graduate (IFSP) with ERPs, marketplaces and AI apps{" "}
              <strong>in production</strong>. I combine software engineering,
              data analysis and business sense built over 10+ years in
              commercial roles.
            </>
          )}
        </p>
        <div className="hero-cta">
          <a href="#projetos" className="btn btn-primary">
            {s.ctaProjects} →
          </a>
          <a href={`mailto:${EMAIL}`} className="btn btn-ghost">
            {s.ctaContact}
          </a>
        </div>
      </header>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...techMarquee, ...techMarquee].map((tech, i) => (
            <span className="tech-item" key={`${tech.name}-${i}`}>
              <img src={tech.src} alt={tech.name} loading="lazy" />
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      <section id="projetos">
        <div className="container">
          <div className="section-head reveal">
            <p className="section-kicker">{s.projKicker}</p>
            <h2 className="section-title">{s.projTitle}</h2>
            <p className="section-sub">{s.projSub}</p>
          </div>
          <div className="grid">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} lang={lang} live={s.live} code={s.code} />
            ))}
          </div>
        </div>
      </section>

      <section id="dados">
        <div className="container">
          <div className="section-head reveal">
            <p className="section-kicker">{s.dataKicker}</p>
            <h2 className="section-title">{s.dataTitle}</h2>
            <p className="section-sub">{s.dataSub}</p>
          </div>
          <div className="grid">
            {dataProjects.map((p) => (
              <ProjectCard key={p.name} p={p} lang={lang} live={s.live} code={s.code} />
            ))}
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="container">
          <div className="section-head reveal">
            <p className="section-kicker">{s.skillsKicker}</p>
            <h2 className="section-title">{s.skillsTitle}</h2>
            <p className="section-sub">{s.skillsSub}</p>
          </div>
          <div className="skills-grid">
            {skills.map((g) => (
              <div className="skill-group reveal" key={g.title.en}>
                <h4>{g.title[lang]}</h4>
                <div className="skill-items">
                  {g.items.map((i) => (
                    <span className="skill-item" key={i.label}>
                      {"src" in i && i.src ? (
                        <img src={i.src} alt="" loading="lazy" />
                      ) : (
                        <span className="icon-fallback">{(i as { fallback?: string }).fallback}</span>
                      )}
                      {i.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia">
        <div className="container">
          <div className="section-head reveal">
            <p className="section-kicker">{s.expKicker}</p>
            <h2 className="section-title">{s.expTitle}</h2>
            <p className="section-sub">{s.expSub}</p>
          </div>
          <div className="timeline">
            {s.exp.map((e) => (
              <div className="tl-item reveal" key={e.role}>
                <div className="tl-period">{e.period}</div>
                <h3>{e.role}</h3>
                <div className="tl-company">{e.company}</div>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="section-head reveal" style={{ marginTop: 56, marginBottom: 0 }}>
            <h2 className="section-title">{s.eduTitle}</h2>
            <div className="edu-chips">
              {s.edu.map((e) => (
                <span className="chip" key={e}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contato">
        <div className="container">
          <div className="contact-box reveal">
            <h2>{s.contactTitle}</h2>
            <p>{s.contactSub}</p>
            <div className="hero-cta" style={{ justifyContent: "center", marginTop: 0 }}>
              <a href={`mailto:${EMAIL}`} className="btn btn-primary">
                ✉️ {EMAIL}
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <img src={icon("linkedin/0A66C2")} alt="" width={18} height={18} />
                LinkedIn
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <img src={icon("github/white")} alt="" width={18} height={18} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} Rafael Maldivas · {s.footer}
        </div>
      </footer>
    </>
  );
}
