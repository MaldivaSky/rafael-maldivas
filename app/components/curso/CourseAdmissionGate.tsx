"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  AI_USAGE_OPTIONS,
  BRAZIL_UF_OPTIONS,
  DEVICE_ACCESS_OPTIONS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  ENGLISH_LEVEL_OPTIONS,
  ETHNICITY_IBGE_OPTIONS,
  FUNDAMENTAL_IT_QUESTIONS,
  GENDER_OPTIONS,
  HOW_FOUND_OPTIONS,
  INCOME_BRACKET_OPTIONS,
  LEARNING_STYLE_OPTIONS,
  MOTIVATION_OPTIONS,
  PROGRAMMING_LANGUAGE_OPTIONS,
  URBAN_ZONE_OPTIONS,
  gradeItAssessment,
  type AdmissionQuestionnaire,
} from "@/app/lib/course-admission";
import GoogleSignInButton from "@/app/components/auth/GoogleSignInButton";

interface CourseAdmissionGateProps {
  targetPath: string;
  initialStudent?: {
    id: string;
    email: string;
    nome: string;
    avatarUrl?: string;
    existingQuestionnaire?: Partial<AdmissionQuestionnaire> | null;
  } | null;
  onActivated?: () => void;
}

const DRAFT_STORAGE_KEY = "maldivas_admission_draft_v1";

