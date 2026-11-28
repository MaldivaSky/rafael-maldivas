"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CheckCircle2, ExternalLink, Pause, Play, PlayCircle, ShieldCheck, Wrench } from "lucide-react";
import { useLang, localePath } from "./lib/i18n";
import { CX_CERT, ORACLE_CERT } from "./lib/credentials";
import { CANVA_REEL, COMPANY, GITHUB_ORG, LINKEDIN, YOUTUBE } from "./lib/site";
import { works, workTags } from "./lib/projects";
import { HOME_FAQ } from "./lib/home-content";
import { servicos } from "./lib/catalog";

/* Linhas de serviço sob medida: vêm do catálogo (fonte única com /servicos) */
const SERVICES = servicos.filter((s) => s.area === "software");
import VideoBackdrop from "./components/VideoBackdrop";
import AcademySection from "./components/home/AcademySection";
import HomeContactForm from "./components/home/HomeContactForm";
import ExitToast from "./components/ExitToast";
import type { GraphEdge, GraphIntegration, GraphProduct } from "./components/home/PortfolioGraph";

/* 3D só carrega quando a seção entra em cena (não disputa o LCP do hero) */
const PortfolioGraph = dynamic(() => import("./components/home/PortfolioGraph"), {
  ssr: false,
  loading: () => <div className="pg pg-loading" aria-hidden="true" />,
});

type Bi = { pt: string; en: string };

type Product = {
  id: string;
  name: string;
  logo: string;
  logoDark?: boolean;
  segment: Bi;
  status: Bi;
  live: boolean;
  headline: Bi;
  problem: Bi;
  solution: Bi;
  proof: Bi;
  offer: Bi;
  points: Bi[];
  site: { href: string; label: string };
  page?: string;
  media: { kind: "video"; src: string; poster: string; alt: Bi } | { kind: "images"; items: { src: string; alt: Bi; contain?: boolean; position?: string }[] };
};

