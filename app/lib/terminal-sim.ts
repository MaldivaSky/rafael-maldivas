/**
 * Stateful pedagogical terminal simulator (Bash / Windows Git-Bash friendly + Git + Django).
 *
 * Designed so beginners (even 12-year-olds) practice real commands safely BEFORE
 * facing a real terminal, learning WHY each command exists and blocking dangerous habits
 * (like running `git add .` when `.env` is unprotected).
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export type TerminalMissionId = "mission-1-git-basics" | "mission-2-django-env";

export interface TerminalMissionStep {
  id: string;
  title: string;
  expectedExample: string;
  explanation: string;
}

export interface TerminalMissionSpec {
  id: TerminalMissionId;
  title: string;
  subtitle: string;
  steps: TerminalMissionStep[];
}

export interface TerminalSimState {
  cwd: string;
  directories: string[];
  filesByDir: Record<string, Record<string, string>>;
  venvActive: boolean;
  pipInstalled: boolean;
  gitInitialized: boolean;
  gitIgnoredEnv: boolean;
  stagedFiles: string[];
  commits: string[];
  migrationsApplied: boolean;
  testsPassed: boolean;
  completedStepIds: string[];
  completedMissions: TerminalMissionId[];
}

export interface TerminalExecResult {
  nextState: TerminalSimState;
  lines: Array<{ kind: "out" | "ok" | "warn" | "err" | "mentor"; text: string }>;
  clearScreen?: boolean;
  newlyCompletedStepId?: string;
  newlyCompletedMissionId?: TerminalMissionId;
}

export const TERMINAL_MISSIONS: TerminalMissionSpec[] = [
  {
    id: "mission-1-git-basics",
    title: "Missão 1 · Perder o Medo da Tela Preta (Pastas + Git + Segredos)",
    subtitle:
      "Execute os 8 comandos na ordem abaixo. Só avança quando você rodar o comando certo e entender o que aconteceu!",
    steps: [
      {
        id: "m1-pwd",
        title: "Descubra onde o terminal está agora",
        expectedExample: "pwd",
        explanation: "pwd (Print Working Directory) mostra o caminho exato da pasta atual.",
      },
      {
        id: "m1-ls",
        title: "Liste o que existe aqui dentro",
        expectedExample: "ls",
        explanation: "ls (ou dir) lista arquivos e pastas sem precisar do mouse.",
      },
      {
        id: "m1-mkdir",
        title: "Crie uma pasta chamada minha-loja",
        expectedExample: "mkdir minha-loja",
        explanation: "mkdir cria uma pasta nova para guardar o projeto da sua loja.",
      },
      {
        id: "m1-cd",
        title: "Entre dentro da pasta minha-loja",
        expectedExample: "cd minha-loja",
        explanation: "cd (Change Directory) entra na pasta. Repare o prompt mudar para ~/minha-loja!",
      },
      {
        id: "m1-git-init",
        title: "Ative o Git dentro da sua pasta",
        expectedExample: "git init",
        explanation: "git init cria o histórico oculto .git para versionar seu código com segurança.",
      },
      {
        id: "m1-gitignore",
        title: "Proteja o arquivo .env antes de subir",
        expectedExample: "echo .env > .gitignore",
        explanation:
          "Regra de ouro: nunca envie senhas para o GitHub. O .gitignore manda o Git ignorar o arquivo .env.",
      },
      {
        id: "m1-git-add",
        title: "Prepare os arquivos seguros para salvar",
        expectedExample: "git add .",
        explanation: "git add . coloca index.html e .gitignore na área de preparação (sem o .env!).",
      },
      {
        id: "m1-git-commit",
        title: "Salve o primeiro marco no histórico",
        expectedExample: 'git commit -m "primeira loja"',
        explanation: "git commit grava uma foto permanente e segura dessa versão da sua loja.",
      },
    ],
  },
  {
    id: "mission-2-django-env",
    title: "Missão 2 · Bancada Python & Django (Nível Mediano / Difícil)",
    subtitle:
      "Isole suas bibliotecas, instale dependências, crie tabelas no banco e rode os testes automáticos.",
    steps: [
      {
        id: "m2-venv",
        title: "Crie o ambiente virtual isolado (.venv)",
        expectedExample: "python -m venv .venv",
        explanation: "Evita misturar versões de pacotes entre projetos diferentes no computador.",
      },
      {
        id: "m2-activate",
        title: "Ative o ambiente virtual",
        expectedExample: "source .venv/bin/activate",
        explanation:
          "No Windows PowerShell também funciona .venv\\Scripts\\activate. O (.venv) no prompt prova que está ativo!",
      },
      {
        id: "m2-pip",
        title: "Instale as dependências do requirements.txt",
        expectedExample: "pip install -r requirements.txt",
        explanation: "Baixa Django, DRF e driver do PostgreSQL em versões exatamente travadas.",
      },
      {
        id: "m2-migrate",
        title: "Crie as tabelas reais no banco de dados",
        expectedExample: "python manage.py migrate",
        explanation: "Aplica as migrações SQL para criar tabelas Loja, Produto e Pedido.",
      },
      {
        id: "m2-test",
        title: "Rode os testes automatizados",
        expectedExample: "python manage.py test",
        explanation: "Prova com código que suas regras de negócio e estoque não quebraram.",
      },
    ],
  },
];

export function createInitialTerminalState(): TerminalSimState {
  return {
    cwd: "~",
    directories: ["~", "~/kit-roupas"],
    filesByDir: {
      "~": {
        "leia-me.txt":
          "Bem-vindo ao Terminal Maldivas! Use pwd, ls, mkdir minha-loja e cd minha-loja para comecar.",
      },
      "~/kit-roupas": {
        "index.html": "<!-- Vitrine de roupas pronta para copiar -->",
      },
    },
    venvActive: false,
    pipInstalled: false,
    gitInitialized: false,
    gitIgnoredEnv: false,
    stagedFiles: [],
    commits: [],
    migrationsApplied: false,
    testsPassed: false,
    completedStepIds: [],
    completedMissions: [],
  };
}

function cloneState(s: TerminalSimState): TerminalSimState {
  return {
    ...s,
    directories: [...s.directories],
    filesByDir: Object.fromEntries(
      Object.entries(s.filesByDir).map(([k, v]) => [k, { ...v }]),
    ),
    stagedFiles: [...s.stagedFiles],
    commits: [...s.commits],
    completedStepIds: [...s.completedStepIds],
    completedMissions: [...s.completedMissions],
  };
}

function markStep(
  next: TerminalSimState,
  stepId: string,
): { stepAdded: boolean; missionAdded?: TerminalMissionId } {
  let stepAdded = false;
  if (!next.completedStepIds.includes(stepId)) {
    next.completedStepIds.push(stepId);
    stepAdded = true;
  }
  let missionAdded: TerminalMissionId | undefined;
  for (const mission of TERMINAL_MISSIONS) {
    const allDone = mission.steps.every((st) => next.completedStepIds.includes(st.id));
    if (allDone && !next.completedMissions.includes(mission.id)) {
      next.completedMissions.push(mission.id);
      missionAdded = mission.id;
    }
  }
  return { stepAdded, missionAdded };
}

export function getTerminalPrompt(state: TerminalSimState): string {
  const prefix = state.venvActive ? "(.venv) " : "";
  return `${prefix}aluno@maldivas:${state.cwd}$`;
}

export function executeTerminalCommand(
  state: TerminalSimState,
  rawCommand: string,
): TerminalExecResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { nextState: state, lines: [] };
  }

  const next = cloneState(state);
  const lower = trimmed.toLowerCase();
  const normalizedSpaces = trimmed.replace(/\s+/g, " ");
  const normalizedLower = normalizedSpaces.toLowerCase();

  if (normalizedLower === "clear" || normalizedLower === "cls") {
    return { nextState: next, lines: [], clearScreen: true };
  }

  if (normalizedLower === "help") {
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: "Comandos liberados neste terminal pratico:" },
        { kind: "out", text: "  pwd | ls | ls -la | cat <arquivo> | mkdir <pasta> | cd <pasta> | cd .. | clear" },
        { kind: "out", text: "  git init | echo .env > .gitignore | git status | git add . | git commit -m \"msg\"" },
        { kind: "out", text: "  python -m venv .venv | source .venv/bin/activate | pip install -r requirements.txt" },
        { kind: "out", text: "  python manage.py migrate | python manage.py test" },
      ],
    };
  }

  if (normalizedLower === "whoami") {
    return {
      nextState: next,
      lines: [
        { kind: "out", text: "aluno (futuro engenheiro de software)" },
      ],
    };
  }

  if (normalizedLower === "pwd") {
    const unixPath = next.cwd === "~" ? "/home/aluno" : `/home/aluno/${next.cwd.replace(/^~\//, "")}`;
    const res = markStep(next, "m1-pwd");
    return {
      nextState: next,
      lines: [
        { kind: "out", text: unixPath },
        {
          kind: "mentor",
          text: "Mentor: 'pwd' significa Print Working Directory. Sempre mostra em que gaveta você está.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-pwd" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (
    normalizedLower === "ls" ||
    normalizedLower === "ls -la" ||
    normalizedLower === "ls -a" ||
    normalizedLower === "dir"
  ) {
    const showHidden = normalizedLower.includes("-a") || normalizedLower === "dir";
    const childDirs = next.directories
      .filter((d) => {
        if (next.cwd === "~") return d.startsWith("~/") && !d.slice(2).includes("/");
        return d.startsWith(`${next.cwd}/`) && !d.slice(next.cwd.length + 1).includes("/");
      })
      .map((d) => `${d.split("/").pop()}/`);
    const files = Object.keys(next.filesByDir[next.cwd] ?? {}).filter(
      (f) => showHidden || !f.startsWith("."),
    );
    const hiddenNote =
      !showHidden && (next.filesByDir[next.cwd]?.[".env"] || next.gitInitialized)
        ? " (dica: use 'ls -la' para enxergar arquivos ocultos como .env e .gitignore!)"
        : "";
    const listing = [...childDirs, ...files].join("   ") || "(pasta vazia)";
    const res = markStep(next, "m1-ls");
    return {
      nextState: next,
      lines: [
        { kind: "out", text: listing },
        {
          kind: "mentor",
          text: `Mentor: 'ls' listou o que está em ${next.cwd}.${hiddenNote}`,
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-ls" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower.startsWith("mkdir ")) {
    const folder = normalizedSpaces.slice(6).trim().replace(/\/+$/, "");
    if (!folder || /[^a-zA-Z0-9._-]/.test(folder)) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: `mkdir: nome de pasta inválido '${folder}'. Use letras, números e hífen (ex: minha-loja).` },
        ],
      };
    }
    const targetPath = next.cwd === "~" ? `~/${folder}` : `${next.cwd}/${folder}`;
    if (!next.directories.includes(targetPath)) {
      next.directories.push(targetPath);
      next.filesByDir[targetPath] = {
        "index.html": "<!-- Vitrine HTML inicial da sua loja -->",
        "requirements.txt": "Django==5.1\ndjangorestframework==3.15\npsycopg[binary]==3.2",
        "manage.py": "# Ponto de entrada Django",
        ".env": "SECRET_KEY=chave_super_secreta_nao_subir\nDATABASE_URL=postgresql://...",
      };
    }
    const isMissionFolder = folder === "minha-loja";
    const res = isMissionFolder ? markStep(next, "m1-mkdir") : { stepAdded: false };
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: `Pasta '${folder}' criada com starter da loja + .env local.` },
        {
          kind: "mentor",
          text: isMissionFolder
            ? `Mentor: Pasta criada! Agora digite 'cd ${folder}' para entrar nela.`
            : "Mentor: Pasta criada! Para a Missão 1 funcionar certinho, recomendamos criar e entrar em 'minha-loja'.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-mkdir" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower.startsWith("cd")) {
    const arg = normalizedSpaces.slice(2).trim().replace(/\/+$/, "");
    if (!arg || arg === "~") {
      next.cwd = "~";
      return {
        nextState: next,
        lines: [{ kind: "out", text: "Voltou para a pasta inicial (~)." }],
      };
    }
    if (arg === "..") {
      if (next.cwd !== "~") {
        const parts = next.cwd.split("/");
        parts.pop();
        next.cwd = parts.join("/") || "~";
      }
      return {
        nextState: next,
        lines: [{ kind: "out", text: `Agora em ${next.cwd}` }],
      };
    }
    const targetPath = next.cwd === "~" ? `~/${arg}` : `${next.cwd}/${arg}`;
    if (!next.directories.includes(targetPath)) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: `bash: cd: ${arg}: Pasta não encontrada.` },
          { kind: "mentor", text: `Dica: crie primeiro com 'mkdir ${arg}' ou liste com 'ls'.` },
        ],
      };
    }
    next.cwd = targetPath;
    const isTarget = arg === "minha-loja";
    const res = isTarget ? markStep(next, "m1-cd") : { stepAdded: false };
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: `Diretório atual mudou para ${next.cwd}` },
        {
          kind: "mentor",
          text: isTarget
            ? "Mentor: Repare que à esquerda do cursor agora aparece '~/minha-loja'! Você está dentro da pasta do projeto."
            : "Mentor: Você entrou na pasta com sucesso.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-cd" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower.startsWith("cat ")) {
    const file = normalizedSpaces.slice(4).trim();
    const content = next.filesByDir[next.cwd]?.[file];
    if (content === undefined) {
      return {
        nextState: next,
        lines: [{ kind: "err", text: `cat: ${file}: Arquivo não encontrado nesta pasta (${next.cwd}).` }],
      };
    }
    return {
      nextState: next,
      lines: content.split("\n").map((line) => ({ kind: "out" as const, text: line })),
    };
  }

  // Handling `echo .env > .gitignore` (including variations like `echo ".env" > .gitignore` or `>>`)
  if (
    lower.includes("echo") &&
    lower.includes(".env") &&
    lower.includes(".gitignore") &&
    (lower.includes(">") || lower.includes(">>"))
  ) {
    if (next.cwd !== "~/minha-loja") {
      return {
        nextState: next,
        lines: [
          { kind: "warn", text: "Você está fora da pasta do projeto (~)." },
          { kind: "mentor", text: "Entre primeiro com 'cd minha-loja' antes de criar o .gitignore do projeto." },
        ],
      };
    }
    next.gitIgnoredEnv = true;
    next.filesByDir[next.cwd] = {
      ...(next.filesByDir[next.cwd] ?? {}),
      ".gitignore": ".env\n.venv/\nnode_modules/",
    };
    const res = markStep(next, "m1-gitignore");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: "Arquivo .gitignore salvo protegendo '.env' contra envio acidental!" },
        {
          kind: "mentor",
          text: "Mentor: Parabéns! Agora o arquivo .env está blindado. Próximo passo: 'git add .'.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-gitignore" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower.startsWith("touch ")) {
    const file = normalizedSpaces.slice(6).trim();
    if (!file) {
      return { nextState: next, lines: [{ kind: "err", text: "touch: informe o nome do arquivo." }] };
    }
    next.filesByDir[next.cwd] = {
      ...(next.filesByDir[next.cwd] ?? {}),
      [file]: file === ".gitignore" ? ".env\n.venv/\n" : "",
    };
    if (file === ".gitignore") {
      next.gitIgnoredEnv = true;
      const res = markStep(next, "m1-gitignore");
      return {
        nextState: next,
        lines: [
          { kind: "ok", text: "Criado .gitignore (regra .env adicionada por segurança)." },
        ],
        newlyCompletedStepId: res.stepAdded ? "m1-gitignore" : undefined,
        newlyCompletedMissionId: res.missionAdded,
      };
    }
    return {
      nextState: next,
      lines: [{ kind: "ok", text: `Arquivo '${file}' criado em ${next.cwd}.` }],
    };
  }

  // GIT commands
  if (normalizedLower === "git --version") {
    return { nextState: next, lines: [{ kind: "out", text: "git version 2.47.0" }] };
  }

  if (normalizedLower === "git init") {
    if (next.cwd === "~") {
      return {
        nextState: next,
        lines: [
          { kind: "warn", text: "Cuidado! Nunca rode 'git init' na pasta raiz inteira (~)." },
          { kind: "mentor", text: "Entre primeiro na pasta do projeto: digite 'mkdir minha-loja' e depois 'cd minha-loja'." },
        ],
      };
    }
    next.gitInitialized = true;
    const res = markStep(next, "m1-git-init");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: `Initialized empty Git repository in /home/aluno/${next.cwd.replace(/^~\//, "")}/.git/` },
        {
          kind: "mentor",
          text: "Mentor: Git ligado! Antes de adicionar arquivos, confira com 'ls -la' ou proteja seu .env usando: echo .env > .gitignore",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-git-init" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower === "git status") {
    if (!next.gitInitialized) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: "fatal: not a git repository (pasta ainda não é controlada pelo Git)." },
          { kind: "mentor", text: "Mentor: Rode 'git init' primeiro dentro de ~/minha-loja." },
        ],
      };
    }
    const untracked = Object.keys(next.filesByDir[next.cwd] ?? {}).filter(
      (f) => (!next.gitIgnoredEnv || f !== ".env") && !next.stagedFiles.includes(f),
    );
    return {
      nextState: next,
      lines: [
        { kind: "out", text: "On branch main" },
        {
          kind: next.stagedFiles.length > 0 ? "ok" : "out",
          text:
            next.stagedFiles.length > 0
              ? `Changes to be committed: ${next.stagedFiles.join(", ")}`
              : "No changes added to commit yet.",
        },
        {
          kind: next.gitIgnoredEnv ? "out" : "warn",
          text: `Untracked files: ${untracked.join(", ") || "(nenhum)"}${next.gitIgnoredEnv ? "" : "  <-- ATENCAO: .env exposto!"}`,
        },
      ],
    };
  }

  if (normalizedLower === "git add ." || normalizedLower.startsWith("git add ")) {
    if (!next.gitInitialized) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: "fatal: not a git repository." },
          { kind: "mentor", text: "Mentor: Entre em minha-loja e rode 'git init' primeiro!" },
        ],
      };
    }
    const hasEnv = Boolean(next.filesByDir[next.cwd]?.[".env"]);
    if (hasEnv && !next.gitIgnoredEnv) {
      return {
        nextState: next,
        lines: [
          {
            kind: "err",
            text: "BLOQUEADO PELO MENTOR: O arquivo '.env' com segredos seria adicionado ao Git!",
          },
          {
            kind: "warn",
            text: "Em um projeto real, senhas commitadas no GitHub público são vazadas em segundos.",
          },
          {
            kind: "mentor",
            text: "Mentor: Proteja primeiro rodando: echo .env > .gitignore",
          },
        ],
      };
    }
    const safeFiles = Object.keys(next.filesByDir[next.cwd] ?? {}).filter((f) => f !== ".env");
    next.stagedFiles = safeFiles;
    const res = markStep(next, "m1-git-add");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: `Staged safely (${safeFiles.length} arquivos): ${safeFiles.join(", ")}` },
        { kind: "out", text: "(.env ignorado com sucesso pelo .gitignore)" },
        {
          kind: "mentor",
          text: 'Mentor: Tudo seguro na caixa de envio! Agora grave o marco com: git commit -m "primeira loja"',
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-git-add" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (normalizedLower.startsWith("git commit")) {
    if (!next.gitInitialized) {
      return {
        nextState: next,
        lines: [{ kind: "err", text: "fatal: not a git repository. Rode 'git init' primeiro." }],
      };
    }
    if (next.stagedFiles.length === 0) {
      return {
        nextState: next,
        lines: [
          { kind: "warn", text: "Nada preparado para commit (staging area vazia)." },
          { kind: "mentor", text: "Mentor: Rode 'git add .' primeiro antes do commit." },
        ],
      };
    }
    const msgMatch = trimmed.match(/-m\s+["']([^"']+)["']/i);
    if (!msgMatch) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: 'Use a flag -m com mensagem entre aspas. Ex: git commit -m "primeira loja"' },
        ],
      };
    }
    const commitMsg = msgMatch[1];
    next.commits.push(commitMsg);
    const res = markStep(next, "m1-git-commit");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: `[main (root-commit) a4f9c12] ${commitMsg}` },
        { kind: "out", text: ` ${next.stagedFiles.length} files changed, 42 insertions(+)` },
        {
          kind: "mentor",
          text: res.missionAdded === "mission-1-git-basics"
            ? "PARABÉNS! Missão 1 concluída — você perdeu o medo da tela preta e salvou sua primeira versão sem vazar o .env!"
            : "Mentor: Commit gravado no histórico local!",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m1-git-commit" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  // PYTHON / DJANGO / VENV commands (Mission 2)
  if (normalizedLower === "python --version" || normalizedLower === "python3 --version") {
    return { nextState: next, lines: [{ kind: "out", text: "Python 3.12.8" }] };
  }

  if (
    normalizedLower === "python -m venv .venv" ||
    normalizedLower === "python3 -m venv .venv"
  ) {
    if (next.cwd === "~") {
      return {
        nextState: next,
        lines: [
          { kind: "warn", text: "Crie e entre primeiro na pasta 'minha-loja' antes de criar o ambiente virtual." },
        ],
      };
    }
    next.filesByDir[next.cwd] = {
      ...(next.filesByDir[next.cwd] ?? {}),
      ".venv/": "(ambiente virtual Python isolado)",
    };
    const res = markStep(next, "m2-venv");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: "Ambiente virtual '.venv' criado com Python 3.12 isolado." },
        {
          kind: "mentor",
          text: "Mentor: Agora ative o ambiente rodando 'source .venv/bin/activate' (ou '.venv\\Scripts\\activate').",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m2-venv" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (
    normalizedLower === "source .venv/bin/activate" ||
    normalizedLower === ".venv\\scripts\\activate" ||
    normalizedLower === ".venv/scripts/activate"
  ) {
    if (!next.filesByDir[next.cwd]?.[".venv/"]) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: "Ambiente '.venv' ainda não foi criado nesta pasta." },
          { kind: "mentor", text: "Rode primeiro: python -m venv .venv" },
        ],
      };
    }
    next.venvActive = true;
    const res = markStep(next, "m2-activate");
    return {
      nextState: next,
      lines: [
        { kind: "ok", text: "(.venv) ativado! Tudo que você instalar agora fica preso aqui dentro." },
        {
          kind: "mentor",
          text: "Mentor: Próximo passo: instale as bibliotecas com 'pip install -r requirements.txt'.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m2-activate" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (
    normalizedLower === "pip install -r requirements.txt" ||
    normalizedLower === "pip install django"
  ) {
    if (!next.venvActive) {
      return {
        nextState: next,
        lines: [
          { kind: "warn", text: "BLOQUEADO: Ative o ambiente virtual (.venv) antes de dar pip install!" },
          { kind: "mentor", text: "Mentor: Isso evita poluir o Python global do sistema. Rode 'source .venv/bin/activate'." },
        ],
      };
    }
    next.pipInstalled = true;
    const res = markStep(next, "m2-pip");
    return {
      nextState: next,
      lines: [
        { kind: "out", text: "Collecting Django==5.1 ... Downloading wheel (8.2 MB)" },
        { kind: "out", text: "Collecting djangorestframework==3.15 & psycopg==3.2" },
        { kind: "ok", text: "Successfully installed Django-5.1 djangorestframework-3.15 psycopg-3.2" },
        {
          kind: "mentor",
          text: "Mentor: Django instalado dentro do .venv! Agora crie as tabelas com 'python manage.py migrate'.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m2-pip" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (
    normalizedLower === "python manage.py migrate" ||
    normalizedLower === "python3 manage.py migrate"
  ) {
    if (!next.pipInstalled) {
      return {
        nextState: next,
        lines: [
          { kind: "err", text: "ModuleNotFoundError: No module named 'django'." },
          { kind: "mentor", text: "Instale primeiro as bibliotecas: pip install -r requirements.txt" },
        ],
      };
    }
    next.migrationsApplied = true;
    const res = markStep(next, "m2-migrate");
    return {
      nextState: next,
      lines: [
        { kind: "out", text: "Operations to perform: Apply all migrations: admin, auth, loja, pedidos" },
        { kind: "ok", text: "  Applying loja.0001_initial... OK" },
        { kind: "ok", text: "  Applying pedidos.0001_atomic_stock... OK" },
        {
          kind: "mentor",
          text: "Mentor: Tabelas criadas! Para concluir a Missão 2, rode os testes com 'python manage.py test'.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m2-migrate" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  if (
    normalizedLower === "python manage.py test" ||
    normalizedLower === "python3 manage.py test"
  ) {
    if (!next.pipInstalled) {
      return {
        nextState: next,
        lines: [{ kind: "err", text: "Django ainda não instalado no .venv. Rode 'pip install -r requirements.txt'." }],
      };
    }
    next.testsPassed = true;
    const res = markStep(next, "m2-test");
    return {
      nextState: next,
      lines: [
        { kind: "out", text: "Creating test database for alias 'default'..." },
        { kind: "out", text: "test_preco_calculado_no_servidor ... ok" },
        { kind: "out", text: "test_lock_atomico_ultima_unidade ... ok" },
        { kind: "out", text: "test_webhook_hmac_fail_closed ... ok" },
        { kind: "ok", text: "Ran 3 tests in 0.038s — OK" },
        {
          kind: "mentor",
          text: "ENGENHARIA VALIDADA! Você já domina navegação, Git seguro com .gitignore, .venv, migrações e testes no terminal.",
        },
      ],
      newlyCompletedStepId: res.stepAdded ? "m2-test" : undefined,
      newlyCompletedMissionId: res.missionAdded,
    };
  }

  return {
    nextState: next,
    lines: [
      { kind: "err", text: `bash: ${trimmed.split(" ")[0]}: comando não reconhecido ou sintaxe incompleta.` },
      { kind: "mentor", text: "Digite 'help' ou veja o próximo comando da Missão no painel ao lado." },
    ],
  };
}
