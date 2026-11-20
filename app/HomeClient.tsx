"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Film,
  Layers,
  MonitorSmartphone,
  Receipt,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLang, localePath } from "./lib/i18n";
import { WHATSAPP } from "./lib/site";
import { ORACLE_CERT } from "./lib/credentials";
import CaseHighlights from "./components/CaseHighlights";
import BriefingForm from "./components/BriefingForm";
import WorkbenchHub from "./components/WorkbenchHub";
import ExitToast from "./components/ExitToast";
import CourseInvite from "./components/curso/CourseInvite";
import { openPortfolioConcierge } from "./components/PortfolioConcierge";

type ShowcaseMode = "business" | "architecture";

export default function HomeClient() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [showcaseMode, setShowcaseMode] = useState<ShowcaseMode>("business");

  const intentRoutes = pt
    ? [
        {
          code: "01 · B2B SOB MEDIDA",
          title: "Sistemas internos, ERPs & automação",
          desc: "Para empresas que querem eliminar planilhas paralelas e integrar operação.",
          href: "#diagnostico",
          icon: Code2,
        },
        {
          code: "02 · SAAS & HARDWARE",
          title: "MiseOn, Totens Bravus & SelectSys",
          desc: "Plataformas multi-tenant prontas em produção para food service, varejo e RH.",
          href: "#produtos",
          icon: Cpu,
        },
        {
          code: "03 · ACADEMY & FERRAMENTAS",
          title: "Curso gratuito & Arena Prática",
          desc: "18 aulas reais com terminal, Python/SQL, webhook PIX e Tutor IA.",
          href: "#academy",
          icon: Layers,
        },
      ]
    : [
        {
          code: "01 · CUSTOM B2B",
          title: "Internal systems, ERPs & automation",
          desc: "For companies replacing scattered spreadsheets with unified, auditable software.",
          href: "#diagnostico",
          icon: Code2,
        },
        {
          code: "02 · SAAS & HARDWARE",
          title: "MiseOn, Bravus Kiosks & SelectSys",
          desc: "Production multi-tenant SaaS for food service, retail POS, and recruiting.",
          href: "#produtos",
          icon: Cpu,
        },
        {
          code: "03 · ACADEMY & TOOLS",
          title: "Free engineering course & Practice Arena",
          desc: "18 real lessons featuring terminal, Python/SQL, PIX webhooks, and AI Tutor.",
          href: "#academy",
          icon: Layers,
        },
      ];

  const flagshipSecondary = pt
    ? [
        {
          id: "selectsys",
          code: "02 / ATS BILÍNGUE BRASIL → JAPÃO",
          pill: "Case Fujiarte Co., Ltd. · Em implantação",
          title: "SelectSys Jobs — triagem internacional sem planilhas paralelas",
          businessSummary:
            "Substituiu o vai-e-vem de e-mails e formulários manuais por cadastro bilíngue, leitura automática de documentos e redução de 60% no tempo de triagem.",
          archSummary:
            "React 19 + PostgreSQL Row Level Security (LGPD) + OCR via Tesseract.js/PDF.js + exportação fiel para modelos Excel (ExcelJS/Python) + Edge Functions.",
          tags: ["React 19", "PostgreSQL RLS", "Tesseract OCR", "ExcelJS", "LGPD"],
          href: "/portfolio/fujiarte",
          cta: "Ver Case Fujiarte",
          conciergePrompt:
            "Como foi construído o SelectSys Jobs da Fujiarte e qual o impacto na triagem?",
        },
        {
          id: "mercadinhosys",
          code: "03 / ERP MULTI-TENANT & PDV FISCAL",
          pill: "Varejo & Supermercados · Em operação",
          title: "mercadinhosys — estoque transacional, NFC-e e BI comercial",
          businessSummary:
            "Unifica vendas no PDV fiscal, entrada por XML de fornecedor e painéis de Curva ABC, RFM e DRE para eliminar ruptura e furo de caixa.",
          archSummary:
            "TenantQuery fail-closed no ORM + savepoints aninhados no fechamento de venda + motor NFC-e/SEFAZ + pipeline analítico Python (Pandas, Statsmodels, Plotly) + Sentry.",
          tags: ["Python / Flask", "PostgreSQL", "NFC-e SEFAZ", "Pandas + Plotly", "Redis"],
          href: "/portfolio",
          cta: "Explorar no Portfólio",
          conciergePrompt:
            "Qual a arquitetura multi-tenant e fiscal do mercadinhosys?",
        },
        {
          id: "mysuperstore",
          code: "04 / MARKETPLACE HEADLESS & SPLIT PIX",
          pill: "E-commerce Multi-Vendedor · Estudo de Caso do Curso",
          title: "MySuperStore — split automático de receita sem travar o checkout",
          businessSummary:
            "Plataforma multi-lojista com pagamento via PIX/cartão, divisão automática de comissão na liquidação e cotação de frete em tempo real.",
          archSummary:
            "Django REST + Next.js 15 + PostgreSQL (dinheiro em centavos inteiros + UPDATE condicional de estoque) + webhook Efí idempotente + workers Celery/Redis.",
          tags: ["Django REST", "Next.js 15", "PostgreSQL", "Celery + Redis", "Efí PIX"],
          href: "/cursos/construa-seu-marketplace",
          cta: "Ver Arquitetura na Academy",
          conciergePrompt:
            "Como funciona o split de pagamento e idempotência no MySuperStore?",
        },
      ]
    : [
        {
          id: "selectsys",
          code: "02 / BILINGUAL ATS BRAZIL → JAPAN",
          pill: "Fujiarte Co., Ltd. · Rolling out",
          title: "SelectSys Jobs — international recruiting without parallel spreadsheets",
          businessSummary:
            "Replaced manual email back-and-forth with structured bilingual candidate intake, automated document reading, and 60% faster manual screening.",
          archSummary:
            "React 19 + PostgreSQL Row Level Security (LGPD) + Tesseract.js/PDF.js OCR + faithful Excel template export (ExcelJS/Python) + Edge Functions.",
          tags: ["React 19", "PostgreSQL RLS", "Tesseract OCR", "ExcelJS", "LGPD"],
          href: "/portfolio/fujiarte",
          cta: "Read Fujiarte Case",
          conciergePrompt:
            "How was SelectSys Jobs architected for Fujiarte?",
        },
        {
          id: "mercadinhosys",
          code: "03 / MULTI-TENANT ERP & FISCAL POS",
          pill: "Retail & Supermarkets · Live",
          title: "mercadinhosys — transactional inventory, fiscal POS & commercial BI",
          businessSummary:
            "Unifies POS sales, supplier XML ingestion, and ABC Curve, RFM, and P&L dashboards to stop stockouts and cash discrepancies.",
          archSummary:
            "Fail-closed ORM TenantQuery + nested transaction savepoints + NFC-e fiscal engine + Python analytics (Pandas, Statsmodels, Plotly) + Sentry.",
          tags: ["Python / Flask", "PostgreSQL", "Fiscal NFC-e", "Pandas + Plotly", "Redis"],
          href: "/portfolio",
          cta: "Explore Portfolio",
          conciergePrompt:
            "What is mercadinhosys's multi-tenant and BI architecture?",
        },
        {
          id: "mysuperstore",
          code: "04 / HEADLESS MARKETPLACE & PIX SPLIT",
          pill: "Multi-Vendor Commerce · Course Case Study",
          title: "MySuperStore — automated revenue split without blocking checkout",
          businessSummary:
            "Multi-seller marketplace featuring PIX/card payments, automated settlement split across stores, and real-time shipping quotes.",
          archSummary:
            "Django REST + Next.js 15 + PostgreSQL (integer-cent ledger & conditional stock locks) + idempotent Efí webhooks + Celery/Redis workers.",
          tags: ["Django REST", "Next.js 15", "PostgreSQL", "Celery + Redis", "PIX Split"],
          href: "/cursos/construa-seu-marketplace",
          cta: "Explore in Academy",
          conciergePrompt:
            "How does payment splitting and idempotency work in MySuperStore?",
        },
      ];

  return (
    <div className="studio-home">
      {/* ============================================================ */}
      {/* MOMENTO 1: HERO EXECUTIVO + CREDENCIAIS + ROTEADOR DE INTENÇÃO */}
      {/* ============================================================ */}
      <header className="studio-hero" id="top">
        <div className="wrap">
          <div className="studio-hero-grid">
            <div className="studio-hero-copy">
              <div className="studio-kicker">
                <span />
                {pt
                  ? "ENGENHARIA DE SOFTWARE · SAAS MULTI-TENANT · SÃO PAULO"
                  : "SOFTWARE ENGINEERING · MULTI-TENANT SAAS · SÃO PAULO"}
              </div>
              <h1>
                {pt ? "Sistemas sob medida" : "Production systems"}
                <br />
                {pt ? "para operações que" : "built for teams that"}
                <br />
                <em>{pt ? "não podem parar." : "cannot stall."}</em>
                <Sparkles aria-hidden="true" />
              </h1>
              <p>
                {pt
                  ? "Sou Rafael Maldivas. Construo plataformas SaaS, ERPs e automações com IA — da conversa com quem opera ao sistema rodando em produção."
                  : "I'm Rafael Maldivas. I architect production SaaS platforms, custom ERPs, and applied AI workflows — from discovery to live deployment."}
              </p>

              <div className="hero-credentials-strip">
                <a
                  className="cert-chip"
                  href={ORACLE_CERT.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="cert_click"
                >
                  <BadgeCheck size={17} />
                  <span>
                    <strong>Oracle Certified</strong> · {ORACLE_CERT.name}
                  </span>
                  <small>
                    {pt ? "verificar" : "verify"} <ArrowUpRight size={13} />
                  </small>
                </a>
                <div className="trust-micro-pills">
                  <span>
                    <ShieldCheck size={14} aria-hidden="true" /> Meta Tech Provider
                  </span>
                  <span>
                    <CheckCircle2 size={14} aria-hidden="true" /> iFood Homologado
                  </span>
                  <span>CNPJ 68.923.239/0001-77</span>
                </div>
              </div>

              <div className="studio-actions">
                <a href="#diagnostico" className="btn studio-primary">
                  {pt ? "Gerar Diagnóstico IA Gratuito" : "Free AI Architecture Plan"}
                  <ArrowUpRight size={18} />
                </a>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => openPortfolioConcierge()}
                >
                  <Bot size={17} aria-hidden="true" />
                  <span>{pt ? "Perguntar ao Agente IA" : "Ask AI Concierge"}</span>
                </button>
                <a href="#produtos" className="studio-text-link">
                  {pt ? "Ver sistemas em produção" : "Explore live systems"}
                  <ArrowDown size={16} />
                </a>
              </div>

              <div className="studio-hero-note">
                <span className="studio-avatars">RM</span>
                <span>
                  {pt
                    ? "Contrato, nota fiscal e contato direto."
                    : "Formal contracts, invoicing & senior ownership."}
                  <strong>
                    {pt
                      ? "Você fala com quem desenha e entrega."
                      : "You talk directly to the builder."}
                  </strong>
                </span>
              </div>
            </div>

            <div className="studio-portrait-composition">
              <div className="studio-orbit" aria-hidden="true" />
              <figure className="studio-portrait">
                <Image
                  src="/media/rafael-drone.jpg"
                  alt={
                    pt
                      ? "Rafael Maldivas pilotando drone em operação audiovisual e de engenharia"
                      : "Rafael Maldivas operating a drone in the field"
                  }
                  fill
                  priority
                  sizes="(max-width: 800px) 90vw, 45vw"
                  quality={85}
                />
                <span className="studio-photo-label">
                  PINHEIROS, SP · {pt ? "ATUAÇÃO GLOBAL" : "GLOBAL DELIVERY"}
                </span>
                <figcaption>
                  <span>{pt ? "Fundador & Product Owner" : "Founder & Product Owner"}</span>
                  <strong>
                    Rafael Maldivas<span>.</span>
                  </strong>
                  <small>
                    {pt
                      ? "Software · Dados & BI · IA Agêntica · Audiovisual"
                      : "Software · Data & BI · Agentic AI · Audiovisual"}
                  </small>
                </figcaption>
              </figure>
              <div className="studio-float">
                <span>
                  <Film size={20} aria-hidden="true" />
                </span>
                <div>
                  {pt ? "Da arquitetura ao deploy" : "From schema to production"}
                  <small>
                    {pt
                      ? "Next.js · Python · PostgreSQL · Three.js"
                      : "Next.js · Python · PostgreSQL · Three.js"}
                  </small>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* Barra de Auto-Segmentação (Funil B2B / SaaS / Academy) */}
          <nav
            className="hero-intent-router"
            aria-label={pt ? "Caminhos por objetivo" : "Paths by objective"}
          >
            {intentRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <a key={route.code} href={route.href} className="intent-route-card">
                  <div className="intent-route-top">
                    <span className="intent-route-code">{route.code}</span>
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <strong>{route.title}</strong>
                  <p>{route.desc}</p>
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOMENTO 2: VITRINE FLAGSHIP + TOGGLE NEGÓCIO vs ARQUITETURA  */}
      {/* ============================================================ */}
      <section id="produtos" className="studio-selected">
        <div className="wrap">
          <div className="studio-section-heading">
            <div>
              <div className="studio-kicker">
                01 / {pt ? "SISTEMAS EM PRODUÇÃO & PARCERIA HARDWARE" : "PRODUCTION SYSTEMS & HARDWARE"}
              </div>
              <h2>
                {pt ? "Software que fecha a conta" : "Software that closes the loop"}
                <br />
                <span>
                  {pt ? "na operação de verdade." : "in real daily operations."}
                </span>
              </h2>
            </div>

            <div className="showcase-controls">
              <div
                className="showcase-mode-toggle"
                role="group"
                aria-label={pt ? "Nível de leitura técnica" : "Technical detail toggle"}
              >
                <button
                  type="button"
                  aria-pressed={showcaseMode === "business"}
                  className={showcaseMode === "business" ? "is-active" : ""}
                  onClick={() => setShowcaseMode("business")}
                >
                  {pt ? "Visão de Negócio" : "Business Impact"}
                </button>
                <button
                  type="button"
                  aria-pressed={showcaseMode === "architecture"}
                  className={showcaseMode === "architecture" ? "is-active" : ""}
                  onClick={() => setShowcaseMode("architecture")}
                >
                  {pt ? "Raio-X Arquitetura" : "Architecture X-Ray"}
                </button>
              </div>

              <Link
                className="studio-text-link"
                href={localePath("/portfolio", lang)}
                data-analytics="portfolio_click"
              >
                {pt ? "Explorar portfólio" : "Explore portfolio"}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          {/* Card Principal Integrado: MiseOn + Hardware Bravus Core / Gertec */}
          <div className="flagship-hero-card">
            <div className="flagship-hero-copy">
              <div className="flagship-meta-row">
                <span className="studio-pill">
                  {pt
                    ? "01 / FOOD SERVICE · SOFTWARE + HARDWARE"
                    : "01 / FOOD SERVICE · SOFTWARE + HARDWARE"}
                </span>
                <span className="flagship-status-pill">
                  {pt ? "Em operação · Meta & iFood" : "Live · Meta & iFood"}
                </span>
              </div>

              <div className="flagship-brand-lockup">
                <Image
                  src="/logo-horiz-miseon.png"
                  alt="MiseOn"
                  width={170}
                  height={48}
                  style={{ objectFit: "contain" }}
                />
                <span className="flagship-divider" aria-hidden="true">
                  ×
                </span>
                <span className="bravus-wordmark">
                  BRAVUS <strong>CORE</strong> · GERTEC
                </span>
              </div>

              <h3>
                {pt
                  ? "Da cozinha ao totem de autoatendimento: pedidos, estoque PEPS e NFC-e sem redigitação."
                  : "From kitchen display to self-service kiosk: orders, FIFO stock, and fiscal POS unified."}
              </h3>

              <p className="flagship-summary">
                {showcaseMode === "business"
                  ? pt
                    ? "Conectamos a inteligência do SaaS MiseOn aos terminais comerciais Bravus Core e Gertec. O cliente pede e paga no totem ou Smart POS, o estoque baixa por ficha técnica e a cozinha recebe no KDS em tempo real."
                    : "MiseOn's multi-tenant software paired with commercial Bravus Core & Gertec terminals. Guests order and pay directly on kiosks, recipe-costed stock updates automatically, and the kitchen tracks prep on KDS."
                  : pt
                    ? "Arquitetura multi-tenant em React 19 + Supabase PostgreSQL (RLS), persistência offline-first (IndexedDB + Service Workers), salão espacial com Three.js/Konva, testes de carga k6, webhooks iFood/WhatsApp e PDV NFC-e."
                    : "Multi-tenant React 19 + Supabase PostgreSQL (RLS), offline-first IndexedDB + Service Workers, Three.js/Konva floor layout, k6 load-tested checkout, iFood/WhatsApp APIs, and fiscal POS."}
              </p>

              <div className="flagship-feature-strip">
                <div>
                  <MonitorSmartphone size={18} aria-hidden="true" />
                  <span>
                    {pt ? "Autoatendimento & KDS" : "Self-Service Kiosk & KDS"}
                  </span>
                </div>
                <div>
                  <Receipt size={18} aria-hidden="true" />
                  <span>
                    {pt ? "Smart POS + NFC-e" : "Smart POS + Fiscal Receipt"}
                  </span>
                </div>
                <div>
                  <Server size={18} aria-hidden="true" />
                  <span>
                    {pt ? "PEPS + iFood + WhatsApp" : "FIFO Stock + iFood + WhatsApp"}
                  </span>
                </div>
              </div>

              <div className="flagship-actions">
                <Link
                  href={localePath("/produtos/miseon", lang)}
                  className="btn btn-primary"
                  data-analytics="portfolio_click"
                >
                  <span>{pt ? "Conhecer MiseOn" : "Explore MiseOn"}</span>
                  <ArrowUpRight size={17} />
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    openPortfolioConcierge(
                      pt
                        ? "Como funciona a parceria MiseOn + Totens Bravus Core e quanto custa?"
                        : "How does MiseOn + Bravus Core kiosk integration work?",
                    )
                  }
                >
                  <Bot size={16} aria-hidden="true" />
                  <span>{pt ? "Perguntar à IA" : "Ask AI Agent"}</span>
                </button>
              </div>
            </div>

            <div className="flagship-hardware-gallery">
              <div className="flagship-hw-tile">
                <Image
                  src="/partners/bravus-1.jpg"
                  alt={pt ? "Terminal comercial Gertec integrado" : "Integrated Gertec terminal"}
                  fill
                  sizes="(max-width: 900px) 45vw, 240px"
                  style={{ objectFit: "contain", padding: "10px" }}
                />
              </div>
              <div className="flagship-hw-tile">
                <Image
                  src="/partners/bravus-2.jpg"
                  alt={pt ? "Totem de autoatendimento MiseOn Bravus Core" : "MiseOn Bravus Core kiosk"}
                  fill
                  sizes="(max-width: 900px) 45vw, 240px"
                  style={{ objectFit: "contain", padding: "10px" }}
                />
              </div>
              <div className="flagship-hw-tile is-wide">
                <Image
                  src="/partners/bravus-3.jpg"
                  alt={pt ? "Terminal MiseOn operando em ambiente comercial" : "MiseOn terminal in commercial environment"}
                  fill
                  sizes="(max-width: 900px) 90vw, 480px"
                  style={{ objectFit: "contain", padding: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* 3 Plataformas Complementares (SelectSys, MercadinhoSys, MySuperStore) */}
          <div className="flagship-secondary-grid">
            {flagshipSecondary.map((item) => (
              <article key={item.id} className="flagship-secondary-card">
                <div className="flagship-secondary-top">
                  <span className="flagship-code">{item.code}</span>
                  <span className="studio-pill">{item.pill}</span>
                </div>
                <h3>{item.title}</h3>
                <p>
                  {showcaseMode === "business" ? item.businessSummary : item.archSummary}
                </p>
                <div className="tags">
                  {item.tags.map((tg) => (
                    <span className="tag" key={tg}>
                      {tg}
                    </span>
                  ))}
                </div>
                <div className="flagship-secondary-foot">
                  <Link href={localePath(item.href, lang)} className="plink solid">
                    <span>{item.cta}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                  <button
                    type="button"
                    className="plink"
                    onClick={() => openPortfolioConcierge(item.conciergePrompt)}
                  >
                    <Bot size={15} aria-hidden="true" />
                    <span>{pt ? "Raio-X IA" : "AI Q&A"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MOMENTO 3: WORKBENCH INTERATIVO UNIFICADO (IA + ROI + TOOLS) */}
      {/* ============================================================ */}
      <WorkbenchHub />

      {/* ============================================================ */}
      {/* MOMENTO 4: CASOS DOCUMENTADOS & MÉTODO DE ENGENHARIA         */}
      {/* ============================================================ */}
      <CaseHighlights />

      <section className="studio-method" id="metodo">
        <div className="wrap">
          <div className="studio-section-heading">
            <div>
              <div className="studio-kicker">
                04 / {pt ? "PROCESSO TRANSPARENTE" : "TRANSPARENT DELIVERY"}
              </div>
              <h2>
                {pt
                  ? "Trabalho sério começa entendendo o negócio."
                  : "Solid software starts by understanding the business."}
              </h2>
            </div>
          </div>
          <div className="studio-method-grid">
            {(pt
              ? [
                  [
                    "Escutar de verdade",
                    "Mapeio sua rotina, onde o dinheiro vaza e onde a equipe redigita dados antes de abrir o editor de código.",
                  ],
                  [
                    "Combinar o caminho",
                    "Escopo, prazo, modelo de dados e critérios de aceite documentados em contrato antes de começar.",
                  ],
                  [
                    "Construir com validação",
                    "Entregas semanais em ambiente de homologação para quem opera testar junto e ajustar rápido.",
                  ],
                  [
                    "Entregar com garantia",
                    "Deploy seguro, treinamento da equipe, nota fiscal e 90 dias de garantia técnica sobre o escopo.",
                  ],
                ]
              : [
                  [
                    "Listen to operations",
                    "I map your workflow, revenue leaks, and manual bottlenecks before writing a single line of code.",
                  ],
                  [
                    "Lock clear scope",
                    "Architecture, timeline, data boundaries, and deliverables agreed transparently upfront.",
                  ],
                  [
                    "Build in weekly slices",
                    "Weekly staging releases so real operators test screens early and shape final polish.",
                  ],
                  [
                    "Ship with warranty",
                    "Production deploy, team onboarding, formal invoicing, and 90-day scope warranty.",
                  ],
                ]
            ).map(([title, desc], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MOMENTO 5: MALDIVAS TECH ACADEMY & ARENA PRÁTICA             */}
      {/* ============================================================ */}
      <div id="academy">
        <CourseInvite />
      </div>

      {/* ============================================================ */}
      {/* MOMENTO 6: BRIEFING TÉCNICO & CONTATO DIRETO                 */}
      {/* ============================================================ */}
      <BriefingForm />

      <section id="contato" className="studio-contact">
        <div className="wrap">
          <div className="studio-kicker">
            {pt ? "O PRÓXIMO PROJETO PODE SER O SEU." : "THE NEXT PROJECT COULD BE YOURS."}
          </div>
          <h2>
            {pt ? "Vamos tirar" : "Ready to ship"}
            <br />
            <em>{pt ? "do papel?" : "something real?"}</em>
          </h2>
          <p>
            {pt
              ? "Conte sua necessidade ou tire dúvidas agora mesmo pelo WhatsApp ou com o Agente IA."
              : "Share your challenge on WhatsApp or ask our AI Concierge to explore architecture options."}
          </p>
          <div className="studio-contact-actions">
            <a
              className="btn studio-primary"
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="contact_click"
            >
              {pt ? "Conversar com o Rafael" : "Talk to Rafael"}
              <ArrowUpRight size={20} />
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => openPortfolioConcierge()}
            >
              <Bot size={18} aria-hidden="true" />
              <span>{pt ? "Abrir Concierge IA" : "Open AI Concierge"}</span>
            </button>
          </div>
          <span className="studio-contact-sign">
            Rafael Maldivas · Maldivas Tech · CNPJ 68.923.239/0001-77
          </span>
        </div>
      </section>

      <ExitToast />
    </div>
  );
}
