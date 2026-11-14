import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { COURSES, allCourseLessons } from "../app/lib/courses.ts";
import {
  COURSE_SRS_CARDS,
  computeCourseGamification,
  computeLessonMastery,
  countDueSrsCards,
  createEmptyWorkspaceState,
  isSrsCardDue,
  mergeWorkspaceStates,
  migrateLegacyLocalProgress,
  scheduleSrsCard,
} from "../app/lib/course-workspace.ts";
import {
  COURSE_LABS,
  createInitialHttpSandboxState,
  executeHttpLabRequest,
} from "../app/lib/course-labs.ts";
import {
  COURSE_LEVELS,
  DEFAULT_CLOTHING_STOREFRONT,
  getDeployCardsForLevel,
} from "../app/lib/course-levels.ts";
import {
  generateRenderBlueprintYaml,
  generateStandaloneStoreHtml,
} from "../app/lib/store-generator.ts";
import {
  createInitialTerminalState,
  executeTerminalCommand,
  getRecommendedTerminalMission,
} from "../app/lib/terminal-sim.ts";
import { MYSUPERSTORE_REPO_FILES, findRepoFilesForLesson } from "../app/lib/mysuperstore-repo.ts";
import {
  ENGINEERING_ACTS,
  LESSON_QUEST_BRIEFINGS,
  getLessonQuestBriefing,
} from "../app/lib/course-game-engine.ts";
import {
  FUNDAMENTAL_IT_QUESTIONS,
  calculateAgeAndBracket,
  computeEthnographicDashboardStats,
  deriveMacroRegion,
  gradeItAssessment,
  recommendCourseLevelFromAdmission,
  validateAdmissionQuestionnaire,
} from "../app/lib/course-admission.ts";
import {
  issueAdmissionCompletedToken,
  issueEmailActivationToken,
  issueStudentSession,
  verifyAdmissionCompletedToken,
  verifyEmailActivationToken,
  verifyStudentSession,
} from "../app/lib/student-auth.ts";

