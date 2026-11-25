"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { META_BRL } from "../../lib/whatsapp-tco";

/* ------------------------------------------------------------------ *
 *  Modelo vivo da tarifa da WhatsApp Cloud API (regras desde 01/10/2026)
 *
 *  O 3D existe para mostrar o que o texto explica mal: DE ONDE vem o
 *  custo de cada mensagem. Cada partícula é uma mensagem, com a cor da
 *  categoria e o trajeto real:
 *
 *   service   cliente → Atol → sistema     franquia 1.000 grátis/número
 *   utility   sistema → Atol → cliente     R$ 0,035 por entregue
 *   marketing sistema → Atol → cliente     R$ 0,3217 por entregue
 *   coexist   celular da equipe → cliente  NÃO passa pela API: R$ 0,00
 *
 *  O painel soma as entregas e o custo Meta da simulação com as mesmas
 *  constantes da calculadora (lib/whatsapp-tco). Pausa fora da tela e
 *  com prefers-reduced-motion (aí mostra o estado estático + legenda).
 * ------------------------------------------------------------------ */

export type EcoNode = { id: string; label: string; sub: string; color: string; href: string };
export type MsgKind = "service" | "utility" | "marketing" | "coexist";

export const KIND_COLOR: Record<MsgKind, string> = {
  service: "#25d366",
  utility: "#38bdf8",
  marketing: "#f5b942",
  coexist: "#e5e7eb",
};

/** Mix de tráfego de um restaurante típico (mesma ordem de grandeza do preset da calculadora). */
const MIX: [MsgKind, number][] = [
  ["service", 0.42],
  ["utility", 0.3],
  ["marketing", 0.08],
  ["coexist", 0.2],
];
const pickKind = (): MsgKind => {
  let r = Math.random();
  for (const [k, w] of MIX) {
    if ((r -= w) <= 0) return k;
  }
  return "service";
};

const CORE = new THREE.Vector3(0, 0, 0);
const PHONE = new THREE.Vector3(-1.05, -1.25, 0.9);
const ATOL = new THREE.Color(KIND_COLOR.service);

function orbitPos(i: number, n: number, t: number, r = 2.3) {
  const a = (i / n) * Math.PI * 2 + t * 0.08;
  return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2) * 0.22, Math.sin(a) * r * 0.6);
}
const customerPoint = (v: THREE.Vector3) =>
  v.setFromSphericalCoords(3.7 + Math.random() * 0.5, 0.35 + Math.random() * (Math.PI - 0.7), Math.random() * Math.PI * 2);

/* ------------------------------ peças ------------------------------ */

function Core() {
  const wire = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (wire.current) wire.current.rotation.y = clock.getElapsedTime() * 0.25;
  });
  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color={ATOL} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#0d2b1e" />
      </mesh>
    </group>
  );
}

function Phone() {
  return (
    <group position={PHONE}>
      <mesh>
        <boxGeometry args={[0.22, 0.4, 0.04]} />
        <meshBasicMaterial color={KIND_COLOR.coexist} wireframe />
      </mesh>
    </group>
  );
}

/** Esfera tênue onde vivem os clientes (contexto, não protagonista). */
function CustomerShell() {
  return (
    <mesh>
      <sphereGeometry args={[3.9, 24, 16]} />
      <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.045} />
    </mesh>
  );
}

function Systems({ nodes, positions }: { nodes: EcoNode[]; positions: React.MutableRefObject<THREE.Vector3[]> }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const colors = useMemo(() => nodes.map((n) => new THREE.Color(n.color)), [nodes]);
  const lineGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const linePos = useMemo(() => new Float32Array(nodes.length * 6), [nodes.length]);
  useEffect(() => {
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  }, [lineGeo, linePos]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    nodes.forEach((_, i) => {
      const p = orbitPos(i, nodes.length, t);
      positions.current[i] = p;
      refs.current[i]?.position.copy(p);
      linePos.set([0, 0, 0, p.x, p.y, p.z], i * 6);
    });
    const a = lineGeo.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (a) a.needsUpdate = true;
  });

  return (
    <>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.18} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={n.id} ref={(m) => { refs.current[i] = m; }}>
          <octahedronGeometry args={[0.17, 0]} />
          <meshBasicMaterial color={colors[i]} />
        </mesh>
      ))}
    </>
  );
}

