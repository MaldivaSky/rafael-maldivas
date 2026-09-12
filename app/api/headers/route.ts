import { NextResponse } from "next/server";

/**
 * Auditoria de cabeçalhos de segurança HTTP.
 *
 * Faz uma requisição ao domínio informado e avalia os cabeçalhos que
 * protegem o visitante: HSTS, CSP, X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy e Permissions-Policy. Só leitura de resposta pública.
 */

export const runtime = "edge";

type Check = {
  id: string;
  header: string;
  present: boolean;
  value: string | null;
  weight: number;
  level: "ok" | "warn" | "fail";
  title: { pt: string; en: string };
  detail: { pt: string; en: string };
};

/** Bloqueia host interno/privado — o servidor não deve ser usado como proxy. */
function isPublicHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".internal")) return false;
  if (/^\[?::1\]?$/.test(h)) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) {
    const [a, b] = h.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 192 && b === 168) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 169 && b === 254) return false;
  }
  return /\./.test(h);
}

export async function GET(req: Request) {
  const raw = (new URL(req.url).searchParams.get("domain") ?? "").trim();
  if (!raw) return NextResponse.json({ error: "invalid_domain" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "invalid_domain" }, { status: 400 });
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return NextResponse.json({ error: "invalid_domain" }, { status: 400 });
  }
  if (!isPublicHost(target.hostname)) {
    return NextResponse.json({ error: "blocked_host" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(target.toString(), {
      redirect: "follow",
      headers: { "user-agent": "MaldivasTech-HeaderAudit/1.0 (+https://maldivas.tech)" },
      signal: AbortSignal.timeout(9000),
      next: { revalidate: 300 },
    });
  } catch {
    return NextResponse.json({ error: "unreachable" }, { status: 502 });
  }

  const h = (name: string) => res.headers.get(name);

  const hsts = h("strict-transport-security");
  const hstsMaxAge = hsts?.match(/max-age\s*=\s*(\d+)/i)?.[1];
  const csp = h("content-security-policy");
  const xfo = h("x-frame-options");
  const xcto = h("x-content-type-options");
  const ref = h("referrer-policy");
  const perm = h("permissions-policy");

  const cspFrameAncestors = csp ? /frame-ancestors/i.test(csp) : false;

  const checks: Check[] = [
    {
      id: "https",
      header: "HTTPS",
      present: res.url.startsWith("https://"),
      value: res.url,
      weight: 20,
      level: res.url.startsWith("https://") ? "ok" : "fail",
      title: { pt: "Conexão criptografada", en: "Encrypted connection" },
      detail: {
        pt: "Sem HTTPS, qualquer rede no caminho lê e altera o que o visitante envia. O Chrome marca o site como Não seguro.",
        en: "Without HTTPS, any network in between reads and alters what the visitor sends. Chrome marks the site as Not secure.",
      },
    },
    {
      id: "hsts",
      header: "Strict-Transport-Security",
      present: !!hsts,
      value: hsts,
      weight: 18,
      level: !hsts ? "fail" : Number(hstsMaxAge ?? 0) >= 15552000 ? "ok" : "warn",
      title: { pt: "HSTS — força HTTPS no navegador", en: "HSTS — forces HTTPS in the browser" },
      detail: {
        pt: "Sem HSTS, a primeira visita ainda sai em HTTP e pode ser sequestrada. O recomendado é max-age de no mínimo 6 meses (15552000).",
        en: "Without HSTS the first visit still goes over HTTP and can be hijacked. The recommendation is a max-age of at least 6 months (15552000).",
      },
    },
    {
      id: "csp",
      header: "Content-Security-Policy",
      present: !!csp,
      value: csp ? (csp.length > 160 ? `${csp.slice(0, 160)}…` : csp) : null,
      weight: 20,
      level: csp ? "ok" : "fail",
      title: { pt: "CSP — barreira contra XSS", en: "CSP — the barrier against XSS" },
      detail: {
        pt: "Declara de quais origens o site pode carregar script, estilo e imagem. É a defesa mais eficaz contra injeção de script de terceiro.",
        en: "Declares which origins the site may load scripts, styles and images from. It's the most effective defence against third-party script injection.",
      },
    },
    {
      id: "frame",
      header: "X-Frame-Options / frame-ancestors",
      present: !!xfo || cspFrameAncestors,
      value: xfo ?? (cspFrameAncestors ? "via CSP frame-ancestors" : null),
      weight: 14,
      level: xfo || cspFrameAncestors ? "ok" : "fail",
      title: { pt: "Proteção contra clickjacking", en: "Clickjacking protection" },
      detail: {
        pt: "Impede que outro site coloque o seu dentro de um iframe invisível para capturar cliques do visitante.",
        en: "Stops another site from embedding yours in an invisible iframe to hijack the visitor's clicks.",
      },
    },
    {
      id: "nosniff",
      header: "X-Content-Type-Options",
      present: xcto?.toLowerCase() === "nosniff",
      value: xcto,
      weight: 10,
      level: xcto?.toLowerCase() === "nosniff" ? "ok" : "warn",
      title: { pt: "Sem adivinhação de tipo (nosniff)", en: "No MIME sniffing (nosniff)" },
      detail: {
        pt: "Sem nosniff, o navegador pode tratar um upload de imagem como script e executá-lo.",
        en: "Without nosniff, the browser may treat an uploaded image as a script and execute it.",
      },
    },
    {
      id: "referrer",
      header: "Referrer-Policy",
      present: !!ref,
      value: ref,
      weight: 10,
      level: ref ? "ok" : "warn",
      title: { pt: "Controle de vazamento de URL", en: "URL leakage control" },
      detail: {
        pt: "Define quanto da URL atual vaza para sites externos ao clicar num link — relevante para LGPD quando há dado na query string.",
        en: "Defines how much of the current URL leaks to external sites on click — relevant to privacy law when the query string carries data.",
      },
    },
    {
      id: "permissions",
      header: "Permissions-Policy",
      present: !!perm,
      value: perm ? (perm.length > 120 ? `${perm.slice(0, 120)}…` : perm) : null,
      weight: 8,
      level: perm ? "ok" : "warn",
      title: { pt: "Câmera, microfone e localização", en: "Camera, microphone and geolocation" },
      detail: {
        pt: "Desliga recursos sensíveis que o site não usa, reduzindo o que um script injetado conseguiria acessar.",
        en: "Switches off sensitive features the site doesn't use, reducing what an injected script could reach.",
      },
    },
  ];

  const earned = checks.reduce(
    (acc, c) => acc + (c.level === "ok" ? c.weight : c.level === "warn" ? c.weight * 0.35 : 0),
    0
  );
  const total = checks.reduce((acc, c) => acc + c.weight, 0);
  const score = Math.round((earned / total) * 100);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";

  return NextResponse.json({
    url: res.url,
    status: res.status,
    server: h("server"),
    poweredBy: h("x-powered-by"),
    score,
    grade,
    checks,
  });
}
