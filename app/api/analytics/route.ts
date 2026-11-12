import { NextResponse } from "next/server";
import { SITE_EVENTS } from "../../lib/analytics";
import { decidirCanal, limparToque } from "../../lib/origem";
import { oracleConfigurado, registrarEventoOracle } from "../../lib/oracle-leads";
import {
  caminhoLimpo,
  classificarDispositivo,
  ehRobo,
  idiomaDoCaminho,
  paisValido,
  segundosValidos,
  sessaoValida,
} from "../../lib/visita";

export const runtime = "nodejs";

const allowedEvents = new Set<string>(SITE_EVENTS);

/* rate limit simples em memória (por instância): protege o banco de enxurrada */
const HITS = new Map<string, number[]>();
const LIMITE = 240;
const JANELA = 10 * 60 * 1000;

function passouDoLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (HITS.get(ip) ?? []).filter((t) => agora - t < JANELA);
  recentes.push(agora);
  HITS.set(ip, recentes);
  if (HITS.size > 5000) HITS.clear(); // não deixa o mapa crescer sem fim
  return recentes.length > LIMITE;
}

type Corpo = {
  event?: unknown;
  path?: unknown;
  sessao?: unknown;
  origem?: { primeira?: unknown; ultima?: unknown };
  interno?: unknown;
  segundos?: unknown;
};

/**
 * Coleta de visitas, sem cookie e sem IP guardado. Descarta robôs e o
 * aparelho da equipe (?interno=1). O canal é decidido AQUI a partir da origem
 * (UTM/referrer); o navegador nunca manda o canal pronto. Grava no banco da
 * Oracle (site.eventos) e continua emitindo a linha de métrica no log da
 * Vercel. Responde sempre 204 rápido: métrica nunca quebra a página.
 */
export async function POST(req: Request) {
  let body: Corpo;
  try {
    body = (await req.json()) as Corpo;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const caminho = caminhoLimpo(body.path);
  console.info(JSON.stringify({ metric: "site_event", event: body.event, path: caminho, at: new Date().toISOString() }));

  const vazio = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });

  // não conta: robô, equipe, e quem está no painel/api
  const ua = req.headers.get("user-agent");
  if (ehRobo(ua) || body.interno === true) return vazio();
  if (caminho === "/admin" || caminho.startsWith("/admin/") || caminho.startsWith("/api")) return vazio();
  if (!oracleConfigurado()) return vazio();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  if (passouDoLimite(ip)) return vazio();

  // page_exit sem tempo útil não vale a linha
  const segundos = body.event === "page_exit" ? segundosValidos(body.segundos) : null;
  if (body.event === "page_exit" && segundos === null) return vazio();

  const primeira = limparToque(body.origem?.primeira);
  const ultima = limparToque(body.origem?.ultima);
  const canal = decidirCanal(primeira, ultima);

  try {
    await registrarEventoOracle({
      evento: body.event,
      caminho,
      canal: canal.rotulo,
      utm_content: primeira?.utm_content ?? ultima?.utm_content ?? null,
      sessao: sessaoValida(body.sessao),
      dispositivo: classificarDispositivo(ua),
      idioma: idiomaDoCaminho(caminho),
      pais: paisValido(req.headers.get("x-vercel-ip-country")),
      segundos,
    });
  } catch (e) {
    console.error("[analytics] falha ao gravar:", String(e).slice(0, 200));
  }

  return vazio();
}
