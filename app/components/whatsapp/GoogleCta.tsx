import { signupUrl } from "../../lib/whatsapp-niches";

/** CTA único do funil: cadastro no Atol Connect (Google ou e-mail), com origem rastreável. */
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
  const pt = lang === "pt";
  return (
    <>
      <div className="wa-cta">
        <a className="btn btn-primary wa-google" href={signupUrl(src, plan)} data-analytics="atol_signup">
          {pt ? "Testar 14 dias grátis" : "Start 14-day free trial"}
        </a>
        {secondary && (
          <a className="btn btn-ghost" href={secondary.href}>
            {secondary.label}
          </a>
        )}
      </div>
      <p className="wa-micro">
        {pt ? "Sem cartão · Conecta em 3 min · Cadastro em 1 minuto" : "No card · Connect in 3 min · 1-minute sign-up"}
      </p>
    </>
  );
}
