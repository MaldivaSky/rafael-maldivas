import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./components/theme-provider";
import { LangProvider } from "./lib/i18n";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import { COMPANY, SITE, VERIFICATION } from "./lib/site";
import "./globals.css";
import "./editorial.css";

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
  authors: [{ name: "Rafael Maldivas", url: SITE }],
  creator: "Rafael Maldivas",
  publisher: "Maldivas Tech",
  // canonical/hreflang/OG/Twitter saem de buildMetadata() em cada página.
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
        /* geo tags — o Bing ainda lê estas; o Google usa o JSON-LD do [lang] */
    "geo.region": `BR-${COMPANY.region}`,
    "geo.placename": COMPANY.city,
    "geo.position": `${COMPANY.lat};${COMPANY.lng}`,
    ICBM: `${COMPANY.lat}, ${COMPANY.lng}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/*
          <html lang> correto por idioma SEM perder o SSG.

          O Next 14 só permite um <html>, no layout raiz — que está ACIMA do
          segmento [lang] e portanto não conhece o idioma em build time. Ler
          headers() aqui tornaria todas as 69 páginas dinâmicas (mata o SSG).

          Solução: este script roda de forma SÍNCRONA no <head>, antes do
          primeiro paint e antes de qualquer crawler avaliar o documento.
          Lê o primeiro segmento da URL (/pt|/en) e corrige o atributo.
          É a técnica padrão para i18n estático e não custa JS de bundle.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var s=location.pathname.split('/')[1];" +
              "document.documentElement.lang=s==='en'?'en':s==='pt'?'pt-BR':" +
              "(navigator.language&&navigator.language.indexOf('pt')===0?'pt-BR':'en');" +
              "})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
                <meta name="theme-color" content="#070A12" />
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
