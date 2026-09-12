"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "pt" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LangContext = createContext<Ctx>({ lang: "pt", setLang: () => {} });

const KEY = "maldivas-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  // O idioma precisa sobreviver à navegação entre /, /servicos, /portfolio e /sobre.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "pt" || saved === "en") {
        setLangState(saved);
        return;
      }
      if (!navigator.language.toLowerCase().startsWith("pt")) setLangState("en");
    } catch {
      /* localStorage bloqueado — segue no padrão pt */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignora */
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
