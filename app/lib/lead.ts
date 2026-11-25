/* ------------------------------------------------------------------ */
/*  Regra de negócio do lead                                           */
/*                                                                     */
/*  Este arquivo é puro: não fala com o Notion nem com a rede. Recebe  */
/*  o que o formulário mandou, normaliza, deriva a categoria (área) e  */
/*  devolve o payload pronto para o Notion. Assim dá para testar a     */
/*  lógica sem depender do serviço externo.                            */
/* ------------------------------------------------------------------ */

import { AREAS, servicos, type Area } from "./catalog";
import { decidirCanal, limparToque, type Canal, type Toque } from "./origem";

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
  /** de onde o visitante veio (lido no navegador; o canal é decidido aqui) */
  origem?: { primeira?: unknown; ultima?: unknown };
  /** aparelho da equipe (?interno=1): o lead entra marcado como teste */
  interno?: boolean;
  /** formulário enxuto da home / acesso prioritário: id de INTERESSES */
  interesse?: string;
  /** nome da empresa (formulário enxuto) */
  empresa?: string;
  /** acesso prioritário Atol: segmento do negócio */
  segmento?: string;
  /** acesso prioritário Atol: quantas linhas (números) pretende conectar */
  linhas?: number | string;
};

/**
 * Os 5 interesses do formulário B2B da home + os pontos de captura do Atol.
 * O rótulo vai para a coluna "serviços" do CRM; a área define o funil.
 */
export const INTERESSES: Record<string, { label: string; area: string }> = {
  atol: { label: "Atol Connect — Lista prioritária / Sandbox / Parceiros", area: "Software" },
  "atol-prioritario": { label: "Atol Connect — Acesso prioritário (pré-aprovação Meta)", area: "Software" },
  "exit-intent": { label: "Saída da home — pediu contato da engenharia", area: "Software" },
  miseon: { label: "MiseOn — Restaurante, delivery ou totem", area: "Software" },
  mercadinhosys: { label: "MercadinhoSys — Varejo com IA", area: "Software" },
  selectsys: { label: "SelectSys Jobs — Agência / empreiteira Brasil–Japão", area: "Software" },
  "sob-medida": { label: "Software sob medida, integrações API ou BI", area: "Software" },
};

const corta = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export type LeadNormalizado = {
  nome: string;
  negocio: string;
  dor: string;
  area: string;
  servicos: string[];
  prazo: string;
  contato: string;
  idioma: "pt" | "en";
  /** canal decidido no servidor (nunca vem pronto do navegador) */
  canal: Canal;
  /** toques já limpos (só chaves conhecidas, tamanhos limitados) */
  origemPrimeira: Toque | null;
  origemUltima: Toque | null;
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
  const interesse = raw.interesse ? INTERESSES[raw.interesse] : undefined;
  const segmento = corta(raw.segmento, 80);
  const linhasNum = Math.floor(Number(raw.linhas));
  const linhas = Number.isFinite(linhasNum) && linhasNum > 0 ? Math.min(linhasNum, 10_000) : 0;

  // o formulário enxuto manda 1 linha; o interesse vira o contexto da dor
  const extras = [
    segmento && `Segmento: ${segmento}`,
    linhas > 0 && `Linhas WhatsApp: ${linhas}`,
  ].filter(Boolean);
  const dorBase = corta(raw.dor, 2000);
  const dor = interesse
    ? [`[${interesse.label}]`, dorBase, ...extras].filter(Boolean).join(" · ")
    : dorBase;

  const escolhas = Array.isArray(raw.escolhas) ? raw.escolhas.filter(Boolean) : [];
  const nome = corta(raw.nome, 120) || "Sem nome";
  const negocio = corta(raw.negocio, 200) || corta(raw.empresa, 200);
  const contato = corta(raw.contato, 160);
  const prazo = PRAZO_LABEL[raw.prazo ?? ""] ?? "Estudando";

  const servicosNomes = [
    ...(interesse ? [interesse.label] : []),
    ...(escolhas
      .map((id) => servicos.find((s) => s.id === id)?.nome.pt)
      .filter(Boolean) as string[]),
  ];

  const origemPrimeira = limparToque(raw.origem?.primeira);
  const origemUltima = limparToque(raw.origem?.ultima);

  const base = {
    nome,
    negocio,
    dor,
    servicos: servicosNomes,
    prazo,
    contato,
    idioma: (raw.idioma === "en" ? "en" : "pt") as "pt" | "en",
    area: "Indefinido",
    canal: decidirCanal(origemPrimeira, origemUltima, raw.interno === true),
    origemPrimeira,
    origemUltima,
  };

  if (interesse) {
    // captura enxuta: sem contato não há como responder
    if (contato.replace(/\D/g, "").length < 8 && !/@/.test(contato)) {
      return { ...base, valido: false, motivo: "contato_obrigatorio" };
    }
    return { ...base, area: interesse.area, valido: true };
  }

  if (dor.length < 4) {
    return { ...base, valido: false, motivo: "dor_obrigatoria" };
  }

  return { ...base, area: derivarArea(escolhas, dor), valido: true };
}

/** rótulos das áreas, exportado caso a UI queira reusar */
export const AREA_UI = AREAS;
