"use client";

import { useMemo, useState } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Eye,
  CheckCircle2,
  XCircle,
  Send,
  CopyCheck,
  BookMarked,
  Brain,
  Terminal,
  TerminalSquare,
  Globe,
  Loader2,
  Rocket,
} from "lucide-react";
import { TERMINAL_MISSIONS } from "../../lib/terminal-sim";
import {
  COURSE_LABS,
  HTTP_LAB_SCENARIOS,
  createInitialHttpSandboxState,
  executeHttpLabRequest,
  type HttpLabResponse,
  type HttpSandboxState,
} from "../../lib/course-labs";
import {
  COURSE_SRS_CARDS,
  countDueSrsCards,
  isSrsCardDue,
  scheduleSrsCard,
  type IdeWorkbenchTab,
  type SrsRating,
  type WorkspaceDifficultyLevel,
  type WorkspaceState,
} from "../../lib/course-workspace";
import { getDeployCardsForLevel } from "../../lib/course-levels";
import { isPyodideLoaded, runPythonLab, type LabRunOutput } from "../../lib/pyodide-runner";
import { FreeDeployGuidePanel } from "./FreeDeployGuidePanel";
import { IdeCodeEditor } from "./IdeCodeEditor";
import { InteractiveFlipDeck } from "./InteractiveFlipDeck";
import { InteractiveTerminalLab } from "./InteractiveTerminalLab";

interface IdeWorkbenchProps {
  lessonSlug: string;
  workspace: WorkspaceState;
  onChangeTab: (tab: IdeWorkbenchTab) => void;
  onUpdateCodeDraft: (slug: string, code: string) => void;
  onRecordLabResult: (slug: string, passed: boolean) => void;
  onUpdateNotes: (slug: string, text: string) => void;
  onReviewSrsCard: (cardId: string, rating: SrsRating) => void;
  onToggleDeployStep: (stepId: string) => void;
  onRecordTerminalProgress?: (stepIds: string[], missionIds: string[]) => void;
  onChangeLevel: (level: WorkspaceDifficultyLevel) => void;
  forcedTab?: IdeWorkbenchTab;
  hideTabBar?: boolean;
}

