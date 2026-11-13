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
            title: "Módulo 1 — Visão do negócio e os números",
            summary:
              "Entenda a divisão real de um pedido entre cliente, lojista, provedor de pagamento e plataforma, com simuladores interativos, fluxo do PIX e PDF para baixar.",
            durationMin: 60,
            status: "gratuita",
            prerequisites: ["licao-f06"],
            objectives: [
              "Calcular comissão, taxa do provedor e repasse ao lojista em centavos inteiros",
              "Entender por que a comissão não incide sobre o frete no MySuperStore",
              "Simular ponto de equilíbrio mensal considerando custos fixos e ticket médio",
              "Percorrer o fluxo de um pedido pago via PIX do checkout ao webhook",
            ],
          },
        ],
      },
      {
        number: 2,
        id: "modulo-2",
        title: "Modelo de dados",
        description:
          "Modelagem de pedido, sub-pedido por lojista, itens com snapshot de preço/endereço, pagamento, repasse e histórico de comissões em DecimalField.",
        lessons: [
          {
            id: "licao-02",
            slug: "modulo-2-modelo-de-dados",
            moduleNumber: 2,
            title: "Módulo 2 — Modelo de dados",
            summary:
              "Por que separar Order e SubOrder, como funciona o snapshot de preço e endereço e por que dinheiro nunca vai em float.",
            durationMin: 90,
            status: "paga",
            prerequisites: ["licao-01"],
            objectives: [
              "Modelar Order, SubOrder, OrderItem, Payment, Payout e CommissionEntry",
              "Aplicar snapshots para preservar histórico fiscal e comercial",
              "Usar DecimalField e on_delete=PROTECT em registros financeiros",
            ],
          },
        ],
      },
      {
        number: 3,
        id: "modulo-3",
        title: "Autenticação e acesso",
        description:
          "Separação de papéis (comprador, lojista, administrador), JWT com refresh, rotação de tokens e isolamento de consultas por loja.",
        lessons: [
          {
            id: "licao-03",
            slug: "modulo-3-autenticacao-e-acesso",
            moduleNumber: 3,
            title: "Módulo 3 — Autenticação e acesso",
            summary:
              "Trade-offs de JWT em aplicações mobile e web, permissões por loja e proteção contra acesso indevido entre lojistas.",
            durationMin: 60,
            status: "paga",
            prerequisites: ["licao-02"],
            objectives: [
              "Configurar autenticação JWT e entender o custo da rotação de refresh tokens",
              "Implementar permissões de objeto para comprador e lojista",
              "Avaliar riscos de XSS vs CSRF no armazenamento de sessão",
            ],
          },
        ],
      },
      {
        number: 4,
        id: "modulo-4",
        title: "Dinheiro com segurança",
        description:
          "Transações atômicas, trava de linha (select_for_update), baixa condicional de estoque, webhook idempotente, split, repasse e estorno.",
        lessons: [
          {
            id: "licao-04",
            slug: "modulo-4-dinheiro-com-seguranca",
            moduleNumber: 4,
            title: "Módulo 4 — Dinheiro com segurança",
            summary:
              "Como evitar venda duplicada da mesma peça, processar webhooks repetidos com idempotência e executar estornos com segurança.",
            durationMin: 120,
            status: "paga",
            prerequisites: ["licao-02", "licao-03"],
            objectives: [
              "Aplicar transaction.atomic() e select_for_update() em fluxos de pagamento",
              "Implementar baixa condicional de estoque sem condição de corrida",
              "Tratar webhooks idempotentes e estornos parciais/totais com o provedor",
            ],
          },
        ],
      },
      {
        number: 5,
        id: "modulo-5",
        title: "Tempo real e tarefas",
        description:
          "Notificações em tempo real com WebSockets, filas em segundo plano com Celery e expiração automática de pedidos não pagos.",
        lessons: [
          {
            id: "licao-05",
            slug: "modulo-5-tempo-real-e-tarefas",
            moduleNumber: 5,
            title: "Módulo 5 — Tempo real e tarefas",
            summary:
              "Como avisar comprador e lojista na hora que o PIX compensa e como devolver estoque de pedidos expirados.",
            durationMin: 75,
            status: "paga",
            prerequisites: ["licao-04"],
            objectives: [
              "Entregar confirmação de pagamento em tempo real via WebSocket",
              "Orquestrar tarefas periódicas e assíncronas com Celery",
              "Evitar estoque preso por pedidos abandonados ou cartão recusado",
            ],
          },
        ],
      },
      {
        number: 6,
        id: "modulo-6",
        title: "Mídia e performance",
        description:
          "Upload e otimização de imagens de produtos, prevenção de N+1 queries, índices no PostgreSQL e cache sob restrição de memória.",
        lessons: [
          {
            id: "licao-06",
            slug: "modulo-6-midia-e-performance",
            moduleNumber: 6,
            title: "Módulo 6 — Mídia e performance",
            summary:
              "Como manter o catálogo rápido e seguro em servidor enxuto sem estourar memória nem disco.",
            durationMin: 60,
            status: "paga",
            prerequisites: ["licao-02"],
            objectives: [
              "Tratar upload, validação e redimensionamento de imagens de catálogo",
              "Eliminar queries N+1 com select_related e prefetch_related",
              "Medir latência e uso de memória antes de otimizar",
            ],
          },
        ],
      },
      {
        number: 7,
        id: "modulo-7",
        title: "Infraestrutura, deploy e backup",
        description:
          "Docker, Docker Compose, proxy reverso com Caddy, TLS automático, CI/CD, rotina de backup e medições reais em produção.",
        lessons: [
          {
            id: "licao-07",
            slug: "modulo-7-infraestrutura-deploy-backup",
            moduleNumber: 7,
            title: "Módulo 7 — Infraestrutura, deploy e backup",
            summary:
              "Do código local ao ar em produção: containers, proxy reverso, backups testados e lições de latência de banco.",
            durationMin: 90,
            status: "paga",
            prerequisites: ["licao-05", "licao-06"],
            objectives: [
              "Estruturar Docker Compose com banco, worker e proxy Caddy",
              "Configurar pipeline de deploy e verificação de saúde",
              "Planejar backups e testar restauração real do PostgreSQL",
            ],
          },
        ],
      },
      {
        number: 8,
        id: "modulo-8",
        title: "Jurídico, fiscal e operação",
        description:
          "Pontos de verificação para operar um marketplace ou vender o software: CNPJ/CNAE, termos de uso, LGPD, política de reembolso e nota fiscal.",
        lessons: [
          {
            id: "licao-08",
            slug: "modulo-8-juridico-fiscal-operacao",
            moduleNumber: 8,
            title: "Módulo 8 — Jurídico, fiscal e operação",
            summary:
              "Checklist prático do que alinhar com contador e advogado antes de colocar um marketplace para operar com dinheiro real.",
            durationMin: 60,
            status: "paga",
            prerequisites: ["licao-01"],
            objectives: [
              "Mapear documentos e enquadramento necessários com contador e advogado",
              "Entender responsabilidades de LGPD e direito de arrependimento",
              "Organizar rotina operacional de suporte, disputa e repasse",
            ],
          },
        ],
      },
      {
        number: 9,
        id: "modulo-9",
        title: "Projeto final e certificado",
        description:
          "Construção de um mini-marketplace avaliado por rubrica técnica e emissão do certificado de conclusão de curso livre verificável.",
        lessons: [
          {
            id: "licao-09",
            slug: "modulo-9-projeto-final-certificado",
            moduleNumber: 9,
            title: "Módulo 9 — Projeto final e certificado",
            summary:
              "Implemente um fluxo completo de pedido, sub-pedido, pagamento idempotente e testes automatizados para avaliação e certificado verificável.",
            durationMin: 180,
            status: "paga",
            prerequisites: ["licao-04", "licao-05", "licao-07"],
            objectives: [
              "Entregar um mini-marketplace funcional com testes de aceitação",
              "Passar pela rubrica técnica e pelos quizzes dos módulos",
              "Obter certificado de conclusão de curso livre com código público verificável",
            ],
          },
        ],
      },
    ],
    copy: {
      pt: {
        metaTitle:
          "Curso Construa seu Marketplace: Do Código ao Pagamento em Produção",
        metaDescription:
          "Curso profissional baseado no MySuperStore (Django em produção): trilha Fundamentos (Módulo 0) do zero à primeira API + Módulo 1 (margem, PIX, repasse) gratuitos.",
        h1: "Construa seu marketplace: do código ao pagamento em produção",
        tagline:
          "Trilha completa do zero à produção usando o código real do MySuperStore: Módulo 0 de Fundamentos (6 lições, 11h) + 9 módulos principais de pagamentos, repasse e deploy.",
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
            "Você precisa de lógica de programação, noções de Python, SQL básico e HTTP/APIs. O Módulo 1 é gratuito e foca na visão do negócio e nos números antes de entrar no código.",
          ],
          [
            "Os números do simulador garantem quanto vou ganhar?",
            "Não. Os valores padrão do simulador são exemplos ilustrativos baseados em configurações de referência do código. Taxas de provedores, impostos e resultados dependem do seu contrato e da sua operação.",
          ],
          [
            "O que está disponível hoje?",
            "Todo o Módulo 0 de Fundamentos (6 lições: O Mapa, Bancada no Windows, Primeiro Projeto Django, Primeira API com DRF, Testes & Git e Leitura do MySuperStore — 11h) e o Módulo 1 (Visão do negócio e os números) estão completos e gratuitos nesta página, com simuladores, quizzes explicados e PDFs. Os módulos 2 a 9 estão em preparação e você pode entrar na lista de espera.",
          ],
          [
            "Como funciona o certificado verificável?",
            "Após a conclusão dos quizzes e aprovação do projeto final pela rubrica técnica, é emitido um certificado de conclusão de curso livre com código único que pode ser conferido publicamente no site da Maldivas Tech.",
          ],
        ],
      },
      en: {
        metaTitle:
          "Build a Marketplace in Production: From Data Model to PIX & Payouts",
        metaDescription:
          "Professional engineering course based on MySuperStore (Django in production): orders, sub-orders, PIX, split payouts, refunds, WebSockets and deployment.",
        h1: "Build your marketplace: from code to payments in production",
        tagline:
          "A 9-module professional course using the real MySuperStore codebase as a case study — from order unit economics to webhooks, payouts and deployment.",
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
            "The lessons, PDFs and interactive exercises are written in Brazilian Portuguese (pt-BR). This English overview describes the curriculum and structure for international visitors.",
          ],
          [
            "Do simulator numbers guarantee financial results?",
            "No. All simulator values are illustrative examples based on reference settings in the codebase. Actual fees, taxes and margins depend on your provider contract and business operation.",
          ],
          [
            "What is available right now?",
            "Module 1 (Business vision and unit economics) is complete and free in Portuguese, including interactive simulators, quiz and downloadable PDF. Modules 2–9 are in preparation; you can join the waitlist.",
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

