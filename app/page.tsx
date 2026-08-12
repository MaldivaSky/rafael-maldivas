"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, ChefHat, BriefcaseBusiness, Store, ShoppingCart, MessageCircle, Server, Code2, ShieldCheck, Database, Layout, LineChart } from "lucide-react";
import dynamic from "next/dynamic";

const ArchitectureModal = dynamic(() => import("./components/ArchitectureModal"), { ssr: false });
const CardGraphics = dynamic(() => import("./components/CardGraphics"), { ssr: false });

type Lang = "pt" | "en";

const GITHUB_USER = "https://github.com/MaldivaSky";
const GITHUB_ORG = "https://github.com/maldivas-tech";
const LINKEDIN = "https://www.linkedin.com/in/rafael-paiva-dias-022b17122/";
const EMAIL = "rafaelmaldivas@gmail.com";
const WHATSAPP = "https://wa.me/5511919889233";

const ic = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

/* ------------------------------------------------------------------ */
/*  Conteúdo                                                           */
/* ------------------------------------------------------------------ */

const techs = [
  { n: "Python", s: ic("python") },
  { n: "TypeScript", s: ic("typescript") },
  { n: "React", s: ic("react") },
  { n: "Next.js", s: ic("nextdotjs/white") },
  { n: "Django", s: ic("django/44B78B") },
  { n: "Flask", s: ic("flask/white") },
  { n: "Node.js", s: ic("nodedotjs") },
  { n: "Deno", s: ic("deno/70FFAF") },
  { n: "PostgreSQL", s: ic("postgresql") },
  { n: "Supabase", s: ic("supabase") },
  { n: "Redis", s: ic("redis") },
  { n: "Docker", s: ic("docker") },
  { n: "Tailwind", s: ic("tailwindcss") },
  { n: "Playwright", s: ic("playwright/2EAD33") },
  { n: "Pandas", s: ic("pandas/E70488") },
  { n: "Vercel", s: ic("vercel/white") },
];

type Product = {
  icon: string | any;
  logoHorizontal?: string;
  name: string;
  status: "live" | "deploy";
  role: { pt: string; en: string };
  statusLabel: { pt: string; en: string };
  desc: { pt: string; en: string };
  problem: { pt: string; en: string };
  solution: { pt: string; en: string };
  tags: { l: string; s?: string }[];
  repo: string | null;
  demo: string | null;
  deepTech?: { pt: React.ReactNode; en: React.ReactNode };
};