type Particle = { kind: MsgKind; sys: number; cust: THREE.Vector3; t: number; speed: number };

/** Pool fixo de mensagens; cada uma percorre o trajeto real da sua categoria. */
function Messages({
  positions,
  count,
  onDelivered,
}: {
  positions: React.MutableRefObject<THREE.Vector3[]>;
  count: number;
  onDelivered: (k: MsgKind) => void;
}) {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = useMemo(() => new Float32Array(count * 3), [count]);
  const col = useMemo(() => new Float32Array(count * 3), [count]);
  const colorOf = useMemo(
    () => Object.fromEntries((Object.keys(KIND_COLOR) as MsgKind[]).map((k) => [k, new THREE.Color(KIND_COLOR[k])])) as Record<MsgKind, THREE.Color>,
    [],
  );
  const ps = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, () => ({
        kind: pickKind(),
        sys: Math.floor(Math.random() * 4),
        cust: customerPoint(new THREE.Vector3()),
        t: Math.random(),
        speed: 0.16 + Math.random() * 0.12,
      })),
    [count],
  );
  useEffect(() => {
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }, [geo, pos, col]);

  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const n = Math.max(1, positions.current.length);
    ps.forEach((p, i) => {
      p.t += d * p.speed;
      if (p.t >= 1) {
        onDelivered(p.kind);
        p.t = 0;
        p.kind = pickKind();
        p.sys = Math.floor(Math.random() * n);
        customerPoint(p.cust);
      }
      const sys = positions.current[p.sys] ?? CORE;
      const t = p.t;
      if (p.kind === "coexist") {
        v.copy(PHONE).lerp(p.cust, t); // celular → cliente, sem passar pela API
      } else if (p.kind === "service") {
        if (t < 0.5) v.copy(p.cust).lerp(CORE, t * 2);
        else v.copy(CORE).lerp(sys, (t - 0.5) * 2);
      } else {
        if (t < 0.5) v.copy(sys).lerp(CORE, t * 2);
        else v.copy(CORE).lerp(p.cust, (t - 0.5) * 2);
      }
      pos.set([v.x, v.y, v.z], i * 3);
      const c = colorOf[p.kind];
      col.set([c.r, c.g, c.b], i * 3);
    });
    const a = geo.getAttribute("position") as THREE.BufferAttribute | undefined;
    const b = geo.getAttribute("color") as THREE.BufferAttribute | undefined;
    if (a) a.needsUpdate = true;
    if (b) b.needsUpdate = true;
  });

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.075} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene({
  nodes,
  onProject,
  onDelivered,
}: {
  nodes: EcoNode[];
  onProject: (xy: { x: number; y: number; z: number }[]) => void;
  onDelivered: (k: MsgKind) => void;
}) {
  const positions = useRef<THREE.Vector3[]>(nodes.map((_, i) => orbitPos(i, nodes.length, 0)));
  const group = useRef<THREE.Group>(null);
  const frame = useRef(0);

  useFrame(({ camera, pointer, size }) => {
    const g = group.current;
    if (!g) return;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.16 + pointer.y * 0.08, 0.04);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.18, 0.04);
    if (++frame.current % 3 === 0) {
      g.updateMatrixWorld();
      const pts = [...positions.current, PHONE].map((p) => {
        const s = p.clone().applyMatrix4(g.matrixWorld).project(camera);
        return { x: (s.x * 0.5 + 0.5) * size.width, y: (-s.y * 0.5 + 0.5) * size.height, z: s.z };
      });
      onProject(pts);
    }
  });

  return (
    <group ref={group}>
      <CustomerShell />
      <Core />
      <Phone />
      <Systems nodes={nodes} positions={positions} />
      <Messages positions={positions} count={70} onDelivered={onDelivered} />
    </group>
  );
}

