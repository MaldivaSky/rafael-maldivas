/**
 * Cliente da API de plataforma da Atol Connect (connect.maldivastech.dev/api/platform).
 * Só roda no servidor: o token nunca chega ao navegador.
 */
const BASE = (process.env.ATOL_PLATFORM_URL ?? "https://connect.maldivastech.dev").replace(/\/$/, "");

export async function atolFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.ATOL_PLATFORM_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: { code: "not_configured", message: "ATOL_PLATFORM_TOKEN não configurado." } }), { status: 503 });
  }
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");
  return fetch(`${BASE}/api/platform${path}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15_000) });
}
