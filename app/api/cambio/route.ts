import { NextResponse } from "next/server";

/**
 * Cotação de moeda do dia, via AwesomeAPI (aberta, sem chave).
 * Usada para orçamento em dólar e em iene — é o caso dos contratos
 * com agência japonesa.
 *
 * Runtime Node (padrão), NÃO edge: no Edge Runtime da Vercel o cache de
 * CDN acaba guardando a resposta de erro (502) e a ferramenta fica
 * travada em produção, mesmo funcionando no localhost. Como é uma
 * chamada HTTP simples e cacheada, o runtime Node é mais previsível.
 */

export const runtime = "nodejs";

// revalida o conteúdo a cada 15 min; depois serve do cache sem bater no upstream
export const revalidate = 900;

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
      signal: AbortSignal.timeout(12000),
      next: { revalidate: 900 }, // 15 min basta para orçamento
      headers: { Accept: "application/json" },
    });

    if (!r.ok) {
      // erro não fica preso no CDN
      return NextResponse.json(
        { error: "upstream", status: r.status },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const d = (await r.json()) as Record<string, Quote>;
    const quotes = Object.values(d ?? {}).filter(
      (q) => q && typeof q.bid === "string" && Number.isFinite(parseFloat(q.bid))
    );

    if (quotes.length === 0) {
      return NextResponse.json(
        { error: "empty" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
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

    return NextResponse.json(
      { rates, updatedAt },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json(
      { error: "upstream" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
