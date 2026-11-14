/* ------------------------------------------------------------------ */
/*  JSON-LD / Schema.org — Grafo Oficial do Painel de Conhecimento     */
/*                                                                     */
/*  Um único @graph compartilhando @id estáveis. Conecta a entidade    */
/*  Organization (Maldivas Tech), Founder (Rafael Maldivas) e os       */
/*  produtos SaaS (MiseOn, MercadinhoSys, SelectSys Jobs).             */
/* ------------------------------------------------------------------ */

import {
  EMAIL,
  GITHUB_USER,
  GITHUB_ORG,
  LINKEDIN,
  SITE,
  YOUTUBE,
} from "./site";

const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const FOUNDER_ID = `${SITE}/#founder`;

/**
 * Grafo oficial da empresa Maldivas Tech para o Painel de Conhecimento
 * do Google e mecanismos de resposta generativa (GEO / Perplexity / Claude / ChatGPT).
 */
export const maldivasTechKnowledgeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: "Maldivas Tech",
      alternateName: "Maldivas Tech Solutions",
      url: SITE,
      logo: `${SITE}/logo-bimi.svg`,
      description:
        "Sistemas de gestão SaaS, arquitetura de software, presença digital e automação — do modelo de dados ao sistema em produção.",
      email: "suporte@maldivastech.dev",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Guarulhos",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      founder: {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: "Rafael Paiva Dias da Silva",
        alternateName: "Rafael Maldivas",
        jobTitle: "Founder, Product Owner & Systems Analyst",
        url: LINKEDIN,
        sameAs: [
          GITHUB_USER,
          LINKEDIN,
        ],
      },
      sameAs: [
        GITHUB_ORG,
        LINKEDIN,
        YOUTUBE,
        "https://www.instagram.com/miseon_system_food_service/",
        "https://miseon.app.br",
        "https://mercadinhosys.com.br",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: "Maldivas Tech",
      publisher: { "@id": ORG_ID },
      inLanguage: ["pt-BR", "en"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#product-miseon`,
      name: "MiseOn",
      description:
        "Sistema de Gestão para Food Service e Cozinhas Profissionais",
      url: "https://miseon.app.br",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: {
        "@id": ORG_ID,
      },
      provider: {
        "@id": ORG_ID,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#product-mercadinhosys`,
      name: "MercadinhoSys",
      description: "Sistema ERP Multi-tenant para Mercados e Varejo",
      url: "https://mercadinhosys.com.br",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: {
        "@id": ORG_ID,
      },
      provider: {
        "@id": ORG_ID,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#product-selectsys-jobs`,
      name: "SelectSys Jobs",
      description: "Plataforma ATS Trilíngue de Recrutamento e Seleção",
      url: "https://selectsys-job.vercel.app",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: {
        "@id": ORG_ID,
      },
      provider: {
        "@id": ORG_ID,
      },
    },
  ],
};

export function organizationSchema() {
  return maldivasTechKnowledgeGraph["@graph"][0];
}

export function websiteSchema() {
  return maldivasTechKnowledgeGraph["@graph"][1];
}

export function founderSchema() {
  return (maldivasTechKnowledgeGraph["@graph"][0] as any).founder;
}

/** Grafo completo para injetar no layout. */
export function siteGraph(_lang: "pt" | "en" = "pt") {
  return maldivasTechKnowledgeGraph;
}
