/* ------------------------------------------------------------------ */
/*  Feature flags públicas                                             */
/*                                                                     */
/*  NEXT_PUBLIC_TECH_PROVIDER_APPROVED                                 */
/*    false (padrão) → pré-aprovação: o credenciamento Tech Provider    */
/*      da Maldivas Tech está em revisão na Meta. CTAs viram "Explorar  */
/*      sandbox" + "Reservar acesso prioritário".                      */
/*    true → self-serve: "Conectar meu número agora (14 dias grátis)".  */
/*                                                                     */
/*  Só a string literal "true" liga a flag. Qualquer outro valor       */
/*  (vazio, "1", "TRUE ") mantém o modo seguro — a vitrine nunca       */
/*  promete self-serve por engano de configuração.                     */
/* ------------------------------------------------------------------ */

export function parseFlag(raw: string | undefined): boolean {
  return raw === "true";
}

/** Next inlines NEXT_PUBLIC_* em build: o acesso precisa ser literal. */
export const TECH_PROVIDER_APPROVED = parseFlag(
  process.env.NEXT_PUBLIC_TECH_PROVIDER_APPROVED,
);

export const CONNECT_URL = "https://connect.maldivastech.dev";
