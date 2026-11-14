"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { allCourseLessons, courseBySlug } from "../lib/courses";
import {
  LEGACY_M0_STORAGE_KEY,
  LEGACY_M1_STORAGE_KEY,
  LEGACY_M2_STORAGE_KEY,
  WORKSPACE_STORAGE_KEY,
  createEmptyWorkspaceState,
  mergeWorkspaceStates,
  migrateLegacyLocalProgress,
  sanitizeWorkspaceState,
  scheduleSrsCard,
  type SrsRating,
  type WorkspacePreferences,
  type WorkspaceState,
} from "../lib/course-workspace";

export type SyncStatus = "loading" | "guest" | "cloud" | "local-fallback" | "saving";

interface TrilhaProgressRow {
  licao_id: string;
  status: string;
  nota_quiz?: number | null;
}

export function useCourseWorkspace(courseSlug: string) {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => createEmptyWorkspaceState());
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmissionActivated, setIsAdmissionActivated] = useState(false);
  const [admissionLoading, setAdmissionLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<{
    id: string;
    email: string;
    nome: string;
    recommendedLevel?: string;
  } | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestWorkspaceRef = useRef<WorkspaceState>(workspace);

  const persistLocal = useCallback((next: WorkspaceState) => {
    latestWorkspaceRef.current = next;
    try {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next));
      // Keep legacy M0/M2 keys mirrored for backwards compatibility with any external checks
      window.localStorage.setItem(
        LEGACY_M0_STORAGE_KEY,
        JSON.stringify(next.completedSlugs.filter((s) => s.startsWith("modulo-0-"))),
      );
      window.localStorage.setItem(
        LEGACY_M2_STORAGE_KEY,
        JSON.stringify(next.completedSlugs),
      );
      if (next.completedSlugs.includes("modulo-1-visao-do-negocio")) {
        const rawM1 = window.localStorage.getItem(LEGACY_M1_STORAGE_KEY);
        const parsedM1 = rawM1 ? (JSON.parse(rawM1) as string[]) : [];
        if (Array.isArray(parsedM1) && !parsedM1.includes("modulo-1-visao-do-negocio")) {
          window.localStorage.setItem(
            LEGACY_M1_STORAGE_KEY,
            JSON.stringify([...parsedM1, "modulo-1-visao-do-negocio"]),
          );
        }
      }
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, []);

  const pushCloudWorkspace = useCallback(
    async (stateToSave: WorkspaceState) => {
      if (!isAuthenticated) return;
      setSyncStatus("saving");
      try {
        const res = await fetch("/api/aluno/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspace: stateToSave }),
        });
        if (!res.ok) {
          if (res.status === 401) {
            setIsAuthenticated(false);
            setSyncStatus("guest");
            return;
          }
          setSyncStatus("local-fallback");
          return;
        }
        const data = (await res.json()) as { synced?: boolean };
        setSyncStatus(data.synced ? "cloud" : "local-fallback");
      } catch {
        setSyncStatus("local-fallback");
      }
    },
    [isAuthenticated],
  );

  const scheduleCloudSync = useCallback(
    (next: WorkspaceState) => {
      if (!isAuthenticated) return;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        void pushCloudWorkspace(next);
      }, 1100);
    },
    [isAuthenticated, pushCloudWorkspace],
  );

  useEffect(() => {
    const localInitial = migrateLegacyLocalProgress(window.localStorage);
    latestWorkspaceRef.current = localInitial;
    setWorkspace(localInitial);
    setHydrated(true);

    let cancelled = false;
    (async () => {
      try {
        const [wsRes, trilhaRes, admRes] = await Promise.all([
          fetch("/api/aluno/workspace", { cache: "no-store" }),
          fetch("/api/aluno/trilha", { cache: "no-store" }),
          fetch("/api/aluno/admissao", { cache: "no-store" }),
        ]);
        if (cancelled) return;

        let admAuthed = false;
        if (admRes.ok) {
          const admData = (await admRes.json()) as {
            authenticated?: boolean;
            activated?: boolean;
            student?: {
              id: string;
              email: string;
              nome: string;
              recommendedLevel?: string;
            } | null;
          };
          admAuthed = Boolean(admData.authenticated);
          setIsAdmissionActivated(Boolean(admData.activated));
          setStudentProfile(admData.student ?? null);
        }
        setAdmissionLoading(false);

        if (wsRes.status === 401 && trilhaRes.status === 401 && !admAuthed) {
          setIsAuthenticated(false);
          setSyncStatus("guest");
          return;
        }

        const authed = wsRes.ok || trilhaRes.ok || admAuthed;
        setIsAuthenticated(authed);

        let remoteWs: WorkspaceState | null = null;
        let localOnly = false;
        if (wsRes.ok) {
          const wsData = (await wsRes.json()) as { workspace?: unknown; localOnly?: boolean };
          localOnly = Boolean(wsData.localOnly);
          if (wsData.workspace) {
            remoteWs = sanitizeWorkspaceState(wsData.workspace);
          }
        }

        let merged = mergeWorkspaceStates(localInitial, remoteWs);

        // Also pull canonical completed lessons from aluno_progresso
        if (trilhaRes.ok) {
          const trilhaData = (await trilhaRes.json()) as { progresso?: TrilhaProgressRow[] };
          const course = courseBySlug(courseSlug);
          if (course && Array.isArray(trilhaData.progresso)) {
            const lessonsById = new Map(allCourseLessons(course).map((l) => [l.id, l.slug]));
            const extraSlugs: string[] = [];
            const extraQuizzes = { ...merged.quizScores };
            for (const row of trilhaData.progresso) {
              const slug = lessonsById.get(row.licao_id);
              if (!slug) continue;
              if (row.status === "concluida" && !merged.completedSlugs.includes(slug)) {
                extraSlugs.push(slug);
              }
              if (typeof row.nota_quiz === "number" && !extraQuizzes[slug]) {
                extraQuizzes[slug] = {
                  score: row.nota_quiz,
                  total: 100,
                  pct: Math.round(row.nota_quiz),
                  updatedAt: merged.updatedAt,
                };
              }
            }
            if (extraSlugs.length > 0 || Object.keys(extraQuizzes).length !== Object.keys(merged.quizScores).length) {
              merged = {
                ...merged,
                completedSlugs: [...merged.completedSlugs, ...extraSlugs],
                quizScores: extraQuizzes,
              };
            }
          }
        }

        persistLocal(merged);
        setWorkspace(merged);
        setSyncStatus(localOnly ? "local-fallback" : "cloud");
      } catch {
        if (!cancelled) {
          setAdmissionLoading(false);
          setSyncStatus("guest");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [courseSlug, persistLocal]);

  const updateWorkspace = useCallback(
    (updater: (prev: WorkspaceState) => WorkspaceState, syncRemote = true) => {
      setWorkspace((prev) => {
        const next = updater(prev);
        const stamped: WorkspaceState = {
          ...next,
          updatedAt: new Date().toISOString(),
        };
        persistLocal(stamped);
        if (syncRemote) {
          scheduleCloudSync(stamped);
        }
        return stamped;
      });
    },
    [persistLocal, scheduleCloudSync],
  );

  const syncLessonProgressEndpoint = useCallback(
    async (lessonId: string, status: "em_andamento" | "concluida", notaQuiz?: number) => {
      if (!isAuthenticated) return;
      try {
        await fetch("/api/aluno/progresso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cursoSlug: courseSlug,
            licaoId: lessonId,
            status,
            ...(typeof notaQuiz === "number" ? { notaQuiz } : {}),
          }),
        });
      } catch {
        // Non-blocking cloud sync
      }
    },
    [courseSlug, isAuthenticated],
  );

  const setCodeDraft = useCallback(
    (slug: string, code: string) => {
      updateWorkspace((prev) => ({
        ...prev,
        codeDrafts: { ...prev.codeDrafts, [slug]: code },
      }));
    },
    [updateWorkspace],
  );

  const recordLabResult = useCallback(
    (slug: string, passed: boolean) => {
      updateWorkspace((prev) => {
        const current = prev.labsPassed[slug];
        return {
          ...prev,
          labsPassed: {
            ...prev.labsPassed,
            [slug]: {
              passed: Boolean(current?.passed || passed),
              attempts: (current?.attempts ?? 0) + 1,
              lastRunAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [updateWorkspace],
  );

  const recordQuizScore = useCallback(
    (slug: string, lessonId: string, score: number, total: number) => {
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      updateWorkspace((prev) => {
        const existing = prev.quizScores[slug];
        if (existing && existing.pct > pct) return prev;
        return {
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [slug]: {
              score,
              total,
              pct,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      void syncLessonProgressEndpoint(
        lessonId,
        latestWorkspaceRef.current.completedSlugs.includes(slug) ? "concluida" : "em_andamento",
        pct,
      );
    },
    [syncLessonProgressEndpoint, updateWorkspace],
  );

  const setNote = useCallback(
    (slug: string, noteText: string) => {
      updateWorkspace((prev) => ({
        ...prev,
        notes: { ...prev.notes, [slug]: noteText },
      }));
    },
    [updateWorkspace],
  );

  const reviewSrsCard = useCallback(
    (cardId: string, rating: SrsRating) => {
      updateWorkspace((prev) => ({
        ...prev,
        srs: {
          ...prev.srs,
          [cardId]: scheduleSrsCard(prev.srs[cardId], rating),
        },
      }));
    },
    [updateWorkspace],
  );

  const toggleLessonCompleted = useCallback(
    (slug: string, lessonId: string, forceValue?: boolean) => {
      let nextCompleted = false;
      updateWorkspace((prev) => {
        const already = prev.completedSlugs.includes(slug);
        nextCompleted = typeof forceValue === "boolean" ? forceValue : !already;
        const completedSlugs = nextCompleted
          ? already
            ? prev.completedSlugs
            : [...prev.completedSlugs, slug]
          : prev.completedSlugs.filter((s) => s !== slug);
        return { ...prev, completedSlugs };
      });
      const existingPct = latestWorkspaceRef.current.quizScores[slug]?.pct;
      void syncLessonProgressEndpoint(
        lessonId,
        nextCompleted ? "concluida" : "em_andamento",
        existingPct,
      );
    },
    [syncLessonProgressEndpoint, updateWorkspace],
  );

  const updatePreferences = useCallback(
    (patch: Partial<WorkspacePreferences>) => {
      updateWorkspace((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...patch },
      }));
    },
    [updateWorkspace],
  );

  const toggleDeployStep = useCallback(
    (stepId: string, forceValue?: boolean) => {
      updateWorkspace((prev) => {
        const nextVal = typeof forceValue === "boolean" ? forceValue : !prev.deployChecklist[stepId];
        return {
          ...prev,
          deployChecklist: {
            ...prev.deployChecklist,
            [stepId]: nextVal,
          },
        };
      });
    },
    [updateWorkspace],
  );

  const recordTerminalProgress = useCallback(
    (stepIds: string[], missionIds: string[]) => {
      updateWorkspace((prev) => {
        const nextSteps = Array.from(new Set([...prev.terminalSteps, ...stepIds]));
        const nextMissions = Array.from(new Set([...prev.terminalMissions, ...missionIds]));
        if (
          nextSteps.length === prev.terminalSteps.length &&
          nextMissions.length === prev.terminalMissions.length
        ) {
          return prev;
        }
        return {
          ...prev,
          terminalSteps: nextSteps,
          terminalMissions: nextMissions,
        };
      });
    },
    [updateWorkspace],
  );

  return {
    workspace,
    hydrated,
    syncStatus,
    isAuthenticated,
    isAdmissionActivated,
    admissionLoading,
    studentProfile,
    setCodeDraft,
    recordLabResult,
    recordQuizScore,
    setNote,
    reviewSrsCard,
    toggleLessonCompleted,
    toggleDeployStep,
    recordTerminalProgress,
    updatePreferences,
  };
}
