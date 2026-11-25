import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  Star,
  Zap,
  ShieldCheck,
  BarChart3,
  Layers,
  FileText,
  Users,
  TrendingUp,
  Package,
  Database,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { isLang, type Lang } from "../../../lib/seo";
import { buildMetadata } from "../../../lib/metadata";
import { productList, type ProductSlug } from "../../../lib/products";
import { SITE } from "../../../lib/site";

export function generateStaticParams(): { lang: Lang; slug: ProductSlug }[] {
  const params: { lang: Lang; slug: ProductSlug }[] = [];
  for (const lang of ["pt", "en"] as const)
    for (const p of productList) params.push({ lang, slug: p.slug });
  return params;
}

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const product = productList.find((p) => p.slug === params.slug);
  if (!product) return {};
  const c = product.copy[lang];
  return buildMetadata({
    lang,
    path: `produtos/${product.slug}`,
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    ogType: "product",
  });
}

/* ──────────────────────────────────────────────
   Conteúdo editorial por produto e idioma
─────────────────────────────────────────────── */
type FeatureItem = { icon: LucideIcon; title: string; desc: string };
type Stat = { n: string; label: string };
type ProductContent = {
  heroLabel: string;
  problem: string;
  solutionTitle: string;
  features: FeatureItem[];
  stats: Stat[];
  cta: string;
  ctaDemo: string;
  ctaAllProducts: string;
  trialNote: string;
};

