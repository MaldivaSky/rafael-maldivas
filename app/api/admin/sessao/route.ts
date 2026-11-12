import { NextResponse } from "next/server";
import {
  autorizado,
  bloqueadoPor,
  cabecalhoCookie,
  emitirSessao,
  ipDoPedido,
  limparFalhas,
  registrarFalha,
  senhaCorreta,
} from "../../../lib/admin-auth";

/**
 * Sessão do painel. POST troca a senha por um cookie HttpOnly (a senha nunca
 * volta ao navegador), GET diz se a sessão ainda vale, DELETE encerra.
 * Tentativas erradas são limitadas por IP.
 */

export const runtime = "nodejs";

const semCache = { "Cache-Control": "no-store" };

export async function GET(req: Request) {
  return NextResponse.json({ ok: autorizado(req) }, { headers: semCache });
}

export async function POST(req: Request) {
  const senhaConfigurada = process.env.ADMIN_PASSWORD;
  if (!senhaConfigurada) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503, headers: semCache });
  }

  // só aceita o formulário da própria página (defesa extra contra CSRF de login)
  const origin = req.headers.get("origin");
  if (origin) {
    let ok = false;
    try {
      ok = new URL(origin).host === (req.headers.get("host") ?? "");
    } catch {
      ok = false;
    }
    if (!ok) return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403, headers: semCache });
  }

  const ip = ipDoPedido(req);
  const espera = bloqueadoPor(ip);
  if (espera > 0) {
    return NextResponse.json(
      { ok: false, reason: "too_many_attempts", retryAfter: espera },
      { status: 429, headers: { ...semCache, "Retry-After": String(espera) } }
    );
  }

  let senha: unknown;
  try {
    senha = ((await req.json()) as { senha?: unknown }).senha;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400, headers: semCache });
  }

  if (!senhaCorreta(senha)) {
    registrarFalha(ip);
    // pequena espera: encarece cada chute sem atrapalhar quem errou uma vez
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, reason: "wrong_password" }, { status: 401, headers: semCache });
  }

  limparFalhas(ip);
  const res = NextResponse.json({ ok: true }, { headers: semCache });
  res.headers.append("Set-Cookie", cabecalhoCookie(emitirSessao(senhaConfigurada)));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true }, { headers: semCache });
  res.headers.append("Set-Cookie", cabecalhoCookie("", 0));
  return res;
}
