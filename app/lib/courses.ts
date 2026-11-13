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
            prerequisites: [],
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
          "Curso profissional baseado no MySuperStore (Django em produção): pedido, sub-pedido, PIX, split, repasse, estorno, deploy e operação. Comece pelo Módulo 1 gratuito.",
        h1: "Construa seu marketplace: do código ao pagamento em produção",
        tagline:
          "Curso profissional em 9 módulos usando o código real do MySuperStore como estudo de caso — da margem por pedido ao PIX, repasse, deploy e operação.",
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
            "O Módulo 1 (Visão do negócio e os números) está completo e gratuito nesta página, com simuladores interativos, fluxo do PIX, quiz e PDF para baixar. Os módulos 2 a 9 estão em preparação e você pode entrar na lista de espera.",
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
