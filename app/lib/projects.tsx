import { Code2, Database, Server, ShieldCheck } from "lucide-react";
import { GITHUB_ORG, cdnIcon as ic } from "./site";

export type Product = {
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
  /** link de contratação — quando existe, o card vende em vez de só exibir */
  signup?: string;
  deepTech?: { pt: { id: string; icon: any; title: string; desc: React.ReactNode }[]; en: { id: string; icon: any; title: string; desc: React.ReactNode }[] };
};

export const products: Product[] = [
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
      { l: "WhatsApp Business API", s: "/icons/whatsapp.svg" },
      { l: "iFood Orders API", s: "/icons/ifood.svg" },
    ],
    repo: null,
    demo: "https://miseon.app.br",
    signup: "https://wa.me/5511919889233?text=Ola%20Rafael!%20Quero%20contratar%20o%20MiseOn%20para%20a%20minha%20cozinha.",
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
      { l: "Playwright E2E", s: "/icons/playwright.svg" },
      { l: "Tesseract OCR & PDF.js" },
      { l: "ExcelJS" },
      { l: "Zod + TanStack" },
      { l: "UX/UI Patterns" },
    ],
    repo: null,
    demo: "https://selectsys-jobs.vercel.app",
    signup: "https://wa.me/5511919889233?text=Ola%20Rafael!%20Quero%20conhecer%20o%20SelectSys%20Jobs%20para%20a%20minha%20agencia.",
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
    signup: "https://wa.me/5511919889233?text=Ola%20Rafael!%20Quero%20contratar%20o%20mercadinhosys%20para%20a%20minha%20loja.",
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
    signup: "https://wa.me/5511919889233?text=Ola%20Rafael!%20Quero%20montar%20um%20marketplace%20com%20o%20MySuperStore.",
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

/* ------------------------------------------------------------------ */
/*  Entregas e laboratórios — projetos menores, card leve             */
/* ------------------------------------------------------------------ */

export type Work = {
  name: string;
  client: { pt: string; en: string };
  kind: { pt: string; en: string };
  desc: { pt: string; en: string };
  proof: { pt: string; en: string };
  tags: string[];
  url: string;
};

export const works: Work[] = [
  {
    name: "Espaço Eli Trassi",
    client: { pt: "Cliente real · Salão de beleza", en: "Real client · Beauty salon" },
    kind: { pt: "Agendamento online + PWA", en: "Online booking + PWA" },
    desc: {
      pt: "Site de captação com agendamento próprio, catálogo de serviços, galeria de trabalhos e instalação como aplicativo no celular da cliente.",
      en: "Lead-capture site with its own booking engine, service catalogue, work gallery and install-as-app on the client's phone.",
    },
    proof: {
      pt: "Substituiu a agenda de papel e o vai-e-vem de WhatsApp para marcar horário.",
      en: "Replaced the paper diary and the WhatsApp back-and-forth to book a slot.",
    },
    tags: ["React", "PWA instalável", "Agendamento", "SEO local"],
    url: "https://agenda-sal-o-de-beleza.vercel.app",
  },
  {
    name: "Animaz Pet Center · BI",
    client: { pt: "Cliente real · Pet shop", en: "Real client · Pet shop" },
    kind: { pt: "Relatório analítico / Data Science", en: "Analytics report / Data Science" },
    desc: {
      pt: "Pipeline que ingere três bases do cliente e monta o relatório completo: faturamento contra meta, ruptura de estoque e funil de atendimento por vendedor.",
      en: "Pipeline that ingests three client datasets and assembles the full report: revenue vs. target, stockouts and per-seller service funnel.",
    },
    proof: {
      pt: "O dono passou a enxergar ruptura de estoque antes de perder a venda.",
      en: "The owner started seeing stockouts before losing the sale.",
    },
    tags: ["Ingestão de dados", "Faturamento × meta", "Ruptura de estoque", "Funil"],
    url: "https://ecommerce-analisys.vercel.app",
  },
  {
    name: "Animaz Pet Shop",
    client: { pt: "Cliente real · Pet shop", en: "Real client · Pet shop" },
    kind: { pt: "Catálogo e-commerce sazonal", en: "Seasonal e-commerce catalogue" },
    desc: {
      pt: "Vitrine com carrinho, grade de tamanhos, filtro por categoria, ordenação por preço e regra de combo promocional aplicada automaticamente no total.",
      en: "Storefront with cart, size grid, category filters, price sorting and a promotional bundle rule applied automatically at checkout.",
    },
    proof: {
      pt: "Campanha de coleção no ar em dias, sem plataforma paga por trás.",
      en: "A seasonal collection campaign live in days, with no paid platform behind it.",
    },
    tags: ["Carrinho", "Variações de produto", "Regra de combo", "Campanha sazonal"],
    url: "https://animaz-glassdoor.vercel.app",
  },
  {
    name: "Mise App",
    client: { pt: "Produto próprio · Food service", en: "Own product · Food service" },
    kind: { pt: "Inteligência financeira de cozinha", en: "Kitchen financial intelligence" },
    desc: {
      pt: "Aplicativo de ficha técnica e precificação para cozinha profissional, com login social e leitura de custo por prato. É a origem do que virou o MiseOn.",
      en: "Recipe-costing and pricing app for professional kitchens, with social login and per-dish cost readout. It's the seed of what became MiseOn.",
    },
    proof: {
      pt: "Protótipo que validou a tese de margem antes de existir o SaaS.",
      en: "The prototype that validated the margin thesis before the SaaS existed.",
    },
    tags: ["React / Vite", "Gemini API", "Recharts", "PWA"],
    url: "https://mise-app-gest-o-de-cozinha.vercel.app",
  },
];
