import Link from "next/link";

type Lang = "pt" | "en";

/**
 * Banner discreto de linkagem interna (cluster de autoridade → hub Atol).
 * Server component: entra no HTML estático, que é o que o crawler lê.
 */
export default function AtolCrossLink({ lang, context = "tool" }: { lang: Lang; context?: "tool" | "course" }) {
  const pt = lang === "pt";
  const lead =
    context === "course"
      ? pt
        ? "Webhooks com HMAC, idempotência e dinheiro em centavos — os mesmos padrões deste curso rodam em produção no "
        : "HMAC webhooks, idempotency and integer-cent money — the same patterns from this course run in production at "
      : pt
        ? "Precisa disso integrado ao WhatsApp oficial? O "
        : "Need this wired into official WhatsApp? "
  ;
  return (
    <aside className="atol-xlink" aria-label="Atol Connect">
      <p>
        {lead}
        <strong>Atol Connect</strong>
        {pt ? ": Cloud API da Meta em reais, sem markup, com Coexistência no celular." : ": Meta's Cloud API in BRL, no markup, with phone Coexistence."}
      </p>
      <div>
        <Link href={`/${lang}/whatsapp-api`}>{pt ? "Conhecer a API oficial →" : "See the official API →"}</Link>
        <Link href={`/${lang}/whatsapp-api/calculadora-2026`}>{pt ? "Calculadora 2026 →" : "2026 calculator →"}</Link>
      </div>
    </aside>
  );
}
