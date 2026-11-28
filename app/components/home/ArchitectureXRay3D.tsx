"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import {
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Layers,
  Lock,
  Play,
  QrCode,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { useLang } from "../../lib/i18n";
import {
  AmbientStarfield,
  ThreeCameraHud,
  ThreeCameraRig,
  type CameraControlAction,
} from "./ThreeCameraRig";

/* ------------------------------------------------------------------ *
 *  OPTION 1 — Three.js / React Three Fiber
 *  Raio-X 3D Interativo da Arquitetura Multi-Tenant Maldivas Tech
 *
 *  4 camadas isométricas flutuantes em WebGL com iluminação física,
 *  arcos de pacotes 3D trafegando em tempo real entre camadas,
 *  efeito Exploded View (expandir/recolher), tilt suave por cursor
 *  e 4 fluxos reais de produção simuláveis ao vivo.
 *
 *  Zero-Purple Lock respeitado (apenas Cyan, Emerald, Amber, Coral, Sky).
 * ------------------------------------------------------------------ */

type Bi = { pt: string; en: string };

interface ArchLayerSpec {
  id: "edge" | "ai" | "tx" | "db";
  index: number;
  baseY: number;
  colorHex: string;
  code: string;
  name: Bi;
  subtitle: Bi;
  stackTags: string[];
  engineeringSpec: Bi;
  invariant: Bi;
  slaPill: Bi;
}

interface ArchFlowScenario {
  id: "ifood" | "pix" | "ai-router" | "rls";
  label: Bi;
  shortLabel: Bi;
  accentHex: string;
  latencyLabel: string;
  product: string;
  pathLayers: Array<"edge" | "ai" | "tx" | "db">;
  stepNotes: Record<"edge" | "ai" | "tx" | "db", Bi>;
}

