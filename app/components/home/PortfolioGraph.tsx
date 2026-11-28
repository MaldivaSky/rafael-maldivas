"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  FileCheck2,
  Globe2,
  MessageSquare,
  Pause,
  Play,
  QrCode,
  Receipt,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import { useLang } from "../../lib/i18n";

/* ------------------------------------------------------------------ *
 *  FRENTE 3: Sistema Solar Tecnológico Interativo de Integrações Reais
 *
 *  Arquitetura Orbital Interativa:
 *  - Núcleo (Sol): Ecossistema Maldivas Tech (PostgreSQL Multi-Tenant + RLS)
 *    com seletor de foco por produto (MiseOn, MercadinhoSys, Atol Connect,
 *    SelectSys Jobs, MySuperStore ou Visão Global).
 *  - 3 Órbitas Concêntricas com 15 Planetas (APIs Reais em Produção):
 *    * Órbita 1 (Interna): Core, Cloud, Banco & Observabilidade
 *    * Órbita 2 (Média): Fiscal, Pagamentos & Enriquecimento (BigDataCorp, SEFAZ, Efí, PagBank)
 *    * Órbita 3 (Externa): Operação Setorial, Mensageria & Internacional (USDA Nutrition, iFood, Meta, Garoon, etc.)
 *  - Interatividade:
 *    * Hover em qualquer planeta ou órbita pausa suavemente aquela órbita e destaca conexões.
 *    * Clique em qualquer API atualiza/abre o Painel Explicativo de Produção (Drawer/Card)
 *      com Categoria, Produtos que utilizam, Regra de Negócio + Fluxo Técnico e Status.
 * ------------------------------------------------------------------ */

export type GraphProduct = { id: string; label: string; sub: string; href: string };
export type GraphIntegration = { id: string; label: string };
export type GraphEdge = [productId: string, integrationId: string];

type Bi = { pt: string; en: string };

export interface SolarProductSpec {
  id: string;
  name: string;
  tagline: Bi;
  color: string;
  href: string;
  liveUrl?: string;
}

export interface SolarApiPlanet {
  id: string;
  name: string;
  shortName: string;
  orbit: 1 | 2 | 3;
  angleDeg: number;
  color: string;
  bgTint: string;
  category: Bi;
  products: string[];
  statusBadge: Bi;
  businessRule: Bi;
  technicalFlow: Bi;
  metricsPill: Bi;
  iconKey:
    | "bigdatacorp"
    | "usda"
    | "sefaz"
    | "ifood"
    | "efi"
    | "whatsapp"
    | "metasdk"
    | "pagbank"
    | "garoon"
    | "ocr"
    | "melhorenvio"
    | "supabase"
    | "mia"
    | "gemini"
    | "deepseek"
    | "groq"
    | "edge"
    | "sentry";
}

const SOLAR_PRODUCTS: SolarProductSpec[] = [
  {
    id: "miseon",
    name: "MiseOn",
    tagline: {
      pt: "ERP & KDS Gastronômico · Ficha Técnica & Delivery",
      en: "Restaurant ERP & KDS · Recipe Costing & Delivery",
    },
    color: "#10B981",
    href: "#produto-miseon",
    liveUrl: "https://miseon.com.br",
  },
  {
    id: "mercadinhosys",
    name: "MercadinhoSys",
    tagline: {
      pt: "ERP Varejista Multi-Loja · PDV Fiscal & BI M-IA",
      en: "Multi-Store Retail ERP · Fiscal POS & M-IA BI",
    },
    color: "#0EA5E9",
    href: "#produto-mercadinhosys",
    liveUrl: "https://mercadinhosys.maldivastech.com",
  },
  {
    id: "atol",
    name: "Atol Connect",
    tagline: {
      pt: "Plataforma Oficial WhatsApp Cloud API · Meta Tech Provider",
      en: "Official WhatsApp Cloud API Platform · Meta Tech Provider",
    },
    color: "#22C55E",
    href: "#produto-atol",
    liveUrl: "https://atolconnect.maldivastech.com",
  },
  {
    id: "selectsys",
    name: "SelectSys Jobs",
    tagline: {
      pt: "ATS Brasil–Japão · Recrutamento Internacional & OCR",
      en: "Brazil–Japan ATS · International Recruiting & OCR",
    },
    color: "#F59E0B",
    href: "#produto-selectsys",
    liveUrl: "https://selectsys.maldivastech.com",
  },
  {
    id: "mysuperstore",
    name: "MySuperStore",
    tagline: {
      pt: "E-commerce Multi-Lojista · Split PIX em Centavos",
      en: "Multi-Merchant E-commerce · PIX Split in Integer Cents",
    },
    color: "#0284C7",
    href: "#produto-mysuperstore",
    liveUrl: "https://mysuperstore-lime.vercel.app",
  },
];

