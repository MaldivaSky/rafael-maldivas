import { NextResponse } from "next/server";

/**
 * Consulta de CNPJ na base pública da Receita Federal, via BrasilAPI.
 * Sem chave, sem cadastro. O proxy existe só para cachear e para o
 * navegador não bater direto em outro domínio.
 */

export const runtime = "edge";

export async function GET(req: Request) {
  const cnpj = (new URL(req.url).searchParams.get("cnpj") ?? "").replace(/\D/g, "");
  if (cnpj.length !== 14) {
    return NextResponse.json({ error: "invalid_cnpj" }, { status: 400 });
  }

  try {
    const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: AbortSignal.timeout(9000),
      next: { revalidate: 86400 }, // cadastro não muda de hora em hora
    });

    if (r.status === 404) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (!r.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const d = await r.json();

    return NextResponse.json({
      cnpj: d.cnpj,
      razaoSocial: d.razao_social ?? null,
      nomeFantasia: d.nome_fantasia || null,
      situacao: d.descricao_situacao_cadastral ?? null,
      dataSituacao: d.data_situacao_cadastral ?? null,
      abertura: d.data_inicio_atividade ?? null,
      porte: d.porte ?? null,
      naturezaJuridica: d.natureza_juridica ?? null,
      capitalSocial: typeof d.capital_social === "number" ? d.capital_social : null,
      cnaePrincipal: d.cnae_fiscal_descricao
        ? `${d.cnae_fiscal} — ${d.cnae_fiscal_descricao}`
        : null,
      cnaesSecundarios: (d.cnaes_secundarios ?? [])
        .slice(0, 6)
        .map((c: { codigo: number; descricao: string }) => `${c.codigo} — ${c.descricao}`),
      endereco: [
        d.descricao_tipo_de_logradouro,
        d.logradouro,
        d.numero,
        d.complemento,
        d.bairro,
      ]
        .filter(Boolean)
        .join(", "),
      municipio: d.municipio ?? null,
      uf: d.uf ?? null,
      cep: d.cep ?? null,
      telefone: d.ddd_telefone_1 || null,
      email: d.email || null,
      socios: (d.qsa ?? [])
        .slice(0, 8)
        .map((s: { nome_socio: string; qualificacao_socio: string }) => ({
          nome: s.nome_socio,
          qualificacao: s.qualificacao_socio,
        })),
      matriz: d.identificador_matriz_filial === 1,
    });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
