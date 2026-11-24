/* ------------------------------------------------------------------ */
/*  JSON-LD / Schema.org — Grafo Oficial do Painel de Conhecimento     */
/*                                                                     */
/*  Um único @graph compartilhando @id estáveis. Conecta a entidade    */
/*  Organization (Maldivas Tech), Founder (Rafael Maldivas) e os       */
/*  produtos SaaS (MiseOn, MercadinhoSys, SelectSys Jobs).             */
/* ------------------------------------------------------------------ */

import {
  COMPANY,
  EMAIL,
  GITHUB_USER,
  GITHUB_ORG,
  LINKEDIN,
  SERVICE_AREAS,
  SITE,
  YOUTUBE,
} from "./site";
import { ORACLE_CERT } from "./credentials";

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
      name: COMPANY.tradeName,
      legalName: COMPANY.legalName,
      alternateName: "Maldivas Tech Solutions",
      taxID: COMPANY.cnpj,
      foundingDate: COMPANY.since,
      url: SITE,
      logo: `${SITE}/logo-bimi.svg`,
      description:
        "Sistemas de gestão SaaS, arquitetura de software, presença digital e automação — do modelo de dados ao sistema em produção.",
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: COMPANY.street,
        addressLocality: COMPANY.city,
        addressRegion: COMPANY.region,
        postalCode: COMPANY.postalCode,
        addressCountry: COMPANY.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: COMPANY.lat,
        longitude: COMPANY.lng,
      },
      areaServed: [
        ...SERVICE_AREAS.map((city) => ({ "@type": "City", name: city })),
        { "@type": "Country", name: "Brazil" },
        "Remote / Worldwide",
      ],
      founder: {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: "Rafael Paiva Dias da Silva",
        alternateName: "Rafael Maldivas",
        jobTitle: "Founder, Product Owner & Systems Analyst",
        url: LINKEDIN,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: `${ORACLE_CERT.issuer} — ${ORACLE_CERT.name}`,
          credentialCategory: "certification",
          recognizedBy: {
            "@type": "Organization",
            name: ORACLE_CERT.issuer,
          },
          url: ORACLE_CERT.verifyUrl,
        },
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
        "https://connect.maldivastech.dev",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: COMPANY.tradeName,
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
      url: "https://selectsys-jobs.vercel.app",
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
      "@id": `${SITE}/#product-atol-connect`,
      name: "Atol Connect",
      description:
        "Plataforma multi-tenant sobre a WhatsApp Business Platform (Cloud API da Meta): Embedded Signup, caixa de entrada em equipe, modelos, REST API e webhooks assinados.",
      url: "https://connect.maldivastech.dev",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "WhatsAppBusinessPlatformCloudAPI",
      operatingSystem: "Web",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BRL",
        lowPrice: "79.00",
        highPrice: "499.00",
        offerCount: 3,
      },
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
  return (maldivasTechKnowledgeGraph["@graph"][0] as { founder: unknown }).founder;
}

/** Grafo completo para injetar no layout. */
export function siteGraph(_lang: "pt" | "en" = "pt") {
  return maldivasTechKnowledgeGraph;
}
