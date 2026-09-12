/* ------------------------------------------------------------------ */
/*  Regra de negócio do lead                                           */
/*                                                                     */
/*  Este arquivo é puro: não fala com o Notion nem com a rede. Recebe  */
/*  o que o formulário mandou, normaliza, deriva a categoria (área) e  */
/*  devolve o payload pronto para o Notion. Assim dá para testar a     */
/*  lógica sem depender do serviço externo.                            */
/* ------------------------------------------------------------------ */

import { AREAS, servicos, type Area } from "./catalog";

/** serviço escolhido -> área, montado uma vez a partir do catálogo real */
const AREA_POR_SERVICO: Record<string, Area> = Object.fromEntries(
  servicos.map((s) => [s.id, s.area])
);

/** ordem de desempate quando duas áreas empatam em número de escolhas */
const ORDEM_AREAS: Area[] = ["software", "ti", "marketing", "audiovisual"];

/** rótulo humano (PT) que vai para a coluna Area do Notion */
const AREA_LABEL: Record<Area, string> = {
  software: "Software",
  ti: "TI",
  marketing: "Marketing",
  audiovisual: "Audiovisual",
};

export type RawLead = {
  negocio?: string;
  dor?: string;
  escolhas?: string[];
  prazo?: string;
  nome?: string;
  contato?: string;
  /** idioma do site no momento do envio ("pt" | "en") */
  idioma?: string;
  /** armadilha anti-bot: se vier preenchido, é robô */
  honey?: string;
};

export type LeadNormalizado = {
  nome: string;
  negocio: string;
  dor: string;
  area: string;
  servicos: string[];
  prazo: string;
  contato: string;
  idioma: "pt" | "en";
  valido: boolean;
  motivo?: string;
};

const PRAZO_LABEL: Record<string, string> = {
  ontem: "Ontem (urgente)",
  mes: "Neste mês",
  trimestre: "Próximos 3 meses",
  estudando: "Estudando",
};

/**
 * Deriva a área (categoria do funil) a partir dos serviços escolhidos.
 * Regra, na ordem:
 *  1. Sem escolhas -> tenta adivinhar pela dor; se não der, "Indefinido".
 *  2. Com escolhas -> área mais frequente; empate segue ORDEM_AREAS.
 */
function derivarArea(escolhas: string[], dor: string): string {
  const areasEscolhidas = escolhas
    .map((id) => AREA_POR_SERVICO[id])
    .filter(Boolean) as Area[];

  if (areasEscolhidas.length > 0) {
    const contagem = new Map<Area, number>();
    for (const a of areasEscolhidas) contagem.set(a, (contagem.get(a) ?? 0) + 1);

    const max = Math.max(...contagem.values());
    const empatadas = ORDEM_AREAS.filter((a) => (contagem.get(a) ?? 0) === max);

    if (empatadas.length === 1) return AREA_LABEL[empatadas[0]];
    return "Múltiplas";
  }

  // sem escolha: palpite por palavra-chave na dor declarada
  const txt = dor.toLowerCase();
  const bate = (termos: string[]) => termos.some((t) => txt.includes(t));

  if (bate(["sistema", "estoque", "pdv", "erp", "app", "aplicativo", "banco de dados", "relatório"]))
    return "Software";
  if (bate(["e-mail", "email", "spam", "backup", "servidor", "domínio", "dominio", "site fora"]))
    return "TI";
  if (bate(["google", "anúncio", "anuncio", "ads", "instagram", "marketing", "divulgação", "logo", "marca"]))
    return "Marketing";
  if (bate(["vídeo", "video", "drone", "foto", "edição", "edicao", "conteúdo"]))
    return "Audiovisual";

  return "Indefinido";
}

export function normalizarLead(raw: RawLead): LeadNormalizado {
  const dor = (raw.dor ?? "").trim();
  const escolhas = Array.isArray(raw.escolhas) ? raw.escolhas.filter(Boolean) : [];
  const nome = (raw.nome ?? "").trim() || "Sem nome";
  const negocio = (raw.negocio ?? "").trim();
  const contato = (raw.contato ?? "").trim();
  const prazo = PRAZO_LABEL[raw.prazo ?? ""] ?? "Estudando";

  const servicosNomes = escolhas
    .map((id) => servicos.find((s) => s.id === id)?.nome.pt)
    .filter(Boolean) as string[];

  const base = {
    nome,
    negocio,
    dor,
    servicos: servicosNomes,
    prazo,
    contato,
    idioma: (raw.idioma === "en" ? "en" : "pt") as "pt" | "en",
    area: "Indefinido",
  };

  if (dor.length < 4) {
    return { ...base, valido: false, motivo: "dor_obrigatoria" };
  }

  return { ...base, area: derivarArea(escolhas, dor), valido: true };
}

/** rótulos das áreas, exportado caso a UI queira reusar */
export const AREA_UI = AREAS;
