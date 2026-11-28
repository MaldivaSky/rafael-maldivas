"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import {
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  FileSearch,
  Gauge,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLang } from "../../lib/i18n";
import {
  AmbientStarfield,
  ThreeCameraHud,
  ThreeCameraRig,
  type CameraControlAction,
} from "./ThreeCameraRig";

type Bi = { pt: string; en: string };

type LlmNodeId = "groq" | "gemini" | "deepseek";
type WorkloadId = "whatsapp-triage" | "academy-tutor" | "japan-ocr" | "retail-bi";

interface LlmEngineNode {
  id: LlmNodeId;
  name: string;
  badge: string;
  colorHex: string;
  position: [number, number, number];
  strength: Bi;
}

interface AiWorkloadScenario {
  id: WorkloadId;
  primaryEngine: LlmNodeId;
  fallbackEngine: LlmNodeId;
  accentHex: string;
  shortLabel: Bi;
  title: Bi;
  product: string;
  latency: string;
  costProfile: Bi;
  promptExample: Bi;
  routingReason: Bi;
  guardrails: Bi[];
  deterministicFallback: Bi;
}

const LLM_NODES: LlmEngineNode[] = [
  {
    id: "groq",
    name: "Groq LPU",
    badge: "LLaMA 3 · <250ms",
    colorHex: "#F97316",
    position: [-2.65, 0.95, 0.4],
    strength: {
      pt: "Inferência ultra-rápida em LPU para triagem em tempo real",
      en: "Ultra-fast LPU inference for real-time triage",
    },
  },
  {
    id: "gemini",
    name: "Google Gemini",
    badge: "Multimodal · JSON",
    colorHex: "#0EA5E9",
    position: [2.65, 0.95, 0.4],
    strength: {
      pt: "Raciocínio multimodal, agentes estruturados e tutoria socrática",
      en: "Multimodal reasoning, structured agents & Socratic tutoring",
    },
  },
  {
    id: "deepseek",
    name: "DeepSeek AI",
    badge: "PT · JP · EN · Code",
    colorHex: "#10B981",
    position: [0, -2.05, 0.65],
    strength: {
      pt: "Alta precisão em tradução trilíngue, OCR e custo/token otimizado",
      en: "High-precision trilingual translation, OCR & cost-optimized tokens",
    },
  },
];

