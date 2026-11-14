/**
 * Pure domain model for the course IDE workspace, SRS flashcards, mastery calculation,
 * and backward-compatible migration from legacy progress localStorage keys.
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export const WORKSPACE_STORAGE_KEY = "maldivas-ide-workspace-v1";
export const LEGACY_M0_STORAGE_KEY = "maldivas-curso-m0-done-v1";
export const LEGACY_M1_STORAGE_KEY = "maldivas-curso-m1-progresso-v1";
export const LEGACY_M2_STORAGE_KEY = "maldivas-curso-done-v1";

export type IdeWorkbenchTab = "terminal" | "lab" | "http" | "deploy" | "notes";
export type IdeLessonStage = "all" | "predict" | "concept" | "practice" | "quiz";
export type SrsRating = 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy
export type WorkspaceDifficultyLevel = "facil" | "mediano" | "dificil";

export interface LabProgressEntry {
  passed: boolean;
  attempts: number;
  lastRunAt: string;
}

export interface QuizScoreEntry {
  score: number;
  total: number;
  pct: number;
  updatedAt: string;
}

export interface SrsCardState {
  reps: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
  lastReviewedAt: string;
}

export interface SrsFlashcard {
  id: string;
  lessonSlug: string;
  moduleLabel: string;
  prompt: string;
  answer: string;
  pitfall: string;
}

export interface WorkspacePreferences {
  selectedLevel: WorkspaceDifficultyLevel;
  guidedMode: boolean;
  focusMode: boolean;
  activeTab: IdeWorkbenchTab;
  explorerTab: "track" | "repo" | "glossary";
}

export interface WorkspaceState {
  version: 1;
  updatedAt: string;
  completedSlugs: string[];
  deployChecklist: Record<string, boolean>;
  terminalSteps: string[];
  terminalMissions: string[];
  labsPassed: Record<string, LabProgressEntry>;
  codeDrafts: Record<string, string>;
  quizScores: Record<string, QuizScoreEntry>;
  notes: Record<string, string>;
  srs: Record<string, SrsCardState>;
  preferences: WorkspacePreferences;
}

export const COURSE_SRS_CARDS: SrsFlashcard[] = [
  {
    id: "srs-f01-stateless",
    lessonSlug: "modulo-0-f01-o-mapa",
    moduleLabel: "M0 · F01",
    prompt: "Por que o protocolo HTTP é stateless e o que o backend precisa enviar/ler para reconhecer o usuário?",
    answer: "Cada requisição HTTP é independente na rede. O cliente envia um token ou cookie de sessão assinado no cabeçalho a cada chamada para o backend validar quem ele é.",
    pitfall: "Guardar estado de sessão só em variável global da RAM do processo quebra assim que houver 2 workers ou restart.",
  },
  {
    id: "srs-f02-venv",
    lessonSlug: "modulo-0-f02-preparando-a-bancada",
    moduleLabel: "M0 · F02",
    prompt: "Qual problema real um virtualenv + requirements congelado resolve antes do primeiro deploy?",
    answer: "Isola versões exatas das bibliotecas por projeto para que produção e máquina local rodem a mesma árvore de dependências.",
    pitfall: "Usar pip install global mistura pacotes entre projetos e causa falhas silenciosas em produção.",
  },
  {
    id: "srs-f03-mvt",
    lessonSlug: "modulo-0-f03-primeiro-projeto-django",
    moduleLabel: "M0 · F03",
    prompt: "No fluxo de uma View no Django, por que nunca devemos confiar no preço enviado pelo frontend?",
    answer: "Porque qualquer usuário pode editar o JSON/HTML no DevTools; o servidor deve recalcular totais consultando o preço oficial no banco.",
    pitfall: "Aceitar total_cents direto do request body permite compra por R$ 0,01.",
  },
  {
    id: "srs-f04-drf-status",
    lessonSlug: "modulo-0-f04-primeira-api-com-drf",
    moduleLabel: "M0 · F04",
    prompt: "Qual a diferença prática entre retornar 401 Unauthorized, 403 Forbidden e 422/400 em uma API REST?",
    answer: "401 indica falta de autenticação válida; 403 indica usuário autenticado sem permissão naquele recurso; 400/422 indica erro de validação ou regra no payload.",
    pitfall: "Retornar 200 OK com { error: '...' } impede clientes, gateways e monitoramento de distinguir falha de sucesso.",
  },
  {
    id: "srs-f05-tests",
    lessonSlug: "modulo-0-f05-testes-e-git",
    moduleLabel: "M0 · F05",
    prompt: "O que deve ficar fora do histórico Git mesmo em repositório privado?",
    answer: "Segredos (.env, chaves privadas, tokens de gateway), binários pesados de build e pastas de dependências locais (.venv, node_modules).",
    pitfall: "Remover um .env em um commit posterior não apaga o segredo do histórico Git.",
  },
  {
    id: "srs-f06-boundaries",
    lessonSlug: "modulo-0-f06-lendo-um-projeto-real",
    moduleLabel: "M0 · F06",
    prompt: "Em arquitetura em camadas (View -> Service -> Model), o que NÃO deve morar dentro da View?",
    answer: "Regras de negócio complexas, cálculos financeiros multi-passo, orquestração transacional e chamadas diretas de regra em vários models.",
    pitfall: "Fat Views viram código impossível de reutilizar entre API, Webhook e Worker Celery.",
  },
  {
    id: "srs-a01-split",
    lessonSlug: "modulo-1-visao-do-negocio",
    moduleLabel: "M1 · A01",
    prompt: "Em um marketplace multi-lojista, qual é a invariante contábil fundamental de todo Split de Pagamento?",
    answer: "Soma do repasse líquido de todas as lojas + comissão retida da plataforma deve ser exatamente igual ao total pago pelo cliente, em centavos inteiros.",
    pitfall: "Usar float gera desvios de arredondamento (ex: 0.1 + 0.2 != 0.3); sempre use inteiros ou Decimal com ROUND_HALF_UP.",
  },
  {
    id: "srs-a02-ledger",
    lessonSlug: "modulo-2-modelo-de-dados",
    moduleLabel: "M2 · A02",
    prompt: "Por que Order e SubOrder são separados na modelagem de um marketplace?",
    answer: "O cliente faz 1 pagamento no checkout (Order), mas cada loja envolvida possui entrega, status logístico, repasse e nota separados (SubOrder).",
    pitfall: "Um único campo status no pedido impede que a Loja A envie hoje enquanto a Loja B ainda prepara ou cancela.",
  },
  {
    id: "srs-a03-coupon",
    lessonSlug: "modulo-2-carrinho-frete-cupom",
    moduleLabel: "M2 · A03",
    prompt: "Em que ordem segura se calcula desconto de cupom e frete por loja, e onde o desconto não pode passar?",
    answer: "Validar vigência/uso do cupom, aplicar teto máximo = subtotal elegível (nunca total negativo) e ratear proporcionalmente entre sub-pedidos sem perder 1 centavo.",
    pitfall: "Permitir desconto maior que o subtotal gera valor líquido negativo.",
  },
  {
    id: "srs-a04-lock",
    lessonSlug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
    moduleLabel: "M3 · A04",
    prompt: "Como impedir overselling quando dois clientes tentam comprar a última unidade no mesmo milissegundo?",
    answer: "Envolver leitura + validação + baixa de estoque em transaction.atomic() com SELECT ... FOR UPDATE (ou UPDATE condicional WHERE estoque >= qtd).",
    pitfall: "Checar `if product.stock >= qty:` em Python fora de lock transacional sofre condição de corrida (TOCTOU).",
  },
  {
    id: "srs-a05-money",
    lessonSlug: "modulo-3-cobrar-pix-e-cartao",
    moduleLabel: "M3 · A05",
    prompt: "Qual é a diferença entre criar uma cobrança Pix/Cartão e marcar o pedido como pago?",
    answer: "Criar a cobrança gera apenas um intent pendente no gateway; o pedido só vira PAID após confirmação criptográfica assíncrona via webhook ou consulta verificada.",
    pitfall: "Confiar no redirect de volta do navegador para marcar PAID permite fraude e perde vendas se o usuário fechar a aba.",
  },
  {
    id: "srs-a06-idempotency",
    lessonSlug: "modulo-3-confirmar-pagamento-webhook",
    moduleLabel: "M3 · A06",
    prompt: "Quais duas barreiras obrigatórias protegem um endpoint de Webhook de pagamento?",
    answer: "1) Verificação fail-closed da assinatura HMAC/mTLS antes de processar; 2) Registro único de idempotência (event_id) para que reenvios do gateway não creditem duas vezes.",
    pitfall: "Validar assinatura mas ignorar idempotência causa double-credit quando o PSP reenvia o webhook por timeout.",
  },
  {
    id: "srs-a07-refund",
    lessonSlug: "modulo-3-repasse-e-estorno",
    moduleLabel: "M3 · A07",
    prompt: "Qual invariante impede prejuízo financeiro em estornos parciais múltiplos de um mesmo pedido?",
    answer: "A soma acumulada de todos os estornos nunca pode ultrapassar (valor_pago - ja_estornado), recalculando o ajuste de repasse no ledger imutável.",
    pitfall: "Sobrescrever um campo saldo em vez de inserir lançamentos de débito/crédito apaga a trilha de auditoria.",
  },
  {
    id: "srs-a08-outbox",
    lessonSlug: "modulo-4-ciclo-de-vida-e-worker",
    moduleLabel: "M4 · A08",
    prompt: "Por que disparar uma task Celery antes do commit do banco pode fazer o worker não encontrar o pedido?",
    answer: "Porque o worker pode executar antes da transação SQL terminar o commit. Use transaction.on_commit(...) ou Outbox pattern.",
    pitfall: "Enfileirar e-mail ou NF-e direto dentro da transação também dispara tarefa fantasma se a transação sofrer rollback.",
  },
  {
    id: "srs-a09-ws-storage",
    lessonSlug: "modulo-4-tempo-real-e-midia",
    moduleLabel: "M4 · A09",
    prompt: "Por que WebSockets em produção escalável usam Redis/Channel Layer e mídias usam Object Storage (R2/S3)?",
    answer: "Workers HTTP são isolados e containers são efêmeros: Redis sincroniza mensagens entre workers e Object Storage preserva uploads fora do disco do container.",
    pitfall: "Salvar fotos de produto em pasta local do container apaga o catálogo inteiro a cada redeploy.",
  },
  {
    id: "srs-a10-deploy",
    lessonSlug: "modulo-5-infraestrutura-deploy-backup",
    moduleLabel: "M5 · A10",
    prompt: "Quando um backup de banco de dados pode ser considerado confiável?",
    answer: "Somente após testar regularmente o restore em um ambiente isolado, validando integridade de schema, dados e tempo de recuperação (RTO/RPO).",
    pitfall: "Backup sem teste de restore frequente é apenas fé — arquivos corrompidos ou permissões erradas só aparecem na crise.",
  },
  {
    id: "srs-a11-lgpd",
    lessonSlug: "modulo-6-juridico-fiscal-operacao",
    moduleLabel: "M6 · A11",
    prompt: "Em logs estruturados de produção, o que é obrigatório registrar e o que é proibido gravar?",
    answer: "Obrigatório: request_id, order_id, valor em centavos, status e código de erro. Proibido: CPF em texto claro, senha, token de sessão e número/CVV de cartão.",
    pitfall: "Logar req.body completo em caso de erro vaza credenciais e viola LGPD + PCI-DSS.",
  },
  {
    id: "srs-final-checklist",
    lessonSlug: "modulo-7-projeto-final-certificado",
    moduleLabel: "M7 · Final",
    prompt: "Qual é a definição real de Production-Ready antes de liberar tráfego pago no marketplace?",
    answer: "Invariantes financeiras testadas, webhooks assinados + idempotentes, estoque com lock atômico, rollback transacional, observabilidade sem vazamento de PII e backup restaurável.",
    pitfall: "Deploy que funciona apenas no caminho feliz em localhost falha no primeiro timeout ou duplicata real de pagamento.",
  },
];

export function createEmptyWorkspaceState(nowIso = new Date().toISOString()): WorkspaceState {
  return {
    version: 1,
    updatedAt: nowIso,
    completedSlugs: [],
    deployChecklist: {},
    terminalSteps: [],
    terminalMissions: [],
    labsPassed: {},
    codeDrafts: {},
    quizScores: {},
    notes: {},
    srs: {},
    preferences: {
      selectedLevel: "facil",
      guidedMode: true,
      focusMode: false,
      activeTab: "terminal",
      explorerTab: "track",
    },
  };
}

function uniqueStrings(items: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (typeof item === "string" && item.trim() && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

export function sanitizeWorkspaceState(raw: unknown): WorkspaceState {
  const base = createEmptyWorkspaceState();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;

  if (typeof obj.updatedAt === "string" && obj.updatedAt.trim()) {
    base.updatedAt = obj.updatedAt;
  }
  if (Array.isArray(obj.completedSlugs)) {
    base.completedSlugs = uniqueStrings(obj.completedSlugs);
  }
  if (Array.isArray(obj.terminalSteps)) {
    base.terminalSteps = uniqueStrings(obj.terminalSteps);
  }
  if (Array.isArray(obj.terminalMissions)) {
    base.terminalMissions = uniqueStrings(obj.terminalMissions);
  }
  if (obj.deployChecklist && typeof obj.deployChecklist === "object") {
    for (const [k, val] of Object.entries(obj.deployChecklist as Record<string, unknown>)) {
      if (typeof k === "string" && k.trim()) {
        base.deployChecklist[k] = Boolean(val);
      }
    }
  }
  if (obj.labsPassed && typeof obj.labsPassed === "object") {
    for (const [slug, val] of Object.entries(obj.labsPassed as Record<string, unknown>)) {
      if (!val || typeof val !== "object") continue;
      const entry = val as Record<string, unknown>;
      base.labsPassed[slug] = {
        passed: Boolean(entry.passed),
        attempts: typeof entry.attempts === "number" && Number.isFinite(entry.attempts) ? Math.max(0, Math.trunc(entry.attempts)) : 0,
        lastRunAt: typeof entry.lastRunAt === "string" ? entry.lastRunAt : base.updatedAt,
      };
    }
  }
  if (obj.codeDrafts && typeof obj.codeDrafts === "object") {
    for (const [slug, code] of Object.entries(obj.codeDrafts as Record<string, unknown>)) {
      if (typeof code === "string") {
        base.codeDrafts[slug] = code.slice(0, 40000);
      }
    }
  }
  if (obj.quizScores && typeof obj.quizScores === "object") {
    for (const [slug, val] of Object.entries(obj.quizScores as Record<string, unknown>)) {
      if (!val || typeof val !== "object") continue;
      const entry = val as Record<string, unknown>;
      const total = typeof entry.total === "number" && entry.total > 0 ? Math.trunc(entry.total) : 1;
      const score = typeof entry.score === "number" && entry.score >= 0 ? Math.min(total, Math.trunc(entry.score)) : 0;
      const pct = typeof entry.pct === "number" ? Math.max(0, Math.min(100, Math.round(entry.pct))) : Math.round((score / total) * 100);
      base.quizScores[slug] = {
        score,
        total,
        pct,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : base.updatedAt,
      };
    }
  }
  if (obj.notes && typeof obj.notes === "object") {
    for (const [slug, note] of Object.entries(obj.notes as Record<string, unknown>)) {
      if (typeof note === "string") {
        base.notes[slug] = note.slice(0, 20000);
      }
    }
  }
  if (obj.srs && typeof obj.srs === "object") {
    for (const [cardId, val] of Object.entries(obj.srs as Record<string, unknown>)) {
      if (!val || typeof val !== "object") continue;
      const entry = val as Record<string, unknown>;
      base.srs[cardId] = {
        reps: typeof entry.reps === "number" ? Math.max(0, Math.trunc(entry.reps)) : 0,
        intervalDays: typeof entry.intervalDays === "number" ? Math.max(0, entry.intervalDays) : 0,
        easeFactor: typeof entry.easeFactor === "number" ? Math.max(1.3, Math.min(3.0, entry.easeFactor)) : 2.5,
        dueAt: typeof entry.dueAt === "string" ? entry.dueAt : base.updatedAt,
        lastReviewedAt: typeof entry.lastReviewedAt === "string" ? entry.lastReviewedAt : base.updatedAt,
      };
    }
  }
  if (obj.preferences && typeof obj.preferences === "object") {
    const prefs = obj.preferences as Record<string, unknown>;
    base.preferences = {
      selectedLevel:
        prefs.selectedLevel === "mediano" || prefs.selectedLevel === "dificil"
          ? prefs.selectedLevel
          : "facil",
      guidedMode: typeof prefs.guidedMode === "boolean" ? prefs.guidedMode : true,
      focusMode: typeof prefs.focusMode === "boolean" ? prefs.focusMode : false,
      activeTab:
        prefs.activeTab === "terminal" ||
        prefs.activeTab === "lab" ||
        prefs.activeTab === "http" ||
        prefs.activeTab === "notes" ||
        prefs.activeTab === "deploy"
          ? prefs.activeTab
          : "terminal",
      explorerTab: prefs.explorerTab === "repo" || prefs.explorerTab === "glossary" ? prefs.explorerTab : "track",
    };
  }
  return base;
}

export function extractLegacyCompletedSlugsFromStorage(storage: Pick<Storage, "getItem">): string[] {
  const merged = new Set<string>();
  const readList = (key: string): string[] => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  };

  for (const slug of readList(LEGACY_M0_STORAGE_KEY)) merged.add(slug);
  for (const slug of readList(LEGACY_M1_STORAGE_KEY)) {
    merged.add(slug);
    if (slug.startsWith("modulo-1-")) merged.add("modulo-1-visao-do-negocio");
  }
  for (const slug of readList(LEGACY_M2_STORAGE_KEY)) merged.add(slug);
  return Array.from(merged);
}

export function migrateLegacyLocalProgress(storage: Pick<Storage, "getItem" | "setItem">): WorkspaceState {
  let current = createEmptyWorkspaceState();
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (raw) {
      current = sanitizeWorkspaceState(JSON.parse(raw));
    }
  } catch {
    current = createEmptyWorkspaceState();
  }

  const legacySlugs = extractLegacyCompletedSlugsFromStorage(storage);
  if (legacySlugs.length > 0) {
    const union = uniqueStrings([...current.completedSlugs, ...legacySlugs]);
    if (union.length !== current.completedSlugs.length) {
      current = {
        ...current,
        completedSlugs: union,
        updatedAt: new Date().toISOString(),
      };
      try {
        storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(current));
      } catch {
        // Ignore storage quota errors
      }
    }
  }
  return current;
}

export function mergeWorkspaceStates(local: WorkspaceState, remote: WorkspaceState | null): WorkspaceState {
  if (!remote) return local;

  const mergedCompleted = uniqueStrings([...local.completedSlugs, ...remote.completedSlugs]);

  const mergedLabs: Record<string, LabProgressEntry> = { ...remote.labsPassed };
  for (const [slug, lEntry] of Object.entries(local.labsPassed)) {
    const rEntry = mergedLabs[slug];
    if (!rEntry) {
      mergedLabs[slug] = lEntry;
    } else {
      mergedLabs[slug] = {
        passed: lEntry.passed || rEntry.passed,
        attempts: Math.max(lEntry.attempts, rEntry.attempts),
        lastRunAt: lEntry.lastRunAt >= rEntry.lastRunAt ? lEntry.lastRunAt : rEntry.lastRunAt,
      };
    }
  }

  const mergedQuizzes: Record<string, QuizScoreEntry> = { ...remote.quizScores };
  for (const [slug, lQuiz] of Object.entries(local.quizScores)) {
    const rQuiz = mergedQuizzes[slug];
    if (!rQuiz || lQuiz.pct >= rQuiz.pct) {
      mergedQuizzes[slug] = lQuiz;
    }
  }

  const mergedSrs: Record<string, SrsCardState> = { ...remote.srs };
  for (const [id, lSrs] of Object.entries(local.srs)) {
    const rSrs = mergedSrs[id];
    if (!rSrs || lSrs.lastReviewedAt >= rSrs.lastReviewedAt) {
      mergedSrs[id] = lSrs;
    }
  }

  const localIsNewer = local.updatedAt >= remote.updatedAt;
  const mergedDrafts = localIsNewer
    ? { ...remote.codeDrafts, ...local.codeDrafts }
    : { ...local.codeDrafts, ...remote.codeDrafts };
  const mergedNotes = localIsNewer
    ? { ...remote.notes, ...local.notes }
    : { ...local.notes, ...remote.notes };

  const mergedDeployChecklist: Record<string, boolean> = { ...remote.deployChecklist };
  for (const [k, v] of Object.entries(local.deployChecklist)) {
    mergedDeployChecklist[k] = Boolean(v || mergedDeployChecklist[k]);
  }

  return {
    version: 1,
    updatedAt: localIsNewer ? local.updatedAt : remote.updatedAt,
    completedSlugs: mergedCompleted,
    deployChecklist: mergedDeployChecklist,
    terminalSteps: uniqueStrings([...local.terminalSteps, ...remote.terminalSteps]),
    terminalMissions: uniqueStrings([...local.terminalMissions, ...remote.terminalMissions]),
    labsPassed: mergedLabs,
    codeDrafts: mergedDrafts,
    quizScores: mergedQuizzes,
    notes: mergedNotes,
    srs: mergedSrs,
    preferences: localIsNewer ? local.preferences : remote.preferences,
  };
}

/**
 * SM-2 lite spaced-repetition scheduler.
 * Ratings: 1 = Again (0d), 2 = Hard (1d), 3 = Good (1d -> 3d -> ivl * ease), 4 = Easy (4d -> ivl * ease * 1.3)
 */