describe("Course IDE Labs, SRS & Workspace State", () => {
  it("cobre todas as 18 aulas do marketplace com labs e flashcards SRS", () => {
    const course = COURSES["construa-seu-marketplace"];
    const lessons = allCourseLessons(course);
    assert.equal(lessons.length, 18);

    const srsBySlug = new Set(COURSE_SRS_CARDS.map((c) => c.lessonSlug));
    for (const lesson of lessons) {
      const lab = COURSE_LABS[lesson.slug];
      assert.ok(lab, `Lab ausente para aula ${lesson.slug}`);
      assert.ok(lab.starterCode.length > 20);
      assert.ok(lab.solutionCode.length > 20);
      assert.ok(lab.testRunnerCode.includes("__TEST_RESULT__:"));
      assert.equal(lab.hints.length, 3);
      assert.ok(srsBySlug.has(lesson.slug), `Flashcard SRS ausente para ${lesson.slug}`);
    }
    assert.ok(MYSUPERSTORE_REPO_FILES.length >= 8);
    assert.ok(findRepoFilesForLesson("modulo-3-confirmar-pagamento-webhook").length >= 1);
  });

  it("agenda revisao espacada SM-2 lite corretamente (Again=0d, Good=1d->3d, Easy=4d)", () => {
    const now = Date.UTC(2026, 10, 13, 12, 0, 0);

    const easyFirst = scheduleSrsCard(undefined, 4, now);
    assert.equal(easyFirst.reps, 1);
    assert.equal(easyFirst.intervalDays, 4);
    assert.equal(isSrsCardDue(easyFirst, now + 60_000), false);
    assert.equal(isSrsCardDue(easyFirst, now + 4 * 86_400_000 + 1), true);

    const good1 = scheduleSrsCard(undefined, 3, now);
    assert.equal(good1.intervalDays, 1);
    const good2 = scheduleSrsCard(good1, 3, now + 86_400_000);
    assert.equal(good2.intervalDays, 3);

    const again = scheduleSrsCard(good2, 1, now + 4 * 86_400_000);
    assert.equal(again.reps, 0);
    assert.equal(again.intervalDays, 0);
    assert.equal(isSrsCardDue(again, now + 4 * 86_400_000), true);
  });

  it("migra progresso legado e mescla estados preservando maior maestria", () => {
    const store = new Map([
      ["maldivas-curso-m0-done-v1", JSON.stringify(["modulo-0-f01-o-mapa"])],
      ["maldivas-curso-m1-progresso-v1", JSON.stringify(["modulo-1-visao-do-negocio"])],
    ]);
    const mockStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
    };

    const migrated = migrateLegacyLocalProgress(mockStorage);
    assert.ok(migrated.completedSlugs.includes("modulo-0-f01-o-mapa"));
    assert.ok(migrated.completedSlugs.includes("modulo-1-visao-do-negocio"));

    const remote = createEmptyWorkspaceState("2026-11-13T10:00:00.000Z");
    remote.labsPassed["modulo-3-confirmar-pagamento-webhook"] = {
      passed: true,
      attempts: 2,
      lastRunAt: "2026-11-13T10:00:00.000Z",
    };
    remote.quizScores["modulo-3-confirmar-pagamento-webhook"] = {
      score: 4,
      total: 5,
      pct: 80,
      updatedAt: "2026-11-13T10:00:00.000Z",
    };

    const merged = mergeWorkspaceStates(migrated, remote);
    const mastery = computeLessonMastery("modulo-3-confirmar-pagamento-webhook", merged);
    assert.equal(mastery.labPassed, true);
    assert.equal(mastery.quizPassed, true);
    assert.equal(mastery.readyForCompletion, true);
    assert.equal(countDueSrsCards(merged).total, COURSE_SRS_CARDS.length);
  });

  it("expoe 3 niveis progressivos (facil vitrine, mediano sem gateway, dificil completo) e cards R$ 0", () => {
    const course = COURSES["construa-seu-marketplace"];
    const validSlugs = new Set(allCourseLessons(course).map((l) => l.slug));

    for (const lvl of Object.values(COURSE_LEVELS)) {
      assert.ok(lvl.recommendedSlugs.length >= 6);
      for (const s of lvl.recommendedSlugs) {
        assert.ok(validSlugs.has(s), `Slug invalido ${s} no nivel ${lvl.id}`);
      }
    }

    assert.equal(COURSE_LEVELS.dificil.recommendedSlugs.length, 18);
    assert.ok(COURSE_LEVELS.facil.recommendedSlugs.length < COURSE_LEVELS.mediano.recommendedSlugs.length);
    assert.ok(COURSE_LEVELS.mediano.recommendedSlugs.length < COURSE_LEVELS.dificil.recommendedSlugs.length);

    const facilCards = getDeployCardsForLevel("facil").map((c) => c.provider);
    assert.deepEqual(facilCards, ["GitHub", "Vercel"]);

    const medianoCards = getDeployCardsForLevel("mediano").map((c) => c.provider);
    assert.deepEqual(medianoCards, ["GitHub", "Neon PostgreSQL", "Render", "Vercel"]);

    assert.ok(DEFAULT_CLOTHING_STOREFRONT.length >= 3);
    for (const item of DEFAULT_CLOTHING_STOREFRONT) {
      assert.ok(
        fs.existsSync(path.join(process.cwd(), "public", item.imagePath)),
        `Imagem ausente para produto: ${item.imagePath}`,
      );
    }

    for (const card of getDeployCardsForLevel("dificil")) {
      assert.ok(card.stepVisuals.length >= 3, `${card.provider} precisa de >= 3 telas visuais`);
      for (const vis of card.stepVisuals) {
        assert.ok(
          fs.existsSync(path.join(process.cwd(), "public", vis.imagePath)),
          `Imagem ausente no passo visual: ${vis.imagePath}`,
        );
      }
    }

    const html = generateStandaloneStoreHtml({
      storeName: "Loja <Script> Teste",
      whatsappDigits: "(11) 98765-4321",
      accentHex: "#22C55E",
      products: [
        {
          id: "t1",
          name: "Jaqueta Corta-Vento",
          priceCents: 19990,
          sizes: ["P", "M", "G"],
          colorHex: "#22C55E",
          badge: "Top",
        },
      ],
    });
    assert.ok(html.includes("Loja &lt;Script&gt; Teste"));
    assert.ok(html.includes("Jaqueta Corta-Vento"));
    assert.ok(html.includes("11987654321"));
    assert.ok(generateRenderBlueprintYaml().includes("plan: free"));
  });
});

