"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";
import { AREAS, servicos } from "../lib/catalog";
import { tools, GROUP_LABEL, type ToolGroup } from "../lib/tools";
import { ScrollProgress } from "./fx";

/* ------------------------------------------------------------------ */
/*  Estrutura do menu                                                  */
/*                                                                     */
/*  Cada tópico com submenu aponta para destinos reais: as áreas de    */
/*  /servicos, os blocos de /portfolio e as páginas de /ferramentas.   */
/*  "Sobre" segue como link simples — página única não justifica um    */
/*  dropdown.                                                          */
/* ------------------------------------------------------------------ */

type SubItem = { href: string; pt: string; en: string };
/** Submenu com tópicos: cada grupo tem um rótulo e seus itens. */
type SubGroup = { label: { pt: string; en: string }; items: SubItem[] };
type MenuItem = { href: string; pt: string; en: string; sub?: SubItem[]; groups?: SubGroup[] };

const servicesSub: SubItem[] = (
  Object.keys(AREAS) as (keyof typeof AREAS)[]
).map((area) => {
  // usa o id do primeiro serviço da área como âncora estável, se existir
  const anchor = servicos.find((s) => s.area === area)?.area ?? area;
  return {
    href: `/servicos#${anchor}`,
    pt: AREAS[area].pt,
    en: AREAS[area].en,
  };
});

const portfolioSub: SubItem[] = [
  { href: "/portfolio#saas", pt: "Plataformas próprias", en: "Own platforms" },
  { href: "/portfolio#clientes", pt: "Projetos para clientes", en: "Client projects" },
  { href: "/portfolio#audiovisual", pt: "Audiovisual", en: "Video & content" },
  { href: "/portfolio#contato", pt: "Falar sobre um projeto", en: "Talk about a project" },
];

// Ferramentas: cada uma leva à sua própria página /ferramentas/<slug>.
// O submenu é agrupado por tópico (igual à página /ferramentas) e os itens
// ficam em ordem alfabética dentro de cada grupo. O Estúdio de imagem é uma
// rota própria e por isso não vive no registro `tools` — entra à parte, em
// destaque, no topo da lista.
const GROUP_ORDER: ToolGroup[] = ["fiscal", "margem", "site", "operacao"];

const studioItem: SubItem = {
  href: "/ferramentas/estudio-de-imagem",
  pt: "Estúdio de imagem — remover fundo",
  en: "Image studio — remove background",
};

const toolsGroups: SubGroup[] = [
  { label: { pt: "Em destaque", en: "Featured" }, items: [studioItem] },
  ...GROUP_ORDER.map((g) => ({
    label: GROUP_LABEL[g],
    items: tools
      .filter((t) => t.group === g)
      .slice()
      .sort((a, b) => a.copy.pt.title.localeCompare(b.copy.pt.title, "pt"))
      .map((t) => ({
        href: `/ferramentas/${t.slug}`,
        pt: t.copy.pt.title,
        en: t.copy.en.title,
      })),
  })),
];

const menu: MenuItem[] = [
  { href: "/servicos", pt: "Serviços", en: "Services", sub: servicesSub },
  { href: "/portfolio", pt: "Portfólio", en: "Portfolio", sub: portfolioSub },
  { href: "/ferramentas", pt: "Ferramentas", en: "Tools", groups: toolsGroups },
  { href: "/sobre", pt: "Sobre", en: "About" },
];

/* ------------------------------------------------------------------ */
/*  Dropdown de desktop                                                */
/* ------------------------------------------------------------------ */