const WORKLOADS: AiWorkloadScenario[] = [
  {
    id: "whatsapp-triage",
    primaryEngine: "groq",
    fallbackEngine: "gemini",
    accentHex: "#F97316",
    shortLabel: { pt: "Triagem WhatsApp", en: "WhatsApp Triage" },
    title: {
      pt: "Triagem Conversacional em Tempo Real no WhatsApp",
      en: "Real-Time Conversational WhatsApp Triage",
    },
    product: "Atol Connect · MiseOn",
    latency: "~190ms TTFT",
    costProfile: { pt: "Baixíssimo custo · Alto volume", en: "Ultra-low cost · High volume" },
    promptExample: {
      pt: "“Quero 2 X-Bacon sem cebola e 1 Coca 2L para entregar na Rua Vergueiro 1200”",
      en: "“I'd like 2 Bacon Burgers no onions and 1 Coke 2L delivered to 1200 Vergueiro St”",
    },
    routingReason: {
      pt: "Intenção de pedido no WhatsApp exige resposta abaixo de 300ms. O roteador envia para a LPU da Groq extrair itens, modificadores e endereço em JSON estrito direto para o PDV.",
      en: "WhatsApp order intents require sub-300ms replies. The router dispatches to Groq LPU to extract items, modifiers and address into strict JSON straight to the POS.",
    },
    guardrails: [
      { pt: "PII Scrubbing (CPF/telefone mascarados nos logs)", en: "PII Scrubbing (ID/phone masked in logs)" },
      { pt: "Validação de preço contra o banco — LLM nunca inventa valor", en: "Price validated against DB — LLM never invents totals" },
      { pt: "Rate limit por número + janela de sessão Meta 24h", en: "Per-number rate limit + Meta 24h session window" },
    ],
    deterministicFallback: {
      pt: "Se Groq oscilar, comuta automaticamente para Gemini Flash ou menu interativo oficial da Meta.",
      en: "If Groq degrades, auto-fails over to Gemini Flash or Meta's official interactive menu.",
    },
  },
  {
    id: "academy-tutor",
    primaryEngine: "gemini",
    fallbackEngine: "deepseek",
    accentHex: "#0EA5E9",
    shortLabel: { pt: "Tutor & Concierge IA", en: "AI Tutor & Concierge" },
    title: {
      pt: "Tutor Socrático da Academy & Concierge de Produtos",
      en: "Academy Socratic Tutor & Product Concierge",
    },
    product: "Maldivas Academy · MySuperStore",
    latency: "~640ms Stream",
    costProfile: { pt: "Contexto longo · Saída estruturada", en: "Long context · Structured output" },
    promptExample: {
      pt: "“Por que meu webhook do PIX está aprovando o pedido duas vezes no replay?”",
      en: "“Why is my PIX webhook approving the same order twice on replay?”",
    },
    routingReason: {
      pt: "Google Gemini recebe o contexto da aula/catálogo e retorna JSON tipado com diagnóstico, dica socrática sem entregar a resposta pronta e referência exata de arquitetura.",
      en: "Google Gemini ingests lesson/catalog context and returns typed JSON with diagnosis, Socratic hints without spoiling the answer, and exact architecture references.",
    },
    guardrails: [
      { pt: "Prompt Injection Shield + sanitização de entrada", en: "Prompt Injection Shield + input sanitization" },
      { pt: "Schema JSON validado em runtime antes de renderizar", en: "Runtime JSON schema validation before rendering" },
      { pt: "Citação restrita aos dados reais da base Maldivas Tech", en: "Grounding restricted to real Maldivas Tech data" },
    ],
    deterministicFallback: {
      pt: "Motor determinístico local (`ai-agent-core.ts`) garante resposta útil mesmo sem API key ou em falha externa.",
      en: "Local deterministic engine (`ai-agent-core.ts`) guarantees useful responses even without API key or on outage.",
    },
  },
  {
    id: "japan-ocr",
    primaryEngine: "deepseek",
    fallbackEngine: "gemini",
    accentHex: "#10B981",
    shortLabel: { pt: "OCR & Tradução PT/JP/EN", en: "OCR & PT/JP/EN Translation" },
    title: {
      pt: "Leitura Documental e Tradução Trilíngue Brasil ↔ Japão",
      en: "Document Parsing & Trilingual Brazil ↔ Japan Translation",
    },
    product: "SelectSys Jobs · Fujiarte Co., Ltd.",
    latency: "~520ms Batch",
    costProfile: { pt: "Alta eficiência por token · Batch", en: "High token efficiency · Batch" },
    promptExample: {
      pt: "Passaporte + Zairyu Card + Histórico escolar → Normalização PT / 日本語 / EN",
      en: "Passport + Zairyu Card + School records → PT / 日本語 / EN normalization",
    },
    routingReason: {
      pt: "Após a extração bruta do Tesseract OCR, o DeepSeek limpa ruídos de digitalização, valida campos obrigatórios de imigração e traduz com terminologia exata de fábricas japonesas.",
      en: "After raw Tesseract OCR extraction, DeepSeek cleans scan noise, validates mandatory immigration fields and translates using exact Japanese factory terminology.",
    },
    guardrails: [
      { pt: "Conformidade dupla LGPD (Brasil) + APPI (Japão)", en: "Dual compliance LGPD (Brazil) + APPI (Japan)" },
      { pt: "Checagem determinística de datas, validade e formato .XLS", en: "Deterministic checks on dates, expiry & .XLS format" },
      { pt: "Trilha de auditoria de revisão humana obrigatória", en: "Mandatory human-in-the-loop audit trail" },
    ],
    deterministicFallback: {
      pt: "Em timeout, o pipeline cai para Gemini mantendo o mesmo schema de validação documental.",
      en: "On timeout, pipeline fails over to Gemini while enforcing the exact same document schema.",
    },
  },
  {
    id: "retail-bi",
    primaryEngine: "gemini",
    fallbackEngine: "groq",
    accentHex: "#F59E0B",
    shortLabel: { pt: "Consultor M-IA (DRE/ABC)", en: "M-IA Advisor (P&L/ABC)" },
    title: {
      pt: "Consultor M-IA: Explicando Margem, Ruptura e Curva ABC",
      en: "M-IA Advisor: Explaining Margin, Stockouts & ABC Curve",
    },
    product: "MercadinhoSys · Varejo",
    latency: "~480ms Hybrid",
    costProfile: { pt: "SQL/Pandas exato + Narração LLM", en: "Exact SQL/Pandas + LLM narrative" },
    promptExample: {
      pt: "“Onde estou perdendo margem essa semana e quais itens Classe A estão perto de romper?”",
      en: "“Where am I losing margin this week and which Class-A SKUs are near stockout?”",
    },
    routingReason: {
      pt: "Arquitetura híbrida anti-alucinação: PostgreSQL e Pandas calculam 100% da DRE, PEPS e Curva ABC em centavos inteiros; o LLM apenas traduz os números exatos em plano de ação para o dono da loja.",
      en: "Anti-hallucination hybrid design: PostgreSQL and Pandas compute 100% of P&L, FIFO and ABC Curve in integer cents; the LLM strictly translates verified numbers into store actions.",
    },
    guardrails: [
      { pt: "Zero matemática feita pelo LLM — 100% calculado no banco", en: "Zero math done by LLM — 100% computed in DB" },
      { pt: "Isolamento estrito por tenant via PostgreSQL RLS", en: "Strict tenant isolation via PostgreSQL RLS" },
      { pt: "Explicação auditável com link direto para o SKU/nota", en: "Auditable insights linked directly to SKU/invoice" },
    ],
    deterministicFallback: {
      pt: "Relatório executivo estruturado em Markdown/Plotly entregue mesmo se o provedor de IA estiver offline.",
      en: "Structured Markdown/Plotly executive report delivered even if the AI provider is offline.",
    },
  },
];

