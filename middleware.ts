import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLang } from "./app/lib/seo";

/**
 * Redireciona a raiz e as rotas sem prefixo de idioma para /{lang}.
 *
 * IMPORTANTE — ordem no Next: middleware roda ANTES dos redirects de
 * next.config.mjs. Por isso as rotas legadas (/sobre, /servicos, ...) que
 * têm um 301 dedicado no next.config.mjs precisam ser LIBERADAS aqui;
 * caso contrário o middleware as capturaria primeiro e mandaria para o
 * destino errado (ex.: /sobre -> /pt/sobre, que não existe mais).
 *
 * Decisão de idioma, nesta ordem:
 *   1. cookie de preferência (NEXT_LOCALE)
 *   2. Accept-Language do navegador
 *   3. DEFAULT_LOCALE (pt)
 *
 * Usa 307 (temporário) para não cristalizar a raiz e permitir troca de idioma.
 */

/** Rotas legadas com 301 explícito no next.config.mjs — não tocar aqui. */
const LEGACY_PATHS = [
  "/servicos",
  "/portfolio",
  "/ferramentas",
  "/sobre",
  "/miseon",
  "/selectsys-jobs",
  "/produtos",
  "/about",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // arquivos, api, assets, llms.txt, imagens, sitemap, robots...
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/brand") ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // já tem prefixo de idioma válido? segue
  const first = pathname.split("/")[1] ?? "";
  if (isLang(first)) return NextResponse.next();

  // rota legada com 301 dedicado? deixa o next.config.mjs resolver
  // (inclusive sub-rotas: /ferramentas/estudio-de-imagem, /servicos#ancora)
  if (LEGACY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // escolhe o idioma
  const cookieLang = req.cookies.get("NEXT_LOCALE")?.value;
  let lang = isLang(cookieLang ?? "") ? (cookieLang as string) : "";

  if (!lang) {
    const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
    // pt-* => pt ; caso contrário en
    lang = accept.startsWith("pt") || accept.includes("pt-") ? "pt" : "en";
  }

  const finalLang = isLang(lang) ? lang : DEFAULT_LOCALE;
  const url = req.nextUrl.clone();
  url.pathname = `/${finalLang}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url, 307);
  res.cookies.set("NEXT_LOCALE", finalLang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  // roda em tudo, menos assets estáticos do Next
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// LOCALES é importado para garantir o tipo de retorno; mantido explícito.
void LOCALES;
