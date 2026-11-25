"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  Minus,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { useLang, localePath } from "./lib/i18n";
import { ORACLE_CERT } from "./lib/credentials";
import AtolCta from "./components/atol/AtolCta";
import EightNichesExplorer from "./components/atol/EightNichesExplorer";
import MetaTcoCalculator2026 from "./components/atol/MetaTcoCalculator2026";
import HomeContactForm from "./components/home/HomeContactForm";
import ExitToast from "./components/ExitToast";
import { CONNECT_URL } from "./lib/flags";

/* ------------------------------------------------------------------ */
/*  Home — exatamente 6 blocos                                         */
/*   1 Hero · 2 Atol Connect (8 nichos) · 3 Sistemas 01-03 ·            */
/*   4 Planos + comparativo + TCO · 5 Provas + engenharia aberta ·      */
/*   6 Contato B2B (rodapé corporativo vem do layout)                   */
/* ------------------------------------------------------------------ */

type Bi = { pt: string; en: string };

const SYSTEMS: {
  n: string;
  name: string;
  domain: string;
  href: string;
  detail: string;
  logo: string;
  segment: Bi;
  status: Bi;
  live: boolean;
  desc: Bi;
  tags: string[];
}[] = [
  {
    n: "01",
    name: "MiseOn",
    domain: "miseon.app.br",
    href: "https://miseon.app.br",
    detail: "/produtos/miseon",
    logo: "/logo-horiz-miseon.png",
    segment: { pt: "Food Service, Restaurantes & Totem", en: "Food Service, Restaurants & Kiosk" },
    status: { pt: "Em operação · Meta & iFood", en: "Live · Meta & iFood" },
    live: true,
    desc: {
      pt: "PDV, cardápio digital, cozinha KDS sem papel, entrada de estoque por cupom fiscal NFC-e (SEFAZ), ficha técnica com custeio PEPS, WhatsApp IA oficial e integração com hardware Bravus Core / Gertec.",
      en: "POS, digital menu, paperless KDS, stock intake from NFC-e fiscal receipts (SEFAZ), FIFO recipe costing, official WhatsApp AI and Bravus Core / Gertec hardware integration.",
    },
    tags: ["KDS & PDV", "NFC-e", "PEPS", "iFood", "WhatsApp oficial"],
  },
  {
    n: "02",
    name: "MercadinhoSys",
    domain: "mercadinhosys.com.br",
    href: "https://mercadinhosys.com.br",
    detail: "/produtos/mercadinhosys",
    logo: "/logo-horiz-mercadinhosys.png",
    segment: { pt: "Varejo & Comércios com IA", en: "AI-powered Retail" },
    status: { pt: "Plataforma validada no varejo · novas implantações em andamento", en: "Retail-validated platform · new rollouts in progress" },
    live: false,
    desc: {
      pt: "Frente de caixa rápida, cadastro por código de barras ou comando via IA (Consultor M-IA), importação de XML do fornecedor, controle de fiado, ponto da equipe pelo celular e DRE com lucro real.",
      en: "Fast checkout, product entry by barcode or AI command (M-IA Advisor), supplier XML import, store-credit control, staff time clock on the phone and a real-profit P&L.",
    },
    tags: ["Caixa & estoque", "XML NF-e", "Fiado", "Consultor M-IA", "DRE"],
  },
  {
    n: "03",
    name: "SelectSys Jobs",
    domain: "selectsys-jobs.vercel.app",
    href: "https://selectsys-jobs.vercel.app",
    detail: "/produtos/selectsys-jobs",
    logo: "/logo-horiz-selectsys.png",
    segment: { pt: "Recrutamento Internacional Brasil ➔ Japão", en: "International Recruiting Brazil ➔ Japan" },
    status: { pt: "Em produção na Fujiarte Co., Ltd. · aberto para novas agências", en: "Live at Fujiarte Co., Ltd. · open to new agencies" },
    live: true,
    desc: {
      pt: "ATS trilíngue (PT/JP/EN) com Kanban de 9 etapas de imigração, OCR documental por IA, sincronização Cybozu Garoon, 12 KPIs executivos, exportação .XLS fiel ao padrão japonês e conformidade LGPD + APPI.",
      en: "Trilingual ATS (PT/JP/EN) with a 9-stage immigration Kanban, AI document OCR, Cybozu Garoon sync, 12 executive KPIs, .XLS export faithful to the Japanese standard, and LGPD + APPI compliance.",
    },
    tags: ["Kanban 9 etapas", "OCR IA", "Garoon", "LGPD + APPI"],
  },
];

