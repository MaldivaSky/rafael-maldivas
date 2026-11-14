"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Rocket, Sparkles } from "lucide-react";
import {
  COURSE_LEVELS,
  type CourseDifficultyLevel,
} from "@/app/lib/course-levels";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { localePath, type Lang } from "@/app/lib/i18n";

interface CourseLevelSelectorProps {
  courseSlug: string;
  lang?: Lang;
  onSelectCallback?: (level: CourseDifficultyLevel) => void;
}

const ORDERED_LEVELS: CourseDifficultyLevel[] = ["facil", "mediano", "dificil"];

export default function CourseLevelSelector({
  courseSlug,
  lang = "pt",
  onSelectCallback,
}: CourseLevelSelectorProps) {
  const router = useRouter();
  const { workspace, updatePreferences } = useCourseWorkspace(courseSlug);
  const currentLevel = workspace.preferences.selectedLevel;

  function chooseLevel(level: CourseDifficultyLevel, shouldNavigate = false) {
    updatePreferences({ selectedLevel: level });
    onSelectCallback?.(level);
    if (shouldNavigate) {
      const spec = COURSE_LEVELS[level];
      const firstSlug = spec.recommendedSlugs[0] ?? "modulo-0-f01-o-mapa";
      router.push(localePath(`/cursos/${courseSlug}/${firstSlug}`, lang));
    }
  }

  return (
    <section className="curso-levels-section" aria-labelledby="curso-levels-heading">
      <div className="curso-levels-head">
        <div className="sec-tag">Escolha sua trilha · 3 níveis progressivos</div>
        <h2 id="curso-levels-heading">
          Um projeto real em 3 níveis de dificuldade (do 1º site grátis até produção)
        </h2>
        <p className="curso-muted" style={{ maxWidth: 740 }}>
          Não faz sentido tentar configurar banco distribuído e gateway bancário antes de publicar
          seu primeiro site no ar. Escolha abaixo em qual degrau você quer começar hoje — você pode
          mudar de nível a qualquer momento dentro da IDE.
        </p>
      </div>

      <div className="curso-levels-grid">
        {ORDERED_LEVELS.map((lvlKey) => {
          const lvl = COURSE_LEVELS[lvlKey];
          const isSelected = currentLevel === lvl.id;
          const completedInLevel = lvl.recommendedSlugs.filter((s) =>
            workspace.completedSlugs.includes(s),
          ).length;

          return (
            <article
              key={lvl.id}
              className={`curso-level-card${isSelected ? " is-selected" : ""}`}
            >
              <div className="curso-level-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lvl.imagePath}
                  alt={lvl.imageAlt}
                  className="curso-level-img"
                  loading="lazy"
                />
                <span className="curso-level-cost">{lvl.monthlyCost}</span>
              </div>

              <div className="curso-level-body">
                <div className="curso-level-badges">
                  <span className="curso-badge">{lvl.badge}</span>
                  <span className="curso-pill">
                    <Clock size={13} aria-hidden="true" /> {lvl.estimatedHours}
                  </span>
                </div>

                <h3>{lvl.name}</h3>
                <p className="curso-muted">{lvl.targetAudience}</p>

                <div className="curso-level-outcome">
                  <strong>O que você entrega no ar:</strong>
                  <p>{lvl.projectOutput}</p>
                </div>

                <div className="curso-level-stack">
                  <code>{lvl.stackSummary}</code>
                </div>

                <ul className="curso-level-deliverables">
                  {lvl.deliverables.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="curso-level-footer">
                <span className="curso-fine">
                  Progresso neste nível: {completedInLevel}/{lvl.recommendedSlugs.length} etapas
                </span>

                <div className="curso-level-actions">
                  <button
                    type="button"
                    className={`btn ${isSelected ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => chooseLevel(lvl.id, true)}
                  >
                    {isSelected ? (
                      <>
                        <Sparkles size={15} aria-hidden="true" /> Continuar este nível
                      </>
                    ) : (
                      <>
                        <Rocket size={15} aria-hidden="true" /> Escolher {lvl.shortTitle}
                      </>
                    )}
                  </button>
                  <Link
                    href={localePath(
                      `/cursos/${courseSlug}/${lvl.recommendedSlugs[0]}`,
                      lang,
                    )}
                    className="curso-level-text-link"
                    onClick={() => chooseLevel(lvl.id, false)}
                  >
                    Abrir direto na IDE
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
