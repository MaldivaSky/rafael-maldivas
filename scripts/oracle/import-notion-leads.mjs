#!/usr/bin/env node
/* ------------------------------------------------------------------ */
/*  Copia os leads do Notion para o PostgreSQL da Oracle.              */
/*                                                                     */
/*  Idempotente: cada página leva o notion_id; rodar de novo não       */
/*  duplica (ON CONFLICT DO NOTHING). Preserva data de criação e       */
/*  status. Não apaga nada do Notion.                                  */
/*                                                                     */
/*  Variáveis: NOTION_TOKEN, NOTION_DATABASE_ID, ORACLE_LEADS_URL,     */
/*  ORACLE_LEADS_JWT_SECRET (lidas do ambiente ou de --env <arquivo>). */
/*  Uso: node scripts/oracle/import-notion-leads.mjs --env .env.local  */
/*                                       --env .env.oracle-leads.local */
/* ------------------------------------------------------------------ */

import { createHmac } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] !== "--env" || !existsSync(args[i + 1] ?? "")) continue;
  for (const linha of readFileSync(args[i + 1], "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(linha);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { NOTION_TOKEN, NOTION_DATABASE_ID, ORACLE_LEADS_URL, ORACLE_LEADS_JWT_SECRET } = process.env;
for (const [k, v] of Object.entries({ NOTION_TOKEN, NOTION_DATABASE_ID, ORACLE_LEADS_URL, ORACLE_LEADS_JWT_SECRET })) {
  if (!v) throw new Error(`faltando ${k}`);
}

const b64url = (v) => Buffer.from(v).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
function token() {
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const iat = Math.floor(Date.now() / 1000);
  const p = b64url(JSON.stringify({ role: "site_admin", iat, exp: iat + 120 }));
  return `${h}.${p}.${b64url(createHmac("sha256", ORACLE_LEADS_JWT_SECRET).update(`${h}.${p}`).digest())}`;
}

const NOTION_API = process.env.NOTION_API_URL || "https://api.notion.com/v1";
const STATUS = ["Novo", "Em contato", "Proposta enviada", "Ganho", "Perdido", "Descartado"];
const txt = (p) => (p?.title ?? p?.rich_text ?? []).map((t) => t.plain_text).join("");

async function paginasNotion() {
  const todas = [];
  let cursor;
  do {
    const r = await fetch(`${NOTION_API}/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!r.ok) throw new Error(`notion ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const d = await r.json();
    todas.push(...d.results);
    cursor = d.has_more ? d.next_cursor : undefined;
  } while (cursor);
  return todas;
}

const paginas = await paginasNotion();
const linhas = paginas.map((pg) => {
  const p = pg.properties ?? {};
  const status = p.Status?.select?.name;
  return {
    notion_id: pg.id,
    criado_em: pg.created_time,
    nome: (txt(p.Nome) || "Sem nome").slice(0, 300),
    status: STATUS.includes(status) ? status : "Novo",
    area: (p.Area?.select?.name || "Indefinido").slice(0, 60),
    prazo: (p.Prazo?.select?.name || "Estudando").slice(0, 60),
    servicos: (p.Servicos?.multi_select ?? []).map((m) => m.name),
    contato: txt(p.Contato).slice(0, 2000),
    negocio: txt(p.Negocio).slice(0, 2000),
    dor: txt(p.Dor).slice(0, 4000),
    idioma: p.Idioma?.select?.name === "EN" ? "EN" : "PT",
    canal: (p.Canal?.select?.name || "Site").slice(0, 60),
  };
});

console.log(`Notion: ${linhas.length} leads encontrados`);
if (linhas.length) {
  const base = ORACLE_LEADS_URL.replace(/\/+$/, "");
  const r = await fetch(`${base}/leads?on_conflict=notion_id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(linhas),
  });
  if (!r.ok) throw new Error(`oracle ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

const conf = await fetch(`${ORACLE_LEADS_URL.replace(/\/+$/, "")}/leads?select=notion_id`, {
  headers: { Authorization: `Bearer ${token()}` },
});
const naOracle = new Set((await conf.json()).map((l) => l.notion_id).filter(Boolean));
const faltando = linhas.filter((l) => !naOracle.has(l.notion_id));
console.log(`Oracle: ${naOracle.size} leads vindos do Notion; faltando: ${faltando.length}`);
process.exitCode = faltando.length ? 1 : 0;
