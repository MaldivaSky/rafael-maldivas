import { NextResponse } from "next/server";

/**
 * Diagnóstico de autenticação de e-mail do domínio.
 *
 * Consulta SPF, DMARC, MX e os seletores DKIM mais comuns via DNS-over-HTTPS
 * (Cloudflare). Só leitura de registros públicos — nada é armazenado.
 */

export const runtime = "edge";

const DOH = "https://cloudflare-dns.com/dns-query";

// seletores usados pelos provedores mais comuns no Brasil
const DKIM_SELECTORS = [
  ["google", "Google Workspace"],
  ["selector1", "Microsoft 365"],
  ["selector2", "Microsoft 365"],
  ["k1", "Mailchimp / Mandrill"],
  ["s1", "SendGrid / genérico"],
  ["zoho", "Zoho Mail"],
  ["dkim", "genérico"],
] as const;

type Answer = { data?: string; type?: number };

async function query(name: string, type: "TXT" | "MX" | "CNAME"): Promise<string[]> {
  try {
    const r = await fetch(`${DOH}?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
      // um domínio não muda de SPF a cada minuto
      next: { revalidate: 900 },
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { Answer?: Answer[] };
    return (j.Answer ?? [])
      .map((a) => (a.data ?? "").replace(/^"|"$/g, "").replace(/" "/g, ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}

const isDomain = (d: string) =>
  /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i.test(d) && d.length <= 253;

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("domain") ?? "";

  // aceita e-mail ou URL colada e extrai o domínio
  const domain = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("@")
    .pop()!;

  if (!isDomain(domain)) {
    return NextResponse.json({ error: "invalid_domain" }, { status: 400 });
  }

  const [txt, dmarcTxt, mx] = await Promise.all([
    query(domain, "TXT"),
    query(`_dmarc.${domain}`, "TXT"),
    query(domain, "MX"),
  ]);

  const spf = txt.find((t) => t.toLowerCase().startsWith("v=spf1")) ?? null;
  const dmarc = dmarcTxt.find((t) => t.toLowerCase().startsWith("v=dmarc1")) ?? null;

  // política do DMARC: none não protege ninguém, só reporta
  const policy = dmarc?.match(/\bp\s*=\s*(none|quarantine|reject)/i)?.[1]?.toLowerCase() ?? null;

  const dkimHits = await Promise.all(
    DKIM_SELECTORS.map(async ([sel, provider]) => {
      const [t, c] = await Promise.all([
        query(`${sel}._domainkey.${domain}`, "TXT"),
        query(`${sel}._domainkey.${domain}`, "CNAME"),
      ]);
      const found = t.some((v) => v.toLowerCase().includes("p=")) || c.length > 0;
      return found ? { selector: sel, provider } : null;
    })
  );
  const dkim = dkimHits.filter(Boolean);

  return NextResponse.json({
    domain,
    mx: mx.map((m) => m.split(" ").pop()).filter(Boolean),
    spf,
    spfAll: spf?.match(/[~\-+?]all/)?.[0] ?? null,
    dmarc,
    dmarcPolicy: policy,
    dkim,
    checkedSelectors: DKIM_SELECTORS.map(([s]) => s),
  });
}