const PRODUCTS: Product[] = [
  {
    id: "miseon",
    name: "MiseOn",
    logo: "/logo-horiz-miseon.png",
    segment: { pt: "Sistema para restaurantes, delivery e totem", en: "Restaurant, delivery and kiosk system" },
    status: { pt: "Em operação · Meta & iFood", en: "Live · Meta & iFood" },
    live: true,
    headline: { pt: "Da chapa ao fechamento do caixa, sem redigitar pedido e sem chutar o lucro.", en: "From the grill to closing the till — no retyped orders, no guessed margins." },
    problem: { pt: "Pedido chega por quatro canais, a cozinha recebe no papel e o custo do prato é estimado de cabeça.", en: "Orders come from four channels, the kitchen gets paper tickets and dish cost is a guess." },
    solution: {
      pt: "Cardápio digital, totem, iFood e WhatsApp caem direto no KDS; o estoque baixa pela ficha técnica com custo PEPS e a nota do fornecedor entra escaneando o cupom fiscal (NFC-e).",
      en: "Digital menu, kiosk, iFood and WhatsApp land straight on the KDS; stock is deducted by FIFO-costed recipes and supplier invoices come in by scanning the NFC-e receipt.",
    },
    proof: { pt: "Integração homologada com o iFood e API oficial da Meta em produção.", en: "Approved iFood integration and Meta's official API in production." },
    offer: { pt: "R$ 149,90/mês · 30 dias grátis", en: "BRL 149.90/mo · 30-day free trial" },
    points: [
      { pt: "PDV + cozinha KDS sem papel", en: "POS + paperless KDS" },
      { pt: "Ficha técnica com custo PEPS", en: "FIFO recipe costing" },
      { pt: "Totem Bravus Core / Gertec", en: "Bravus Core / Gertec kiosk" },
      { pt: "WhatsApp com cardápio real", en: "WhatsApp with the real menu" },
    ],
    site: { href: "https://miseon.app.br", label: "miseon.app.br" },
    page: "/produtos/miseon",
    media: { kind: "video", src: "/video/miseon-totem.mp4", poster: "/video/miseon-totem-poster.jpg", alt: { pt: "Totem de autoatendimento MiseOn em operação", en: "MiseOn self-service kiosk in operation" } },
  },
  {
    id: "mercadinhosys",
    name: "MercadinhoSys",
    logo: "/logo-horiz-mercadinhosys.png",
    segment: { pt: "Sistema com IA para mercadinhos e varejo", en: "AI system for grocers and retail" },
    status: { pt: "Plataforma validada no varejo · novas implantações em andamento", en: "Retail-validated · new rollouts in progress" },
    live: false,
    headline: { pt: "Você atende no balcão. O sistema controla estoque, fiado e o lucro de verdade.", en: "You serve at the counter. The system tracks stock, store credit and real profit." },
    problem: { pt: "Fiado no caderno, estoque que nunca bate e o dono só descobre o prejuízo no fim do mês.", en: "Credit in a notebook, stock that never matches and losses found only at month's end." },
    solution: {
      pt: "Bipa e cadastra, importa o XML do fornecedor, controla o fiado com cobrança no WhatsApp, registra o ponto da equipe pelo celular e fecha o mês com DRE — com o Consultor M-IA explicando a loja em português.",
      en: "Scan and register, import the supplier XML, track store credit with WhatsApp reminders, clock staff in on mobile and close the month with a P&L — with the M-IA Advisor explaining the store in plain words.",
    },
    proof: { pt: "Nasceu de seis anos de PDV, estoque e ruptura no varejo.", en: "Born from six years of POS, stock and stockout work in retail." },
    offer: { pt: "2 meses grátis com implantação na sua loja", en: "2 months free with in-store onboarding" },
    points: [
      { pt: "Caixa rápido + NFC-e", en: "Fast checkout + NFC-e" },
      { pt: "Entrada por XML da nota", en: "Invoice XML intake" },
      { pt: "Fiado e ponto pelo celular", en: "Credit & time clock on mobile" },
      { pt: "DRE, Curva ABC e M-IA", en: "P&L, ABC curve and M-IA" },
    ],
    site: { href: "https://mercadinhosys.com.br", label: "mercadinhosys.com.br" },
    page: "/produtos/mercadinhosys",
    media: { kind: "images", items: [{ src: "/media/mercadinhosys-flagship.jpg", alt: { pt: "Painel do MercadinhoSys com PDV, Curva ABC e DRE", en: "MercadinhoSys dashboard with POS, ABC curve and P&L" } }] },
  },
  {
    id: "selectsys",
    name: "SelectSys Jobs",
    logo: "/logo-horiz-selectsys.png",
    segment: { pt: "ATS para agências de recrutamento Brasil → Japão", en: "ATS for Brazil → Japan recruiting agencies" },
    status: { pt: "Em produção na Fujiarte Co., Ltd. · aberto a novas agências", en: "Live at Fujiarte Co., Ltd. · open to new agencies" },
    live: true,
    headline: { pt: "O fluxo dekassegui inteiro num só lugar, sem planilha solta e sem retrabalho com o Japão.", en: "The whole Brazil–Japan hiring flow in one place — no loose spreadsheets, no rework with Japan." },
    problem: { pt: "Candidatos em e-mail, documentos em pastas e a matriz no Japão pedindo planilha no formato dela.", en: "Candidates in email, documents in folders and headquarters in Japan asking for its own spreadsheet format." },
    solution: {
      pt: "Kanban de 9 etapas de imigração, leitura de documentos por IA, sincronização com o Cybozu Garoon da matriz, 12 KPIs executivos e exportação .XLS fiel ao padrão das fábricas — em português, japonês e inglês.",
      en: "A 9-stage immigration Kanban, AI document reading, sync with headquarters' Cybozu Garoon, 12 executive KPIs and .XLS exports faithful to factory standards — in Portuguese, Japanese and English.",
    },
    proof: { pt: "Fujiarte: −60% no tempo de triagem documental.", en: "Fujiarte: −60% document screening time." },
    offer: { pt: "R$ 399/mês · 7 dias grátis", en: "BRL 399/mo · 7-day free trial" },
    points: [
      { pt: "Trilíngue PT · JP · EN", en: "Trilingual PT · JP · EN" },
      { pt: "OCR de passaporte e documentos", en: "Passport & document OCR" },
      { pt: "Sync com Cybozu Garoon", en: "Cybozu Garoon sync" },
      { pt: "LGPD + APPI (Japão)", en: "LGPD + APPI (Japan)" },
    ],
    site: { href: "https://selectsys-jobs.vercel.app", label: "selectsys-jobs" },
    page: "/produtos/selectsys-jobs",
    media: { kind: "images", items: [{ src: "/media/selectsys-flagship.jpg", alt: { pt: "SelectSys Jobs: Kanban de imigração e leitura de documentos", en: "SelectSys Jobs: immigration Kanban and document reading" } }] },
  },
  {
    id: "atol",
    name: "Atol Connect",
    logo: "/logo-atol-connect.png",
    segment: { pt: "API oficial do WhatsApp Business em reais", en: "Official WhatsApp Business API in BRL" },
    status: { pt: "Cloud API oficial da Meta", en: "Official Meta Cloud API" },
    live: true,
    headline: { pt: "WhatsApp oficial para empresas e software houses, sem QR Code, sem cobrança por atendente e sem ágio na tarifa da Meta.", en: "Official WhatsApp for businesses and software houses — no QR code, no per-seat fees, no markup on Meta's rates." },
    problem: { pt: "API por QR Code cai no pico de movimento; plataforma oficial cobra por atendente; e desde outubro cada resposta pela API depois das 1.000 grátis entra na fatura da Meta.", en: "QR-code APIs drop at peak time; official platforms charge per seat; and since October every API reply past the 1,000 free ones is billed by Meta." },
    solution: {
      pt: "Conexão pela Meta mantendo o celular (Coexistência), caixa de entrada em equipe, modelos aprovados e API REST com webhooks assinados para ERP, PDV e loja virtual.",
      en: "Connect through Meta while keeping the phone (Coexistence), team inbox, approved templates and a REST API with signed webhooks for ERP, POS and storefronts.",
    },
    proof: { pt: "É a mesma infraestrutura que os sistemas da casa usam.", en: "The same infrastructure our own systems run on." },
    offer: { pt: "A partir de R$ 79/mês · tarifa Meta sem markup", en: "From BRL 79/mo · Meta fees with no markup" },
    points: [
      { pt: "Coexistência: celular a R$ 0,00", en: "Coexistence: phone at BRL 0.00" },
      { pt: "Inbox + modelos aprovados", en: "Inbox + approved templates" },
      { pt: "REST + webhooks HMAC", en: "REST + HMAC webhooks" },
      { pt: "Parceiro: R$ 59/número", en: "Partner: BRL 59/number" },
    ],
    site: { href: "https://connect.maldivastech.dev/?utm_source=maldivastech&utm_medium=portal&utm_campaign=home-produtos", label: "connect.maldivastech.dev" },
    page: "/whatsapp-api",
    media: {
      kind: "images",
      items: [
        { src: "/media/atol-inbox.png", position: "center bottom", alt: { pt: "Caixa de entrada em equipe do Atol Connect (ilustração com dados de exemplo)", en: "Atol Connect team inbox (illustration with sample data)" } },
        { src: "/media/atol-simulador.png", position: "right center", alt: { pt: "Simulador de economia do Atol Connect: plataforma por atendente versus Atol", en: "Atol Connect savings simulator: per-seat platform versus Atol" } },
      ],
    },
  },
  {
    id: "mysuperstore",
    name: "MySuperStore",
    logo: "/logo-horiz-mysuperstore.png",
    logoDark: true,
    segment: { pt: "Plataforma de marketplace multi-vendedor", en: "Multi-vendor marketplace platform" },
    status: { pt: "No ar com o Ateliê Eli Trassi", en: "Live with Ateliê Eli Trassi" },
    live: true,
    headline: { pt: "A loja própria com checkout PIX que divide o dinheiro na hora certa.", en: "Your own storefront with PIX checkout that splits money at the right moment." },
    problem: { pt: "Vender em marketplace grande come a margem; loja própria sem split vira planilha de repasse.", en: "Big marketplaces eat the margin; a store without split turns payouts into spreadsheets." },
    solution: {
      pt: "Vitrine por lojista, frete calculado na hora, assistente de IA que conhece o catálogo e split PIX na liquidação, com webhook de pagamento idempotente e dinheiro em centavos inteiros.",
      en: "A storefront per merchant, live shipping quotes, an AI assistant that knows the catalog and PIX split on settlement, with idempotent payment webhooks and integer-cent money.",
    },
    proof: { pt: "Roda a loja do Ateliê Eli Trassi Macramê.", en: "Runs Ateliê Eli Trassi Macramê's store." },
    offer: { pt: "Loja no ar para conhecer", en: "Live store to explore" },
    points: [
      { pt: "Split PIX via Efí Bank", en: "PIX split via Efí Bank" },
      { pt: "Webhook HMAC idempotente", en: "Idempotent HMAC webhook" },
      { pt: "Assistente de IA da loja", en: "Store AI assistant" },
      { pt: "Frete calculado na hora", en: "Live shipping quotes" },
    ],
    site: { href: "https://mysuperstore-lime.vercel.app", label: "Ateliê Eli Trassi" },
    page: "/produtos/mysuperstore",
    media: { kind: "images", items: [{ src: "/media/mysuperstore-architecture.jpg", alt: { pt: "Arquitetura do MySuperStore com split PIX", en: "MySuperStore architecture with PIX split" } }] },
  },
];