export function scheduleSrsCard(
  prev: SrsCardState | undefined,
  rating: SrsRating,
  nowMs = Date.now(),
): SrsCardState {
  const prevEase = prev?.easeFactor ?? 2.5;
  const prevReps = prev?.reps ?? 0;
  const prevInterval = prev?.intervalDays ?? 0;

  let reps = prevReps;
  let intervalDays = 0;
  let easeFactor = prevEase;

  if (rating === 1) {
    reps = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, prevEase - 0.2);
  } else if (rating === 2) {
    reps = prevReps + 1;
    intervalDays = prevReps === 0 ? 1 : Math.max(1, Math.round(prevInterval * 1.2));
    easeFactor = Math.max(1.3, prevEase - 0.08);
  } else if (rating === 3) {
    reps = prevReps + 1;
    if (prevReps === 0) intervalDays = 1;
    else if (prevReps === 1) intervalDays = 3;
    else intervalDays = Math.max(3, Math.round(prevInterval * prevEase));
  } else {
    reps = prevReps + 1;
    if (prevReps === 0) intervalDays = 4;
    else if (prevReps === 1) intervalDays = 6;
    else intervalDays = Math.max(5, Math.round(prevInterval * prevEase * 1.3));
    easeFactor = Math.min(2.8, prevEase + 0.1);
  }

  const dueMs = nowMs + intervalDays * 24 * 60 * 60 * 1000;
  return {
    reps,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueAt: new Date(dueMs).toISOString(),
    lastReviewedAt: new Date(nowMs).toISOString(),
  };
}

