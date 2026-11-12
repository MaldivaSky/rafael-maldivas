/* ------------------------------------------------------------------ */
/*  Regras puras da coleta de visitas (servidor): quem conta e como    */
/*  classificar. Sem rede, sem banco — testado em scripts/.             */
/* ------------------------------------------------------------------ */

const ROBO =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|prerender|puppeteer|playwright|phantom|curl\/|wget|python-requests|axios|node-fetch|go-http|facebookexternalhit|bingpreview|vercel-screenshot|uptime|monitor|gtmetrix|pingdom/i;

/** Robô/preview/monitor não é visitante: não grava. UA vazio também não. */
export function ehRobo(userAgent: string | null | undefined): boolean {
  const ua = (userAgent ?? "").trim();
  return ua === "" || ROBO.test(ua);
}

export type Dispositivo = "mobile" | "tablet" | "desktop";

export function classificarDispositivo(userAgent: string | null | undefined): Dispositivo {
  const ua = userAgent ?? "";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

export function idiomaDoCaminho(caminho: string): "pt" | "en" | null {
  const primeiro = caminho.split("/")[1] ?? "";
  return primeiro === "pt" || primeiro === "en" ? primeiro : null;
}

/** Cabeçalho de país da Vercel: só se for exatamente 2 letras. Nunca IP ou cidade. */
export function paisValido(valor: string | null | undefined): string | null {
  const v = (valor ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(v) ? v : null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sessaoValida(valor: unknown): string | null {
  return typeof valor === "string" && UUID.test(valor) ? valor.toLowerCase() : null;
}

/** Só caminho, sem query e sem lixo; sempre começa com "/". */
export function caminhoLimpo(valor: unknown): string {
  const bruto = typeof valor === "string" ? valor : "/";
  if (!bruto.startsWith("/")) return "/";
  // eslint-disable-next-line no-control-regex
  return bruto.split("?")[0].split("#")[0].replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 160) || "/";
}

/** Segundos de uma saída de página: inteiro entre 1 e 1800, senão descarta. */
export function segundosValidos(valor: unknown): number | null {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return null;
  const s = Math.round(valor);
  return s >= 1 && s <= 1800 ? s : null;
}
