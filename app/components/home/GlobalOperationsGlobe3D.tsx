"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Globe2,
  MapPin,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useLang } from "../../lib/i18n";
import { useTheme } from "next-themes";
import {
  AmbientStarfield,
  ThreeCameraHud,
  ThreeCameraRig,
  type CameraControlAction,
} from "./ThreeCameraRig";

type Bi = { pt: string; en: string };

type HubId = "sao-paulo" | "aichi-japan" | "us-east" | "meta-edge";
type CorridorId = "br-jp" | "br-us" | "br-edge";

interface GlobalHub {
  id: HubId;
  code: string;
  city: Bi;
  lat: number;
  lon: number;
  colorHex: string;
  role: Bi;
}

interface GlobalCorridor {
  id: CorridorId;
  from: HubId;
  to: HubId;
  colorHex: string;
  shortLabel: Bi;
  title: Bi;
  subtitle: Bi;
  latency: string;
  protocol: string;
  compliance: Bi;
  products: string[];
  apis: string[];
  engineeringSummary: Bi;
  productionMetric: Bi;
  targetRotY: number;
  targetRotX: number;
}

const GLOBE_RADIUS = 2.02;

const HUBS: GlobalHub[] = [
  {
    id: "sao-paulo",
    code: "GRU1 · HQ",
    city: { pt: "São Paulo, Brasil", en: "São Paulo, Brazil" },
    lat: -23.5505,
    lon: -46.6333,
    colorHex: "#0EA5E9",
    role: {
      pt: "Core PostgreSQL RLS, Vercel gru1 e operação dos 5 SaaS",
      en: "PostgreSQL RLS core, Vercel gru1 & 5 SaaS operations",
    },
  },
  {
    id: "aichi-japan",
    code: "NGO / HND · JP",
    city: { pt: "Aichi & Tóquio, Japão", en: "Aichi & Tokyo, Japan" },
    lat: 35.1815,
    lon: 136.9066,
    colorHex: "#F59E0B",
    role: {
      pt: "Operação Fujiarte Co., Ltd. · SelectSys Jobs + Cybozu Garoon",
      en: "Fujiarte Co., Ltd. live op · SelectSys Jobs + Cybozu Garoon",
    },
  },
  {
    id: "us-east",
    code: "IAD1 · US-EAST",
    city: { pt: "Ashburn / EUA", en: "Ashburn / US-East" },
    lat: 39.0438,
    lon: -77.4874,
    colorHex: "#10B981",
    role: {
      pt: "USDA FoodData Central, Google Gemini, Groq LPU & DeepSeek",
      en: "USDA FoodData Central, Google Gemini, Groq LPU & DeepSeek",
    },
  },
  {
    id: "meta-edge",
    code: "EDGE · GLOBAL",
    city: { pt: "Cloudflare & Meta Cloud", en: "Cloudflare & Meta Cloud" },
    lat: 48.8566,
    lon: 2.3522,
    colorHex: "#F97316",
    role: {
      pt: "WhatsApp Cloud API Webhooks HMAC, iFood & PIX Split",
      en: "WhatsApp Cloud API HMAC Webhooks, iFood & PIX Split",
    },
  },
];

