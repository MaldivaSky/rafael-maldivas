import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./components/theme-provider";
import { LangProvider } from "./lib/i18n";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import {
  COMPANY,
  EMAIL,
  GITHUB_USER,
  LINKEDIN,
  PHONE_E164,
  SERVICE_AREAS,
  SITE,
  VERIFICATION,
  YOUTUBE,
} from "./lib/site";
import "./globals.css";

const ThreeBackground = dynamic(() => import("./components/ThreeBackground"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default:
      "Maldivas Tech — Sistemas de gestão, TI gerenciada e presença digital | Rafael Maldivas",
    template: "%s · Maldivas Tech",
  },
  description:
    "Rafael Maldivas — engenheiro de software fullstack e especialista em UX. ERP multi-tenant, PDV fiscal NFC-e, integrações homologadas com iFood e WhatsApp Business API, gestão de TI e e-mail corporativo, manutenção de site, tráfego pago e produção de vídeo com drone. CNPJ ativo, contrato e nota fiscal.",
  keywords: [
    "Rafael Maldivas",
    "Maldivas Tech",
    "desenvolvedor fullstack São Paulo",
    "gerenciamento de TI para empresas",
    "gestão de e-mail corporativo SPF DKIM DMARC",
    "manutenção de site mensal",
    "ERP multi-tenant",
    "sistema PDV NFC-e",
    "integração iFood API",
    "WhatsApp Business API",
    "especialista em UX",
    "gestão de projetos Scrum",
    "filmagem com drone São Paulo",
    "Google Meu Negócio",
    "software sob contrato CNPJ",
  ],
  authors: [{ name: "Rafael Maldivas", url: SITE }],
  creator: "Rafael Maldivas",
  publisher: "Maldivas Tech",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    url: SITE,
    siteName: "Maldivas Tech",
    title: "Maldivas Tech — Tecnologia que a operação usa todo dia",
    description:
      "Sistemas de gestão, TI gerenciada, presença digital e conteúdo. Provedora de Tecnologia verificada pela Meta e integração homologada no iFood.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maldivas Tech — Rafael Maldivas",
    description:
      "Sistemas de gestão, TI gerenciada, presença digital e conteúdo. Do modelo de dados ao anúncio no ar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
  // preenchidos por env depois do cadastro no Search Console / Bing Webmaster
  verification: {
    ...(VERIFICATION.google ? { google: VERIFICATION.google } : {}),
    ...(VERIFICATION.bing ? { other: { "msvalidate.01": VERIFICATION.bing } } : {}),
  },
  other: {
    /* geo tags — o Bing ainda lê estas; o Google usa o JSON-LD abaixo */
    "geo.region": `BR-${COMPANY.region}`,
    "geo.placename": COMPANY.city,
    "geo.position": `${COMPANY.lat};${COMPANY.lng}`,
    ICBM: `${COMPANY.lat}, ${COMPANY.lng}`,
  },
};

const address = {
  "@type": "PostalAddress",
  streetAddress: COMPANY.street,
  addressLocality: COMPANY.city,
  addressRegion: COMPANY.region,
  postalCode: COMPANY.postalCode,
  addressCountry: COMPANY.country,
};

const services = [
  ["Gerenciamento de TI", "Responsável técnico dedicado, backups verificados e monitoramento."],
  ["Gestão de e-mail corporativo", "Contas, grupos e autenticação SPF, DKIM e DMARC."],
  ["Manutenção de site", "Publicação, SEO contínuo, disponibilidade e certificado."],
  ["Presença digital e tráfego pago", "Google Meu Negócio, Google Ads e Meta Ads."],
  ["Desenvolvimento de software sob medida", "ERP, PDV fiscal, marketplace, ATS e SaaS multi-tenant."],
  ["Produção audiovisual e drone", "Vídeo institucional, conteúdo social e captação aérea."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
      "@id": `${SITE}#org`,
      name: COMPANY.tradeName,
      legalName: COMPANY.legalName,
      taxID: COMPANY.cnpj,
      vatID: COMPANY.cnpj,
      foundingDate: COMPANY.since,
      url: SITE,
      logo: `${SITE}/brand/logo-mark.png`,
      image: `${SITE}/opengraph-image.png`,
      email: EMAIL,
      telephone: PHONE_E164,
      founder: { "@id": `${SITE}#rafael` },
      address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: COMPANY.lat,
        longitude: COMPANY.lng,
      },
      areaServed: [
        ...SERVICE_AREAS.map((name) => ({
          "@type": "City",
          name,
          containedInPlace: { "@type": "State", name: "São Paulo" },
        })),
        { "@type": "Country", name: "Brasil" },
        { "@type": "Country", name: "Japão" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      knowsLanguage: ["pt-BR", "en"],
      availableLanguage: ["pt-BR", "en"],
      priceRange: "$$",
      sameAs: [GITHUB_USER, LINKEDIN, YOUTUBE],
      description:
        "Desenvolvimento de sistemas de gestão, TI gerenciada, manutenção de site, presença digital e produção audiovisual.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços Maldivas Tech",
        itemListElement: services.map(([name, description]) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, description },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE}#rafael`,
      name: "Rafael Maldivas",
      alternateName: "Rafael Paiva Dias da Silva",
      jobTitle: "Engenheiro de Software Fullstack, Especialista em UX e Gestor de Projetos",
      email: EMAIL,
      telephone: PHONE_E164,
      url: SITE,
      worksFor: { "@id": `${SITE}#org` },
      sameAs: [GITHUB_USER, LINKEDIN, YOUTUBE],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP)",
      },
      knowsAbout: [
        "PostgreSQL",
        "Row Level Security",
        "TypeScript",
        "Python",
        "React",
        "Django",
        "Emissão fiscal NFC-e",
        "WhatsApp Business API",
        "iFood API",
        "LGPD",
        "Business Intelligence",
        "UX Design",
        "Scrum",
        "Gestão de projetos",
        "Google Ads",
        "Pilotagem de drone",
      ],
      knowsLanguage: ["pt-BR", "en", "es"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}#site`,
      url: SITE,
      name: "Maldivas Tech",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE}#org` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#070A12" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LangProvider>
            <ThreeBackground />
            <SiteNav />
            <main>{children}</main>
            <SiteFooter />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
