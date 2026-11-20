import { NextResponse } from "next/server";
import { agentRateLimiter, runDiagnosticArchitectAgent } from "@/app/lib/ai-agent-engine";
import type { AgentLang } from "@/app/lib/ai-agent-core";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (!agentRateLimiter.allow(`diagnostico:${ip}`)) {
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429 },
    );
  }

  let body: {
    business?: string;
    pain?: string;
    priority?: string;
    lang?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const business = typeof body.business === "string" ? body.business.trim() : "";
  const pain = typeof body.pain === "string" ? body.pain.trim() : "";
  if (business.length < 2 && pain.length < 3) {
    return NextResponse.json(
      { ok: false, reason: "missing_context" },
      { status: 400 },
    );
  }

  const lang: AgentLang = body.lang === "en" ? "en" : "pt";
  const result = await runDiagnosticArchitectAgent({
    business,
    pain,
    priority: typeof body.priority === "string" ? body.priority : undefined,
    lang,
  });

  return NextResponse.json({ ok: true, data: result });
}

