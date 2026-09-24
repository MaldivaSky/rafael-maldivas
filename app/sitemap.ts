import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";
import { LOCALES, HTML_LANG, localeUrl } from "./lib/seo";
import { productList } from "./lib/products";

/**
 * Sitemap dinâmico e internacionalizado.
 *
 * Cada rota é emitida uma vez por idioma, com `alternates.languages`
 * apontando para as demais variantes. O Next converte isso em
 * <xhtml:link rel="alternate" hreflang="..."/> dentro do sitemap — o
 * sinal de i18n mais forte que o Google consome.
 */

type Route = {
  /** caminho SEM prefixo de idioma ("" = home) */
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

    // Rotas i18n — existem em /pt/... e /en/... com hreflang recíproco.
  const i18nRoutes: Route[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "produtos", priority: 0.9, changeFrequency: "monthly" },
    { path: "servicos", priority: 0.9, changeFrequency: "monthly" },
    { path: "portfolio", priority: 0.9, changeFrequency: "monthly" },
    { path: "ferramentas", priority: 0.8, changeFrequency: "monthly" },
    { path: "about", priority: 0.7, changeFrequency: "yearly" },
        ...productList.map(
      (p): Route => ({
        path: `produtos/${p.slug}`,
        priority: 0.9,
        changeFrequency: "monthly",
      }),
    ),
    // cada ferramenta tem página própria em ambos os idiomas
    ...tools.map(
      (t): Route => ({
        path: `ferramentas/${t.slug}`,
        priority: 0.7,
        changeFrequency: "monthly",
      }),
    ),
    // estúdio de imagem vive fora do registro `tools`
    {
      path: "ferramentas/estudio-de-imagem",
      priority: 0.7,
      changeFrequency: "monthly",
    },
  ];

  /** alternates.languages para uma rota i18n */
  const languages = (path: string) =>
    Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localeUrl(l, path)]));

  const entries: MetadataRoute.Sitemap = [];

  // rotas internacionalizadas — uma entrada por idioma, com hreflang
  for (const r of i18nRoutes) {
    for (const l of LOCALES) {
      entries.push({
        url: localeUrl(l, r.path),
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: { languages: languages(r.path) },
      });
    }
  }

  return entries;
}