const PLANS: {
  name: Bi;
  price: string;
  unit: Bi;
  highlight?: boolean;
  items: Bi[];
  cta: "atol" | "partner";
}[] = [
  {
    name: { pt: "Operação", en: "Operation" },
    price: "R$ 79",
    unit: { pt: "/mês", en: "/month" },
    items: [
      { pt: "1 número · até 3 atendentes", en: "1 number · up to 3 agents" },
      { pt: "Cloud API oficial da Meta", en: "Official Meta Cloud API" },
      { pt: "Coexistência: respostas no celular a R$ 0,00", en: "Coexistence: phone replies at BRL 0.00" },
      { pt: "Inbox em equipe + gestor de templates", en: "Team inbox + template manager" },
      { pt: "0% de markup nas tarifas da Meta", en: "0% markup on Meta fees" },
    ],
    cta: "atol",
  },
  {
    name: { pt: "Pro / Automação", en: "Pro / Automation" },
    price: "R$ 149",
    unit: { pt: "/mês", en: "/month" },
    highlight: true,
    items: [
      { pt: "Até 2 números · 8 atendentes", en: "Up to 2 numbers · 8 agents" },
      { pt: "Automação: boas-vindas, fora do horário e palavra-chave", en: "Automation: welcome, out-of-hours and keyword replies" },
      { pt: "100 mil chamadas de API/mês · 5 webhooks", en: "100k API calls/month · 5 webhooks" },
      { pt: "Webhooks HMAC com 8 retentativas", en: "HMAC webhooks with 8 retries" },
      { pt: "Logs de eventos e entregas por 30 dias", en: "Event and delivery logs for 30 days" },
    ],
    cta: "atol",
  },
  {
    name: { pt: "Software Houses / Parceiros", en: "Software Houses / Partners" },
    price: "R$ 59",
    unit: { pt: "/número", en: "/number" },
    items: [
      { pt: "Sem mínimo de números para homologar", en: "No minimum number count to get started" },
      { pt: "R$ 49/número a partir de 21 números", en: "BRL 49/number from 21 numbers" },
      { pt: "100 mil chamadas/número · webhooks ilimitados", en: "100k calls/number · unlimited webhooks" },
      { pt: "Inbox + Templates + Coexistência prontos para embarcar no seu ERP/PDV", en: "Inbox + Templates + Coexistence ready to embed in your ERP/POS" },
      { pt: "Diferente de API headless de R$ 39,90: você não constrói o front-end", en: "Unlike a BRL 39.90 headless API: you don't build the front-end" },
    ],
    cta: "partner",
  },
];

