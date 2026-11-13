import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/* ------------------------------------------------------------------ */
/*  Autenticação do Aluno (Google OAuth 2.0 + PKCE + Cookie HttpOnly)  */
/*                                                                     */
/*  Segue o mesmo princípio do /admin: zero segredos ou tokens OAuth   */
/*  expostos ao navegador. O servidor troca o `code` com o Google,     */
/*  valida o `id_token`, grava/atualiza o aluno no Oracle PostgreSQL   */
/*  e emite um cookie HttpOnly assinado com HMAC-SHA256.               */
/* ------------------------------------------------------------------ */

export const STUDENT_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-mt_aluno" : "mt_aluno";
export const OAUTH_TX_COOKIE_NAME = "mt_oauth_tx";
export const STUDENT_SESSION_TTL_S = 30 * 24 * 60 * 60; // 30 dias
export const OAUTH_TX_TTL_S = 5 * 60; // 5 minutos

export type StudentSessionPayload = {
  sub: string; // UUID do aluno em site.alunos
  email: string;
  exp: number; // Unix timestamp em segundos
};

export type OAuthTransaction = {
  state: string;
  verifier: string;
  next: string;
  exp: number;
};

function getSessionSecret(): string {
  const s = process.env.AUTH_SESSION_SECRET ?? "";
  if (!s || s.length < 16) {
    throw new Error("AUTH_SESSION_SECRET não configurado");
  }
  return s;
}

export function authSessionConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SESSION_SECRET &&
      process.env.AUTH_SESSION_SECRET.length >= 16 &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET,
  );
}

function signPayload(dataB64: string, secret: string): string {
  return createHmac("sha256", secret).update(dataB64).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function createSignedToken<T extends { exp: number }>(
  payload: T,
  secret = getSessionSecret(),
): string {
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = signPayload(data, secret);
  return `${data}.${sig}`;
}

export function verifySignedToken<T extends { exp: number }>(
  token: string | null | undefined,
  secret = process.env.AUTH_SESSION_SECRET,
  nowMs = Date.now(),
): T | null {
  if (!secret || !token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  if (!data || !sig) return null;
  const expected = signPayload(data, secret);
  if (!safeEqual(sig, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T;
    if (!parsed || typeof parsed.exp !== "number") return null;
    if (parsed.exp * 1000 <= nowMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function issueStudentSession(
  alunoId: string,
  email: string,
  secret = getSessionSecret(),
  nowMs = Date.now(),
): string {
  const exp = Math.floor(nowMs / 1000) + STUDENT_SESSION_TTL_S;
  return createSignedToken<StudentSessionPayload>({ sub: alunoId, email, exp }, secret);
}

export function verifyStudentSession(
  token: string | null | undefined,
  secret = process.env.AUTH_SESSION_SECRET,
  nowMs = Date.now(),
): StudentSessionPayload | null {
  const payload = verifySignedToken<StudentSessionPayload>(token, secret, nowMs);
  if (!payload || typeof payload.sub !== "string" || typeof payload.email !== "string") {
    return null;
  }
  return payload;
}

export function readCookieFromHeader(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) {
      return decodeURIComponent(part.slice(i + 1).trim());
    }
  }
  return null;
}

export function buildStudentCookieHeader(
  token: string,
  maxAge = STUDENT_SESSION_TTL_S,
  isProd = process.env.NODE_ENV === "production",
): string {
  const name = isProd ? "__Host-mt_aluno" : "mt_aluno";
  const secure = isProd ? "; Secure" : "";
  return `${name}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

export function buildOAuthTxCookieHeader(
  token: string,
  maxAge = OAUTH_TX_TTL_S,
  isProd = process.env.NODE_ENV === "production",
): string {
  const secure = isProd ? "; Secure" : "";
  return `${OAUTH_TX_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

/** Evita open-redirect: aceita apenas caminhos relativos internos. */
export function sanitizeNextPath(raw: string | null | undefined, fallback = "/pt/trilha"): string {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed.slice(0, 300);
}

export function generatePkcePair(): { verifier: string; challenge: string; state: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const state = randomBytes(24).toString("base64url");
  return { verifier, challenge, state };
}

export function getStudentSessionFromRequest(req: Request): StudentSessionPayload | null {
  const header = req.headers.get("cookie");
  const token =
    readCookieFromHeader(header, "__Host-mt_aluno") ??
    readCookieFromHeader(header, "mt_aluno");
  return verifyStudentSession(token);
}

export function sameOriginRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("host") ?? "");
  } catch {
    return false;
  }
}

export function getGoogleRedirectUri(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const base =
    process.env.NODE_ENV === "production" && envUrl
      ? envUrl
      : host
        ? `${proto}://${host}`
        : envUrl || "http://localhost:3000";
  return `${base}/api/auth/google/callback`;
}

