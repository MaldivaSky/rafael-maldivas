/* ------------------------------------------------------------------ */
/*  Catálogo de produtos SaaS + metadados otimizados por INTENÇÃO      */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";

export type ProductSlug = "miseon" | "selectsys-jobs";

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
  ratingValue: number;
  reviewCount: number;
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
    appUrl: "https://miseon.app.br",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "RestaurantManagementSystem",
    priceBRL: "299.00",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    ratingValue: 4.8,
    reviewCount: 37,
    stack: ["Next.js", "PostgreSQL", "Row Level Security", "NFC-e", "iFood API"],
    copy: {
      pt: {
        metaTitle: "Sistema de Gestão para Restaurantes e Cozinhas Profissionais",
        metaDescription:
          "MiseOn é o sistema de gestão para restaurantes: ficha técnica, precificação, controle de estoque e integração com iFood. Emita NFC-e no PDV e elimine a planilha paralela.",
        h1: "O sistema de gestão que a sua cozinha usa todo dia",
        tagline:
          "Gestão multi-tenant para restaurantes: ficha técnica, precificação, estoque e NFC-e em um só lugar.",
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
          "Multi-tenant restaurant SaaS for recipe costing, menu pricing, inventory and fiscal POS — in one place.",
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

  "selectsys-jobs": {
    slug: "selectsys-jobs",
    name: "SelectSys Jobs",
    appUrl: undefined,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ApplicantTrackingSystem",
    priceBRL: "399.00",
    priceCurrency: "BRL",
    hasFreeTrial: true,
    ratingValue: 4.7,
    reviewCount: 21,
    stack: ["Next.js", "PostgreSQL", "Postgres Full-Text Search", "LGPD"],
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
};

export const productList = Object.values(PRODUCTS);
