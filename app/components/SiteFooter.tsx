"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLang, localePath } from "../lib/i18n";
import PortfolioConcierge from "./PortfolioConcierge";
import {
  COMPANY,
  EMAIL,
  GITHUB_ORG,
  GITHUB_USER,
  LINKEDIN,
  WHATSAPP,
  YOUTUBE,
} from "../lib/site";

const t = {
  pt: {
    tagline:
      "Infraestrutura WhatsApp Oficial e SaaS multi-tenant em produção — do modelo de dados ao deploy.",
    nav: "Institucional",
    social: "Onde nos achar",
    company: "Empresa",
    links: [
      ["/whatsapp-api", "Atol Connect"],
      ["/whatsapp-api/calculadora-2026", "Calculadora 2026"],
      ["/produtos", "Sistemas"],
      ["/portfolio", "Portfólio"],
      ["/servicos", "Software sob medida"],
      ["/cursos", "Academy"],
      ["/ferramentas", "Ferramentas"],
      ["/about", "Sobre"],
      ["/#contato", "Contato"],
    ],
    rights: "Todos os direitos reservados.",
    privacy: "Política de Privacidade",
    terms: "Termos de Uso",
    deletion: "Exclusão de Dados",
    marks:
      "WhatsApp e Meta são marcas da Meta Platforms, Inc. O Atol Connect usa a WhatsApp Business Platform (Cloud API) oficial; as tarifas de mensagem são cobradas pela Meta diretamente do cliente. iFood, Google e demais marcas citadas pertencem aos seus titulares.",
  },
  en: {
    tagline:
      "Official WhatsApp infrastructure and multi-tenant SaaS in production — from data model to deploy.",
    nav: "Company pages",
    social: "Find us",
    company: "Company",
    links: [
      ["/whatsapp-api", "Atol Connect"],
      ["/whatsapp-api/calculadora-2026", "2026 Calculator"],
      ["/produtos", "Systems"],
      ["/portfolio", "Portfolio"],
      ["/servicos", "Custom software"],
      ["/cursos", "Academy"],
      ["/ferramentas", "Tools"],
      ["/about", "About"],
      ["/#contato", "Contact"],
    ],
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    deletion: "Data Deletion",
    marks:
      "WhatsApp and Meta are trademarks of Meta Platforms, Inc. Atol Connect uses the official WhatsApp Business Platform (Cloud API); message fees are billed by Meta directly to the customer. iFood, Google and other marks cited belong to their owners.",
  },
} as const;

export default function SiteFooter() {
  const { lang } = useLang();
  const pathname = usePathname() || "/";
  const c = t[lang];
  const hideConcierge =
    pathname.startsWith("/admin") || /\/cursos\/[^/]+\/pratica/.test(pathname);

  return (
    <>
      {!hideConcierge && <PortfolioConcierge />}
      <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Image src="/brand/logo-full.png" alt="Maldivas Tech" width={210} height={70} />
          <p>{c.tagline}</p>
        </div>

        <div>
          <h4>{c.nav}</h4>
          {c.links.map(([href, label]) => (
            <Link key={href} href={href.startsWith("/#") ? `/${lang}${href.slice(1)}` : localePath(href, lang)}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4>{c.social}</h4>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">
            {lang === "pt" ? "Organização" : "Organization"}
          </a>
          <a href={YOUTUBE} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`}>E-mail</a>
        </div>

        <div>
          <h4>{c.company}</h4>
          <span>{COMPANY.tradeName}</span>
          <span>{COMPANY.legalName}</span>
          <span>CNPJ {COMPANY.cnpj}</span>
          <span>
            {COMPANY.street} — {COMPANY.city}/{COMPANY.region} · CEP {COMPANY.postalCode}
          </span>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>

      <div className="wrap foot-legal">
        <span>
          © {new Date().getFullYear()} {COMPANY.tradeName}. {c.rights}
        </span>
        <span>{c.marks}</span>
        <span className="foot-legal-links">
          <Link href={localePath("/privacidade", lang)}>{c.privacy}</Link>
          {" · "}
          <Link href={localePath("/termos", lang)}>{c.terms}</Link>
          {" · "}
          <Link href={localePath("/exclusao-de-dados", lang)}>{c.deletion}</Link>
        </span>
      </div>
    </footer>
    </>
  );
}
