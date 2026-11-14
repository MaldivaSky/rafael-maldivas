"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  LockOpen,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import {
  TERMINAL_MISSIONS,
  createInitialTerminalState,
  executeTerminalCommand,
  getTerminalPrompt,
  type TerminalMissionId,
  type TerminalSimState,
} from "@/app/lib/terminal-sim";

interface TranscriptEntry {
  id: string;
  kind: "cmd" | "out" | "ok" | "warn" | "err" | "mentor";
  prompt?: string;
  text: string;
}

interface InteractiveTerminalLabProps {
  completedStepIds: string[];
  completedMissions: string[];
  onRecordProgress: (stepIds: string[], missionIds: string[]) => void;
  onUnlockContinue?: () => void;
  continueLabel?: string;
}

export function InteractiveTerminalLab({
  completedStepIds,
  completedMissions,
  onRecordProgress,
  onUnlockContinue,
  continueLabel = "Avançar para Lab & Publicação R$ 0",
}: InteractiveTerminalLabProps) {
  const [selectedMissionId, setSelectedMissionId] =
    useState<TerminalMissionId>("mission-1-git-basics");
  const [simState, setSimState] = useState<TerminalSimState>(() => {
    const base = createInitialTerminalState();
    return {
      ...base,
      completedStepIds: [...completedStepIds],
      completedMissions: completedMissions.filter(
        (m): m is TerminalMissionId =>
          m === "mission-1-git-basics" || m === "mission-2-django-env",
      ),
    };
  });
  const [inputCmd, setInputCmd] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [showHintForStep, setShowHintForStep] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    {
      id: "boot-1",
      kind: "ok",
      text: "Maldivas Sandbox Terminal v2.0 — Ambiente seguro no navegador (pode errar sem quebrar nada).",
    },
    {
      id: "boot-2",
      kind: "mentor",
      text: "Mentor: Comece pelo primeiro desafio ao lado digitando 'pwd' e pressionando Enter.",
    },
  ]);

  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  const activeMission = useMemo(
    () =>
      TERMINAL_MISSIONS.find((m) => m.id === selectedMissionId) ?? TERMINAL_MISSIONS[0],
    [selectedMissionId],
  );

  const mergedCompletedSteps = useMemo(
    () => Array.from(new Set([...completedStepIds, ...simState.completedStepIds])),
    [completedStepIds, simState.completedStepIds],
  );

  const nextPendingStep = useMemo(
    () => activeMission.steps.find((s) => !mergedCompletedSteps.includes(s.id)) ?? null,
    [activeMission.steps, mergedCompletedSteps],
  );

  const missionDoneCount = activeMission.steps.filter((s) =>
    mergedCompletedSteps.includes(s.id),
  ).length;
  const mission1Done =
    completedMissions.includes("mission-1-git-basics") ||
    simState.completedMissions.includes("mission-1-git-basics");

  function runCommand(raw: string) {
    const cmdText = raw.trim();
    const currentPrompt = getTerminalPrompt(simState);
    const result = executeTerminalCommand(simState, raw);

    if (result.clearScreen) {
      setTranscript([
        {
          id: `clr-${Date.now()}`,
          kind: "mentor",
          text: "Tela limpa! Continue sua missão digitando o próximo comando.",
        },
      ]);
      setInputCmd("");
      setSimState(result.nextState);
      return;
    }

    const nowStamp = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const appended: TranscriptEntry[] = [];
    if (cmdText) {
      appended.push({
        id: `cmd-${nowStamp}`,
        kind: "cmd",
        prompt: currentPrompt,
        text: cmdText,
      });
      setHistory((prev) => [cmdText, ...prev].slice(0, 40));
    }

    result.lines.forEach((line, idx) => {
      appended.push({
        id: `line-${nowStamp}-${idx}`,
        kind: line.kind,
        text: line.text,
      });
    });

    setSimState(result.nextState);
    setTranscript((prev) => [...prev, ...appended].slice(-80));
    setInputCmd("");
    setHistoryCursor(null);
    setShowHintForStep(null);

    if (result.newlyCompletedStepId || result.newlyCompletedMissionId) {
      onRecordProgress(result.nextState.completedStepIds, result.nextState.completedMissions);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyCursor === null ? 0 : Math.min(history.length - 1, historyCursor + 1);
      setHistoryCursor(nextIdx);
      setInputCmd(history[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyCursor === null) return;
      const nextIdx = historyCursor - 1;
      if (nextIdx < 0) {
        setHistoryCursor(null);
        setInputCmd("");
      } else {
        setHistoryCursor(nextIdx);
        setInputCmd(history[nextIdx] ?? "");
      }
    } else if (e.key === "Tab" && nextPendingStep) {
      e.preventDefault();
      setInputCmd(nextPendingStep.expectedExample);
    }
  }

  function handleResetTerminal() {
    const fresh = createInitialTerminalState();
    setSimState({
      ...fresh,
      completedStepIds: [...mergedCompletedSteps],
      completedMissions: Array.from(
        new Set([...completedMissions, ...simState.completedMissions]),
      ).filter(
        (m): m is TerminalMissionId =>
          m === "mission-1-git-basics" || m === "mission-2-django-env",
      ),
    });
    setTranscript([
      {
        id: `rst-${Date.now()}`,
        kind: "mentor",
        text: "Pasta virtual reiniciada (~). Pratique quantas vezes quiser!",
      },
    ]);
    setInputCmd("");
  }

  const promptNow = getTerminalPrompt(simState);

  return (
    <section className="ide-term-shell" aria-label="Simulador Prático de Terminal Preto">
      <div className="ide-term-header">
        <div>
          <span className="ide-file-badge">
            <TerminalSquare className="w-3 h-3" aria-hidden="true" /> Passo 0 · Tela Preta Sem Medo
          </span>
          <h3 className="ide-lab-title" style={{ marginTop: 6 }}>
            Pratique no Terminal Antes do Mundo Real (Só passa rodando o comando certo!)
          </h3>
          <p className="ide-lab-objective">
            Digite os comandos reais abaixo com suas mãos. Se errar ou esquecer de proteger suas senhas no{" "}
            <code>.gitignore</code>, o mentor bloqueia e explica o porquê na hora.
          </p>
        </div>

        <div className="ide-term-mission-tabs" role="tablist" aria-label="Escolher missão do terminal">
          {TERMINAL_MISSIONS.map((mission) => {
            const done =
              completedMissions.includes(mission.id) ||
              simState.completedMissions.includes(mission.id);
            const active = selectedMissionId === mission.id;
            return (
              <button
                key={mission.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`ide-preset-chip${active ? " is-selected-chip" : ""}`}
                onClick={() => setSelectedMissionId(mission.id)}
              >
                {done ? "✓ " : ""}
                {mission.id === "mission-1-git-basics"
                  ? "Missão 1: Pastas + Git"
                  : "Missão 2: Python + Django"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ide-term-grid">
        {/* Left: Authentic Black Terminal */}
        <div
          className="ide-term-window"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="ide-term-titlebar">
            <div className="ide-term-dots" aria-hidden="true">
              <span className="dot-red" />
              <span className="dot-amber" />
              <span className="dot-green" />
            </div>
            <span className="ide-term-title-text">bash — {simState.cwd}</span>
            <button
              type="button"
              className="ide-btn ide-btn-xs ide-btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleResetTerminal();
              }}
              title="Reiniciar pasta virtual"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" /> Resetar Pasta
            </button>
          </div>

          <div ref={scrollBoxRef} className="ide-term-screen" role="log" aria-live="polite">
            {transcript.map((entry) => {
              if (entry.kind === "cmd") {
                return (
                  <div key={entry.id} className="ide-term-line is-cmd">
                    <span className="ide-term-prompt">{entry.prompt}</span>{" "}
                    <span>{entry.text}</span>
                  </div>
                );
              }
              return (
                <div key={entry.id} className={`ide-term-line is-${entry.kind}`}>
                  {entry.text}
                </div>
              );
            })}
          </div>

          <form
            className="ide-term-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(inputCmd);
            }}
          >
            <label htmlFor="ide-terminal-command-input" className="ide-term-prompt">
              {promptNow}
            </label>
            <input
              ref={inputRef}
              id="ide-terminal-command-input"
              type="text"
              className="ide-term-input"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                nextPendingStep
                  ? `Digite aqui: ${nextPendingStep.expectedExample} (ou Tab)`
                  : "Digite qualquer comando ou 'help'..."
              }
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="ide-btn ide-btn-xs ide-btn-primary">
              Enter
            </button>
          </form>
        </div>

        {/* Right: Guided Mission Checklist */}
        <aside className="ide-term-mission-panel" aria-label="Checklist da Missão do Terminal">
          <div className="ide-term-mission-head">
            <strong>{activeMission.title}</strong>
            <span className="ide-status-chip is-ok">
              {missionDoneCount}/{activeMission.steps.length} comandos
            </span>
          </div>
          <p className="ide-lab-objective" style={{ marginBottom: 8 }}>
            {activeMission.subtitle}
          </p>

          <ol className="ide-term-steps">
            {activeMission.steps.map((step) => {
              const done = mergedCompletedSteps.includes(step.id);
              const isCurrent = nextPendingStep?.id === step.id;
              const showingHint = showHintForStep === step.id;
              return (
                <li
                  key={step.id}
                  className={`ide-term-step${done ? " is-done" : ""}${isCurrent ? " is-current" : ""}`}
                >
                  <div className="ide-term-step-top">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 ide-text-emerald shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 ide-text-cyan shrink-0" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="ide-term-step-title">{step.title}</div>
                      {(done || showingHint) && (
                        <div className="ide-term-step-explain">
                          <code>{step.expectedExample}</code> — {step.explanation}
                        </div>
                      )}
                    </div>
                    {!done && isCurrent && (
                      <button
                        type="button"
                        className="ide-btn ide-btn-xs ide-btn-ghost"
                        onClick={() =>
                          setShowHintForStep((prev) => (prev === step.id ? null : step.id))
                        }
                      >
                        <HelpCircle className="w-3 h-3" aria-hidden="true" /> Cola
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {mission1Done && (
            <div className="ide-term-unlocked" role="status">
              <div className="flex items-center gap-2 font-bold">
                <LockOpen className="w-4 h-4 ide-text-emerald" aria-hidden="true" />
                <span>Missão 1 concluída — Tela Preta Dominada!</span>
              </div>
              {onUnlockContinue && (
                <button
                  type="button"
                  className="ide-btn ide-btn-primary ide-btn-xs"
                  style={{ marginTop: 8 }}
                  onClick={onUnlockContinue}
                >
                  {continueLabel}
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