function formatCents(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export function IdeWorkbench({
  lessonSlug,
  workspace,
  onChangeTab,
  onUpdateCodeDraft,
  onRecordLabResult,
  onUpdateNotes,
  onReviewSrsCard,
  onToggleDeployStep,
  onRecordTerminalProgress,
  onChangeLevel,
  forcedTab,
  hideTabBar = false,
}: IdeWorkbenchProps) {
  const lab = COURSE_LABS[lessonSlug] ?? Object.values(COURSE_LABS)[0];
  const activeTab = forcedTab ?? workspace.preferences.activeTab;
  const selectedLevel = workspace.preferences.selectedLevel;
  const deployDoneCount = getDeployCardsForLevel(selectedLevel).filter(
    (c) => workspace.deployChecklist[c.id],
  ).length;
  const deployTotalCount = getDeployCardsForLevel(selectedLevel).length;

  // Python / SQL Lab state
  const currentCode = workspace.codeDrafts[lessonSlug] ?? lab.starterCode;
  const [runningPy, setRunningPy] = useState(false);
  const [pyReady, setPyReady] = useState(() => isPyodideLoaded());
  const [runOutput, setRunOutput] = useState<LabRunOutput | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // HTTP / Webhook Sandbox state
  const [httpState, setHttpState] = useState<HttpSandboxState>(() => createInitialHttpSandboxState());
  const defaultScenario = useMemo(
    () =>
      HTTP_LAB_SCENARIOS.find((s) => s.lessonSlugs.includes(lessonSlug)) ?? HTTP_LAB_SCENARIOS[1],
    [lessonSlug],
  );
  const [httpMethod, setHttpMethod] = useState<"GET" | "POST">(defaultScenario.method);
  const [httpPath, setHttpPath] = useState(defaultScenario.path);
  const [httpHeadersText, setHttpHeadersText] = useState(() =>
    JSON.stringify(defaultScenario.headers, null, 2),
  );
  const [httpBodyText, setHttpBodyText] = useState(defaultScenario.bodyText);
  const [httpResponse, setHttpResponse] = useState<HttpLabResponse | null>(null);
  const [httpHeaderParseError, setHttpHeaderParseError] = useState("");
  const [completedHttpMissions, setCompletedHttpMissions] = useState<Record<string, boolean>>({});

  // SRS state
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const srsStats = useMemo(() => countDueSrsCards(workspace), [workspace]);

  const activeSrsCard = useMemo(() => {
    const lessonCard = COURSE_SRS_CARDS.find((c) => c.lessonSlug === lessonSlug);
    if (lessonCard && isSrsCardDue(workspace.srs[lessonCard.id])) {
      return lessonCard;
    }
    const nextDue = COURSE_SRS_CARDS.find((c) => isSrsCardDue(workspace.srs[c.id]));
    return nextDue ?? lessonCard ?? COURSE_SRS_CARDS[0];
  }, [lessonSlug, workspace.srs]);

  async function handleRunPython() {
    if (runningPy) return;
    setRunningPy(true);
    const result = await runPythonLab(currentCode, lab.testRunnerCode);
    setPyReady(isPyodideLoaded());
    setRunOutput(result);
    onRecordLabResult(lessonSlug, result.allPassed);
    setRunningPy(false);
  }

  function handleResetCode() {
    onUpdateCodeDraft(lessonSlug, lab.starterCode);
    setRunOutput(null);
    setShowSolution(false);
    setHintLevel(0);
  }

  function applyScenario(scenarioId: string) {
    const found = HTTP_LAB_SCENARIOS.find((s) => s.id === scenarioId);
    if (!found) return;
    setHttpMethod(found.method);
    setHttpPath(found.path);
    setHttpHeadersText(JSON.stringify(found.headers, null, 2));
    setHttpBodyText(found.bodyText);
    setHttpHeaderParseError("");
  }

  function parseHeaders(): Record<string, string> | null {
    if (!httpHeadersText.trim()) return {};
    try {
      const raw = JSON.parse(httpHeadersText);
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        setHttpHeaderParseError("Headers devem ser um objeto JSON válido.");
        return null;
      }
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        out[k] = String(v ?? "");
      }
      setHttpHeaderParseError("");
      return out;
    } catch {
      setHttpHeaderParseError("JSON inválido no campo Headers.");
      return null;
    }
  }

  function recordMissionTelemetry(res: HttpLabResponse, methodUsed: "GET" | "POST", pathUsed: string) {
    setCompletedHttpMissions((prev) => {
      const next = { ...prev };
      if (methodUsed === "POST" && pathUsed === "/api/v1/orders" && res.status === 201) {
        next["m1-order"] = true;
      }
      if (methodUsed === "POST" && pathUsed === "/api/v1/orders" && res.status === 409) {
        next["m2-race"] = true;
      }
      if (methodUsed === "POST" && pathUsed === "/api/v1/webhooks/efi" && res.status === 401) {
        next["m3-hmac"] = true;
      }
      if (methodUsed === "POST" && pathUsed === "/api/v1/webhooks/efi" && res.status === 200) {
        next["m4-idempotency"] = true;
      }
      return next;
    });
  }

  function handleSendHttp(repeatTimes = 1) {
    const headers = parseHeaders();
    if (!headers) return;
    let workingState = httpState;
    let lastRes: HttpLabResponse | null = null;
    for (let i = 0; i < repeatTimes; i++) {
      lastRes = executeHttpLabRequest(workingState, {
        method: httpMethod,
        path: httpPath,
        headers,
        bodyText: httpBodyText,
      });
      workingState = lastRes.nextState;
      recordMissionTelemetry(lastRes, httpMethod, httpPath);
    }
    setHttpState(workingState);
    if (lastRes) setHttpResponse(lastRes);
  }

  function runGuidedHttpMission(missionKey: "m1-order" | "m2-race" | "m3-hmac" | "m4-idempotency") {
    let workingState = httpState;
    let lastRes: HttpLabResponse | null = null;

    if (missionKey === "m1-order") {
      if (workingState.orders["ord-1001"]) {
        workingState = createInitialHttpSandboxState();
      }
      const hdrs = { Authorization: "Bearer aluno-token" };
      const body = JSON.stringify(
        { orderId: "ord-1001", items: [{ productId: "cafeteira-pro", qty: 1 }], couponCode: "BEMVINDO10" },
        null,
        2,
      );
      setHttpMethod("POST");
      setHttpPath("/api/v1/orders");
      setHttpHeadersText(JSON.stringify(hdrs, null, 2));
      setHttpBodyText(body);
      setHttpHeaderParseError("");
      lastRes = executeHttpLabRequest(workingState, { method: "POST", path: "/api/v1/orders", headers: hdrs, bodyText: body });
      workingState = lastRes.nextState;
      recordMissionTelemetry(lastRes, "POST", "/api/v1/orders");
    } else if (missionKey === "m2-race") {
      const hdrs = { Authorization: "Bearer aluno-token" };
      const body = JSON.stringify(
        { orderId: "ord-race-2", items: [{ productId: "cafeteira-pro", qty: 2 }] },
        null,
        2,
      );
      setHttpMethod("POST");
      setHttpPath("/api/v1/orders");
      setHttpHeadersText(JSON.stringify(hdrs, null, 2));
      setHttpBodyText(body);
      setHttpHeaderParseError("");
      for (let i = 0; i < 2; i++) {
        lastRes = executeHttpLabRequest(workingState, { method: "POST", path: "/api/v1/orders", headers: hdrs, bodyText: body });
        workingState = lastRes.nextState;
        recordMissionTelemetry(lastRes, "POST", "/api/v1/orders");
        if (lastRes.status === 409) break;
      }
    } else if (missionKey === "m3-hmac") {
      const hdrs = { "X-Webhook-Signature": "assinatura-forjada", "Idempotency-Key": "evt-pix-forged" };
      const body = JSON.stringify({ orderId: "ord-1001", status: "CONCLUIDA" }, null, 2);
      setHttpMethod("POST");
      setHttpPath("/api/v1/webhooks/efi");
      setHttpHeadersText(JSON.stringify(hdrs, null, 2));
      setHttpBodyText(body);
      setHttpHeaderParseError("");
      lastRes = executeHttpLabRequest(workingState, { method: "POST", path: "/api/v1/webhooks/efi", headers: hdrs, bodyText: body });
      workingState = lastRes.nextState;
      recordMissionTelemetry(lastRes, "POST", "/api/v1/webhooks/efi");
    } else {
      if (!workingState.orders["ord-1001"]) {
        const seedRes = executeHttpLabRequest(workingState, {
          method: "POST",
          path: "/api/v1/orders",
          headers: { Authorization: "Bearer aluno-token" },
          bodyText: JSON.stringify({ orderId: "ord-1001", items: [{ productId: "cafeteira-pro", qty: 1 }] }),
        });
        workingState = seedRes.nextState;
      }
      const hdrs = { "X-Webhook-Signature": "secret-ok", "Idempotency-Key": "evt-pix-1001" };
      const body = JSON.stringify({ orderId: "ord-1001", status: "CONCLUIDA" }, null, 2);
      setHttpMethod("POST");
      setHttpPath("/api/v1/webhooks/efi");
      setHttpHeadersText(JSON.stringify(hdrs, null, 2));
      setHttpBodyText(body);
      setHttpHeaderParseError("");
      for (let i = 0; i < 2; i++) {
        lastRes = executeHttpLabRequest(workingState, { method: "POST", path: "/api/v1/webhooks/efi", headers: hdrs, bodyText: body });
        workingState = lastRes.nextState;
        recordMissionTelemetry(lastRes, "POST", "/api/v1/webhooks/efi");
      }
    }

    setHttpState(workingState);
    if (lastRes) setHttpResponse(lastRes);
  }

  function getEngineeringInsight(res: HttpLabResponse): { title: string; detail: string } {
    if (res.status === 201) {
      return {
        title: "Invariante #1 Validada: Zero Confiança no Front-end",
        detail: "O servidor recalculou preços unitários e desconto em centavos inteiros dentro de uma transação atômica antes de baixar o estoque.",
      };
    }
    if (res.status === 409) {
      return {
        title: "Invariante #2 Validada: Bloqueio Anti-Overselling (Concorrência)",
        detail: "Um segundo comprador tentando levar a última unidade recebe HTTP 409 Conflict antes que o saldo de estoque fique negativo.",
      };
    }
    if (res.status === 401) {
      return {
        title: "Invariante #3 Validada: Defesa Fail-Closed por Assinatura HMAC",
        detail: "Sem assinatura criptográfica válida no header X-Webhook-Signature, a requisição morre na borda (HTTP 401) sem tocar no banco.",
      };
    }
    if (res.status === 200 && Boolean((res.body as { deduplicated?: boolean })?.deduplicated)) {
      return {
        title: "Invariante #4 Validada: Idempotência em Retentativas PIX",
        detail: "O banco notificou o mesmo Idempotency-Key duas vezes; o servidor deduplicou o evento e manteve o ledger exato sem duplicar saldo.",
      };
    }
    if (res.status === 200 && Boolean((res.body as { split?: unknown })?.split)) {
      return {
        title: "Invariante #4 Validada: Split Exato em Centavos",
        detail: "Liquidação confirmada dividindo receita líquida do lojista e comissão da plataforma em inteiros, preservando auditoria contábil.",
      };
    }
    return {
      title: "Contrato REST Observável",
      detail: "Todo status HTTP comunica exatamente o estado da transição de negócio no banco — nunca disfarce erros com HTTP 200.",
    };
  }

  const labPassed = Boolean(workspace.labsPassed[lessonSlug]?.passed);
  const terminalTotalSteps = TERMINAL_MISSIONS.reduce((acc, m) => acc + m.steps.length, 0);
  const terminalDoneCount = workspace.terminalSteps.length;

  return (
    <section className="ide-workbench" aria-label="Bancada Pratica da IDE">
      {!hideTabBar && (
      <div className="ide-workbench-tabs" role="tablist" aria-label="Ferramentas da bancada">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "terminal"}
          className={`ide-workbench-tab${activeTab === "terminal" ? " is-active" : ""}`}
          onClick={() => onChangeTab("terminal")}
        >
          <TerminalSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Terminal Preto</span>
          <span className="ide-pill-counter" aria-label={`${terminalDoneCount} de ${terminalTotalSteps} comandos`}>
            {terminalDoneCount}/{terminalTotalSteps}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "lab"}
          className={`ide-workbench-tab${activeTab === "lab" ? " is-active" : ""}`}
          onClick={() => onChangeTab("lab")}
        >
          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Lab {lab.language === "sql-py" ? "SQL + Py" : "Python"}</span>
          {labPassed && <CheckCircle2 className="w-3.5 h-3.5 ide-text-emerald" aria-label="Aprovado" />}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "http"}
          className={`ide-workbench-tab${activeTab === "http" ? " is-active" : ""}`}
          onClick={() => onChangeTab("http")}
        >
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          <span>HTTP &amp; Webhook</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "deploy"}
          className={`ide-workbench-tab${activeTab === "deploy" ? " is-active" : ""}`}
          onClick={() => onChangeTab("deploy")}
        >
          <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Publicar R$ 0</span>
          <span className="ide-pill-counter" aria-label={`${deployDoneCount} de ${deployTotalCount} etapas`}>
            {deployDoneCount}/{deployTotalCount}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "notes"}
          className={`ide-workbench-tab${activeTab === "notes" ? " is-active" : ""}`}
          onClick={() => onChangeTab("notes")}
        >
          <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Caderno &amp; SRS</span>
          {srsStats.dueNow > 0 && (
            <span className="ide-pill-counter" aria-label={`${srsStats.dueNow} revisoes pendentes`}>
              {srsStats.dueNow}
            </span>
          )}
        </button>
      </div>
      )}

      {activeTab === "terminal" && (
        <div className="ide-workbench-panel">
          <InteractiveTerminalLab
            completedStepIds={workspace.terminalSteps}
            completedMissions={workspace.terminalMissions}
            onRecordProgress={(steps, missions) => onRecordTerminalProgress?.(steps, missions)}
            onUnlockContinue={() => onChangeTab("lab")}
            continueLabel="Ir para Lab Python & Código"
          />
        </div>
      )}

      {activeTab === "lab" && (
        <div className="ide-workbench-panel">
          <div className="ide-lab-header">
            <div>
              <div className="ide-lab-file-row">
                <span className="ide-file-badge">{lab.shortCode}</span>
                <code className="ide-file-path">{lab.filePath}</code>
                <span className={`ide-runtime-badge${pyReady ? " is-ready" : ""}`}>
                  {runningPy ? "Executando Python..." : pyReady ? "Python 3.12 WASM Pronto" : "Python 3.12 sob demanda"}
                </span>
              </div>
              <h3 className="ide-lab-title">{lab.title}</h3>
              <p className="ide-lab-objective">{lab.objective}</p>
            </div>
          </div>

          <ul className="ide-lab-instructions">
            {lab.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <div className="ide-toolbar-actions">
            <button
              type="button"
              className="ide-btn ide-btn-primary"
              onClick={handleRunPython}
              disabled={runningPy}
            >
              {runningPy ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{runningPy ? "Rodando..." : "Rodar Testes (Ctrl+Enter)"}</span>
            </button>

            <button
              type="button"
              className="ide-btn ide-btn-ghost"
              onClick={() => setHintLevel((prev) => Math.min(3, prev + 1))}
            >
              <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dica ({hintLevel}/3)</span>
            </button>

            <button
              type="button"
              className="ide-btn ide-btn-ghost"
              onClick={() => setShowSolution((prev) => !prev)}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showSolution ? "Ocultar Solução" : "Solução"}</span>
            </button>

            <button
              type="button"
              className="ide-btn ide-btn-ghost"
              onClick={handleResetCode}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Resetar</span>
            </button>
          </div>

          {hintLevel > 0 && (
            <div className="ide-hint-box" role="note">
              <strong>Dica {hintLevel}:</strong> {lab.hints[hintLevel - 1]}
            </div>
          )}

          {showSolution && (
            <div className="ide-solution-box">
              <div className="ide-solution-head">
                <span>Solução de Referência</span>
                <button
                  type="button"
                  className="ide-btn ide-btn-xs"
                  onClick={() => onUpdateCodeDraft(lessonSlug, lab.solutionCode)}
                >
                  Aplicar no Editor
                </button>
              </div>
              <pre className="ide-solution-pre">
                <code>{lab.solutionCode}</code>
              </pre>
            </div>
          )}

          <IdeCodeEditor
            value={currentCode}
            onChange={(next) => onUpdateCodeDraft(lessonSlug, next)}
            onRunShortcut={handleRunPython}
            language={lab.language}
            fileName={lab.filePath}
            ariaLabel={`Editor de código do laboratório ${lab.title}`}
            minHeight={240}
          />

          <div className="ide-console-box" aria-live="polite">
            <div className="ide-console-header">
              <span>Saída dos Testes Unitários</span>
              {runOutput && (
                <span className="ide-console-timing">
                  {runOutput.durationMs}ms · {runOutput.allPassed ? "PASS" : "REVISAR"}
                </span>
              )}
            </div>

            {!runOutput && (
              <p className="ide-console-placeholder">
                Edite o código acima e pressione <strong>Rodar Testes</strong> (ou{" "}
                <code>Ctrl+Enter</code>) para validar suas invariantes com Python real no navegador.
              </p>
            )}

            {runOutput && runOutput.testResults.length > 0 && (
              <div className="ide-test-list">
                {runOutput.testResults.map((t, idx) => (
                  <div key={idx} className={`ide-test-item${t.passed ? " is-pass" : " is-fail"}`}>
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      <div className="ide-test-name">{t.name}</div>
                      {t.detail && <div className="ide-test-detail">{t.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {runOutput?.stdout && (
              <pre className="ide-console-stream">{runOutput.stdout}</pre>
            )}
            {runOutput?.stderr && (
              <pre className="ide-console-stderr">{runOutput.stderr}</pre>
            )}
          </div>
        </div>
      )}

      {activeTab === "http" && (
        <div className="ide-workbench-panel">
          <div className="ide-didactic-missions-grid" aria-label="Roteiro Guiado de Engenharia">
            {(
              [
                {
                  key: "m1-order",
                  step: "Missão 1 · Reserva",
                  title: "Pedido Válido (201)",
                  desc: "Cria ord-1001 no servidor em centavos com reserva de estoque.",
                },
                {
                  key: "m2-race",
                  step: "Missão 2 · Trava SQL",
                  title: "Concorrência (409)",
                  desc: "Dispara compra acima do estoque para provar anti-overselling.",
                },
                {
                  key: "m3-hmac",
                  step: "Missão 3 · Porteiro",
                  title: "Assinatura Falsa (401)",
                  desc: "Simula ataque webhook bloqueado antes de alterar saldo.",
                },
                {
                  key: "m4-idempotency",
                  step: "Missão 4 · Idempotência",
                  title: "Replay PIX 2x (200)",
                  desc: "Envia o mesmo evento Efí 2x garantindo split único no ledger.",
                },
              ] as const
            ).map((m) => {
              const done = Boolean(completedHttpMissions[m.key]);
              return (
                <article
                  key={m.key}
                  className={`ide-didactic-mission-card${done ? " is-done" : ""}`}
                >
                  <div className="ide-didactic-mission-head">
                    <span className="ide-file-badge">{m.step}</span>
                    {done && (
                      <span className="ide-status-chip is-ok">Concluída ✓</span>
                    )}
                  </div>
                  <strong>{m.title}</strong>
                  <p>{m.desc}</p>
                  <button
                    type="button"
                    className={`ide-btn ${done ? "ide-btn-ghost" : "ide-btn-primary"} ide-btn-xs`}
                    onClick={() => runGuidedHttpMission(m.key)}
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{done ? "Reexecutar" : "Executar Missão"}</span>
                  </button>
                </article>
              );
            })}
          </div>

          <div className="ide-http-presets">
            {HTTP_LAB_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                className="ide-preset-chip"
                onClick={() => applyScenario(sc.id)}
                title={sc.explanation}
              >
                {sc.label}
              </button>
            ))}
          </div>

          <div className="ide-http-bar">
            <select
              aria-label="Método HTTP"
              className="ide-http-select"
              value={httpMethod}
              onChange={(e) => setHttpMethod(e.target.value as "GET" | "POST")}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <input
              type="text"
              aria-label="Caminho do endpoint"
              className="ide-http-input"
              value={httpPath}
              onChange={(e) => setHttpPath(e.target.value)}
            />

            <button
              type="button"
              className="ide-btn ide-btn-primary"
              onClick={() => handleSendHttp(1)}
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Enviar</span>
            </button>
          </div>

          <div className="ide-http-secondary-actions">
            <button
              type="button"
              className="ide-btn ide-btn-ghost"
              onClick={() => handleSendHttp(2)}
            >
              <CopyCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Simular Reenvio 2x (Idempotência)</span>
            </button>
            <button
              type="button"
              className="ide-btn ide-btn-ghost"
              onClick={() => {
                setHttpState(createInitialHttpSandboxState());
                setHttpResponse(null);
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Resetar Banco Sandbox</span>
            </button>
          </div>

          <div className="ide-http-editors">
            <label className="ide-field-block">
              <span>Headers (JSON)</span>
              <textarea
                className="ide-mini-textarea"
                rows={4}
                spellCheck={false}
                value={httpHeadersText}
                onChange={(e) => setHttpHeadersText(e.target.value)}
              />
            </label>
            <label className="ide-field-block">
              <span>Body (JSON)</span>
              <textarea
                className="ide-mini-textarea"
                rows={5}
                spellCheck={false}
                value={httpBodyText}
                onChange={(e) => setHttpBodyText(e.target.value)}
              />
            </label>
          </div>

          {httpHeaderParseError && <p className="ide-error-text">{httpHeaderParseError}</p>}

          {httpResponse && (
            <div className="ide-console-box">
              <div className="ide-console-header">
                <span>
                  Resposta: HTTP{" "}
                  <strong
                    className={
                      httpResponse.status >= 400 ? "ide-status-err" : "ide-status-ok"
                    }
                  >
                    {httpResponse.status} {httpResponse.statusText}
                  </strong>
                </span>
                <span className="ide-console-timing">{httpResponse.diagnostic}</span>
              </div>
              <div className="ide-engineer-insight">
                <strong>{getEngineeringInsight(httpResponse).title}</strong>
                <p>{getEngineeringInsight(httpResponse).detail}</p>
              </div>
              <pre className="ide-console-stream">
                {JSON.stringify(httpResponse.body, null, 2)}
              </pre>
            </div>
          )}

          <div className="ide-sandbox-inspector">
            <div className="ide-inspector-title">Estado Vivo do Banco &amp; Ledger</div>
            <div className="ide-inspector-grid">
              <div>
                <span className="ide-inspector-label">Estoque Cafeteira</span>
                <strong>{httpState.products["cafeteira-pro"]?.stock ?? 0} un.</strong>
              </div>
              <div>
                <span className="ide-inspector-label">Pedidos Criados</span>
                <strong>{Object.keys(httpState.orders).length}</strong>
              </div>
              <div>
                <span className="ide-inspector-label">Webhooks Deduplicados</span>
                <strong>{httpState.processedWebhookKeys.length}</strong>
              </div>
              <div>
                <span className="ide-inspector-label">Receita Plataforma</span>
                <strong>{formatCents(httpState.platformRevenueCents)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deploy" && (
        <div className="ide-workbench-panel">
          <FreeDeployGuidePanel
            selectedLevel={selectedLevel}
            deployChecklist={workspace.deployChecklist}
            onToggleDeployStep={onToggleDeployStep}
            onChangeLevel={onChangeLevel}
          />
          <InteractiveFlipDeck activeLevel={selectedLevel} />
        </div>
      )}

      {activeTab === "notes" && (
        <div className="ide-workbench-panel">
          <div className="ide-notes-section">
            <label htmlFor={`ide-note-${lessonSlug}`} className="ide-section-label">
              Caderno de Engenharia da Aula (salvo automaticamente)
            </label>
            <textarea
              id={`ide-note-${lessonSlug}`}
              className="ide-notes-textarea"
              rows={7}
              placeholder="Anote aqui invariantes financeiras, decisões de arquitetura ou dúvidas desta aula..."
              value={workspace.notes[lessonSlug] ?? ""}
              onChange={(e) => onUpdateNotes(lessonSlug, e.target.value)}
            />
          </div>

          <div className="ide-srs-box">
            <div className="ide-srs-header">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 ide-text-cyan" aria-hidden="true" />
                <strong>Revisão Espaçada (Active Recall SM-2)</strong>
              </div>
              <span className="ide-console-timing">
                {srsStats.dueNow} pendentes · {srsStats.mastered}/{srsStats.total} dominados
              </span>
            </div>

            {activeSrsCard && (
              <div className="ide-srs-card">
                <div className="ide-srs-meta">
                  <span>{activeSrsCard.moduleLabel}</span>
                  <span>
                    {isSrsCardDue(workspace.srs[activeSrsCard.id])
                      ? "Disponível para revisão agora"
                      : `Próxima revisão em ${workspace.srs[activeSrsCard.id]?.intervalDays ?? 1}d`}
                  </span>
                </div>
                <p className="ide-srs-question">{activeSrsCard.prompt}</p>

                {revealedCardId !== activeSrsCard.id ? (
                  <button
                    type="button"
                    className="ide-btn ide-btn-primary"
                    onClick={() => setRevealedCardId(activeSrsCard.id)}
                  >
                    Revelar Resposta
                  </button>
                ) : (
                  <div className="ide-srs-answer-wrap">
                    <p className="ide-srs-answer">{activeSrsCard.answer}</p>
                    <p className="ide-srs-pitfall">
                      <strong>Armadilha comum:</strong> {activeSrsCard.pitfall}
                    </p>
                    <div className="ide-srs-ratings">
                      {(
                        [
                          [1, "Errei (Hoje)"],
                          [2, "Difícil"],
                          [3, "Bom"],
                          [4, "Fácil"],
                        ] as const
                      ).map(([rating, label]) => {
                        const preview = scheduleSrsCard(workspace.srs[activeSrsCard.id], rating);
                        return (
                          <button
                            key={rating}
                            type="button"
                            className="ide-btn ide-btn-ghost"
                            onClick={() => {
                              onReviewSrsCard(activeSrsCard.id, rating);
                              setRevealedCardId(null);
                            }}
                          >
                            <span>{label}</span>
                            <small>
                              {preview.intervalDays === 0 ? "0d" : `+${preview.intervalDays}d`}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