const CONTENT: Record<string, Record<Lang, ProductContent>> = {
  miseon: {
    pt: {
      heroLabel: "Sistema de gestão · Restaurantes e cozinhas profissionais",
      problem:
        "Restaurantes perdem margem porque o preço do prato não considera ficha técnica, quebra e variação de insumo. O controle vive em planilhas paralelas que ninguém atualiza.",
      solutionTitle: "Gestão que cabe na cozinha",
      features: [
        { icon: FileText, title: "Ficha técnica integrada", desc: "Monte o custo de cada prato com rendimento real, fator de correção e quebra. O preço de venda atualiza junto quando o insumo sobe." },
        { icon: BarChart3, title: "Precificação por CMV", desc: "Calcule automaticamente o preço mínimo viável considerando impostos, taxa de delivery e margem desejada — sem planilha." },
        { icon: Package, title: "Controle de estoque PEPS", desc: "Entrada de nota, baixa automática por venda e alerta de ruptura. Saiba o que está acabando antes de faltar." },
        { icon: Zap, title: "Integração com iFood & Bravus Core", desc: "Pedidos do iFood e de totens comerciais Bravus Core / Gertec entram direto na fila da cozinha (KDS), sem redigitar." },
        { icon: ShieldCheck, title: "PDV fiscal NFC-e", desc: "Emita NFC-e direto do balcão, sem equipamento adicional. Conformidade fiscal sem complicar a operação." },
        { icon: Layers, title: "Multi-tenant", desc: "Gerencie mais de uma unidade com o mesmo login. Visão unificada ou por filial, você decide." },
      ],
      stats: [
        { n: "WhatsApp", label: "API oficial da Meta" },
        { n: "iFood", label: "integração homologada" },
        { n: "R$149,90", label: "por mês, por unidade" },
        { n: "30 dias", label: "teste grátis" },
      ],
      cta: "Acessar miseon.app.br",
      ctaDemo: "Agendar demonstração",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "30 dias grátis · Em operação em miseon.app.br",
    },
    en: {
      heroLabel: "Management system · Restaurants and professional kitchens",
      problem:
        "Restaurants lose margin because menu prices ignore recipe cost, waste and ingredient volatility. Control lives in side spreadsheets nobody updates.",
      solutionTitle: "Management that fits in the kitchen",
      features: [
        { icon: FileText, title: "Integrated recipe costing", desc: "Build the cost of every dish with real yield, correction factor and waste. The selling price updates whenever an ingredient cost changes." },
        { icon: BarChart3, title: "Food-cost pricing", desc: "Automatically calculate the minimum viable price including taxes, delivery fee and target margin — no spreadsheet needed." },
        { icon: Package, title: "FIFO inventory control", desc: "Invoice intake, automatic deduction per sale and stock-out alerts. Know what's running low before you run out." },
        { icon: Zap, title: "iFood & Bravus Core hardware integration", desc: "iFood and Bravus Core / Gertec kiosk orders land directly in the kitchen queue — no retyping." },
        { icon: ShieldCheck, title: "Fiscal POS (NFC-e)", desc: "Issue fiscal receipts right at the counter with no extra hardware. Tax compliance without complicating the operation." },
        { icon: Layers, title: "Multi-tenant", desc: "Manage more than one location with the same login. Unified view or by branch — your call." },
      ],
      stats: [
        { n: "WhatsApp", label: "official Meta API" },
        { n: "iFood", label: "approved integration" },
        { n: "R$149.90", label: "per month, per location" },
        { n: "30 days", label: "free trial" },
      ],
      cta: "Open miseon.app.br",
      ctaDemo: "Schedule a demo",
      ctaAllProducts: "All products",
      trialNote: "30 days free · Live at miseon.app.br",
    },
  },

  mercadinhosys: {
    pt: {
      heroLabel: "ERP Multi-Tenant & PDV Fiscal · Domínio Próprio mercadinhosys.com.br · Validado no Varejo",
      problem:
        "Mercados, minimercados e varejistas perdem lucro todo mês com ruptura de gôndola, furos de caixa e digitação manual de notas fiscais de fornecedor. Sem histórico transacional de estoque nem leitura de margem real, o dono só descobre o prejuízo tarde demais.",
      solutionTitle: "Do XML do fornecedor ao PDV NFC-e e Curva ABC em tempo real",
      features: [
        { icon: ShieldCheck, title: "PDV Fiscal NFC-e homologado SEFAZ", desc: "Frente de caixa rápida com leitura de código de barras, contingência e emissão fiscal automática diretamente no ponto de venda." },
        { icon: Database, title: "Estoque Transacional & Entrada por XML", desc: "Importe o XML da NF-e do fornecedor para dar entrada em estoque e recalcular custo médio sem redigitar item por item." },
        { icon: BarChart3, title: "BI Comercial: Curva ABC, RFM & DRE", desc: "Dashboards analíticos gerados em Python (Pandas, Statsmodels e Plotly) revelando produtos campeões de margem, encalhes e fidelidade de clientes." },
        { icon: Layers, title: "Arquitetura Multi-Tenant Fail-Closed", desc: "Isolamento rigoroso por loja/CNPJ diretamente no PostgreSQL, com savepoints de transação e rastreabilidade completa de cada movimento de caixa." },
        { icon: TrendingUp, title: "Previsão de Demanda & Alerta de Ruptura", desc: "Séries temporais e giro diário indicam quando comprar cada SKU antes que o cliente encontre a prateleira vazia." },
        { icon: Zap, title: "Observabilidade Sentry em Produção", desc: "Monitoramento contínuo da operação real em mercadinhosys.com.br com telemetria de erros e auditoria de performance." },
      ],
      stats: [
        { n: ".com.br", label: "Domínio próprio em produção" },
        { n: "Varejo", label: "Plataforma validada · novas implantações em andamento" },
        { n: "NFC-e", label: "PDV Fiscal + Entrada XML" },
        { n: "Curva ABC", label: "BI com Pandas + Plotly" },
      ],
      cta: "Acessar mercadinhosys.com.br",
      ctaDemo: "Implantar na Minha Loja",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "2 meses grátis com implantação · Domínio próprio mercadinhosys.com.br · Plataforma validada no varejo, novas implantações em andamento",
    },
    en: {
      heroLabel: "Multi-Tenant Retail ERP & Fiscal POS · mercadinhosys.com.br · Retail-Validated",
      problem:
        "Supermarkets and independent retailers lose margin every month to shelf stockouts, register discrepancies, and manual supplier invoice entry. Without transactional stock ledgers, owners spot losses too late.",
      solutionTitle: "From supplier XML intake to fiscal POS and real-time ABC/RFM BI",
      features: [
        { icon: ShieldCheck, title: "Fiscal POS (NFC-e / SEFAZ)", desc: "Fast retail checkout supporting barcode scanning, offline contingency, and automated tax receipt emission." },
        { icon: Database, title: "Transactional Ledger & XML Intake", desc: "Ingest supplier invoice XML files directly into PostgreSQL inventory balances and moving-average cost calculations." },
        { icon: BarChart3, title: "Commercial BI: ABC Curve & RFM", desc: "Interactive analytics built on Python (Pandas, Statsmodels, Plotly) surfacing top-margin SKUs, dead stock, and P&L visibility." },
        { icon: Layers, title: "Fail-Closed Multi-Tenant Architecture", desc: "Strict tenant isolation inside PostgreSQL with nested transaction savepoints and full cash-drawer audit trails." },
        { icon: TrendingUp, title: "Demand Forecasting & Stockout Alerts", desc: "Velocity tracking and time-series signals alert purchasing before best-selling shelves go empty." },
        { icon: Zap, title: "Production Sentry Observability", desc: "Live telemetry and exception tracking backing the production platform at mercadinhosys.com.br." },
      ],
      stats: [
        { n: ".com.br", label: "Custom production domain" },
        { n: "Retail", label: "Validated platform · new rollouts in progress" },
        { n: "NFC-e", label: "Fiscal POS + XML intake" },
        { n: "ABC / RFM", label: "Pandas + Plotly analytics" },
      ],
      cta: "Open mercadinhosys.com.br",
      ctaDemo: "Request Retail Demo",
      ctaAllProducts: "All products",
      trialNote: "2 months free with onboarding · mercadinhosys.com.br · Retail-validated platform, new rollouts in progress",
    },
  },

  "selectsys-jobs": {
    pt: {
      heroLabel: "ATS · Agências de recrutamento e seleção · Case Real Fujiarte",
      problem:
        "Agências de recrutamento perdem candidatos porque a triagem está espalhada em e-mails, planilhas e mensagens. Sem pipeline único, não há previsibilidade nem conformidade com a LGPD.",
      solutionTitle: "Recrutamento bilíngue do jeito que funciona",
      features: [
        { icon: Users, title: "Pipeline de vagas", desc: "Kanban de candidatos por fase — triagem, entrevista, proposta, fechamento. Visão completa do funil sem trocar de aba." },
        { icon: TrendingUp, title: "Triagem por competência & OCR", desc: "Leitura automática de documentos (Tesseract.js e PDF.js) reduzindo o tempo de triagem manual em até 60%." },
        { icon: ShieldCheck, title: "LGPD nativo (RLS PostgreSQL)", desc: "Consentimento, anonimização e isolamento por empresa integrados no banco. Auditoria e relatórios em um clique." },
        { icon: Zap, title: "Contrato Brasil–Japão", desc: "Suporte a contratos internacionais bilíngues (PT/JP), vistos e exportação fiel para modelos Excel." },
        { icon: BarChart3, title: "Relatórios de recrutamento", desc: "Tempo médio de contratação, SLA por vaga e taxa de aprovação por fase para negociar prazos." },
        { icon: Layers, title: "Multi-cliente", desc: "Separe pipelines por cliente garantindo privacidade total em cada processo seletivo." },
      ],
      stats: [
        { n: "BR → JP", label: "recrutamento Brasil–Japão" },
        { n: "Fujiarte", label: "cliente real com contrato" },
        { n: "-60%", label: "tempo de triagem manual" },
        { n: "LGPD", label: "Row Level Security" },
      ],
      cta: "Acessar SelectSys Jobs",
      ctaDemo: "Conversar com Rafael",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "Case em implantação · Fujiarte Co., Ltd. (Brasil → Japão)",
    },
    en: {
      heroLabel: "ATS · Recruitment and staffing agencies · Fujiarte Real Client",
      problem:
        "Recruitment agencies lose candidates because screening is scattered across email, spreadsheets and chat. Without a single pipeline there is no forecast and no LGPD compliance.",
      solutionTitle: "Bilingual recruitment that actually scales",
      features: [
        { icon: Users, title: "Job pipeline", desc: "Candidate kanban by stage — screening, interview, offer, close. Full funnel view without switching tabs." },
        { icon: TrendingUp, title: "Skills screening & OCR", desc: "Automated passport/document extraction (Tesseract.js & PDF.js) cuts manual screening time by up to 60%." },
        { icon: ShieldCheck, title: "LGPD / GDPR native", desc: "PostgreSQL Row Level Security, consent tracking, and one-click audit trails built in." },
        { icon: Zap, title: "Brazil–Japan cross-border contracts", desc: "International bilingual workflows (PT/JP), visa tracking, and strict Excel template exports." },
        { icon: BarChart3, title: "Recruitment analytics", desc: "Time-to-hire, SLA per role, and stage conversion insights." },
        { icon: Layers, title: "Multi-client", desc: "Strict tenant separation per hiring client." },
      ],
      stats: [
        { n: "BR → JP", label: "Brazil–Japan recruitment" },
        { n: "Fujiarte", label: "contracted client" },
        { n: "-60%", label: "manual screening time" },
        { n: "LGPD", label: "Row Level Security" },
      ],
      cta: "Open SelectSys Jobs",
      ctaDemo: "Talk to Rafael",
      ctaAllProducts: "All products",
      trialNote: "Rolling out · Fujiarte Co., Ltd. (Brazil → Japan)",
    },
  },

  "atol-connect": {
    pt: {
      heroLabel: "WhatsApp Business Platform · Cloud API oficial da Meta · Multi-tenant",
      problem:
        "Software houses e empresas pagam por APIs não oficiais de WhatsApp e convivem com o risco de banimento do número, ou migram para plataformas que cobram markup sobre cada mensagem e por atendente. O resultado é custo imprevisível e integração frágil com ERP, PDV e loja virtual.",
      solutionTitle: "WhatsApp oficial, em reais, com a tarifa da Meta paga direto à Meta",
      features: [
        { icon: Zap, title: "Conexão em minutos (Embedded Signup)", desc: "O cliente conecta o próprio número pelo fluxo oficial da Meta, sem setup e sem intermediário. O servidor confere os escopos autorizados antes de ativar a conta." },
        { icon: Users, title: "Caixa de entrada em equipe", desc: "Atendimento em tempo real com janela de 24h, respostas rápidas, campanhas e automações. Preço por empresa, não por atendente." },
        { icon: FileText, title: "Modelos e envio com opt-out", desc: "Crie modelos, acompanhe a aprovação na Meta e envie mensagens com bloqueio fora da janela de 24h e respeito a opt-out." },
        { icon: Database, title: "REST API e webhooks assinados", desc: "API pública com chaves por escopo, especificação OpenAPI 3.1 e webhooks de saída assinados, com reentrega automática. Feita para ERP, PDV e e-commerce." },
        { icon: ShieldCheck, title: "Segurança e LGPD", desc: "Isolamento por organização com Row Level Security, tokens da Meta cifrados com AES-256-GCM, chaves de API guardadas como hash e auditoria imutável." },
        { icon: Layers, title: "Plano Parceiro para software houses", desc: "Leve o WhatsApp oficial para dentro do seu sistema a partir de R$ 59 por número, com 100 mil requisições por número e webhooks ilimitados." },
      ],
      stats: [
        { n: "R$ 79", label: "plano de entrada por mês" },
        { n: "R$ 0,00", label: "respostas no celular (Coexistência)" },
        { n: "OpenAPI 3.1", label: "API pública documentada" },
        { n: "Cloud API", label: "oficial da Meta" },
      ],
      cta: "Acessar connect.maldivastech.dev",
      ctaDemo: "Falar sobre integração",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "14 dias grátis na liberação · Operação oficial Meta ativa para Food Service via MiseOn; credenciamento Tech Provider para demais segmentos em validação final na Meta · Tarifas pagas direto à Meta",
    },
    en: {
      heroLabel: "WhatsApp Business Platform · Official Meta Cloud API · Multi-tenant",
      problem:
        "Software houses and businesses either pay for unofficial WhatsApp APIs and live with the risk of number bans, or move to platforms that mark up every message and charge per agent. The result is unpredictable cost and fragile ERP, POS and storefront integrations.",
      solutionTitle: "Official WhatsApp, billed in reais, with Meta's fees paid straight to Meta",
      features: [
        { icon: Zap, title: "Onboarding in minutes (Embedded Signup)", desc: "Customers connect their own number through Meta's official flow, with no setup fee and no middleman. The server verifies the granted scopes before activating the account." },
        { icon: Users, title: "Shared team inbox", desc: "Real-time support with the 24-hour window, quick replies, campaigns and automations. Priced per business, not per agent." },
        { icon: FileText, title: "Templates with opt-out handling", desc: "Create templates, track Meta approval and send messages with free-form blocking outside the 24-hour window and opt-out enforcement." },
        { icon: Database, title: "REST API and signed webhooks", desc: "Public API with scoped keys, an OpenAPI 3.1 spec and signed outbound webhooks with automatic redelivery. Built for ERP, POS and e-commerce." },
        { icon: ShieldCheck, title: "Security and LGPD", desc: "Per-organization Row Level Security isolation, Meta tokens encrypted with AES-256-GCM, hashed API keys and an append-only audit trail." },
        { icon: Layers, title: "Partner plan for software houses", desc: "Bring official WhatsApp inside your own product from BRL 59 per number, with 100k requests per number and unlimited webhooks." },
      ],
      stats: [
        { n: "BRL 79", label: "entry plan per month" },
        { n: "BRL 0.00", label: "phone replies (Coexistence)" },
        { n: "OpenAPI 3.1", label: "documented public API" },
        { n: "Cloud API", label: "official Meta" },
      ],
      cta: "Open connect.maldivastech.dev",
      ctaDemo: "Talk about integration",
      ctaAllProducts: "All products",
      trialNote: "14 days free at release · Official Meta operation live for Food Service via MiseOn; Tech Provider accreditation for other segments in final validation at Meta · Fees paid directly to Meta",
    },
  },
};