const SOLAR_PLANETS: SolarApiPlanet[] = [
  /* ==================== ÓRBITA 1 (INTERNA — CORE, DADOS & IA) ==================== */
  {
    id: "supabase",
    name: "Supabase · PostgreSQL + RLS",
    shortName: "Supabase RLS",
    orbit: 1,
    angleDeg: 10,
    color: "#10B981",
    bgTint: "rgba(16, 185, 129, 0.14)",
    category: { pt: "Banco Multi-Tenant & Segurança", en: "Multi-Tenant DB & Security" },
    products: ["miseon", "atol", "selectsys", "mercadinhosys", "mysuperstore"],
    statusBadge: {
      pt: "Em produção · Core Multi-Tenant Oficial",
      en: "In production · Official Multi-Tenant Core",
    },
    businessRule: {
      pt: "Isola 100% dos dados financeiros, fiscais e cadastrais de cada empresa na própria linha do banco (Row-Level Security), impedindo vazamento cruzado entre clientes SaaS.",
      en: "Isolates 100% of financial, fiscal, and customer records per tenant at the database row level (RLS), preventing cross-tenant data leaks.",
    },
    technicalFlow: {
      pt: "Políticas RLS vinculadas ao JWT/tenant_id no PostgreSQL 16 + criptografia AES-256-GCM para credenciais sensíveis e trilha de auditoria imutável compatível com LGPD.",
      en: "RLS policies bound to JWT/tenant_id on PostgreSQL 16 + AES-256-GCM encryption for sensitive tokens and immutable LGPD audit trails.",
    },
    metricsPill: { pt: "Isolamento RLS · AES-256-GCM", en: "RLS Isolation · AES-256-GCM" },
    iconKey: "supabase",
  },
  {
    id: "gemini",
    name: "Google Gemini API · Multimodal & Agentes",
    shortName: "Google Gemini API",
    orbit: 1,
    angleDeg: 62,
    color: "#0284C7",
    bgTint: "rgba(2, 132, 199, 0.14)",
    category: { pt: "IA Generativa Multimodal & Agentes", en: "Multimodal GenAI & Agents" },
    products: ["mercadinhosys", "miseon", "atol", "mysuperstore"],
    statusBadge: {
      pt: "Em produção · API Oficial Google AI",
      en: "In production · Official Google AI API",
    },
    businessRule: {
      pt: "Alimenta o Concierge do portfólio, o Tutor Socrático da Academy, o diagnóstico arquitetural sob medida e análises multimodais no ecossistema Maldivas Tech.",
      en: "Powers the portfolio Concierge, the Academy Socratic Tutor, custom architectural diagnostics, and multimodal analysis across the Maldivas Tech ecosystem.",
    },
    technicalFlow: {
      pt: "Chamadas REST estruturadas em JSON (Gemini Flash / Pro) com validação rigorosa de schema, rate limiting por IP, sanitização de prompt e fallback determinístico.",
      en: "Structured JSON REST calls (Gemini Flash / Pro) with strict schema validation, per-IP rate limiting, prompt sanitization, and deterministic fallback.",
    },
    metricsPill: { pt: "JSON Estruturado · Agentes IA", en: "Structured JSON · AI Agents" },
    iconKey: "gemini",
  },
  {
    id: "deepseek",
    name: "DeepSeek AI · Tradução PT/JP/EN & Análise",
    shortName: "DeepSeek AI",
    orbit: 1,
    angleDeg: 114,
    color: "#0EA5E9",
    bgTint: "rgba(14, 165, 233, 0.14)",
    category: { pt: "LLM de Raciocínio & Tradução Técnica", en: "Reasoning LLM & Technical Translation" },
    products: ["selectsys", "mercadinhosys"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "No SelectSys Jobs, traduz currículos e pareceres técnicos entre Português, Japonês e Inglês com precisão de termos industriais; no MercadinhoSys, gera análises de margem com altíssima eficiência de custo por token.",
      en: "In SelectSys Jobs, translates resumes and recruiter notes across Portuguese, Japanese, and English with industrial terminology; in MercadinhoSys, generates margin insights with top token cost-efficiency.",
    },
    technicalFlow: {
      pt: "Orquestração via cliente compatível OpenAI/DeepSeek com prompts versionados, extração estruturada pós-OCR (Tesseract) e cache semântico para reduzir latência e custo.",
      en: "Orchestrated via OpenAI-compatible DeepSeek client with versioned prompts, post-OCR structured extraction (Tesseract), and semantic caching.",
    },
    metricsPill: { pt: "Tradução PT/JP/EN · Baixo Custo/Token", en: "PT/JP/EN Translation · Low Cost/Token" },
    iconKey: "deepseek",
  },
  {
    id: "groq",
    name: "Groq LPU · Inferência Ultrarrápida Real-Time",
    shortName: "Groq LPU API",
    orbit: 1,
    angleDeg: 166,
    color: "#F97316",
    bgTint: "rgba(249, 115, 22, 0.14)",
    category: { pt: "Inferência IA de Baixa Latência (LPU)", en: "Ultra-Low Latency AI Inference (LPU)" },
    products: ["atol", "miseon", "mercadinhosys"],
    statusBadge: {
      pt: "Em produção · Inferência Real-Time",
      en: "In production · Real-Time Inference",
    },
    businessRule: {
      pt: "Viabiliza respostas de IA em frações de segundo para triagem de atendimento no WhatsApp (Atol Connect), comandos rápidos de operação e classificação instantânea de intenções sem travar o operador.",
      en: "Delivers sub-second AI inference for WhatsApp triage (Atol Connect), fast operational commands, and instant intent classification without stalling operators.",
    },
    technicalFlow: {
      pt: "Execução em hardware Groq LPU (Llama / Mixtral) via streaming HTTP com TTFT (Time-to-First-Token) sub-250ms e roteamento automático de failover junto ao Gemini/DeepSeek.",
      en: "Runs on Groq LPU hardware (Llama / Mixtral) over streaming HTTP with sub-250ms TTFT and automated failover routing alongside Gemini/DeepSeek.",
    },
    metricsPill: { pt: "TTFT < 250ms · Streaming LPU", en: "TTFT < 250ms · LPU Streaming" },
    iconKey: "groq",
  },
  {
    id: "mia",
    name: "Consultor M-IA · Pandas & Plotly BI",
    shortName: "M-IA · Plotly BI",
    orbit: 1,
    angleDeg: 218,
    color: "#F59E0B",
    bgTint: "rgba(245, 158, 11, 0.14)",
    category: { pt: "Inteligência Comercial & Analytics", en: "Commercial Intelligence & Analytics" },
    products: ["mercadinhosys", "selectsys", "mysuperstore"],
    statusBadge: {
      pt: "Em produção · Motor Analítico Oficial",
      en: "In production · Official Analytics Engine",
    },
    businessRule: {
      pt: "Transforma vendas de PDV, estoque e currículos em diagnósticos acionáveis: calcula Curva ABC de Pareto, matriz RFM de clientes, DRE automático e recomendação contextual em linguagem natural.",
      en: "Turns POS sales, inventory, and resumes into actionable diagnostics: computes Pareto ABC curves, RFM customer matrices, automated P&L, and natural-language insights.",
    },
    technicalFlow: {
      pt: "Pipeline Python (Pandas + Plotly) agrega séries temporais do banco transacional e injeta contexto estruturado em LLMs (Gemini / DeepSeek / Groq) com guardrails contra alucinação numérica.",
      en: "Python pipeline (Pandas + Plotly) aggregates transactional time-series and injects structured context into LLMs (Gemini / DeepSeek / Groq) with strict numeric guardrails.",
    },
    metricsPill: { pt: "Curva ABC · Matriz RFM · DRE", en: "ABC Curve · RFM Matrix · P&L" },
    iconKey: "mia",
  },
  {
    id: "edge",
    name: "Vercel & Cloudflare Edge Network",
    shortName: "Vercel + Cloudflare",
    orbit: 1,
    angleDeg: 270,
    color: "#06B6D4",
    bgTint: "rgba(6, 182, 212, 0.14)",
    category: { pt: "Infraestrutura Cloud & WAF", en: "Cloud Infrastructure & WAF" },
    products: ["miseon", "mercadinhosys", "atol", "selectsys", "mysuperstore"],
    statusBadge: {
      pt: "Em produção · Infraestrutura Oficial",
      en: "In production · Official Infrastructure",
    },
    businessRule: {
      pt: "Garante alta disponibilidade para operações críticas que não podem parar (restaurantes em horário de pico e caixas de supermercado), com proteção DDoS e SSL gerenciado.",
      en: "Ensures high availability for mission-critical operations (peak-hour restaurants and supermarket checkouts) with DDoS protection and managed TLS.",
    },
    technicalFlow: {
      pt: "Roteamento DNS anycast e WAF na Cloudflare combinados com Edge Middleware e Serverless Functions na Vercel em São Paulo (gru1) para latência sub-50ms.",
      en: "Anycast DNS routing and Cloudflare WAF paired with Edge Middleware and Vercel Serverless Functions in São Paulo (gru1) for sub-50ms latency.",
    },
    metricsPill: { pt: "Edge gru1 · WAF · TLS 1.3", en: "Edge gru1 · WAF · TLS 1.3" },
    iconKey: "edge",
  },
  {
    id: "sentry",
    name: "Sentry · Telemetria & Observabilidade",
    shortName: "Sentry Telemetry",
    orbit: 1,
    angleDeg: 322,
    color: "#F43F5E",
    bgTint: "rgba(244, 63, 94, 0.14)",
    category: { pt: "Observabilidade & APM em Produção", en: "Production Observability & APM" },
    products: ["mercadinhosys", "miseon", "atol"],
    statusBadge: {
      pt: "Em produção · Telemetria Oficial",
      en: "In production · Official Telemetry",
    },
    businessRule: {
      pt: "Detecta gargalos de banco, falhas de emissão fiscal ou timeouts de webhook antes que o operador do caixa ou o gerente da loja percebam qualquer lentidão.",
      en: "Detects database bottlenecks, tax emission errors, or webhook timeouts before the cashier or store manager notices any slowdown.",
    },
    technicalFlow: {
      pt: "Tracing distribuído no backend Flask/FastAPI/Next.js com captura de stacktrace sanitizado (sem dados pessoais LGPD), breadcrumbs de sessão e alertas em tempo real.",
      en: "Distributed tracing across Flask/FastAPI/Next.js with LGPD-sanitized stacktraces, session breadcrumbs, and real-time engineering alerts.",
    },
    metricsPill: { pt: "APM Tracing · Alertas Real-Time", en: "APM Tracing · Real-Time Alerts" },
    iconKey: "sentry",
  },

  /* ==================== ÓRBITA 2 (MÉDIA — DADOS, FISCAL & PAGAMENTOS) ==================== */
  {
    id: "bigdatacorp",
    name: "BigDataCorp · Enriquecimento & Validação",
    shortName: "BigDataCorp API",
    orbit: 2,
    angleDeg: 10,
    color: "#06B6D4",
    bgTint: "rgba(6, 182, 212, 0.14)",
    category: {
      pt: "Enriquecimento de Dados & Compliance",
      en: "Data Enrichment & Compliance",
    },
    products: ["mercadinhosys"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "No MercadinhoSys, automatiza o cadastro e a validação de fornecedores, clientes B2B e catálogo: consulta situação cadastral, regime tributário e consistência fiscal na hora, evitando rejeição de nota na SEFAZ.",
      en: "In MercadinhoSys, automates onboarding and validation of suppliers, B2B buyers, and catalog data: verifies tax registration status and fiscal consistency immediately, preventing SEFAZ invoice rejections.",
    },
    technicalFlow: {
      pt: "Consulta REST autenticada aos endpoints da BigDataCorp a partir do documento (CNPJ/CPF/EAN), aplicando cache inteligente, normalização de endereço/CNAE e validação pré-emissão fiscal.",
      en: "Authenticated REST lookup to BigDataCorp endpoints by tax ID (CNPJ/CPF/EAN) with smart caching, address/CNAE normalization, and pre-invoice fiscal validation.",
    },
    metricsPill: { pt: "Cadastro B2B · Sanitização Fiscal", en: "B2B Onboarding · Fiscal Cleansing" },
    iconKey: "bigdatacorp",
  },
  {
    id: "usda",
    name: "USDA FoodData Central · API Nutricional (EUA)",
    shortName: "USDA Nutrition API",
    orbit: 2,
    angleDeg: 82,
    color: "#16A34A",
    bgTint: "rgba(22, 163, 74, 0.14)",
    category: {
      pt: "Dados Nutricionais & Engenharia de Cardápio",
      en: "Nutritional Data & Menu Engineering",
    },
    products: ["miseon"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "No MiseOn, alimenta a Ficha Técnica inteligente: ao cadastrar insumos e receitas em gramas, calcula automaticamente calorias (kcal), macronutrientes (proteínas, carboidratos, gorduras), micronutrientes e alergênicos por porção servida.",
      en: "In MiseOn, powers smart Recipe Cards: as ingredients are entered in grams, automatically computes calories (kcal), macronutrients (protein, carbs, fat), micronutrients, and allergens per served portion.",
    },
    technicalFlow: {
      pt: "Integração com a base oficial norte-americana USDA FoodData Central (combinada com fatores de conversão culinária e rendimento líquido) para gerar a tabela nutricional exata do prato em tempo real.",
      en: "Integrates with the official US Department of Agriculture (USDA FoodData Central) REST API with culinary yield factors to generate accurate per-portion nutrition facts in real time.",
    },
    metricsPill: { pt: "Macros por Porção · Tabela Nutricional", en: "Per-Portion Macros · Nutrition Facts" },
    iconKey: "usda",
  },
  {
    id: "sefaz",
    name: "Focus NFe · SEFAZ (NFC-e & NF-e)",
    shortName: "Focus NFe · SEFAZ",
    orbit: 2,
    angleDeg: 154,
    color: "#F97316",
    bgTint: "rgba(249, 115, 22, 0.14)",
    category: { pt: "Motor Fiscal & Tributário", en: "Fiscal & Tax Engine" },
    products: ["mercadinhosys", "miseon"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Emite cupom fiscal eletrônico (NFC-e) em segundos no fechamento do caixa ou pedido e importa XML de notas de compra (NF-e) da SEFAZ alimentando estoque e custo médio sem digitação manual.",
      en: "Issues electronic retail tax receipts (NFC-e) in seconds at checkout and ingests supplier NF-e XMLs from SEFAZ to update stock and weighted cost with zero manual typing.",
    },
    technicalFlow: {
      pt: "Validação de NCM/CFOP/ICMS/PIS/COFINS, assinatura com certificado digital A1, transmissão assíncrona via Focus NFe / webservices SEFAZ com contingência offline e DANFE instantâneo.",
      en: "Validates NCM/CFOP/ICMS tax rules, signs with A1 digital certificate, and transmits via Focus NFe / SEFAZ webservices with offline contingency and instant DANFE printing.",
    },
    metricsPill: { pt: "NFC-e Instantânea · Ingestão XML", en: "Instant NFC-e · XML Ingestion" },
    iconKey: "sefaz",
  },
  {
    id: "efi",
    name: "Efí Bank · PIX Dinâmico & Split",
    shortName: "Efí Bank · PIX Split",
    orbit: 2,
    angleDeg: 226,
    color: "#EA580C",
    bgTint: "rgba(234, 88, 12, 0.14)",
    category: { pt: "Pagamentos Instantâneos & Split", en: "Instant Payments & Split" },
    products: ["miseon", "mysuperstore"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Gera QR Code PIX dinâmico com conciliação imediata: assim que o cliente paga, o pedido avança sozinho na tela da cozinha (MiseOn) ou divide automaticamente a comissão da plataforma e o repasse de cada lojista (MySuperStore).",
      en: "Generates dynamic PIX QR Codes with instant reconciliation: upon payment, orders auto-advance on the kitchen screen (MiseOn) or split platform fees and merchant payouts in integer cents (MySuperStore).",
    },
    technicalFlow: {
      pt: "API Pix Banco Central via Efí com certificado mTLS, validação criptográfica HMAC, chave de idempotência anti-pagamento duplo e aritmética estrita em centavos inteiros (lei da conservação).",
      en: "Central Bank PIX API via Efí with mTLS certificate, HMAC signature verification, idempotency locks against double-crediting, and strict integer-cent split arithmetic.",
    },
    metricsPill: { pt: "mTLS · Webhook Idempotente · Split", en: "mTLS · Idempotent Webhook · Split" },
    iconKey: "efi",
  },
  {
    id: "pagbank",
    name: "PagBank · Billing & Assinaturas SaaS",
    shortName: "PagBank Billing",
    orbit: 2,
    angleDeg: 298,
    color: "#22C55E",
    bgTint: "rgba(34, 197, 94, 0.14)",
    category: { pt: "Faturamento Recorrente em BRL", en: "Recurring SaaS Billing in BRL" },
    products: ["atol"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Permite que empresas brasileiras assinem o Atol Connect em Reais (R$) com preço fixo previsível, sem cartão internacional e sem variação cambial em dólar no fim do mês.",
      en: "Allows Brazilian businesses to subscribe to Atol Connect in local currency (BRL) with predictable flat pricing, avoiding international credit cards and USD exchange volatility.",
    },
    technicalFlow: {
      pt: "Checkout transparente e gestão de ciclo de vida de assinaturas via webhooks autenticados do PagBank, provisionando cotas de atendimento e números WhatsApp automaticamente.",
      en: "Transparent checkout and subscription lifecycle management via authenticated PagBank webhooks, auto-provisioning agent seats and WhatsApp numbers.",
    },
    metricsPill: { pt: "Recorrência BRL · Provisionamento Auto", en: "BRL Recurring · Auto-Provisioning" },
    iconKey: "pagbank",
  },

  /* ==================== ÓRBITA 3 (EXTERNA — OPERAÇÃO, MENSAGERIA & GLOBAL) ==================== */
  {
    id: "ifood",
    name: "iFood Orders API · Homologação Oficial",
    shortName: "iFood Orders API",
    orbit: 3,
    angleDeg: 0,
    color: "#EA1D2C",
    bgTint: "rgba(234, 29, 44, 0.14)",
    category: { pt: "Delivery & Operação Gastronômica", en: "Delivery & Kitchen Operations" },
    products: ["miseon"],
    statusBadge: {
      pt: "Em produção · Homologada iFood",
      en: "In production · iFood Approved",
    },
    businessRule: {
      pt: "Elimina a redigitação de comandas no restaurante: pedidos do iFood entram direto na fila da cozinha (KDS), sincronizam status de preparo/despacho com o app do cliente e baixam cada ingrediente do estoque por PEPS (FIFO).",
      en: "Eliminates manual ticket re-entry: iFood orders drop straight into the kitchen display (KDS), sync prep/dispatch status back to the customer app, and deduct ingredients via FIFO.",
    },
    technicalFlow: {
      pt: "OAuth2 token refresh automático, consumo de eventos de ciclo de vida do pedido (PLACED, CONFIRMED, DISPATCHED, CONCLUDED) com confirmação idempotente e trava transacional de insumos.",
      en: "Automated OAuth2 token refresh, order lifecycle event ingestion (PLACED, CONFIRMED, DISPATCHED, CONCLUDED) with idempotent acknowledgment and transactional inventory deduction.",
    },
    metricsPill: { pt: "KDS Direto · Baixa PEPS/FIFO", en: "Direct to KDS · FIFO Stock Deduction" },
    iconKey: "ifood",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Cloud API (Meta Oficial)",
    shortName: "WhatsApp Cloud API",
    orbit: 3,
    angleDeg: 60,
    color: "#25D366",
    bgTint: "rgba(37, 211, 102, 0.14)",
    category: { pt: "Mensageria Oficial & Omnichannel", en: "Official Messaging & Omnichannel" },
    products: ["atol", "miseon"],
    statusBadge: {
      pt: "Em produção · Meta Tech Provider",
      en: "In production · Meta Tech Provider",
    },
    businessRule: {
      pt: "Conecta múltiplos atendentes no mesmo número oficial da empresa (Atol Connect) e automatiza cardápio digital e avisos de entrega (MiseOn) sem gambiarras de QR Code que derrubam ou banem o número.",
      en: "Connects multiple agents to a single official business number (Atol Connect) and automates digital menus and delivery alerts (MiseOn) without fragile QR-code emulation or ban risks.",
    },
    technicalFlow: {
      pt: "Comunicação direta com a Graph API v21.0 da Meta usando System User Access Tokens criptografados, templates HSM aprovados, mídia assíncrona e fila de atendimento multi-agente em tempo real.",
      en: "Direct integration with Meta Graph API v21.0 using encrypted System User tokens, approved HSM templates, async media handling, and real-time multi-agent routing.",
    },
    metricsPill: { pt: "Zero QR Code · Multi-Atendente", en: "Zero QR Code · Multi-Agent Inbox" },
    iconKey: "whatsapp",
  },
  {
    id: "metasdk",
    name: "Meta Embedded Signup & Webhooks HMAC",
    shortName: "Meta Embedded Signup",
    orbit: 3,
    angleDeg: 120,
    color: "#0284C7",
    bgTint: "rgba(2, 132, 199, 0.14)",
    category: { pt: "Onboarding Oficial & Coexistência", en: "Official Onboarding & Coexistence" },
    products: ["atol"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Permite que o cliente conecte sua conta WhatsApp Business em menos de 3 minutos direto pelo fluxo oficial do Facebook, mantendo a coexistência com o aplicativo WhatsApp Business no celular.",
      en: "Lets businesses connect their WhatsApp Business account in under 3 minutes via Facebook's official popup flow while keeping coexistence with the mobile WhatsApp Business app.",
    },
    technicalFlow: {
      pt: "Fluxo OAuth Embedded Signup da Meta para captura automática de WABA ID e Phone Number ID, aliado a receptor de Webhooks validado por assinatura HMAC SHA-256 (`X-Hub-Signature-256`).",
      en: "Meta Embedded Signup OAuth flow for automated WABA ID and Phone Number ID provisioning, paired with an HMAC SHA-256 (`X-Hub-Signature-256`) verified webhook receiver.",
    },
    metricsPill: { pt: "Coexistência Mobile · HMAC SHA-256", en: "Mobile Coexistence · HMAC SHA-256" },
    iconKey: "metasdk",
  },
  {
    id: "bravus",
    name: "Bravus Core · Totens & Smart POS Gertec",
    shortName: "Bravus · Gertec POS",
    orbit: 3,
    angleDeg: 180,
    color: "#027EF6",
    bgTint: "rgba(2, 126, 246, 0.14)",
    category: { pt: "Hardware Comercial & Autoatendimento", en: "Commercial Hardware & Self-Service" },
    products: ["miseon"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Integra totens de autoatendimento e maquininhas Smart POS Gertec direto na operação do restaurante: o cliente escolhe o prato, paga na maquininha e a comanda já imprime e aparece na tela da cozinha.",
      en: "Connects self-service kiosks and Gertec Smart POS terminals straight to restaurant operations: guests order, tap to pay, and the ticket immediately prints and appears on the KDS.",
    },
    technicalFlow: {
      pt: "Sincronização bidirecional de catálogo, disponibilidade de itens e callback de pagamento TEF/PIX entre o hardware físico (Bravus/Gertec) e o motor de pedidos do MiseOn.",
      en: "Bidirectional catalog sync, item availability, and EFT/PIX payment callbacks between physical terminals (Bravus/Gertec) and the MiseOn order engine.",
    },
    metricsPill: { pt: "Totens + Smart POS · KDS Sync", en: "Kiosks + Smart POS · KDS Sync" },
    iconKey: "bravus" as never,
  },
  {
    id: "garoon",
    name: "Cybozu Garoon & Tesseract OCR · Japão",
    shortName: "Cybozu Garoon + OCR",
    orbit: 3,
    angleDeg: 240,
    color: "#DC2626",
    bgTint: "rgba(220, 38, 38, 0.14)",
    category: { pt: "Integração Internacional Brasil–Japão", en: "Brazil–Japan Enterprise Integration" },
    products: ["selectsys"],
    statusBadge: {
      pt: "Em produção · Operação Fujiarte",
      en: "In production · Fujiarte Operation",
    },
    businessRule: {
      pt: "No SelectSys Jobs, lê documentos brasileiros e japoneses (RG, passaporte, visto, Zairyu Card) por OCR, traduz currículos automaticamente (PT/JP/EN) e sincroniza agendas e relatórios com o groupware japonês Cybozu Garoon.",
      en: "In SelectSys Jobs, extracts data from Brazilian and Japanese IDs (passports, visas, Zairyu Card) via OCR, auto-translates resumes (PT/JP/EN), and syncs schedules with Japan's Cybozu Garoon.",
    },
    technicalFlow: {
      pt: "Motor Tesseract OCR + DeepSeek AI para extração estruturada de documentos, geração de dossiês de visto em ExcelJS no padrão da imigração japonesa e integração com Cybozu Garoon.",
      en: "Tesseract OCR + DeepSeek AI for structured document extraction, ExcelJS visa dossier generation matching Japanese immigration templates, and Cybozu Garoon sync.",
    },
    metricsPill: { pt: "OCR Passaporte/Visto · PT/JP/EN", en: "Passport/Visa OCR · PT/JP/EN" },
    iconKey: "garoon",
  },
  {
    id: "melhorenvio",
    name: "Melhor Envio · Cotação Multi-Lojista Live",
    shortName: "Melhor Envio API",
    orbit: 3,
    angleDeg: 300,
    color: "#0D9488",
    bgTint: "rgba(13, 148, 136, 0.14)",
    category: { pt: "Logística & Frete E-commerce", en: "E-commerce Logistics & Shipping" },
    products: ["mysuperstore"],
    statusBadge: {
      pt: "Em produção · Integração Oficial",
      en: "In production · Official Integration",
    },
    businessRule: {
      pt: "Calcula no servidor o frete real (Correios, Jadlog, etc.) separado por pacote de cada lojista (`SubOrder`) a partir do CEP de origem e dimensões cúbicas das peças antes de gerar o PIX.",
      en: "Calculates real-time carrier rates (Correios, Jadlog) server-side per merchant package (`SubOrder`) using each seller's origin ZIP code and parcel dimensions before generating the PIX.",
    },
    technicalFlow: {
      pt: "Consulta server-side autenticada à API do Melhor Envio agrupando itens por `store_id`, somando frete em centavos inteiros no `SubOrder` para que o cliente nunca manipule o valor no front-end.",
      en: "Server-side authenticated lookup to Melhor Envio API grouping cart items by `store_id` and locking shipping fees in integer cents on each `SubOrder`.",
    },
    metricsPill: { pt: "Frete por SubOrder · Server-Side", en: "Per-SubOrder Shipping · Server-Side" },
    iconKey: "melhorenvio",
  },
];

