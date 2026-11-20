import { NextResponse } from "next/server";
import { agentRateLimiter, runPortfolioConciergeAgent } from "@/app/lib/ai-agent-engine";
import type { AgentLang } from "@/app/lib/ai-agent-core";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (!agentRateLimiter.allow(`concierge:${ip}`)) {
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429 },
    );
  }

  let body: { question?: string; lang?: string; contextPath?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (question.length < 2) {
    return NextResponse.json(
      { ok: false, reason: "empty_question" },
      { status: 400 },
    );
  }

  const lang: AgentLang = body.lang === "en" ? "en" : "pt";
  const result = await runPortfolioConciergeAgent({
    question,
    lang,
    contextPath: typeof body.contextPath === "string" ? body.contextPath : "/",
  });

  return NextResponse.json({ ok: true, data: result });
}