/* Grafo do ecossistema: só integrações que existem no código de cada produto */
const G_PRODUCTS: GraphProduct[] = PRODUCTS.map((p) => ({ id: p.id, label: p.name, sub: "", href: `#produto-${p.id}` }));
// ordem no anel externo acompanha a ordem dos produtos (menos cruzamento de arestas)
const G_INTEGRATIONS: GraphIntegration[] = [
  { id: "bigdatacorp", label: "BigDataCorp API" },
  { id: "usda", label: "USDA Nutrition API" },
  { id: "ifood", label: "iFood Orders API" },
  { id: "bravus", label: "Bravus / Gertec" },
  { id: "sefaz", label: "Focus NFe · SEFAZ" },
  { id: "garoon", label: "Cybozu Garoon" },
  { id: "ocr", label: "Tesseract OCR" },
  { id: "llm", label: "Consultor M-IA (LLM)" },
  { id: "pagbank", label: "PagBank" },
  { id: "efi", label: "Efí · PIX Split" },
  { id: "meta", label: "WhatsApp Cloud API" },
  { id: "metasdk", label: "Meta Embedded Signup" },
  { id: "melhorenvio", label: "Melhor Envio" },
  { id: "supabase", label: "Supabase · RLS" },
];
const G_EDGES: GraphEdge[] = [
  ["miseon", "usda"], ["miseon", "ifood"], ["miseon", "sefaz"], ["miseon", "meta"], ["miseon", "bravus"], ["miseon", "efi"], ["miseon", "supabase"],
  ["mercadinhosys", "bigdatacorp"], ["mercadinhosys", "sefaz"], ["mercadinhosys", "llm"],
  ["selectsys", "garoon"], ["selectsys", "ocr"], ["selectsys", "supabase"],
  ["atol", "meta"], ["atol", "metasdk"], ["atol", "pagbank"], ["atol", "supabase"],
  ["mysuperstore", "efi"], ["mysuperstore", "melhorenvio"], ["mysuperstore", "llm"],
];

