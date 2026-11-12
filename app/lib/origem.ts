/* ------------------------------------------------------------------ */
/*  Origem do visitante: de onde veio cada lead                        */
/*                                                                     */
/*  Arquivo PURO (sem window, sem rede, sem storage): roda no navegador */
/*  (ler a origem da página) e no servidor (limpar o que chegou e      */
/*  decidir o canal). Quem decide o canal é SÓ o servidor, em          */
/*  decidirCanal() — o navegador nunca manda o canal pronto, senão     */
/*  qualquer um poderia forjá-lo.                                      */
/*                                                                     */
/*  O que o navegador consegue saber:                                  */
/*   • document.referrer traz só o SITE (linkedin.com), nunca o post.  */
/*   • Só link com UTM prova a origem ("confirmado"). Referrer sozinho */
/*     é "provável". Por isso existem os links curtos /r/... .         */
/*   • O Google não informa a palavra buscada (isso é Search Console). */
/* ------------------------------------------------------------------ */

export interface Toque {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer_host?: string;
  landing?: string;
  /** veio de anúncio do Google (gclid/gbraid/wbraid na URL) */
  gclid?: true;
}

export type Certeza = "confirmado" | "provavel" | "desconhecido";

export type CanalCodigo =
  | "linkedin"
  | "google_organico"
  | "google_ads"
  | "google_perfil"
  | "outros_buscadores"
  | "ia_generativa"
  | "instagram"
  | "facebook"
  | "youtube"
  | "whatsapp"
  | "email"
  | "github"
  | "outro"
  | "direto"
  | "interno";

export const CANAL_ROTULO: Record<CanalCodigo, string> = {
  linkedin: "LinkedIn",
  google_organico: "Google (busca)",
  google_ads: "Google Ads",
  google_perfil: "Google Meu Negócio",
  outros_buscadores: "Outros buscadores",
  ia_generativa: "IA generativa",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  email: "E-mail",
  github: "GitHub",
  outro: "Outro site",
  direto: "Direto",
  interno: "Interno (teste)",
};

export interface Canal {
  codigo: CanalCodigo;
  rotulo: string;
  certeza: Certeza;
}

const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const LIMITE = 120;

/** tira caracteres de controle, aparas e corta — o valor vai parar no banco */
function limpa(valor: unknown, limite = LIMITE): string | undefined {
  if (typeof valor !== "string") return undefined;
  // eslint-disable-next-line no-control-regex
  const t = valor.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return t ? t.slice(0, limite) : undefined;
}

/** O host é o nosso próprio site? Navegar entre páginas não é origem. */
function ehHostProprio(host: string, hostAtual: string): boolean {
  return (
    host === hostAtual.toLowerCase() ||
    host === "maldivastech.dev" ||
    host.endsWith(".maldivastech.dev")
  );
}

/** O toque desta carga de página. Sempre devolve objeto: sem origem é "direto". */
export function lerToque(href: string, referrer: string): Toque {
  const url = new URL(href);
  const toque: Toque = {};
  const landing = limpa(url.pathname, 200);
  if (landing) toque.landing = landing;
  for (const chave of UTMS) {
    const valor = limpa(url.searchParams.get(chave));
    if (valor) toque[chave] = valor;
  }
  // gbraid/wbraid: o Google Ads usa no lugar do gclid em iPhone
  if (url.searchParams.has("gclid") || url.searchParams.has("gbraid") || url.searchParams.has("wbraid")) {
    toque.gclid = true;
  }
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      if (host && !ehHostProprio(host, url.hostname)) toque.referrer_host = host.slice(0, LIMITE);
    } catch {
      // referrer inválido: fica sem
    }
  }
  return toque;
}

/** Tem origem de verdade? Visita direta não troca a "última origem". */
export function temOrigem(toque: Toque | null | undefined): boolean {
  return !!(
    toque &&
    (toque.utm_source || toque.utm_medium || toque.utm_campaign || toque.gclid || toque.referrer_host)
  );
}

/**
 * Servidor: aceita QUALQUER coisa vinda do navegador e devolve só as chaves
 * conhecidas, com tipo e tamanho garantidos. Nada além disso chega ao banco.
 */
