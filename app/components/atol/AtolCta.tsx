"use client";

import { TECH_PROVIDER_APPROVED, CONNECT_URL } from "../../lib/flags";
import PriorityAccess from "./PriorityAccess";

type Lang = "pt" | "en";

export const PRE_APPROVAL_NOTE = {
  pt: "Operação oficial Meta já ativa para Food Service via MiseOn; credenciamento Tech Provider para demais segmentos em validação final na Meta.",
  en: "Official Meta operation already live for Food Service via MiseOn; Tech Provider accreditation for other segments is in final validation at Meta.",
} as const;

/** Página do produto no subdomínio, com origem rastreável. */
export const productHref = (src: string) =>
  `${CONNECT_URL}/?utm_source=maldivastech&utm_medium=portal&utm_campaign=${encodeURIComponent(src)}`;

export const signupHref = (src: string, plan?: string) =>
  `${CONNECT_URL}/login?mode=signup${plan ? `&plan=${plan}` : ""}&utm_source=maldivastech&utm_medium=portal&utm_campaign=${encodeURIComponent(src)}`;

/**
 * CTA do Atol Connect controlado por NEXT_PUBLIC_TECH_PROVIDER_APPROVED.
 *  false → "Explorar Sandbox Interativa" + "Reservar Acesso Prioritário" + nota honesta
 *  true  → "Conectar meu número agora (14 dias grátis)"
 */
export default function AtolCta({
  lang,
  src,
  plan,
  sandboxHref,
  secondary,
  note = true,
  compact = false,
  showSandbox = false,
}: {
  /** mostra um 3º botão para a sandbox interativa */
  showSandbox?: boolean;
  lang: Lang;
  src: string;
  plan?: string;
  /** âncora/rota do explorador interativo (sandbox) */
  sandboxHref?: string;
  /** link extra exibido nos dois modos */
  secondary?: { href: string; label: string };
  note?: boolean;
  compact?: boolean;
}) {
  const pt = lang === "pt";
  const sandbox = sandboxHref ?? `/${lang}/whatsapp-api#sandbox`;

  return (
    <div className={`atol-cta${compact ? " is-compact" : ""}`}>
      <div className="atol-cta-row">
        {TECH_PROVIDER_APPROVED ? (
          <a className="btn btn-primary" href={signupHref(src, plan)} data-analytics="atol_signup">
            {pt ? "Conectar meu número agora (14 dias grátis)" : "Connect my number now (14 days free)"}
          </a>
        ) : (
          <>
            {/* a ponte: sempre leva ao produto; o connect trata a pré-aprovação nos CTAs dele */}
            <a className="btn btn-primary" href={productHref(src)} data-analytics="atol_connect_click">
              {pt ? "Conhecer o Atol Connect →" : "Explore Atol Connect →"}
            </a>
            <PriorityAccess
              lang={lang}
              source={src}
              className="btn btn-ghost"
              label={pt ? "Reservar acesso prioritário" : "Reserve priority access"}
            />
            {showSandbox && (
              <a className="btn btn-ghost" href={sandbox} data-analytics="atol_sandbox">
                {pt ? "Ver sandbox (8 nichos)" : "See sandbox (8 industries)"}
              </a>
            )}
          </>
        )}
        {secondary && (
          <a className="btn btn-ghost" href={secondary.href}>
            {secondary.label}
          </a>
        )}
      </div>
      {note && (
        <p className="atol-cta-note">
          {TECH_PROVIDER_APPROVED
            ? pt
              ? "Sem cartão · Conexão oficial pela Meta · 0% de markup nas tarifas"
              : "No card · Official Meta connection · 0% markup on fees"
            : PRE_APPROVAL_NOTE[lang]}
        </p>
      )}
    </div>
  );
}