function PlanetIcon({ iconKey }: { iconKey: SolarApiPlanet["iconKey"] | string }) {
  switch (iconKey) {
    case "bigdatacorp":
      return <SearchCheck size={16} aria-hidden="true" />;
    case "usda":
      return <Utensils size={16} aria-hidden="true" />;
    case "sefaz":
      return <Receipt size={16} aria-hidden="true" />;
    case "ifood":
      return <Utensils size={16} aria-hidden="true" />;
    case "efi":
      return <QrCode size={16} aria-hidden="true" />;
    case "whatsapp":
      return <MessageSquare size={16} aria-hidden="true" />;
    case "metasdk":
      return <ShieldCheck size={16} aria-hidden="true" />;
    case "pagbank":
      return <Wallet size={16} aria-hidden="true" />;
    case "garoon":
    case "ocr":
      return <Globe2 size={16} aria-hidden="true" />;
    case "melhorenvio":
      return <Truck size={16} aria-hidden="true" />;
    case "supabase":
      return <Database size={16} aria-hidden="true" />;
    case "mia":
    case "gemini":
    case "deepseek":
    case "groq":
      return <BrainCircuit size={16} aria-hidden="true" />;
    case "edge":
      return <Cloud size={16} aria-hidden="true" />;
    case "sentry":
      return <Activity size={16} aria-hidden="true" />;
    default:
      return <Cpu size={16} aria-hidden="true" />;
  }
}

