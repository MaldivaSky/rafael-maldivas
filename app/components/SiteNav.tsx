"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useLang } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";
import { ScrollProgress } from "./fx";

const links = [
  { href: "/servicos", pt: "Serviços", en: "Services" },
  { href: "/portfolio", pt: "Portfólio", en: "Portfolio" },
  { href: "/ferramentas", pt: "Ferramentas", en: "Tools" },
  { href: "/sobre", pt: "Sobre", en: "About" },
];

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  // menu aberto não deixa a página rolar por baixo
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isDark = resolvedTheme !== "light";

  return (
    <>
      <ScrollProgress />
      <nav className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand" aria-label="Maldivas Tech">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={44}
              height={44}
              priority
              className="brand-logo"
            />
            <span className="brand-txt">
              <span className="brand-name">Maldivas Tech</span>
              <span className="brand-sub">Rafael Maldivas</span>
            </span>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : ""}>
                {lang === "pt" ? l.pt : l.en}
              </Link>
            ))}
          </div>

          <div className="nav-controls">
            <div className="lang" role="group" aria-label={lang === "pt" ? "Idioma" : "Language"}>
              <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")} aria-pressed={lang === "pt"}>
                PT
              </button>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
                EN
              </button>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="theme-btn"
                aria-label={lang === "pt" ? "Alternar tema" : "Toggle theme"}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            <a className="nav-cta" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              {lang === "pt" ? "Falar comigo" : "Get in touch"}
            </a>

            <button
              className="nav-burger"
              onClick={() => setOpen((v) => !v)}
              aria-label={lang === "pt" ? "Menu" : "Menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* até agora o site simplesmente não tinha navegação abaixo de 900px */}
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <div className="wrap mobile-menu-in">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {lang === "pt" ? l.pt : l.en}
            </Link>
          ))}
          <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            {lang === "pt" ? "Falar no WhatsApp" : "Message on WhatsApp"}
          </a>
        </div>
      </div>
    </>
  );
}
