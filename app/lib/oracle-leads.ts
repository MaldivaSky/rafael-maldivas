/* ------------------------------------------------------------------ */
/*  Leads no PostgreSQL da Oracle Cloud (via PostgREST)                */
/*                                                                     */
/*  Roda SEMPRE no servidor. O banco não tem porta pública: o acesso   */
/*  passa pelo PostgREST atrás do Caddy (HTTPS), e cada chamada leva   */
/*  um JWT de 60 s assinado aqui com ORACLE_LEADS_JWT_SECRET.          */
/*  O papel do token define o que o banco permite:                     */
/*    site_writer -> só INSERT (formulário público)                    */
/*    site_admin  -> leitura e troca de status (painel /admin)         */
/*  Schema e permissões: scripts/oracle/leads-schema.sql               */
/* ------------------------------------------------------------------ */

import { createHmac } from "node:crypto";
import type { LeadNormalizado } from "./lead";
import type { Lead } from "./notion-leads";

type Papel = "site_writer" | "site_admin";

export const oracleConfigurado = () =>
  Boolean(process.env.ORACLE_LEADS_URL && process.env.ORACLE_LEADS_JWT_SECRET);

const b64url = (v: Buffer | string) =>
  Buffer.from(v).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

/** JWT HS256 mínimo — exatamente o que o PostgREST valida. */
export function assinarToken(papel: Papel, segredo: string, agora = Date.now()): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const iat = Math.floor(agora / 1000);
  const payload = b64url(JSON.stringify({ role: papel, iat, exp: iat + 60 }));
  const assinatura = b64url(createHmac("sha256", segredo).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${assinatura}`;
}

async function chamar(papel: Papel, caminho: string, init: RequestInit = {}): Promise<Response> {
  const base = (process.env.ORACLE_LEADS_URL ?? "").replace(/\/+$/, "");
  const segredo = process.env.ORACLE_LEADS_JWT_SECRET ?? "";
  if (!base || !segredo) throw new Error("oracle não configurado");

  const r = await fetch(`${base}${caminho}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${assinarToken(papel, segredo)}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`oracle ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

/* ---------- criar (formulário) ---------- */

export async function criarLeadOracle(lead: LeadNormalizado): Promise<void> {
  await chamar("site_writer", "/leads", {
    method: "POST",
    // writer não tem SELECT: pedir a linha de volta seria negado pelo banco
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      nome: (lead.negocio || lead.nome).slice(0, 300),
      area: lead.area,
      prazo: lead.prazo,
      servicos: lead.servicos,
      contato: lead.contato.slice(0, 2000),
      negocio: lead.negocio.slice(0, 2000),
      dor: lead.dor.slice(0, 4000),
      idioma: lead.idioma === "en" ? "EN" : "PT",
      canal: "Site",
    }),
  });
}

/* ---------- listar (painel) ---------- */

type Linha = {
  id: string;
  criado_em: string;
  nome: string;
  status: string;
  area: string;
  prazo: string;
  servicos: string[];
  contato: string;
  negocio: string;
  dor: string;
  idioma: string;
  canal: string;
};

export async function listarLeadsOracle(): Promise<Lead[]> {
  const r = await chamar("site_admin", "/leads?select=*&order=criado_em.desc&limit=500");
  const linhas = (await r.json()) as Linha[];
  return linhas.map((l) => ({
    id: l.id,
    nome: l.nome,
    status: l.status,
    area: l.area,
    prazo: l.prazo,
    servicos: l.servicos ?? [],
    contato: l.contato,
    negocio: l.negocio,
    dor: l.dor,
    idioma: l.idioma,
    canal: l.canal,
    criadoEm: l.criado_em,
    url: "",
  }));
}

/* ---------- mudar status (painel) ---------- */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function atualizarStatusOracle(id: string, status: string): Promise<void> {
  if (!UUID.test(id)) throw new Error("id inválido");
  const r = await chamar("site_admin", `/leads?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status }),
  });
  const alteradas = (await r.json()) as unknown[];
  if (alteradas.length !== 1) throw new Error("lead não encontrado");
}