/* ──────────────────────────────────────────────
   Componente principal
─────────────────────────────────────────────── */
export default async function ProductPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const params = await paramsP;
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const product = productList.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const c = product.copy[lang];
  const content = CONTENT[product.slug]?.[lang];
  if (!content) notFound();

  const needsLightPlate = product.slug === "selectsys-jobs" || product.slug === "mercadinhosys";
  const domainLabel = product.appUrl
    ? product.appUrl.replace(/^https?:\/\//, "")
    : "selectsys-jobs.vercel.app";

  const whatsapp = `https://wa.me/5511919889233?text=${encodeURIComponent(
    lang === "pt"
      ? `Olá, Rafael! Tenho interesse no ${product.name}. Podemos conversar?`
      : `Hi Rafael! I'm interested in ${product.name}. Can we talk?`,
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    url: `${SITE}/${lang}/produtos/${product.slug}`,
    sameAs: product.appUrl ? [product.appUrl] : undefined,
    applicationCategory: product.applicationCategory,
    applicationSubCategory: product.applicationSubCategory,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: product.priceBRL,
      priceCurrency: product.priceCurrency,
    },
    description: c.metaDescription,
    author: { "@type": "Organization", name: "Maldivas Tech", url: SITE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <header className="prod-hero">
        <div className="wrap prod-hero-in">
          <div className="prod-hero-text">
            <div className="sec-tag">{content.heroLabel}</div>

            {/* Adaptive high-contrast brand lockup — never blends dark ink into dark background */}
            <div className="prod-brand-lockup">
              {product.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="prod-brand-icon"
                />
              )}
              {product.logoHorizontal ? (
                <div className={needsLightPlate ? "prod-logo-plate" : "prod-logo-dark"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.logoHorizontal} alt={product.name} />
                </div>
              ) : null}
              <span className="prod-domain-pill">{domainLabel}</span>
            </div>

            <h1>{c.h1}</h1>
            <p className="hero-lead">{c.metaDescription}</p>
            <div className="cta-row">
              <a
                className="btn btn-primary"
                href={product.appUrl ?? whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} /> {content.cta} <ArrowUpRight size={16} />
              </a>
              <a
                className="btn btn-ghost"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} /> {content.ctaDemo}
              </a>
            </div>
            <p className="prod-trial-note">{content.trialNote}</p>
          </div>

          {product.showcaseImage && (
            <div className="prod-hero-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.showcaseImage}
                alt={`${product.name} — arquitetura e interface`}
              />
            </div>
          )}

          {/* Stats strip */}
          <div className="prod-stats">
            {content.stats.map((s) => (
              <div key={s.label} className="prod-stat">
                <span className="prod-stat-n">{s.n}</span>
                <span className="prod-stat-l">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── PROBLEMA ── */}
      <section className="prod-problem">
        <div className="wrap">
          <div className="prod-problem-box">
            <div className="sec-tag">
              {lang === "pt" ? "O problema" : "The problem"}
            </div>
            <p>{content.problem}</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section>
        <div className="wrap">
          <div className="sec-tag">
            {lang === "pt" ? "O que o sistema faz" : "What the system does"}
          </div>
          <h2>{content.solutionTitle}</h2>
          <div className="prod-features">
            {content.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="prod-feature">
                  <div className="prod-feature-icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-tag">
            {lang === "pt" ? "Tecnologias" : "Technologies"}
          </div>
          <div className="tags">
            {product.stack.map((s) => (
              <span key={s} className="tag">
                <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="prod-cta-section">
        <div className="wrap">
          <div className="contact-box">
            <h2>
              {lang === "pt"
                ? `Pronto para usar o ${product.name}?`
                : `Ready to use ${product.name}?`}
            </h2>
            <p>
              {lang === "pt"
                ? "Acesse o sistema em produção agora ou fale com Rafael para implantar na sua empresa."
                : "Access the production system now or talk to Rafael to onboard your team."}
            </p>
            <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
              <a
                className="btn btn-primary"
                href={product.appUrl ?? whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star size={18} /> {content.cta} <ArrowUpRight size={16} />
              </a>
              <a
                className="btn btn-ghost"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />{" "}
                {lang === "pt" ? "Falar com Rafael" : "Talk to Rafael"}
              </a>
            </div>
            <p className="contact-fine">{content.trialNote}</p>
          </div>
        </div>
      </section>

      {/* ── NAV INFERIOR ── */}
      <section style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div className="wrap">
          <Link
            href={`/${lang}/produtos`}
            className="btn btn-ghost"
            style={{ fontSize: 15 }}
          >
            ← {content.ctaAllProducts}
          </Link>
        </div>
      </section>
    </>
  );
}
