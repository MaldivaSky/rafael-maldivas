import { NextResponse } from "next/server";
import {
  OAUTH_TX_TTL_S,
  authSessionConfigured,
  buildOAuthTxCookieHeader,
  createSignedToken,
  generatePkcePair,
  getGoogleRedirectUri,
  sanitizeNextPath,
  type OAuthTransaction,
} from "@/app/lib/student-auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!authSessionConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "oauth_not_configured" },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const next = sanitizeNextPath(url.searchParams.get("next"), "/pt/trilha");
  const { verifier, challenge, state } = generatePkcePair();
  const redirectUri = getGoogleRedirectUri(req);

  const txToken = createSignedToken<OAuthTransaction>({
    state,
    verifier,
    next,
    exp: Math.floor(Date.now() / 1000) + OAUTH_TX_TTL_S,
  });

  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("code_challenge", challenge);
  googleUrl.searchParams.set("code_challenge_method", "S256");
  googleUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(googleUrl.toString(), 302);
  res.headers.append("Set-Cookie", buildOAuthTxCookieHeader(txToken));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

