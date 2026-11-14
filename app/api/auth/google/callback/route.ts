import { NextResponse } from "next/server";
import {
  OAUTH_TX_COOKIE_NAME,
  authSessionConfigured,
  buildOAuthTxCookieHeader,
  buildStudentCookieHeader,
  getGoogleRedirectUri,
  issueStudentSession,
  readCookieFromHeader,
  sanitizeNextPath,
  verifySignedToken,
  type OAuthTransaction,
} from "@/app/lib/student-auth";
import { oracleConfigurado, upsertAlunoGoogle } from "@/app/lib/oracle-students";

export const runtime = "nodejs";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
};

type GoogleIdClaims = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  aud?: string;
  iss?: string;
};

function decodeJwtPayload<T>(jwt: string): T | null {
  const parts = jwt.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function redirectError(req: Request, nextPath: string, reason: string) {
  const base = new URL(req.url);
  const dest = new URL(nextPath, `${base.protocol}//${base.host}`);
  dest.searchParams.set("auth_error", reason);
  const res = NextResponse.redirect(dest.toString(), 302);
  res.headers.append("Set-Cookie", buildOAuthTxCookieHeader("", 0));
  return res;
}

export async function GET(req: Request) {
  if (!authSessionConfigured()) {
    return redirectError(req, "/pt/trilha", "not_configured");
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const txCookie = readCookieFromHeader(req.headers.get("cookie"), OAUTH_TX_COOKIE_NAME);
  const tx = verifySignedToken<OAuthTransaction>(txCookie);
  const nextPath = sanitizeNextPath(tx?.next, "/pt/trilha");

  if (oauthError) {
    return redirectError(req, nextPath, "cancelled");
  }
  if (!code || !state || !tx || tx.state !== state) {
    return redirectError(req, nextPath, "invalid_state");
  }

  try {
    const redirectUri = getGoogleRedirectUri(req);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: tx.verifier,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return redirectError(req, nextPath, "token_exchange_failed");
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenData.id_token) {
      return redirectError(req, nextPath, "missing_id_token");
    }

    const claims = decodeJwtPayload<GoogleIdClaims>(tokenData.id_token);
    if (
      !claims ||
      !claims.sub ||
      !claims.email ||
      claims.email_verified !== true ||
      claims.aud !== process.env.GOOGLE_CLIENT_ID
    ) {
      return redirectError(req, nextPath, "invalid_claims");
    }

    const fallbackNome = claims.name ?? claims.email.split("@")[0] ?? "Aluno";
    const fallbackAvatar = claims.picture ?? "";
    let alunoId = `google:${claims.sub}`;
    let alunoEmail = claims.email;
    let alunoNome = fallbackNome;
    let alunoAvatar = fallbackAvatar;

    if (oracleConfigurado()) {
      try {
        const aluno = await upsertAlunoGoogle({
          googleSub: claims.sub,
          email: claims.email,
          nome: fallbackNome,
          avatarUrl: fallbackAvatar,
        });
        alunoId = aluno.id;
        alunoEmail = aluno.email;
        alunoNome = aluno.nome_certificado || aluno.nome || fallbackNome;
        alunoAvatar = aluno.avatar_url || fallbackAvatar;
      } catch (dbErr) {
        console.error("[oauth callback oracle fallback]:", String(dbErr).slice(0, 250));
      }
    }

    const sessionToken = issueStudentSession(
      alunoId,
      alunoEmail,
      undefined,
      Date.now(),
      { nome: alunoNome, avatarUrl: alunoAvatar },
    );
    const base = new URL(req.url);
    const dest = new URL(nextPath, `${base.protocol}//${base.host}`);
    dest.searchParams.set("google_linked", "1");

    const res = NextResponse.redirect(dest.toString(), 302);
    res.headers.append("Set-Cookie", buildOAuthTxCookieHeader("", 0));
    res.headers.append("Set-Cookie", buildStudentCookieHeader(sessionToken));
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (err) {
    console.error("[oauth callback] erro:", String(err).slice(0, 300));
    return redirectError(req, nextPath, "server_error");
  }
}

