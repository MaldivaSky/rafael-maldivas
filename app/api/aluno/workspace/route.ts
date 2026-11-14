import { NextResponse } from "next/server";
import { getStudentSessionFromRequest, sameOriginRequest } from "@/app/lib/student-auth";
import {
  getWorkspaceAluno,
  oracleConfigurado,
  upsertWorkspaceAluno,
} from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getStudentSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: true, workspace: null, localOnly: true });
  }

  const row = await getWorkspaceAluno(session.sub);
  return NextResponse.json(
    {
      ok: true,
      workspace: row?.dados ?? null,
      atualizado_em: row?.atualizado_em ?? null,
      localOnly: row === null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) {
    return NextResponse.json({ ok: false, reason: "csrf" }, { status: 403 });
  }
  const session = getStudentSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const dados =
    body.workspace && typeof body.workspace === "object" && !Array.isArray(body.workspace)
      ? (body.workspace as Record<string, unknown>)
      : null;
  if (!dados) {
    return NextResponse.json({ ok: false, reason: "invalid_workspace" }, { status: 400 });
  }

  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: true, synced: false, localOnly: true });
  }

  try {
    const synced = await upsertWorkspaceAluno(session.sub, dados);
    return NextResponse.json({ ok: true, synced });
  } catch {
    return NextResponse.json({ ok: false, reason: "payload_too_large" }, { status: 413 });
  }
}
