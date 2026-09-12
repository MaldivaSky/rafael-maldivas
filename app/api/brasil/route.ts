import { NextResponse } from "next/server";

/**
 * Consultas públicas brasileiras, via BrasilAPI e Banco Central.
 * Nenhuma exige chave. O proxy serve para cachear e normalizar a resposta.
 */

export const runtime = "edge";

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

async function get(url: string, revalidate: number) {
  const r = await fetch(url, { signal: AbortSignal.timeout(9000), next: { revalidate } });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

/* ---------------- domínio .com.br ---------------- */

async function dominio(q: string) {
  const name = q
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  const fqdn = /\.(com|net|org|app|dev|eco|blog|art|rec|srv|adv|med|eng)?\.?br$/.test(name)
    ? name
    : `${name.replace(/\./g, "")}.com.br`;

  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9](\.[a-z]{2,})+$/.test(fqdn)) {
    return json({ error: "invalid" }, 400);
  }

  const d = await get(`https://brasilapi.com.br/api/registrobr/v1/${fqdn}`, 600);
  return json({
    fqdn: d.fqdn ?? fqdn,
    status: d.status,
    disponivel: d.status === "AVAILABLE",
    // quando está registrado a API devolve as datas do WHOIS
    criadoEm: d["created-at"] ?? null,
    expiraEm: d["expires-at"] ?? null,
    provedor: Array.isArray(d.nameservers) ? d.nameservers.slice(0, 2) : [],
  });
}

/* ---------------- CEP ---------------- */

async function cep(q: string) {
  const c = q.replace(/\D/g, "");
  if (c.length !== 8) return json({ error: "invalid" }, 400);

  const d = await get(`https://brasilapi.com.br/api/cep/v2/${c}`, 86400);
  return json({
    cep: d.cep,
    logradouro: d.street ?? null,
    bairro: d.neighborhood ?? null,
    cidade: d.city ?? null,
    uf: d.state ?? null,
    ibge: d.ibge?.city ?? null,
    lat: d.location?.coordinates?.latitude ?? null,
    lng: d.location?.coordinates?.longitude ?? null,
  });
}

/* ---------------- feriados nacionais ---------------- */

async function feriados(q: string) {
  const year = parseInt(q, 10);
  if (!year || year < 1900 || year > 2200) return json({ error: "invalid" }, 400);

  const d = (await get(`https://brasilapi.com.br/api/feriados/v1/${year}`, 604800)) as {
    date: string;
    name: string;
  }[];

  const WD = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  return json({
    year,
    feriados: d.map((f) => {
      const dt = new Date(`${f.date}T12:00:00`);
      const wd = dt.getDay();
      return {
        data: f.date,
        nome: f.name,
        diaSemana: WD[wd],
        // feriado colado no fim de semana vira movimento diferente na operação
        emendaSexta: wd === 4,
        emendaSegunda: wd === 2,
        fimDeSemana: wd === 0 || wd === 6,
      };
    }),
  });
}

/* ---------------- IPCA acumulado em 12 meses ---------------- */

async function ipca() {
  const d = (await get(
    "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json",
    43200
  )) as { data: string; valor: string }[];

  // índice de preço compõe, não soma
  const factor = d.reduce((acc, m) => acc * (1 + parseFloat(m.valor) / 100), 1);

  return json({
    acumulado12m: (factor - 1) * 100,
    fator: factor,
    primeiroMes: d[0]?.data ?? null,
    ultimoMes: d[d.length - 1]?.data ?? null,
    meses: d.map((m) => ({ mes: m.data, variacao: parseFloat(m.valor) })),
  });
}

/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tipo = url.searchParams.get("tipo") ?? "";
  const q = url.searchParams.get("q") ?? "";

  try {
    switch (tipo) {
      case "dominio":
        return await dominio(q);
      case "cep":
        return await cep(q);
      case "feriados":
        return await feriados(q);
      case "ipca":
        return await ipca();
      default:
        return json({ error: "tipo_invalido" }, 400);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "404") return json({ error: "not_found" }, 404);
    return json({ error: "upstream" }, 502);
  }
}
