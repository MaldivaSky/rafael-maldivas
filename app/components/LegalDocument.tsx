import Link from "next/link";
import { LEGAL, LEGAL_EMAIL, type LegalSlug } from "../lib/legal";
import type { Lang } from "../lib/seo";

const NAV: Record<Lang, [LegalSlug, string][]> = {
  pt: [
    ["privacidade", "Privacidade"],
    ["termos", "Termos de Uso"],
    ["exclusao-de-dados", "Exclusão de Dados"],
  ],
  en: [
    ["privacidade", "Privacy"],
    ["termos", "Terms"],
    ["exclusao-de-dados", "Data Deletion"],
  ],
};

/** Página legal renderizada no servidor (HTML estático, legível por revisores e crawlers). */
export default function LegalDocument({ lang, slug }: { lang: Lang; slug: LegalSlug }) {
  const doc = LEGAL[lang][slug];
  return (
    <section className="legal">
      <div className="wrap legal-wrap">
        <nav className="legal-nav" aria-label={lang === "pt" ? "Documentos legais" : "Legal documents"}>
          {NAV[lang].map(([s, label]) => (
            <Link key={s} href={`/${lang}/${s}`} aria-current={s === slug ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <h1>{doc.title}</h1>
        <p className="legal-updated">{doc.updated}</p>
        <p className="legal-intro">{doc.intro}</p>
        {doc.sections.map((s) => (
          <div key={s.h} className="legal-sec">
            <h2>{s.h}</h2>
            {s.li && (
              <ul>
                {s.li.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {s.p?.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        ))}
        <p className="legal-contact">
          {lang === "pt" ? "Contato: " : "Contact: "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
