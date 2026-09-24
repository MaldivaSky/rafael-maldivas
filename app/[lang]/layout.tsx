import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLang, type Lang } from "@/app/lib/seo";
import { siteGraph } from "@/app/lib/structured-data";
import { LangProvider } from "@/app/lib/i18n";

/**
 * Segmento de idioma: /pt e /en.
 *   • pré-renderiza SÓ as variantes conhecidas (pt, en) no build (Vercel);
 *   • injeta o JSON-LD do grafo completo por idioma;
 *   • fornece o LangProvider com o idioma já resolvido no servidor,
 *     eliminando o flash de idioma na primeira pintura.
 *
 * Os metadados (title/description/canonical/hreflang) NÃO ficam aqui: cada
 * página tem seu próprio generateMetadata — o mais profundo vence.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;

  return (
    <LangProvider initialLang={lang}>
      <script
        type="application/ld+json"
        // grafo único: Organization + WebSite + Person + SoftwareApplication x2
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph(lang)) }}
      />
      <div lang={HTML_LANG[lang]}>{children}</div>
    </LangProvider>
  );
}