type Cell = { v: Bi; tone: "yes" | "no" | "mid" };
const COMPARE: { row: Bi; atol: Cell; qr: Cell; crm: Cell }[] = [
  {
    row: { pt: "Preço da plataforma", en: "Platform price" },
    atol: { v: { pt: "R$ 79/mês · R$ 59/número parceiro", en: "BRL 79/month · BRL 59/number partner" }, tone: "yes" },
    qr: { v: { pt: "~R$ 29 a R$ 99,99 por instância", en: "~BRL 29 to 99.99 per instance" }, tone: "mid" },
    crm: { v: { pt: "~R$ 189 a R$ 497+/mês, ou em dólar + IOF", en: "~BRL 189 to 497+/month, or USD + IOF" }, tone: "no" },
  },
  {
    row: { pt: "Risco de banimento do número", en: "Number ban risk" },
    atol: { v: { pt: "Canal oficial da Meta", en: "Meta's official channel" }, tone: "yes" },
    qr: { v: { pt: "Real: emulação fora dos termos do WhatsApp, quedas de sessão no pico", en: "Real: emulation outside WhatsApp terms, session drops at peak" }, tone: "no" },
    crm: { v: { pt: "Canal oficial", en: "Official channel" }, tone: "yes" },
  },
  {
    row: { pt: "Celular + API juntos", en: "Phone + API together" },
    atol: { v: { pt: "Coexistência: app no celular a R$ 0,00", en: "Coexistence: phone app at BRL 0.00" }, tone: "yes" },
    qr: { v: { pt: "Depende de sessão aberta no aparelho", en: "Depends on a session open on the device" }, tone: "mid" },
    crm: { v: { pt: "Varia por provedor", en: "Varies by provider" }, tone: "mid" },
  },
  {
    row: { pt: "Inbox + API REST + templates oficiais", en: "Inbox + REST API + official templates" },
    atol: { v: { pt: "Os três inclusos", en: "All three included" }, tone: "yes" },
    qr: { v: { pt: "Sem templates oficiais nem Inbox oficial", en: "No official templates or inbox" }, tone: "no" },
    crm: { v: { pt: "Sim, com planos cobrados por usuário", en: "Yes, with per-user plans" }, tone: "mid" },
  },
  {
    row: { pt: "Markup sobre a tarifa da Meta", en: "Markup on Meta fees" },
    atol: { v: { pt: "0% — você paga a Meta direto", en: "0% — you pay Meta directly" }, tone: "yes" },
    qr: { v: { pt: "Não se aplica (canal não oficial)", en: "N/a (unofficial channel)" }, tone: "mid" },
    crm: { v: { pt: "De 0% a markup variável, conforme o provedor", en: "From 0% to variable markup, by provider" }, tone: "mid" },
  },
];

const CASES: { client: string; tag: Bi; result: Bi; stack: string; href: string; cta: Bi; external: boolean }[] = [
  {
    client: "Fujiarte Co., Ltd.",
    tag: { pt: "SelectSys Jobs · Agência Brasil–Japão", en: "SelectSys Jobs · Brazil–Japan agency" },
    result: { pt: "Triagem documental digitalizada: −60% no tempo de triagem e fim das planilhas paralelas.", en: "Digital document screening: −60% screening time and no more parallel spreadsheets." },
    stack: "React 19 · PostgreSQL RLS · OCR",
    href: "/portfolio/fujiarte",
    cta: { pt: "Ver case", en: "View case" },
    external: false,
  },
  {
    client: "Loja de Macramê da Eli",
    tag: { pt: "MySuperStore · E-commerce multi-vendedor", en: "MySuperStore · Multi-vendor e-commerce" },
    result: { pt: "Loja própria sobre arquitetura multi-vendedor com checkout PIX Split.", en: "Own storefront on a multi-vendor architecture with PIX Split checkout." },
    stack: "Django REST · Next.js · Efí PIX Split",
    href: "https://mysuperstore-lime.vercel.app",
    cta: { pt: "Ver loja", en: "View store" },
    external: true,
  },
  {
    client: "Espaço Eli Trassi",
    tag: { pt: "Serviços locais", en: "Local services" },
    result: { pt: "Agendamento próprio + PWA + SEO local: fim da agenda de papel.", en: "Own booking + PWA + local SEO: no more paper diary." },
    stack: "React · PWA · SEO local",
    href: "https://agenda-sal-o-de-beleza.vercel.app",
    cta: { pt: "Ver no ar", en: "View live" },
    external: true,
  },
  {
    client: "Animaz Pet Center",
    tag: { pt: "Data Science & BI", en: "Data Science & BI" },
    result: { pt: "3 bases unificadas: faturamento × meta, funil por vendedor e ruptura de estoque.", en: "3 datasets unified: revenue vs. target, per-seller funnel and stockouts." },
    stack: "Python · Pandas · BI",
    href: "https://ecommerce-analisys.vercel.app",
    cta: { pt: "Ver projeto", en: "View project" },
    external: true,
  },
];

