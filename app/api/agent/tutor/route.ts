import { NextResponse } from "next/server";
import { agentRateLimiter, runCourseTutorAgent } from "@/app/lib/ai-agent-engine";
import type { AgentLang } from "@/app/lib/ai-agent-core";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (!agentRateLimiter.allow(`tutor:${ip}`)) {
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429 },
    );
  }

  let body: {
    stationId?: string;
    lessonSlug?: string;
    studentQuery?: string;
    codeOrPayload?: string;
    lang?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const studentQuery =
    typeof body.studentQuery === "string" ? body.studentQuery.trim() : "";
  if (studentQuery.length < 2) {
    return NextResponse.json(
      { ok: false, reason: "empty_query" },
      { status: 400 },
    );
  }

  const lang: AgentLang = body.lang === "en" ? "en" : "pt";
  const result = await runCourseTutorAgent({
    stationId: typeof body.stationId === "string" ? body.stationId : "terminal",
    lessonSlug:
      typeof body.lessonSlug === "string"
        ? body.lessonSlug
        : "modulo-0-f01-o-mapa",
    studentQuery,
    codeOrPayload:
      typeof body.codeOrPayload === "string" ? body.codeOrPayload : undefined,
    lang,
  });

  return NextResponse.json({ ok: true, data: result });
}

