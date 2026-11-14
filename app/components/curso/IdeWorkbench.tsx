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
}: IdeWorkbenchProps) {
  const lab = COURSE_LABS[lessonSlug] ?? Object.values(COURSE_LABS)[0];
  const activeTab = workspace.preferences.activeTab;
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
    }
    setHttpState(workingState);
    if (lastRes) setHttpResponse(lastRes);
  }

  const labPassed = Boolean(workspace.labsPassed[lessonSlug]?.passed);
  const terminalTotalSteps = TERMINAL_MISSIONS.reduce((acc, m) => acc + m.steps.length, 0);
  const terminalDoneCount = workspace.terminalSteps.length;

  return (
    <section className="ide-workbench" aria-label="Bancada Pratica da IDE">
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
