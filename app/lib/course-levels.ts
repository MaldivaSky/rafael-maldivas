/**
 * Progressive difficulty levels (3 course tracks in one platform) and
 * beginner-friendly R$ 0,00 deployment guides (GitHub, Vercel, Neon Postgres, Render).
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export type CourseDifficultyLevel = "facil" | "mediano" | "dificil";

export interface CourseLevelSpec {
  id: CourseDifficultyLevel;
  badge: string;
  name: string;
  shortTitle: string;
  targetAudience: string;
  projectOutput: string;
  stackSummary: string;
  monthlyCost: string;
  estimatedHours: string;
  imagePath: string;
  imageAlt: string;
  recommendedSlugs: string[];
  deliverables: string[];
  deployStepsIds: string[];
}

export interface DeployCardField {
  label: string;
  value: string;
  copyable?: boolean;
  helper?: string;
}

export interface DeployStepVisual {
  stepLabel: string;
  caption: string;
  imagePath: string;
  imageAlt: string;
}

export interface DeployStepCard {
  id: string;
  order: number;
  provider: "GitHub" | "Vercel" | "Neon PostgreSQL" | "Render";
  minLevel: CourseDifficultyLevel;
  costLabel: string;
  title: string;
  simpleAnalogy: string;
  whereToClick: string[];
  fields: DeployCardField[];
  warningNote?: string;
  signupUrl: string;
  imagePath: string;
  imageAlt: string;
  stepVisuals: DeployStepVisual[];
}

export interface ClothingCatalogItem {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  sizes: string[];
  colorHex: string;
  badge: string;
  imagePath: string;
}

export const DEFAULT_CLOTHING_STOREFRONT: ClothingCatalogItem[] = [
  {
    id: "moletom-mar",
    name: "Moletom Oversized Oceano",
    category: "Casacos",
    priceCents: 14990,
    sizes: ["P", "M", "G", "GG"],
    colorHex: "#0284c7",
    badge: "Mais pedido",
    imagePath: "/cursos/guias/prod-moletom-tech.jpg",
  },
  {
    id: "camiseta-sol",
    name: "Camiseta Oversized Preta",
    category: "Camisetas",
    priceCents: 7990,
    sizes: ["PP", "P", "M", "G"],
    colorHex: "#0ea5e9",
    badge: "Novo",
    imagePath: "/cursos/guias/prod-camiseta-oversized.jpg",
  },
  {
    id: "calca-cargo",
    name: "Calça Cargo Urbana Grafite",
    category: "Calças",
    priceCents: 16990,
    sizes: ["38", "40", "42", "44"],
    colorHex: "#334155",
    badge: "Estoque ok",
    imagePath: "/cursos/guias/prod-calca-cargo.jpg",
  },
];

export const COURSE_LEVELS: Record<CourseDifficultyLevel, CourseLevelSpec> = {
  facil: {
    id: "facil",
    badge: "Nível 1 · Fácil (Iniciante / 12+ anos)",
    name: "Vitrine de Roupas MVP (Sem Back-end)",
    shortTitle: "Fácil · Vitrine",
    targetAudience:
      "Quem nunca programou antes (inclusive jovens a partir de 12 anos) e quer ver um site real funcionando no celular hoje.",
    projectOutput:
      "Uma vitrine de roupas completa com tamanhos, cores, carrinho de compras e botão que envia o pedido pronto no WhatsApp.",
    stackSummary: "HTML/Next.js + Catálogo JSON + GitHub + Vercel",
    monthlyCost: "R$ 0,00 / mês",
    estimatedHours: "8h (6 aulas focadas)",
    imagePath: "/cursos/guias/vitrine-roupas-mvp.jpg",
    imageAlt: "Ilustração de uma vitrine de roupas moderna no notebook e celular com carrinho e botão de pedido.",
    recommendedSlugs: [
      "modulo-0-f01-o-mapa",
      "modulo-0-f02-preparando-a-bancada",
      "modulo-0-f03-primeiro-projeto-django",
      "modulo-0-f05-testes-e-git",
      "modulo-2-carrinho-frete-cupom",
      "modulo-5-infraestrutura-deploy-backup",
    ],
    deliverables: [
      "Conta criada no GitHub com seu primeiro repositório",
      "Vitrine de roupas com escolha de tamanho, cupom e carrinho",
      "Site publicado de graça na Vercel com link `.vercel.app` para mandar aos amigos",
    ],
    deployStepsIds: ["deploy-github", "deploy-vercel"],
  },
  mediano: {
    id: "mediano",
    badge: "Nível 2 · Mediano (App com Banco Real)",
    name: "Marketplace Multi-Loja Sem Gateway de Pagamento",
    shortTitle: "Mediano · Sem Gateway",
    targetAudience:
      "Quem já entende o básico e quer cadastrar lojas/produtos num banco de dados de verdade sem burocracia de banco/PJ para cobrança online.",
    projectOutput:
      "Marketplace completo com cadastro de produtos, estoque protegido contra venda dupla, painel de pedidos e pagamento combinado/Pix manual.",
    stackSummary: "Next.js (Vercel) + Django REST (Render Free) + PostgreSQL (Neon Free)",
    monthlyCost: "R$ 0,00 / mês",
    estimatedHours: "22h (12 aulas focadas)",
    imagePath: "/cursos/guias/deploy-render-postgres.jpg",
    imageAlt: "Diagrama mostrando front-end na Vercel conectado à API no Render e banco PostgreSQL gratuito.",
    recommendedSlugs: [
      "modulo-0-f01-o-mapa",
      "modulo-0-f02-preparando-a-bancada",
      "modulo-0-f03-primeiro-projeto-django",
      "modulo-0-f04-primeira-api-com-drf",
      "modulo-0-f05-testes-e-git",
      "modulo-0-f06-lendo-um-projeto-real",
      "modulo-1-visao-do-negocio",
      "modulo-2-modelo-de-dados",
      "modulo-2-carrinho-frete-cupom",
      "modulo-3-criar-pedido-sem-vender-duas-vezes",
      "modulo-4-tempo-real-e-midia",
      "modulo-5-infraestrutura-deploy-backup",
    ],
    deliverables: [
      "Banco PostgreSQL gratuito na nuvem com tabelas Pedido e Sub-pedido",
      "API Django REST pública rodando no plano gratuito do Render",
      "Front-end na Vercel conversando com a API sem erro de CORS",
    ],
    deployStepsIds: ["deploy-github", "deploy-neon", "deploy-render", "deploy-vercel"],
  },
  dificil: {
    id: "dificil",
    badge: "Nível 3 · Difícil (Produção & Pagamentos)",
    name: "Marketplace Completo com Pix, Split, Webhooks & Segurança",
    shortTitle: "Difícil · Completo",
    targetAudience:
      "Quem quer dominar engenharia full-stack nível profissional: cobrança Pix/Cartão, split em centavos, idempotência, Celery e auditoria.",
    projectOutput:
      "Sistema multi-lojista production-ready com gateway Efí, HMAC fail-closed, ledger imutável, backup testado, LGPD e certificado final.",
    stackSummary: "Vercel / Next.js + Django + PostgreSQL + Redis + Celery + Gateway Pix",
    monthlyCost: "R$ 0 (sandbox/free) até VM Cloud",
    estimatedHours: "38h 10min (todas as 18 aulas)",
    imagePath: "/cursos/guias/step-dificil-pix-split.svg",
    imageAlt: "Arquitetura visual de pagamentos Pix com validação HMAC SHA-256, lock atômico de estoque e split em centavos.",
    recommendedSlugs: [
      "modulo-0-f01-o-mapa",
      "modulo-0-f02-preparando-a-bancada",
      "modulo-0-f03-primeiro-projeto-django",
      "modulo-0-f04-primeira-api-com-drf",
      "modulo-0-f05-testes-e-git",
      "modulo-0-f06-lendo-um-projeto-real",
      "modulo-1-visao-do-negocio",
      "modulo-2-modelo-de-dados",
      "modulo-2-carrinho-frete-cupom",
      "modulo-3-criar-pedido-sem-vender-duas-vezes",
      "modulo-3-cobrar-pix-e-cartao",
      "modulo-3-confirmar-pagamento-webhook",
      "modulo-3-repasse-e-estorno",
      "modulo-4-ciclo-de-vida-e-worker",
      "modulo-4-tempo-real-e-midia",
      "modulo-5-infraestrutura-deploy-backup",
      "modulo-6-juridico-fiscal-operacao",
      "modulo-7-projeto-final-certificado",
    ],
    deliverables: [
      "Webhooks HMAC fail-closed com deduplicação idempotente",
      "Split e estorno parcial auditados em centavos sem erro de float",
      "Projeto Final aprovado na rubrica + Certificado Verificável (38h 10min)",
    ],
    deployStepsIds: ["deploy-github", "deploy-neon", "deploy-render", "deploy-vercel"],
  },
};

export const FREE_DEPLOY_CARDS: DeployStepCard[] = [
  {
    id: "deploy-github",
    order: 1,
    provider: "GitHub",
    minLevel: "facil",
    costLabel: "R$ 0,00 · Grátis para sempre",
    title: "1. Criar conta no GitHub e guardar seu código na nuvem",
    simpleAnalogy:
      "O GitHub é como um 'Google Drive especial para programadores'. Tudo que a Vercel e o Render vão publicar sai daqui.",
    whereToClick: [
      "Acesse github.com/signup e crie sua conta gratuita com seu e-mail (anote usuário e senha).",
      "No canto superior direito clique no botão '+' -> 'New repository'.",
      "Dê o nome 'minha-vitrine-loja', deixe 'Public', marque 'Add a README file' e clique em 'Create repository'.",
      "Sem usar comandos difíceis: clique em 'Add file' -> 'Upload files' (ou use git push no terminal) para enviar sua pasta do kit.",
    ],
    fields: [
      {
        label: "Nome sugerido do repositório",
        value: "minha-vitrine-loja",
        copyable: true,
      },
      {
        label: "Regra de ouro (arquivo .gitignore)",
        value: ".env\n.venv/\nnode_modules/",
        copyable: true,
        helper: "Nunca envie arquivos .env com senhas para o GitHub!",
      },
    ],
    signupUrl: "https://github.com/signup",
    imagePath: "/cursos/guias/card-github-conta.jpg",
    imageAlt: "Fluxo visual do GitHub destacando Sign Up, botão + New Repo, Upload Files e selo gratuito R$ 0.",
    stepVisuals: [
      {
        stepLabel: "1. Criar Conta R$ 0",
        caption: "Abra github.com/signup, valide seu e-mail e escolha o plano Free.",
        imagePath: "/cursos/guias/card-github-conta.jpg",
        imageAlt: "Fluxo visual do GitHub destacando Sign Up, + New Repo e Upload Files gratuito.",
      },
      {
        stepLabel: "2. Novo Repositório",
        caption: "Clique em '+', selecione 'New repository', marque 'Public' e 'Add a README'.",
        imagePath: "/cursos/guias/step-github-repo.jpg",
        imageAlt: "Tela guiada Create a new repository do GitHub preenchida com minha-vitrine-loja.",
      },
      {
        stepLabel: "3. Subir sem Terminal",
        caption: "Clique em 'Add file' -> 'Upload files', arraste seu index.html e clique em 'Commit changes'.",
        imagePath: "/cursos/guias/step-github-upload.jpg",
        imageAlt: "Tela de Upload files do GitHub enviando index.html direto pelo navegador.",
      },
    ],
  },
  {
    id: "deploy-neon",
    order: 2,
    provider: "Neon PostgreSQL",
    minLevel: "mediano",
    costLabel: "R$ 0,00 · Plano Free (0,5 GB sem cartão)",
    title: "2. Criar seu banco PostgreSQL grátis na nuvem",
    simpleAnalogy:
      "Se o site é a vitrine, o PostgreSQL é o caderno permanente que não apaga os produtos nem os pedidos quando o servidor reinicia.",
    whereToClick: [
      "Acesse console.neon.tech e entre clicando em 'Continue with GitHub' (não pede cartão de crédito no plano Free).",
      "Clique em 'New Project', escolha nome 'loja-db' e região 'US East' ou 'São Paulo / South America' se disponível.",
      "Na tela inicial do projeto, clique em 'Connect' e copie a URL inteira que começa com postgresql://...",
      "Guarde essa URL secreta: ela será colada dentro do Render no próximo card como variável DATABASE_URL.",
    ],
    fields: [
      {
        label: "Nome da variável no backend",
        value: "DATABASE_URL",
        copyable: true,
      },
      {
        label: "Formato da string de conexão",
        value: "postgresql://usuario:senha@ep-seu-banco.neon.tech/neondb?sslmode=require",
        helper: "Copie direto do botão Copy no painel do Neon.",
      },
    ],
    warningNote:
      "Por que Neon em vez do Postgres gratuito do Render? O Postgres grátis do Render expira após 30 dias; o plano Free do Neon continua ativo sem expirar para projetos pequenos.",
    signupUrl: "https://console.neon.tech/",
    imagePath: "/cursos/guias/card-neon-banco.jpg",
    imageAlt: "Tela guiada do Neon PostgreSQL com New Project, botão Connect e URI postgresql:// pronta para copiar.",
    stepVisuals: [
      {
        stepLabel: "1. Criar Banco Free",
        caption: "Entre com sua conta GitHub em console.neon.tech e crie o projeto 'loja-db' sem cartão.",
        imagePath: "/cursos/guias/step-neon-project.jpg",
        imageAlt: "Modal Create Project do Neon PostgreSQL com Free Plan R$ 0 sem cartão.",
      },
      {
        stepLabel: "2. Copiar URL Secreta",
        caption: "Clique no botão verde 'Connect' e use o botão 'Copy' da string postgresql://...",
        imagePath: "/cursos/guias/card-neon-banco.jpg",
        imageAlt: "Tela do Neon destacando o botão Connect e a string postgresql:// para copiar.",
      },
      {
        stepLabel: "3. Conectar no Render",
        caption: "Guarde essa URL para colar em DATABASE_URL no painel do Render.",
        imagePath: "/cursos/guias/deploy-render-postgres.jpg",
        imageAlt: "Arquitetura ligando sua API Django no Render ao banco PostgreSQL no Neon.",
      },
    ],
  },
  {
    id: "deploy-render",
    order: 3,
    provider: "Render",
    minLevel: "mediano",
    costLabel: "R$ 0,00 · Instance Type: Free",
    title: "3. Publicar o Back-end Django/API de graça no Render",
    simpleAnalogy:
      "O Render é a cozinha gratuita ligada 24h que executa seu código Python/Django e responde os pedidos em JSON.",
    whereToClick: [
      "Acesse dashboard.render.com e faça login com 'GitHub' (plano grátis não exige upgrade para subir Web Service Python).",
      "Clique no botão 'New +' -> 'Web Service' -> selecione seu repositório 'minha-vitrine-loja'.",
      "Em Instance Type, selecione exatamente 'Free ($0 / month)'.",
      "Preencha Build Command, Start Command e clique em 'Environment Variables' para colar SECRET_KEY, DATABASE_URL e CORS.",
      "Clique em 'Create Web Service'. Em ~3 minutos você terá uma URL pública estilo https://minha-api.onrender.com.",
    ],
    fields: [
      {
        label: "Build Command (copie e cole)",
        value: "pip install -r requirements.txt && python manage.py migrate",
        copyable: true,
      },
      {
        label: "Start Command (copie e cole)",
        value: "gunicorn config.wsgi:application",
        copyable: true,
      },
      {
        label: "Variáveis obrigatórias (Environment)",
        value: "DJANGO_DEBUG=false\nALLOWED_HOSTS=.onrender.com\nDATABASE_URL=sua_url_do_neon",
        copyable: true,
      },
    ],
    warningNote:
      "Importante no plano mínimo gratuito: após 15 minutos sem nenhum visitante, o Render coloca o servidor para 'dormir'. Quando você abrir de novo, a primeira resposta leva ~40 segundos para acordar — isso é normal no R$ 0,00.",
    signupUrl: "https://dashboard.render.com/register",
    imagePath: "/cursos/guias/card-render-api.jpg",
    imageAlt: "Painel do Render Web Service destacando Instance Type Free ($0/month), comandos Build/Start e Environment Variables.",
    stepVisuals: [
      {
        stepLabel: "1. Web Service Free",
        caption: "Em 'New + -> Web Service', marque Instance Type exatamente em 'Free ($0/month)'.",
        imagePath: "/cursos/guias/card-render-api.jpg",
        imageAlt: "Painel Create Web Service do Render mostrando Instance Type Free e Build/Start Commands.",
      },
      {
        stepLabel: "2. Variáveis & Banco",
        caption: "Adicione DJANGO_DEBUG=false, ALLOWED_HOSTS, DATABASE_URL e CORS_ALLOWED_ORIGINS.",
        imagePath: "/cursos/guias/step-render-env.jpg",
        imageAlt: "Tela de Environment Variables do Render com chaves do Django e do Neon.",
      },
      {
        stepLabel: "3. Como funciona o Sono",
        caption: "Entenda o ciclo R$ 0: dorme após 15 min sem visita e acorda em ~40s ao primeiro clique.",
        imagePath: "/cursos/guias/step-render-sleep.svg",
        imageAlt: "Infográfico do ciclo gratuito do Render: ativo, 15 min soneca e despertar em 40 segundos.",
      },
    ],
  },
  {
    id: "deploy-vercel",
    order: 4,
    provider: "Vercel",
    minLevel: "facil",
    costLabel: "R$ 0,00 · Plano Hobby (projetos pessoais)",
    title: "4. Publicar seu Site / Front-end de graça na Vercel",
    simpleAnalogy:
      "A Vercel coloca sua vitrine bonita no ar com HTTPS automático (cadeado verde) e gera um link para abrir em qualquer celular.",
    whereToClick: [
      "Acesse vercel.com/signup e escolha 'Continue with GitHub' -> plano Hobby (gratuito para uso pessoal e estudo).",
      "No painel inicial, clique em 'Add New...' -> 'Project'.",
      "Encontre seu repositório na lista e clique no botão 'Import'.",
      "Se estiver no Nível Mediano ou Difícil, abra 'Environment Variables' e adicione NEXT_PUBLIC_API_URL apontando para a URL do Render.",
      "Clique em 'Deploy'. Em menos de 2 minutos surgem os confetes e seu link público `.vercel.app` fica pronto!",
    ],
    fields: [
      {
        label: "Variável de ligação com a API (Nível Mediano/Difícil)",
        value: "NEXT_PUBLIC_API_URL=https://sua-api.onrender.com",
        copyable: true,
      },
      {
        label: "No Render: libere a URL gerada pela Vercel",
        value: "CORS_ALLOWED_ORIGINS=https://seu-projeto.vercel.app",
        copyable: true,
        helper: "Sem essa linha, o navegador bloqueia o front-end de conversar com sua API.",
      },
    ],
    signupUrl: "https://vercel.com/signup",
    imagePath: "/cursos/guias/card-vercel-site.jpg",
    imageAlt: "Fluxo em 3 passos da Vercel: importar repositório do GitHub, clicar em Deploy e abrir o site com HTTPS ativo.",
    stepVisuals: [
      {
        stepLabel: "1. Importar & Deploy",
        caption: "Em vercel.com/signup entre com GitHub, clique em 'Import' no seu repositório e aperte 'Deploy'.",
        imagePath: "/cursos/guias/card-vercel-site.jpg",
        imageAlt: "Fluxo da Vercel importando repositório do GitHub direto para produção com HTTPS.",
      },
      {
        stepLabel: "2. Ligar Back-end (Mediano+)",
        caption: "Nos níveis Mediano e Difícil, adicione NEXT_PUBLIC_API_URL antes de clicar em Deploy.",
        imagePath: "/cursos/guias/step-vercel-env.jpg",
        imageAlt: "Tela Configure Project da Vercel destacando Environment Variables NEXT_PUBLIC_API_URL.",
      },
      {
        stepLabel: "3. Loja no Celular!",
        caption: "Seu link https://minha-loja.vercel.app abre no navegador e no celular pronto para vender.",
        imagePath: "/cursos/guias/step-vercel-mobile.svg",
        imageAlt: "Vitrine publicada na Vercel com cadeado HTTPS e pedido simulado no celular via WhatsApp.",
      },
    ],
  },
];

export function isValidCourseDifficultyLevel(value: unknown): value is CourseDifficultyLevel {
  return value === "facil" || value === "mediano" || value === "dificil";
}

export function getCourseLevelSpec(level: CourseDifficultyLevel): CourseLevelSpec {
  return COURSE_LEVELS[level] ?? COURSE_LEVELS.facil;
}

export function getDeployCardsForLevel(level: CourseDifficultyLevel): DeployStepCard[] {
  if (level === "facil") {
    return FREE_DEPLOY_CARDS.filter((c) => c.minLevel === "facil");
  }
  return FREE_DEPLOY_CARDS;
}
