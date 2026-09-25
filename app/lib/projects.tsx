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
      pt: "Sistema para restaurantes, com pedidos, estoque, atendimento e integrações de delivery. Desenvolvo as telas e a estrutura de dados, incluindo recursos visuais com Three.js e Konva.",
      en: "Restaurant software for orders, stock, service and delivery integrations. I develop the interface and data structure, including visual features with Three.js and Konva.",
    },
    problem: {
      pt: "Pedidos chegam de diferentes canais, enquanto estoque e atendimento precisam acompanhar a mesma operação.",
      en: "Orders arrive through different channels while stock and service need to stay coordinated.",
    },
    solution: {
      pt: "Pedidos e movimentações reunidos no sistema, com controle de estoque **PEPS**, permissões por empresa e integrações com iFood e WhatsApp.",
      en: "Orders and stock movements in one system, with **FIFO inventory**, company access controls and integrations with iFood and WhatsApp.",
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
          title: "Pedidos e conexão",
          desc: <p>IndexedDB e Service Workers dão suporte aos recursos locais da PWA. O trabalho envolve acompanhar a sincronização dos pedidos e tratar o retorno da conexão.</p>
        },
        {
          id: "spatial",
          icon: Server,
          title: "Salão com Three.js e Konva",
          desc: <p>Three.js e Konva são usados nos recursos visuais de layout do salão. A ideia é permitir que a equipe trabalhe com a posição e a situação das mesas.</p>
        },
        {
          id: "k6",
          icon: ShieldCheck,
          title: "Testes com k6",
          desc: <p>Testes de carga ajudam a avaliar o comportamento dos fluxos de pedidos e fechamento. Os resultados dependem do cenário, do ambiente e da configuração testada.</p>
        }
      ],
      en: [
        {
          id: "offline",
          icon: Code2,
          title: "Orders and connectivity",
          desc: <p>IndexedDB and Service Workers support local PWA features. The work includes tracking order synchronisation and handling reconnection.</p>
        },
        {
          id: "spatial",
          icon: Server,
          title: "Floor layout with Three.js and Konva",
          desc: <p>Three.js and Konva support visual floor layout features, allowing staff to work with table positions and status.</p>
        },
        {
          id: "k6",
          icon: ShieldCheck,
          title: "Testing with k6",
          desc: <p>Load tests help assess ordering and checkout flows. Results depend on the scenario, environment and configuration under test.</p>
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
      pt: "Sistema de recrutamento para uma agência que trabalha entre Brasil e Japão. Cadastro de candidatos, organização de documentos e exportação de informações fazem parte do projeto.",
      en: "Recruitment software for an agency working between Brazil and Japan, including candidate records, document organisation and data exports.",
    },
    problem: {
      pt: "A equipe precisa reunir informações e documentos dos candidatos e preparar os formulários usados no processo de recrutamento.",
      en: "The team needs to collect candidate information and documents and prepare the forms used in recruitment.",
    },
    solution: {
      pt: "Cadastro bilíngue, leitura de documentos com **Tesseract.js e PDF.js** e exportação para planilhas. O projeto reúne o preenchimento pelo candidato e o acompanhamento pela agência.",
      en: "Bilingual forms, document reading with **Tesseract.js and PDF.js**, and spreadsheet exports. The project connects candidate registration with agency follow-up.",
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
          title: "Organização dos candidatos",
          desc: <p>O cadastro reúne informações para apoiar a análise da agência. Critérios de seleção e decisões sobre documentação precisam ser conferidos pela equipe responsável.</p>
        },
        {
          id: "export",
          icon: Code2,
          title: "Exportação para planilhas",
          desc: <p>O projeto trabalha com ExcelJS e rotinas Python com xlrd e xlutils para preencher modelos de planilha usados pela agência. Preservar o formato de saída faz parte da entrega.</p>
        },
        {
          id: "ai_proxy",
          icon: Code2,
          title: "Apoio à escrita e tradução",
          desc: <p>Integração com DeepSeek por Edge Functions para apoiar resumos e traduções. O conteúdo gerado precisa de revisão antes de ser usado pela agência.</p>
        },
        {
          id: "async",
          icon: Database,
          title: "Processamento em filas",
          desc: <p>Tarefas como geração de arquivos e envio de mensagens podem levar mais tempo. Filas e workers permitem acompanhar esse processamento sem mantê-lo preso à requisição da tela.</p>
        },
        {
          id: "rls",
          icon: ShieldCheck,
          title: "Permissões no PostgreSQL",
          desc: <p>Políticas de Row Level Security e registros de alteração ajudam a controlar o acesso aos dados de cada empresa. Esse controle exige configuração e testes para os diferentes perfis.</p>
        },
        {
          id: "backup",
          icon: ShieldCheck,
          title: "Backup e validação",
          desc: <p>Rotinas de backup e restauração em PowerShell, além de testes com Playwright no fluxo de desenvolvimento. O objetivo é conferir mudanças e manter um caminho de recuperação.</p>
        }
      ],
      en: [
        {
          id: "match",
          icon: Server,
          title: "Candidate organisation",
          desc: <p>Candidate records bring information together for agency review. Selection criteria and document decisions need verification by the responsible team.</p>
        },
        {
          id: "export",
          icon: Code2,
          title: "Spreadsheet exports",
          desc: <p>The project uses ExcelJS and Python routines with xlrd and xlutils to fill spreadsheet templates used by the agency. Preserving the output format is part of the work.</p>
        },
        {
          id: "ai_proxy",
          icon: Code2,
          title: "Writing and translation support",
          desc: <p>DeepSeek integration through Edge Functions supports summaries and translations. Generated content needs review before agency use.</p>
        },
        {
          id: "async",
          icon: Database,
          title: "Queued processing",
          desc: <p>File generation and messaging can take time. Queues and workers allow processing to be tracked separately from the interface request.</p>
        },
        {
          id: "rls",
          icon: ShieldCheck,
          title: "PostgreSQL permissions",
          desc: <p>Row Level Security policies and change records help control access to each company’s data. These controls require configuration and testing for different roles.</p>
        },
        {
          id: "backup",
          icon: ShieldCheck,
          title: "Backup and validation",
          desc: <p>PowerShell backup and restore routines, alongside Playwright tests in the development workflow, help validate changes and maintain a recovery path.</p>
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
      pt: "ERP para varejo com vendas, estoque e análise de dados. Uso Python e Flask no backend e bibliotecas de análise para organizar indicadores da operação.",
      en: "Retail ERP for sales, stock and data analysis. I use Python and Flask on the backend and analysis libraries to organise business indicators.",
    },
    problem: {
      pt: "Conferir vendas, estoque e compras em lugares separados dificulta entender o que está acontecendo na loja.",
      en: "Checking sales, stock and purchases in separate places makes it harder to understand what is happening in the store.",
    },
    solution: {
      pt: "Registro das movimentações e relatórios com **Pandas, Statsmodels e Plotly**, incluindo Curva ABC e análise RFM. O Sentry apoia a investigação de erros.",
      en: "Movement records and reporting with **Pandas, Statsmodels and Plotly**, including ABC and RFM analysis. Sentry helps investigate errors.",
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
          title: "Histórico de estoque",
          desc: <p>Entradas e saídas ficam registradas no PostgreSQL. Esse histórico permite conferir a formação do saldo e investigar divergências de estoque.</p>
        },
        {
          id: "pandas",
          icon: Server,
          title: "Análise com Pandas e Statsmodels",
          desc: <p>Organização dos dados em Python para análises de vendas, Curva ABC, RFM e séries temporais. São recursos para apoiar a leitura do negócio e o planejamento de compras.</p>
        },
        {
          id: "dashboards",
          icon: Code2,
          title: "Visualização com Plotly",
          desc: <p>Gráficos interativos apresentam os indicadores de vendas e estoque. O foco é permitir comparar períodos e explorar os dados com mais facilidade.</p>
        },
        {
          id: "observability",
          icon: ShieldCheck,
          title: "Investigação com Sentry",
          desc: <p>O Sentry reúne registros de erro para ajudar a reproduzir problemas e localizar suas causas durante a manutenção.</p>
        }
      ],
      en: [
        {
          id: "ledger",
          icon: Database,
          title: "Stock movement history",
          desc: <p>Stock entries and exits are recorded in PostgreSQL, allowing balances to be checked and discrepancies investigated.</p>
        },
        {
          id: "pandas",
          icon: Server,
          title: "Analysis with Pandas and Statsmodels",
          desc: <p>Python data processing supports sales analysis, ABC classification, RFM and time series, helping users understand the business and plan purchases.</p>
        },
        {
          id: "dashboards",
          icon: Code2,
          title: "Visualisation with Plotly",
          desc: <p>Interactive charts display sales and stock indicators, helping users compare periods and explore the data.</p>
        },
        {
          id: "observability",
          icon: ShieldCheck,
          title: "Investigation with Sentry",
          desc: <p>Sentry collects error reports to help reproduce problems and locate their causes during maintenance.</p>
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
      pt: "Uma loja com vários vendedores precisa organizar o catálogo, calcular frete e acompanhar a divisão dos pagamentos.",
      en: "A multi-seller store needs to organise its catalogue, calculate shipping and track payment splits.",
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
          desc: <p>Integrações de pagamento com Efí Bank e Stripe fazem parte do projeto. O split permite distribuir os valores entre plataforma e vendedores conforme as regras configuradas.</p>
        },
        {
          id: "celery",
          icon: Database,
          title: "Processamento Distribuído (Celery + Redis)",
          desc: <p>Celery e Redis dão suporte ao processamento de tarefas em segundo plano no backend Django. A loja pode acompanhar o andamento sem esperar toda a execução na mesma requisição.</p>
        },
        {
          id: "headless",
          icon: Code2,
          title: "Loja com Next.js e Django",
          desc: <p>O Next.js apresenta o catálogo e se comunica com a API em Django. A separação permite trabalhar na experiência da loja e nas regras de negócio de forma independente.</p>
        }
      ],
      en: [
        {
          id: "split",
          icon: Server,
          title: "Automatic Revenue Split",
          desc: <p>The project includes payment integrations with Efí Bank and Stripe. Payment splitting distributes amounts between the platform and sellers according to configured rules.</p>
        },
        {
          id: "celery",
          icon: Database,
          title: "Distributed Processing (Celery + Redis)",
          desc: <p>Celery and Redis support background tasks in the Django backend. The storefront can track progress without waiting for all processing in the same request.</p>
        },
        {
          id: "headless",
          icon: Code2,
          title: "Storefront with Next.js and Django",
          desc: <p>Next.js presents the catalogue and communicates with the Django API. This separation allows the storefront and business rules to evolve independently.</p>
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
    name: "SelectSys Jobs",
    client: { pt: "Fujiarte Co., Ltd.", en: "Fujiarte Co., Ltd." },
    kind: { pt: "ATS Bilíngue Brasil-Japão", en: "Bilingual ATS Brazil-Japan" },
    desc: {
      pt: "Plataforma de recrutamento para digitalizar a operação internacional da agência, garantindo compliance, controle de documentos (OCR) e exportação em Excel.",
      en: "Recruitment platform to digitalise the agency's international operation, ensuring compliance, document control (OCR) and Excel exports.",
    },
    proof: {
      pt: "Substituiu o vai-e-vem de emails e planilhas paralelas, reduzindo o tempo de triagem manual em 60%.",
      en: "Replaced back-and-forth emails and spreadsheets, cutting manual screening time by 60%.",
    },
    tags: ["Tesseract OCR", "ExcelJS", "LGPD", "ATS"],
    url: "https://selectsys-jobs.vercel.app",
  },
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
