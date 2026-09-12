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
    const quotes = Object.values(d ?? {}).filter(
      (q) => q && typeof q.bid === "string" && Number.isFinite(parseFloat(q.bid))
    );

    if (quotes.length === 0) {
      return NextResponse.json({ error: "empty" }, { status: 502 });
    }

    const rates = quotes.map((q) => ({
      code: q.code,
      name: (q.name ?? q.code).split("/")[0].trim(),
      brl: parseFloat(q.bid),
      change: Number.isFinite(parseFloat(q.pctChange)) ? parseFloat(q.pctChange) : 0,
    }));

    // usa a atualização mais recente entre as moedas, não a primeira da lista
    const updatedAt =
      quotes
        .map((q) => q.create_date)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return NextResponse.json({ rates, updatedAt });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
