import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Certificados só são emitidos após aprovação do projeto pelo instrutor no /admin.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      reason: "requires_instructor_approval",
      message:
        "Submeta o link do seu projeto em /api/aluno/avaliacao. O certificado é emitido somente após revisão e aprovação do instrutor.",
    },
    { status: 403 },
  );
}
