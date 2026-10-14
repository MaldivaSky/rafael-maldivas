/* ------------------------------------------------------------------ */
/*  Onde os leads moram                                                */
/*                                                                     */
/*  Principal: PostgreSQL na Oracle Cloud (oracle-leads.ts).           */
/*  Reserva:   Notion (notion-leads.ts).                               */
/*                                                                     */
/*  Gravação: tenta a Oracle; se ela falhar, grava no Notion para não  */
/*  perder o contato. Só devolve erro se as duas falharem.             */
/*  Leitura/status: Oracle quando configurada; senão, Notion.          */
/* ------------------------------------------------------------------ */

import type { LeadNormalizado } from "./lead";
import {
  atualizarStatusOracle,
  criarLeadOracle,
  listarLeadsOracle,
  oracleConfigurado,
} from "./oracle-leads";
import {
  atualizarStatus as atualizarStatusNotion,
  criarLeadNotion,
  listarLeads as listarLeadsNotion,
  notionConfigurado,
  type Lead,
} from "./notion-leads";

export type Destino = "oracle" | "notion";

export const armazenamentoConfigurado = () => oracleConfigurado() || notionConfigurado();

export async function salvarLead(lead: LeadNormalizado): Promise<Destino> {
  const erros: string[] = [];

  if (oracleConfigurado()) {
    try {
      await criarLeadOracle(lead);
      return "oracle";
    } catch (e) {
      erros.push(String(e));
      console.error("[leads] oracle falhou, usando reserva:", String(e).slice(0, 200));
    }
  }

  if (notionConfigurado()) {
    try {
      await criarLeadNotion(lead);
      return "notion";
    } catch (e) {
      erros.push(String(e));
    }
  }

  throw new Error(erros.join(" | ") || "nenhum armazenamento configurado");
}

export const listarLeads = (): Promise<Lead[]> =>
  oracleConfigurado() ? listarLeadsOracle() : listarLeadsNotion();

export const atualizarStatus = (id: string, status: string): Promise<void> =>
  oracleConfigurado() ? atualizarStatusOracle(id, status) : atualizarStatusNotion(id, status);

export const origemLeitura = (): Destino => (oracleConfigurado() ? "oracle" : "notion");
