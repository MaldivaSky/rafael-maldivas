/* ------------------------------------------------------------------ */
/*  Factory de generateMetadata — uma chamada por rota                  */
/* ------------------------------------------------------------------ */

import type { Metadata } from "next";
import { SITE, COMPANY } from "./site";
import {
  type Lang,
  HTML_LANG,
  OG_LOCALE,
  LOCALES,
  DEFAULT_LOCALE,
  buildAlternates,
  localeUrl,
} from "./seo";

type SeoInput = {
  lang: Lang;
  /** caminho SEM prefixo de idioma, ex.: "produtos/miseon" (vazio p/ home) */
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  /** URL relativa da imagem OG (padrão: /opengraph-image.png) */
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  /** quando false, aplica noindex (ex.: páginas de obrigado) */
  index?: boolean;
  /** dados extras de artigo */
  publishedTime?: string;
  modifiedTime?: string;
};

const absolute = (p?: string) =>
  !p ? `${SITE}/opengraph-image.png` : p.startsWith("http") ? p : `${SITE}${p}`;

/** Google corta a description em ~155–160 caracteres: corta em palavra inteira. */
export function clampDescription(d: string, max = 158): string {
  const s = d.trim().replace(/\s+/g, " ");
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.—–-]+$/, "") + "…";
}

/**
 * O layout aplica o template "%s · Maldivas Tech". Título que já traz a marca
 * vira absoluto (senão sai "Maldivas Tech — … · Maldivas Tech").
 */
export function pageTitle(title: string): Metadata["title"] {
  // marca só entra quando cabe no limite de ~62 caracteres que o Google exibe
  const SUFFIX = " · Maldivas Tech".length;
  if (/Maldivas Tech/i.test(title) || title.length + SUFFIX > 62) return { absolute: title };
  return title;
}

/**
 * Monta o Metadata completo. O canonical e o hreflang saem sempre daqui —
 * nenhuma página deve declará-los à mão (evita divergência).
 */
export function buildMetadata({
  lang,
  path = "",
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  index = true,
  publishedTime,
  modifiedTime,
}: SeoInput): Metadata {
  const url = localeUrl(lang, path);
  const image = absolute(ogImage);
  description = clampDescription(description);

  return {
    metadataBase: new URL(SITE),
    title: pageTitle(title),
    description,
    keywords,
    alternates: buildAlternates(lang, path),
    openGraph: {
      type: ogType === "product" ? "website" : ogType,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url,
      siteName: COMPANY.tradeName,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(ogType === "article"
        ? { publishedTime, modifiedTime, authors: [COMPANY.tradeName] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    other: {
      // <html lang> é setado no layout; aqui reforçamos para alguns parsers
      "content-language": HTML_LANG[lang],
    },
  };
}

/** Metadata padrão da raiz do idioma (home). */
export const homeMetadata = (lang: Lang): Metadata =>
  buildMetadata({
    lang,
    path: "",
    title:
      lang === "pt"
        ? "Maldivas Tech — Sistemas de Gestão e SaaS sob Medida"
        : "Maldivas Tech — Custom Management Systems & SaaS",
    description:
      lang === "pt"
        ? "Desenvolvemos sistemas de gestão e SaaS multi-tenant. Produtos próprios — MiseOn (restaurantes) e SelectSys Jobs (ATS) — e software sob medida a partir de São Paulo para o mundo."
        : "We build management systems and multi-tenant SaaS. Our products — MiseOn (restaurants) and SelectSys Jobs (ATS) — plus custom software from São Paulo to the world.",
    keywords:
      lang === "pt"
        ? [
            "sistemas de gestão",
            "SaaS para restaurantes",
            "ATS para agências",
            "software sob medida",
            "Maldivas Tech",
          ]
        : [
            "management systems",
            "restaurant SaaS",
            "ATS for agencies",
            "custom software",
            "Maldivas Tech",
          ],
  });

export { SITE, DEFAULT_LOCALE };