const CORRIDORS: GlobalCorridor[] = [
  {
    id: "br-jp",
    from: "sao-paulo",
    to: "aichi-japan",
    colorHex: "#F59E0B",
    shortLabel: { pt: "Brasil ↔ Japão (Fujiarte)", en: "Brazil ↔ Japan (Fujiarte)" },
    title: {
      pt: "Corredor Internacional Brasil ↔ Japão",
      en: "Brazil ↔ Japan International Corridor",
    },
    subtitle: {
      pt: "Recrutamento dekassegui em produção com a Fujiarte Co., Ltd.",
      en: "Dekassegui hiring live in production with Fujiarte Co., Ltd.",
    },
    latency: "~245ms RTT · TLS 1.3",
    protocol: "HTTPS · REST · Cybozu Garoon Sync",
    compliance: {
      pt: "Conformidade dupla: LGPD (Brasil) + APPI (Japão)",
      en: "Dual compliance: LGPD (Brazil) + APPI (Japan)",
    },
    products: ["SelectSys Jobs"],
    apis: ["Cybozu Garoon", "Tesseract OCR", "DeepSeek PT/JP/EN", "Supabase RLS"],
    engineeringSummary: {
      pt: "Documentos brasileiros (passaporte, vistos, certidões) são lidos por OCR + IA, traduzidos em fluxo trilíngue (PT · JP · EN) e sincronizados diretamente com o Cybozu Garoon e planilhas .XLS no padrão das fábricas japonesas.",
      en: "Brazilian documents (passports, visas, certificates) are parsed via OCR + AI, translated in a trilingual pipeline (PT · JP · EN) and synced straight to Cybozu Garoon and factory-grade .XLS templates in Japan.",
    },
    productionMetric: {
      pt: "Fujiarte Co., Ltd.: −60% no tempo de triagem documental internacional.",
      en: "Fujiarte Co., Ltd.: −60% international document screening time.",
    },
    targetRotY: 0.78,
    targetRotX: 0.16,
  },
  {
    id: "br-us",
    from: "sao-paulo",
    to: "us-east",
    colorHex: "#10B981",
    shortLabel: { pt: "Brasil ↔ EUA (USDA & IA)", en: "Brazil ↔ US (USDA & AI)" },
    title: {
      pt: "Corredor de Dados & IA Brasil ↔ EUA",
      en: "Brazil ↔ US Data & AI Corridor",
    },
    subtitle: {
      pt: "API nutricional norte-americana + roteamento Multi-LLM em produção",
      en: "US nutritional data API + Multi-LLM routing in production",
    },
    latency: "~118ms RTT · Edge Streaming",
    protocol: "REST JSON · SSE Streaming · Fallback Determinístico",
    compliance: {
      pt: "PII Scrubbing antes do envio + Rate Limit por tenant",
      en: "Pre-flight PII Scrubbing + Per-Tenant Rate Limiting",
    },
    products: ["MiseOn", "MercadinhoSys", "Maldivas Academy"],
    apis: ["USDA FoodData Central", "Google Gemini", "Groq LPU", "DeepSeek AI"],
    engineeringSummary: {
      pt: "O MiseOn consulta a base oficial norte-americana USDA FoodData Central para ficha técnica e tabela nutricional automática, enquanto o roteador Multi-LLM combina Groq (<250ms), Gemini (multimodal) e DeepSeek (código/tradução).",
      en: "MiseOn queries the official US USDA FoodData Central database for automated nutrition facts and recipe costing, while the Multi-LLM router orchestrates Groq (<250ms), Gemini (multimodal) and DeepSeek (code/translation).",
    },
    productionMetric: {
      pt: "Respostas em tempo real com cache semântico e fallback determinístico sem queda.",
      en: "Real-time responses with semantic caching and zero-downtime deterministic fallback.",
    },
    targetRotY: 1.48,
    targetRotX: 0.18,
  },
  {
    id: "br-edge",
    from: "sao-paulo",
    to: "meta-edge",
    colorHex: "#0EA5E9",
    shortLabel: { pt: "Brasil ↔ Edge (WhatsApp & PIX)", en: "Brazil ↔ Edge (WhatsApp & PIX)" },
    title: {
      pt: "Malha Global de Webhooks, Mensageria e Pagamentos",
      en: "Global Webhooks, Messaging & Payments Mesh",
    },
    subtitle: {
      pt: "Ingestão assinada HMAC-SHA256 com entrega em baixa latência",
      en: "HMAC-SHA256 signed ingestion with low-latency delivery",
    },
    latency: "~42ms Edge · 99.95% SLA",
    protocol: "mTLS · HMAC-SHA256 · Webhooks Idempotentes",
    compliance: {
      pt: "Fail-closed em assinatura inválida + deduplicação de eventos",
      en: "Fail-closed on invalid signature + event deduplication",
    },
    products: ["Atol Connect", "MySuperStore", "MiseOn", "MercadinhoSys"],
    apis: ["WhatsApp Cloud API", "Efí Bank PIX Split", "iFood API", "BigDataCorp", "Cloudflare"],
    engineeringSummary: {
      pt: "Webhooks da Meta Cloud API, liquidações PIX com split da Efí Bank, pedidos do iFood e validações cadastrais via BigDataCorp trafegam por borda Cloudflare/Vercel com chave de idempotência e proteção contra replay.",
      en: "Meta Cloud API webhooks, Efí Bank PIX split settlements, iFood orders and BigDataCorp KYC validations flow through Cloudflare/Vercel edge with idempotency keys and replay protection.",
    },
    productionMetric: {
      pt: "Dinheiro sempre em centavos inteiros + zero cobrança ou envio duplicado.",
      en: "Integer-cent monetary math + zero duplicate charges or messages.",
    },
    targetRotY: 0.92,
    targetRotX: 0.24,
  },
];

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/* ------------------------------------------------------------------ *
 *  Three.js Globe Scene Components
 * ------------------------------------------------------------------ */