const ARCH_LAYERS: ArchLayerSpec[] = [
  {
    id: "edge",
    index: 0,
    baseY: 2.05,
    colorHex: "#0EA5E9",
    code: "L4 · EDGE & CHANNELS",
    name: { pt: "Edge Network & Canais de Entrada", en: "Edge Network & Entry Channels" },
    subtitle: {
      pt: "Cloudflare WAF · Vercel Edge (gru1) · Next.js · WhatsApp Cloud · iFood · Smart POS",
      en: "Cloudflare WAF · Vercel Edge (gru1) · Next.js · WhatsApp Cloud · iFood · Smart POS",
    },
    stackTags: ["Next.js 15", "Cloudflare WAF", "Vercel gru1", "Meta Cloud API", "iFood Orders", "Gertec POS"],
    engineeringSpec: {
      pt: "Terminação TLS 1.3, mitigação DDoS na borda, validação de origem e roteamento de eventos de canais externos (pedidos iFood, mensagens WhatsApp, caixas PDV e totens) sem expor a rede interna.",
      en: "TLS 1.3 termination, edge DDoS mitigation, origin validation, and event routing from external channels (iFood orders, WhatsApp messages, POS & kiosks) without exposing internal services.",
    },
    invariant: {
      pt: "Fail-Closed na borda: qualquer webhook sem assinatura HMAC SHA-256 válida é rejeitado com HTTP 401 antes de tocar na aplicação.",
      en: "Fail-Closed at the edge: any webhook missing a valid HMAC SHA-256 signature is dropped with HTTP 401 before reaching the app.",
    },
    slaPill: { pt: "Latência Edge < 45ms · TLS 1.3", en: "Edge Latency < 45ms · TLS 1.3" },
  },
  {
    id: "ai",
    index: 1,
    baseY: 0.7,
    colorHex: "#F59E0B",
    code: "L3 · API GATEWAY & AI ROUTER",
    name: { pt: "Orquestrador de APIs & Hub Multi-LLM", en: "API Orchestrator & Multi-LLM Hub" },
    subtitle: {
      pt: "Google Gemini · DeepSeek AI · Groq LPU · Pandas/Plotly BI · BigDataCorp · USDA",
      en: "Google Gemini · DeepSeek AI · Groq LPU · Pandas/Plotly BI · BigDataCorp · USDA",
    },
    stackTags: ["Google Gemini", "DeepSeek AI", "Groq LPU", "FastAPI / Django", "BigDataCorp", "USDA FoodData"],
    engineeringSpec: {
      pt: "Roteia cada tarefa para o motor ideal: Groq LPU (<250ms) para triagem real-time no WhatsApp, Google Gemini para agentes multimodais e tutoria, DeepSeek para tradução PT/JP/EN pós-OCR e Pandas/Plotly para BI.",
      en: "Routes each workload to the right engine: Groq LPU (<250ms) for real-time WhatsApp triage, Google Gemini for multimodal agents, DeepSeek for PT/JP/EN post-OCR translation, and Pandas/Plotly for BI.",
    },
    invariant: {
      pt: "Zero alucinação financeira: LLMs recebem agregações já calculadas em Python/SQL e respondem em JSON com fallback determinístico.",
      en: "Zero financial hallucination: LLMs receive pre-computed Python/SQL aggregates and output schema-checked JSON with deterministic fallback.",
    },
    slaPill: { pt: "Groq < 250ms · Fallback Determinístico", en: "Groq < 250ms · Deterministic Fallback" },
  },
  {
    id: "tx",
    index: 2,
    baseY: -0.65,
    colorHex: "#F97316",
    code: "L2 · TRANSACTIONAL & FISCAL CORE",
    name: { pt: "Motor Transacional, Split PIX & Fiscal", en: "Transactional, PIX Split & Fiscal Engine" },
    subtitle: {
      pt: "Centavos Inteiros · Trava de Estoque SQL · Efí Bank mTLS · Focus NFe / SEFAZ",
      en: "Integer Cents · SQL Stock Locks · Efí Bank mTLS · Focus NFe / SEFAZ",
    },
    stackTags: ["Centavos Inteiros", "select_for_update()", "Efí PIX mTLS", "Focus NFe / SEFAZ", "Idempotency-Key", "Celery / Redis"],
    engineeringSpec: {
      pt: "Executa criação de pedidos, reserva condicional de estoque (anti-overselling), split automático de receita entre plataforma e lojistas e emissão de cupom fiscal NFC-e dentro de transações ACID.",
      en: "Executes order creation, conditional inventory reservation (anti-overselling), automated marketplace revenue split, and NFC-e tax receipt issuance inside ACID transactions.",
    },
    invariant: {
      pt: "Lei da Conservação: repasse_lojista + comissão == total_pago em inteiros exatos; replay de webhook nunca duplica saldo.",
      en: "Conservation Law: seller_payout + platform_fee == total_paid in exact integers; webhook replays never double-credit.",
    },
    slaPill: { pt: "ACID · Idempotência 100%", en: "ACID · 100% Idempotent" },
  },
  {
    id: "db",
    index: 3,
    baseY: -2.0,
    colorHex: "#10B981",
    code: "L1 · MULTI-TENANT POSTGRESQL + RLS",
    name: { pt: "Fundação PostgreSQL Multi-Tenant (RLS)", en: "Multi-Tenant PostgreSQL Foundation (RLS)" },
    subtitle: {
      pt: "Supabase PostgreSQL 16 · Row-Level Security · AES-256-GCM · Audit Trail LGPD",
      en: "Supabase PostgreSQL 16 · Row-Level Security · AES-256-GCM · LGPD Audit Trail",
    },
    stackTags: ["PostgreSQL 16", "Row-Level Security", "AES-256-GCM", "on_delete=PROTECT", "Snapshots Imutáveis", "Backup Verificado"],
    engineeringSpec: {
      pt: "Cada empresa SaaS opera isolada por políticas de Row-Level Security vinculadas ao tenant_id no próprio motor SQL. Preços históricos ficam congelados em snapshots e registros financeiros são protegidos por PROTECT.",
      en: "Every SaaS tenant is isolated by SQL Row-Level Security policies bound to tenant_id. Historical order prices are frozen in immutable snapshots and financial rows use PROTECT constraints.",
    },
    invariant: {
      pt: "Isolamento criptográfico e estrutural: mesmo que uma query esqueça o filtro de tenant, o PostgreSQL bloqueia a leitura cruzada.",
      en: "Structural & cryptographic isolation: even if an app query omits a tenant filter, PostgreSQL blocks cross-tenant reads.",
    },
    slaPill: { pt: "RLS Nativo · AES-256-GCM · LGPD", en: "Native RLS · AES-256-GCM · LGPD" },
  },
];

