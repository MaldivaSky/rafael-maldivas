export type AgentLang = "pt" | "en";

export type ConciergeProductSummary = {
  name: string;
  slug: string;
  role: string;
  tagline: string;
  priceBRL: string;
  trialDays: number;
  stack: string[];
  appUrl?: string;
};

export type ConciergeWorkSummary = {
  name: string;
  client: string;
  kind: string;
  desc: string;
  proof: string;
  url: string;
};

export type ConciergeServiceSummary = {
  id: string;
  area: string;
  name: string;
  summary: string;
  outcome: string;
};

export type MaldivasKnowledgeContext = {
  company: {
    tradeName: string;
    legalName: string;
    cnpj: string;
    city: string;
    region: string;
    street: string;
    site: string;
    whatsapp: string;
    email: string;
  };
  founderCerts: {
    issuer: string;
    name: string;
    id: string;
    verifyUrl: string;
  }[];
  products: ConciergeProductSummary[];
  works: ConciergeWorkSummary[];
  services: ConciergeServiceSummary[];
  courseSummary: {
    name: string;
    slug: string;
    lessonsCount: number;
    durationLabel: string;
    studyCase: string;
  };
};

export type ConciergeAgentInput = {
  question: string;
  lang: AgentLang;
  contextPath?: string;
};

export type ConciergeAgentResult = {
  answer: string;
  highlights: string[];
  recommendedRoute: string;
  recommendedRouteLabel: string;
  whatsappPrefill: string;
  source: "gemini" | "fallback";
  model?: string;
};

export type DiagnosticAgentInput = {
  business: string;
  pain: string;
  priority?: string;
  lang: AgentLang;
};

export type DiagnosticAgentResult = {
  summary: string;
  recommendedSolution: string;
  architecturePillars: string[];
  firstSprintSteps: string[];
  estimatedTimeline: string;
  metricsToTrack: string[];
  source: "gemini" | "fallback";
  model?: string;
};

export type TutorAgentInput = {
  stationId: string;
  lessonSlug: string;
  studentQuery: string;
  codeOrPayload?: string;
  lang: AgentLang;
};

export type TutorAgentResult = {
  socraticHint: string;
  roomAnalogy: string;
  nextChecklist: string[];
  checkpointQuestion: string;
  source: "gemini" | "fallback";
  model?: string;
};

const STATION_ROOMS: Record<
  string,
  { room: string; focus: string; defaultChecklist: string[] }
> = {
  bancada: {
    room: "Planta Geral (Os 4 Cômodos da Casa Pré-Moldada)",
    focus: "Preparação do ambiente VS Code + Python + Git antes de codar.",
    defaultChecklist: [
      "Confirme que o Python foi instalado com Add python.exe to PATH.",
      "Crie e ative o ambiente virtual (.venv) dentro da pasta do projeto.",
      "Rode python testar_minha_casa.py no Terminal Integrado para validar os 4 cômodos.",
    ],
  },
  terminal: {
    room: "Canteiro de Obras & Controle de Acesso (.gitignore + venv)",
    focus: "Segurança de segredos (.env) e disciplina de Git antes do primeiro commit.",
    defaultChecklist: [
      "Verifique com pwd e ls se está dentro da pasta minha-loja (nunca na raiz ~).",
      "Garanta que .env está listado no .gitignore antes de rodar git add .",
      "Ative o ambiente virtual antes de rodar pip install ou python manage.py.",
    ],
  },
  sandbox: {
    room: "Cômodo 1 (Alicerce em Centavos) & Cômodo 2 (Paredes de API/Estoque)",
    focus: "Integridade financeira em centavos inteiros e isolamento transacional.",
    defaultChecklist: [
      "Converta todo valor monetário para centavos inteiros (int) — nunca use float para dinheiro.",
      "Valide quantidades e estoque com travas atômicas no servidor antes de confirmar pedido.",
      "Leia a mensagem de falha do teste automatizado (__TEST_RESULT__) linha por linha.",
    ],
  },
  http: {
    room: "Cômodo 2 (Paredes: Contrato HTTP, Assinatura HMAC e Idempotência PIX)",
    focus: "Fail-closed em webhooks e proteção contra overselling e replay.",
    defaultChecklist: [
      "Envie o header Authorization: Bearer ... nas rotas protegidas de pedido/estorno.",
      "Em webhooks (/api/v1/webhooks/efi), confira X-Webhook-Signature antes de alterar saldo.",
      "Reenvie o mesmo Idempotency-Key para confirmar que o ledger não credita duas vezes.",
    ],
  },
  loja: {
    room: "Cômodo 3 (Móveis & Fachada: Vitrine HTML desacoplada do servidor)",
    focus: "Identidade visual, catálogo e fechamento via WhatsApp sem expor segredos no client.",
    defaultChecklist: [
      "Personalize título, cor de destaque e WhatsApp com DDD válido.",
      "Confira se os preços exibidos derivam da base em centavos formatada apenas na UI.",
      "Teste o HTML gerado em tela móvel antes de subir para a nuvem.",
    ],
  },
  deploy: {
    room: "Cômodo 4 (Telhado & Habite-se: GitHub → Neon PostgreSQL → Render → Vercel)",
    focus: "Separação de variáveis de ambiente, migrações antes do boot e deploy R$ 0.",
    defaultChecklist: [
      "Nunca envie arquivos .env ou credenciais para o repositório GitHub.",
      "Configure DATABASE_URL no Neon PostgreSQL antes de subir o backend no Render.",
      "Verifique CORS e NEXT_PUBLIC_API_URL ao publicar o frontend na Vercel.",
    ],
  },
  cards: {
    room: "Revisão Espaçada (Memória Ativa dos 4 Cômodos)",
    focus: "Fixação de conceitos críticos de modelagem, concorrência, webhook e deploy.",
    defaultChecklist: [
      "Tente explicar o conceito em voz alta antes de virar a carta.",
      "Relacione cada pergunta ao risco financeiro real que ela evita em produção.",
      "Marque 'Errei / Revisar' sempre que hesitar para o algoritmo SM-2 reexibir em breve.",
    ],
  },
};

