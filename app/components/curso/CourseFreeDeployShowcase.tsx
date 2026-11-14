"use client";

import { useState } from "react";
import { Lock, LockOpen, TerminalSquare } from "lucide-react";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { FreeDeployGuidePanel } from "./FreeDeployGuidePanel";
import { InteractiveFlipDeck } from "./InteractiveFlipDeck";
import { InteractiveTerminalLab } from "./InteractiveTerminalLab";

export default function CourseFreeDeployShowcase({
  courseSlug,
}: {
  courseSlug: string;
}) {
  const { workspace, toggleDeployStep, recordTerminalProgress, updatePreferences } =
    useCourseWorkspace(courseSlug);
  const [mentorBypass, setMentorBypass] = useState(false);

  const mission1Done = workspace.terminalMissions.includes("mission-1-git-basics");
  const deployUnlocked = mission1Done || mentorBypass;

  function scrollToDeployPanel() {
    const el = document.getElementById("publicacao-r0-desbloqueada");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="curso-section" aria-labelledby="deploy-free-heading">
      <div className="wrap" style={{ display: "grid", gap: 28 }}>
        <div>
          <div className="sec-tag">
            Etapa 0 · A Tela Preta Vem Antes (Zero Medo do Terminal)
          </div>
          <h2 id="deploy-free-heading">
            1º Domine a Tela Preta aqui · Depois crie e publique sua loja grátis
          </h2>
          <p className="curso-muted" style={{ maxWidth: 780, marginBottom: 18 }}>
            Todo iniciante trava quando abre o terminal pela primeira vez. Por isso você pratica
            aqui primeiro em uma simulação segura: só avança digitando o comando certo e
            entendendo cada resposta antes de publicar no GitHub, Neon, Render e Vercel.
          </p>

          <InteractiveTerminalLab
            completedStepIds={workspace.terminalSteps}
            completedMissions={workspace.terminalMissions}
            onRecordProgress={recordTerminalProgress}
            onUnlockContinue={scrollToDeployPanel}
            continueLabel="Descer para Fábrica de Loja & Publicação R$ 0"
          />
        </div>

        <div id="publicacao-r0-desbloqueada">
          {!deployUnlocked ? (
            <div className="ide-deploy-gate-banner" role="region" aria-label="Desafio de terminal pendente">
              <div className="ide-deploy-gate-left">
                <span className="ide-file-badge">
                  <Lock className="w-3 h-3" aria-hidden="true" /> Publicação R$ 0 Aguardando Missão 1
                </span>
                <h3 className="ide-lab-title" style={{ marginTop: 6 }}>
                  Conclua os 8 comandos da Missão 1 acima para liberar a Fábrica de Loja e Publicação
                </h3>
                <p className="ide-lab-objective">
                  Progresso atual no terminal:{" "}
                  <strong>
                    {workspace.terminalSteps.filter((s) => s.startsWith("m1-")).length}/8
                  </strong>{" "}
                  comandos dominados. Leva ~2 minutos e evita erros reais no GitHub!
                </p>
              </div>
              <div className="ide-deploy-gate-actions">
                <a href="#ide-terminal-command-input" className="ide-btn ide-btn-primary">
                  <TerminalSquare className="w-4 h-4" aria-hidden="true" />
                  <span>Ir para o Terminal Acima</span>
                </a>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => setMentorBypass(true)}
                >
                  <LockOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Já domino terminal · Liberar assim mesmo</span>
                </button>
              </div>
            </div>
          ) : (
            <FreeDeployGuidePanel
              selectedLevel={workspace.preferences.selectedLevel}
              deployChecklist={workspace.deployChecklist}
              onToggleDeployStep={toggleDeployStep}
              onChangeLevel={(lvl) => updatePreferences({ selectedLevel: lvl })}
            />
          )}
        </div>

        <InteractiveFlipDeck activeLevel={workspace.preferences.selectedLevel} />
      </div>
    </section>
  );
}