const FLOW_SCENARIOS: ArchFlowScenario[] = [
  {
    id: "pix",
    label: { pt: "Webhook PIX → Split → Ledger", en: "PIX Webhook → Split → Ledger" },
    shortLabel: { pt: "PIX & Split", en: "PIX & Split" },
    accentHex: "#F97316",
    latencyLabel: "~118ms end-to-end",
    product: "MySuperStore · MiseOn",
    pathLayers: ["edge", "tx", "db"],
    stepNotes: {
      edge: {
        pt: "Cloudflare + Edge valida certificado mTLS Efí Bank e assinatura HMAC SHA-256 na borda.",
        en: "Cloudflare + Edge verifies Efí Bank mTLS certificate and HMAC SHA-256 signature.",
      },
      ai: {
        pt: "Bypass direto: fluxo financeiro crítico nunca passa por LLM para manter determinismo total.",
        en: "Direct bypass: mission-critical payment flows never route through LLMs to preserve determinism.",
      },
      tx: {
        pt: "Trava Idempotency-Key, calcula split em centavos inteiros (comissão + repasse) e libera KDS/envio.",
        en: "Locks Idempotency-Key, computes integer-cent split (fee + seller payout), and releases KDS/fulfillment.",
      },
      db: {
        pt: "PostgreSQL confirma transação ACID com on_delete=PROTECT e grava trilha de auditoria imutável.",
        en: "PostgreSQL commits ACID transaction with on_delete=PROTECT and writes immutable audit log.",
      },
    },
  },
  {
    id: "ai-router",
    label: { pt: "Hub IA (Gemini · DeepSeek · Groq)", en: "AI Hub (Gemini · DeepSeek · Groq)" },
    shortLabel: { pt: "Hub IA Multi-LLM", en: "Multi-LLM Hub" },
    accentHex: "#F59E0B",
    latencyLabel: "Groq 190ms · Gemini 620ms",
    product: "Atol Connect · SelectSys · M-IA",
    pathLayers: ["edge", "ai", "db"],
    stepNotes: {
      edge: {
        pt: "Recebe mensagem WhatsApp Cloud API, currículo PDF ou pergunta do gerente no painel com rate limit.",
        en: "Receives WhatsApp Cloud API message, resume PDF, or manager query with edge rate limiting.",
      },
      ai: {
        pt: "Roteador escolhe Groq LPU (triagem real-time), Gemini (raciocínio/agentes) ou DeepSeek (tradução PT/JP/EN).",
        en: "Router picks Groq LPU (real-time triage), Gemini (agents/multimodal), or DeepSeek (PT/JP/EN translation).",
      },
      tx: {
        pt: "Sem mutação financeira direta — apenas leitura controlada via serviços de domínio autorizados.",
        en: "No direct financial mutation — read-only context via authorized domain services.",
      },
      db: {
        pt: "Consulta métricas reais filtradas por RLS (tenant_id) garantindo que a IA só enxergue dados daquela empresa.",
        en: "Queries real metrics filtered by RLS (tenant_id) so AI only sees that specific tenant's data.",
      },
    },
  },
  {
    id: "ifood",
    label: { pt: "Pedido iFood → KDS → Estoque PEPS", en: "iFood Order → KDS → FIFO Stock" },
    shortLabel: { pt: "iFood → KDS", en: "iFood → KDS" },
    accentHex: "#0EA5E9",
    latencyLabel: "~165ms sync",
    product: "MiseOn · MercadinhoSys",
    pathLayers: ["edge", "ai", "tx", "db"],
    stepNotes: {
      edge: {
        pt: "Webhook homologado iFood entra pela borda Vercel gru1 e aciona fila em tempo real da cozinha.",
        en: "Approved iFood webhook hits Vercel gru1 edge and triggers the live kitchen display queue.",
      },
      ai: {
        pt: "Ficha Técnica consulta tabela nutricional USDA FoodData Central e atualiza indicadores de CMV.",
        en: "Recipe engine cross-checks USDA FoodData Central nutrition table and updates COGS telemetry.",
      },
      tx: {
        pt: "Baixa cada ingrediente por PEPS (FIFO) com trava de estoque e dispara emissão fiscal NFC-e SEFAZ.",
        en: "Deducts each ingredient via FIFO with stock locking and triggers SEFAZ NFC-e tax receipt.",
      },
      db: {
        pt: "Persiste Order, snapshot de custo do insumo e saldo de estoque isolado por loja via RLS.",
        en: "Persists Order, ingredient cost snapshot, and per-store stock ledger isolated via RLS.",
      },
    },
  },
  {
    id: "rls",
    label: { pt: "Isolamento Multi-Tenant (RLS + AES)", en: "Multi-Tenant Isolation (RLS + AES)" },
    shortLabel: { pt: "Segurança RLS", en: "RLS Security" },
    accentHex: "#10B981",
    latencyLabel: "< 2ms overhead SQL",
    product: "Todos os 5 SaaS",
    pathLayers: ["edge", "tx", "db"],
    stepNotes: {
      edge: {
        pt: "Sessão HttpOnly + JWT assinado identifica o usuário e o tenant_id antes de entrar no backend.",
        en: "HttpOnly session + signed JWT resolves user identity and tenant_id before entering backend.",
      },
      ai: {
        pt: "Qualquer contexto enviado para Gemini/DeepSeek/Groq passa por sanitização LGPD de PII.",
        en: "Any context sent to Gemini/DeepSeek/Groq passes through LGPD PII sanitization.",
      },
      tx: {
        pt: "Middleware injeta `SET LOCAL app.tenant_id` na conexão transacional e descriptografa tokens via AES-256-GCM.",
        en: "Middleware injects `SET LOCAL app.tenant_id` on the DB transaction and decrypts tokens via AES-256-GCM.",
      },
      db: {
        pt: "Políticas RLS do PostgreSQL filtram cada SELECT/UPDATE na raiz — zero vazamento entre empresas.",
        en: "PostgreSQL RLS policies enforce isolation on every SELECT/UPDATE — zero cross-tenant leakage.",
      },
    },
  },
];

