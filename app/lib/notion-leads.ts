/* ------------------------------------------------------------------ */
/*  Leitura e escrita de leads no Notion                               */
/*                                                                     */
/*  Roda SEMPRE no servidor: usa o NOTION_TOKEN, que nunca pode chegar */
/*  ao navegador. O Notion é usado só como banco; a tela é nossa.     */
/* ------------------------------------------------------------------ */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export type Lead = {
  id: string;
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
  criadoEm: string;
  url: string;
};

export const STATUS_OPCOES = [
  "Novo",
  "Em contato",
  "Proposta enviada",
  "Ganho",
  "Perdido",
  "Descartado",
] as const;

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

/* ---------- helpers de leitura de propriedade ---------- */

/* eslint-disable @typescript-eslint/no-explicit-any */
const titulo = (p: any): string => p?.title?.map((t: any) => t.plain_text).join("") ?? "";
const rich = (p: any): string => p?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
const select = (p: any): string => p?.select?.name ?? "";
const multi = (p: any): string[] => p?.multi_select?.map((m: any) => m.name) ?? [];

function mapPage(page: any): Lead {
  const p = page.properties ?? {};
  return {
    id: page.id,
    nome: titulo(p.Nome) || "Sem nome",
    status: select(p.Status),
    area: select(p.Area),
    prazo: select(p.Prazo),
    servicos: multi(p.Servicos),
    contato: rich(p.Contato),
    negocio: rich(p.Negocio),
    dor: rich(p.Dor),
    idioma: select(p.Idioma),
    canal: select(p.Canal),
    criadoEm: page.created_time ?? p["Criado em"]?.created_time ?? "",
    url: page.url ?? "",
  };
}

/* ---------- listar ---------- */

export async function listarLeads(): Promise<Lead[]> {
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!dbId) throw new Error("NOTION_DATABASE_ID não configurado");

  const r = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 100,
    }),
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`notion query ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return (data.results ?? []).map(mapPage);
}

/* ---------- mudar status ---------- */

export async function atualizarStatus(pageId: string, status: string): Promise<void> {
  const r = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ properties: { Status: { select: { name: status } } } }),
    signal: AbortSignal.timeout(9000),
  });

  if (!r.ok) throw new Error(`notion patch ${r.status}: ${await r.text()}`);
}