const products: Product[] = [
  {
    icon: "/logo-miseon.png",
    logoHorizontal: "/logo-horiz-miseon.png",
    name: "MiseOn",
    status: "live",
    role: { pt: "SaaS multi-tenant · Food service", en: "Multi-tenant SaaS · Food service" },
    statusLabel: { pt: "Em operação", en: "Live" },
    desc: {
      pt: "SaaS Multi-tenant para Food Service desenhado para conversão brutal e usabilidade sem atritos. Interfaces ultra-responsivas construídas com Tailwind CSS de altíssimo nível. Renderização espacial imersiva com Three.js e Konva, e logística via Leaflet. UX fluida e offline-first (PWA) garantida por testes pesados de carga (k6) e E2E (Cypress).",
      en: "Multi-tenant SaaS for Food Service designed for brutal conversion and frictionless usability. Ultra-responsive interfaces built with top-tier Tailwind CSS. Immersive spatial rendering with Three.js and Konva, plus logistics via Leaflet. Fluid, offline-first UX (PWA) guaranteed by heavy load testing (k6) and E2E (Cypress).",
    },
    problem: {
      pt: "Dono de restaurante sabe quanto vendeu. Quase nunca sabe **quanto sobrou**. O cliente na mesa odeia sistemas lentos, e o garçom abandona telas confusas. O churn nasce da má experiência do usuário.",
      en: "Restaurant owners know their revenue. They almost never know their **margin**. Dine-in customers hate slow systems, and waiters abandon confusing screens. Churn is born from poor UX.",
    },
    solution: {
      pt: "Ledger de estoque **PEPS auditável** imerso em uma interface construída com precisão clínica. O usuário é guiado ao fechamento do pedido de forma intuitiva, aumentando o ticket médio. Tudo suportado por uma infraestrutura que simplesmente não cai.",
      en: "An auditable **FIFO inventory ledger** immersed in a clinically precise interface. The user is intuitively guided to checkout, increasing average ticket size. All supported by an infrastructure that simply does not go down.",
    },
    tags: [
      { l: "React 19", s: ic("react") },
      { l: "Three.js / Konva", s: ic("threedotjs") },
      { l: "Supabase", s: ic("supabase") },
      { l: "k6 Load Testing" },
      { l: "Cypress E2E", s: ic("cypress/17202C") },
      { l: "PWA / Offline-first" },
      { l: "Tailwind CSS", s: ic("tailwindcss") },
      { l: "NFC-e" },
    ],
    repo: null,
    demo: null,
    deepTech: {
      pt: [
        {
          id: "offline",
          icon: Code2,
          title: "Offline-First & PWA Sync",
          desc: <p>Garçons não podem perder pedidos se o Wi-Fi do restaurante cair. A arquitetura <strong>Offline-First</strong> usa IndexedDB local e Service Workers. As mutações de pedidos entram numa fila local e sofrem <em>Optimistic UI Updates</em>, sendo sincronizadas em background assim que a rede volta, com resolução de conflitos CRDT no servidor.</p>
        },
        {
          id: "spatial",
          icon: Server,
          title: "Renderização Espacial (Three.js/Konva)",
          desc: <p>A gestão de salão não é uma tabela chata. Criei um módulo de layout interativo usando Canvas (Konva) e Three.js para renderizar a planta do restaurante em tempo real. O dono arrasta as mesas (Drag & Drop), altera o status (livre/ocupada) e os dados persistem em milissegundos via WebSockets.</p>
        },
        {
          id: "k6",
          icon: ShieldCheck,
          title: "Stress Testing Massivo com k6",
          desc: <p>A sexta-feira à noite não pode derrubar o servidor. A API Node.js é coberta por testes de carga (Stress e Spike tests) rodando k6 scripts. O sistema suporta requisições massivas de 10.000 chamadas concorrentes para fechamento de conta e emissão fiscal (NFC-e), otimizadas por pool de conexões (PgBouncer).</p>
        }
      ],
      en: [
        {
          id: "offline",
          icon: Code2,
          title: "Offline-First & PWA Sync",
          desc: <p>Waiters cannot lose orders if the restaurant's Wi-Fi drops. The <strong>Offline-First</strong> architecture utilizes local IndexedDB and Service Workers. Order mutations enter a local queue and trigger <em>Optimistic UI Updates</em>, syncing in the background via CRDT conflict resolution as soon as the network returns.</p>
        },
        {
          id: "spatial",
          icon: Server,
          title: "Spatial Rendering (Three.js/Konva)",
          desc: <p>Floor management isn't a boring table. I built an interactive layout module using Canvas (Konva) and Three.js to render the restaurant floor plan in real-time. Owners drag and drop tables, change status (free/busy), and data persists in milliseconds via WebSockets.</p>
        },
        {
          id: "k6",
          icon: ShieldCheck,
          title: "Massive Stress Testing with k6",
          desc: <p>Friday night rush cannot crash the server. The Node.js API is heavily covered by load testing (Stress and Spike tests) using k6 scripts. The system handles massive bursts of 10,000 concurrent requests for checkout and fiscal invoice issuance, highly optimized via connection pooling (PgBouncer).</p>
        }
      ]
    }
  },
  {
    icon: "/logo-selectsys.png",
    logoHorizontal: "/logo-horiz-selectsys.png",
    name: "SelectSys Jobs",
    status: "deploy",
    role: { pt: "ATS bilíngue · Recrutamento Brasil → Japão", en: "Bilingual ATS · Brazil → Japan recruitment" },
    statusLabel: { pt: "Em implantação", en: "Rolling out" },
    desc: {
      pt: "ATS bilíngue de altíssimo nível (Brasil → Japão) com pipeline de inteligência artificial embarcada no client-side para uma UX sem atritos. Processamento instantâneo e design system robusto guiando o usuário até a conversão.",
      en: "Top-tier bilingual ATS (Brazil → Japan) with client-side AI pipeline for frictionless UX. Instant processing and a robust design system guiding the user straight to conversion.",
    },
    problem: {
      pt: "Sistemas complexos afastam candidatos. Exigir digitação repetitiva de um currículo de 130 campos mata a taxa de conversão. Se a interface não for genial, a agência perde o talento.",
      en: "Complex systems drive candidates away. Forcing repetitive data entry for a 130-field résumé kills the conversion rate. If the interface isn't brilliant, the agency loses the talent.",
    },
    solution: {
      pt: "Extração OCR nativa no navegador (Tesseract.js e PDF.js) que preenche o cadastro em segundos. Exportação fiel com ExcelJS gerando o relatório COE exigido pelo governo japonês. O candidato ama usar, e o Product Owner tem a adesão que precisa.",
      en: "Native in-browser OCR extraction (Tesseract.js and PDF.js) that auto-fills the form in seconds. Faithful export with ExcelJS generating the exact COE report required by the Japanese government. The candidate loves using it, and the Product Owner gets the needed adoption.",
    },
    tags: [
      { l: "React 19", s: ic("react") },
      { l: "Tailwind v4", s: ic("tailwindcss") },
      { l: "Playwright E2E", s: ic("playwright/2EAD33") },
      { l: "Tesseract OCR & PDF.js" },
      { l: "ExcelJS" },
      { l: "Zod + TanStack" },
      { l: "UX/UI Patterns" },
    ],
    repo: null,
    demo: null,
    deepTech: {
      pt: [
        {
          id: "match",
          icon: Server,
          title: "Motor de Match Preditivo",
          desc: <p>A qualificação de um Dekassegui para o visto não é trivial. Desenvolvi o <strong>MatchEngine.ts</strong>, que cruza dados não convencionais: tamanho do EPI, nível de proficiência em Japonês (JLPT N2/N3) e geração da descendência (Sansei/Yonsei) para gerar um Match Score automático (0 a 100), definindo elegibilidade para imigração antes do recrutador ler o perfil.</p>
        },
        {
          id: "export",
          icon: Code2,
          title: "Motor de Exportação Híbrido (O Diferencial de Vendas)",
          desc: <p>O Japão e a Fujiarte não abandonam o Excel. Acoplei ao Node.js um script Python nativo (<code>xlrd</code> e <code>xlutils</code>). O candidato usa uma PWA mobile moderna, e o backend cospe um binário <code>.xls</code> injetando os dados milimetricamente nas <strong>147 linhas e 59 colunas</strong> do template da imigração japonesa. Zero atrito na adoção B2B.</p>
        },
        {
          id: "ai_proxy",
          icon: Code2,
          title: "Integração DeepSeek AI (Edge Functions)",
          desc: <p>Para resumir currículos extensos e traduzir termos nativos para agências japonesas, criei um proxy em Edge Functions (Deno) se comunicando via <strong>DeepSeek API</strong>. O pipeline analisa o histórico de trabalho e gera um <em>cover letter</em> automático perfeitamente formatado, rodando de forma serverless com latência ínfima.</p>
        },
        {
          id: "async",
          icon: Database,
          title: "Filas Assíncronas (Job Queues)",
          desc: <p>Processamentos demorados (geração de Excel, OCR de passaporte, envio de emails) não bloqueiam o Thread Pool. O banco de dados dispara triggers (<code>06_job_queues_async_processing.sql</code>) para filas assíncronas consumidas por workers isolados. O frontend ouve Webhooks e atualiza via WebSockets quando o job está concluído.</p>
        },
        {
          id: "rls",
          icon: ShieldCheck,
          title: "LGPD, APPI e Isolamento RLS",
          desc: <p>Lidar com passaportes e biometria requer compliance absoluto (LGPD Art. 11, APPI japonês). Desenvolvi Row Level Security e Triggers de <em>Soft Delete Auditável</em> (<code>05_soft_delete_audit_lgpd.sql</code>) direto no PostgreSQL. A aplicação não consegue, nem por erro de código, vazar dados entre Tenants concorrentes.</p>
        },
        {
          id: "backup",
          icon: ShieldCheck,
          title: "Plano de Continuidade & DevOps",
          desc: <p>Desenvolvi scripts robustos de PowerShell para validação cruzada (<code>backup_restore_test.ps1</code>). Automação CI/CD no GitHub Actions que não permite PRs sem 100% de passagem nos testes (Playwright) e testes unitários da engine de pontuação. Arquitetura desenhada para SLA de 99.99%.</p>
        }
      ],
      en: [
        {
          id: "match",
          icon: Server,
          title: "Predictive Match Engine",
          desc: <p>Qualifying a Dekassegui isn't trivial. I built <strong>MatchEngine.ts</strong>, cross-referencing unconventional data: PPE size, JLPT N2/N3 proficiency, and Japanese descent generation (Sansei/Yonsei) to generate an automatic Match Score (0 to 100), defining immigration eligibility before a human reads the profile.</p>
        },
        {
          id: "export",
          icon: Code2,
          title: "Hybrid Export Engine (The B2B Closer)",
          desc: <p>Japan and Fujiarte will never abandon Excel. I coupled a native Python script (<code>xlrd</code>/<code>xlutils</code>) to the Node.js backend. Candidates use a modern mobile PWA, and the backend outputs an <code>.xls</code> binary, injecting data precisely into the <strong>147 rows and 59 columns</strong> of the immigration template. Zero B2B friction.</p>
        },
        {
          id: "ai_proxy",
          icon: Code2,
          title: "DeepSeek AI Integration (Edge)",
          desc: <p>To summarize extensive resumes and translate native terms for Japanese agencies, I created an Edge Function proxy (Deno) communicating with the <strong>DeepSeek API</strong>. The pipeline analyzes work history and generates an automatic, perfectly formatted cover letter running serverless with minimal latency.</p>
        },
        {
          id: "async",
          icon: Database,
          title: "Asynchronous Job Queues",
          desc: <p>Heavy processing (Excel generation, passport OCR, email dispatching) never blocks the Thread Pool. The database fires triggers to async queues consumed by isolated workers. The frontend listens to Webhooks and updates via WebSockets when the job completes.</p>
        },
        {
          id: "rls",
          icon: ShieldCheck,
          title: "Data Privacy & Tenant Isolation",
          desc: <p>Handling passports and biometrics requires absolute compliance (LGPD, Japanese APPI). I developed Row Level Security and <em>Auditable Soft Delete</em> triggers directly in PostgreSQL. The application cannot, even through a coding error, leak data between competing Tenants.</p>
        },
        {
          id: "backup",
          icon: ShieldCheck,
          title: "Business Continuity & DevOps",
          desc: <p>I developed robust PowerShell scripts for cross-validation. GitHub Actions CI/CD automation blocks PRs without 100% pass rates on Playwright tests. Architecture designed for a rigid 99.99% SLA.</p>
        }
      ]
    }
  },
  {
    icon: "/logo-mercadinhosys.png",
    logoHorizontal: "/logo-horiz-mercadinhosys.png",
    name: "mercadinhosys",
    status: "live",
    role: { pt: "ERP multi-tenant · Varejo e PDV fiscal", en: "Multi-tenant ERP · Retail & fiscal POS" },
    statusLabel: { pt: "Em operação", en: "Live" },
    desc: {
      pt: "ERP multi-tenant com foco em retenção e product discovery. Interface super intuitiva que simplifica operações diárias complexas. Equipado com motor de Business Intelligence nativo para análise estatística.",
      en: "Multi-tenant ERP focused on retention and product discovery. Super intuitive interface that simplifies complex daily operations. Powered by a native Business Intelligence engine for statistical analysis.",
    },
    problem: {
      pt: "Sistemas de gestão geralmente são feios e exigem semanas de treinamento. Se o software causa fadiga visual e processos truncados, a equipe não usa, o dado não entra e o dono perde o controle do negócio.",
      en: "Management systems are usually ugly and require weeks of training. If the software causes visual fatigue and clunky workflows, the team won't use it, data doesn't get logged, and the owner loses control of the business.",
    },
    solution: {
      pt: "Uma UI cuidadosamente polida acoplada a um backend preditivo (Pandas e Statsmodels). Dashboards interativos em Plotly mostram Curva ABC e RFM com clareza cristalina. Telemetria e rastreabilidade total via Sentry garantem zero downtime para a operação.",
      en: "A carefully polished UI coupled with a predictive backend (Pandas and Statsmodels). Interactive Plotly dashboards show ABC curves and RFM with crystal clarity. Full telemetry and traceability via Sentry guarantee zero downtime.",
    },
    tags: [
      { l: "Flask / Python", s: ic("flask/white") },
      { l: "Pandas + Statsmodels", s: ic("pandas/E70488") },
      { l: "Redis", s: ic("redis") },
      { l: "Plotly Dashboards" },
      { l: "Sentry Observability" },
      { l: "Advanced UX" },
    ],
    repo: `${GITHUB_ORG}/mercadinhosys`,
    demo: "https://mercadinhosys.vercel.app",
    deepTech: {
      pt: [
        {
          id: "ledger",
          icon: Database,
          title: "Ledger Imutável (Event Sourcing)",
          desc: <p>Sistemas de PDV comuns calculam estoque com updates diretos. Este ERP usa um <strong>Ledger Imutável (Event Sourcing)</strong>. Entradas e saídas são apensadas (append-only) no PostgreSQL. Se ocorrer um problema de concorrência massiva de acessos, o saldo é perfeitamente auditável até a origem, garantindo consistência bancária para o varejista.</p>
        },
        {
          id: "pandas",
          icon: Server,
          title: "Business Intelligence com Pandas",
          desc: <p>Um pipeline avançado de dados em Python no backend. Utilizo bibliotecas como <strong>Pandas e Statsmodels</strong> para ingerir séries temporais, gerando análises de Curva ABC, matriz RFM (Recência, Frequência e Valor monetário) e predição estatística de ruptura de estoque para compras automatizadas.</p>
        },
        {
          id: "dashboards",
          icon: Code2,
          title: "Data Visualization (Plotly)",
          desc: <p>O frontend exibe esses dados massivos não com tabelas entediantes, mas com gráficos e superfícies 3D geradas pelo <strong>Plotly</strong>. A leitura dos KPIs da empresa se torna visual e cirúrgica, reduzindo o esforço cognitivo do gestor ao tomar decisões financeiras críticas.</p>
        },
        {
          id: "observability",
          icon: ShieldCheck,
          title: "Observabilidade & Sentry",
          desc: <p>O sistema possui rastreabilidade total (tracing) conectada ao Sentry. Erros silenciosos no cliente ou no servidor são interceptados na Edge, com call stacks e estado do Redux anexados ao log. O erro é corrigido antes mesmo do cliente notar.</p>
        }
      ],
      en: [
        {
          id: "ledger",
          icon: Database,
          title: "Immutable Ledger (Event Sourcing)",
          desc: <p>Standard POS systems calculate inventory with direct updates. This ERP uses an <strong>Immutable Ledger</strong>. Inserts and subtractions are append-only in PostgreSQL. If a massive concurrency issue occurs, the balance is perfectly auditable back to the source, ensuring bank-level consistency for the retailer.</p>
        },
        {
          id: "pandas",
          icon: Server,
          title: "Business Intelligence with Pandas",
          desc: <p>An advanced data pipeline in Python running on the backend. I utilize <strong>Pandas and Statsmodels</strong> to ingest time series, generating ABC Curve analysis, RFM matrices (Recency, Frequency, Monetary), and statistical stockout predictions for automated purchasing.</p>
        },
        {
          id: "dashboards",
          icon: Code2,
          title: "Data Visualization (Plotly)",
          desc: <p>The frontend displays this massive data not with boring tables, but with highly interactive charts and 3D surfaces generated by <strong>Plotly</strong>. Reading company KPIs becomes visual and surgical, reducing the manager's cognitive load during critical financial decisions.</p>
        },
        {
          id: "observability",
          icon: ShieldCheck,
          title: "Observability & Sentry",
          desc: <p>The system has full distributed tracing connected to Sentry. Silent client-side or server errors are intercepted at the Edge, with call stacks and Redux state attached to the log. The bug is fixed before the client even notices.</p>
        }
      ]
    }
  },
  {
    icon: "/logo-mysuperstore.png",
    logoHorizontal: "/logo-horiz-mysuperstore.png",
    name: "MySuperStore",
    status: "live",
    role: { pt: "Marketplace multi-vendedor headless", en: "Headless multi-vendor marketplace" },
    statusLabel: { pt: "Em operação", en: "Live" },
    desc: {
      pt: "Marketplace com múltiplos lojistas, pagamento Pix e cartão com split automático de receita, cotação de frete em tempo real e processamento assíncrono.",
      en: "Multi-seller marketplace with Pix and card payments, automatic revenue split, real-time shipping quotes and asynchronous processing.",
    },
    problem: {
      pt: "Marketplace só funciona se o dinheiro chegar certo a cada lojista, na hora certa. Repasse manual não escala e é onde a operação quebra.",
      en: "A marketplace only works if money reaches each seller correctly and on time. Manual payouts don't scale — that's where the operation breaks.",
    },
    solution: {
      pt: "**Split automático de receita** na liquidação (Efí Bank), frete cotado em tempo real via Melhor Envio e fila assíncrona com Celery e Redis para não travar o checkout.",
      en: "**Automatic revenue split** at settlement (Efí Bank), real-time shipping quotes via Melhor Envio, and an async queue with Celery and Redis so checkout never blocks.",
    },
    tags: [
      { l: "Django REST", s: ic("django/44B78B") },
      { l: "Next.js 15", s: ic("nextdotjs/white") },
      { l: "PostgreSQL", s: ic("postgresql") },
      { l: "Redis", s: ic("redis") },
      { l: "Celery" },
    ],
    repo: `${GITHUB_ORG}/MySuperStore`,
    demo: "https://mysuperstore-lime.vercel.app",
    deepTech: {
      pt: [
        {
          id: "split",
          icon: Server,
          title: "Split Automático de Receitas",
          desc: <p>Gerenciar marketplaces B2B2C exige precisão bancária. Desenvolvi integração transparente com a API do Efí Bank e Stripe para executar o <strong>Split de Pagamento no momento da liquidação</strong>. Comissões da plataforma, frete e royalties do lojista caem separadamente nas contas, evitando bi-tributação e trabalho contábil humano.</p>
        },
        {
          id: "celery",
          icon: Database,
          title: "Processamento Distribuído (Celery + Redis)",
          desc: <p>Finalizar compra exige cotação de frete, reserva de estoque, validação anti-fraude e emissão de nota. Para o frontend não ficar girando infinito e perder a conversão (Timeout), o Django joga essas tarefas para um broker de fila (Redis) consumido por workers em Celery de forma totalmente assíncrona.</p>
        },
        {
          id: "headless",
          icon: Code2,
          title: "Arquitetura Headless com Next.js",
          desc: <p>O backend (Django API) é totalmente desacoplado da vitrine. O Next.js 15 consome via App Router, utilizando cache agressivo (ISR - Incremental Static Regeneration) para servir o catálogo com LCP abaixo de 800ms para SEO, mesmo com milhares de produtos no banco de dados.</p>
        }
      ],
      en: [
        {
          id: "split",
          icon: Server,
          title: "Automatic Revenue Split",
          desc: <p>Managing B2B2C marketplaces requires bank-level precision. I developed a transparent integration with Efí Bank and Stripe APIs to execute <strong>Payment Splitting at settlement</strong>. Platform commissions, shipping, and seller royalties land separately in their respective accounts, avoiding double taxation and manual accounting work.</p>
        },
        {
          id: "celery",
          icon: Database,
          title: "Distributed Processing (Celery + Redis)",
          desc: <p>Checking out requires shipping quotes, stock reservation, anti-fraud validation, and invoicing. So the frontend doesn't spin infinitely and lose conversions due to Timeouts, Django throws these tasks to a queue broker (Redis) consumed by Celery workers entirely asynchronously.</p>
        },
        {
          id: "headless",
          icon: Code2,
          title: "Headless Architecture (Next.js)",
          desc: <p>The backend (Django API) is entirely decoupled from the storefront. Next.js 15 consumes via the App Router, utilizing aggressive caching (ISR - Incremental Static Regeneration) to serve the catalog with an LCP under 800ms for massive SEO wins, even with thousands of products in the database.</p>
        }
      ]
    }
  },
];