export function isSrsCardDue(state: SrsCardState | undefined, nowMs = Date.now()): boolean {
  if (!state) return true;
  const dueMs = Date.parse(state.dueAt);
  if (!Number.isFinite(dueMs)) return true;
  return dueMs <= nowMs;
}

export function countDueSrsCards(
  workspace: WorkspaceState,
  nowMs = Date.now(),
  cards: SrsFlashcard[] = COURSE_SRS_CARDS,
): { dueNow: number; total: number; mastered: number } {
  let dueNow = 0;
  let mastered = 0;
  for (const card of cards) {
    const entry = workspace.srs[card.id];
    if (isSrsCardDue(entry, nowMs)) dueNow += 1;
    if (entry && entry.reps >= 2 && entry.intervalDays >= 3) mastered += 1;
  }
  return { dueNow, total: cards.length, mastered };
}

export interface LessonMastery {
  labPassed: boolean;
  quizPct: number | null;
  quizPassed: boolean;
  noteSaved: boolean;
  completed: boolean;
  readyForCompletion: boolean;
}

export function computeLessonMastery(slug: string, workspace: WorkspaceState): LessonMastery {
  const labPassed = Boolean(workspace.labsPassed[slug]?.passed);
  const quizEntry = workspace.quizScores[slug];
  const quizPct = quizEntry ? quizEntry.pct : null;
  const quizPassed = quizPct !== null && quizPct >= 70;
  const noteSaved = Boolean(workspace.notes[slug] && workspace.notes[slug].trim().length > 0);
  const completed = workspace.completedSlugs.includes(slug);
  const readyForCompletion = labPassed && (quizPct === null || quizPassed);

  return {
    labPassed,
    quizPct,
    quizPassed,
    noteSaved,
    completed,
    readyForCompletion,
  };
}
