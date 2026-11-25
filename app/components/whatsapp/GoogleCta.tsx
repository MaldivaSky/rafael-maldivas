import AtolCta from "../atol/AtolCta";

/**
 * CTA único do funil Atol nas páginas /whatsapp-api e /desenvolvedores.
 * Delegado ao AtolCta, que respeita NEXT_PUBLIC_TECH_PROVIDER_APPROVED.
 */
export default function GoogleCta({
  lang,
  src,
  plan,
  secondary,
}: {
  lang: "pt" | "en";
  src: string;
  plan?: string;
  secondary?: { href: string; label: string };
}) {
  return <AtolCta lang={lang} src={src} plan={plan} secondary={secondary} />;
}
