import { NextResponse } from "next/server";

/**
 * Cotação de moeda do dia, via AwesomeAPI (aberta, sem chave).
 * Usada para orçamento em dólar e em iene — é o caso dos contratos
 * com agência japonesa.
 */

export const runtime = "edge";

const PAIRS = "USD-BRL,EUR-BRL,JPY-BRL,GBP-BRL";

type Quote = {
  code: string;
  name: string;
  bid: string;
  pctChange: string;
  create_date: string;
};

export async function GET() {
  try {
    const r = await fetch(`https://economia.awesomeapi.com.br/json/last/${PAIRS}`, {
      signal: AbortSignal.timeout(9000),
      next: { revalidate: 900 }, // 15 min basta para orçamento
    });
    if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

    const d = (await r.json()) as Record<string, Quote>;

    const rates = Object.values(d).map((q) => ({
      code: q.code,
      name: q.name.split("/")[0].trim(),
      brl: parseFloat(q.bid),
      change: parseFloat(q.pctChange),
    }));

    return NextResponse.json({
      rates,
      updatedAt: Object.values(d)[0]?.create_date ?? null,
    });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
