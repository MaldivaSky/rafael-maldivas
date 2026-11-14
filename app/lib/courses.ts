/* ------------------------------------------------------------------ */
/*  Catálogo de cursos + metadados otimizados por INTENÇÃO DE BUSCA    */
/*                                                                     */
/*  Padrão idêntico ao de products.ts e tools.ts: cada curso tem       */
/*  `copy.pt` e `copy.en` escritos para a intenção de busca de cada    */
/*  mercado, não como tradução literal.                                */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";

export type CourseSlug = "construa-seu-marketplace";
export type LessonStatus = "gratuita" | "paga";

export type CourseLesson = {
  id: string;
  slug: string;
  moduleNumber: number;
  title: string;
  summary: string;
  durationMin: number;
  status: LessonStatus;
  prerequisites: string[];
  objectives: string[];
};

export type CourseModule = {
  number: number;
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
};

export type CourseCopy = {
  /** <title> da aba — orientado à intenção de busca no idioma */
  metaTitle: string;
  /** meta description (150–160 chars) */
  metaDescription: string;
  /** H1 da página de venda */
  h1: string;
  /** Subtítulo / tagline para cards, JSON-LD e hero */
  tagline: string;
  /** Palavras-chave por intenção de busca */
  keywords: string[];
  /** Perguntas frequentes (rendem FAQPage em JSON-LD) */
  faq: [string, string][];
};

export type Course = {
  slug: CourseSlug;
  /** Título de trabalho do curso */
  name: string;
  /** Sistema real usado como estudo de caso */
  studyCase: string;
  /** Modalidade legal no Brasil */
  modality: "curso-livre";
  /** Nível recomendado */
  level: string;
  /** Idioma das lições */
  lessonsLanguage: "pt-BR";
  /** Stack principal abordada */
  stack: string[];
  /** Módulos e lições */
  modules: CourseModule[];
  /** Copy por idioma */
  copy: Record<Lang, CourseCopy>;
};

