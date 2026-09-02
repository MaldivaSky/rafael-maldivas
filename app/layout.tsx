import type { Metadata } from "next";
import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("./components/ThreeBackground"), { ssr: false });

const SITE = "https://rafael-maldivas.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default:
      "Maldivas Tech — Sistemas de gestão, ERP e SaaS multi-tenant | Rafael Maldivas",
    template: "%s · Maldivas Tech",
  },
  description:
    "Rafael Maldivas, engenheiro de software fullstack. ERP multi-tenant, PDV com emissão fiscal NFC-e, marketplace com split de pagamento e ATS bilíngue pt-BR/ja-JP. Python, TypeScript, React, Django e PostgreSQL. CNPJ ativo, contrato e nota fiscal.",
  keywords: [
    "Rafael Maldivas",
    "Maldivas Tech",
    "desenvolvedor fullstack",
    "ERP multi-tenant",
    "sistema PDV NFC-e",
    "SaaS para restaurante",
    "marketplace Django Next.js",
    "análise de dados",
    "PostgreSQL RLS",
    "desenvolvedor São Paulo",
    "software sob contrato CNPJ",
  ],
  authors: [{ name: "Rafael Maldivas", url: SITE }],
  creator: "Rafael Maldivas",
  publisher: "Maldivas Tech",
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    url: SITE,
    siteName: "Maldivas Tech",
    title: "Maldivas Tech — Sistemas de gestão para operações que não podem parar",
    description:
      "ERP multi-tenant, PDV fiscal, marketplace e ATS bilíngue. Do modelo de dados ao deploy. CNPJ ativo, contrato e nota fiscal de serviço.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maldivas Tech — Rafael Maldivas",
    description:
      "ERP multi-tenant, PDV fiscal, marketplace e ATS bilíngue. Do modelo de dados ao deploy.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}#org`,
      name: "Maldivas Tech",
      legalName: "Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA",
      taxID: "68.923.239/0001-77",
      vatID: "68.923.239/0001-77",
      foundingDate: "2026-09-02",
      url: SITE,
      email: "rafaelmaldivas@gmail.com",
      founder: { "@id": `${SITE}#rafael` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "R. Pais Leme, 215, cj. 1713 — Pinheiros",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        postalCode: "05424-150",
        addressCountry: "BR",
      },
      description:
        "Desenvolvimento de sistemas de gestão: ERP multi-tenant, PDV com emissão fiscal, marketplace e plataformas SaaS.",
    },
    {
      "@type": "Person",
      "@id": `${SITE}#rafael`,
      name: "Rafael Maldivas",
      alternateName: "Rafael Paiva Dias da Silva",
      jobTitle: "Engenheiro de Software Fullstack",
      email: "rafaelmaldivas@gmail.com",
      url: SITE,
      worksFor: { "@id": `${SITE}#org` },
      sameAs: [
        "https://github.com/MaldivaSky",
        "https://www.linkedin.com/in/rafael-paiva-dias-da-silva-022b17122/",
      ],
      knowsAbout: [
        "PostgreSQL",
        "Row Level Security",
        "TypeScript",
        "Python",
        "React",
        "Django",
        "Emissão fiscal NFC-e",
        "LGPD",
        "Business Intelligence",
      ],
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#070A12" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThreeBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
