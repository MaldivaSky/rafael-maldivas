/* ------------------------------------------------------------------ */
/*  Catálogo de produtos SaaS + metadados otimizados por INTENÇÃO      */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";

export type ProductSlug = "miseon" | "mercadinhosys" | "selectsys-jobs" | "atol-connect";

export type ProductCopy = {
  /** use no <title> — frase de busca real do mercado daquele idioma */
  metaTitle: string;
  /** meta description orientada a dor + promessa, 150–160 chars */
  metaDescription: string;
  /** H1 da landing */
  h1: string;
  /** uma frase, para JSON-LD e cards */
  tagline: string;
  /** palavras-chave por intenção (não por tradução) */
  keywords: string[];
};

export type Product = {
  slug: ProductSlug;
  /** nome comercial, igual em todo idioma */
  name: string;
  /** logo quadrada do app */
  icon?: string;
  /** logo horizontal do produto (path público) */
  logoHorizontal?: string;
  /** imagem showcase / arquitetura */
  showcaseImage?: string;
  /** domain do app em produção (mesmo host externo, se houver) */
  appUrl?: string;
  /** categoria Schema.org (applicationCategory) */
  applicationCategory: string;
  /** subcategoria Schema.org (applicationSubCategory) */
  applicationSubCategory: string;
  /** preço mensal BRL — "0" representa plano gratuito/sob consulta */
  priceBRL: string;
  priceCurrency: "BRL" | "USD";
  /** oferta com trial? */
  hasFreeTrial: boolean;
  /** dias de teste grátis exibidos na página do produto */
  trialDays: number;
  /** technologies usadas (para llms.txt e knowsAbout) */
  stack: string[];
  copy: Record<Lang, ProductCopy>;
};

/**
 * IMPORTANTE: as metas abaixo NÃO são traduções entre si.
 * pt ataca "sistema para restaurante", en ataca "restaurant SaaS".
 * É assim que se cobre duas SERPs distintas com a mesma entidade.
 */
