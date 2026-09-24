"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Lang = "pt" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LangContext = createContext<Ctx>({ lang: "pt", setLang: () => {} });

const KEY = "maldivas-lang";

/**
 * Deriva o idioma do primeiro segmento da URL (/pt/... ou /en/...).
 * Retorna null quando a rota é legada (sem prefixo), preservando o estado.
 */
function langFromPath(pathname: string | null): Lang | null {
  const seg = pathname?.split("/")[1];
  return seg === "pt" || seg === "en" ? seg : null;
}

export function LangProvider({
  children,
  initialLang = "pt",
}: {
  children: React.ReactNode;
  /** idioma resolvido no servidor a partir da rota [lang] */
  initialLang?: Lang;
}) {
  // A URL é a fonte de verdade do idioma (é ela que o Google indexa).
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();
  const pathname = usePathname();

    // Sincroniza o estado com a rota: navegar para /en/... vira lang "en".
  useEffect(() => {
    const fromPath = langFromPath(pathname);
    if (fromPath && fromPath !== lang) setLangState(fromPath);
  }, [pathname, lang]);

  // Persistência apenas como preferência para o redirecionamento da raiz
  // (o middleware lê o cookie NEXT_LOCALE).
  useEffect(() => {
    try {
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; samesite=lax`;
      localStorage.setItem(KEY, lang);
    } catch {
      /* armazenamento bloqueado — segue sem persistir */
    }
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  /**
   * Troca de idioma = navegação real para /{lang}/... preservando a rota.
   * Isso mantém URL, canonical e hreflang coerentes — o toggle deixa de ser
   * um truque de UI e passa a ser uma mudança indexável.
   */
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignora */
    }
    if (pathname) {
      const seg = pathname.split("/");
      if (seg[1] === "pt" || seg[1] === "en") {
        seg[1] = l;
        router.push(seg.join("/") || `/${l}`);
      } else {
        router.push(`/${l}${pathname}`);
      }
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

/** Escolhe o lado certo de um par { pt, en }. */
export type Bi = { pt: string; en: string };
export const pick = (v: Bi, lang: Lang) => v[lang];

/**
 * Prefixa um href interno com o idioma atual.
 *
 * /servicos + pt  →  /pt/servicos
 * #contato        →  #contato        (âncora, não mexe)
 * https://...     →  inalterado      (externo)
 *
 * Garante que nenhum link interno dependa de redirect 301.
 */
export function localePath(href: string, lang: Lang): string {
  if (!href.startsWith("/")) return href; // externo ou âncora
  if (href.startsWith("/pt/") || href.startsWith("/en/")) return href;
  if (href === "/pt" || href === "/en") return href;
  if (href === "/") return `/${lang}`;
  return `/${lang}${href}`;
}
