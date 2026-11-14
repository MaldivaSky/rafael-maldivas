"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react";
import { courseBySlug, lessonBySlug } from "@/app/lib/courses";
import {
  LEGACY_M1_STORAGE_KEY,
  computeLessonMastery,
  type IdeLessonStage,
} from "@/app/lib/course-workspace";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { CourseIdeShell } from "./CourseIdeShell";
import MarketplaceMarginSimulator from "./MarketplaceMarginSimulator";
import PixFlowInteractive from "./PixFlowInteractive";
import LegalChecklistInteractive from "./LegalChecklistInteractive";
import LessonQuiz from "./LessonQuiz";
import NotebookLMMediaBlock, { type NotebookLMMediaConfig } from "./NotebookLMMediaBlock";
import { FillInTheBlankLab } from "./InteractivePracticeLab";
import { M1_FILL_BLANKS } from "@/app/lib/module-zero-practice";
import { localePath } from "@/app/lib/i18n";

const MODULE_ONE_MEDIA: NotebookLMMediaConfig = {
  sectionLabel: "Estúdio do Módulo 1 · Áudio, slides, mapa mental e prática",
  audio: {
    title: "A engenharia por trás do MySuperStore",
    src: "/cursos/midia/a-engenharia-por-tras-do-mysuperstore.m4a",
    summary:
      "Episódio de abertura explicando como pedido, sub-pedido, comissão, frete e repasse se conectam em produção.",
    durationLabel: "Áudio 18m42s",
  },
  deck: {
    title: "Arquitetura de Sistemas Reais",
    href: "/cursos/midia/arquitetura-de-sistemas-reais.pdf",
    summary:
      "Deck visual de 15 páginas para acompanhar a visão geral do marketplace, separação de responsabilidades e decisões de projeto.",
    pagesLabel: "15 slides · PDF",
  },
  mindMap: {
    title: "Mapa mental: MySuperStore por dentro",
    src: "/cursos/midia/mysuperstore-mapa-mental.png",
    alt: "Mapa mental da arquitetura do MySuperStore mostrando front-end Next.js, back-end Django, apps principais, pagamentos via Efí PIX e cartão, Redis, Celery e infraestrutura.",
    caption:
      "Mapa mental conferido contra o estudo da arquitetura do MySuperStore.",
  },
  publicLinks: [
    {
      tag: "Quiz · NotebookLM",
      label: "MySuperStore Quiz",
      description: "Perguntas públicas de revisão sobre o estudo de caso MySuperStore e modelo de dados.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/4bf48d2a-cc20-423a-b678-715dd9fc0906",
    },
    {
      tag: "Flashcards · NotebookLM",
      label: "Arquitetura de Software (Flashcards)",
      description: "Cartões de memória ativa abertos sem login para fixação rápida.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/f8a604cb-bd28-4519-b921-d7d0a36bd8ea",
    },
    {
      tag: "Quiz · NotebookLM",
      label: "Arquitetura Quiz",
      description: "Teste público geral de arquitetura e fluxo de pedidos.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/212b3f78-a4bd-4841-b047-3df36a96b772",
    },
    {
      tag: "Quiz · NotebookLM",
      label: "Teste Automatizado Quiz",
      description: "Quiz público sobre testes automatizados e prevenção de regressões.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/1b3b036d-5ffb-4967-b448-0927fc2398fc",
    },
    {
      tag: "Quiz · NotebookLM",
      label: "Arquitetura Backend Quiz",
      description: "Quiz público sobre camadas do back-end, fluxos e decisões de arquitetura.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/934ca30e-27c5-4015-8da8-5c9a6ed743a3",
    },
    {
      tag: "Relatório · NotebookLM",
      label: "Decisões de Arquitetura e Engenharia de Software",
      description: "Relatório público sintetizando decisões técnicas e trade-offs do projeto.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/bc399589-f25c-4ee4-a583-f6c3aed6a7a0",
    },
    {
      tag: "Mapa Mental · NotebookLM",
      label: "Arquitetura Mapa Mental",
      description: "Mapa mental interativo público conectando os componentes da arquitetura.",
      href: "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/9198ac38-7d79-4c6c-8a94-e355ead4c510",
    },
  ],
};