export function CourseAdmissionGate({
  targetPath,
  initialStudent,
}: CourseAdmissionGateProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLinked, setGoogleLinked] = useState<{
    nome: string;
    email: string;
    avatarUrl?: string;
  } | null>(
    initialStudent?.email
      ? {
          nome: initialStudent.nome || "",
          email: initialStudent.email,
          avatarUrl: initialStudent.avatarUrl,
        }
      : null,
  );

  const googleLoginHref = `/api/auth/google/login?next=${encodeURIComponent(targetPath)}`;

  const [form, setForm] = useState<AdmissionQuestionnaire>({
    fullName: initialStudent?.nome ?? "",
    email: initialStudent?.email ?? "",
    birthDate: "",
    authMethod: initialStudent?.email ? "google" : "email",
    educationLevel: EDUCATION_OPTIONS[2],
    howFoundSite: HOW_FOUND_OPTIONS[0],
    knowsProgramming: "nao",
    programmingLanguages: [PROGRAMMING_LANGUAGE_OPTIONS[0]],
    motivation: MOTIVATION_OPTIONS[0],
    motivationGoalText: "",
    stateUf: "SP",
    city: "",
    urbanZone: URBAN_ZONE_OPTIONS[0],
    ethnicityIbge: ETHNICITY_IBGE_OPTIONS[0],
    gender: GENDER_OPTIONS[0],
    employmentStatus: EMPLOYMENT_OPTIONS[0],
    incomeBracket: INCOME_BRACKET_OPTIONS[1],
    deviceAccess: DEVICE_ACCESS_OPTIONS[0],
    learningStyle: LEARNING_STYLE_OPTIONS[0],
    englishLevel: ENGLISH_LEVEL_OPTIONS[1],
    aiUsage: AI_USAGE_OPTIONS[1],
  });

  const [itAnswers, setItAnswers] = useState<Record<string, number>>({});
  const [showItExplanations, setShowItExplanations] = useState(false);
  const [activationResult, setActivationResult] = useState<{
    emailSent: boolean;
    recipientEmail: string;
    studentName: string;
    recommendedLevel: string;
    activationUrl: string;
    scorePct: number;
  } | null>(null);

  // 1. Restore draft from sessionStorage if returning from Google OAuth
  useEffect(() => {
    try {
      const savedDraft = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<AdmissionQuestionnaire>;
        setForm((prev) => ({
          ...prev,
          ...parsed,
          fullName: prev.fullName || parsed.fullName || "",
          email: prev.email || parsed.email || "",
        }));
      }
      const params = new URLSearchParams(window.location.search);
      const authErr = params.get("auth_error");
      if (authErr === "cancelled") {
        setErrorMsg("Login com Google cancelado. Você pode clicar novamente em 'Autenticar com Google' ou preencher manualmente.");
      } else if (authErr) {
        setErrorMsg("Não foi possível concluir a autenticação automática com o Google. Tente novamente ou preencha abaixo.");
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // 2. Sync whenever initialStudent prop arrives or updates
  useEffect(() => {
    if (initialStudent?.email) {
      setGoogleLinked({
        nome: initialStudent.nome || "",
        email: initialStudent.email,
        avatarUrl: initialStudent.avatarUrl,
      });
      setForm((prev) => ({
        ...prev,
        ...(initialStudent.existingQuestionnaire ?? {}),
        fullName: initialStudent.nome || prev.fullName,
        email: initialStudent.email || prev.email,
        authMethod: "google",
      }));
    }
  }, [initialStudent]);

  // 3. Also query /api/aluno/me and /api/aluno/admissao directly on mount to guarantee pre-fill
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [meRes, admRes] = await Promise.all([
          fetch("/api/aluno/me", { cache: "no-store" }).catch(() => null),
          fetch("/api/aluno/admissao", { cache: "no-store" }).catch(() => null),
        ]);
        if (!active) return;

        let detectedName = "";
        let detectedEmail = "";
        let detectedAvatar = "";
        let detectedObjective = "";
        let existingQ: Partial<AdmissionQuestionnaire> | null = null;

        if (meRes && meRes.ok) {
          const meData = (await meRes.json()) as {
            aluno?: {
              nome?: string;
              nome_certificado?: string;
              email?: string;
              avatar_url?: string;
              objetivo?: string;
            };
          };
          if (meData.aluno) {
            detectedName = meData.aluno.nome_certificado || meData.aluno.nome || "";
            detectedEmail = meData.aluno.email || "";
            detectedAvatar = meData.aluno.avatar_url || "";
            detectedObjective = meData.aluno.objetivo || "";
          }
        }

        if (admRes && admRes.ok) {
          const admData = (await admRes.json()) as {
            student?: {
              nome?: string;
              email?: string;
              avatarUrl?: string;
              objetivo?: string;
              existingQuestionnaire?: Partial<AdmissionQuestionnaire> | null;
            } | null;
          };
          if (admData.student) {
            detectedName = detectedName || admData.student.nome || "";
            detectedEmail = detectedEmail || admData.student.email || "";
            detectedAvatar = detectedAvatar || admData.student.avatarUrl || "";
            detectedObjective = detectedObjective || admData.student.objetivo || "";
            existingQ = admData.student.existingQuestionnaire ?? null;
          }
        }

        if (detectedEmail || detectedName) {
          setGoogleLinked({
            nome: detectedName,
            email: detectedEmail,
            avatarUrl: detectedAvatar,
          });
          setForm((prev) => ({
            ...prev,
            ...(existingQ ?? {}),
            fullName: detectedName || prev.fullName,
            email: detectedEmail || prev.email,
            motivationGoalText: prev.motivationGoalText || detectedObjective || "",
            authMethod: "google",
          }));
        }
      } catch {
        /* ignore network errors */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function toggleLanguage(langOption: string) {
    setForm((prev) => {
      const zeroOption = PROGRAMMING_LANGUAGE_OPTIONS[0];
      if (langOption === zeroOption) {
        return {
          ...prev,
          knowsProgramming: "nao",
          programmingLanguages: [zeroOption],
        };
      }
      const withoutZero = prev.programmingLanguages.filter((l) => l !== zeroOption);
      const exists = withoutZero.includes(langOption);
      const nextList = exists
        ? withoutZero.filter((l) => l !== langOption)
        : [...withoutZero, langOption];
      const finalLangs = nextList.length > 0 ? nextList : [zeroOption];
      return {
        ...prev,
        knowsProgramming:
          finalLangs[0] === zeroOption
            ? "nao"
            : finalLangs.length >= 2
              ? "sim_pratico"
              : "sim_iniciante",
        programmingLanguages: finalLangs,
      };
    });
  }

  function advanceFromStep1() {
    setErrorMsg(null);
    if (form.fullName.trim().length < 3) {
      setErrorMsg("Por favor, digite seu nome completo (mínimo 3 letras).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorMsg("Por favor, digite um endereço de e-mail válido.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) {
      setErrorMsg("Por favor, preencha sua data de nascimento.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceFromStep2() {
    setErrorMsg(null);
    if (form.city.trim().length < 2) {
      setErrorMsg("Por favor, informe o nome da sua cidade.");
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceFromStep3() {
    setErrorMsg(null);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelect(questionId: string, optionIndex: number) {
    setItAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    if (errorMsg) {
      setErrorMsg(null);
    }
  }

  async function handleSubmitAdmission() {
    setErrorMsg(null);
    const missingQuestions = FUNDAMENTAL_IT_QUESTIONS.map((q, idx) =>
      typeof itAnswers[q.id] === "number" ? null : idx + 1,
    ).filter((n): n is number => n !== null);

    if (Object.keys(itAnswers).length < FUNDAMENTAL_IT_QUESTIONS.length || missingQuestions.length > 0) {
      setErrorMsg(
        `Responda todas as ${FUNDAMENTAL_IT_QUESTIONS.length} perguntas rápidas de informática antes de finalizar (faltam: questão ${missingQuestions.join(", ")}).`,
      );
      return;
    }

    const grade = gradeItAssessment(itAnswers);
    setShowItExplanations(true);
    if (!grade.passed) {
      setErrorMsg(
        `Você acertou ${grade.correctCount} de ${grade.totalQuestions} (${grade.scorePct}%). Leia as dicas abaixo, ajuste suas respostas para acertar pelo menos 3 questões e clique novamente!`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/aluno/admissao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaire: form,
          itAnswers,
          next: targetPath,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Não foi possível registrar sua admissão agora.");
        return;
      }
      try {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setActivationResult({
        emailSent: Boolean(data.emailSent),
        recipientEmail: data.recipientEmail,
        studentName: data.studentName,
        recommendedLevel: data.recommendedLevel,
        activationUrl: data.activationUrl,
        scorePct: data.itResult?.scorePct ?? grade.scorePct,
      });
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg("Erro de conexão ao enviar o questionário. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = [
    "1. Identificação",
    "2. Região & Perfil",
    "3. Bagagem & Motivação",
    "4. Teste Rápido",
    "5. Ativação por E-mail",
  ];

  const answeredQuestionsCount = Object.keys(itAnswers).length;
  const allQuestionsAnswered = answeredQuestionsCount === FUNDAMENTAL_IT_QUESTIONS.length;
  const missingQuestionNumbers = FUNDAMENTAL_IT_QUESTIONS.map((q, idx) =>
    typeof itAnswers[q.id] === "number" ? null : idx + 1,
  ).filter((n): n is number => n !== null);

  return (
    <div className="admission-gate-shell">
      <div className="admission-gate-card">
        {/* Clean Header */}
        <header className="admission-gate-header">
          <div className="admission-gate-badge-row">
            <span className="admission-pill-badge">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Acesso Exclusivo a Alunos
              Habilitados
            </span>
            <span className="admission-step-counter">Etapa {step} de 5</span>
          </div>

          <h2 className="admission-gate-title tracking-normal font-semibold leading-snug text-slate-100">
            {step === 1 && "Identificação & Cadastro Gratuito"}
            {step === 2 && "Seu Perfil Regional & Demográfico"}
            {step === 3 && "Sua Bagagem Técnica & Motivação"}
            {step === 4 && "Teste Rápido de Nivelamento em Informática"}
            {step === 5 && "Ative seu Acesso pelo Link do E-mail"}
          </h2>

          <p className="admission-gate-subtitle">
            {step === 1 &&
              "Para manter a qualidade didática e personalizar sua trilha, todo aluno se identifica (via Google ou E-mail), responde um perfil rápido e ativa a matrícula por e-mail."}
            {step === 2 &&
              "Essas informações ajudam a adaptar exemplos práticos para a realidade da sua região e equipamento."}
            {step === 3 &&
              "Queremos saber se você está começando do zero ou já programa para recomendar a trilha certa."}
            {step === 4 &&
              "Responda 5 perguntas fundamentais do dia a dia no computador (mínimo 3 acertos para habilitar seu link de acesso)."}
            {step === 5 &&
              "Parabéns pela aprovação! Confirme seu link de ativação abaixo para liberar todas as aulas e laboratórios."}
          </p>

          {/* Progress Stepper */}
          <div
            className="admission-stepper-bar flex flex-wrap gap-2"
            role="progressbar"
            aria-valuenow={step * 20}
            aria-valuemin={20}
            aria-valuemax={100}
          >
            {stepLabels.map((lbl, idx) => {
              const sNum = idx + 1;
              const isActive = sNum === step;
              const isDone = sNum < step;
              return (
                <div
                  key={lbl}
                  className={`admission-step-dot px-3 py-2 text-xs${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                >
                  <span className="admission-step-num">{isDone ? "✓" : sNum}</span>
                  <span className="admission-step-text">{lbl.split(". ")[1]}</span>
                </div>
              );
            })}
          </div>
        </header>

        {errorMsg && (
          <div className="admission-alert-error" role="alert">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: IDENTIFICAÇÃO (GOOGLE OAUTH OU E-MAIL DIRETO) */}
        {step === 1 && (
          <div className="admission-step-body">
            {googleLinked?.email ? (
              <div
                className="admission-oauth-box"
                style={{
                  borderColor: "rgba(34, 197, 94, 0.45)",
                  background: "rgba(34, 197, 94, 0.08)",
                }}
              >
                <div className="admission-oauth-info">
                  {googleLinked.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={googleLinked.avatarUrl}
                      alt=""
                      width={38}
                      height={38}
                      style={{ borderRadius: "999px", flexShrink: 0 }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
                  )}
                  <div>
                    <strong style={{ color: "#4ade80" }}>
                      Conta Google Conectada ({googleLinked.email})
                    </strong>
                    <p>
                      Nome e e-mail preenchidos automaticamente com os dados da sua conta.
                    </p>
                  </div>
                </div>
                <GoogleSignInButton
                  href={googleLoginHref}
                  label="Trocar conta Google"
                  compact
                />
              </div>
            ) : (
              <div
                className="admission-oauth-box"
                onClickCapture={() => {
                  try {
                    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
                  } catch {
                    /* ignore */
                  }
                }}
              >
                <div className="admission-oauth-info">
                  <strong>Opção Rápida: Vincular com sua conta Google</strong>
                  <p>Preenche seu nome e e-mail automaticamente com 1 clique.</p>
                </div>
                <GoogleSignInButton
                  href={googleLoginHref}
                  label="Autenticar com Google"
                  loadingLabel="Redirecionando ao Google..."
                />
              </div>
            )}

            <div className="admission-form-grid">
              <div className="admission-field">
                <label htmlFor="adm-name">Seu Nome Completo *</label>
                <input
                  id="adm-name"
                  type="text"
                  placeholder="Ex.: Rafael Maldivas"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="admission-input"
                />
              </div>

              <div className="admission-field">
                <label htmlFor="adm-email">Seu Melhor E-mail (receberá o link de ativação) *</label>
                <input
                  id="adm-email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="admission-input"
                />
              </div>

              <div className="admission-field">
                <label htmlFor="adm-birth">Data de Nascimento *</label>
                <input
                  id="adm-birth"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="admission-input"
                />
              </div>

              <div className="admission-field">
                <label htmlFor="adm-edu">Escolaridade Atual *</label>
                <select
                  id="adm-edu"
                  value={form.educationLevel}
                  onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                  className="admission-input"
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field admission-field-full">
                <label htmlFor="adm-found">Como você encontrou o site? *</label>
                <select
                  id="adm-found"
                  value={form.howFoundSite}
                  onChange={(e) => setForm({ ...form, howFoundSite: e.target.value })}
                  className="admission-input"
                >
                  {HOW_FOUND_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admission-footer-actions">
              <span className="admission-fine-note">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Seus dados são protegidos
                (LGPD) e usados exclusivamente para sua evolução e certificação.
              </span>
              <button
                type="button"
                onClick={advanceFromStep1}
                className="admission-btn-primary"
              >
                <span>Continuar para Etapa 2</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PERFIL REGIONAL, DEMOGRÁFICO & SOCIOECONÔMICO */}
        {step === 2 && (
          <div className="admission-step-body">
            <div className="admission-form-grid">
              <div className="admission-field">
                <label htmlFor="adm-uf">Estado (UF) *</label>
                <select
                  id="adm-uf"
                  value={form.stateUf}
                  onChange={(e) => setForm({ ...form, stateUf: e.target.value })}
                  className="admission-input"
                >
                  {BRAZIL_UF_OPTIONS.map((u) => (
                    <option key={u.uf} value={u.uf}>
                      {u.uf} — {u.name} ({u.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-city">Cidade *</label>
                <input
                  id="adm-city"
                  type="text"
                  placeholder="Ex.: São Paulo, Recife, Curitiba..."
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="admission-input"
                />
              </div>

              <div className="admission-field">
                <label htmlFor="adm-zone">Contexto Territorial / Zona</label>
                <select
                  id="adm-zone"
                  value={form.urbanZone}
                  onChange={(e) => setForm({ ...form, urbanZone: e.target.value })}
                  className="admission-input"
                >
                  {URBAN_ZONE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-eth">Autodeclaração Étnico-Racial (IBGE)</label>
                <select
                  id="adm-eth"
                  value={form.ethnicityIbge}
                  onChange={(e) => setForm({ ...form, ethnicityIbge: e.target.value })}
                  className="admission-input"
                >
                  {ETHNICITY_IBGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-gender">Gênero</label>
                <select
                  id="adm-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="admission-input"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-emp">Situação Ocupacional Atual</label>
                <select
                  id="adm-emp"
                  value={form.employmentStatus}
                  onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
                  className="admission-input"
                >
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-inc">Faixa de Renda Familiar Mensal</label>
                <select
                  id="adm-inc"
                  value={form.incomeBracket}
                  onChange={(e) => setForm({ ...form, incomeBracket: e.target.value })}
                  className="admission-input"
                >
                  {INCOME_BRACKET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-dev">Principal Equipamento de Estudo</label>
                <select
                  id="adm-dev"
                  value={form.deviceAccess}
                  onChange={(e) => setForm({ ...form, deviceAccess: e.target.value })}
                  className="admission-input"
                >
                  {DEVICE_ACCESS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admission-footer-actions">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="admission-btn-ghost"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={advanceFromStep2}
                className="admission-btn-primary"
              >
                <span>Continuar para Etapa 3</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BAGAGEM TÉCNICA, CULTURA DIGITAL & MOTIVAÇÃO */}
        {step === 3 && (
          <div className="admission-step-body">
            <div className="admission-field admission-field-full">
              <label>Você já conhece alguma linguagem de programação? (Marque as que conhece)</label>
              <div className="admission-chips-grid">
                {PROGRAMMING_LANGUAGE_OPTIONS.map((langOpt) => {
                  const selected = form.programmingLanguages.includes(langOpt);
                  return (
                    <button
                      key={langOpt}
                      type="button"
                      onClick={() => toggleLanguage(langOpt)}
                      className={`admission-chip${selected ? " is-selected" : ""}`}
                    >
                      <span>{selected ? "✓ " : ""}{langOpt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="admission-form-grid" style={{ marginTop: 16 }}>
              <div className="admission-field admission-field-full">
                <label htmlFor="adm-mot">Qual é a sua principal motivação para fazer o curso? *</label>
                <select
                  id="adm-mot"
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  className="admission-input"
                >
                  {MOTIVATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-style">Como você aprende melhor?</label>
                <select
                  id="adm-style"
                  value={form.learningStyle}
                  onChange={(e) => setForm({ ...form, learningStyle: e.target.value })}
                  className="admission-input"
                >
                  {LEARNING_STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field">
                <label htmlFor="adm-ai">Costume com Inteligência Artificial</label>
                <select
                  id="adm-ai"
                  value={form.aiUsage}
                  onChange={(e) => setForm({ ...form, aiUsage: e.target.value })}
                  className="admission-input"
                >
                  {AI_USAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admission-field admission-field-full">
                <label htmlFor="adm-goal">
                  Conte em 1 frase seu objetivo pessoal com este curso (Opcional)
                </label>
                <input
                  id="adm-goal"
                  type="text"
                  placeholder="Ex.: Quero construir um sistema real para o meu portfólio e conseguir minha vaga."
                  value={form.motivationGoalText}
                  onChange={(e) => setForm({ ...form, motivationGoalText: e.target.value })}
                  className="admission-input"
                />
              </div>
            </div>

            <div className="admission-footer-actions">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="admission-btn-ghost"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={advanceFromStep3}
                className="admission-btn-primary"
              >
                <span>Ir para o Teste Rápido de Informática</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TESTE DE NIVELAMENTO EM INFORMÁTICA FUNDAMENTAL */}
        {step === 4 && (
          <div className="admission-step-body">
            <div className="admission-quiz-list">
              {FUNDAMENTAL_IT_QUESTIONS.map((q) => {
                const chosen = itAnswers[q.id];
                const isCorrect = chosen === q.correctIndex;
                return (
                  <div key={q.id} className="admission-quiz-card">
                    <span className="admission-quiz-topic text-xs font-semibold tracking-wider">
                      {q.topic}
                    </span>
                    <h3 className="admission-quiz-question font-medium leading-relaxed text-slate-200">
                      {q.question}
                    </h3>
                    <div className="admission-quiz-options">
                      {q.options.map((optText, idx) => {
                        const optionKey = String.fromCharCode(65 + idx);
                        const isPicked = chosen === idx;
                        return (
                          <button
                            key={`${q.id}-${optionKey}`}
                            type="button"
                            aria-pressed={isPicked}
                            onClick={() => handleSelect(q.id, idx)}
                            className={`admission-quiz-option cursor-pointer transition-all ${
                              isPicked
                                ? "is-selected is-picked bg-cyan-950/50 border-cyan-500 text-white ring-1 ring-cyan-500/50"
                                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60"
                            }`}
                          >
                            <span
                              className={`admission-quiz-letter ${
                                isPicked
                                  ? "is-selected bg-cyan-500 text-slate-950 font-bold"
                                  : "bg-slate-800 text-slate-300 font-semibold"
                              }`}
                            >
                              {optionKey}
                            </span>
                            <span className="admission-quiz-option-text">{optText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showItExplanations && typeof chosen === "number" && (
                      <div
                        className={`admission-quiz-feedback ${
                          isCorrect ? "is-correct is-pass" : "is-wrong is-fail"
                        }`}
                      >
                        <strong>
                          {isCorrect ? "✓ Resposta certa!" : "💡 Dica para acertar:"}
                        </strong>{" "}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!allQuestionsAnswered && (
              <div className="admission-quiz-progress-hint" role="status">
                <span>
                  Você respondeu <strong>{answeredQuestionsCount}</strong> de{" "}
                  <strong>{FUNDAMENTAL_IT_QUESTIONS.length}</strong> perguntas. Faltam as questões:{" "}
                  <strong>{missingQuestionNumbers.join(", ")}</strong>.
                </span>
              </div>
            )}

            <div className="admission-footer-actions">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="admission-btn-ghost"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                disabled={submitting || !allQuestionsAnswered}
                onClick={handleSubmitAdmission}
                className="admission-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Validando e gerando link de ativação...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Concluir Teste &amp; Enviar Link de Ativação por E-mail</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: E-MAIL DE ATIVAÇÃO COM LINK MÁGICO */}
        {step === 5 && activationResult && (
          <div className="admission-step-body">
            <div className="admission-activation-box">
              <div className="admission-activation-icon">
                <Mail className="w-8 h-8" aria-hidden="true" />
              </div>
              <h2>
                Aprovado com {activationResult.scorePct}%! Seu Link de Ativação está pronto.
              </h2>
              <p>
                Registramos o perfil de <strong>{activationResult.studentName}</strong> e
                vinculamos o e-mail <strong>{activationResult.recipientEmail}</strong>. Com base
                nas suas respostas, sua trilha inicial recomendada é o{" "}
                <strong>Nível {activationResult.recommendedLevel.toUpperCase()}</strong>.
              </p>

              <div className="admission-email-card">
                <div className="admission-email-header">
                  <div>
                    <span className="admission-pill-badge">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> E-mail Oficial de
                      Habilitação Gerado
                    </span>
                    <div className="admission-email-meta">
                      <strong>Para:</strong> {activationResult.recipientEmail} ·{" "}
                      <strong>Assunto:</strong> Ative seu acesso ao curso Construa Seu Marketplace
                    </div>
                  </div>
                </div>

                <p className="admission-email-body-text">
                  Clique no link de ativação oficial abaixo para confirmar seu e-mail, gravar sua
                  credencial de aluno habilitado e entrar imediatamente na aula:
                </p>

                <a
                  href={activationResult.activationUrl}
                  className="admission-btn-activate"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Confirmar Meu E-mail &amp; Entrar no Curso Agora →</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