/* ------------------------------------------------------------------ *
 *  Three.js Neural Orchestration Scene
 * ------------------------------------------------------------------ */

function RouterCore({
  accentHex,
  isDark,
}: {
  accentHex: string;
  isDark: boolean;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const accent = useMemo(() => new THREE.Color(accentHex), [accentHex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.45;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.25;
      const pulse = 1 + Math.sin(t * 2.4) * 0.04;
      coreRef.current.scale.setScalar(pulse);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.55;
      ring1Ref.current.rotation.y = t * 0.35;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.4 + 1.1;
      ring2Ref.current.rotation.z = t * 0.48;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Central Faceted Router Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.76, 1]} />
        <meshStandardMaterial
          color={isDark ? "#0d1a30" : "#e0f2fe"}
          emissive={accent}
          emissiveIntensity={isDark ? 0.55 : 0.32}
          metalness={0.55}
          roughness={0.22}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Lattice Shell */}
      <mesh rotation={[0.4, 0.6, 0]}>
        <icosahedronGeometry args={[0.88, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.38} />
      </mesh>

      {/* Guardrail Gyroscope Ring 1 (Schema & PII) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.22, 0.022, 16, 64]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.72} />
      </mesh>

      {/* Guardrail Gyroscope Ring 2 (Rate-Limit & Fallback) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.42, 0.016, 16, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

function LlmSatellite({
  node,
  isPrimary,
  isFallback,
  isDark,
  onClick,
}: {
  node: LlmNodeId extends string ? LlmEngineNode : never;
  isPrimary: boolean;
  isFallback: boolean;
  isDark: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(node.colorHex), [node.colorHex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      const targetScale = isPrimary ? 1.2 : isFallback ? 1.0 : 0.86;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08),
      );
      groupRef.current.position.y =
        node.position[1] + Math.sin(t * 1.4 + node.position[0]) * 0.08;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * (isPrimary ? 1.05 : 0.4);
      meshRef.current.rotation.x = t * (isPrimary ? 0.5 : 0.2);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = -t * 0.7;
    }
  });

  return (
    <group
      ref={groupRef}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh ref={meshRef}>
        {node.id === "groq" ? (
          <octahedronGeometry args={[0.42, 0]} />
        ) : node.id === "gemini" ? (
          <dodecahedronGeometry args={[0.42, 0]} />
        ) : (
          <boxGeometry args={[0.58, 0.58, 0.58]} />
        )}
        <meshStandardMaterial
          color={isDark ? "#0f1c33" : "#f8fafc"}
          emissive={color}
          emissiveIntensity={isPrimary ? 1.05 : isFallback ? 0.45 : 0.18}
          metalness={0.5}
          roughness={0.22}
        />
      </mesh>

      <mesh ref={haloRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[0.64, 0.018, 12, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isPrimary ? 0.92 : isFallback ? 0.45 : 0.22}
        />
      </mesh>
    </group>
  );
}

function NeuralChannel({
  node,
  isPrimary,
  isFallback,
  burstTime,
}: {
  node: LlmEngineNode;
  isPrimary: boolean;
  isFallback: boolean;
  burstTime: number;
}) {
  const p1Ref = useRef<THREE.Mesh>(null);
  const p2Ref = useRef<THREE.Mesh>(null);
  const p3Ref = useRef<THREE.Mesh>(null);
  const burstRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(node.colorHex), [node.colorHex]);

  const { curve, tubeGeo } = useMemo(() => {
    const start = new THREE.Vector3(0, 0.2, 0);
    const end = new THREE.Vector3(...node.position);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.z += 0.55;
    mid.y += 0.25;
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const g = new THREE.TubeGeometry(c, 40, isPrimary ? 0.028 : 0.012, 8, false);
    return { curve: c, tubeGeo: g };
  }, [node.position, isPrimary]);

  useFrame(({ clock }) => {
    const now = performance.now();
    const burstProgress = isPrimary ? (now - burstTime) / 900 : 2;
    const isBursting = burstProgress >= 0 && burstProgress <= 1;

    const speed = isBursting ? 1.85 : isPrimary ? 0.78 : isFallback ? 0.34 : 0.18;
    const t = clock.getElapsedTime() * speed;
    if (p1Ref.current) curve.getPoint(t % 1, p1Ref.current.position);
    if (p2Ref.current) curve.getPoint((t + 0.33) % 1, p2Ref.current.position);
    if (p3Ref.current) curve.getPoint(1 - ((t + 0.66) % 1), p3Ref.current.position);
    if (burstRef.current) {
      burstRef.current.visible = isBursting;
      if (isBursting) {
        curve.getPoint(burstProgress, burstRef.current.position);
        const s = 1 + Math.sin(burstProgress * Math.PI) * 0.9;
        burstRef.current.scale.setScalar(s);
      }
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isPrimary ? 0.92 : isFallback ? 0.42 : 0.18}
        />
      </mesh>
      <mesh ref={p1Ref}>
        <sphereGeometry args={[isPrimary ? 0.072 : 0.038, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={p2Ref}>
        <sphereGeometry args={[isPrimary ? 0.056 : 0.03, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {isPrimary && (
        <mesh ref={p3Ref}>
          <sphereGeometry args={[0.054, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      <mesh ref={burstRef} visible={false}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function OrchestratorScene({
  workload,
  isDark,
  autoRotate,
  cameraAction,
  burstTime,
  onPickEngine,
}: {
  workload: AiWorkloadScenario;
  isDark: boolean;
  autoRotate: boolean;
  cameraAction: CameraControlAction | null;
  burstTime: number;
  onPickEngine: (engine: LlmNodeId) => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.68 : 1.05} />
      <directionalLight position={[5, 6, 5]} intensity={1.25} color="#ffffff" />
      <pointLight position={[-4, 3, 3]} intensity={0.85} color="#F97316" />
      <pointLight position={[4, 3, 3]} intensity={0.85} color="#0EA5E9" />
      <pointLight position={[0, -4, 3]} intensity={0.75} color="#10B981" />

      <AmbientStarfield
        count={300}
        radius={12}
        color={isDark ? "#38bdf8" : "#0284c7"}
        opacity={isDark ? 0.45 : 0.22}
      />

      <ThreeCameraRig
        defaultPosition={[0, 0.85, 6.5]}
        defaultTarget={[0, -0.1, 0]}
        minDistance={3.4}
        maxDistance={12}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        action={cameraAction}
      />

      <group>
        <RouterCore accentHex={workload.accentHex} isDark={isDark} />

        {LLM_NODES.map((node) => {
          const isPrimary = node.id === workload.primaryEngine;
          const isFallback = node.id === workload.fallbackEngine;
          return (
            <group key={node.id}>
              <NeuralChannel
                node={node}
                isPrimary={isPrimary}
                isFallback={isFallback}
                burstTime={burstTime}
              />
              <LlmSatellite
                node={node}
                isPrimary={isPrimary}
                isFallback={isFallback}
                isDark={isDark}
                onClick={() => onPickEngine(node.id)}
              />
            </group>
          );
        })}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Main Component
 * ------------------------------------------------------------------ */

export default function AiOrchestratorHub3D() {
  const { lang } = useLang();
  const { resolvedTheme } = useTheme();
  const pt = lang === "pt";
  const isDark = resolvedTheme !== "light";
  const L = (b: Bi) => b[lang];

  const [activeWorkloadId, setActiveWorkloadId] = useState<WorkloadId>("whatsapp-triage");
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraAction, setCameraAction] = useState<CameraControlAction | null>(null);
  const [burstTime, setBurstTime] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const actionSeq = useRef(0);

  const triggerBurst = () => {
    setBurstTime(performance.now());
  };

  const triggerCam = (type: "zoom-in" | "zoom-out" | "reset") => {
    actionSeq.current += 1;
    setCameraAction({ type, seq: actionSeq.current });
  };

  const focusWorkload = (wId: WorkloadId) => {
    setActiveWorkloadId(wId);
    setBurstTime(performance.now());
    const w = WORKLOADS.find((item) => item.id === wId);
    if (!w) return;
    const node = LLM_NODES.find((n) => n.id === w.primaryEngine);
    if (!node) return;
    actionSeq.current += 1;
    setCameraAction({
      type: "fly",
      seq: actionSeq.current,
      position: [node.position[0] * 0.65, node.position[1] * 0.45 + 0.9, 6.1],
      target: [node.position[0] * 0.25, node.position[1] * 0.2, 0],
    });
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const activeWorkload = useMemo(
    () => WORKLOADS.find((w) => w.id === activeWorkloadId) ?? WORKLOADS[0],
    [activeWorkloadId],
  );

  const primaryNode = LLM_NODES.find((n) => n.id === activeWorkload.primaryEngine)!;
  const fallbackNode = LLM_NODES.find((n) => n.id === activeWorkload.fallbackEngine)!;

  const handlePickEngine = (engine: LlmNodeId) => {
    if (engine === "groq") focusWorkload("whatsapp-triage");
    else if (engine === "gemini") focusWorkload("academy-tutor");
    else if (engine === "deepseek") focusWorkload("japan-ocr");
  };

  function getWorkloadIcon(id: WorkloadId) {
    switch (id) {
      case "whatsapp-triage":
        return <MessageSquare size={14} aria-hidden="true" />;
      case "academy-tutor":
        return <Sparkles size={14} aria-hidden="true" />;
      case "japan-ocr":
        return <FileSearch size={14} aria-hidden="true" />;
      case "retail-bi":
        return <TrendingUp size={14} aria-hidden="true" />;
    }
  }

  return (
    <div className="aihub3d-shell" ref={wrapRef}>
      {/* Top Workload Selector */}
      <div
        className="aihub3d-toolbar"
        role="tablist"
        aria-label={
          pt
            ? "Cenários de orquestração Multi-LLM em produção"
            : "Multi-LLM orchestration scenarios in production"
        }
      >
        <div className="aihub3d-tabs">
          <span className="aihub3d-kicker">
            <BrainCircuit size={14} aria-hidden="true" />
            {pt ? "Simular roteamento IA:" : "Simulate AI routing:"}
          </span>
          {WORKLOADS.map((w) => {
            const isOn = w.id === activeWorkloadId;
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                className={`aihub3d-tab${isOn ? " is-active" : ""}`}
                style={
                  isOn
                    ? {
                        borderColor: w.accentHex,
                        boxShadow: `0 0 0 2px ${w.accentHex}26`,
                      }
                    : undefined
                }
                onClick={() => focusWorkload(w.id)}
              >
                <span style={{ color: w.accentHex }}>{getWorkloadIcon(w.id)}</span>
                <span>{L(w.shortLabel)}</span>
              </button>
            );
          })}
        </div>

        <span className="aihub3d-oracle-pill">
          <BadgeCheck size={14} aria-hidden="true" />
          Oracle Agentic AI
        </span>
      </div>

      {/* Main Split: 3D Neural Router Canvas + Guardrail Telemetry Panel */}
      <div className="aihub3d-grid">
        <div className="aihub3d-stage">
          <div className="aihub3d-hud">
            <span className="aihub3d-live-pill">
              <span className="aihub3d-live-dot" aria-hidden="true" />
              THREE.JS MULTI-LLM · {activeWorkload.latency}
            </span>
            <span className="aihub3d-route-pill">
              {primaryNode.name} → Fallback: {fallbackNode.name}
            </span>
          </div>

          <div className="aihub3d-canvas-wrap">
            <Canvas
              camera={{ position: [0, 0.85, 6.5], fov: 40 }}
              dpr={[1, 1.75]}
              frameloop={visible && !reducedMotion ? "always" : "demand"}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              aria-label={
                pt
                  ? "Cena 3D em Three.js do hub de orquestração Multi-LLM conectando Groq, Google Gemini e DeepSeek com anéis de guardrails"
                  : "Three.js 3D Multi-LLM orchestration hub connecting Groq, Google Gemini and DeepSeek with guardrail rings"
              }
            >
              <OrchestratorScene
                workload={activeWorkload}
                isDark={isDark}
                autoRotate={autoRotate && !reducedMotion}
                cameraAction={cameraAction}
                burstTime={burstTime}
                onPickEngine={handlePickEngine}
              />
            </Canvas>

            <ThreeCameraHud
              pt={pt}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate((v) => !v)}
              onZoomIn={() => triggerCam("zoom-in")}
              onZoomOut={() => triggerCam("zoom-out")}
              onReset={() => triggerCam("reset")}
              extraButton={
                <button
                  type="button"
                  className="cam3d-burst-btn"
                  onClick={triggerBurst}
                  title={pt ? "Disparar rajada de tokens" : "Fire token burst"}
                >
                  <Zap size={13} aria-hidden="true" />
                  <span>{pt ? "Rajada" : "Burst"}</span>
                </button>
              }
            />
          </div>

          {/* 3 Compute Engine Cards along bottom of 3D Stage */}
          <div className="aihub3d-engines-rail">
            {LLM_NODES.map((node) => {
              const isPrimary = node.id === activeWorkload.primaryEngine;
              const isFallback = node.id === activeWorkload.fallbackEngine;
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`aihub3d-engine-chip${isPrimary ? " is-primary" : ""}${
                    isFallback ? " is-fallback" : ""
                  }`}
                  style={
                    isPrimary
                      ? {
                          borderColor: node.colorHex,
                          boxShadow: `0 0 0 2px ${node.colorHex}26`,
                        }
                      : undefined
                  }
                  onClick={() => handlePickEngine(node.id)}
                >
                  <div className="aihub3d-engine-top">
                    <span
                      className="aihub3d-engine-dot"
                      style={{ background: node.colorHex }}
                      aria-hidden="true"
                    />
                    <strong>{node.name}</strong>
                    {isPrimary && (
                      <em style={{ color: node.colorHex }}>
                        {pt ? "ATIVO" : "ACTIVE"}
                      </em>
                    )}
                    {isFallback && (
                      <em>{pt ? "FALLBACK" : "FALLBACK"}</em>
                    )}
                  </div>
                  <small>{node.badge}</small>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Telemetry & Guardrail Inspector */}
        <aside className="aihub3d-panel" aria-live="polite">
          <div className="aihub3d-panel-head">
            <span
              className="aihub3d-model-pill"
              style={{
                color: primaryNode.colorHex,
                borderColor: `${primaryNode.colorHex}55`,
                background: `${primaryNode.colorHex}14`,
              }}
            >
              <Cpu size={13} aria-hidden="true" />
              {primaryNode.name} · {activeWorkload.product}
            </span>
            <span className="aihub3d-cost-pill">
              <Gauge size={12} aria-hidden="true" />
              {L(activeWorkload.costProfile)}
            </span>
          </div>

          <h3>{L(activeWorkload.title)}</h3>

          <div
            className="aihub3d-prompt-box"
            style={{ borderLeftColor: activeWorkload.accentHex }}
          >
            <small>{pt ? "ENTRADA REAL EM PRODUÇÃO" : "REAL PRODUCTION INPUT"}</small>
            <p>{L(activeWorkload.promptExample)}</p>
          </div>

          <div className="aihub3d-section">
            <h4>{pt ? "DECISÃO DO ROTEADOR MULTI-LLM" : "MULTI-LLM ROUTER DECISION"}</h4>
            <p>{L(activeWorkload.routingReason)}</p>
          </div>

          <div className="aihub3d-section">
            <h4>
              <ShieldAlert size={12} aria-hidden="true" />{" "}
              {pt ? "GUARDRAILS DETERMINÍSTICOS ATIVOS" : "ACTIVE DETERMINISTIC GUARDRAILS"}
            </h4>
            <ul className="aihub3d-guardrails">
              {activeWorkload.guardrails.map((g) => (
                <li key={g.pt}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>{L(g)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="aihub3d-fallback">
            <strong>{pt ? "FALLBACK DETERMINÍSTICO:" : "DETERMINISTIC FALLBACK:"}</strong>{" "}
            <span>{L(activeWorkload.deterministicFallback)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
