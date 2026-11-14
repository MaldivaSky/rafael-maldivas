import { NextResponse } from "next/server";
import {
  buildAdmissionCookieHeader,
  buildStudentCookieHeader,
  sameOriginRequest,
} from "@/app/lib/student-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) {
    return NextResponse.json({ ok: false, reason: "csrf" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", buildStudentCookieHeader("", 0));
  res.headers.append("Set-Cookie", buildAdmissionCookieHeader("", 0));
  return res;
}

