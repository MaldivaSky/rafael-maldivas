/* ------------------------------------------------------------------ */
/*  Núcleo de SEO / Geo-SEO — Maldivas Tech (maldivastech.dev)         */
/*                                                                     */
/*  Fonte única de verdade para:                                       */
/*   • locales suportados e suas variantes BCP-47 (hreflang)           */
/*   • catálogo de produtos SaaS (resolve @id, metas, JSON-LD)         */
/*   • factory de generateMetadata por idioma + geração de hreflang    */
/*                                                                     */
/*  Regra de ouro: NENHUMA meta tag é tradução literal. Cada idioma    */
/*  tem copy escrita para a INTENÇÃO DE BUSCA daquele mercado.         */
/* ------------------------------------------------------------------ */

import type { Metadata } from "next";
import { SITE } from "./site";

export type Lang = "pt" | "en";

export const LOCALES: readonly Lang[] = ["pt", "en"] as const;
export const DEFAULT_LOCALE: Lang = "pt";

/** pt-BR (não pt) para casar com o Google BR; en genérico para atender o mundo. */
export const HTML_LANG: Record<Lang, string> = {
  pt: "pt-BR",
  en: "en",
};

/** locale Open Graph (formato language_TERRITORY). */
export const OG_LOCALE: Record<Lang, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export const isLang = (v: string): v is Lang =>
  (LOCALES as readonly string[]).includes(v);

/** URL absoluta de uma rota dentro de um idioma. */
export const localeUrl = (lang: Lang, path = "") => {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `${SITE}/${lang}/${clean}` : `${SITE}/${lang}`;
};

/**
 * hreflang / alternates por rota.
 *
 * Gera canonical da própria variante + um <link rel="alternate"> por idioma
 * + x-default (convenção: aponta para a versão pt, o público primário).
 * `path` deve ser o caminho SEM o prefixo de idioma (ex.: "produtos/miseon").
 */
export function buildAlternates(lang: Lang, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HTML_LANG[l]] = localeUrl(l, path);
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path);

  return {
    canonical: localeUrl(lang, path),
    languages,
  };
}
