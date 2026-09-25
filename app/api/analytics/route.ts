import { NextResponse } from "next/server";
import { SITE_EVENTS } from "../../lib/analytics";

const allowedEvents = new Set<string>(SITE_EVENTS);

/** Emits low-cardinality, cookieless site events to the deployment's function logs. */
export async function POST(req: Request) {
  let body: { event?: unknown; path?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawPath = typeof body.path === "string" ? body.path : "/";
  const path = rawPath.startsWith("/") ? rawPath.split("?")[0].slice(0, 160) : "/";
  console.info(JSON.stringify({ metric: "site_event", event: body.event, path, at: new Date().toISOString() }));

  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