/* ------------------------------ painel ------------------------------ */

const ZERO: Record<MsgKind, number> = { service: 0, utility: 0, marketing: 0, coexist: 0 };

export default function EcosystemScene({
  nodes,
  coreLabel,
  lang = "pt",
}: {
  nodes: EcoNode[];
  coreLabel: { title: string; sub: string; href: string };
  lang?: "pt" | "en";
}) {
  const pt = lang === "pt";
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [labels, setLabels] = useState<{ x: number; y: number; z: number }[]>([]);
  const tally = useRef<Record<MsgKind, number>>({ ...ZERO });
  const [shown, setShown] = useState<Record<MsgKind, number>>({ ...ZERO });

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // contador do painel: 2x por segundo basta (não re-renderiza a cada frame)
  useEffect(() => {
    if (!visible || reduced) return;
    const id = setInterval(() => setShown({ ...tally.current }), 500);
    return () => clearInterval(id);
  }, [visible, reduced]);

  const cost = shown.utility * META_BRL.utility + shown.marketing * META_BRL.marketing; // serviço dentro da franquia
  const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const legend: { k: MsgKind; label: string; rate: string }[] = [
    { k: "service", label: pt ? "Cliente → sistema (serviço)" : "Customer → system (service)", rate: pt ? "1.000 grátis/mês" : "1,000 free/mo" },
    { k: "utility", label: pt ? "Aviso do sistema (utilidade)" : "System notice (utility)", rate: "R$ 0,035" },
    { k: "marketing", label: pt ? "Campanha (marketing)" : "Campaign (marketing)", rate: "R$ 0,3217" },
    { k: "coexist", label: pt ? "Resposta no celular" : "Reply from phone", rate: "R$ 0,00" },
  ];

  return (
    <div className="eco" ref={wrap}>
      <Canvas
        className="eco-canvas"
        camera={{ position: [0, 0.4, 7.4], fov: 40 }}
        dpr={[1, 1.75]}
        frameloop={visible && !reduced ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        aria-hidden="true"
      >
        <Scene nodes={nodes} onProject={setLabels} onDelivered={(k) => (tally.current[k] += 1)} />
      </Canvas>

      <a className="eco-core" href={coreLabel.href} data-analytics="atol_connect_click">
        <strong>{coreLabel.title}</strong>
        <span>{coreLabel.sub}</span>
      </a>

      {nodes.map((n, i) => {
        const p = labels[i];
        if (!p) return null;
        return (
          <a key={n.id} className="eco-label" href={n.href} style={{ transform: `translate(${p.x}px, ${p.y}px)` }} data-analytics="product_click">
            <i style={{ background: n.color }} aria-hidden="true" />
            <strong>{n.label}</strong>
            <span>{n.sub}</span>
          </a>
        );
      })}
      {labels[nodes.length] && (
        <span className="eco-label is-phone" style={{ transform: `translate(${labels[nodes.length].x}px, ${labels[nodes.length].y}px)` }}>
          <strong>{pt ? "Celular da equipe" : "Team phone"}</strong>
          <span>{pt ? "Coexistência" : "Coexistence"}</span>
        </span>
      )}

      <div className="eco-hud" aria-live="off">
        <ul>
          {legend.map((l) => (
            <li key={l.k}>
              <i style={{ background: KIND_COLOR[l.k] }} aria-hidden="true" />
              <span>{l.label}</span>
              <b>{l.rate}</b>
              {!reduced && <em>{shown[l.k].toLocaleString("pt-BR")}</em>}
            </li>
          ))}
        </ul>
        {!reduced && (
          <p>
            {pt ? "Custo Meta desta simulação" : "Meta cost in this simulation"}: <strong>{brl(cost)}</strong>
            <small>{pt ? " · markup Atol R$ 0,00" : " · Atol markup BRL 0.00"}</small>
          </p>
        )}
      </div>
    </div>
  );
}
