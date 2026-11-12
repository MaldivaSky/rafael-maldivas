import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/* ------------------------------------------------------------------ */
/*  Autenticação do painel (/admin)                                    */
/*                                                                     */
/*  A senha (ADMIN_PASSWORD) vive SÓ no servidor. O login troca a      */
/*  senha por uma sessão: um cookie HttpOnly (JavaScript da página não */
/*  consegue ler), Secure, SameSite=Strict, assinado com HMAC e com    */
/*  validade. O navegador nunca guarda a senha.                        */
/*                                                                     */
/*  A assinatura usa a própria ADMIN_PASSWORD como chave: trocar a     */
/*  senha derruba todas as sessões abertas, sem variável nova.         */
/*                                                                     */
/*  Tentativas erradas por IP são limitadas (memória da instância:     */
/*  freia robô de senha, mas não é um limite global — o firewall da    */
/*  Vercel é a camada forte).                                          */
/* ------------------------------------------------------------------ */

export const COOKIE_SESSAO = "__Host-mt_admin";
export const VALIDADE_SESSAO_S = 7 * 24 * 60 * 60; // 7 dias

const PREFIXO = "adm1.";

function assinar(exp: number, senha: string): string {
  return createHmac("sha256", senha).update(`${PREFIXO}${exp}`).digest("base64url");
}

/** tempo constante e comprimento igual: compara os SHA-256 das duas strings */
function iguais(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function senhaCorreta(enviada: unknown): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada || typeof enviada !== "string" || enviada.length === 0 || enviada.length > 200) return false;
  return iguais(enviada, esperada);
}

/** Token de sessão: "<exp>.<assinatura>". */
export function emitirSessao(senha: string, agora = Date.now()): string {
  const exp = Math.floor(agora / 1000) + VALIDADE_SESSAO_S;
  return `${exp}.${assinar(exp, senha)}`;
}

export function sessaoValida(token: string | null | undefined, senha: string | undefined, agora = Date.now()): boolean {
  if (!senha || !token) return false;
  const [expTxt, sig] = token.split(".");
  if (!expTxt || !sig || !/^\d{1,12}$/.test(expTxt)) return false;
  const exp = Number(expTxt);
  if (exp * 1000 <= agora) return false;
  return iguais(sig, assinar(exp, senha));
}

export function lerCookie(cabecalho: string | null, nome: string): string | null {
  if (!cabecalho) return null;
  for (const parte of cabecalho.split(";")) {
    const i = parte.indexOf("=");
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return null;
}

/** Set-Cookie da sessão. maxAge 0 apaga. */
export function cabecalhoCookie(token: string, maxAge = VALIDADE_SESSAO_S): string {
  return `${COOKIE_SESSAO}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

/**
 * Pedidos que MUDAM algo só valem se vierem da própria página (Origin igual
 * ao host). Defesa extra além do SameSite=Strict.
 */
function mesmaOrigem(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // chamadas sem Origin (curl, GET) não são o vetor do CSRF de navegador
  try {
    return new URL(origin).host === (req.headers.get("host") ?? "");
  } catch {
    return false;
  }
}

/** O pedido traz uma sessão válida? Usada por /api/leads e /api/painel. */
export function autorizado(req: Request): boolean {
  const senha = process.env.ADMIN_PASSWORD;
  const token = lerCookie(req.headers.get("cookie"), COOKIE_SESSAO);
  if (!sessaoValida(token, senha)) return false;
  if (req.method !== "GET" && req.method !== "HEAD" && !mesmaOrigem(req)) return false;
  return true;
}

/* ---------- limite de tentativas de login (por IP) ---------- */

const FALHAS = new Map<string, number[]>();
export const MAX_FALHAS = 5;
export const JANELA_FALHAS_MS = 15 * 60 * 1000;

export function ipDoPedido(req: Request): string {
  return (
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function recentes(ip: string, agora: number): number[] {
  const lista = (FALHAS.get(ip) ?? []).filter((t) => agora - t < JANELA_FALHAS_MS);
  if (lista.length) FALHAS.set(ip, lista);
  else FALHAS.delete(ip);
  return lista;
}

/** Segundos até poder tentar de novo; 0 se pode tentar agora. */
export function bloqueadoPor(ip: string, agora = Date.now()): number {
  const lista = recentes(ip, agora);
  if (lista.length < MAX_FALHAS) return 0;
  return Math.max(1, Math.ceil((lista[0] + JANELA_FALHAS_MS - agora) / 1000));
}

export function registrarFalha(ip: string, agora = Date.now()): void {
  const lista = recentes(ip, agora);
  lista.push(agora);
  FALHAS.set(ip, lista);
  if (FALHAS.size > 5000) FALHAS.clear(); // o mapa não cresce sem fim
}

export function limparFalhas(ip: string): void {
  FALHAS.delete(ip);
}