function FibonacciDotShell({ isDark }: { isDark: boolean }) {
  const dotGeo = useMemo(() => {
    const count = 1350;
    const positions = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      positions[i * 3] = x * (GLOBE_RADIUS + 0.015);
      positions[i * 3 + 1] = y * (GLOBE_RADIUS + 0.015);
      positions[i * 3 + 2] = z * (GLOBE_RADIUS + 0.015);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points geometry={dotGeo}>
      <pointsMaterial
        size={0.032}
        color={isDark ? "#38bdf8" : "#0284c7"}
        transparent
        opacity={isDark ? 0.52 : 0.45}
        sizeAttenuation
      />
    </points>
  );
}

function MeridianGrid({ isDark }: { isDark: boolean }) {
  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    const r = GLOBE_RADIUS + 0.004;
    // Latitude parallels
    for (const lat of [-60, -30, 0, 30, 60]) {
      const segs = 64;
      for (let i = 0; i < segs; i++) {
        const a = latLonToVec3(lat, (i / segs) * 360 - 180, r);
        const b = latLonToVec3(lat, ((i + 1) / segs) * 360 - 180, r);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    // Longitude meridians
    for (let lon = -180; lon < 180; lon += 30) {
      const segs = 48;
      for (let i = 0; i < segs; i++) {
        const latA = -84 + (i / segs) * 168;
        const latB = -84 + ((i + 1) / segs) * 168;
        const a = latLonToVec3(latA, lon, r);
        const b = latLonToVec3(latB, lon, r);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={lineGeo}>
      <lineBasicMaterial
        color={isDark ? "#1e3a5f" : "#cbd5e1"}
        transparent
        opacity={isDark ? 0.42 : 0.55}
      />
    </lineSegments>
  );
}

function HubBeacon({
  hub,
  isHighlighted,
  onSelect,
}: {
  hub: GlobalHub;
  isHighlighted: boolean;
  onSelect: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(
    () => latLonToVec3(hub.lat, hub.lon, GLOBE_RADIUS + 0.03),
    [hub.lat, hub.lon],
  );
  const normal = useMemo(() => pos.clone().normalize(), [pos]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);
  const towerQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return q;
  }, [normal]);
  const color = useMemo(() => new THREE.Color(hub.colorHex), [hub.colorHex]);
  const towerHeight = isHighlighted ? 0.34 : 0.16;

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.getElapsedTime() * 0.9 + hub.lat * 0.05) % 1;
    const s = 0.8 + t * (isHighlighted ? 2.4 : 1.4);
    ringRef.current.scale.set(s, s, 1);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - t) * (isHighlighted ? 0.9 : 0.48);
  });

  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Glowing Surface Core */}
      <mesh>
        <sphereGeometry args={[isHighlighted ? 0.088 : 0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 1.7 : 0.9}
        />
      </mesh>
      {/* Vertical Telemetry Pillar protruding from city coordinates */}
      <group quaternion={towerQuat}>
        <mesh position={[0, towerHeight / 2, 0]}>
          <cylinderGeometry args={[0.012, 0.026, towerHeight, 10]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHighlighted ? 1.4 : 0.6}
            transparent
            opacity={isHighlighted ? 0.95 : 0.65}
          />
        </mesh>
      </group>
      {/* Expanding Radar Pulse Ring */}
      <mesh ref={ringRef} quaternion={quat}>
        <ringGeometry args={[0.08, 0.12, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.68} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CorridorArc({
  corridor,
  isActive,
  speedOffset,
}: {
  corridor: GlobalCorridor;
  isActive: boolean;
  speedOffset: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);

  const { curve, tubeGeo } = useMemo(() => {
    const fromHub = HUBS.find((h) => h.id === corridor.from)!;
    const toHub = HUBS.find((h) => h.id === corridor.to)!;
    const start = latLonToVec3(fromHub.lat, fromHub.lon, GLOBE_RADIUS + 0.025);
    const end = latLonToVec3(toHub.lat, toHub.lon, GLOBE_RADIUS + 0.025);
    const dist = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    // Elevate midpoint proportional to great-circle distance
    mid.normalize().multiplyScalar(GLOBE_RADIUS + 0.48 + dist * 0.24);
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const g = new THREE.TubeGeometry(c, 56, isActive ? 0.022 : 0.011, 8, false);
    return { curve: c, tubeGeo: g };
  }, [corridor.from, corridor.to, isActive]);

  const color = useMemo(() => new THREE.Color(corridor.colorHex), [corridor.colorHex]);

  useFrame(({ clock }) => {
    const t1 = (clock.getElapsedTime() * (isActive ? 0.36 : 0.22) + speedOffset) % 1;
    const t2 = (t1 + 0.5) % 1;
    if (pulseRef.current) {
      curve.getPoint(t1, pulseRef.current.position);
    }
    if (pulseRef2.current) {
      curve.getPoint(1 - t2, pulseRef2.current.position);
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.92 : 0.34}
        />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[isActive ? 0.062 : 0.038, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={pulseRef2}>
        <sphereGeometry args={[isActive ? 0.048 : 0.028, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function GlobeScene({
  activeCorridor,
  isDark,
  autoRotate,
  cameraAction,
  onSelectHub,
}: {
  activeCorridor: GlobalCorridor;
  isDark: boolean;
  autoRotate: boolean;
  cameraAction: CameraControlAction | null;
  onSelectHub: (hubId: HubId) => void;
}) {
  const orbitRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = clock.getElapsedTime() * 0.18;
    }
  });

  return (
    <>
      <ambientLight intensity={isDark ? 0.65 : 1.05} />
      <directionalLight position={[6, 5, 6]} intensity={isDark ? 1.3 : 1.15} color="#ffffff" />
      <pointLight position={[-5, -3, 4]} intensity={0.75} color="#0EA5E9" />
      <pointLight position={[4, 4, -4]} intensity={0.65} color="#F59E0B" />

      <AmbientStarfield
        count={320}
        radius={11}
        color={isDark ? "#38bdf8" : "#0284c7"}
        opacity={isDark ? 0.45 : 0.25}
      />

      <ThreeCameraRig
        defaultPosition={[0.6, 1.15, 5.45]}
        defaultTarget={[0, 0, 0]}
        minDistance={3.05}
        maxDistance={9.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.85}
        action={cameraAction}
      />

      <group>
        {/* Core Translucent Sphere */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
          <meshStandardMaterial
            color={isDark ? "#081426" : "#e0f2fe"}
            metalness={isDark ? 0.38 : 0.1}
            roughness={isDark ? 0.5 : 0.42}
            transparent
            opacity={isDark ? 0.92 : 0.84}
          />
        </mesh>

        {/* Outer Atmospheric Halo */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.14, 40, 40]} />
          <meshBasicMaterial
            color={isDark ? "#0EA5E9" : "#38bdf8"}
            transparent
            opacity={isDark ? 0.09 : 0.11}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Subtle Inclined Orbital Satellite Ring */}
        <mesh ref={orbitRingRef} rotation={[1.22, 0.35, 0]}>
          <torusGeometry args={[GLOBE_RADIUS + 0.44, 0.008, 12, 96]} />
          <meshBasicMaterial
            color={isDark ? "#38bdf8" : "#0284c7"}
            transparent
            opacity={0.28}
          />
        </mesh>

        <MeridianGrid isDark={isDark} />
        <FibonacciDotShell isDark={isDark} />

        {/* 3D Orbital Telemetry Arcs */}
        {CORRIDORS.map((corridor, idx) => (
          <CorridorArc
            key={corridor.id}
            corridor={corridor}
            isActive={corridor.id === activeCorridor.id}
            speedOffset={idx * 0.33}
          />
        ))}

        {/* Geographic City Beacons */}
        {HUBS.map((hub) => {
          const isHighlighted =
            hub.id === activeCorridor.from || hub.id === activeCorridor.to;
          return (
            <HubBeacon
              key={hub.id}
              hub={hub}
              isHighlighted={isHighlighted}
              onSelect={() => onSelectHub(hub.id)}
            />
          );
        })}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Main Component
 * ------------------------------------------------------------------ */

export default function GlobalOperationsGlobe3D() {
  const { lang } = useLang();
  const { resolvedTheme } = useTheme();
  const pt = lang === "pt";
  const isDark = resolvedTheme !== "light";
  const L = (b: Bi) => b[lang];

  const [activeCorridorId, setActiveCorridorId] = useState<CorridorId>("br-jp");
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraAction, setCameraAction] = useState<CameraControlAction | null>(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const actionSeq = useRef(0);

  const flyToCorridor = (corridorId: CorridorId) => {
    setActiveCorridorId(corridorId);
    const c = CORRIDORS.find((item) => item.id === corridorId) ?? CORRIDORS[0];
    const fromH = HUBS.find((h) => h.id === c.from)!;
    const toH = HUBS.find((h) => h.id === c.to)!;
    const mid = latLonToVec3(fromH.lat, fromH.lon, 1)
      .add(latLonToVec3(toH.lat, toH.lon, 1))
      .normalize()
      .multiplyScalar(5.35);
    actionSeq.current += 1;
    setCameraAction({
      type: "fly",
      seq: actionSeq.current,
      position: [mid.x, Math.max(mid.y, 0.7), mid.z],
      target: [0, 0, 0],
    });
  };

  const triggerCam = (type: "zoom-in" | "zoom-out" | "reset") => {
    actionSeq.current += 1;
    setCameraAction({ type, seq: actionSeq.current });
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

  const activeCorridor = useMemo(
    () => CORRIDORS.find((c) => c.id === activeCorridorId) ?? CORRIDORS[0],
    [activeCorridorId],
  );

  const fromHub = HUBS.find((h) => h.id === activeCorridor.from)!;
  const toHub = HUBS.find((h) => h.id === activeCorridor.to)!;

  const handleSelectHub = (hubId: HubId) => {
    if (hubId === "aichi-japan") flyToCorridor("br-jp");
    else if (hubId === "us-east") flyToCorridor("br-us");
    else if (hubId === "meta-edge") flyToCorridor("br-edge");
  };

  return (
    <div className="globe3d-shell" ref={wrapRef}>
      {/* Top Corridor Selector Bar */}
      <div className="globe3d-toolbar" role="tablist" aria-label={pt ? "Corredores internacionais em produção" : "International production corridors"}>
        <span className="globe3d-kicker">
          <Radio size={14} aria-hidden="true" />
          {pt ? "Rotas ativas em produção:" : "Live production routes:"}
        </span>
        <div className="globe3d-tabs">
          {CORRIDORS.map((corridor) => {
            const isOn = corridor.id === activeCorridorId;
            return (
              <button
                key={corridor.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                className={`globe3d-tab${isOn ? " is-active" : ""}`}
                style={
                  isOn
                    ? {
                        borderColor: corridor.colorHex,
                        boxShadow: `0 0 0 2px ${corridor.colorHex}26`,
                      }
                    : undefined
                }
                onClick={() => flyToCorridor(corridor.id)}
              >
                <span
                  className="globe3d-dot"
                  style={{ background: corridor.colorHex }}
                  aria-hidden="true"
                />
                <span>{L(corridor.shortLabel)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 3D Globe Stage + Corridor Telemetry Panel */}
      <div className="globe3d-grid">
        <div className="globe3d-stage">
          <div className="globe3d-hud-top">
            <span className="globe3d-live-pill">
              <span className="globe3d-live-dot" aria-hidden="true" />
              THREE.JS GLOBE · {activeCorridor.latency}
            </span>
            <span className="globe3d-coord-pill">
              {fromHub.code} <ArrowRight size={11} aria-hidden="true" /> {toHub.code}
            </span>
          </div>

          <div className="globe3d-canvas-wrap">
            <Canvas
              camera={{ position: [0.6, 1.15, 5.45], fov: 40 }}
              dpr={[1, 1.75]}
              frameloop={visible && !reducedMotion ? "always" : "demand"}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              aria-label={
                pt
                  ? "Globo 3D interativo em Three.js mostrando rotas reais entre São Paulo, Japão e Estados Unidos"
                  : "Interactive Three.js 3D globe displaying live production routes between São Paulo, Japan and the United States"
              }
            >
              <GlobeScene
                activeCorridor={activeCorridor}
                isDark={isDark}
                autoRotate={autoRotate && !reducedMotion}
                cameraAction={cameraAction}
                onSelectHub={handleSelectHub}
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

          {/* Bottom Geographic Nodes Strip */}
          <div className="globe3d-hubs-strip">
            {HUBS.map((hub) => {
              const active = hub.id === fromHub.id || hub.id === toHub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  className={`globe3d-hub-chip${active ? " is-active" : ""}`}
                  style={active ? { borderColor: hub.colorHex } : undefined}
                  onClick={() => handleSelectHub(hub.id)}
                >
                  <MapPin size={12} style={{ color: hub.colorHex }} aria-hidden="true" />
                  <span>{L(hub.city)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Telemetry Inspector */}
        <aside className="globe3d-panel" aria-live="polite">
          <div className="globe3d-panel-top">
            <span
              className="globe3d-route-badge"
              style={{
                color: activeCorridor.colorHex,
                borderColor: `${activeCorridor.colorHex}55`,
                background: `${activeCorridor.colorHex}14`,
              }}
            >
              <Globe2 size={13} aria-hidden="true" />
              {activeCorridor.protocol}
            </span>
          </div>

          <h3>{L(activeCorridor.title)}</h3>
          <p className="globe3d-subtitle">{L(activeCorridor.subtitle)}</p>

          <div className="globe3d-endpoints">
            <div className="globe3d-endpoint">
              <small>{pt ? "ORIGEM" : "ORIGIN"}</small>
              <strong>{L(fromHub.city)}</strong>
              <span>{fromHub.code}</span>
            </div>
            <ArrowRight size={16} className="globe3d-arrow" aria-hidden="true" />
            <div className="globe3d-endpoint">
              <small>{pt ? "DESTINO" : "DESTINATION"}</small>
              <strong>{L(toHub.city)}</strong>
              <span>{toHub.code}</span>
            </div>
          </div>

          <div className="globe3d-section">
            <h4>{pt ? "PRODUTOS & APIS NESTA ROTA" : "PRODUCTS & APIS ON THIS ROUTE"}</h4>
            <div className="globe3d-chips">
              {activeCorridor.products.map((prod) => (
                <span key={prod} className="globe3d-chip is-product">
                  {prod}
                </span>
              ))}
              {activeCorridor.apis.map((api) => (
                <span key={api} className="globe3d-chip">
                  {api}
                </span>
              ))}
            </div>
          </div>

          <div className="globe3d-section">
            <h4>
              <Activity size={12} aria-hidden="true" />{" "}
              {pt ? "FLUXO TÉCNICO EM PRODUÇÃO" : "PRODUCTION TECHNICAL FLOW"}
            </h4>
            <p>{L(activeCorridor.engineeringSummary)}</p>
          </div>

          <div className="globe3d-compliance">
            <ShieldCheck size={15} aria-hidden="true" />
            <div>
              <strong>{L(activeCorridor.compliance)}</strong>
              <span>{L(activeCorridor.productionMetric)}</span>
            </div>
          </div>

          <div className="globe3d-foot">
            <CheckCircle2 size={14} aria-hidden="true" />
            <span>
              {pt
                ? "Mova o cursor sobre o globo 3D ou selecione um corredor acima para focar a rota."
                : "Move cursor over the 3D globe or pick a corridor above to focus the route."}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

