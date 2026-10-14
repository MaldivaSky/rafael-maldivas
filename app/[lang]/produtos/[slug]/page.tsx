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
  type LucideIcon,
} from "lucide-react";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { PRODUCTS, productList, type ProductSlug } from "@/app/lib/products";
import { SITE } from "@/app/lib/site";

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
        { icon: Package, title: "Controle de estoque", desc: "Entrada de nota, baixa automática por venda e alerta de ruptura. Saiba o que está acabando antes de faltar." },
        { icon: Zap, title: "Integração com iFood", desc: "Pedidos do iFood entram direto na fila do sistema, sem redigitar. Cardápio sincronizado em tempo real." },
        { icon: ShieldCheck, title: "PDV fiscal NFC-e", desc: "Emita NFC-e direto do balcão, sem equipamento adicional. Conformidade fiscal sem complicar a operação." },
        { icon: Layers, title: "Multi-tenant", desc: "Gerencie mais de uma unidade com o mesmo login. Visão unificada ou por filial, você decide." },
      ],
      stats: [
        { n: "Meta", label: "Tech Provider verificado" },
        { n: "iFood", label: "integração homologada" },
        { n: "R$149,90", label: "por mês, por unidade" },
        { n: "30 dias", label: "teste grátis" },
      ],
      cta: "Testar o sistema",
      ctaDemo: "Agendar demonstração",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "30 dias grátis",
    },
    en: {
      heroLabel: "Management system · Restaurants and professional kitchens",
      problem:
        "Restaurants lose margin because menu prices ignore recipe cost, waste and ingredient volatility. Control lives in side spreadsheets nobody updates.",
      solutionTitle: "Management that fits in the kitchen",
      features: [
        { icon: FileText, title: "Integrated recipe costing", desc: "Build the cost of every dish with real yield, correction factor and waste. The selling price updates whenever an ingredient cost changes." },
        { icon: BarChart3, title: "Food-cost pricing", desc: "Automatically calculate the minimum viable price including taxes, delivery fee and target margin — no spreadsheet needed." },
        { icon: Package, title: "Inventory control", desc: "Invoice intake, automatic deduction per sale and stock-out alerts. Know what's running low before you run out." },
        { icon: Zap, title: "iFood integration", desc: "iFood orders land directly in the system queue — no retyping. Menu synced in real time." },
        { icon: ShieldCheck, title: "Fiscal POS (NFC-e)", desc: "Issue fiscal receipts right at the counter with no extra hardware. Tax compliance without complicating the operation." },
        { icon: Layers, title: "Multi-tenant", desc: "Manage more than one location with the same login. Unified view or by branch — your call." },
      ],
      stats: [
        { n: "Meta", label: "verified Tech Provider" },
        { n: "iFood", label: "approved integration" },
        { n: "R$149.90", label: "per month, per location" },
        { n: "30 days", label: "free trial" },
      ],
      cta: "Test the system",
      ctaDemo: "Schedule a demo",
      ctaAllProducts: "All products",
      trialNote: "30 days free",
    },
  },

  "selectsys-jobs": {
    pt: {
      heroLabel: "ATS · Agências de recrutamento e seleção",
      problem:
        "Agências de recrutamento perdem candidatos porque a triagem está espalhada em e-mails, planilhas e mensagens. Sem pipeline único, não há previsibilidade nem conformidade com a LGPD.",
      solutionTitle: "Recrutamento do jeito que funciona",
      features: [
        { icon: Users, title: "Pipeline de vagas", desc: "Kanban de candidatos por fase — triagem, entrevista, proposta, fechamento. Visão completa do funil sem trocar de aba." },
        { icon: TrendingUp, title: "Triagem por competência", desc: "Filtre candidatos por habilidades, idioma e experiência. Score automático reduz o tempo de triagem manual em até 60%." },
        { icon: ShieldCheck, title: "LGPD nativo", desc: "Consentimento, anonimização e prazo de retenção de dados integrados. Auditoria e relatórios gerados com um clique." },
        { icon: Zap, title: "Contrato Brasil–Japão", desc: "Suporte a contratos internacionais, vagas com exigência de visto e candidatos em processo de imigração." },
        { icon: BarChart3, title: "Relatórios de recrutamento", desc: "Tempo médio de contratação, SLA por vaga e taxa de aprovação por fase. Dados para negociar prazo com o cliente." },
        { icon: Layers, title: "Multi-cliente", desc: "Separe pipelines por cliente e garanta que nenhum candidato aparece onde não deveria." },
      ],
      stats: [
        { n: "BR → JP", label: "recrutamento Brasil–Japão" },
        { n: "Fujiarte", label: "cliente com contrato" },
        { n: "R$399", label: "por mês" },
        { n: "7 dias", label: "teste grátis" },
      ],
      cta: "Começar teste grátis",
      ctaDemo: "Conversar com Rafael",
      ctaAllProducts: "Ver todos os produtos",
      trialNote: "7 dias grátis · Sem cartão de crédito · Cancela quando quiser",
    },
    en: {
      heroLabel: "ATS · Recruitment and staffing agencies",
      problem:
        "Recruitment agencies lose candidates because screening is scattered across email, spreadsheets and chat. Without a single pipeline there is no forecast and no LGPD compliance.",
      solutionTitle: "Recruitment the way it actually works",
      features: [
        { icon: Users, title: "Job pipeline", desc: "Candidate kanban by stage — screening, interview, offer, close. Full funnel view without switching tabs." },
        { icon: TrendingUp, title: "Skills-based screening", desc: "Filter candidates by skill, language and experience. Automatic scoring cuts manual screening time by up to 60%." },
        { icon: ShieldCheck, title: "LGPD / GDPR native", desc: "Consent, anonymisation and data-retention deadlines built in. Audit trails and reports generated in one click." },
        { icon: Zap, title: "Brazil–Japan contracts", desc: "International contracts, visa-requirement roles and candidates in immigration processes are supported out of the box." },
        { icon: BarChart3, title: "Recruitment reports", desc: "Average time-to-hire, SLA per role and pass-rate per stage. Data to negotiate deadlines with your client." },
        { icon: Layers, title: "Multi-client", desc: "Separate pipelines per client and ensure no candidate appears where they shouldn't." },
      ],
      stats: [
        { n: "BR → JP", label: "Brazil–Japan recruitment" },
        { n: "Fujiarte", label: "contracted client" },
        { n: "R$399", label: "per month" },
        { n: "7 days", label: "free trial" },
      ],
      cta: "Start free trial",
      ctaDemo: "Talk to Rafael",
      ctaAllProducts: "All products",
      trialNote: "7 days free · No credit card · Cancel anytime",
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

  const whatsapp = `https://wa.me/5511919889233?text=${encodeURIComponent(
    lang === "pt"
      ? `Olá, Rafael! Tenho interesse no ${product.name}. Podemos conversar?`
      : `Hi Rafael! I'm interested in ${product.name}. Can we talk?`
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    url: `${SITE}/${lang}/produtos/${product.slug}`,
    applicationCategory: product.applicationCategory,
    applicationSubCategory: product.applicationSubCategory,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: product.priceBRL,
      priceCurrency: product.priceCurrency,
    },
    description: c.metaDescription,
    author: { "@type": "Organization", name: "Maldivas Tech" },
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
            {product.logoHorizontal && (
              <img
                src={product.logoHorizontal}
                alt={product.name}
                className="prod-hero-logo"
                style={{ 
                  width: "100%",
                  maxWidth: "560px", 
                  height: "auto", 
                  marginBottom: "40px", 
                  display: "block",
                  filter: "drop-shadow(0 0 40px rgba(1, 169, 239, 0.6))"
                }}
              />
            )}
            <h1>
              {!product.logoHorizontal && (
                <>
                  <span className="hl">{product.name}</span>
                  <br />
                </>
              )}
              {c.h1}
            </h1>
            <p className="hero-lead">{c.metaDescription}</p>
            <div className="cta-row">
              <a
                className="btn btn-primary"
                href={product.appUrl ?? whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star size={18} /> {content.cta}
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
                ? "Comece o teste grátis agora ou fale com Rafael para tirar suas dúvidas antes."
                : "Start your free trial now or talk to Rafael to clear up any questions first."}
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