describe("Stateful HTTP & Webhook Sandbox Simulator", () => {
  it("aplica fail-closed no webhook, idempotencia no replay, split no servidor e teto no estorno", () => {
    let state = createInitialHttpSandboxState();

    // 1. Healthcheck
    const resHealth = executeHttpLabRequest(state, {
      method: "GET",
      path: "/api/v1/health",
      headers: {},
      bodyText: "",
    });
    assert.equal(resHealth.status, 200);
    state = resHealth.nextState;

    // 2. Criar pedido sem auth -> 401
    const resNoAuth = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/orders",
      headers: {},
      bodyText: JSON.stringify({ orderId: "ord-1", items: [{ productId: "cafeteira-pro", qty: 1 }] }),
    });
    assert.equal(resNoAuth.status, 401);
    state = resNoAuth.nextState;

    // 3. Criar pedido valido (1x Cafeteira 24990 com BEMVINDO10 -> 22491)
    const resOrder = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/orders",
      headers: { Authorization: "Bearer aluno-token" },
      bodyText: JSON.stringify({
        orderId: "ord-1",
        items: [{ productId: "cafeteira-pro", qty: 1 }],
        couponCode: "BEMVINDO10",
      }),
    });
    assert.equal(resOrder.status, 201);
    assert.equal(resOrder.nextState.products["cafeteira-pro"].stock, 1);
    state = resOrder.nextState;

    // 4. Tentar overselling (pedir 2 quando resta 1) -> 409
    const resOversell = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/orders",
      headers: { Authorization: "Bearer aluno-token" },
      bodyText: JSON.stringify({
        orderId: "ord-2",
        items: [{ productId: "cafeteira-pro", qty: 2 }],
      }),
    });
    assert.equal(resOversell.status, 409);
    state = resOversell.nextState;

    // 5. Webhook com assinatura invalida -> 401 fail-closed
    const resBadSig = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/webhooks/efi",
      headers: { "X-Webhook-Signature": "errada", "Idempotency-Key": "evt-1" },
      bodyText: JSON.stringify({ orderId: "ord-1", status: "CONCLUIDA" }),
    });
    assert.equal(resBadSig.status, 401);
    assert.equal(resBadSig.nextState.platformRevenueCents, 0);
    state = resBadSig.nextState;

    // 6. Webhook valido 1a vez -> processa e credita split
    const resWh1 = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/webhooks/efi",
      headers: { "X-Webhook-Signature": "secret-ok", "Idempotency-Key": "evt-1" },
      bodyText: JSON.stringify({ orderId: "ord-1", status: "CONCLUIDA" }),
    });
    assert.equal(resWh1.status, 200);
    assert.equal(resWh1.body.processed, true);
    state = resWh1.nextState;
    const revAfterFirst = state.platformRevenueCents;
    const sellerAfterFirst = state.sellerLedgerCents["loja-alfa"];
    assert.ok(revAfterFirst > 0);
    assert.equal(revAfterFirst + sellerAfterFirst, 22491);

    // 7. Reenvio do mesmo webhook -> deduplica sem dobrar ledger
    const resWh2 = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/webhooks/efi",
      headers: { "X-Webhook-Signature": "secret-ok", "Idempotency-Key": "evt-1" },
      bodyText: JSON.stringify({ orderId: "ord-1", status: "CONCLUIDA" }),
    });
    assert.equal(resWh2.status, 200);
    assert.equal(resWh2.body.deduplicated, true);
    state = resWh2.nextState;
    assert.equal(state.platformRevenueCents, revAfterFirst);
    assert.equal(state.sellerLedgerCents["loja-alfa"], sellerAfterFirst);

    // 8. Estorno parcial + bloqueio de estorno acima do pago
    const resRefundOk = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/refunds",
      headers: { Authorization: "Bearer aluno-token" },
      bodyText: JSON.stringify({ orderId: "ord-1", amountCents: 5000 }),
    });
    assert.equal(resRefundOk.status, 200);
    assert.equal(resRefundOk.body.remainingRefundableCents, 17491);
    state = resRefundOk.nextState;

    const resRefundOver = executeHttpLabRequest(state, {
      method: "POST",
      path: "/api/v1/refunds",
      headers: { Authorization: "Bearer aluno-token" },
      bodyText: JSON.stringify({ orderId: "ord-1", amountCents: 17492 }),
    });
    assert.equal(resRefundOver.status, 422);
  });
});