const t = {
  pt: {
    nav: { products: "Produtos", eng: "Engenharia", how: "Como trabalho", about: "Empresa", contact: "Contato" },
    heroBadge: "Disponível para novos projetos e posições fullstack",
    h1a: "Sistemas de gestão para operações que ",
    h1b: "não podem parar",
    lead: "Construo ERP, PDV fiscal, marketplace e ATS multi-tenant — do modelo de dados ao deploy. Software que a operação usa todo dia, com emissão de nota, controle de acesso por linha e trilha de auditoria.",
    note: "Rafael Maldivas · Engenheiro de software fullstack e análise de dados. Fundador da **Maldivas Tech Solutions** — CNPJ ativo, emissão de nota fiscal de serviço.",
    ctaWork: "Ver os produtos",
    ctaTalk: "Falar sobre um projeto",
    ctaGh: "GitHub",
    stats: [
      { n: "5", l: "plataformas completas construídas do zero" },
      { n: "500+", l: "commits só no ERP mercadinhosys" },
      { n: "pt · ja", l: "produto B2B bilíngue para o mercado japonês" },
      { n: "CNPJ", l: "ativo — contrato PJ e nota fiscal de serviço" },
    ],
    prodTag: "Meus Produtos",
    prodTitle: "Plataformas SaaS Exclusivas",
    prodLead: "Além de atuar como engenheiro de software em projetos sob medida, eu sou fundador e mantenedor de sistemas SaaS completos. Conheça as plataformas que desenvolvo e opero em produção.",
    lblProblem: "A dor do mercado",
    lblSolution: "A Solução (SaaS)",
    lblRepo: "Assinar Plataforma",
    lblDemo: "Acessar Plataforma",
    lblPrivate: "Exclusivo B2B — Sob Contrato",
    engTag: "Engenharia",
    engTitle: "Como eu decido arquitetura",
    engLead: "Três decisões que eu defendo em qualquer conversa técnica — e que aparecem em todos os sistemas acima.",
    eng: [
      {
        h: "Invariante de negócio mora no banco",
        p: "Baixa de estoque, lançamento contábil e numeração de pedido são triggers dentro da transação. A aplicação pode cair, o deploy pode quebrar, dois processos podem concorrer — o saldo continua certo.",
      },
      {
        h: "Isolamento é Row Level Security",
        p: "Multi-tenancy por WHERE tenant_id depende de ninguém esquecer o WHERE. Uma query esquecida é vazamento entre clientes. A política no Postgres não esquece.",
      },
      {
        h: "Estoque é ledger, saldo é cache",
        p: "As movimentações são a fonte da verdade e são append-only. O saldo atual é derivado. Isso torna qualquer divergência auditável até a origem, em vez de inexplicável.",
      },
    ],
    capTag: "Capacidades",
    capTitle: "O que eu trago para a mesa",
    caps: [
      { h: "Arquitetura Frontend & Experiência Sênior", i: ["Domínio absoluto de UX/UI Patterns e conversão", "Interfaces hipnóticas com Tailwind CSS de alto nível", "Three.js e Canvas (Konva) para imersão espacial", "Client-side OCR (Tesseract) e processamento pesado local", "Micro-interações, Glassmorphism e acessibilidade nativa"] },
      { h: "Engenharia Backend & Modelagem de Alta Carga", i: ["Flask, Django, Node.js e Edge Functions", "PostgreSQL avançado — RLS, Triggers e pgcrypto", "Filas assíncronas (Celery, Redis) para checkout sem atrito", "Desenho arquitetural focado em zero downtime", "Sentry Observability e auditoria imutável"] },
      { h: "Qualidade, Testes & Cultura DevOps", i: ["Testes de carga massiva com k6 e telemetria", "Testes E2E state-of-the-art com Playwright e Cypress", "Docker, CI/CD pipelines e entregas incrementais seguras", "PWA e estratégias Offline-First ultra-resilientes", "Ambiente de homologação voltado ao Product Owner"] },
      { h: "Inteligência de Dados & Domínio Comercial", i: ["Modelagem preditiva e estatística (Pandas, Statsmodels)", "Dashboards interativos de alto impacto (Plotly, Recharts)", "Gestão de pagamentos (Pix/Cartão com split inteligente)", "LGPD by design e conformidade fiscal (NFC-e)", "Soluções criadas para vender, faturar e escalar tenants"] },
    ],
    howTag: "Método",
    howTitle: "Como eu trabalho",
    howLead: "Sem surpresa de escopo, sem surpresa de preço. O que combinamos fica por escrito antes de a primeira linha ser escrita.",
    steps: [
      { h: "Diagnóstico do processo", p: "Antes de falar de tecnologia, eu mapeio onde o dinheiro vaza, onde alguém redigita e onde o erro nasce. Esta etapa não é cobrada." },
      { h: "Escopo, prazo e preço", p: "Proposta escrita com o que entra, o que não entra, marcos de validação e condições de pagamento. Você aprova antes de começar." },
      { h: "Entrega com validação semanal", p: "Ambiente de homologação dedicado e um marco visível por semana. Você acompanha o sistema nascer, não recebe uma caixa fechada no fim." },
      { h: "Aceite e garantia", p: "Treinamento da equipe, termo de aceite e 90 dias de garantia técnica sobre tudo que estava no escopo." },
    ],
    aboutTag: "Empresa",
    aboutTitle: "Maldivas Tech Solutions",
    aboutBody: [
      "Sou **Rafael Maldivas**, engenheiro de software fullstack com foco em sistemas de gestão e análise de dados. Antes de programar, trabalhei com vendas — e é por isso que eu começo pelo processo, não pela stack. Software que ignora como a operação realmente funciona não é usado, por melhor que seja o código.",
      "A **Maldivas Tech Solutions** é a estrutura formal por trás desse trabalho: CNPJ ativo, contrato, nota fiscal de serviço e responsabilidade definida por escrito. Se você precisa de fornecedor que a área financeira consegue cadastrar, existe.",
      "Atendo **projeto B2B sob contrato** e também posições **fullstack em regime CLT ou PJ**, remoto no Brasil ou internacional. Nos dois casos eu entrego a mesma coisa: sistema que aguenta a operação real e código que a próxima pessoa consegue manter.",
    ],
    corp: "Dados da empresa",
    kv: [
      ["Razão social", "63.310.253 Renann H. P. D. da Silva"],
      ["Nome fantasia", "Maldivas Tech Solutions"],
      ["CNPJ", "63.310.253/0001-81"],
      ["Situação", "Ativa"],
      ["Sede", "Guarulhos — SP, Brasil"],
      ["Nota fiscal", "NFS-e emitida mensalmente"],
      ["Responsável técnico", "Rafael Maldivas"],
    ],
    contactTitle: "Tem uma operação que precisa de sistema?",
    contactLead: "A conversa inicial e o diagnóstico do processo não têm custo. Se eu não for a melhor solução para o seu caso, eu digo isso na primeira reunião.",
    contactBtn: "Falar no WhatsApp",
    contactAlt: "Conversar no LinkedIn",
    contactEmail: "Enviar e-mail",
    contactFine: "Também disponível para posições fullstack — Brasil ou remoto internacional.",
    rights: "Todos os direitos reservados.",
  },
  en: {
    nav: { products: "Products", eng: "Engineering", how: "How I work", about: "Company", contact: "Contact" },
    heroBadge: "Available for new projects and fullstack roles",
    h1a: "Management systems for operations that ",
    h1b: "cannot go down",
    lead: "I build multi-tenant ERPs, fiscal POS, marketplaces and ATS platforms — from the data model to deployment. Software the operation uses every day, with tax invoicing, row-level access control and audit trails.",
    note: "Rafael Maldivas · Fullstack software engineer and data analyst. Founder of **Maldivas Tech Solutions** — registered Brazilian company issuing formal service invoices.",
    ctaWork: "See the products",
    ctaTalk: "Discuss a project",
    ctaGh: "GitHub",
    stats: [
      { n: "5", l: "complete platforms built from scratch" },
      { n: "500+", l: "commits on the mercadinhosys ERP alone" },
      { n: "pt · ja", l: "bilingual B2B product for the Japanese market" },
      { n: "B2B", l: "registered company — contracts and invoicing" },
    ],
    prodTag: "My Products",
    prodTitle: "Exclusive SaaS Platforms",
    prodLead: "Beyond working as a software engineer on custom B2B projects, I am the founder and maintainer of complete SaaS systems. Explore the platforms I build and operate in production.",
    lblProblem: "Market pain point",
    lblSolution: "The Solution (SaaS)",
    lblRepo: "Subscribe to Platform",
    lblDemo: "Access Platform",
    lblPrivate: "B2B Exclusive — Under Contract",
    engTag: "Engineering",
    engTitle: "How I decide architecture",
    engLead: "Three decisions I'll defend in any technical conversation — and that show up in every system above.",
    eng: [
      {
        h: "Business invariants live in the database",
        p: "Inventory depletion, ledger entries and order numbering are triggers inside the transaction. The app can crash, a deploy can break, two processes can race — the balance stays correct.",
      },
      {
        h: "Isolation means Row Level Security",
        p: "Multi-tenancy via WHERE tenant_id depends on nobody forgetting the WHERE. One forgotten query is a cross-tenant leak. A Postgres policy doesn't forget.",
      },
      {
        h: "Inventory is a ledger; balance is a cache",
        p: "Movements are the source of truth and append-only. Current balance is derived. Any discrepancy becomes auditable back to its origin instead of unexplainable.",
      },
    ],
    capTag: "Capabilities",
    capTitle: "What I bring to the table",
    caps: [
      { h: "Frontend Architecture & Senior UX", i: ["Absolute mastery of UX/UI Patterns driving conversion", "Hypnotic interfaces crafted with top-tier Tailwind CSS", "Three.js and Canvas (Konva) for spatial immersion", "Client-side OCR (Tesseract) and heavy local processing", "Micro-interactions, Glassmorphism and native accessibility"] },
      { h: "Backend Engineering & High-Load Modeling", i: ["Flask, Django, Node.js and Edge Functions", "Advanced PostgreSQL — RLS, Triggers and pgcrypto", "Async queues (Celery, Redis) for frictionless checkout", "Architectural design focused on zero downtime", "Sentry Observability and immutable auditing"] },
      { h: "Quality, Testing & DevOps Culture", i: ["Massive load testing with k6 and deep telemetry", "State-of-the-art E2E testing with Playwright and Cypress", "Docker, CI/CD pipelines and safe incremental shipping", "Ultra-resilient PWA and Offline-First strategies", "Staging environments tailored for Product Owners"] },
      { h: "Data Intelligence & Commercial Domain", i: ["Predictive modeling and statistics (Pandas, Statsmodels)", "High-impact interactive dashboards (Plotly, Recharts)", "Payment management (Pix/Card with smart splitting)", "LGPD by design and fiscal compliance (NFC-e)", "Solutions built to sell, generate revenue and scale tenants"] },
    ],
    howTag: "Method",
    howTitle: "How I work",
    howLead: "No scope surprises, no price surprises. Everything we agree on is written down before the first line of code.",
    steps: [
      { h: "Process diagnosis", p: "Before talking technology, I map where money leaks, where someone retypes data and where errors are born. This step is free." },
      { h: "Scope, timeline, price", p: "A written proposal with what's in, what's out, validation milestones and payment terms. You approve before anything starts." },
      { h: "Weekly validation", p: "A dedicated staging environment and one visible milestone per week. You watch the system take shape rather than receiving a sealed box at the end." },
      { h: "Acceptance and warranty", p: "Team training, a signed acceptance document and 90 days of technical warranty covering everything in scope." },
    ],
    aboutTag: "Company",
    aboutTitle: "Maldivas Tech Solutions",
    aboutBody: [
      "I'm **Rafael Maldivas**, a fullstack software engineer focused on management systems and data analysis. Before I wrote code, I worked in sales — which is why I start with the process, not the stack. Software that ignores how an operation actually runs doesn't get used, however good the code is.",
      "**Maldivas Tech Solutions** is the formal structure behind that work: a registered Brazilian company with contracts, service invoicing and written liability terms. If you need a vendor your finance team can actually onboard, it exists.",
      "I take on **contracted B2B projects** as well as **fullstack roles**, remote in Brazil or internationally. Either way you get the same thing: a system that survives real operational load, and code the next person can maintain.",
    ],
    corp: "Company details",
    kv: [
      ["Legal name", "63.310.253 Renann H. P. D. da Silva"],
      ["Trade name", "Maldivas Tech Solutions"],
      ["Tax ID (CNPJ)", "63.310.253/0001-81"],
      ["Status", "Active"],
      ["Headquarters", "Guarulhos — SP, Brazil"],
      ["Invoicing", "Monthly service invoice (NFS-e)"],
      ["Technical lead", "Rafael Maldivas"],
    ],
    contactTitle: "Got an operation that needs a system?",
    contactLead: "The first conversation and the process diagnosis are free. If I'm not the best fit for your case, I'll tell you in the first meeting.",
    contactBtn: "Message on WhatsApp",
    contactAlt: "Connect on LinkedIn",
    contactEmail: "Send an email",
    contactFine: "Also available for fullstack roles — Brazil or international remote.",
    rights: "All rights reserved.",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Utilidades e Animações                                             */
/* ------------------------------------------------------------------ */

function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [lang, setLang] = useState<Lang>("pt");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const c = t[lang];

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* ---------- nav ---------- */}
      <nav className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand">
            <div className="brand-mark">M</div>
            <div className="brand-txt">
              <span className="brand-name">Maldivas Tech Solutions</span>
              <span className="brand-sub">Rafael Maldivas</span>
            </div>
          </a>
          <div className="nav-links">
            <a href="#produtos">{c.nav.products}</a>
            <a href="#engenharia">{c.nav.eng}</a>
            <a href="#metodo">{c.nav.how}</a>
            <a href="#empresa">{c.nav.about}</a>
            <a href="#contato">{c.nav.contact}</a>
          </div>
          <div className="nav-controls" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="lang" role="group" aria-label="Idioma">
              <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")} aria-pressed={lang === "pt"}>PT</button>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
            </div>
            
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                className="theme-btn"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ---------- hero ---------- */}
      <motion.header 
        className="hero relative overflow-hidden" 
        id="top"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="wrap relative z-10 flex flex-col justify-center min-h-[70vh]">
          <motion.div variants={fadeUp} className="hero-badge w-fit backdrop-blur-md bg-white/5 border border-white/10">
            <span className="dot" />{c.heroBadge}
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-[800px] text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight drop-shadow-2xl">
            {c.h1a}<br /><span className="hl">{c.h1b}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-lead text-xl md:text-2xl mt-6 max-w-[600px] text-slate-300 drop-shadow-md">{c.lead}</motion.p>
          <motion.p variants={fadeUp} className="hero-note max-w-[600px] mt-4 opacity-80">{rich(c.note)}</motion.p>

          <motion.div variants={fadeUp} className="cta-row mt-10">
            <a className="btn btn-primary shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)]" href="#produtos">{c.ctaWork} →</a>
            <a className="btn btn-ghost backdrop-blur-sm bg-white/5" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> {c.ctaTalk}
            </a>
            <a className="btn btn-ghost backdrop-blur-sm bg-white/5" href={GITHUB_USER} target="_blank" rel="noopener noreferrer">{c.ctaGh}</a>
          </motion.div>

          <motion.div variants={fadeUp} className="stats mt-16 max-w-[800px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
            {c.stats.map((s) => (
              <div className="stat" key={s.l}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* ---------- faixa de tecnologias ---------- */}
      <motion.div 
        className="marquee" 
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div className="marquee-track">
          {[...techs, ...techs].map((x, i) => (
            <div className="tech" key={i}>
              <img src={x.s} alt="" loading="lazy" />
              {x.n}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ---------- produtos ---------- */}
      <section id="produtos">
        <div className="wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="sec-tag">{c.prodTag}</div>
            <h2>{c.prodTitle}</h2>
            <p className="sec-lead">{c.prodLead}</p>
          </motion.div>

          <div className="products">
            {products.map((p, i) => {
              const Icon = p.icon;
              const effectType = p.name.includes("SelectSys") ? 'nodes' : p.name.includes("mercadinho") ? 'stream' : 'pulse';
              return (
                <motion.article 
                  className="product glass-card glow-hover"
                  style={{ position: 'relative', overflow: 'hidden' }}
                  key={p.name}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.03, rotateY: 2, rotateX: -1, zIndex: 10 }}
                >
                  <CardGraphics type={effectType} />
                  <div className="p-top" style={{ position: 'relative', zIndex: 10 }}>
                    <span className="p-icon" aria-hidden="true">
                      {typeof Icon === "string" ? (
                        <img src={`${Icon}?v=7`} alt="" style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 12, backgroundColor: "var(--bg-soft)", padding: 4, border: "1px solid var(--line)" }} />
                      ) : (
                        <Icon className="lucide-accent" size={32} />
                      )}
                    </span>
                    <div>
                      <h3 className="p-title">{p.name}</h3>
                      <div className="p-role">{p.role[lang]}</div>
                    </div>
                    <span className={`p-status ${p.status === "live" ? "st-live" : "st-deploy"}`}>
                      {p.statusLabel[lang]}
                    </span>
                  </div>

                  <p className="p-desc" style={{ position: 'relative', zIndex: 10 }}>{p.desc[lang]}</p>

                  <div className="p-grid" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="p-block glass-inner">
                      <h4>{c.lblProblem}</h4>
                      <p>{rich(p.problem[lang])}</p>
                    </div>
                    <div className="p-block glass-inner">
                      <h4>{c.lblSolution}</h4>
                      <p>{rich(p.solution[lang])}</p>
                    </div>
                  </div>

                  <div className="tags" style={{ position: 'relative', zIndex: 10 }}>
                    {p.tags.map((tg) => (
                      <motion.span className="tag" key={tg.l} whileHover={{ y: -2, scale: 1.05 }}>
                        {tg.s && <img src={tg.s} alt="" loading="lazy" />}
                        {tg.l}
                      </motion.span>
                    ))}
                  </div>

                  <div className="p-links" style={{ position: 'relative', zIndex: 10 }}>
                    {p.deepTech && (
                      <motion.button 
                        onClick={() => setSelectedProduct(p)}
                        className="plink solid flex items-center gap-2" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Server size={18} /> {lang === 'pt' ? 'Arquitetura e Engenharia' : 'Architecture & Engineering'}
                      </motion.button>
                    )}
                    {p.demo && (
                      <motion.a href={p.demo} target="_blank" rel="noopener noreferrer" className="plink" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {c.lblDemo} ↗
                      </motion.a>
                    )}
                    {p.repo ? (
                      <motion.a href={p.repo} target="_blank" rel="noopener noreferrer" className="plink" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {c.lblRepo} ↗
                      </motion.a>
                    ) : (
                      <span className="plink" style={{ opacity: 0.55, cursor: "default" }}>
                        {c.lblPrivate}
                      </span>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- engenharia ---------- */}
      <section id="engenharia">
        <div className="wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="sec-tag">{c.engTag}</div>
            <h2>{c.engTitle}</h2>
            <p className="sec-lead">{c.engLead}</p>
          </motion.div>
          <div className="eng">
            {c.eng.map((e, i) => (
              <motion.div 
                className="eng-card glass-card" 
                key={e.h}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="eng-n">0{i + 1}</div>
                <h3>{e.h}</h3>
                <p>{e.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- capacidades ---------- */}
      <section id="capacidades" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="sec-tag">{c.capTag}</div>
            <h2>{c.capTitle}</h2>
            <div style={{ height: 40 }} />
          </motion.div>
          <div className="caps">
            {c.caps.map((cap, i) => {
              const icons = [
                <Layout key="1" size={36} strokeWidth={1.5} />,
                <Server key="2" size={36} strokeWidth={1.5} />,
                <ShieldCheck key="3" size={36} strokeWidth={1.5} />,
                <LineChart key="4" size={36} strokeWidth={1.5} />
              ];
              return (
              <motion.div 
                className="cap-wrapper" 
                key={cap.h}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="cap-inner">
                  <div className="cap-front">
                    <div className="cap-icon-box">
                      {icons[i]}
                    </div>
                    <h3>{cap.h}</h3>
                    <div style={{ marginTop: 'auto', color: 'var(--accent)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}>
                      Hover to flip ⟳
                    </div>
                  </div>
                  <div className="cap-back">
                    <h3>{cap.h}</h3>
                    <ul>
                      {cap.i.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* ---------- método ---------- */}
      <section id="metodo">
        <div className="wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="sec-tag">{c.howTag}</div>
            <h2>{c.howTitle}</h2>
            <p className="sec-lead">{c.howLead}</p>
          </motion.div>
          <div className="steps">
            {c.steps.map((s, i) => (
              <motion.div 
                className="step glass-card" 
                key={s.h}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="step-n">{i + 1}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- empresa ---------- */}
      <section id="empresa">
        <div className="wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="sec-tag">{c.aboutTag}</div>
            <h2>{c.aboutTitle}</h2>
            <div style={{ height: 34 }} />
          </motion.div>
          <div className="about">
            <motion.div 
              className="about-body"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={fadeUp}
            >
              {c.aboutBody.map((p, i) => <p key={i}>{rich(p)}</p>)}
            </motion.div>
            <motion.aside 
              className="card-corp glass-card"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={fadeUp}
            >
              <h3>{c.corp}</h3>
              {c.kv.map(([k, v]) => (
                <div className="kv" key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ---------- contato ---------- */}
      <section id="contato">
        <div className="wrap">
          <motion.div 
            className="contact-box glass-card glow-hover"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeUp}
          >
            <h2>{c.contactTitle}</h2>
            <p>{c.contactLead}</p>
            <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
              <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> {c.contactBtn}
              </a>
              <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">{c.contactAlt}</a>
            </div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <a href={`mailto:${EMAIL}`} className="plink" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, border: "none", opacity: 0.8 }}>
                {c.contactEmail}
              </a>
            </div>
            <p className="contact-fine">
              {EMAIL}<br />
              Maldivas Tech Solutions · CNPJ 63.310.253/0001-81 · Guarulhos/SP<br />
              {c.contactFine}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------- rodapé ---------- */}
      <footer>
        <div className="wrap foot">
          <span>© {new Date().getFullYear()} Maldivas Tech Solutions. {c.rights}</span>
          <div className="foot-links">
            <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">Organização</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${EMAIL}`}>E-mail</a>
          </div>
        </div>
      </footer>
      <ArchitectureModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
        lang={lang} 
      />
    </>
  );
}
