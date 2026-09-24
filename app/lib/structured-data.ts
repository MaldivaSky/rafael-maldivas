/* ------------------------------------------------------------------ */
/*  JSON-LD / Schema.org — Organization (Geo-SEO) + SoftwareApplication */
/*                                                                     */
/*  Um único @graph compartilhando @id estáveis. Assim o Google e as   */
/*  LLMs entendem "MiseOn é um produto da Maldivas Tech, sediada em    */
/*  São Paulo, com atuação global".                                     */
/* ------------------------------------------------------------------ */

import {
  COMPANY,
  EMAIL,
  GITHUB_USER,
  LINKEDIN,
  PHONE_E164,
  SITE,
  YOUTUBE,
} from "./site";
import { PRODUCTS, productList, type ProductSlug } from "./products";

const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const PERSON_ID = `${SITE}/#founder`;

/** Estabelece São Paulo/BR como sede, mas declara atuação global (software). */
export function organizationSchema() {
  return {
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: COMPANY.tradeName,
    legalName: COMPANY.legalName,
    alternateName: ["Maldivas Tech", "maldivastech.dev"],
    taxID: COMPANY.cnpj,
    vatID: COMPANY.cnpj,
    foundingDate: COMPANY.since,
    url: SITE,
    // relação explícita marca ↔ novo domínio (GEO: LLMs validam legitimidade)
    mainEntityOfPage: SITE,
    sameAs: [
      GITHUB_USER,
      "https://github.com/maldivas-tech",
      LINKEDIN,
      YOUTUBE,
    ],
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE}/#logo`,
      url: `${SITE}/brand/logo-mark.png`,
      contentUrl: `${SITE}/brand/logo-mark.png`,
    },
    image: `${SITE}/opengraph-image.png`,
    email: EMAIL,
    telephone: PHONE_E164,
    founder: { "@id": PERSON_ID },
    // Endereço + geo: ancora a entidade no território (Geo-SEO)
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
    // HQ é São Paulo, mas o software serve o mundo — sinal importante
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
      { "@type": "Country", name: "Japão" },
      { "@type": "Place", name: "Worldwide" },
    ],
    knowsLanguage: ["pt-BR", "en", "es"],
    availableLanguage: ["pt-BR", "en", "es"],
    priceRange: "$$",
    slogan: "Tecnologia que a operação usa todo dia",
    description:
      "Maldivas Tech desenvolve sistemas de gestão e SaaS multi-tenant. Produtos próprios: MiseOn (gestão para restaurantes) e SelectSys Jobs (ATS para agências). Sede em São Paulo, atuação global.",
    makesOffer: productList.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@id": `${SITE}/#product-${p.slug}` },
    })),
    subjectOf: [
      { "@type": "WebPage", url: `${SITE}/pt/produtos` },
      { "@type": "WebPage", url: `${SITE}/en/produtos` },
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE,
    name: COMPANY.tradeName,
    publisher: { "@id": ORG_ID },
    inLanguage: ["pt-BR", "en"],
  };
}

export function founderSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Rafael Maldivas",
    alternateName: "Rafael Paiva Dias da Silva",
    jobTitle:
      "Engenheiro de Software Fullstack, Especialista em UX e Gestor de Projetos",
    worksFor: { "@id": ORG_ID },
    url: SITE,
    email: EMAIL,
    sameAs: [LINKEDIN, GITHUB_USER],
    knowsAbout: [
      "PostgreSQL",
      "Row Level Security",
      "TypeScript",
      "Next.js",
      "React",
      "SaaS multi-tenant",
      "Applicant Tracking Systems",
      "Restaurant Management Software",
    ],
  };
}

/**
 * SoftwareApplication para cada produto SaaS.
 * `aggregateRating` + `offers` habilitam Rich Snippets (estrelas + preço).
 */
export function productSchema(slug: ProductSlug, lang: "pt" | "en" = "pt") {
  const p = PRODUCTS[slug];
  const copy = p.copy[lang];

  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#product-${slug}`,
    name: p.name,
    applicationCategory: p.applicationCategory,
    applicationSubCategory: p.applicationSubCategory,
    operatingSystem: "Web",
    url: p.appUrl ?? `${SITE}/${lang}/produtos/${slug}`,
    description: copy.tagline,
    inLanguage: ["pt-BR", "en"],
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    // Modelo de precificação SaaS — mensal, BRL, com trial
    offers: {
      "@type": "Offer",
      price: p.priceBRL,
      priceCurrency: p.priceCurrency,
      category: "SaaS",
      availability: "https://schema.org/InStock",
      url: p.appUrl ?? `${SITE}/${lang}/produtos/${slug}`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.priceBRL,
        priceCurrency: p.priceCurrency,
        unitText: "MONTH",
        billingIncrement: 1,
        valueAddedTaxIncluded: true,
      },
      ...(p.hasFreeTrial
        ? {
            eligibleQuantity: {
              "@type": "QuantitativeValue",
              value: 14,
              unitText: "DAY",
            },
          }
        : {}),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.ratingValue,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    featureList: copy.keywords,
  };
}

/** Grafo completo para injetar em um Server Component. */
export function siteGraph(lang: "pt" | "en" = "pt") {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      founderSchema(),
      ...productList.map((p) => productSchema(p.slug, lang)),
    ],
  };
}
