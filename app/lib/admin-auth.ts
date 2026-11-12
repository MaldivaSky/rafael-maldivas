import { timingSafeEqual } from "node:crypto";

/**
 * Senha do painel (/admin): ADMIN_PASSWORD, enviada no header `x-admin-key`.
 * Vive só no servidor. Usada por /api/leads e /api/painel.
 */
export function autorizado(req: Request): boolean {
  const esperado = process.env.ADMIN_PASSWORD;
  if (!esperado) return false;
  const enviado = Buffer.from(req.headers.get("x-admin-key") ?? "");
  const certo = Buffer.from(esperado);
  // tempo constante: não deixa medir quantos caracteres acertou
  return enviado.length === certo.length && timingSafeEqual(enviado, certo);
}