describe("Interactive Black Terminal Simulator (Tela Preta Primeiro)", () => {
  it("bloqueia git add sem .gitignore e conclui Missoes 1 e 2 passo a passo", () => {
    let term = createInitialTerminalState();

    // Tentar git init na raiz ~ deve alertar e nao inicializar
    term = executeTerminalCommand(term, "git init").nextState;
    assert.equal(term.gitInitialized, false);

    // Executar Misssao 1 ate git init
    term = executeTerminalCommand(term, "pwd").nextState;
    term = executeTerminalCommand(term, "ls").nextState;
    term = executeTerminalCommand(term, "mkdir minha-loja").nextState;
    term = executeTerminalCommand(term, "cd minha-loja").nextState;
    assert.equal(term.cwd, "~/minha-loja");
    term = executeTerminalCommand(term, "git init").nextState;
    assert.equal(term.gitInitialized, true);

    // Mentor deve bloquear `git add .` enquanto `.env` nao estiver no `.gitignore`
    const blockedAdd = executeTerminalCommand(term, "git add .");
    assert.equal(blockedAdd.nextState.stagedFiles.length, 0);
    assert.ok(blockedAdd.lines.some((l) => l.text.includes("BLOQUEADO")));

    // Proteger .env -> add -> commit conclui Missao 1
    term = executeTerminalCommand(term, "echo .env > .gitignore").nextState;
    term = executeTerminalCommand(term, "git add .").nextState;
    assert.ok(term.stagedFiles.includes("index.html"));
    assert.ok(!term.stagedFiles.includes(".env"));
    const commitRes = executeTerminalCommand(term, 'git commit -m "primeira loja"');
    term = commitRes.nextState;
    assert.ok(term.completedMissions.includes("mission-1-git-basics"));

    // Missao 2: Python + Django
    const pipBlocked = executeTerminalCommand(term, "pip install -r requirements.txt");
    assert.equal(pipBlocked.nextState.pipInstalled, false);

    term = executeTerminalCommand(term, "python -m venv .venv").nextState;
    term = executeTerminalCommand(term, "source .venv/bin/activate").nextState;
    assert.equal(term.venvActive, true);
    term = executeTerminalCommand(term, "pip install -r requirements.txt").nextState;
    term = executeTerminalCommand(term, "python manage.py migrate").nextState;
    term = executeTerminalCommand(term, "python manage.py test").nextState;
    assert.equal(term.testsPassed, true);
    assert.ok(term.completedMissions.includes("mission-2-django-env"));

    // Missao 3: Auditoria de Producao & Deploy Seguro
    term = executeTerminalCommand(term, "git status").nextState;
    assert.ok(term.completedStepIds.includes("m3-status"));
    term = executeTerminalCommand(term, "python manage.py check --deploy").nextState;
    assert.ok(term.completedStepIds.includes("m3-check-deploy"));
    term = executeTerminalCommand(term, "git push origin main").nextState;
    assert.ok(term.completedMissions.includes("mission-3-deploy-check"));
  });

  it("mapeia licoes para a missao do terminal recomendada, calcula XP/patente e possui o kit Casa Pre-Moldada", () => {
    assert.equal(getRecommendedTerminalMission("modulo-0-f01-o-mapa"), "mission-1-git-basics");
    assert.equal(getRecommendedTerminalMission("modulo-0-f03-primeiro-projeto-django"), "mission-2-django-env");
    assert.equal(getRecommendedTerminalMission("modulo-5-infraestrutura-deploy-backup"), "mission-3-deploy-check");

    const ws = createEmptyWorkspaceState();
    ws.completedSlugs = ["modulo-0-f01-o-mapa", "modulo-0-f02-preparando-a-bancada"];
    ws.terminalSteps = ["m1-pwd", "m1-ls", "m1-mkdir", "m1-cd"];
    const game = computeCourseGamification(ws, COURSE_LEVELS.facil.recommendedSlugs);
    assert.equal(game.xp, 300);
    assert.equal(game.levelNumber, 2);
    assert.equal(game.rankTitle, "Construtor");
    assert.equal(game.trackCompleted, 2);
    assert.equal(game.trackTotal, 6);

    const zipPath = path.join(process.cwd(), "public/cursos/kits/casa-pre-moldada-marketplace.zip");
    assert.ok(fs.existsSync(zipPath), "casa-pre-moldada-marketplace.zip deve existir");
    assert.ok(fs.statSync(zipPath).size > 2000, "casa-pre-moldada-marketplace.zip nao pode estar vazio");
  });

  it("respeita a ordem de engenharia em 6 Atos, briefings por aula e diagramas SVG de modelagem/esqueleto", () => {
    assert.equal(ENGINEERING_ACTS.length, 6);
    assert.deepEqual(
      ENGINEERING_ACTS.map((a) => a.actNumber),
      [1, 2, 3, 4, 5, 6],
    );

    const lessons = allCourseLessons(COURSES["construa-seu-marketplace"]);
    for (const lesson of lessons) {
      const brief = getLessonQuestBriefing(lesson.slug);
      assert.ok(LESSON_QUEST_BRIEFINGS[lesson.slug], `Briefing ausente para ${lesson.slug}`);
      assert.ok(brief.actNumber >= 1 && brief.actNumber <= 6);
      assert.ok(brief.whyBeforeCode.length > 30);
      assert.ok(brief.whatYouWillBuild.length > 20);
      assert.ok(brief.primaryStationTitle.length > 10);
    }

    // F01 (Ato 1) introduz a planta, NAO despeja download de .zip sem explicacao
    const f01 = getLessonQuestBriefing("modulo-0-f01-o-mapa");
    assert.equal(f01.actNumber, 1);
    assert.equal(f01.unlocksDownloadKit, undefined);

    // F02 (Ato 2) treina primeiro no terminal e desbloqueia a Casa Pre-Moldada explicada
    const f02 = getLessonQuestBriefing("modulo-0-f02-preparando-a-bancada");
    assert.equal(f02.actNumber, 2);
    assert.equal(f02.primaryStation, "terminal");
    assert.ok(f02.unlocksDownloadKit);
    assert.equal(f02.unlocksDownloadKit.howToUseSteps.length, 3);

    // F03 e A02 ensinam o Alicerce e Modelagem de Dados (Ato 3)
    assert.equal(getLessonQuestBriefing("modulo-0-f03-primeiro-projeto-django").actNumber, 3);
    assert.equal(getLessonQuestBriefing("modulo-2-modelo-de-dados").actNumber, 3);

    for (const svgFile of [
      "public/cursos/guias/esqueleto-ordem-implementacao.svg",
      "public/cursos/guias/modelagem-dados-marketplace.svg",
      "public/cursos/guias/anatomia-casa-pre-moldada.svg",
    ]) {
      const fullSvg = path.join(process.cwd(), svgFile);
      assert.ok(fs.existsSync(fullSvg), `${svgFile} deve existir`);
      assert.ok(fs.statSync(fullSvg).size > 1500, `${svgFile} deve ter conteudo`);
    }
  });
});