const M1_SLUG = "modulo-1-visao-do-negocio";

type LocalSimState = {
  simulatorUsed: boolean;
  pixFlowUsed: boolean;
  checklistUsed: boolean;
};

export default function ModuleOneLessonClient({
  courseSlug,
  nextLessonSlug,
}: {
  courseSlug: string;
  nextLessonSlug?: string;
}) {
  const {
    workspace,
    syncStatus,
    isAuthenticated,
    setCodeDraft,
    recordLabResult,
    recordQuizScore,
    setNote,
    reviewSrsCard,
    toggleLessonCompleted,
    toggleDeployStep,
    recordTerminalProgress,
    updatePreferences,
  } = useCourseWorkspace(courseSlug);

  const [activeStage, setActiveStage] = useState<IdeLessonStage>("predict");
  const [simState, setSimState] = useState<LocalSimState>({
    simulatorUsed: false,
    pixFlowUsed: false,
    checklistUsed: false,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LEGACY_M1_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LocalSimState>;
      setSimState({
        simulatorUsed: Boolean(parsed.simulatorUsed),
        pixFlowUsed: Boolean(parsed.pixFlowUsed),
        checklistUsed: Boolean(parsed.checklistUsed),
      });
    } catch {
      // ignore invalid legacy JSON
    }
  }, []);

  function markSimUsed(key: keyof LocalSimState) {
    setSimState((prev) => {
      const next = { ...prev, [key]: true };
      try {
        window.localStorage.setItem(
          LEGACY_M1_STORAGE_KEY,
          JSON.stringify({ ...next, completed: workspace.completedSlugs.includes(M1_SLUG) }),
        );
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  const canonicalLesson = useMemo(() => {
    const course = courseBySlug(courseSlug);
    const found = course ? lessonBySlug(course, M1_SLUG) : undefined;
    return (
      found ?? {
        id: "licao-01",
        slug: M1_SLUG,
        moduleNumber: 1,
        title: "A01 — O negócio do marketplace: de onde vem o dinheiro e quanto sobra",
        summary: "Divisão real de um pedido entre cliente, lojista, provedor de pagamento e plataforma.",
        durationMin: 120,
        status: "gratuita" as const,
        prerequisites: ["licao-f06"],
        objectives: [],
      }
    );
  }, [courseSlug]);

  const quizEntry = workspace.quizScores[M1_SLUG];
  const completed = workspace.completedSlugs.includes(M1_SLUG);
  const mastery = useMemo(
    () => computeLessonMastery(M1_SLUG, workspace),
    [workspace],
  );

  const stepsDone = [
    simState.simulatorUsed,
    simState.pixFlowUsed,
    simState.checklistUsed,
    quizEntry !== undefined,
  ].filter(Boolean).length;
  const pct = completed ? 100 : Math.round((stepsDone / 4) * 100);

  const showPredict = activeStage === "all" || activeStage === "predict";
  const showConcept = activeStage === "all" || activeStage === "concept";
  const showPractice = activeStage === "all" || activeStage === "practice";
  const showQuiz = activeStage === "all" || activeStage === "quiz";

  return (
    <CourseIdeShell
      courseSlug={courseSlug}
      lesson={canonicalLesson}
      workspace={workspace}
      syncStatus={syncStatus}
      isAuthenticated={isAuthenticated}
      activeStage={activeStage}
      onChangeStage={setActiveStage}
      onUpdatePreferences={updatePreferences}
      onUpdateCodeDraft={setCodeDraft}
      onRecordLabResult={recordLabResult}
      onUpdateNotes={setNote}
      onReviewSrsCard={reviewSrsCard}
      onToggleDeployStep={toggleDeployStep}
      onRecordTerminalProgress={recordTerminalProgress}
    >
      <div className="curso-lesson-body">
        <aside className="curso-progress-bar-box" aria-label="Progresso no Módulo 1">
          <div className="curso-progress-top">
            <div>
              <strong>Progresso do Módulo 1 (IDE sincronizada)</strong>
              <p className="curso-fine">
                {stepsDone} de 4 atividades práticas interagidas ·{" "}
                {quizEntry
                  ? `Quiz: ${quizEntry.score}/${quizEntry.total} (${quizEntry.pct}%)`
                  : "Quiz pendente"}
              </p>
            </div>
            <div className="curso-progress-actions">
              <a
                href="/cursos/construa-seu-marketplace-modulo-1.pdf"
                download="construa-seu-marketplace-modulo-1.pdf"
                className="btn btn-ghost curso-btn-sm"
              >
                <Download size={15} aria-hidden="true" />
                Baixar PDF do Módulo 1
              </a>
              <button
                type="button"
                className={`btn curso-btn-sm ${completed ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggleLessonCompleted(M1_SLUG, canonicalLesson.id)}
                aria-pressed={completed}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                {completed ? "Módulo concluído" : "Marcar como concluído"}
              </button>
            </div>
          </div>

          {!completed && !mastery.readyForCompletion && (
            <p className="ide-mastery-hint">
              Missão desta Fase: avance pelas 4 etapas acima, conclua o Lab de Split em centavos na
              Arena Prática e faça pelo menos 70% no Boss Quiz (+100 XP).
            </p>
          )}

          <div
            className="curso-progress-track"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="curso-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </aside>

        {showPredict && <NotebookLMMediaBlock media={MODULE_ONE_MEDIA} />}

        {showConcept && (
          <article className="curso-prose">
            <h2>1. Por que um marketplace não é um e-commerce comum</h2>
            <p>
              Em uma loja virtual comum, existe um comprador e um vendedor. Todo o dinheiro entra em
              uma única conta, o frete é calculado para um único CEP de origem e o estoque pertence a
              um único dono.
            </p>
            <p>
              No <strong>MySuperStore</strong> (sistema Django em produção usado como estudo de caso
              deste curso), um único carrinho pode reunir produtos de lojas diferentes. Quando o
              cliente fecha a compra, o sistema precisa dividir um pagamento único em múltiplos{" "}
              <strong>sub-pedidos</strong>, calcular a comissão de cada loja, absorver ou repassar
              taxas do provedor de pagamento e manter cada centavo reconciliado.
            </p>

            <figure className="curso-svg-figure">
              <svg
                viewBox="0 0 760 230"
                className="curso-svg"
                role="img"
                aria-labelledby="svg-split-title svg-split-desc"
              >
                <title id="svg-split-title">
                  Divisão de um pedido em sub-pedidos, repasse e comissão no MySuperStore
                </title>
                <desc id="svg-split-desc">
                  Diagrama mostrando que um Order possui um Payment e se divide em SubOrders por
                  lojista, gerando um Payout para o lojista e uma CommissionEntry para a plataforma.
                </desc>
                <rect x="20" y="75" width="160" height="80" rx="12" className="svg-box-accent" />
                <text x="100" y="108" textAnchor="middle" className="svg-title">Order (Pedido)</text>
                <text x="100" y="130" textAnchor="middle" className="svg-sub">1 pagamento único</text>

                <line x1="180" y1="115" x2="250" y2="60" className="svg-line" />
                <line x1="180" y1="115" x2="250" y2="170" className="svg-line" />

                <rect x="250" y="20" width="190" height="75" rx="12" className="svg-box" />
                <text x="345" y="50" textAnchor="middle" className="svg-title">SubOrder Loja A</text>
                <text x="345" y="72" textAnchor="middle" className="svg-sub">Envio + rastreio próprios</text>

                <rect x="250" y="135" width="190" height="75" rx="12" className="svg-box" />
                <text x="345" y="165" textAnchor="middle" className="svg-title">SubOrder Loja B</text>
                <text x="345" y="187" textAnchor="middle" className="svg-sub">Envio + rastreio próprios</text>

                <line x1="440" y1="57" x2="515" y2="42" className="svg-line" />
                <line x1="440" y1="57" x2="515" y2="85" className="svg-line" />

                <rect x="515" y="15" width="225" height="44" rx="10" className="svg-box" />
                <text x="627" y="42" textAnchor="middle" className="svg-sub-strong">
                  Payout: (subtotal − comissão) + frete
                </text>

                <rect x="515" y="68" width="225" height="44" rx="10" className="svg-box" />
                <text x="627" y="95" textAnchor="middle" className="svg-sub-strong">
                  CommissionEntry: subtotal × taxa
                </text>

                <rect x="515" y="142" width="225" height="60" rx="10" className="svg-box-muted" />
                <text x="627" y="168" textAnchor="middle" className="svg-sub">
                  Taxa do provedor (Efí)
                </text>
                <text x="627" y="188" textAnchor="middle" className="svg-sub">
                  sai da comissão da plataforma
                </text>
              </svg>
              <figcaption>
                Estrutura real em <code>backend/apps/orders/models.py</code> e{" "}
                <code>backend/apps/payments/models.py</code>.
              </figcaption>
            </figure>

            <h2>2. A conta honesta: comissão menos taxa do provedor</h2>
            <p>
              Um erro clássico ao projetar um marketplace é olhar apenas para a porcentagem de comissão
              (por exemplo, 12%) e esquecer que a taxa do meio de pagamento incide sobre o{" "}
              <strong>valor total pago pelo cliente</strong>, e não apenas sobre a comissão.
            </p>
            <p>
              Usando os parâmetros de exemplo do código de referência do MySuperStore ({" "}
              <code>settings/base.py:340-351</code>, que devem sempre ser confirmados no contrato com
              o provedor) para um pedido de <strong>R$ 100,00</strong> em produtos, sem frete e sem
              cupom:
            </p>

            <div className="curso-table-wrap">
              <table className="curso-table">
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Comissão (12%)</th>
                    <th>Taxa do provedor (exemplo)</th>
                    <th>Sobra da plataforma</th>
                    <th>Repasse ao lojista</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PIX</td>
                    <td>R$ 12,00</td>
                    <td>0,99% = R$ 0,99</td>
                    <td>
                      <strong>R$ 11,01</strong>
                    </td>
                    <td>R$ 88,00</td>
                  </tr>
                  <tr>
                    <td>Cartão</td>
                    <td>R$ 12,00</td>
                    <td>3,99% + R$ 0,39 = R$ 4,38</td>
                    <td>
                      <strong>R$ 7,62</strong>
                    </td>
                    <td>R$ 88,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="curso-fine">
              Observação: os valores acima são exemplos ilustrativos baseados em configurações de
              referência verificadas no código em 12/11/2026. Não representam garantia de margem ou
              resultado financeiro.
            </p>

            <figure className="curso-svg-figure">
              <svg
                viewBox="0 0 760 175"
                className="curso-svg"
                role="img"
                aria-labelledby="svg-bar-title svg-bar-desc"
              >
                <title id="svg-bar-title">
                  Comparação visual da sobra da plataforma em R$ 100,00: PIX versus Cartão
                </title>
                <desc id="svg-bar-desc">
                  Barras proporcionais mostrando que em R$ 100,00, o lojista recebe R$ 88,00 nos dois
                  casos, mas a plataforma fica com R$ 11,01 no PIX contra R$ 7,62 no cartão.
                </desc>
                <text x="20" y="34" className="svg-title">PIX (R$ 100,00)</text>
                <rect x="160" y="16" width="480" height="28" rx="6" className="svg-bar-seller" />
                <rect x="642" y="16" width="88" height="28" rx="6" className="svg-bar-net" />
                <rect x="732" y="16" width="10" height="28" rx="3" className="svg-bar-fee" />
                <text x="400" y="35" textAnchor="middle" className="svg-bar-txt">Lojista: R$ 88,00</text>
                <text x="160" y="64" className="svg-sub">
                  Comissão R$ 12,00 − Taxa R$ 0,99 = Sobra R$ 11,01
                </text>

                <text x="20" y="114" className="svg-title">Cartão (R$ 100,00)</text>
                <rect x="160" y="96" width="480" height="28" rx="6" className="svg-bar-seller" />
                <rect x="642" y="96" width="60" height="28" rx="6" className="svg-bar-net" />
                <rect x="704" y="96" width="38" height="28" rx="6" className="svg-bar-fee" />
                <text x="400" y="115" textAnchor="middle" className="svg-bar-txt">Lojista: R$ 88,00</text>
                <text x="160" y="144" className="svg-sub">
                  Comissão R$ 12,00 − Taxa R$ 4,38 = Sobra R$ 7,62
                </text>
              </svg>
            </figure>

            <h2>3. Regras que evitam prejuízo silencioso no código</h2>
            <ul>
              <li>
                <strong>Dinheiro em centavos inteiros ou Decimal:</strong> nunca use <code>float</code>.
                Arredonde sempre com critério explícito (<code>ROUND_HALF_UP</code>) e valide a
                conservação: <code>valor_do_lojista + comissão == total_pago_pelo_cliente</code>.
              </li>
              <li>
                <strong>O servidor recalcula tudo:</strong> qualquer subtotal, cupom ou frete enviado
                pelo navegador é tratado apenas como entrada; o backend recalcula a partir do banco
                (<code>orders/serializers.py:224-231</code>).
              </li>
              <li>
                <strong>Comissão não incide sobre o frete:</strong> no MySuperStore, o frete vai
                integralmente para o lojista. Se houver frete grátis acima de um mínimo (ex.: R$ 299,00
                no exemplo), o frete cobrado do cliente zera.
              </li>
              <li>
                <strong>Idempotência e baixa condicional:</strong> webhooks chegam repetidos e dois
                compradores clicam juntos na última peça. Sem trava de linha e atualização condicional,
                o sistema vende o que não tem e repassa duas vezes.
              </li>
            </ul>
          </article>
        )}

        {showPractice && (
          <>
            <MarketplaceMarginSimulator onInteract={() => markSimUsed("simulatorUsed")} />
            <PixFlowInteractive onInteract={() => markSimUsed("pixFlowUsed")} />
            <LegalChecklistInteractive onInteract={() => markSimUsed("checklistUsed")} />
            <FillInTheBlankLab exercises={M1_FILL_BLANKS} />
          </>
        )}

        {showQuiz && (
          <LessonQuiz
            onComplete={(score) => recordQuizScore(M1_SLUG, canonicalLesson.id, score, 9)}
          />
        )}

        <section className="curso-lesson-footer-cta">
          <div className="curso-pdf-box">
            <div>
              <h3>
                <FileText size={20} aria-hidden="true" />
                Material de apoio do Módulo 1 em PDF
              </h3>
              <p className="curso-muted">
                Resumo completo com as fórmulas em centavos inteiros, tabela comparativa PIX × Cartão
                e os diagramas de referência para consultar offline.
              </p>
            </div>
            <a
              href="/cursos/construa-seu-marketplace-modulo-1.pdf"
              download="construa-seu-marketplace-modulo-1.pdf"
              className="btn btn-primary"
            >
              <Download size={16} aria-hidden="true" />
              Baixar PDF gratuito
            </a>
          </div>

          <div className="curso-lesson-nav">
            <Link
              href={localePath(`/cursos/${courseSlug}`, "pt")}
              className="btn btn-ghost"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar para a ementa do curso
            </Link>

            {nextLessonSlug && (
              <Link
                href={localePath(`/cursos/${courseSlug}/${nextLessonSlug}`, "pt")}
                className="btn btn-primary"
              >
                Próxima: A02 — Modelo de dados do pedido
              </Link>
            )}
          </div>
        </section>
      </div>
    </CourseIdeShell>
  );
}