export const COURSES: Record<CourseSlug, Course> = {
  "construa-seu-marketplace": {
    slug: "construa-seu-marketplace",
    name: "Construa seu marketplace: do código ao pagamento em produção",
    studyCase: "MySuperStore",
    modality: "curso-livre",
    level: "Intermediário",
    lessonsLanguage: "pt-BR",
    stack: [
      "Django & DRF",
      "PostgreSQL",
      "PIX & Cartão (Efí)",
      "Split e Repasse",
      "WebSockets",
      "Celery",
      "Docker & Caddy",
    ],
    modules: [
      {
        number: 0,
        id: "modulo-0",
        title: "Fundamentos (Trilha Base)",
        description:
          "Do zero em web, Django e API usando uma analogia única (o restaurante): cada tecnologia como posto de trabalho, preparação da bancada no Windows, primeiro projeto Django, primeira API REST com DRF, testes, Git e leitura do MySuperStore.",
        lessons: [
          {
            id: "licao-f01",
            slug: "modulo-0-f01-o-mapa",
            moduleNumber: 0,
            title: "F01 — O mapa: cada peça da stack como um posto do restaurante",
            summary:
              "Entenda o que são servidor, HTTP, API, JSON, banco de dados, framework e ORM percorrendo a viagem de um pedido — e descubra onde a analogia do restaurante quebra.",
            durationMin: 90,
            status: "gratuita",
            prerequisites: [],
            objectives: [
              "Explicar o que são servidor, HTTP, API, JSON, banco de dados, framework e ORM",
              "Percorrer a viagem de um pedido do toque no celular até a linha gravada no banco",
              "Reconhecer onde a analogia do restaurante deixa de valer (concorrência e falha parcial)",
            ],
          },
          {
            id: "licao-f02",
            slug: "modulo-0-f02-preparando-a-bancada",
            moduleNumber: 0,
            title: "F02 — Preparando a bancada: Python, Git e venv no Windows",
            summary:
              "Instale Python e Git no Windows, crie um ambiente virtual (venv), fixe versões no requirements.txt e diagnostique os erros mais comuns lendo a mensagem.",
            durationMin: 90,
            status: "gratuita",
            prerequisites: ["licao-f01"],
            objectives: [
              "Instalar Python e Git no Windows e confirmar cada etapa com um comando",
              "Explicar por que cada projeto usa seu próprio ambiente virtual (venv)",
              "Fixar versões de Django e DRF no requirements.txt e diagnosticar erros de PATH",
            ],
          },
          {
            id: "licao-f03",
            slug: "modulo-0-f03-primeiro-projeto-django",
            moduleNumber: 0,
            title: "F03 — Seu primeiro projeto Django: projeto × app, model e migração",
            summary:
              "Crie o projeto e o app, entenda o papel de cada arquivo, transforme uma classe Python em tabela com makemigrations e migrate, e use o ORM e o painel admin.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-f02"],
            objectives: [
              "Diferenciar projeto (restaurante) de app (departamento) no Django",
              "Explicar a função de manage.py, settings.py, urls.py, models.py, admin.py e migrations/",
              "Transformar um model em tabela com makemigrations e migrate e ler o SQL gerado",
            ],
          },
          {
            id: "licao-f04",
            slug: "modulo-0-f04-primeira-api-com-drf",
            moduleNumber: 0,
            title: "F04 — Sua primeira API com DRF: serializer, viewset, router e status HTTP",
            summary:
              "Monte o delivery em JSON com Django REST Framework, proteja campos read-only e provoque os códigos 200, 201, 400, 404, 405 e 409.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-f03"],
            objectives: [
              "Relacionar verbo HTTP, rota e código de status (200, 201, 400, 404, 405, 409)",
              "Conectar Serializer (conferente), ViewSet (cozinheiro) e Router (garçom)",
              "Implementar baixa condicional de estoque e impedir status forjado pelo cliente",
            ],
          },
          {
            id: "licao-f05",
            slug: "modulo-0-f05-testes-e-git",
            moduleNumber: 0,
            title: "F05 — Provar que funciona: testes automáticos, Git e regra dos segredos",
            summary:
              "Escreva testes no padrão preparar-agir-conferir, quebre o código de propósito para ver o teste gritar e use Git com .gitignore antes do primeiro commit.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-f04"],
            objectives: [
              "Escrever testes no padrão Arrange-Act-Assert com manage.py test",
              "Quebrar uma regra de propósito e interpretar a falha do teste",
              "Usar Git com .gitignore protegendo .venv, banco local e segredos (.env)",
            ],
          },
          {
            id: "licao-f06",
            slug: "modulo-0-f06-lendo-um-projeto-real",
            moduleNumber: 0,
            title: "F06 — Lendo um projeto de verdade: método aplicado ao MySuperStore",
            summary:
              "Aplique o método de leitura em 5 passos ('da porta para dentro') no repositório real do MySuperStore e compare cada peça com o exemplo mini-loja.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-f05"],
            objectives: [
              "Aplicar os 5 passos de leitura: planta, como roda, departamentos, cardápio e fluxo",
              "Localizar apps, rotas, serializers e models no MySuperStore sem ler tudo",
              "Identificar o que muda do exemplo de estudo para produção (login, permissões, serviços)",
            ],
          },
        ],
      },
      {
        number: 1,
        id: "modulo-1",
        title: "Visão do negócio e os números",
        description:
          "Como um marketplace ganha e perde dinheiro por pedido: comissão, taxa do provedor, frete grátis, ponto de equilíbrio e riscos operacionais.",
        lessons: [
          {
            id: "licao-01",
            slug: "modulo-1-visao-do-negocio",
            moduleNumber: 1,
            title: "A01 — O negócio do marketplace: de onde vem o dinheiro e quanto sobra",
            summary:
              "Entenda a divisão real de um pedido entre cliente, lojista, provedor de pagamento e plataforma, com simuladores interativos, fluxo do PIX, áudio, slides e PDF para baixar.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-f06"],
            objectives: [
              "Separar o que o cliente paga, o que o lojista recebe e o que sobra para a plataforma",
              "Calcular a margem de um pedido (comissão, frete, cupom e taxa do provedor) em centavos inteiros",
              "Explicar por que PIX e cartão deixam margens diferentes e por que o ticket importa",
              "Montar as hipóteses de um ponto de equilíbrio, sabendo o que ainda não se sabe",
            ],
          },
        ],
      },
      {
        number: 2,
        id: "modulo-2",
        title: "Modelo de dados, carrinho, frete e cupom",
        description:
          "Modelagem de pedido, sub-pedido por lojista e item com snapshot de preço/endereço, além do recálculo no servidor de frete e cupom sem perder centavos.",
        lessons: [
          {
            id: "licao-02",
            slug: "modulo-2-modelo-de-dados",
            moduleNumber: 2,
            title: "A02 — Modelo de dados: pedido, sub-pedido e item, e por que o banco decide se o dinheiro fecha",
            summary:
              "Por que um pedido com duas lojas vira três tabelas, como o snapshot evita perda de histórico fiscal e como escolher CASCADE, PROTECT ou SET_NULL.",
            durationMin: 100,
            status: "gratuita",
            prerequisites: ["licao-01"],
            objectives: [
              "Desenhar o modelo Pedido, Sub-pedido, Item, Pagamento, Repasse e Comissão e justificar cada relação",
              "Explicar o que é um snapshot e mostrar o bug que ele evita",
              "Escolher CASCADE, PROTECT ou SET_NULL para uma relação, com o motivo",
              "Separar o ciclo de vida do pagamento (pedido) do ciclo de vida da entrega (sub-pedido)",
            ],
          },
          {
            id: "licao-03",
            slug: "modulo-2-carrinho-frete-cupom",
            moduleNumber: 2,
            title: "A03 — Carrinho, frete e cupom: o servidor decide o valor, e o desconto não perde centavo",
            summary:
              "Como recalcular totais no servidor, revalidar cupons dentro da transação e ratear descontos entre lojas sem erro de arredondamento.",
            durationMin: 110,
            status: "gratuita",
            prerequisites: ["licao-01", "licao-02"],
            objectives: [
              "Explicar por que o total, o frete e o desconto são calculados no servidor e nunca aceitos do navegador",
              "Descrever como um cupom é revalidado e consumido dentro da transação do pedido",
              "Implementar o rateio de desconto entre lojas com a sobra de arredondamento na última",
              "Prever o efeito de um cupom sobre o frete grátis",
            ],
          },
        ],
      },
      {
        number: 3,
        id: "modulo-3",
        title: "Dinheiro com segurança: estoque, cobrança, webhook, repasse e estorno",
        description:
          "Transações atômicas, trava de linha, baixa condicional de estoque, cobrança PIX/cartão com mTLS, webhook idempotente, split, repasse e estorno.",
        lessons: [
          {
            id: "licao-04",
            slug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
            moduleNumber: 3,
            title: "A04 — Criar o pedido sem vender duas vezes: transação, trava e baixa condicional",
            summary:
              "Como impedir condição de corrida quando duas pessoas clicam em 'comprar' ao mesmo tempo na última unidade em estoque.",
            durationMin: 130,
            status: "gratuita",
            prerequisites: ["licao-02", "licao-03"],
            objectives: [
              "Explicar uma condição de corrida usando uma linha do tempo de duas transações",
              "Justificar por que a baixa de estoque é um UPDATE condicional e não 'ler, decidir e gravar'",
              "Distinguir o papel da transação, da trava de linha e da baixa condicional",
              "Identificar o risco de deadlock quando as travas não seguem uma ordem fixa",
            ],
          },
          {
            id: "licao-05",
            slug: "modulo-3-cobrar-pix-e-cartao",
            moduleNumber: 3,
            title: "A05 — Cobrar com PIX e cartão: mTLS, QR code, split e tokenização",
            summary:
              "Como o dinheiro chega à plataforma e aos lojistas via Efí (PIX e cartão tokenizado), sem que o número do cartão toque o seu servidor.",
            durationMin: 110,
            status: "gratuita",
            prerequisites: ["licao-02", "licao-03", "licao-04"],
            objectives: [
              "Descrever o fluxo de cobrança PIX (QR, copia-e-cola, split) e o de cartão (tokenização e cobrança)",
              "Explicar para que serve o certificado mTLS e por que o código o converte, protege e guarda em cache",
              "Converter reais em centavos sem erro de ponto flutuante",
              "Reconhecer o risco do fallback de PIX local e do PIX pago depois do cancelamento",
            ],
          },
          {
            id: "licao-06",
            slug: "modulo-3-confirmar-pagamento-webhook",
            moduleNumber: 3,
            title: "A06 — Confirmar o pagamento: webhook, segredo, fail-closed e idempotência",
            summary:
              "Como validar webhooks em URL pública com comparação em tempo constante, fail-closed, conferência de valor e trava idempotente.",
            durationMin: 130,
            status: "gratuita",
            prerequisites: ["licao-04", "licao-05"],
            objectives: [
              "Explicar os três caminhos pelos quais o sistema descobre que um PIX foi pago",
              "Justificar cada defesa do webhook (segredo, comparação em tempo constante, fail-closed e conferência do valor)",
              "Definir idempotência e mostrar por que a trava do pedido é necessária",
              "Reconhecer a lacuna do pedido cancelado que recebe pagamento",
            ],
          },
          {
            id: "licao-07",
            slug: "modulo-3-repasse-e-estorno",
            moduleNumber: 3,
            title: "A07 — Repasse e estorno: pagar o lojista uma vez e devolver sem devolver demais",
            summary:
              "As três situações de repasse (split, loja da casa, PIX de saída), ID determinístico de operação e teto acumulado para estornos.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-05", "licao-06"],
            objectives: [
              "Descrever as três situações de repasse (split, loja da casa, PIX de saída) e a regra de cada uma",
              "Explicar por que o ID da operação financeira precisa ser determinístico",
              "Listar e justificar as regras do estorno (aprovado, teto, acumulado, só depois do provedor)",
              "Reconhecer o risco de um repasse preso em PROCESSING",
            ],
          },
        ],
      },
      {
        number: 4,
        id: "modulo-4",
        title: "Ciclo de vida, tempo real e mídia",
        description:
          "Expiração de pedidos e estoque preso com Celery, notificações em tempo real via WebSockets com autorização e upload de mídia sem derrubar a VM.",
        lessons: [
          {
            id: "licao-08",
            slug: "modulo-4-ciclo-de-vida-e-worker",
            moduleNumber: 4,
            title: "A08 — O ciclo de vida do pedido: expiração, estoque preso e worker",
            summary:
              "O que acontece com a peça reservada quando o cliente desiste no meio do pagamento e quando vale manter um worker em segundo plano.",
            durationMin: 110,
            status: "gratuita",
            prerequisites: ["licao-04", "licao-06"],
            objectives: [
              "Explicar por que reservar estoque na criação do pedido exige uma regra de expiração",
              "Aplicar as regras de cancelamento e justificar a exceção do cartão pendente",
              "Mostrar com teste automatizado como o bug do estoque preso é prevenido",
              "Decidir para cada tarefa em segundo plano se ela precisa mesmo de um worker",
            ],
          },
          {
            id: "licao-09",
            slug: "modulo-4-tempo-real-e-midia",
            moduleNumber: 4,
            title: "A09 — Tempo real, notificações e mídia: WebSocket, push e upload enxuto",
            summary:
              "Autenticação e autorização em WebSockets, caminho das notificações e upload direto ao serviço de mídia para proteger a memória.",
            durationMin: 120,
            status: "gratuita",
            prerequisites: ["licao-02", "licao-04", "licao-08"],
            objectives: [
              "Explicar como uma conexão WebSocket é autenticada e por que autenticar não basta (autorização)",
              "Descrever o caminho de uma mensagem do chat até a notificação do outro usuário",
              "Justificar o upload direto de vídeo ao serviço de mídia e a conferência feita no servidor",
              "Calcular por que um arquivo pequeno pode consumir centenas de megabytes de memória",
            ],
          },
        ],
      },
      {
        number: 5,
        id: "modulo-5",
        title: "Infraestrutura, deploy e operação",
        description:
          "Docker, Docker Compose, proxy reverso com Caddy, TLS automático, pipeline de deploy, backup testado e orçamento de memória em VM de 1 GB.",
        lessons: [
          {
            id: "licao-10",
            slug: "modulo-5-infraestrutura-deploy-backup",
            moduleNumber: 5,
            title: "A10 — No ar e operando: Docker, deploy, backup, memória e decidir com medidas",
            summary:
              "Do código local ao ar em produção numa máquina de 1 GB: containers, ordem segura de migração, teste real de restauração e medições.",
            durationMin: 130,
            status: "gratuita",
            prerequisites: ["licao-04", "licao-08", "licao-09"],
            objectives: [
              "Ler um Dockerfile e um Compose e explicar o porquê de cada decisão (cache, limites, healthcheck)",
              "Descrever o pipeline de deploy automático e a ordem segura (migrar antes de trocar a aplicação)",
              "Validar que um backup funciona e não apenas que o arquivo existe",
              "Montar um orçamento de memória e decidir com medidas reais",
            ],
          },
        ],
      },
      {
        number: 6,
        id: "modulo-6",
        title: "Jurídico, fiscal e operação",
        description:
          "Pontos de verificação para operar um marketplace ou vender o software: CNPJ/CNAE, termos de uso, LGPD, política de reembolso e nota fiscal.",
        lessons: [
          {
            id: "licao-11",
            slug: "modulo-6-juridico-fiscal-operacao",
            moduleNumber: 6,
            title: "A11 — Jurídico, fiscal e operação: o que resolver antes de cobrar de alguém",
            summary:
              "O que depende de contador, de advogado e do desenvolvedor antes de receber dinheiro de clientes e repassar a lojistas.",
            durationMin: 90,
            status: "gratuita",
            prerequisites: ["licao-01", "licao-05", "licao-07"],
            objectives: [
              "Mapear o que depende de contador, de advogado e de você, sabendo fazer as perguntas certas",
              "Identificar no código onde o sistema toca dados pessoais (LGPD) e dinheiro de terceiros",
              "Reconhecer promessas de marketing que criam risco jurídico e reescrevê-las com honestidade",
              "Montar o checklist 'antes de cobrar' do seu marketplace",
            ],
          },
        ],
      },
      {
        number: 7,
        id: "modulo-7",
        title: "Projeto final e certificado",
        description:
          "Construção de um mini-marketplace avaliado por rubrica técnica com testes que provam o dinheiro e emissão do certificado de curso livre verificável.",
        lessons: [
          {
            id: "licao-12",
            slug: "modulo-7-projeto-final-certificado",
            moduleNumber: 7,
            title: "Projeto final — O seu mini-marketplace com testes que provam o dinheiro",
            summary:
              "Reúna as regras de dinheiro, estoque, pagamento idempotente, estorno e expiração em um pacote testado para avaliação e certificado verificável.",
            durationMin: 360,
            status: "gratuita",
            prerequisites: [
              "licao-01",
              "licao-02",
              "licao-03",
              "licao-04",
              "licao-05",
              "licao-06",
              "licao-07",
              "licao-08",
              "licao-09",
              "licao-10",
              "licao-11",
            ],
            objectives: [
              "Reunir as regras de dinheiro, estoque, pagamento, estorno e expiração em um pacote testado",
              "Fechar as lacunas reais estudadas no módulo (pagamento órfão, cupom que volta, ordem das travas)",
              "Documentar decisões, hipóteses de negócio e o checklist legal com honestidade",
              "Explicar o projeto em uma apresentação curta para receber o certificado verificável",
            ],
          },
        ],
      },
    ],
    copy: {
      pt: {
        metaTitle:
          "Curso Gratuito Construa seu Marketplace: Do Código ao Pagamento em Produção",
        metaDescription:
          "Curso interativo 100% gratuito (18 aulas · 38h 10min) com simulador de terminal, Casa Pré-Moldada no VS Code, deploy R$ 0 e certificado verificável.",
        h1: "Construa seu marketplace: do código ao pagamento em produção (100% Gratuito)",
        tagline:
          "Trilha completa de 18 aulas (38h 10min) usando o código real do MySuperStore: Módulo 0 de Fundamentos (6 aulas, 11h) + 12 aulas de modelo de dados, PIX, repasse, tempo real e deploy.",
        keywords: [
          "curso criar marketplace",
          "como construir um marketplace do zero",
          "arquitetura de marketplace django",
          "split de pagamento pix marketplace",
          "curso backend pagamentos produção",
          "estudo de caso marketplace real",
        ],
        faq: [
          [
            "Este curso é reconhecido pelo MEC?",
            "Não. Trata-se de um curso livre de capacitação profissional, modalidade não regulamentada pelo MEC. Ao concluir os critérios de aprovação, o aluno recebe um certificado de conclusão de curso livre com código verificável.",
          ],
          [
            "Preciso saber Django antes de começar?",
            "Não. Quem está começando entra pelo Módulo 0 (Fundamentos, 6 aulas gratuitas / 11h): você aprende o mapa da stack web, prepara Python/venv/Git no Windows, cria seu primeiro projeto Django e sua primeira API com DRF, escreve testes e lê o MySuperStore passo a passo.",
          ],
          [
            "Os números do simulador garantem quanto vou ganhar?",
            "Não. Os valores padrão do simulador são exemplos ilustrativos baseados em configurações de referência do código. Taxas de provedores, impostos e resultados dependem do seu contrato e da sua operação.",
          ],
          [
            "O que está disponível hoje?",
            "Todas as 18 aulas do curso (38h 10min) estão 100% abertas e gratuitas: Módulo 0 Fundamentos (F01 a F06 — 11h), Módulo 1 (A01 — 2h) e toda a trilha principal até o Projeto Final (A02 a A11 + Projeto Final — 25h 10min), com diagramas visuais interativos, exercícios de lacunas, quizzes explicados, vídeos, áudios, slides e PDFs.",
          ],
          [
            "Como funciona o certificado verificável?",
            "Após a conclusão dos quizzes e aprovação do projeto final pela rubrica técnica, é emitido um certificado de conclusão de curso livre com código único (carga horária real de 38h 10min) consultável publicamente no site da Maldivas Tech.",
          ],
        ],
      },
      en: {
        metaTitle:
          "Free Course — Build a Marketplace in Production: From Data Model to PIX & Payouts",
        metaDescription:
          "100% free 18-lesson (38h 10m) interactive engineering course with browser terminal simulator, VS Code starter kit, free cloud deploy and verifiable certificate.",
        h1: "Build your marketplace: from code to payments in production (100% Free)",
        tagline:
          "An 18-lesson (38h 10m) course grounded in the real MySuperStore codebase — starting with a 6-lesson Foundations track (Module 0) through PIX payments, idempotency, payouts and deployment.",
        keywords: [
          "marketplace architecture course",
          "how to build a multi-vendor marketplace",
          "django marketplace payments course",
          "split payment webhook idempotency",
          "production backend case study",
        ],
        faq: [
          [
            "Is this an accredited university degree?",
            "No. Under Brazilian education rules, this is a free-standing professional training course (curso livre), not a degree or MEC-accredited program. Graduates receive a verifiable certificate of completion.",
          ],
          [
            "What language are the lessons in?",
            "The lessons, PDFs, videos, audios and interactive exercises are written in Brazilian Portuguese (pt-BR). This English overview describes the curriculum and structure for international visitors.",
          ],
          [
            "Do simulator numbers guarantee financial results?",
            "No. All simulator values are illustrative examples based on reference settings in the codebase. Actual fees, taxes and margins depend on your provider contract and business operation.",
          ],
          [
            "What is available right now?",
            "All 18 lessons (38h 10m) are 100% open and free in Portuguese — Module 0 Foundations (6 lessons, 11h) plus the full 12-lesson production track (A01–A11 and Final Project), with interactive visual diagrams, fill-in-the-blank labs, explained quizzes, videos, audios, slide decks and PDFs.",
          ],
        ],
      },
    },
  },
};

export const courseList: Course[] = Object.values(COURSES);

export function courseBySlug(slug: string): Course | undefined {
  return courseList.find((c) => c.slug === slug);
}

export function allCourseLessons(course: Course): CourseLesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function lessonBySlug(
  course: Course,
  lessonSlug: string,
): CourseLesson | undefined {
  return allCourseLessons(course).find((l) => l.slug === lessonSlug);
}

/** Carga horária total calculada exclusivamente pela soma das lições (nunca inflada). */
export function totalCourseMinutes(course: Course): number {
  return allCourseLessons(course).reduce((acc, l) => acc + l.durationMin, 0);
}

export function formatDuration(minutes: number, lang: Lang): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return lang === "pt" ? `${h}h` : `${h}h`;
  return lang === "pt" ? `${h}h ${m}min` : `${h}h ${m}m`;
}