describe("Course Admission Gate, Ethnographic Census & Email Activation", () => {
  it("valida questionario etnografico-regional-cultural, corrige prova de informatica e agrega dashboard", () => {
    assert.equal(FUNDAMENTAL_IT_QUESTIONS.length, 5);
    assert.equal(deriveMacroRegion("SP"), "Sudeste");
    assert.equal(deriveMacroRegion("BA"), "Nordeste");
    assert.equal(deriveMacroRegion("AM"), "Norte");
    assert.equal(deriveMacroRegion("RS"), "Sul");
    assert.equal(deriveMacroRegion("DF"), "Centro-Oeste");

    const ageInfo = calculateAgeAndBracket("2000-05-15", new Date("2026-11-13T12:00:00Z"));
    assert.equal(ageInfo.ageYears, 26);
    assert.equal(ageInfo.ageBracket, "25 a 34 anos");

    const questionnaire = {
      fullName: "Maria Silva",
      email: "maria@exemplo.com",
      birthDate: "2000-05-15",
      authMethod: "email",
      educationLevel: "Ensino Superior Completo (Graduação)",
      howFoundSite: "LinkedIn (Post ou Perfil do Rafael Maldivas)",
      knowsProgramming: "sim_iniciante",
      programmingLanguages: ["Python", "SQL / Banco de Dados"],
      motivation: "Conseguir meu 1º emprego ou estágio como Desenvolvedor(a)",
      stateUf: "SP",
      city: "São Paulo",
      urbanZone: "Capital (Centro ou Bairros Centrais)",
      ethnicityIbge: "Parda",
      gender: "Mulher Cisgênero",
      employmentStatus: "Empregado(a) fora da área de TI (buscando transição)",
      incomeBracket: "De 2 a 4 salários mínimos",
      deviceAccess: "Notebook / PC próprio em casa com internet fibra/banda larga",
      learningStyle: "Prático / Hands-on (aprendo fazendo, digitando código e testando)",
      englishLevel: "Intermediário (leio documentação técnica com alguma ajuda)",
      aiUsage: "Uso quase todo dia para estudar, tirar dúvidas ou trabalhar",
    };

    const validQ = validateAdmissionQuestionnaire(questionnaire);
    assert.equal(validQ.valid, true);

    // Prova de informatica: 4 acertos de 5 -> aprovado (>= 60%)
    const gradePass = gradeItAssessment({
      "it-q1-zip": 0,
      "it-q2-browser": 0,
      "it-q3-extensions": 0,
      "it-q4-security": 0,
      "it-q5-logic": 2,
    });
    assert.equal(gradePass.passed, true);
    assert.equal(gradePass.correctCount, 4);
    assert.equal(gradePass.scorePct, 80);

    // Prova de informatica: 2 acertos de 5 -> reprovado (< 60%)
    const gradeFail = gradeItAssessment({
      "it-q1-zip": 0,
      "it-q2-browser": 0,
      "it-q3-extensions": 2,
      "it-q4-security": 2,
      "it-q5-logic": 2,
    });
    assert.equal(gradeFail.passed, false);
    assert.equal(gradeFail.correctCount, 2);

    const recLevel = recommendCourseLevelFromAdmission(questionnaire, gradePass.scorePct);
    assert.equal(recLevel, "mediano");

    // Agregacao do Censo Etnografico-Regional-Cultural
    const stats = computeEthnographicDashboardStats([
      {
        version: 1,
        questionnaire,
        macroRegion: "Sudeste",
        ageBracket: "25 a 34 anos",
        ageYears: 26,
        itTestAnswers: {
          "it-q1-browser-ide": 0,
          "it-q2-folders": 0,
          "it-q3-extensions": 0,
          "it-q4-security": 0,
          "it-q5-logic": 0,
        },
        itTestScore: 100,
        itTestPassed: true,
        recommendedLevel: "mediano",
        submittedAt: "2026-11-13T12:00:00.000Z",
        emailActivated: true,
        activatedAt: "2026-11-13T12:05:00.000Z",
      },
    ]);
    assert.equal(stats.totalRespondents, 1);
    assert.equal(stats.activatedCount, 1);
    assert.equal(stats.averageItScore, 100);
    assert.equal(stats.averageAge, 26);
    assert.equal(stats.byRegion[0].name, "Sudeste");
    assert.equal(stats.byEthnicity[0].name, "Parda");
  });

  it("emite e verifica tokens HMAC de ativacao por e-mail e admissao concluida", () => {
    const secret = "segredo-de-teste-hmac-256-maldivas-tech-2026";
    const actToken = issueEmailActivationToken(
      {
        email: "aluno@maldivastech.dev",
        nome: "Aluno Teste",
        sub: "email:123456",
        recommendedLevel: "facil",
        next: "/pt/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa",
      },
      secret,
    );
    const verifiedAct = verifyEmailActivationToken(actToken, secret);
    assert.ok(verifiedAct);
    assert.equal(verifiedAct.email, "aluno@maldivastech.dev");
    assert.equal(verifiedAct.recommendedLevel, "facil");

    const admToken = issueAdmissionCompletedToken(
      {
        sub: "email:123456",
        email: "aluno@maldivastech.dev",
        nome: "Aluno Teste",
        recommendedLevel: "facil",
      },
      secret,
    );
    const verifiedAdm = verifyAdmissionCompletedToken(admToken, secret);
    assert.ok(verifiedAdm);
    assert.equal(verifiedAdm.email, "aluno@maldivastech.dev");
    assert.equal(verifiedAdm.activated, true);

    // Sessao Google OAuth preserva nome e avatarUrl e o botao aponta para /api/auth/google/login
    const sessionToken = issueStudentSession(
      "uuid-123",
      "rafael@maldivastech.dev",
      secret,
      Date.now(),
      { nome: "Rafael Maldivas", avatarUrl: "https://lh3.googleusercontent.com/a/avatar" },
    );
    const verifiedSession = verifyStudentSession(sessionToken, secret);
    assert.ok(verifiedSession);
    assert.equal(verifiedSession.email, "rafael@maldivastech.dev");
    assert.equal(verifiedSession.nome, "Rafael Maldivas");
    assert.equal(verifiedSession.avatarUrl, "https://lh3.googleusercontent.com/a/avatar");

    const gateSource = fs.readFileSync(
      path.join(process.cwd(), "app/components/curso/CourseAdmissionGate.tsx"),
      "utf8",
    );
    assert.ok(
      gateSource.includes("/api/auth/google/login?next=${encodeURIComponent(targetPath)}"),
      "CourseAdmissionGate deve apontar o botao Google para /api/auth/google/login?next=...",
    );
    assert.ok(
      !gateSource.includes("href={targetPath}"),
      "CourseAdmissionGate NUNCA deve passar href={targetPath} direto para GoogleSignInButton",
    );
  });
});
