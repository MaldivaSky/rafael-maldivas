"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "../lib/i18n";
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
      "Sistemas de gestão, presença digital e conteúdo — do modelo de dados ao anúncio no ar.",
    nav: "Navegação",
    social: "Onde me achar",
    company: "Empresa",
    links: [
      ["/servicos", "Serviços"],
      ["/portfolio", "Portfólio"],
      ["/sobre", "Sobre"],
      ["/#contato", "Contato"],
    ],
    rights: "Todos os direitos reservados.",
    marks:
      "Meta, iFood, 99Food, Google e demais marcas citadas pertencem aos seus respectivos titulares.",
  },
  en: {
    tagline:
      "Management systems, digital presence and content — from the data model to the live ad.",
    nav: "Navigation",
    social: "Find me",
    company: "Company",
    links: [
      ["/servicos", "Services"],
      ["/portfolio", "Portfolio"],
      ["/sobre", "About"],
      ["/#contato", "Contact"],
    ],
    rights: "All rights reserved.",
    marks:
      "Meta, iFood, 99Food, Google and other marks cited belong to their respective owners.",
  },
} as const;

export default function SiteFooter() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Image src="/brand/logo-full.png" alt="Maldivas Tech" width={210} height={70} />
          <p>{c.tagline}</p>
        </div>

        <div>
          <h4>{c.nav}</h4>
          {c.links.map(([href, label]) => (
            <Link key={href} href={href}>
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
          <span>CNPJ {COMPANY.cnpj}</span>
          <span>
            {COMPANY.city}/{COMPANY.region}
          </span>
          <span>{EMAIL}</span>
        </div>
      </div>

      <div className="wrap foot-legal">
        <span>
          © {new Date().getFullYear()} {COMPANY.tradeName}. {c.rights}
        </span>
        <span>{c.marks}</span>
      </div>
    </footer>
  );
}