export function sanitizeAgentText(input: unknown, maxLen = 1200): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export class MemoryRateLimiter {
  private hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 20, windowMs = 60_000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  allow(key: string, now = Date.now()): boolean {
    const cleanKey = key || "anon";
    const recent = (this.hits.get(cleanKey) ?? []).filter(
      (ts) => now - ts < this.windowMs,
    );
    if (recent.length >= this.limit) {
      this.hits.set(cleanKey, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(cleanKey, recent);
    return true;
  }
}

export function extractJsonFromModelText<T>(rawText: string): T | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : trimmed).trim();

  try {
    return JSON.parse(candidate) as T;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export type GeminiCaller = (opts: {
  systemInstruction: string;
  userPrompt: string;
  apiKey?: string;
  timeoutMs?: number;
}) => Promise<{ text: string; model: string } | null>;

export async function callGeminiJsonText({
  systemInstruction,
  userPrompt,
  apiKey = process.env.GEMINI_API_KEY,
  timeoutMs = 12_000,
}: {
  systemInstruction: string;
  userPrompt: string;
  apiKey?: string;
  timeoutMs?: number;
}): Promise<{ text: string; model: string } | null> {
  const key = (apiKey ?? "").trim();
  if (!key) return null;

  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        key,
      )}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 900,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        continue;
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("\n")
          .trim() ?? "";

      if (text) {
        return { text, model };
      }
    } catch {
      // Fallback para o próximo modelo ou fallback determinístico
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

function buildFallbackConcierge(
  input: ConciergeAgentInput,
  ctx: MaldivasKnowledgeContext,
): ConciergeAgentResult {
  const q = input.question.toLowerCase();
  const pt = input.lang === "pt";

  if (/atol|api (oficial )?(do )?whatsapp|whatsapp (business )?(api|cloud)|cloud api|embedded signup|tech provider/.test(q)) {
    return {
      answer: pt
        ? "O Atol Connect é a plataforma multi-tenant da Maldivas Tech sobre a API oficial do WhatsApp Business (Cloud API da Meta). A empresa conecta o próprio número pelo Embedded Signup, atende em equipe numa caixa de entrada em tempo real, gerencia modelos e integra ERP, PDV ou loja virtual por REST API e webhooks assinados. A Maldivas Tech está em processo de credenciamento como Tech Provider da Meta."
        : "Atol Connect is Maldivas Tech's multi-tenant platform on the official WhatsApp Business API (Meta's Cloud API). Businesses connect their own number through Embedded Signup, serve customers from a real-time team inbox, manage templates and integrate ERP, POS or storefronts through a REST API and signed webhooks. Maldivas Tech's Meta Tech Provider accreditation is in progress.",
      highlights: pt
        ? [
            "Planos a partir de R$ 79/mês com 14 dias de teste grátis; tarifas de mensagem pagas direto à Meta",
            "Plano Parceiro para software houses: R$ 59 por número (mínimo 5), com API OpenAPI 3.1",
            "Isolamento por organização (RLS), tokens cifrados e webhooks assinados",
          ]
        : [
            "Plans from BRL 79/month with a 14-day free trial; message fees are paid directly to Meta",
            "Partner plan for software houses: BRL 59 per number (minimum 5), with an OpenAPI 3.1 spec",
            "Per-organization isolation (RLS), encrypted tokens and signed webhooks",
          ],
      recommendedRoute: `/${input.lang}/produtos/atol-connect`,
      recommendedRouteLabel: pt ? "Conhecer o Atol Connect" : "Explore Atol Connect",
      whatsappPrefill: pt
        ? "Olá Rafael! Vi o Atol Connect no site e quero integrar a API oficial do WhatsApp no meu sistema."
        : "Hi Rafael! I saw Atol Connect on your site and want to add the official WhatsApp API to my system.",
      source: "fallback",
    };
  }

  if (/miseon|restaurante|cozinha|bravus|totem|gertec|ifood|food/.test(q)) {
    return {
      answer: pt
        ? "O MiseOn é o SaaS multi-tenant da Maldivas Tech para food service e cozinhas profissionais. Ele une pedidos, baixa de estoque por ficha técnica (PEPS), emissão de NFC-e, integração homologada com iFood e com a API oficial do WhatsApp Business (Meta), e opera integrado aos totens e terminais Smart POS da parceria Bravus Core / Gertec."
        : "MiseOn is Maldivas Tech's multi-tenant SaaS for food service and professional kitchens. It connects orders, recipe-costed FIFO inventory, fiscal POS (NFC-e), approved iFood & Meta WhatsApp Business API integrations, and Bravus Core / Gertec self-service kiosks.",
      highlights: pt
        ? [
            "R$ 149,90/mês com 30 dias grátis de teste (multi-tenant com Row Level Security)",
            "Integração homologada iFood Orders API + Meta WhatsApp Business API",
            "Compatível com totens de autoatendimento e Smart POS Bravus Core / Gertec",
          ]
        : [
            "Multi-tenant PostgreSQL architecture with Row Level Security",
            "Approved iFood Orders API & Meta WhatsApp Business API integrations",
            "Paired with Bravus Core / Gertec self-service kiosks and Smart POS",
          ],
      recommendedRoute: `/${input.lang}/produtos/miseon`,
      recommendedRouteLabel: pt ? "Explorar MiseOn & Bravus Core" : "Explore MiseOn & Bravus Core",
      whatsappPrefill: pt
        ? "Olá Rafael! Conversei com o Concierge do site e quero conhecer o MiseOn + Totens Bravus para minha operação."
        : "Hi Rafael! I spoke with your site Concierge and want to explore MiseOn for my operation.",
      source: "fallback",
    };
  }

  if (/selectsys|fujiarte|ats|recrut|jap|vaga|ocr/.test(q)) {
    return {
      answer: pt
        ? "O SelectSys Jobs é o ATS bilíngue desenvolvido pela Maldivas Tech para a agência Fujiarte (Brasil → Japão). Ele substituiu planilhas e e-mails paralelos por cadastro estruturado com leitura OCR de documentos (Tesseract.js e PDF.js), permissões LGPD com Row Level Security no PostgreSQL e exportação fiel para os modelos Excel exigidos no processo internacional."
        : "SelectSys Jobs is our bilingual ATS built for Fujiarte (Brazil → Japan recruitment). It replaced scattered spreadsheets and email threads with OCR document parsing (Tesseract.js & PDF.js), PostgreSQL Row Level Security compliance, and faithful Excel template exports.",
      highlights: pt
        ? [
            "Redução documentada de 60% no tempo de triagem manual da agência Fujiarte",
            "OCR no cliente/servidor com Tesseract.js + PDF.js e exportação ExcelJS/Python",
            "Arquitetura LGPD by design com isolamento por empresa no PostgreSQL",
          ]
        : [
            "Documented 60% reduction in manual screening time for Fujiarte",
            "Document OCR with Tesseract.js + PDF.js and automated Excel template exports",
            "LGPD-by-design multi-company isolation in PostgreSQL",
          ],
      recommendedRoute: `/${input.lang}/portfolio/fujiarte`,
      recommendedRouteLabel: pt ? "Ver Case Fujiarte & SelectSys" : "View Fujiarte Case Study",
      whatsappPrefill: pt
        ? "Olá Rafael! Vi o case do SelectSys Jobs (Fujiarte) e quero conversar sobre um sistema sob medida ou ATS."
        : "Hi Rafael! I saw the SelectSys Jobs (Fujiarte) case study and want to discuss a custom system.",
      source: "fallback",
    };
  }

  if (/mercadinho|erp|pdv|fiscal|nfc|varejo|curva abc|rfm|mysuperstore|marketplace|macrame|macramê|eli/.test(q)) {
    return {
      answer: pt
        ? "Na linha de varejo e comércio, a Maldivas Tech opera o MercadinhoSys em domínio próprio (mercadinhosys.com.br) — plataforma validada no varejo, com novas implantações em andamento — com PDV fiscal NFC-e/SEFAZ e BI em Python/Pandas/Plotly (Curva ABC, RFM e DRE), além do MySuperStore — marketplace personalizável onde clientes reais como a Loja de Macramê da Eli operam sua vitrine com split automático de PIX via Efí Bank."
        : "For retail and commerce, Maldivas Tech operates MercadinhoSys on its custom domain (mercadinhosys.com.br) — a retail-validated platform with new rollouts in progress — with fiscal NFC-e POS and Pandas/Plotly BI (ABC Curve, RFM, P&L), alongside MySuperStore — a customizable marketplace powering real merchant storefronts such as Eli Macramê with automated Efí Bank PIX revenue split.",
      highlights: pt
        ? [
            "MercadinhoSys (mercadinhosys.com.br): domínio próprio, validado no varejo, novas implantações em andamento",
            "MySuperStore (personalize sua loja): caso real da Loja de Macramê da Eli em operação",
            "Split automático de pagamentos PIX/cartão + Celery & Redis em produção",
          ]
        : [
            "MercadinhoSys (mercadinhosys.com.br): custom domain, retail-validated, new rollouts in progress",
            "MySuperStore (customizable storefront): real production store Eli Macramê",
            "Automated PIX/card split settlement + Celery & Redis background workers",
          ],
      recommendedRoute: `/${input.lang}/produtos/mercadinhosys`,
      recommendedRouteLabel: pt ? "Conhecer MercadinhoSys (.com.br)" : "Explore MercadinhoSys (.com.br)",
      whatsappPrefill: pt
        ? "Olá Rafael! Quero entender como o MercadinhoSys (mercadinhosys.com.br) ou o MySuperStore se aplicam à minha loja."
        : "Hi Rafael! I'd like to discuss how MercadinhoSys or MySuperStore fits my store.",
      source: "fallback",
    };
  }

  if (/curso|aula|arena|pratica|prática|certificado|aprender|django/.test(q)) {
    return {
      answer: pt
        ? `O curso gratuito "${ctx.courseSummary.name}" tem ${ctx.courseSummary.lessonsCount} aulas (${ctx.courseSummary.durationLabel}) baseadas no código real do MySuperStore. Inclui Módulo 0 de Fundamentos (VS Code, Terminal, Python/SQL), Simulador HTTP/Webhook PIX, Casa Pré-Moldada e certificado verificável de curso livre.`
        : `Our free engineering course features ${ctx.courseSummary.lessonsCount} lessons (${ctx.courseSummary.durationLabel}) grounded in the real MySuperStore codebase, including interactive Terminal, Python/SQL sandbox, HTTP/PIX Webhook simulator, and verifiable completion certificate.`,
      highlights: pt
        ? [
            "100% gratuito com 7 estações práticas interativas no navegador",
            "Projeto real em produção: modelagem em centavos, concorrência e idempotência",
            "Tutor Socrático com IA integrado direto dentro da Arena Prática",
          ]
        : [
            "100% free with 7 interactive browser practice stations",
            "Real production patterns: integer-cent modeling, locks, webhook idempotency",
            "Built-in Socratic AI Tutor inside the Practice Arena",
          ],
      recommendedRoute: `/${input.lang}/cursos/${ctx.courseSummary.slug}`,
      recommendedRouteLabel: pt ? "Acessar Academy & Arena" : "Open Academy & Arena",
      whatsappPrefill: pt
        ? "Olá Rafael! Quero saber mais sobre os cursos e treinamentos da Maldivas Tech."
        : "Hi Rafael! I'd like to know more about Maldivas Tech's courses.",
      source: "fallback",
    };
  }

  return {
    answer: pt
      ? `A Maldivas Tech (${ctx.company.city}/${ctx.company.region}, CNPJ ${ctx.company.cnpj}) é liderada por Rafael Maldivas (Product Owner com duas certificações Oracle — IA agêntica e processos de CX). Entregamos software sob medida, produtos SaaS em produção (MiseOn, SelectSys Jobs, mercadinhosys, MySuperStore), TI gerenciada, SEO/GEO e audiovisual — sempre com contrato, nota fiscal e contato direto com quem constrói.`
      : `Maldivas Tech (${ctx.company.city}/${ctx.company.region}) is led by Rafael Maldivas (Product Owner with two Oracle certifications — Agentic AI and CX processes). We build custom software, production SaaS products (MiseOn, SelectSys Jobs, mercadinhosys, MySuperStore), managed IT, SEO/GEO, and audiovisual work — always with formal contracts and direct senior ownership.`,
    highlights: pt
      ? [
          "4 plataformas SaaS reais em produção + atendimento corporativo B2B",
          "Credenciais verificáveis: Oracle CX + Agentic AI, e iFood; credenciamento Meta Tech Provider em andamento",
          "Contratação flexível: projeto fechado, contrato mensal ou alocação sênior",
        ]
      : [
          "4 production SaaS platforms + B2B custom software delivery",
          "Verifiable credentials: Oracle CX + Agentic AI, and iFood; Meta Tech Provider accreditation in progress",
          "Flexible engagement: fixed scope, monthly retainer, or senior allocation",
        ],
    recommendedRoute: `/${input.lang}/servicos`,
    recommendedRouteLabel: pt ? "Conhecer Serviços & Contratação" : "Explore Services & Hiring",
    whatsappPrefill: pt
      ? "Olá Rafael! Vim pelo Concierge do site da Maldivas Tech e gostaria de conversar sobre um projeto."
      : "Hi Rafael! I reached out via Maldivas Tech's AI Concierge and would like to discuss a project.",
    source: "fallback",
  };
}

function buildFallbackDiagnostic(
  input: DiagnosticAgentInput,
): DiagnosticAgentResult {
  const combined = `${input.business} ${input.pain} ${input.priority ?? ""}`.toLowerCase();
  const pt = input.lang === "pt";

  if (/restaurante|cozinha|delivery|ifood|lanchonete|bar|food|cardápio|cardapio|totem/.test(combined)) {
    return {
      summary: pt
        ? `Para o cenário informado (${input.business || "operação de alimentação"}), o maior vazamento de margem ocorre quando pedidos de salão/delivery, ficha técnica e estoque operam desconectados.`
        : `For your food-service operation (${input.business || "restaurant"}), margin leakage happens when POS/delivery orders, recipes, and inventory run disconnected.`,
      recommendedSolution: pt
        ? "MiseOn SaaS Multi-tenant + Integração iFood/WhatsApp + Totem/POS Bravus Core"
        : "MiseOn Multi-tenant SaaS + iFood/WhatsApp Integration + Bravus Core Kiosk",
      architecturePillars: pt
        ? [
            "Fila unificada de pedidos (Salão + iFood + WhatsApp) sem redigitação no caixa",
            "Estoque como ledger com baixa automática por ficha técnica (PEPS) e alerta de ruptura",
            "PDV com emissão NFC-e e autoatendimento opcional em hardware Bravus Core / Gertec",
          ]
        : [
            "Unified order queue across dine-in, iFood, and WhatsApp without manual retyping",
            "Ledger-backed FIFO inventory deducted automatically by recipe sheet",
            "Fiscal POS (NFC-e) paired optionally with Bravus Core / Gertec kiosks",
          ],
      firstSprintSteps: pt
        ? [
            "Mapear os 10 pratos de maior giro e cadastrar fichas técnicas com perdas reais.",
            "Conectar a fila de pedidos ao KDS da cozinha e homologar o recebimento PIX/cartão.",
            "Ativar painel diário de CMV e ruptura de insumos antes da compra semanal.",
          ]
        : [
            "Map your top 10 menu items and register real yield/loss recipe sheets.",
            "Connect the unified order queue to kitchen display (KDS) and PIX settlement.",
            "Enable daily food-cost and stockout alerts ahead of supplier purchasing.",
          ],
      estimatedTimeline: pt ? "2 a 4 semanas para implantação assistida" : "2–4 weeks guided rollout",
      metricsToTrack: pt
        ? ["CMV real por prato (%)", "Tempo médio entre pedido e preparo", "Redução de erros de digitação"]
        : ["Real food cost per dish (%)", "Order-to-prep cycle time", "Zero manual order re-entry errors"],
      source: "fallback",
    };
  }

  if (/loja|mercado|varejo|estoque|fiscal|erp|pdv|e-commerce|marketplace|venda/.test(combined)) {
    return {
      summary: pt
        ? `Em operações comerciais (${input.business || "varejo/e-commerce"}), consolidar estoque transacional, regra fiscal e análise de giro elimina furos de caixa e compras erradas.`
        : `In retail/commerce (${input.business || "store operation"}), unifying transactional stock, fiscal compliance, and turnover analytics eliminates cash leakage.`,
      recommendedSolution: pt
        ? "Núcleo mercadinhosys ERP/BI ou Arquitetura Sob Medida PostgreSQL + Next.js"
        : "mercadinhosys ERP/BI Core or Custom PostgreSQL + Next.js System",
      architecturePillars: pt
        ? [
            "Baixa condicional de estoque com transações atômicas (zero overselling no caixa/online)",
            "Motor fiscal NFC-e/NF-e com validação prévia de NCM/CEST/CFOP e importação de XML",
            "Painel de inteligência comercial com Curva ABC, segmentação RFM e DRE automática",
          ]
        : [
            "Atomic conditional stock updates preventing overselling across channels",
            "Fiscal compliance engine with XML import and NCM/CFOP validation",
            "Commercial BI featuring ABC Curve, RFM segmentation, and live P&L",
          ],
      firstSprintSteps: pt
        ? [
            "Auditar o cadastro atual (planilhas/ERP antigo) e importar XMLs de entrada com custos reais.",
            "Implantar trava transacional de estoque e conciliação automática de recebimentos.",
            "Publicar o painel executivo de Curva ABC e alerta de ruptura para compras.",
          ]
        : [
            "Audit current spreadsheets/ERP data and ingest purchase XMLs with true unit costs.",
            "Deploy transactional stock locking and payment reconciliation.",
            "Launch ABC Curve & stockout early-warning dashboard for purchasing.",
          ],
      estimatedTimeline: pt ? "4 a 6 semanas (entrega incremental semanal)" : "4–6 weeks (weekly milestones)",
      metricsToTrack: pt
        ? ["Itens em ruptura evitados/mês", "Margem líquida por categoria", "Horas economizadas em fechamento"]
        : ["Prevented stockouts/month", "Net margin per category", "Hours saved on reconciliation"],
      source: "fallback",
    };
  }

  return {
    summary: pt
      ? `Diagnóstico para ${input.business || "sua operação"}: transformar o gargalo relatado ("${input.pain.slice(0, 120)}") exige substituir fluxos manuais e planilhas paralelas por uma arquitetura única com dados auditáveis.`
      : `Diagnostic for ${input.business || "your operation"}: solving "${input.pain.slice(0, 120)}" requires replacing parallel spreadsheets with a single auditable system and clean acquisition funnel.`,
    recommendedSolution: pt
      ? "Arquitetura Sob Medida B2B (Next.js + PostgreSQL RLS + Automações / IA)"
      : "Custom B2B Architecture (Next.js + PostgreSQL RLS + AI/Workflow Automation)",
    architecturePillars: pt
      ? [
          "Modelagem de dados em PostgreSQL com isolamento por cliente/área e trilha de auditoria",
          "Integrações via API/Webhooks idempotentes para zerar redigitação entre ferramentas",
          "Presença digital e funil de conversão B2B orientados a SEO/GEO e WhatsApp qualificado",
        ]
      : [
          "PostgreSQL data modeling with strict permission isolation and audit logs",
          "Idempotent APIs/Webhooks eliminating manual copy-paste across tools",
          "High-trust web funnel engineered for SEO/GEO and qualified lead capture",
        ],
    firstSprintSteps: pt
      ? [
          "Mapeamento de 45 min do fluxo atual para localizar onde o dado nasce e onde se perde.",
          "Protótipo navegável validado com quem opera a rotina antes de fechar o banco final.",
          "Entrega da primeira fatia em produção (MVP operacional) com monitoramento e treino da equipe.",
        ]
      : [
          "45-min workflow mapping to pinpoint where data breaks or gets retyped.",
          "Interactive screen prototype validated with real operators before locking schema.",
          "First production slice deployed with telemetry and team onboarding.",
        ],
    estimatedTimeline: pt ? "3 a 6 semanas conforme escopo validado" : "3–6 weeks based on validated scope",
    metricsToTrack: pt
      ? ["Horas semanais livres de retrabalho", "Taxa de conversão de leads qualificados", "Tempo de resposta operacional"]
      : ["Weekly hours freed from rework", "Qualified lead conversion rate", "Operational turnaround time"],
    source: "fallback",
  };
}

function buildFallbackTutor(input: TutorAgentInput): TutorAgentResult {
  const station = STATION_ROOMS[input.stationId] ?? STATION_ROOMS.terminal;
  const q = input.studentQuery.toLowerCase();
  const pt = input.lang === "pt";

  if (!pt) {
    return {
      socraticHint:
        "Before touching code or sending a payload, identify which of the 4 House Rooms owns this rule: Foundation (integer cents & schema), Walls (atomic locks & API validation), Furniture (HTML UI), or Roof (env vars & deploy).",
      roomAnalogy: station.room,
      nextChecklist: station.defaultChecklist,
      checkpointQuestion:
        "What state change must happen inside the database transaction if two requests hit this exact line at the same millisecond?",
      source: "fallback",
    };
  }

  let socraticHint = `Você está atuando em: ${station.focus} Antes de alterar a linha ou comando, pergunte-se qual falha financeira ou de segurança aconteceria em produção se um usuário ou robô repetisse essa ação duas vezes seguidas.`;

  if (/centavo|float|preço|preco|dinheiro|decimal/.test(q)) {
    socraticHint =
      "Em Python e JavaScript, números decimais binários (float) sofrem erro de precisão (ex.: 0.1 + 0.2 = 0.30000000000000004). No Alicerce da Casa Pré-Moldada, sempre guardamos dinheiro como inteiro em centavos (R$ 100,00 = 10000) e só dividimos por 100 na camada visual (Móveis).";
  } else if (/webhook|pix|hmac|assinatura|idempoten/.test(q)) {
    socraticHint =
      "Pense no Webhook PIX como a portaria de um banco: (1) primeiro valide o crachá criptográfico (X-Webhook-Signature, padrão fail-closed -> se inválido, devolva 401 e aborte); (2) depois confira a Idempotency-Key para garantir que um reenvio da rede nunca credite o saldo do lojista duas vezes.";
  } else if (/estoque|concorr|corrida|409|lock|trava/.test(q)) {
    socraticHint =
      "Se duas pessoas leem `estoque == 1` ao mesmo tempo e depois salvam `estoque = 0`, você vendeu a mesma peça duas vezes (overselling). A solução nas Paredes é fazer o UPDATE condicional dentro da transação (`WHERE estoque >= qtd`) — se 0 linhas forem afetadas, devolva HTTP 409 Conflict.";
  } else if (/git|env|gitignore|venv|terminal|pwd/.test(q)) {
    socraticHint =
      "Regra de ouro do Terminal: nunca rode `git add .` sem antes confirmar `pwd` (para não versionar sua pasta de usuário inteira) e sem proteger `.env` dentro do `.gitignore`. Segredos vazados no Git comprometem toda a operação.";
  }

  return {
    socraticHint,
    roomAnalogy: station.room,
    nextChecklist: station.defaultChecklist,
    checkpointQuestion:
      "Olhando para a sua entrada atual, qual camada (Alicerce/Banco, Parede/API ou Móvel/Tela) deveria rejeitar um dado inválido?",
    source: "fallback",
  };
}

export async function executePortfolioConcierge(
  rawInput: ConciergeAgentInput,
  ctx: MaldivasKnowledgeContext,
  caller: GeminiCaller = callGeminiJsonText,
): Promise<ConciergeAgentResult> {
  const question = sanitizeAgentText(rawInput.question, 600);
  const lang: AgentLang = rawInput.lang === "en" ? "en" : "pt";
  const contextPath = sanitizeAgentText(rawInput.contextPath ?? "/", 120);

  if (!question) {
    return buildFallbackConcierge({ question: "", lang, contextPath }, ctx);
  }

  const systemInstruction = [
    "You are the Senior Technical & Business Concierge AI of Maldivas Tech (Rafael Maldivas).",
    "Answer ONLY using verified facts from the provided Maldivas Tech Knowledge JSON. Never invent prices, clients, certifications, or metrics.",
    `Respond in ${lang === "pt" ? "Brazilian Portuguese (pt-BR)" : "English"}. Keep it sharp, executive, and helpful for B2B buyers, CTOs, or students.`,
    "Return valid JSON strictly matching schema:",
    '{"answer":"2-4 concise sentences","highlights":["3 short verifiable bullet facts"],"recommendedRoute":"/pt/produtos/miseon or /pt/produtos/atol-connect or /pt/portfolio or /pt/servicos or /pt/cursos/construa-seu-marketplace","recommendedRouteLabel":"short button label","whatsappPrefill":"short ready-to-send WhatsApp message"}',
  ].join("\n");

  const userPrompt = JSON.stringify({
    visitorPage: contextPath,
    question,
    knowledge: ctx,
  });

  const modelResp = await caller({ systemInstruction, userPrompt });
  if (modelResp) {
    const parsed = extractJsonFromModelText<Partial<ConciergeAgentResult>>(
      modelResp.text,
    );
    if (
      parsed &&
      typeof parsed.answer === "string" &&
      parsed.answer.trim().length > 15
    ) {
      return {
        answer: sanitizeAgentText(parsed.answer, 900),
        highlights: Array.isArray(parsed.highlights)
          ? parsed.highlights
              .map((h) => sanitizeAgentText(h, 180))
              .filter(Boolean)
              .slice(0, 4)
          : buildFallbackConcierge({ question, lang, contextPath }, ctx)
              .highlights,
        recommendedRoute:
          typeof parsed.recommendedRoute === "string" &&
          parsed.recommendedRoute.startsWith("/")
            ? parsed.recommendedRoute
            : `/${lang}/portfolio`,
        recommendedRouteLabel: sanitizeAgentText(
          parsed.recommendedRouteLabel ||
            (lang === "pt" ? "Explorar detalhes" : "Explore details"),
          60,
        ),
        whatsappPrefill: sanitizeAgentText(
          parsed.whatsappPrefill ||
            (lang === "pt"
              ? `Olá Rafael! Perguntei sobre "${question.slice(0, 80)}" no site da Maldivas Tech.`
              : `Hi Rafael! I asked about "${question.slice(0, 80)}" on Maldivas Tech.`),
          240,
        ),
        source: "gemini",
        model: modelResp.model,
      };
    }
  }

  return buildFallbackConcierge({ question, lang, contextPath }, ctx);
}

export async function executeDiagnosticArchitect(
  rawInput: DiagnosticAgentInput,
  ctx: MaldivasKnowledgeContext,
  caller: GeminiCaller = callGeminiJsonText,
): Promise<DiagnosticAgentResult> {
  const business = sanitizeAgentText(rawInput.business, 220);
  const pain = sanitizeAgentText(rawInput.pain, 600);
  const priority = sanitizeAgentText(rawInput.priority ?? "", 140);
  const lang: AgentLang = rawInput.lang === "en" ? "en" : "pt";

  if (!pain && !business) {
    return buildFallbackDiagnostic(
      { business: "Operação B2B", pain: "Processos manuais", lang },
    );
  }

  const systemInstruction = [
    "You are the Solutions Architect Agent of Maldivas Tech (Rafael Maldivas, Oracle Certified in CX & Agentic AI).",
    "Analyze the visitor's business scenario and bottleneck, then prescribe a realistic architecture using Maldivas Tech capabilities (MiseOn, Bravus Core/Gertec, SelectSys Jobs, mercadinhosys, MySuperStore, or Custom Next.js/PostgreSQL/AI Automation).",
    `Respond in ${lang === "pt" ? "Brazilian Portuguese (pt-BR)" : "English"}. Never invent unrealistic ROI numbers.`,
    "Return valid JSON strictly matching schema:",
    '{"summary":"2 concise sentences","recommendedSolution":"short architecture/product title","architecturePillars":["3 items"],"firstSprintSteps":["3 actionable sprint-1 steps"],"estimatedTimeline":"realistic range e.g. 2-4 semanas","metricsToTrack":["3 concrete KPIs"]}',
  ].join("\n");

  const userPrompt = JSON.stringify({
    business,
    pain,
    priority,
    catalog: {
      products: ctx.products.map((p) => ({ name: p.name, role: p.role, stack: p.stack })),
      services: ctx.services.map((s) => ({ name: s.name, summary: s.summary })),
    },
  });

  const modelResp = await caller({ systemInstruction, userPrompt });
  if (modelResp) {
    const parsed = extractJsonFromModelText<Partial<DiagnosticAgentResult>>(
      modelResp.text,
    );
    if (
      parsed &&
      typeof parsed.summary === "string" &&
      typeof parsed.recommendedSolution === "string" &&
      Array.isArray(parsed.firstSprintSteps) &&
      parsed.firstSprintSteps.length >= 2
    ) {
      return {
        summary: sanitizeAgentText(parsed.summary, 500),
        recommendedSolution: sanitizeAgentText(parsed.recommendedSolution, 160),
        architecturePillars: Array.isArray(parsed.architecturePillars)
          ? parsed.architecturePillars
              .map((x) => sanitizeAgentText(x, 180))
              .filter(Boolean)
              .slice(0, 4)
          : [],
        firstSprintSteps: parsed.firstSprintSteps
          .map((x) => sanitizeAgentText(x, 180))
          .filter(Boolean)
          .slice(0, 4),
        estimatedTimeline: sanitizeAgentText(
          parsed.estimatedTimeline ||
            (lang === "pt" ? "2 a 6 semanas" : "2–6 weeks"),
          80,
        ),
        metricsToTrack: Array.isArray(parsed.metricsToTrack)
          ? parsed.metricsToTrack
              .map((x) => sanitizeAgentText(x, 120))
              .filter(Boolean)
              .slice(0, 4)
          : [],
        source: "gemini",
        model: modelResp.model,
      };
    }
  }

  return buildFallbackDiagnostic({ business, pain, priority, lang });
}

export async function executeCourseTutor(
  rawInput: TutorAgentInput,
  caller: GeminiCaller = callGeminiJsonText,
): Promise<TutorAgentResult> {
  const stationId = sanitizeAgentText(rawInput.stationId || "terminal", 40);
  const lessonSlug = sanitizeAgentText(
    rawInput.lessonSlug || "modulo-0-f01-o-mapa",
    100,
  );
  const studentQuery = sanitizeAgentText(rawInput.studentQuery, 600);
  const codeOrPayload = sanitizeAgentText(rawInput.codeOrPayload ?? "", 1200);
  const lang: AgentLang = rawInput.lang === "en" ? "en" : "pt";

  const fallback = buildFallbackTutor({
    stationId,
    lessonSlug,
    studentQuery,
    codeOrPayload,
    lang,
  });

  if (!studentQuery) {
    return fallback;
  }

  const stationMeta = STATION_ROOMS[stationId] ?? STATION_ROOMS.terminal;

  const systemInstruction = [
    "You are the Socratic Engineering Tutor inside the Maldivas Tech Practice Arena.",
    "Pedagogical rule: NEVER give away the full final answer or full solved code block. Guide the student step-by-step using the '4 Cômodos da Casa Pré-Moldada' metaphor (1. Alicerce/Centavos/Banco, 2. Paredes/API/Estoque/Webhook, 3. Móveis/Vitrine HTML, 4. Telhado/Deploy/Testes).",
    `Respond in ${lang === "pt" ? "Brazilian Portuguese (pt-BR)" : "English"}.`,
    "Return valid JSON strictly matching schema:",
    '{"socraticHint":"2-4 clear sentences guiding the reasoning","roomAnalogy":"which room/concept applies","nextChecklist":["3 short verification checks"],"checkpointQuestion":"1 thought-provoking question for the student"}',
  ].join("\n");

  const userPrompt = JSON.stringify({
    stationId,
    stationRoom: stationMeta.room,
    stationFocus: stationMeta.focus,
    lessonSlug,
    studentQuery,
    codeOrPayload: codeOrPayload || undefined,
  });

  const modelResp = await caller({ systemInstruction, userPrompt });
  if (modelResp) {
    const parsed = extractJsonFromModelText<Partial<TutorAgentResult>>(
      modelResp.text,
    );
    if (
      parsed &&
      typeof parsed.socraticHint === "string" &&
      parsed.socraticHint.trim().length > 15
    ) {
      return {
        socraticHint: sanitizeAgentText(parsed.socraticHint, 800),
        roomAnalogy: sanitizeAgentText(
          parsed.roomAnalogy || stationMeta.room,
          140,
        ),
        nextChecklist: Array.isArray(parsed.nextChecklist)
          ? parsed.nextChecklist
              .map((x) => sanitizeAgentText(x, 180))
              .filter(Boolean)
              .slice(0, 4)
          : fallback.nextChecklist,
        checkpointQuestion: sanitizeAgentText(
          parsed.checkpointQuestion || fallback.checkpointQuestion,
          220,
        ),
        source: "gemini",
        model: modelResp.model,
      };
    }
  }

  return fallback;
}