export function limparToque(bruto: unknown): Toque | null {
  if (!bruto || typeof bruto !== "object" || Array.isArray(bruto)) return null;
  const b = bruto as Record<string, unknown>;
  const toque: Toque = {};
  for (const chave of UTMS) {
    const v = limpa(b[chave]);
    if (v) toque[chave] = v;
  }
  const ref = limpa(b.referrer_host);
  if (ref) toque.referrer_host = ref.toLowerCase();
  const landing = limpa(b.landing, 200);
  if (landing) toque.landing = landing.startsWith("/") ? landing : `/${landing}`;
  if (b.gclid === true) toque.gclid = true;
  return Object.keys(toque).length ? toque : null;
}

const SRC_LINKEDIN = new Set(["linkedin", "li", "lnkd", "linkedin.com"]);
const SRC_IA = new Set(["chatgpt.com", "chatgpt", "openai", "perplexity", "perplexity.ai", "gemini", "copilot", "claude", "claude.ai"]);
const ADS_MEDIUM = new Set(["cpc", "ppc", "paid", "pago", "ads"]);

/** Canal pelo UTM — certeza "confirmado". */
function canalPorUtm(src: string, med: string): CanalCodigo {
  if (SRC_LINKEDIN.has(src)) return "linkedin";
  if (src === "google" && med === "perfil_empresa") return "google_perfil";
  if (src === "google") return "google_organico";
  if (SRC_IA.has(src)) return "ia_generativa";
  if (src === "instagram" || src === "ig") return "instagram";
  if (src === "facebook" || src === "fb") return "facebook";
  if (src === "youtube" || src === "yt") return "youtube";
  if (src === "whatsapp" || src === "wa" || src === "zap") return "whatsapp";
  if (src === "github") return "github";
  if (src === "email" || src === "e-mail" || src === "newsletter" || med === "email") return "email";
  return "outro";
}

/** Canal pelo referrer — certeza "provável" (só o site, nunca o post). */
function canalPorReferrer(host: string): CanalCodigo {
  // apps de celular mandam android-app://com.linkedin.android e afins
  if (host === "com.linkedin.android" || host === "lnkd.in" || /(^|\.)linkedin\.com$/.test(host)) return "linkedin";
  if (host.endsWith("googlequicksearchbox") || /^(www\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host)) {
    return "google_organico";
  }
  if (host === "gemini.google.com" || host === "copilot.microsoft.com" || /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai)$/.test(host)) {
    return "ia_generativa";
  }
  if (host === "search.brave.com" || /(^|\.)(bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org)$/.test(host)) {
    return "outros_buscadores";
  }
  if (/(^|\.)instagram\.com$/.test(host)) return "instagram";
  if (/(^|\.)(facebook\.com|fb\.com)$/.test(host)) return "facebook";
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(host)) return "youtube";
  if (host === "wa.me" || /(^|\.)whatsapp\.com$/.test(host)) return "whatsapp";
  if (/(^|\.)github\.com$/.test(host)) return "github";
  return "outro";
}

function canal(codigo: CanalCodigo, certeza: Certeza): Canal {
  return { codigo, rotulo: CANAL_ROTULO[codigo], certeza };
}

/** O canal de UM toque. Regra única — não existe cópia dela em outro lugar. */
export function canalDeToque(toque: Toque | null | undefined): Canal {
  if (!toque) return canal("direto", "desconhecido");
  const src = (toque.utm_source ?? "").toLowerCase();
  const med = (toque.utm_medium ?? "").toLowerCase();
  const ref = (toque.referrer_host ?? "").toLowerCase();

  if (toque.gclid || (["google", "google_ads", "adwords"].includes(src) && ADS_MEDIUM.has(med))) {
    return canal("google_ads", "confirmado");
  }
  if (src) return canal(canalPorUtm(src, med), "confirmado");
  if (ref) return canal(canalPorReferrer(ref), "provavel");
  return canal("direto", "desconhecido");
}

/**
 * O canal do lead: a primeira origem que o aparelho teve; se a primeira foi
 * visita direta, vale a última que tinha origem (o dono do link que trouxe
 * a pessoa de volta). Aparelho da equipe é "interno" e não conta como lead.
 */
export function decidirCanal(
  primeira: Toque | null | undefined,
  ultima: Toque | null | undefined,
  interno = false
): Canal {
  if (interno) return canal("interno", "confirmado");
  if (temOrigem(primeira)) return canalDeToque(primeira);
  if (temOrigem(ultima)) return canalDeToque(ultima);
  return canal("direto", "desconhecido");
}