function ProductVideo({ src, poster, alt, pt }: { src: string; poster: string; alt: string; pt: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="h8-media-tile is-video">
      <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={alt} onPause={() => setPlaying(false)}>
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" className="h8-play" onClick={toggle} aria-label={playing ? (pt ? "Pausar vídeo" : "Pause video") : pt ? "Assistir vídeo" : "Play video"}>
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        {playing ? (pt ? "Pausar" : "Pause") : pt ? "Ver em operação" : "See it running"}
      </button>
    </div>
  );
}

export default function HomeClient() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const L = (b: Bi) => b[lang];

  return (
    <div className="h6 h8">
      {/* ================================ 1 · HERO ================================ */}
      <header className="h8-hero" id="top">
        <div className="wrap h8-hero-grid">
          <div className="h8-hero-copy">
            <div className="h6-eyebrow">{pt ? "SOFTWARE HOUSE · SÃO PAULO" : "SOFTWARE HOUSE · SÃO PAULO"}</div>
            <h1>
              Maldivas Tech
              <span>{pt ? "Sistemas que operações reais usam todo dia." : "Systems real operations run on every day."}</span>
            </h1>
            <p className="h6-lead">
              {pt
                ? "Construímos e operamos produtos SaaS próprios — para restaurantes, varejo, recrutamento internacional, WhatsApp oficial e e-commerce — e desenvolvemos sistemas sob medida para empresas que não podem parar."
                : "We build and run our own SaaS products — for restaurants, retail, international recruiting, official WhatsApp and e-commerce — and develop custom systems for companies that can't stop."}
            </p>
            <div className="h8-cta">
              <a className="btn btn-primary" href="#produtos">
                {pt ? "Ver produtos" : "See products"} <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost" href="#contato">
                {pt ? "Falar com a engenharia" : "Talk to engineering"}
              </a>
            </div>
          </div>
          <figure className="h8-hero-video">
            <VideoBackdrop
              label={
                pt
                  ? { on: "Ouvir", off: "Silenciar", hint: "Toque para ouvir", replay: "Ouvir de novo" }
                  : { on: "Sound on", off: "Mute", hint: "Tap for sound", replay: "Play sound again" }
              }
            />
            <figcaption>
              {pt ? "Vídeo institucional" : "Brand video"} ·{" "}
              <a href={CANVA_REEL} target="_blank" rel="noopener noreferrer">
                {pt ? "versão completa" : "full version"} <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        </div>

        {/* ============================ 2 · FAIXA DE PROVA ============================ */}
        <div className="wrap">
          <ul className="h8-proof" aria-label={pt ? "Provas" : "Proof"}>
            <li><strong>5</strong> {pt ? "produtos SaaS em produção" : "SaaS products in production"}</li>
            <li><CheckCircle2 size={15} aria-hidden="true" /> {pt ? "iFood homologado" : "iFood approved"}</li>
            <li><ShieldCheck size={15} aria-hidden="true" /> {pt ? "Cloud API oficial da Meta" : "Official Meta Cloud API"}</li>
            <li><CheckCircle2 size={15} aria-hidden="true" /> {pt ? "Cliente operando entre Brasil e Japão" : "Client operating between Brazil and Japan"}</li>
            <li>
              <a href={CX_CERT.verifyUrl} target="_blank" rel="noopener noreferrer" data-analytics="cert_click">
                <BadgeCheck size={15} aria-hidden="true" /> Oracle · CX Process Essentials
              </a>
            </li>
            <li>
              <a href={ORACLE_CERT.verifyUrl} target="_blank" rel="noopener noreferrer" data-analytics="cert_click">
                <BadgeCheck size={15} aria-hidden="true" /> Oracle · Agentic AI
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* ================================ 3 · PRODUTOS ================================ */}
      <section className="h6-sec" id="produtos" aria-labelledby="h8-prod">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "PRODUTOS" : "PRODUCTS"}</span>
            <h2 id="h8-prod">{pt ? "Cinco produtos SaaS, cada um nascido de uma operação real" : "Five SaaS products, each born from a real operation"}</h2>
            <p>{pt ? "Domínio próprio, cliente usando e código que a gente mantém. Escolha pelo seu tipo de negócio:" : "Own domain, real users and code we maintain. Pick by your type of business:"}</p>
          </div>

          <nav className="h8-prod-index" aria-label={pt ? "Produtos" : "Products"}>
            {PRODUCTS.map((p) => (
              <a key={p.id} href={`#produto-${p.id}`}>
                <strong>{p.name}</strong>
                <span>{L(p.segment)}</span>
              </a>
            ))}
          </nav>

          <div className="h8-products">
            {PRODUCTS.map((p, i) => (
              <article className={`h8-prod${i % 2 ? " is-rev" : ""}`} id={`produto-${p.id}`} key={p.id}>
                <div className="h8-prod-media">
                  {p.media.kind === "video" ? (
                    <ProductVideo src={p.media.src} poster={p.media.poster} alt={L(p.media.alt)} pt={pt} />
                  ) : (
                    p.media.items.map((m) => (
                      <div className={`h8-media-tile${m.contain ? " is-contain" : ""}`} key={m.src}>
                        <Image src={m.src} alt={L(m.alt)} fill sizes="(max-width: 1040px) 92vw, 46vw" style={{ objectFit: m.contain ? "contain" : "cover", objectPosition: m.position }} />
                      </div>
                    ))
                  )}
                </div>
                <div className="h8-prod-copy">
                  <div className="h8-prod-top">
                    <div className={`h7-logo${p.logoDark ? " is-dark" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logo} alt={p.name} loading="lazy" />
                    </div>
                    <span className={`h7-status${p.live ? " is-live" : ""}`}>{L(p.status)}</span>
                  </div>
                  <h3>
                    <span className="h8-seg">{L(p.segment)}</span>
                    {L(p.headline)}
                  </h3>
                  <dl className="h8-psp">
                    <div><dt>{pt ? "O problema" : "The problem"}</dt><dd>{L(p.problem)}</dd></div>
                    <div><dt>{pt ? "O que o sistema faz" : "What it does"}</dt><dd>{L(p.solution)}</dd></div>
                  </dl>
                  <ul className="h7-points">
                    {p.points.map((x) => (
                      <li key={x.pt}><CheckCircle2 size={15} aria-hidden="true" /> {L(x)}</li>
                    ))}
                  </ul>
                  <div className="h8-proofline">
                    <span>{L(p.proof)}</span>
                    <strong>{L(p.offer)}</strong>
                  </div>
                  <div className="h7-flag-actions">
                    {p.page && (
                      <Link className="btn btn-primary" href={localePath(p.page, lang)} data-analytics="product_click">
                        {pt ? `Conhecer o ${p.name}` : `Explore ${p.name}`} <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    )}
                    <a className={`btn ${p.page ? "btn-ghost" : "btn-primary"}`} href={p.site.href} target="_blank" rel="noopener noreferrer" data-analytics="product_demo">
                      {p.site.label} <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 4 · ECOSSISTEMA 3D ============================ */}
      <section className="h6-sec" id="ecossistema" aria-labelledby="h8-eco">
        <div className="wrap h8-eco">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "ARQUITETURA ORBITAL DO ECOSSISTEMA" : "ECOSYSTEM ORBITAL ARCHITECTURE"}</span>
            <h2 id="h8-eco">{pt ? "Sistema Solar de Integrações Oficiais em Produção" : "Solar System of Official Production Integrations"}</h2>
            <p>
              {pt
                ? "Cada planeta em órbita representa uma API oficial que roda em produção nos nossos produtos: enriquecimento de dados com BigDataCorp, cálculo nutricional com a API norte-americana USDA FoodData Central, emissão fiscal SEFAZ, pedidos iFood, WhatsApp Cloud API da Meta, split PIX via Efí Bank e sincronização com o Japão. Passe o mouse para pausar uma órbita e clique em qualquer integração para abrir a ficha técnica."
                : "Each orbiting planet represents an official API running in production across our products: BigDataCorp data enrichment, US nutritional data via USDA FoodData Central, SEFAZ tax emission, iFood orders, Meta WhatsApp Cloud API, Efí Bank PIX split, and Japan enterprise sync. Hover to pause an orbit and click any integration to inspect its technical flow."}
            </p>
          </div>
          <PortfolioGraph
            products={G_PRODUCTS}
            integrations={G_INTEGRATIONS}
            edges={G_EDGES}
            caption={pt ? "Todos os produtos compartilham a mesma fundação de engenharia: PostgreSQL multi-tenant com isolamento por linha (RLS), criptografia AES-256-GCM, trilha de auditoria e conformidade LGPD." : "All products share the same engineering foundation: multi-tenant PostgreSQL with row-level isolation (RLS), AES-256-GCM encryption, audit trail and LGPD compliance."}
          />
        </div>
      </section>

      {/* ================================ 5 · ACADEMY ================================ */}
      <AcademySection />

      {/* ============================ 6 · SOB MEDIDA ============================ */}
      <section className="h6-sec" id="cases" aria-labelledby="h8-cases">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "SOB MEDIDA · SISTEMAS, INTEGRAÇÕES E DADOS" : "CUSTOM · SYSTEMS, INTEGRATIONS AND DATA"}</span>
            <h2 id="h8-cases">{pt ? "Quando o produto pronto não cobre, a gente constrói" : "When an off-the-shelf product isn't enough, we build it"}</h2>
            <p>{pt ? "A mesma engenharia dos nossos produtos, aplicada à sua operação — com escopo, prazo e critério de aceite combinados antes." : "The same engineering behind our products, applied to your operation — with scope, timeline and acceptance criteria agreed upfront."}</p>
          </div>

          <div className="h8-services">
            {SERVICES.map((s) => (
              <article className="h8-service" key={s.id}>
                <h3>{s.nome[lang]}</h3>
                <p>{s.resumo[lang]}</p>
                <ul>
                  {s.entrega[lang].map((e) => (
                    <li key={e}><CheckCircle2 size={14} aria-hidden="true" /> {e}</li>
                  ))}
                </ul>
                <p className="h8-service-result">{s.resultado[lang]}</p>
              </article>
            ))}
          </div>

          <h3 className="h8-sub">{pt ? "Projetos entregues — todos no ar" : "Delivered projects — all live"}</h3>
          <div className="h8-works">
            {works.map((w) => (
              <article className="h8-work" key={w.name}>
                <span className="h6-case-tag">{w.client[lang]}</span>
                <h3>{w.name}</h3>
                <p className="h8-work-kind">{w.kind[lang]}</p>
                <p>{w.desc[lang]}</p>
                <p className="h8-work-proof">{w.proof[lang]}</p>
                <div className="tags">
                  {workTags(w, lang).map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div className="h8-work-links">
                  <a href={w.url} target="_blank" rel="noopener noreferrer" data-analytics="portfolio_click">
                    {pt ? "Ver no ar" : "View live"} <ExternalLink size={13} aria-hidden="true" />
                  </a>
                  {w.name === "SelectSys Jobs" && (
                    <Link href={localePath("/portfolio/fujiarte", lang)}>{pt ? "Ler o case" : "Read the case"} <ArrowRight size={13} aria-hidden="true" /></Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Link className="h7-textlink" href={localePath("/portfolio", lang)}>
            {pt ? "Portfólio completo" : "Full portfolio"} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ================================ 7 · SOBRE ================================ */}
      <section className="h6-sec" id="sobre" aria-labelledby="h8-sobre">
        <div className="wrap h7-about">
          <figure className="h7-about-photo">
            <Image src="/media/rafael-drone.jpg" alt={pt ? "Rafael Maldivas, fundador da Maldivas Tech" : "Rafael Maldivas, founder of Maldivas Tech"} fill sizes="(max-width: 1040px) 92vw, 40vw" style={{ objectFit: "cover" }} />
            <figcaption>
              <strong>Rafael Maldivas</strong>
              <span>{pt ? "Fundador · produto e engenharia" : "Founder · product & engineering"}</span>
            </figcaption>
          </figure>
          <div className="h7-about-copy">
            <span className="h6-kicker">{pt ? "A EMPRESA E O FUNDADOR" : "THE COMPANY AND ITS FOUNDER"}</span>
            <h2 id="h8-sobre">{pt ? "Antes do código, eu estive do outro lado do balcão." : "Before the code, I was on the other side of the counter."}</h2>
            <p>
              {pt
                ? "Passei por vendas, qualidade, processos e gastronomia. Foram seis anos na Heineken rodando PDV, estoque e ruptura na prática — e mentorando quem chegava. A cozinha virou o MiseOn; o balcão virou o MercadinhoSys."
                : "I worked in sales, quality, processes and gastronomy. Six years at Heineken running POS, stock and stockouts in practice — and mentoring newcomers. The kitchen became MiseOn; the counter became MercadinhoSys."}
            </p>
            <p>
              {pt
                ? "Hoje a Maldivas Tech desenha, constrói e responde pelos seus sistemas, com agentes de IA no processo de engenharia e parceria de hardware com a Bravus Core / Gertec. Você fala direto com quem decide a arquitetura — com contrato, nota fiscal e o sistema no ar."
                : "Today Maldivas Tech designs, builds and owns its systems, with AI agents in the engineering process and a hardware partnership with Bravus Core / Gertec. You talk directly to whoever decides the architecture — with a contract, an invoice and a live system."}
            </p>
            <dl className="h7-facts">
              <div><dt>{pt ? "Razão social" : "Legal name"}</dt><dd>{COMPANY.legalName}</dd></div>
              <div><dt>CNPJ</dt><dd>{COMPANY.cnpj} · NFSe</dd></div>
              <div><dt>{pt ? "Endereço" : "Address"}</dt><dd>{COMPANY.street} — {COMPANY.city}/{COMPANY.region}</dd></div>
              <div><dt>{pt ? "Certificações" : "Certifications"}</dt>
                <dd style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <a href={CX_CERT.verifyUrl} target="_blank" rel="noopener noreferrer">Oracle — {CX_CERT.name}</a>
                  <a href={ORACLE_CERT.verifyUrl} target="_blank" rel="noopener noreferrer">Oracle — {ORACLE_CERT.name}</a>
                </dd>
              </div>
            </dl>
            <Link className="h7-textlink" href={localePath("/about", lang)}>
              {pt ? "Trajetória completa" : "Full background"} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ 8 · CONTEÚDO E CANAIS ============================ */}
      <section className="h6-sec" id="conteudo" aria-labelledby="h8-cont">
        <div className="wrap">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "CONTEÚDO E CANAIS" : "CONTENT & CHANNELS"}</span>
            <h2 id="h8-cont">{pt ? "Acompanhe o que estamos construindo" : "Follow what we're building"}</h2>
          </div>
          <div className="h8-channels">
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="h8-channel">
              <PlayCircle size={22} aria-hidden="true" />
              <strong>YouTube</strong>
              <span>{pt ? "MiseOn em operação na cozinha" : "MiseOn running in the kitchen"}</span>
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="h8-channel">
              <BadgeCheck size={22} aria-hidden="true" />
              <strong>LinkedIn</strong>
              <span>{pt ? "Bastidores de produto e engenharia" : "Product and engineering behind the scenes"}</span>
            </a>
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" className="h8-channel">
              <ExternalLink size={22} aria-hidden="true" />
              <strong>GitHub</strong>
              <span>{pt ? "Organização Maldivas Tech Solutions" : "Maldivas Tech Solutions organization"}</span>
            </a>
            <Link href={localePath("/ferramentas", lang)} className="h8-channel">
              <Wrench size={22} aria-hidden="true" />
              <strong>{pt ? "Ferramentas gratuitas" : "Free tools"}</strong>
              <span>{pt ? "20+ calculadoras e utilitários sem cadastro" : "20+ calculators and utilities, no signup"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================== 9 · FAQ ================================== */}
      <section className="h6-sec" id="faq" aria-labelledby="h8-faq">
        <div className="wrap h8-faq">
          <div className="h6-head">
            <span className="h6-kicker">{pt ? "PERGUNTAS FREQUENTES" : "FAQ"}</span>
            <h2 id="h8-faq">{pt ? "Antes de conversar" : "Before we talk"}</h2>
          </div>
          <div>
            {HOME_FAQ.map((f, i) => (
              <details className="h8-faq-item" key={f.q.pt} open={i === 0}>
                <summary>{f.q[lang]}</summary>
                <p>{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ 10 · CONTATO ================================ */}
      <HomeContactForm />
      <ExitToast />
    </div>
  );
}