/* ------------------------------------------------------------------ *
 *  Three.js Scene Components (Pure WebGL via React Three Fiber)
 * ------------------------------------------------------------------ */

function IsometricPlate({
  layer,
  isSelected,
  isInFlow,
  exploded,
  isDark,
  onSelect,
}: {
  layer: ArchLayerSpec;
  isSelected: boolean;
  isInFlow: boolean;
  exploded: boolean;
  isDark: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => new THREE.Color(layer.colorHex), [layer.colorHex]);
  const plateBg = useMemo(
    () => new THREE.Color(isDark ? "#0d172a" : "#ffffff"),
    [isDark],
  );

  // Subtle circuit grid lines on top of each architectural slab
  const gridGeo = useMemo(() => {
    const pts: number[] = [];
    const half = 2.05;
    const step = 0.68;
    for (let x = -half; x <= half + 0.01; x += step) {
      pts.push(x, 0.11, -half, x, 0.11, half);
    }
    for (let z = -half; z <= half + 0.01; z += step) {
      pts.push(-half, 0.11, z, half, 0.11, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  // Architectural corner pillars / microservice nodes on top of the slab
  const nodePositions = useMemo(
    () => [
      [-1.35, 0.24, -1.15],
      [1.35, 0.24, -1.15],
      [-1.35, 0.24, 1.15],
      [1.35, 0.24, 1.15],
      [0, 0.28, 0],
    ] as [number, number, number][],
    [],
  );

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const spread = exploded ? 1.24 : 0.86;
    const targetY =
      layer.baseY * spread +
      (isSelected ? 0.14 : 0) +
      Math.sin(t * 1.1 + layer.index * 1.4) * 0.045;
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY, 0.08);

    const targetScale = isSelected ? 1.05 : hovered ? 1.025 : 1.0;
    g.scale.x = THREE.MathUtils.lerp(g.scale.x, targetScale, 0.1);
    g.scale.z = THREE.MathUtils.lerp(g.scale.z, targetScale, 0.1);

    if (glowMeshRef.current) {
      const mat = glowMeshRef.current.material as THREE.MeshBasicMaterial;
      const targetOp = isSelected ? 0.32 : isInFlow ? 0.18 : hovered ? 0.22 : 0.05;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.1);
    }
  });

  const borderOpacity = isSelected ? 0.98 : isInFlow ? 0.72 : hovered ? 0.85 : 0.35;

  return (
    <group
      ref={groupRef}
      position={[0, layer.baseY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Main glass-like architectural slab */}
      <mesh>
        <boxGeometry args={[4.4, 0.2, 4.4]} />
        <meshStandardMaterial
          color={plateBg}
          emissive={color}
          emissiveIntensity={isSelected ? 0.28 : isInFlow ? 0.14 : 0.05}
          metalness={isDark ? 0.45 : 0.15}
          roughness={isDark ? 0.28 : 0.35}
          transparent
          opacity={isDark ? 0.86 : 0.92}
        />
      </mesh>

      {/* Luminous rim frame around the slab */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(4.44, 0.22, 4.44)]} />
        <lineBasicMaterial color={color} transparent opacity={borderOpacity} />
      </lineSegments>

      {/* Subtle circuit grid on top surface */}
      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.32 : isDark ? 0.14 : 0.18}
        />
      </lineSegments>

      {/* Soft top energy glow plane when selected or in active flow */}
      <mesh ref={glowMeshRef} position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>

      {/* 3D Microservice / Infrastructure Nodes sitting on the layer */}
      {nodePositions.map((pos, idx) => {
        const isCenter = idx === 4;
        return (
          <mesh key={idx} position={pos}>
            {isCenter ? (
              <octahedronGeometry args={[0.24, 0]} />
            ) : (
              <boxGeometry args={[0.38, 0.18, 0.38]} />
            )}
            <meshStandardMaterial
              color={isCenter ? color : isDark ? "#1e293b" : "#e2e8f0"}
              emissive={color}
              emissiveIntensity={isCenter ? (isSelected || isInFlow ? 0.9 : 0.45) : isInFlow ? 0.35 : 0.12}
              metalness={0.5}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function VerticalDataConduits({
  activeFlow,
  exploded,
  isDark,
}: {
  activeFlow: ArchFlowScenario;
  exploded: boolean;
  isDark: boolean;
}) {
  const flowColor = useMemo(() => new THREE.Color(activeFlow.accentHex), [activeFlow.accentHex]);
  const idleColor = useMemo(() => new THREE.Color(isDark ? "#334155" : "#94a3b8"), [isDark]);

  // 4 vertical optical fiber columns connecting the 4 layers
  const pillars = useMemo(
    () => [
      [-1.35, -1.15],
      [1.35, -1.15],
      [-1.35, 1.15],
      [1.35, 1.15],
    ] as [number, number][],
    [],
  );

  // Traveling glowing data packets (16 spheres streaming up & down the conduits)
  const packetCount = 16;
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const packetSeeds = useMemo(
    () =>
      Array.from({ length: packetCount }, (_, i) => ({
        pillarIdx: i % 4,
        phase: (i / packetCount) * 1.0,
        speed: 0.24 + (i % 3) * 0.08,
        downward: i % 2 === 0,
      })),
    [],
  );

  const spread = exploded ? 1.24 : 0.86;
  const topY = ARCH_LAYERS[0].baseY * spread;
  const botY = ARCH_LAYERS[ARCH_LAYERS.length - 1].baseY * spread;
  const height = topY - botY;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    packetSeeds.forEach((seed, i) => {
      const m = packetRefs.current[i];
      if (!m) return;
      const p = (seed.phase + t * seed.speed) % 1;
      const y = seed.downward ? THREE.MathUtils.lerp(topY, botY, p) : THREE.MathUtils.lerp(botY, topY, p);
      const [px, pz] = pillars[seed.pillarIdx];
      m.position.set(px, y, pz);
      const pulse = 0.85 + Math.sin(t * 6 + i) * 0.22;
      m.scale.setScalar(pulse);
    });
  });

  return (
    <group>
      {/* Vertical optical conduits */}
      {pillars.map(([px, pz], idx) => (
        <mesh key={`conduit-${idx}`} position={[px, (topY + botY) / 2, pz]}>
          <cylinderGeometry args={[0.022, 0.022, height, 8]} />
          <meshBasicMaterial color={flowColor} transparent opacity={isDark ? 0.32 : 0.38} />
        </mesh>
      ))}

      {/* Central core spine */}
      <mesh position={[0, (topY + botY) / 2, 0]}>
        <cylinderGeometry args={[0.032, 0.032, height, 10]} />
        <meshBasicMaterial color={idleColor} transparent opacity={0.28} />
      </mesh>

      {/* Animated luminous data packets */}
      {packetSeeds.map((_, i) => (
        <mesh
          key={`pkt-${i}`}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshBasicMaterial color={flowColor} />
        </mesh>
      ))}
    </group>
  );
}

function ArchitectureStackScene({
  selectedLayerId,
  activeFlow,
  exploded,
  isDark,
  autoRotate,
  cameraAction,
  onSelectLayer,
}: {
  selectedLayerId: ArchLayerSpec["id"];
  activeFlow: ArchFlowScenario;
  exploded: boolean;
  isDark: boolean;
  autoRotate: boolean;
  cameraAction: CameraControlAction | null;
  onSelectLayer: (id: ArchLayerSpec["id"]) => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.65 : 0.98} />
      <directionalLight position={[6, 10, 8]} intensity={isDark ? 1.4 : 1.2} color="#ffffff" />
      <pointLight position={[-5, 3, 5]} intensity={1.15} color="#22B5F2" />
      <pointLight position={[5, -3, -4]} intensity={0.95} color="#10B981" />

      <AmbientStarfield
        count={280}
        radius={13}
        color={isDark ? "#38bdf8" : "#0284c7"}
        opacity={isDark ? 0.42 : 0.22}
      />

      <ThreeCameraRig
        defaultPosition={[5.4, 3.6, 6.2]}
        defaultTarget={[0, 0.1, 0]}
        minDistance={4.2}
        maxDistance={14.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.75}
        action={cameraAction}
      />

      <group>
        <VerticalDataConduits activeFlow={activeFlow} exploded={exploded} isDark={isDark} />
        {ARCH_LAYERS.map((layer) => (
          <IsometricPlate
            key={layer.id}
            layer={layer}
            isSelected={selectedLayerId === layer.id}
            isInFlow={activeFlow.pathLayers.includes(layer.id)}
            exploded={exploded}
            isDark={isDark}
            onSelect={() => onSelectLayer(layer.id)}
          />
        ))}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Exported Component: ArchitectureXRay3D
 * ------------------------------------------------------------------ */

export default function ArchitectureXRay3D() {
  const { lang } = useLang();
  const { resolvedTheme } = useTheme();
  const pt = lang === "pt";
  const L = (b: Bi) => b[lang];

  const [mounted, setMounted] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<ArchLayerSpec["id"]>("tx");
  const [activeFlowId, setActiveFlowId] = useState<ArchFlowScenario["id"]>("pix");
  const [exploded, setExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraAction, setCameraAction] = useState<CameraControlAction | null>(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const actionSeq = useRef(0);

  const focusLayer = (id: ArchLayerSpec["id"]) => {
    setSelectedLayerId(id);
    const layer = ARCH_LAYERS.find((l) => l.id === id);
    if (!layer) return;
    const spread = exploded ? 1.24 : 0.86;
    const y = layer.baseY * spread;
    actionSeq.current += 1;
    setCameraAction({
      type: "fly",
      seq: actionSeq.current,
      position: [4.9, y + 2.45, 5.5],
      target: [0, y, 0],
    });
  };

  const triggerCam = (type: "zoom-in" | "zoom-out" | "reset") => {
    actionSeq.current += 1;
    setCameraAction({ type, seq: actionSeq.current });
  };

  useEffect(() => {
    setMounted(true);
    setReducedMotion(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";

  const activeLayer = useMemo(
    () => ARCH_LAYERS.find((l) => l.id === selectedLayerId) ?? ARCH_LAYERS[0],
    [selectedLayerId],
  );

  const activeFlow = useMemo(
    () => FLOW_SCENARIOS.find((f) => f.id === activeFlowId) ?? FLOW_SCENARIOS[0],
    [activeFlowId],
  );

  function getFlowIcon(id: ArchFlowScenario["id"]) {
    switch (id) {
      case "pix":
        return <QrCode size={14} aria-hidden="true" />;
      case "ai-router":
        return <BrainCircuit size={14} aria-hidden="true" />;
      case "ifood":
        return <Utensils size={14} aria-hidden="true" />;
      case "rls":
        return <ShieldCheck size={14} aria-hidden="true" />;
    }
  }

  function getLayerIcon(id: ArchLayerSpec["id"]) {
    switch (id) {
      case "edge":
        return <Globe size={16} aria-hidden="true" />;
      case "ai":
        return <BrainCircuit size={16} aria-hidden="true" />;
      case "tx":
        return <Cpu size={16} aria-hidden="true" />;
      case "db":
        return <Database size={16} aria-hidden="true" />;
    }
  }

  return (
    <div className="arch3d-shell" ref={wrapRef}>
      {/* Top Scenario Simulation Bar */}
      <div className="arch3d-toolbar">
        <div
          className="arch3d-flow-tabs"
          role="tablist"
          aria-label={
            pt
              ? "Simular fluxos reais na arquitetura 3D"
              : "Simulate real production flows in 3D architecture"
          }
        >
          <span className="arch3d-toolbar-kicker">
            <Play size={13} aria-hidden="true" />
            {pt ? "Simular fluxo real:" : "Simulate live flow:"}
          </span>
          {FLOW_SCENARIOS.map((flow) => {
            const isOn = flow.id === activeFlowId;
            return (
              <button
                key={flow.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                className={`arch3d-flow-pill${isOn ? " is-active" : ""}`}
                style={
                  isOn
                    ? {
                        borderColor: flow.accentHex,
                        boxShadow: `0 0 0 2px ${flow.accentHex}28`,
                      }
                    : undefined
                }
                onClick={() => {
                  setActiveFlowId(flow.id);
                  setSelectedLayerId(flow.pathLayers[1] ?? flow.pathLayers[0]);
                }}
              >
                <span style={{ color: flow.accentHex }}>{getFlowIcon(flow.id)}</span>
                <span>{L(flow.shortLabel)}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="arch3d-explode-btn"
          onClick={() => setExploded((v) => !v)}
          aria-pressed={exploded}
        >
          <Layers size={14} aria-hidden="true" />
          <span>
            {exploded
              ? pt
                ? "Vista Expandida (Exploded)"
                : "Exploded View"
              : pt
                ? "Vista Compacta"
                : "Compact Stack"}
          </span>
        </button>
      </div>

      {/* Main Split: Left = Interactive Three.js WebGL Stage | Right = Engineering Blueprint Inspector */}
      <div className="arch3d-grid">
        {/* LEFT: Three.js Canvas + Layer Selector Overlay */}
        <div className="arch3d-stage">
          <div className="arch3d-webgl-badge">
            <span className="arch3d-live-dot" aria-hidden="true" />
            <span>THREE.JS WEBGL · {activeFlow.latencyLabel}</span>
          </div>

          <div className="arch3d-canvas-wrap">
            <Canvas
              camera={{ position: [5.4, 3.6, 6.2], fov: 38 }}
              dpr={[1, 1.75]}
              frameloop={visible && !reducedMotion ? "always" : "demand"}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              aria-label={
                pt
                  ? "Cena 3D interativa em Three.js mostrando as 4 camadas da arquitetura multi-tenant Maldivas Tech"
                  : "Interactive Three.js 3D scene displaying the 4 layers of Maldivas Tech multi-tenant architecture"
              }
            >
              <ArchitectureStackScene
                selectedLayerId={selectedLayerId}
                activeFlow={activeFlow}
                exploded={exploded}
                isDark={isDark}
                autoRotate={autoRotate && !reducedMotion}
                cameraAction={cameraAction}
                onSelectLayer={focusLayer}
              />
            </Canvas>

            <ThreeCameraHud
              pt={pt}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate((v) => !v)}
              onZoomIn={() => triggerCam("zoom-in")}
              onZoomOut={() => triggerCam("zoom-out")}
              onReset={() => triggerCam("reset")}
            />
          </div>

          {/* Interactive Layer Pills along the bottom of the 3D Stage */}
          <div className="arch3d-layer-rail" role="tablist" aria-label={pt ? "Camadas da arquitetura" : "Architecture layers"}>
            {ARCH_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const inFlow = activeFlow.pathLayers.includes(layer.id);
              return (
                <button
                  key={layer.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`arch3d-layer-chip${isSelected ? " is-selected" : ""}${
                    inFlow ? " is-in-flow" : ""
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: layer.colorHex,
                          boxShadow: `0 0 0 2px ${layer.colorHex}26`,
                        }
                      : undefined
                  }
                  onClick={() => focusLayer(layer.id)}
                >
                  <span
                    className="arch3d-layer-dot"
                    style={{ background: layer.colorHex }}
                    aria-hidden="true"
                  />
                  <span>{layer.code.split(" · ")[0]}</span>
                  <small>{L(layer.name).split(" ")[0]}</small>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Technical Blueprint & Active Flow Step-by-Step */}
        <aside
          className="arch3d-inspector"
          aria-live="polite"
          style={
            {
              "--arch-accent": activeLayer.colorHex,
            } as React.CSSProperties
          }
        >
          <div className="arch3d-inspector-top">
            <span className="arch3d-code-pill" style={{ color: activeLayer.colorHex }}>
              {activeLayer.code}
            </span>
            <span className="arch3d-sla-pill">{L(activeLayer.slaPill)}</span>
          </div>

          <div className="arch3d-inspector-head">
            <div
              className="arch3d-inspector-icon"
              style={{
                borderColor: activeLayer.colorHex,
                color: activeLayer.colorHex,
                background: `${activeLayer.colorHex}18`,
              }}
            >
              {getLayerIcon(activeLayer.id)}
            </div>
            <div>
              <h3>{L(activeLayer.name)}</h3>
              <p>{L(activeLayer.subtitle)}</p>
            </div>
          </div>

          {/* Stack Chips */}
          <div className="arch3d-stack-chips">
            {activeLayer.stackTags.map((tag) => (
              <span key={tag} className="arch3d-stack-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Active Flow Highlight on this Layer */}
          <div
            className="arch3d-flow-callout"
            style={{ borderLeftColor: activeFlow.accentHex }}
          >
            <div className="arch3d-flow-callout-head">
              <strong style={{ color: activeFlow.accentHex }}>
                {pt ? "NO FLUXO ATIVO:" : "IN ACTIVE FLOW:"} {L(activeFlow.label)}
              </strong>
              <span>{activeFlow.product}</span>
            </div>
            <p>{L(activeFlow.stepNotes[activeLayer.id])}</p>
          </div>

          {/* Engineering Responsibility */}
          <div className="arch3d-block">
            <h4>{pt ? "ARQUITETURA & RESPONSABILIDADE" : "ARCHITECTURE & RESPONSIBILITY"}</h4>
            <p>{L(activeLayer.engineeringSpec)}</p>
          </div>

          {/* Production Invariant */}
          <div className="arch3d-block is-invariant">
            <h4>
              <Lock size={12} aria-hidden="true" />{" "}
              {pt ? "INVARIANTE DE PRODUÇÃO GARANTIDA" : "GUARANTEED PRODUCTION INVARIANT"}
            </h4>
            <p>{L(activeLayer.invariant)}</p>
          </div>

          <div className="arch3d-foot-note">
            <CheckCircle2 size={14} aria-hidden="true" />
            <span>
              {pt
                ? "Mova o cursor sobre a cena 3D ou clique nas placas para inspecionar cada camada."
                : "Move cursor over the 3D scene or click any slab to inspect each architectural layer."}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