function DesktopItem({
  item,
  lang,
  active,
}: {
  item: MenuItem;
  lang: "pt" | "en";
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const label = lang === "pt" ? item.pt : item.en;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => cancelClose, []);

  // fecha com Escape e devolve o foco ao gatilho
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      (rootRef.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
    }
  };

  // sem submenu nem grupos: link simples
  if (!item.sub && !item.groups) {
    return (
      <Link href={localePath(item.href, lang)} className={`nav-link ${active ? "on" : ""}`}>
        {label}
      </Link>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`nav-item ${open ? "is-open" : ""}`}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`nav-link nav-trigger ${active ? "on" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKey}
      >
        {label}
        <ChevronDown size={15} className="nav-chevron" aria-hidden />
      </button>

      <div
        className="nav-dropdown"
        role="menu"
        aria-label={label}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
      >
        <Link href={localePath(item.href, lang)} className="nav-dropdown-head" role="menuitem">
          {lang === "pt" ? `Ver ${item.pt.toLowerCase()}` : `View all ${item.en.toLowerCase()}`}
        </Link>
        <div className="nav-dropdown-list">
          {item.groups
            ? item.groups.map((grp) => (
                <div key={grp.label.en} className="nav-dropdown-group">
                  <div className="nav-dropdown-group-label">
                    {lang === "pt" ? grp.label.pt : grp.label.en}
                  </div>
                  {grp.items.map((s) => (
                    <Link key={s.href} href={localePath(s.href, lang)} className="nav-dropdown-item" role="menuitem">
                      {lang === "pt" ? s.pt : s.en}
                    </Link>
                  ))}
                </div>
              ))
            : item.sub?.map((s) => (
                <Link key={s.href} href={localePath(s.href, lang)} className="nav-dropdown-item" role="menuitem">
                  {lang === "pt" ? s.pt : s.en}
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navegação                                                          */
/* ------------------------------------------------------------------ */

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setOpen(false);
    setMobileSub(null);
  }, [pathname]);

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
  // pathname pode vir como /pt/servicos ou /en/servicos — normaliza antes de comparar
  const isActive = (href: string) => {
    const clean = pathname.replace(/^\/(pt|en)/, "") || "/";
    return clean === href || clean.startsWith(`${href}/`);
  };

  return (
    <>
      <ScrollProgress />
      <nav className="nav">
        <div className="wrap nav-in">
          <Link href={localePath("/", lang)} className="brand" aria-label="Maldivas Tech">
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
            {menu.map((item) => (
              <DesktopItem key={item.href} item={item} lang={lang} active={isActive(item.href)} />
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

            <a className="nav-cta" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
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
          {menu.map((item) => {
            const label = lang === "pt" ? item.pt : item.en;
            if (!item.sub && !item.groups) {
              return (
                <Link key={item.href} href={localePath(item.href, lang)} className="mm-link">
                  {label}
                </Link>
              );
            }
            const expanded = mobileSub === item.href;
            return (
              <div key={item.href} className={`mm-group ${expanded ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="mm-trigger"
                  aria-expanded={expanded}
                  onClick={() => setMobileSub(expanded ? null : item.href)}
                >
                  {label}
                  <ChevronDown size={20} className="mm-chevron" aria-hidden />
                </button>
                {expanded && (
                  <div className="mm-sub">
                    <Link href={localePath(item.href, lang)} className="mm-sub-item mm-sub-head">
                      {lang === "pt" ? `Ver ${item.pt.toLowerCase()}` : `View all ${item.en.toLowerCase()}`}
                    </Link>
                    {item.groups
                      ? item.groups.map((grp) => (
                          <div key={grp.label.en} className="mm-sub-group">
                            <div className="mm-sub-group-label">
                              {lang === "pt" ? grp.label.pt : grp.label.en}
                            </div>
                            {grp.items.map((s) => (
                              <Link key={s.href} href={localePath(s.href, lang)} className="mm-sub-item">
                                {lang === "pt" ? s.pt : s.en}
                              </Link>
                            ))}
                          </div>
                        ))
                      : item.sub?.map((s) => (
                          <Link key={s.href} href={localePath(s.href, lang)} className="mm-sub-item">
                            {lang === "pt" ? s.pt : s.en}
                          </Link>
                        ))}
                  </div>
                )}
              </div>
            );
          })}

          <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
            {lang === "pt" ? "Falar no WhatsApp" : "Message on WhatsApp"}
          </a>
        </div>
      </div>
    </>
  );
}
