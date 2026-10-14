"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";

/**
 * Conteúdo do 404 (app/not-found.tsx). O Next gera esse 404 uma vez no build,
 * sem idioma; por isso o idioma é lido da URL no navegador ao montar. Em vez do "This page could not be found" cru do Next, leva
 * o visitante (muitas vezes um recrutador vindo do LinkedIn) de volta ao que
 * importa.
 */
export default function NotFoundView() {
  const { lang: ctxLang } = useLang();
  const [lang, setLang] = useState(ctxLang);
  useEffect(() => {
    const seg = window.location.pathname.split("/")[1];
    if (seg === "pt" || seg === "en") setLang(seg);
  }, []);
  const pt = lang === "pt";

  return (
    <section style={{ minHeight: "62vh", display: "flex", alignItems: "center" }}>
      <div className="wrap">
        <div className="sec-tag">404</div>
        <h1 style={{ marginBottom: 16 }}>
          {pt ? "Esta página não existe." : "This page doesn’t exist."}
        </h1>
        <p className="sec-lead" style={{ marginBottom: 32 }}>
          {pt
            ? "O endereço pode ter mudado. Estes caminhos levam ao que você provavelmente procura:"
            : "The address may have changed. These links lead to what you’re probably looking for:"}
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href={localePath("/about", lang)}>
            {pt ? "Sobre mim" : "About me"} <ArrowUpRight size={17} />
          </Link>
          <Link className="btn btn-ghost" href={localePath("/portfolio", lang)}>
            {pt ? "Portfólio" : "Portfolio"}
          </Link>
          <Link className="btn btn-ghost" href={localePath("/", lang)}>
            {pt ? "Página inicial" : "Home"}
          </Link>
        </div>
      </div>
    </section>
  );
}
