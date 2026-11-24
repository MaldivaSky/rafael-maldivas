"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Film,
  Layers,
  MessageCircle,
  MonitorSmartphone,
  Receipt,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
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
          code: "00 · WHATSAPP API OFICIAL",
          title: "Atol Connect: entre com Google e teste 14 dias",
          desc: "API oficial da Meta a partir de R$ 79, sem markup. Para empresas e software houses.",
          href: localePath("/whatsapp-api", lang),
          icon: MessageCircle,
        },
        {
          code: "01 · B2B SOB MEDIDA",
          title: "Sistemas internos, ERPs & automação",
          desc: "Para empresas que querem eliminar planilhas paralelas e integrar operação.",
          href: "#diagnostico",
          icon: Code2,
        },
        {
          code: "02 · SAAS & HARDWARE",
          title: "MiseOn, MercadinhoSys (.com.br) & SelectSys",
          desc: "Plataformas multi-tenant reais operando com clientes no varejo, food service e RH.",
          href: "#produtos",
          icon: Cpu,
        },
        {
          code: "03 · WHITE-LABEL & ACADEMY",
          title: "MySuperStore (Eli Macramê) & Arena",
          desc: "Personalize a sua loja com esse marketplace ou aprenda a arquitetura real em 18 aulas.",
          href: "#mysuperstore-showcase",
          icon: Layers,
        },
      ]
    : [
        {
          code: "00 · OFFICIAL WHATSAPP API",
          title: "Atol Connect: sign in with Google, 14-day trial",
          desc: "Meta's official API from BRL 79, no markup. For businesses and software houses.",
          href: localePath("/whatsapp-api", lang),
          icon: MessageCircle,
        },
        {
          code: "01 · CUSTOM B2B",
          title: "Internal systems, ERPs & automation",
          desc: "For companies replacing scattered spreadsheets with unified, auditable software.",
          href: "#diagnostico",
          icon: Code2,
        },
        {
          code: "02 · SAAS & HARDWARE",
          title: "MiseOn, MercadinhoSys (.com.br) & SelectSys",
          desc: "Production multi-tenant SaaS serving real retail, food service, and recruiting clients.",
          href: "#produtos",
          icon: Cpu,
        },
        {
          code: "03 · WHITE-LABEL & ACADEMY",
          title: "MySuperStore (Eli Macramê) & Arena",
          desc: "Launch your custom marketplace storefront or inspect every line in the 18-lesson Academy.",
          href: "#mysuperstore-showcase",
          icon: Layers,
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
                  ? "Sou Rafael Maldivas. Construo plataformas SaaS com domínio próprio e clientes reais em operação — MiseOn, MercadinhoSys (.com.br), SelectSys e MySuperStore."
                  : "I'm Rafael Maldivas. I architect live SaaS platforms running on custom domains with real production clients — MiseOn, MercadinhoSys (.com.br), SelectSys, and MySuperStore."}
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
                    <ShieldCheck size={14} aria-hidden="true" /> WhatsApp API oficial (Meta)
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
                  <small>Next.js · Python · PostgreSQL · Three.js</small>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* Barra de Auto-Segmentação (Funil B2B / SaaS / White-Label & Academy) */}
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
      {/* MOMENTO 2: VITRINES FLAGSHIP COM CLIENTES REAIS + TOGGLE     */}
      {/* ============================================================ */}
      <section id="produtos" className="studio-selected">
        <div className="wrap">
          <div className="studio-section-heading">
            <div>
              <div className="studio-kicker">
                01 /{" "}
                {pt
                  ? "SISTEMAS EM PRODUÇÃO · DOMÍNIOS PRÓPRIOS & CLIENTES REAIS"
                  : "PRODUCTION SYSTEMS · LIVE DOMAINS & REAL CLIENTS"}
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
                href={localePath("/produtos", lang)}
                data-analytics="product_click"
              >
                {pt ? "Ver catálogo SaaS" : "View SaaS catalog"}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          {/* Flagship 01: MiseOn + Hardware Bravus Core / Gertec */}
          <div className="flagship-hero-card">
            <div className="flagship-hero-copy">
              <div className="flagship-meta-row">
                <span className="studio-pill">
                  01 / FOOD SERVICE · miseon.app.br
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
                  <span>{pt ? "Autoatendimento & KDS" : "Self-Service Kiosk & KDS"}</span>
                </div>
                <div>
                  <Receipt size={18} aria-hidden="true" />
                  <span>{pt ? "Smart POS + NFC-e" : "Smart POS + Fiscal Receipt"}</span>
                </div>
                <div>
                  <Server size={18} aria-hidden="true" />
                  <span>{pt ? "PEPS + iFood + WhatsApp" : "FIFO Stock + iFood + WhatsApp"}</span>
                </div>
              </div>

              <div className="flagship-actions">
                <a
                  href="https://miseon.app.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  data-analytics="product_demo"
                >
                  <ExternalLink size={16} />
                  <span>{pt ? "Acessar miseon.app.br" : "Open miseon.app.br"}</span>
                </a>
                <Link
                  href={localePath("/produtos/miseon", lang)}
                  className="btn btn-ghost"
                  data-analytics="product_click"
                >
                  <span>{pt ? "Detalhes & Planos" : "Specs & Pricing"}</span>
                  <ArrowUpRight size={16} />
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    openPortfolioConcierge(
                      pt
                        ? "Como funciona a parceria MiseOn + Totens Bravus Core?"
                        : "How does MiseOn + Bravus Core kiosk integration work?",
                    )
                  }
                >
                  <Bot size={16} aria-hidden="true" />
                  <span>{pt ? "Perguntar à IA" : "Ask AI"}</span>
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

          {/* Flagship 02: MercadinhoSys — Domínio próprio mercadinhosys.com.br + Cliente Real */}
          <div className="flagship-hero-card flagship-mercadinhosys">
            <div className="flagship-hero-copy">
              <div className="flagship-meta-row">
                <span className="studio-pill">
                  02 / VAREJO &amp; ERP · mercadinhosys.com.br
                </span>
                <span className="flagship-status-pill is-gold">
                  {pt ? "Domínio Próprio · Cliente Real em Operação" : "Custom Domain · Real Client Live"}
                </span>
              </div>

              <div className="flagship-brand-lockup">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mercadinhosys.png"
                  alt=""
                  width={48}
                  height={48}
                  className="prod-brand-icon"
                />
                <div className="flagship-logo-plate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-horiz-mercadinhosys.png"
                    alt="MercadinhoSys"
                  />
                </div>
              </div>

              <h3>
                {pt
                  ? "ERP multi-tenant com PDV fiscal NFC-e, entrada por XML e BI comercial em produção real."
                  : "Live retail ERP featuring fiscal NFC-e POS, XML intake, and commercial BI."}
              </h3>

              <p className="flagship-summary">
                {showcaseMode === "business"
                  ? pt
                    ? "Rodando em domínio próprio (mercadinhosys.com.br) com cliente real de varejo operando no dia a dia: unifica caixa PDV, importação automática de XML do fornecedor e painéis de Curva ABC, matriz RFM e DRE para travar rupturas."
                    : "Operating on its dedicated domain (mercadinhosys.com.br) with an active retail client: unifies POS checkout, automated supplier XML ingestion, ABC Curve, RFM segmentation, and P&L dashboards."
                  : pt
                    ? "TenantQuery fail-closed no SQLAlchemy/PostgreSQL + savepoints aninhados no fechamento de venda + motor NFC-e SEFAZ + pipeline Python (Pandas, Statsmodels, Plotly) + cache Redis + observabilidade Sentry."
                    : "Fail-closed ORM TenantQuery in PostgreSQL + nested savepoints at POS checkout + SEFAZ NFC-e fiscal engine + Python analytics (Pandas, Statsmodels, Plotly) + Redis + Sentry."}
              </p>

              <div className="flagship-feature-strip">
                <div>
                  <Receipt size={18} aria-hidden="true" />
                  <span>{pt ? "PDV Fiscal NFC-e + XML" : "Fiscal POS + XML Intake"}</span>
                </div>
                <div>
                  <BarChart3 size={18} aria-hidden="true" />
                  <span>{pt ? "Curva ABC + RFM + DRE" : "ABC Curve + RFM + P&L"}</span>
                </div>
                <div>
                  <Database size={18} aria-hidden="true" />
                  <span>{pt ? "Estoque Transacional PostgreSQL" : "PostgreSQL Stock Ledger"}</span>
                </div>
              </div>

              <div className="flagship-actions">
                <a
                  href="https://mercadinhosys.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  data-analytics="product_demo"
                >
                  <ExternalLink size={16} />
                  <span>{pt ? "Acessar mercadinhosys.com.br" : "Open mercadinhosys.com.br"}</span>
                </a>
                <Link
                  href={localePath("/produtos/mercadinhosys", lang)}
                  className="btn btn-ghost"
                  data-analytics="product_click"
                >
                  <span>{pt ? "Conhecer MercadinhoSys" : "Product Details"}</span>
                  <ArrowUpRight size={16} />
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    openPortfolioConcierge(
                      pt
                        ? "Qual a arquitetura multi-tenant, NFC-e e BI do MercadinhoSys em mercadinhosys.com.br?"
                        : "What is MercadinhoSys's multi-tenant and BI architecture?",
                    )
                  }
                >
                  <Bot size={16} aria-hidden="true" />
                  <span>{pt ? "Raio-X IA" : "AI Q&A"}</span>
                </button>
              </div>
            </div>

            <div className="flagship-visual-showcase">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/mercadinhosys-flagship.jpg"
                alt={
                  pt
                    ? "Dashboard executivo do MercadinhoSys exibindo PDV fiscal NFC-e, Curva ABC/RFM e PostgreSQL"
                    : "MercadinhoSys executive showcase displaying NFC-e POS, ABC/RFM analytics and PostgreSQL"
                }
                loading="lazy"
              />
            </div>
          </div>

          {/* Flagship 05: Atol Connect — API oficial do WhatsApp Business */}
          <div className="flagship-hero-card flagship-atol-connect">
            <div className="flagship-hero-copy">
              <div className="flagship-meta-row">
                <span className="studio-pill">05 / WHATSAPP CLOUD API · connect.maldivastech.dev</span>
                <span className="flagship-status-pill">
                  {pt ? "API oficial da Meta · Teste grátis 14 dias" : "Official Meta API · 14-day free trial"}
                </span>
              </div>

              <div className="flagship-brand-lockup">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-atol-connect.png" alt="" width={48} height={48} className="prod-brand-icon" />
                <strong>Atol Connect</strong>
              </div>

              <h3>
                {pt
                  ? "API oficial do WhatsApp Business para empresas e software houses, sem markup por mensagem."
                  : "Official WhatsApp Business API for businesses and software houses, with no per-message markup."}
              </h3>

              <p className="flagship-summary">
                {showcaseMode === "business"
                  ? pt
                    ? "Conecte o número pelo fluxo oficial da Meta, atenda em equipe numa caixa de entrada em tempo real e integre ERP, PDV e loja virtual por REST API. Planos a partir de R$ 79/mês; a tarifa da Meta é paga direto à Meta."
                    : "Connect your number through Meta's official flow, serve customers from a real-time team inbox and integrate ERP, POS and storefronts through a REST API. Plans from BRL 79/month; Meta's fees are paid directly to Meta."
                  : pt
                    ? "Next.js + Supabase PostgreSQL com RLS por organização, Embedded Signup, tokens cifrados (AES-256-GCM), webhooks de entrada validados por HMAC e de saída assinados com reentrega, OpenAPI 3.1."
                    : "Next.js + Supabase PostgreSQL with per-organization RLS, Embedded Signup, AES-256-GCM encrypted tokens, HMAC-validated inbound webhooks and signed outbound webhooks with redelivery, OpenAPI 3.1."}
              </p>

              <div className="flagship-feature-strip">
                <div>
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>{pt ? "Inbox em equipe" : "Team inbox"}</span>
                </div>
                <div>
                  <Server size={18} aria-hidden="true" />
                  <span>{pt ? "REST API + Webhooks" : "REST API + Webhooks"}</span>
                </div>
                <div>
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>{pt ? "Multi-tenant + LGPD" : "Multi-tenant + LGPD"}</span>
                </div>
              </div>

              <div className="flagship-actions">
                <a
                  href="https://connect.maldivastech.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  data-analytics="product_demo"
                >
                  <ExternalLink size={16} />
                  <span>{pt ? "Acessar connect.maldivastech.dev" : "Open connect.maldivastech.dev"}</span>
                </a>
                <Link
                  href={localePath("/produtos/atol-connect", lang)}
                  className="btn btn-ghost"
                  data-analytics="product_click"
                >
                  <span>{pt ? "Detalhes & Planos" : "Specs & Pricing"}</span>
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href={localePath("/ferramentas/calculadora-custo-whatsapp-api", lang)}
                  className="btn btn-ghost"
                  data-analytics="tool_click"
                >
                  <span>{pt ? "Calcular custo" : "Cost calculator"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2 Plataformas Complementares em Grid 2 Colunas Equilibrado (SelectSys & MySuperStore White-Label) */}
          <div className="flagship-secondary-grid" id="mysuperstore-showcase">
            {/* 03: SelectSys Jobs */}
            <article className="flagship-secondary-card">
              <div className="flagship-card-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/selectsys-flagship.jpg"
                  alt={
                    pt
                      ? "SelectSys Jobs ATS bilíngue Brasil Japão com scanner OCR e proteção LGPD"
                      : "SelectSys Jobs bilingual ATS dashboard with passport OCR and LGPD compliance"
                  }
                  loading="lazy"
                />
              </div>

              <div className="flagship-secondary-top">
                <span className="flagship-code">03 / ATS BILÍNGUE BRASIL → JAPÃO</span>
                <span className="studio-pill">
                  {pt ? "Cliente Real · Fujiarte Co., Ltd." : "Real Client · Fujiarte Co., Ltd."}
                </span>
              </div>

              <div className="flagship-mini-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-selectsys.png" alt="" width={36} height={36} className="prod-brand-icon" />
                <div className="prod-logo-plate is-mini">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-horiz-selectsys.png" alt="SelectSys Jobs" />
                </div>
              </div>

              <h3>
                {pt
                  ? "SelectSys Jobs — triagem internacional sem planilhas paralelas"
                  : "SelectSys Jobs — cross-border recruiting without manual spreadsheets"}
              </h3>
              <p>
                {showcaseMode === "business"
                  ? pt
                    ? "Substituiu e-mails e formulários soltos na agência Fujiarte (60+ anos conectando Brasil e Japão), cortando em 60% o tempo de triagem documental manual com conformidade LGPD."
                    : "Replaced scattered spreadsheets at Fujiarte (60+ years connecting Brazil and Japan), cutting manual screening time by 60% with strict LGPD isolation."
                  : pt
                    ? "React 19 + PostgreSQL Row Level Security (LGPD) + OCR automático com Tesseract.js/PDF.js + exportação fiel para planilhas ExcelJS/Python + Edge Functions."
                    : "React 19 + PostgreSQL Row Level Security (LGPD) + Tesseract.js/PDF.js OCR + faithful ExcelJS exports + Edge Functions."}
              </p>

              <div className="tags">
                {["React 19", "PostgreSQL RLS", "Tesseract OCR", "ExcelJS", "LGPD"].map((tg) => (
                  <span className="tag" key={tg}>
                    {tg}
                  </span>
                ))}
              </div>

              <div className="flagship-secondary-foot">
                <Link href={localePath("/produtos/selectsys-jobs", lang)} className="plink solid">
                  <span>{pt ? "Conhecer SelectSys Jobs" : "Explore SelectSys"}</span>
                  <ArrowUpRight size={15} />
                </Link>
                <Link href={localePath("/portfolio/fujiarte", lang)} className="plink">
                  <span>{pt ? "Ver Case Fujiarte" : "Fujiarte Case"}</span>
                </Link>
                <button
                  type="button"
                  className="plink"
                  onClick={() =>
                    openPortfolioConcierge(
                      pt
                        ? "Como o SelectSys Jobs ajudou a agência Fujiarte?"
                        : "How was SelectSys Jobs architected for Fujiarte?",
                    )
                  }
                >
                  <Bot size={15} aria-hidden="true" />
                  <span>{pt ? "Raio-X IA" : "AI Q&A"}</span>
                </button>
              </div>
            </article>

            {/* 04: MySuperStore — Personalize a sua loja com esse marketplace (Cliente Real: Loja de Macramê da Eli) */}
            <article className="flagship-secondary-card is-highlighted">
              <div className="flagship-card-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/mysuperstore-architecture.jpg"
                  alt={
                    pt
                      ? "Arquitetura do MySuperStore com gateway PIX Split 88% lojista 12% plataforma, HMAC Gate e Celery Redis"
                      : "MySuperStore distributed architecture showing PIX Split, HMAC gate and Celery/Redis workers"
                  }
                  loading="lazy"
                />
              </div>

              <div className="flagship-secondary-top">
                <span className="flagship-code">
                  04 / MARKETPLACE WHITE-LABEL · PERSONALIZE A SUA LOJA
                </span>
                <span className="flagship-status-pill is-gold">
                  {pt
                    ? "Cliente Real em Operação: Loja de Macramê da Eli"
                    : "Real Store Live: Eli's Macramê Shop"}
                </span>
              </div>

              <div className="flagship-mini-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mysuperstore.png" alt="" width={36} height={36} className="prod-brand-icon" />
                <div className="prod-logo-dark is-mini">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-horiz-mysuperstore.png" alt="MySuperStore" />
                </div>
              </div>

              <h3>
                {pt
                  ? "MySuperStore — personalize a sua loja com este marketplace multi-vendedor"
                  : "MySuperStore — launch your own custom storefront inside our marketplace"}
              </h3>
              <p>
                {showcaseMode === "business"
                  ? pt
                    ? "Plataforma pronta para empreendedores e marcas personalizarem sua própria loja em dias — já validada em produção por clientes reais como a Loja de Macramê da Eli — com checkout PIX/cartão, split automático na liquidação e frete calculado na hora."
                    : "Turnkey multi-vendor marketplace ready for real merchants — proven in production by Eli's Macramê Store — featuring branded storefronts, instant shipping quotes, and automated PIX split payouts."
                  : pt
                    ? "Django REST + Next.js 15 + PostgreSQL (ledger em centavos inteiros + lock condicional UPDATE de estoque) + webhook Efí Bank com assinatura HMAC e chave idempotente + fila Celery/Redis."
                    : "Django REST + Next.js 15 + PostgreSQL (integer-cent ledger & conditional stock locks) + idempotent Efí Bank HMAC webhooks + Celery/Redis workers."}
              </p>

              <div className="tags">
                {["Django REST", "Next.js 15", "Loja de Macramê da Eli", "Efí PIX Split", "Celery + Redis"].map((tg) => (
                  <span className="tag" key={tg}>
                    {tg}
                  </span>
                ))}
              </div>

              <div className="flagship-secondary-foot">
                <Link
                  href={`${localePath("/cursos/construa-seu-marketplace/pratica", lang)}?estacao=loja`}
                  className="plink solid"
                >
                  <Store size={15} aria-hidden="true" />
                  <span>{pt ? "Personalizar Minha Loja" : "Customize Storefront"}</span>
                </Link>
                <a
                  href="https://mysuperstore-lime.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plink"
                >
                  <ShoppingBag size={15} aria-hidden="true" />
                  <span>{pt ? "Abrir Marketplace" : "Live Marketplace"}</span>
                </a>
                <button
                  type="button"
                  className="plink"
                  onClick={() =>
                    openPortfolioConcierge(
                      pt
                        ? "Como personalizar uma loja no MySuperStore (como a Loja de Macramê da Eli) e como funciona o split PIX?"
                        : "How do merchants like Eli Macramê launch customizable storefronts on MySuperStore?",
                    )
                  }
                >
                  <Bot size={15} aria-hidden="true" />
                  <span>{pt ? "Raio-X IA" : "AI Q&A"}</span>
                </button>
              </div>
            </article>
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