const ToneIcon = ({ tone }: { tone: Cell["tone"] }) =>
  tone === "yes" ? <Check size={15} aria-hidden="true" /> : tone === "no" ? <X size={15} aria-hidden="true" /> : <Minus size={15} aria-hidden="true" />;

export default function HomeClient() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const L = (b: Bi) => b[lang];

  return (
    <div className="h6">
      {/* ============================ 1 · HERO ============================ */}
      <header className="h6-hero" id="top">
        <div className="wrap">
          <div className="h6-eyebrow">
            {pt
              ? "MALDIVAS TECH · INFRAESTRUTURA WHATSAPP OFICIAL & SAAS EM PRODUÇÃO · SÃO PAULO"
              : "MALDIVAS TECH · OFFICIAL WHATSAPP INFRASTRUCTURE & LIVE SAAS · SÃO PAULO"}
          </div>
          <h1>
            {pt ? (
              <>
                Infraestrutura Oficial de WhatsApp e Sistemas de Gestão em produção — <em>sem gambiarras de QR Code e sem markup em dólar.</em>
              </>
            ) : (
              <>
                Official WhatsApp infrastructure and management systems in production — <em>no QR-code hacks, no dollar markup.</em>
              </>
            )}
          </h1>
          <p className="h6-lead">
            {pt
              ? "Desenvolvemos e operamos plataformas SaaS com domínio próprio — lideradas pelo Atol Connect (Cloud API oficial da Meta com Inbox e Coexistência a partir de R$ 79/mês) e pelos sistemas MiseOn, MercadinhoSys e SelectSys Jobs."
              : "We build and run SaaS platforms on our own domains — led by Atol Connect (Meta's official Cloud API with Inbox and Coexistence from BRL 79/month) and by MiseOn, MercadinhoSys and SelectSys Jobs."}
          </p>
          <AtolCta
            lang={lang}
            src="home-hero"
            sandboxHref="#atol"
            secondary={{ href: "#sistemas", label: pt ? "Ver sistemas em produção" : "See live systems" }}
          />
          <ul className="h6-cred" aria-label={pt ? "Credenciais" : "Credentials"}>
            <li>
              <a href={ORACLE_CERT.verifyUrl} target="_blank" rel="noopener noreferrer" data-analytics="cert_click">
                <BadgeCheck size={15} aria-hidden="true" /> Oracle Certified · Agentic AI
              </a>
            </li>
            <li>
              <ShieldCheck size={15} aria-hidden="true" /> {pt ? "Cloud API Oficial Meta" : "Official Meta Cloud API"}
            </li>
            <li>
              <CheckCircle2 size={15} aria-hidden="true" /> {pt ? "iFood Homologado (MiseOn)" : "iFood approved (MiseOn)"}
            </li>
            <li>CNPJ 68.923.239/0001-77 · NFSe</li>
          </ul>
        </div>
      </header>

      {/* ===================== 2 · ATOL CONNECT · 8 NICHOS ===================== */}
      <section className="h6-sec" id="atol" aria-labelledby="h6-atol">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "PRODUTO PRINCIPAL · ATOL CONNECT" : "FLAGSHIP · ATOL CONNECT"}</span>
            <h2 id="h6-atol">
              {pt ? "Oito negócios, uma API oficial. Veja a conversa e o código lado a lado." : "Eight businesses, one official API. See the chat and the code side by side."}
            </h2>
            <p>
              {pt
                ? "Cada nicho mostra o template que a Meta cobra, a resposta da equipe no celular a R$ 0,00 e a chamada REST real com Idempotency-Key e webhook assinado."
                : "Each industry shows the template Meta charges for, the team's phone reply at BRL 0.00, and the real REST call with Idempotency-Key and signed webhook."}
            </p>
          </div>
          <EightNichesExplorer lang={lang} />
          <div className="h6-links">
            <Link href={localePath("/whatsapp-api", lang)}>
              {pt ? "Hub completo do Atol Connect" : "Full Atol Connect hub"} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href={localePath("/whatsapp-api/calculadora-2026", lang)}>
              {pt ? "Calculadora de custo 2026" : "2026 cost calculator"} <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a href={CONNECT_URL} target="_blank" rel="noopener noreferrer">
              connect.maldivastech.dev <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ======================= 3 · SISTEMAS 01-03 ======================= */}
      <section className="h6-sec" id="sistemas" aria-labelledby="h6-sis">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "ECOSSISTEMA · SISTEMAS PRÓPRIOS EM DOMÍNIO PRÓPRIO" : "ECOSYSTEM · OWN SYSTEMS ON OWN DOMAINS"}</span>
            <h2 id="h6-sis">{pt ? "O WhatsApp traz o cliente. Nossos sistemas seguram a operação." : "WhatsApp brings the customer. Our systems run the operation."}</h2>
          </div>
          <div className="h6-systems">
            {SYSTEMS.map((s) => (
              <article className="h6-sys" key={s.name}>
                <div className="h6-sys-top">
                  <span className="h6-num">{s.n}</span>
                  <span className={`h6-status${s.live ? " is-live" : ""}`}>{L(s.status)}</span>
                </div>
                <div className="h6-sys-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.logo} alt={s.name} loading="lazy" />
                </div>
                <h3>
                  {s.name} <small>{s.domain}</small>
                </h3>
                <p className="h6-seg">{L(s.segment)}</p>
                <p>{L(s.desc)}</p>
                <div className="tags">
                  {s.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="h6-sys-foot">
                  <a className="plink solid" href={s.href} target="_blank" rel="noopener noreferrer" data-analytics="product_demo">
                    <ExternalLink size={15} aria-hidden="true" /> <span>{s.domain}</span>
                  </a>
                  <Link className="plink" href={localePath(s.detail, lang)} data-analytics="product_click">
                    <span>{pt ? "Detalhes" : "Details"}</span> <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================== 4 · PLANOS + COMPARATIVO + TCO ================== */}
      <section className="h6-sec" id="planos" aria-labelledby="h6-planos">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "PLANOS ATOL CONNECT · PREÇO EM REAIS · 2026" : "ATOL CONNECT PLANS · PRICED IN BRL · 2026"}</span>
            <h2 id="h6-planos">{pt ? "A Meta cobra a Meta. Você paga só a plataforma." : "Meta bills Meta. You only pay for the platform."}</h2>
          </div>

          <div className="h6-plans">
            {PLANS.map((p) => (
              <div className={`h6-plan${p.highlight ? " is-hl" : ""}`} key={p.name.pt}>
                <span className="h6-plan-name">{L(p.name)}</span>
                <div className="h6-price">
                  {p.price}
                  <span>{L(p.unit)}</span>
                </div>
                <ul>
                  {p.items.map((it) => (
                    <li key={it.pt}>
                      <Check size={15} aria-hidden="true" /> {L(it)}
                    </li>
                  ))}
                </ul>
                {p.cta === "partner" ? (
                  <a className="btn btn-ghost" href={`${CONNECT_URL}/parceiros`} target="_blank" rel="noopener noreferrer">
                    {pt ? "Programa de parceiros" : "Partner program"} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <AtolCta lang={lang} src={`home-plan-${p.price}`} sandboxHref="#atol" note={false} compact />
                )}
              </div>
            ))}
          </div>

          <div className="h6-addon">
            <Wrench size={18} aria-hidden="true" />
            <p>
              <strong>{pt ? "Add-on opcional · Implantação Assistida Maldivas Tech (taxa única)" : "Optional add-on · Maldivas Tech Assisted Setup (one-time fee)"}</strong>{" "}
              {pt
                ? "Configuração do Business Manager, templates de utilidade aprovados, integração técnica com seu sistema e presença local no Google. Plano Business (5 números, 25 atendentes) a R$ 499/mês."
                : "Business Manager setup, approved utility templates, technical integration with your system and local Google presence. Business plan (5 numbers, 25 agents) at BRL 499/month."}
            </p>
            <a href="#contato">{pt ? "Pedir orçamento" : "Get a quote"} →</a>
          </div>

          <h3 className="h6-sub">{pt ? "Comparativo honesto de mercado" : "Honest market comparison"}</h3>
          <div className="wa-scroll">
            <table className="h6-compare">
              <thead>
                <tr>
                  <th scope="col">{pt ? "Critério" : "Criterion"}</th>
                  <th scope="col">Atol Connect ({pt ? "oficial" : "official"})</th>
                  <th scope="col">{pt ? "APIs por QR Code" : "QR-code APIs"}<small>Z-API · ZAP-API · Evolution</small></th>
                  <th scope="col">{pt ? "Plataformas oficiais + CRM" : "Official platforms + CRM"}<small>ConverZAP · BotConversa · BSPs</small></th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.row.pt}>
                    <th scope="row">{L(r.row)}</th>
                    {[r.atol, r.qr, r.crm].map((c, i) => (
                      <td key={i} className={`is-${c.tone}`}>
                        <ToneIcon tone={c.tone} /> {L(c.v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="h6-fine">
            {pt
              ? "Faixas de preço de categoria observadas em páginas públicas e comparativos em nov/2026; variam por plano e provedor. Marcas citadas pertencem aos seus titulares e servem só como exemplo de categoria."
              : "Category price ranges observed on public pages and comparisons in Nov 2026; they vary by plan and provider. Brands cited belong to their owners and are only category examples."}{" "}
            <Link href={localePath("/whatsapp-api/z-api-vs-oficial", lang)}>{pt ? "Comparativo técnico completo →" : "Full technical comparison →"}</Link>
          </p>

          <h3 className="h6-sub">{pt ? "Simule seu custo real (tarifa Meta pós-outubro/2026)" : "Simulate your real cost (Meta fees after Oct 2026)"}</h3>
          <MetaTcoCalculator2026 lang={lang} compact />
          <p className="h6-fine">
            <Link href={localePath("/whatsapp-api/calculadora-2026", lang)}>
              {pt ? "Abrir a calculadora completa com Coexistência e atendentes →" : "Open the full calculator with Coexistence and agents →"}
            </Link>
          </p>
        </div>
      </section>

      {/* ================= 5 · PROVAS REAIS + ENGENHARIA ABERTA ================= */}
      <section className="h6-sec" id="cases" aria-labelledby="h6-cases">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "ENTREGAS REAIS · SISTEMA NO AR, NÃO SLIDE" : "REAL DELIVERIES · LIVE SYSTEMS, NOT SLIDES"}</span>
            <h2 id="h6-cases">{pt ? "Quem contrata vê sistema rodando." : "Clients see running systems."}</h2>
          </div>
          <div className="h6-cases">
            {CASES.map((c) => (
              <article className="h6-case" key={c.client}>
                <span className="h6-case-tag">{L(c.tag)}</span>
                <h3>{c.client}</h3>
                <p>{L(c.result)}</p>
                <small>{c.stack}</small>
                {c.external ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" data-analytics="portfolio_click">
                    {L(c.cta)} <ExternalLink size={13} aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={localePath(c.href, lang)} data-analytics="portfolio_click">
                    {L(c.cta)} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="h6-open">
            <Link className="h6-open-card" href={localePath("/cursos", lang)}>
              <BookOpen size={22} aria-hidden="true" />
              <div>
                <strong>{pt ? "Curso livre gratuito com certificado" : "Free course with certificate"}</strong>
                <p>
                  {pt
                    ? "Arquitetura real de marketplace com Django/DRF & PIX Split — Módulos 0 e 1 abertos."
                    : "Real marketplace architecture with Django/DRF & PIX Split — Modules 0 and 1 open (pt-BR)."}
                </p>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="h6-open-card" href={localePath("/ferramentas", lang)}>
              <Wrench size={22} aria-hidden="true" />
              <div>
                <strong>{pt ? "Workbench Dev · 19+ ferramentas gratuitas" : "Dev Workbench · 19+ free tools"}</strong>
                <p>
                  {pt
                    ? "Simuladores, utilitários sem cadastro e ferramentas para a WhatsApp Cloud API."
                    : "Simulators, no-signup utilities and WhatsApp Cloud API tools."}
                </p>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= 6 · CONTATO B2B ======================= */}
      <HomeContactForm />

      <ExitToast />
    </div>
  );
}