export default function PortfolioGraph({
  caption,
}: {
  products?: GraphProduct[];
  integrations?: GraphIntegration[];
  edges?: GraphEdge[];
  caption: string;
}) {
  const { lang } = useLang();
  const pt = lang === "pt";
  const L = (b: Bi) => b[lang];

  // Product filter at the Solar Core ("all" or specific product id)
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  // Selected planet for the rich explanatory drawer/card (defaults to BigDataCorp so users immediately see the depth)
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("bigdatacorp");
  // Hovered planet or orbit for pause-on-hover
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [hoveredOrbit, setHoveredOrbit] = useState<1 | 2 | 3 | null>(null);
  const [manualPause, setManualPause] = useState<boolean>(false);

  // Orbit angular offsets (in degrees) driven by requestAnimationFrame for silky pause-on-hover per orbit
  const [orbitAngles, setOrbitAngles] = useState<{ 1: number; 2: number; 3: number }>({
    1: 0,
    2: 0,
    3: 0,
  });

  const hoveredPlanet = useMemo(
    () => SOLAR_PLANETS.find((p) => p.id === hoveredPlanetId) ?? null,
    [hoveredPlanetId],
  );

  const activeOrbitPaused = (orbitNum: 1 | 2 | 3) => {
    if (manualPause) return true;
    if (hoveredOrbit === orbitNum) return true;
    if (hoveredPlanet && hoveredPlanet.orbit === orbitNum) return true;
    return false;
  };

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    if (prefersReduced) return;

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.08);
      lastTs = now;

      setOrbitAngles((prev) => ({
        1: activeOrbitPaused(1) ? prev[1] : (prev[1] + dt * 11) % 360,
        2: activeOrbitPaused(2) ? prev[2] : (prev[2] - dt * 7.5 + 360) % 360,
        3: activeOrbitPaused(3) ? prev[3] : (prev[3] + dt * 5.2) % 360,
      }));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  });

  const activePlanet = useMemo(
    () =>
      SOLAR_PLANETS.find((p) => p.id === selectedPlanetId) ??
      SOLAR_PLANETS[0],
    [selectedPlanetId],
  );

  const focusedProductSpec = useMemo(
    () => SOLAR_PRODUCTS.find((p) => p.id === selectedProduct) ?? null,
    [selectedProduct],
  );

  // When user filters by a product, if the currently selected planet doesn't belong to that product, auto-select the first matching planet
  const handleSelectProductFilter = (prodId: string) => {
    setSelectedProduct(prodId);
    if (prodId !== "all") {
      const currentMatches = activePlanet.products.includes(prodId);
      if (!currentMatches) {
        const firstMatch = SOLAR_PLANETS.find((pl) => pl.products.includes(prodId));
        if (firstMatch) setSelectedPlanetId(firstMatch.id);
      }
    }
  };

  // Orbits radii in percentage of the 1000x1000 coordinate system (center at 500, 500)
  const ORBIT_RADII: Record<1 | 2 | 3, number> = {
    1: 21,
    2: 33.5,
    3: 45,
  };

  return (
    <figure className="solar-system-shell">
      {/* Top Control & Product Core Filter Bar */}
      <div className="solar-toolbar">
        <div className="solar-product-filters" role="tablist" aria-label={pt ? "Filtrar órbitas por produto do ecossistema" : "Filter orbits by ecosystem product"}>
          <button
            type="button"
            role="tab"
            aria-selected={selectedProduct === "all"}
            className={`solar-prod-pill${selectedProduct === "all" ? " is-active" : ""}`}
            onClick={() => handleSelectProductFilter("all")}
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>{pt ? `Ecossistema Completo (${SOLAR_PLANETS.length} APIs)` : `Full Ecosystem (${SOLAR_PLANETS.length} APIs)`}</span>
          </button>

          {SOLAR_PRODUCTS.map((prod) => {
            const isSelected = selectedProduct === prod.id;
            const count = SOLAR_PLANETS.filter((pl) => pl.products.includes(prod.id)).length;
            return (
              <button
                key={prod.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`solar-prod-pill${isSelected ? " is-active" : ""}`}
                style={
                  isSelected
                    ? {
                        borderColor: prod.color,
                        boxShadow: `0 0 0 2px ${prod.color}28`,
                      }
                    : undefined
                }
                onClick={() => handleSelectProductFilter(prod.id)}
              >
                <span
                  className="solar-prod-dot"
                  style={{ background: prod.color }}
                  aria-hidden="true"
                />
                <span>{prod.name}</span>
                <small className="solar-prod-count">{count}</small>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="solar-pause-btn"
          onClick={() => setManualPause((p) => !p)}
          aria-pressed={manualPause}
          title={
            manualPause
              ? pt
                ? "Retomar rotação orbital"
                : "Resume orbital rotation"
              : pt
                ? "Pausar todas as órbitas"
                : "Pause all orbits"
          }
        >
          {manualPause ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          <span>
            {manualPause
              ? pt
                ? "Órbitas pausadas"
                : "Orbits paused"
              : pt
                ? "Pausar rotação"
                : "Pause rotation"}
          </span>
        </button>
      </div>

      {/* Main Split Grid: Left = Interactive Orbital Solar System | Right = Production API Explanatory Drawer */}
      <div className="solar-main-grid">
        {/* LEFT: Interactive Orbital Stage */}
        <div
          className="solar-stage"
          aria-label={
            pt
              ? "Sistema Solar Tecnológico de Integrações em Produção. Passe o mouse para pausar a órbita e clique em uma API para inspecionar."
              : "Technological Solar System of Production Integrations. Hover to pause an orbit and click any API to inspect."
          }
        >
          {/* Ambient radial glow */}
          <div
            className="solar-ambient-glow"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activePlanet.color}24 0%, rgba(34, 181, 242, 0.08) 38%, transparent 72%)`,
            }}
            aria-hidden="true"
          />

          {/* SVG Orbital Rings & Dynamic Connection Beams */}
          <svg
            className="solar-svg-layer"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="solarSunCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.42" />
                <stop offset="60%" stopColor="#0284C7" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sun Halo */}
            <circle cx="50" cy="50" r="14" fill="url(#solarSunCoreGrad)" />

            {/* 3 Concentric Orbits */}
            {([1, 2, 3] as const).map((orbitNum) => {
              const r = ORBIT_RADII[orbitNum];
              const isPaused = activeOrbitPaused(orbitNum);
              const isActiveOrbit = activePlanet.orbit === orbitNum;
              return (
                <g key={orbitNum}>
                  {/* Invisible wider stroke for easy orbit hover detection */}
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="3.2"
                    style={{ cursor: "pointer", pointerEvents: "stroke" }}
                    onMouseEnter={() => setHoveredOrbit(orbitNum)}
                    onMouseLeave={() => setHoveredOrbit(null)}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    className={`solar-orbit-ring${isPaused ? " is-paused" : ""}${
                      isActiveOrbit ? " is-active-orbit" : ""
                    }`}
                    strokeDasharray={orbitNum === 2 ? "1.4 1.4" : orbitNum === 3 ? "2.2 1.2" : "none"}
                  />
                </g>
              );
            })}

            {/* Connection Beams from Core (Sun) to each Planet */}
            {SOLAR_PLANETS.map((planet) => {
              const currentDeg = (planet.angleDeg + orbitAngles[planet.orbit]) % 360;
              const rad = (currentDeg * Math.PI) / 180;
              const r = ORBIT_RADII[planet.orbit];
              const px = 50 + Math.cos(rad) * r;
              const py = 50 + Math.sin(rad) * r;

              const matchesProductFilter =
                selectedProduct === "all" || planet.products.includes(selectedProduct);
              const isSelected = planet.id === activePlanet.id;
              const isHovered = planet.id === hoveredPlanetId;

              if (!matchesProductFilter && !isSelected) return null;

              return (
                <g key={`beam-${planet.id}`}>
                  <line
                    x1="50"
                    y1="50"
                    x2={px}
                    y2={py}
                    stroke={planet.color}
                    strokeWidth={isSelected || isHovered ? "0.48" : "0.18"}
                    strokeOpacity={isSelected || isHovered ? "0.85" : "0.26"}
                    strokeDasharray={isSelected || isHovered ? "none" : "0.8 0.8"}
                  />
                  {(isSelected || isHovered) && (
                    <circle cx={px} cy={py} r="2.3" fill={planet.color} fillOpacity="0.22" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* THE SUN (CENTRAL NUCLEUS) */}
          <button
            type="button"
            className="solar-sun-core"
            onClick={() => handleSelectProductFilter("all")}
            title={
              pt
                ? "Núcleo Maldivas Tech · Clique para exibir todas as integrações"
                : "Maldivas Tech Core · Click to show all integrations"
            }
          >
            <span className="solar-sun-pulse" aria-hidden="true" />
            <span className="solar-sun-kicker">
              {focusedProductSpec ? focusedProductSpec.name.toUpperCase() : "MALDIVAS TECH"}
            </span>
            <strong className="solar-sun-title">
              {focusedProductSpec
                ? pt
                  ? "Núcleo em Foco"
                  : "Focused Core"
                : pt
                  ? "Core Multi-Tenant"
                  : "Multi-Tenant Core"}
            </strong>
            <span className="solar-sun-sub">PostgreSQL + RLS</span>
          </button>

          {/* ORBITING PLANETS (REAL PRODUCTION APIS) */}
          {SOLAR_PLANETS.map((planet) => {
            const currentDeg = (planet.angleDeg + orbitAngles[planet.orbit]) % 360;
            const rad = (currentDeg * Math.PI) / 180;
            const r = ORBIT_RADII[planet.orbit];
            const leftPct = 50 + Math.cos(rad) * r;
            const topPct = 50 + Math.sin(rad) * r;

            const matchesFilter =
              selectedProduct === "all" || planet.products.includes(selectedProduct);
            const isSelected = planet.id === activePlanet.id;
            const isHovered = planet.id === hoveredPlanetId;

            return (
              <button
                key={planet.id}
                type="button"
                className={`solar-planet-node${isSelected ? " is-selected" : ""}${
                  isHovered ? " is-hovered" : ""
                }${!matchesFilter ? " is-dimmed" : ""}`}
                style={
                  {
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    "--planet-color": planet.color,
                    "--planet-tint": planet.bgTint,
                  } as React.CSSProperties
                }
                onMouseEnter={() => {
                  setHoveredPlanetId(planet.id);
                  setHoveredOrbit(planet.orbit);
                }}
                onMouseLeave={() => {
                  setHoveredPlanetId(null);
                  setHoveredOrbit(null);
                }}
                onFocus={() => {
                  setHoveredPlanetId(planet.id);
                  setHoveredOrbit(planet.orbit);
                }}
                onBlur={() => {
                  setHoveredPlanetId(null);
                  setHoveredOrbit(null);
                }}
                onClick={() => setSelectedPlanetId(planet.id)}
                aria-pressed={isSelected}
                aria-label={`${planet.name} — ${L(planet.category)}`}
              >
                <span
                  className="solar-planet-orb"
                  style={{
                    background: planet.bgTint,
                    borderColor: planet.color,
                    color: planet.color,
                  }}
                >
                  <PlanetIcon iconKey={planet.iconKey} />
                </span>
                <span className="solar-planet-label">{planet.shortName}</span>
              </button>
            );
          })}

          {/* Bottom Stage Legend & Orbit Status */}
          <div className="solar-stage-hud">
            <div className="solar-orbit-legend">
              <span>
                <i className="orb-dot orb-1" />{" "}
                {pt ? "Órbita 1: Core, Dados & IA" : "Orbit 1: Core, Data & AI"}
              </span>
              <span>
                <i className="orb-dot orb-2" />{" "}
                {pt
                  ? "Órbita 2: Fiscal, BigDataCorp, USDA & PIX"
                  : "Orbit 2: Fiscal, BigDataCorp, USDA & PIX"}
              </span>
              <span>
                <i className="orb-dot orb-3" />{" "}
                {pt
                  ? "Órbita 3: iFood, Meta Cloud, Hardware & Japão"
                  : "Orbit 3: iFood, Meta Cloud, Hardware & Japan"}
              </span>
            </div>
            <span className="solar-hud-hint">
              {hoveredPlanet
                ? pt
                  ? `⏸ Órbita ${hoveredPlanet.orbit} pausada · Clique para abrir detalhes`
                  : `⏸ Orbit ${hoveredPlanet.orbit} paused · Click to inspect`
                : pt
                  ? "Passe o mouse para pausar a órbita · Clique em um planeta para inspecionar"
                  : "Hover to pause orbit · Click any planet to inspect"}
            </span>
          </div>
        </div>

        {/* RIGHT: Rich Explanatory Card / Drawer for the Clicked Production API */}
        <aside
          className="solar-inspector-card"
          aria-live="polite"
          aria-label={pt ? "Detalhes técnicos da integração selecionada" : "Technical details of selected integration"}
          style={
            {
              "--inspector-accent": activePlanet.color,
            } as React.CSSProperties
          }
        >
          <div className="solar-inspector-top">
            <span className="solar-status-badge">
              <span className="solar-status-live-dot" aria-hidden="true" />
              {L(activePlanet.statusBadge)}
            </span>
            <span className="solar-orbit-tag">
              {pt ? `Órbita 0${activePlanet.orbit}` : `Orbit 0${activePlanet.orbit}`}
            </span>
          </div>

          <div className="solar-inspector-header">
            <div
              className="solar-inspector-icon"
              style={{
                background: activePlanet.bgTint,
                borderColor: activePlanet.color,
                color: activePlanet.color,
              }}
            >
              <PlanetIcon iconKey={activePlanet.iconKey} />
            </div>
            <div className="solar-inspector-title-wrap">
              <span
                className="solar-inspector-category"
                style={{ color: activePlanet.color }}
              >
                {L(activePlanet.category)}
              </span>
              <h3 className="solar-inspector-title">{activePlanet.name}</h3>
            </div>
          </div>

          {/* Telemetry / Capability Pill */}
          <div className="solar-metrics-banner">
            <FileCheck2 size={15} style={{ color: activePlanet.color }} aria-hidden="true" />
            <span>{L(activePlanet.metricsPill)}</span>
          </div>

          {/* 1. Which Maldivas Tech Products use this integration */}
          <div className="solar-inspector-block">
            <h4>
              {pt
                ? "PRODUTOS MALDIVAS TECH QUE UTILIZAM EM PRODUÇÃO"
                : "MALDIVAS TECH PRODUCTS USING THIS IN PRODUCTION"}
            </h4>
            <div className="solar-inspector-products">
              {activePlanet.products.map((pid) => {
                const prod = SOLAR_PRODUCTS.find((p) => p.id === pid);
                if (!prod) return null;
                return (
                  <a
                    key={prod.id}
                    href={prod.href}
                    className="solar-inspector-prod-chip"
                    style={{
                      borderColor: `${prod.color}66`,
                    }}
                  >
                    <span
                      className="solar-prod-dot"
                      style={{ background: prod.color }}
                      aria-hidden="true"
                    />
                    <strong>{prod.name}</strong>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 2. What it solves in practice (Business Rule) */}
          <div className="solar-inspector-block">
            <h4>
              {pt
                ? "O QUE RESOLVE NA PRÁTICA (REGRA DE NEGÓCIO)"
                : "WHAT IT SOLVES IN PRACTICE (BUSINESS RULE)"}
            </h4>
            <p>{L(activePlanet.businessRule)}</p>
          </div>

          {/* 3. Summarized Technical Flow */}
          <div className="solar-inspector-block is-tech-flow">
            <h4>
              {pt
                ? "FLUXO TÉCNICO & ENGENHARIA EM PRODUÇÃO"
                : "TECHNICAL FLOW & PRODUCTION ENGINEERING"}
            </h4>
            <p>{L(activePlanet.technicalFlow)}</p>
          </div>

          {/* Quick Planet Switcher Footer inside Drawer (great for mobile & keyboard navigation) */}
          <div className="solar-inspector-footer">
            <span className="solar-quick-label">
              {pt ? `Navegação rápida pelas ${SOLAR_PLANETS.length} APIs:` : `Quick jump across all ${SOLAR_PLANETS.length} APIs:`}
            </span>
            <div className="solar-quick-grid">
              {SOLAR_PLANETS.map((pl) => {
                const isCurrent = pl.id === activePlanet.id;
                const matches =
                  selectedProduct === "all" || pl.products.includes(selectedProduct);
                return (
                  <button
                    key={`quick-${pl.id}`}
                    type="button"
                    className={`solar-quick-chip${isCurrent ? " is-active" : ""}${
                      !matches ? " is-dim" : ""
                    }`}
                    style={
                      isCurrent
                        ? {
                            borderColor: pl.color,
                            background: pl.bgTint,
                          }
                        : undefined
                    }
                    onClick={() => setSelectedPlanetId(pl.id)}
                  >
                    <span
                      className="solar-prod-dot"
                      style={{ background: pl.color }}
                      aria-hidden="true"
                    />
                    <span>{pl.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <figcaption className="pg-caption">
        <CheckCircle2 size={14} aria-hidden="true" />
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