export const PRODUCTS: Record<ProductSlug, Product> = {
  miseon: {
    slug: "miseon",
    name: "MiseOn",
    icon: "/logo-miseon.png",
    logoHorizontal: "/logo-horiz-miseon.png",
    appUrl: "https://miseon.app.br",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "RestaurantManagementSystem",
    priceBRL: "149.90",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    trialDays: 30,
    stack: ["Next.js", "PostgreSQL", "Row Level Security", "NFC-e", "iFood API", "Bravus Core POS"],
    copy: {
      pt: {
        metaTitle: "Sistema de Gestão para Restaurantes e Cozinhas Profissionais",
        metaDescription:
          "MiseOn é o sistema de gestão para restaurantes: ficha técnica, precificação, controle de estoque e integração com iFood. Emita NFC-e no PDV e elimine a planilha paralela.",
        h1: "O sistema de gestão que a sua cozinha usa todo dia",
        tagline:
          "Gestão multi-tenant para restaurantes em produção (miseon.app.br): ficha técnica, precificação, estoque e NFC-e em um só lugar.",
        keywords: [
          "sistema para restaurantes",
          "software de gestão de restaurante",
          "sistema de ficha técnica de restaurante",
          "precificação de menu",
          "PDV fiscal NFC-e restaurante",
          "integração iFood sistema",
        ],
      },
      en: {
        metaTitle: "Multi-tenant Restaurant SaaS for Professional Kitchens",
        metaDescription:
          "MiseOn is a multi-tenant restaurant SaaS: recipe costing, menu pricing, inventory control and iFood integration. Run fiscal receipts at the POS and drop the side spreadsheet.",
        h1: "The multi-tenant restaurant SaaS your kitchen runs on",
        tagline:
          "Multi-tenant restaurant SaaS in production (miseon.app.br): recipe costing, menu pricing, inventory and fiscal POS — in one place.",
        keywords: [
          "multi-tenant restaurant SaaS",
          "restaurant management software",
          "recipe costing software",
          "menu pricing software",
          "restaurant POS software",
          "iFood integration API",
        ],
      },
    },
  },

  mercadinhosys: {
    slug: "mercadinhosys",
    name: "MercadinhoSys",
    icon: "/logo-mercadinhosys.png",
    logoHorizontal: "/logo-horiz-mercadinhosys.png",
    showcaseImage: "/media/mercadinhosys-flagship.jpg",
    appUrl: "https://mercadinhosys.com.br",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "RetailERPAndPOS",
    priceBRL: "199.90",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    trialDays: 14,
    stack: [
      "Python / Flask",
      "PostgreSQL",
      "NFC-e SEFAZ",
      "Pandas & Statsmodels",
      "Plotly BI",
      "Redis",
      "Sentry",
    ],
    copy: {
      pt: {
        metaTitle: "MercadinhoSys — sistema com IA para mercadinho e varejo",
        metaDescription:
          "MercadinhoSys (mercadinhosys.com.br) é a plataforma validada no varejo, com novas implantações em andamento: ERP com PDV fiscal NFC-e, entrada automática de XML, estoque transacional e BI Curva ABC, RFM e DRE.",
        h1: "O ERP e PDV fiscal em operação real que elimina furo de caixa e ruptura",
        tagline:
          "Domínio próprio (mercadinhosys.com.br), validado no varejo: PDV NFC-e, importação XML, estoque transacional e BI (Curva ABC, RFM e DRE).",
        keywords: [
          "sistema ERP para mercadinho e varejo",
          "PDV fiscal NFC-e online",
          "controle de estoque curva ABC",
          "entrada de nota fiscal XML estoque",
          "mercadinhosys.com.br",
          "software de gestão para supermercados",
        ],
      },
      en: {
        metaTitle: "MercadinhoSys — AI retail system with fiscal POS",
        metaDescription:
          "MercadinhoSys (mercadinhosys.com.br) is a retail-validated platform with new rollouts in progress: fiscal NFC-e POS, automated invoice XML ingestion, transactional inventory and ABC/RFM BI.",
        h1: "Live retail ERP & fiscal POS built to stop stockouts and margin leaks",
        tagline:
          "Custom domain (mercadinhosys.com.br) validated in retail: fiscal POS, XML intake, transactional inventory and commercial BI.",
        keywords: [
          "retail ERP software",
          "multi-tenant POS system",
          "ABC curve inventory analytics",
          "RFM retail analytics",
          "mercadinhosys.com.br",
        ],
      },
    },
  },

  "selectsys-jobs": {
    slug: "selectsys-jobs",
    name: "SelectSys Jobs",
    icon: "/logo-selectsys.png",
    logoHorizontal: "/logo-horiz-selectsys.png",
    showcaseImage: "/media/selectsys-flagship.jpg",
    appUrl: "https://selectsys-jobs.vercel.app",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ApplicantTrackingSystem",
    priceBRL: "399.00",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    trialDays: 7,
    stack: ["React 19", "PostgreSQL", "Row Level Security", "Tesseract OCR", "ExcelJS", "LGPD"],
    copy: {
      pt: {
        metaTitle: "ATS para Agências de Recrutamento e Seleção",
        metaDescription:
          "SelectSys Jobs é o ATS para agências: pipeline de vagas, triagem por competência e contrato Brasil–Japão. Centralize candidatos, entrevistas e relatórios com LGPD.",
        h1: "O ATS que organiza a sua agência de recrutamento",
        tagline:
          "Applicant Tracking System para agências de recrutamento: vagas, candidatos e triagem em um pipeline único.",
        keywords: [
          "ATS para agências",
          "software de recrutamento e seleção",
          "sistema para agência de emprego",
          "applicant tracking system",
          "triagem de candidatos",
          "recrutamento Brasil Japão",
        ],
      },
      en: {
        metaTitle: "ATS for Recruitment Agencies and Staffing Teams",
        metaDescription:
          "SelectSys Jobs is an ATS for recruitment agencies: job pipelines, skill-based screening and cross-border hiring. Centralise candidates, interviews and GDPR/LGPD reports.",
        h1: "The ATS that runs your recruitment agency",
        tagline:
          "Applicant Tracking System for recruitment agencies: jobs, candidates and screening in one pipeline.",
        keywords: [
          "ATS for recruitment agencies",
          "applicant tracking system",
          "staffing agency software",
          "recruitment software",
          "candidate screening software",
          "cross-border hiring software",
        ],
      },
    },
  },

  "atol-connect": {
    slug: "atol-connect",
    name: "Atol Connect",
    icon: "/logo-atol-connect.png",
    appUrl: "https://connect.maldivastech.dev",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "WhatsAppBusinessPlatformCloudAPI",
    priceBRL: "79.00",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    trialDays: 14,
    stack: ["Next.js", "Supabase PostgreSQL", "Row Level Security", "WhatsApp Cloud API", "Embedded Signup", "OpenAPI 3.1", "Webhooks HMAC"],
    copy: {
      pt: {
        metaTitle: "API Oficial do WhatsApp Business: Atol Connect (Cloud API)",
        metaDescription:
          "Atol Connect: plataforma multi-tenant sobre a API oficial do WhatsApp (Cloud API da Meta). Conecte seu número em minutos, atenda em equipe e integre ERP ou PDV por REST e webhooks.",
        h1: "API oficial do WhatsApp Business, sem taxa extra por mensagem",
        tagline:
          "Plataforma multi-tenant sobre a WhatsApp Cloud API da Meta: Embedded Signup, caixa de entrada em equipe, modelos, REST API e webhooks assinados. Planos a partir de R$ 79/mês.",
        keywords: [
          "API oficial do WhatsApp",
          "WhatsApp Business API Brasil",
          "WhatsApp Cloud API",
          "integrar WhatsApp com ERP",
          "API WhatsApp para software house",
          "caixa de entrada WhatsApp em equipe",
        ],
      },
      en: {
        metaTitle: "Official WhatsApp Business API Platform: Atol Connect (Cloud API)",
        metaDescription:
          "Atol Connect is a multi-tenant platform on Meta's official WhatsApp Cloud API: Embedded Signup onboarding, team inbox, templates, REST API and signed webhooks for Brazilian businesses.",
        h1: "The official WhatsApp Business API with no per-message markup",
        tagline:
          "Multi-tenant platform on Meta's WhatsApp Cloud API: Embedded Signup, shared team inbox, templates, REST API and signed webhooks. Plans from BRL 79/month.",
        keywords: [
          "official WhatsApp Business API",
          "WhatsApp Cloud API platform",
          "WhatsApp Embedded Signup",
          "WhatsApp API for ERP integration",
          "multi-tenant WhatsApp API",
          "WhatsApp API Brazil",
        ],
      },
    },
  },
};

export const productList = Object.values(PRODUCTS);
