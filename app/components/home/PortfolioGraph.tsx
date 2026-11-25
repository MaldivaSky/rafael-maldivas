"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 *  Grafo de integrações reais do portfólio Maldivas Tech.
 *
 *  Anel interno: os 5 produtos. Anel externo: os sistemas de terceiros
 *  com que cada produto conversa EM PRODUÇÃO (só arestas que existem no
 *  código). Pacotes de dados percorrem as arestas. Ao passar o mouse
 *  (ou focar com teclado) num produto, só as integrações dele acendem:
 *  a cena vira um mapa técnico legível, não decoração.
 * ------------------------------------------------------------------ */

export type GraphProduct = { id: string; label: string; sub: string; href: string };
export type GraphIntegration = { id: string; label: string };
export type GraphEdge = [productId: string, integrationId: string];

const ACCENT = new THREE.Color("#38bdf8");
const DIM = new THREE.Color("#475569");
const PRODUCT = new THREE.Color("#e2e8f0");

function ring(n: number, r: number, y: number, phase = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * r, y + Math.sin(a * 3) * 0.12, Math.sin(a) * r * 0.82);
  });
}

function Graph({
  products,
  integrations,
  edges,
  active,
  onProject,
}: {
  products: GraphProduct[];
  integrations: GraphIntegration[];
  edges: GraphEdge[];
  active: string | null;
  onProject: (p: { x: number; y: number; z: number }[]) => void;
}) {
  const pPos = useMemo(() => ring(products.length, 2.1, 0.05, -Math.PI / 2), [products.length]);
  const iPos = useMemo(() => ring(integrations.length, 3.9, -0.05, -Math.PI / 2 + Math.PI / integrations.length), [integrations.length]);
  const idx = useMemo(() => {
    const p = new Map(products.map((x, i) => [x.id, i]));
    const it = new Map(integrations.map((x, i) => [x.id, i]));
    return edges
      .map(([a, b]) => ({ p: p.get(a), i: it.get(b), pid: a }))
      .filter((e): e is { p: number; i: number; pid: string } => e.p !== undefined && e.i !== undefined);
  }, [products, integrations, edges]);

  // arestas (cor por vértice → destaque sem recriar geometria)
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(idx.length * 6);
    idx.forEach((e, k) => {
      const a = pPos[e.p];
      const b = iPos[e.i];
      pos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6);
    });
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(idx.length * 6), 3));
    return g;
  }, [idx, pPos, iPos]);

  // pacotes: 3 por aresta, em fases diferentes, indo e voltando (request/response)
  const PER = 3;
  const pktGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(idx.length * PER * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(idx.length * PER * 3), 3));
    return g;
  }, [idx.length]);
  const phases = useMemo(() => Float32Array.from({ length: idx.length * PER }, () => Math.random()), [idx.length]);

  const group = useRef<THREE.Group>(null);
  const prodRefs = useRef<(THREE.Mesh | null)[]>([]);
  const frame = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, camera, pointer, size }, dt) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    // anel no plano XZ: inclinar ~60° para ler a topologia (de frente vira uma linha)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, Math.sin(t * 0.05) * 0.25 + pointer.x * 0.2, 0.03);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.78 + pointer.y * 0.06, 0.05);

    const ec = edgeGeo.getAttribute("color") as THREE.BufferAttribute;
    const pp = pktGeo.getAttribute("position") as THREE.BufferAttribute;
    const pc = pktGeo.getAttribute("color") as THREE.BufferAttribute;
    const d = Math.min(dt, 0.05);

    idx.forEach((e, k) => {
      const on = !active || active === e.pid;
      const c = active ? (on ? ACCENT : DIM) : DIM.clone().lerp(ACCENT, 0.45);
      (ec.array as Float32Array).set([c.r, c.g, c.b, c.r, c.g, c.b], k * 6);
      for (let j = 0; j < PER; j++) {
        const n = k * PER + j;
        phases[n] = (phases[n] + d * (on ? 0.32 : 0.12)) % 1;
        const ph = phases[n];
        const s = ph < 0.5 ? ph * 2 : 2 - ph * 2; // vai e volta
        tmp.copy(pPos[e.p]).lerp(iPos[e.i], s);
        (pp.array as Float32Array).set([tmp.x, tmp.y, tmp.z], n * 3);
        const pc3 = on ? ACCENT : DIM;
        (pc.array as Float32Array).set([pc3.r, pc3.g, pc3.b], n * 3);
      }
    });
    ec.needsUpdate = true;
    pp.needsUpdate = true;
    pc.needsUpdate = true;

    products.forEach((p, i) => {
      const m = prodRefs.current[i];
      if (!m) return;
      const target = active === p.id ? 1.35 : 1;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, target, 0.12));
      m.rotation.y = t * 0.4 + i;
    });

    if (++frame.current % 3 === 0) {
      g.updateMatrixWorld();
      const all = [...pPos, ...iPos].map((v) => {
        const s = v.clone().applyMatrix4(g.matrixWorld).project(camera);
        return { x: (s.x * 0.5 + 0.5) * size.width, y: (-s.y * 0.5 + 0.5) * size.height, z: s.z };
      });
      onProject(all);
    }
  });

  return (
    <group ref={group} rotation={[0.78, 0, 0]}>
      {/* núcleo: a mesma base de engenharia (PostgreSQL multi-tenant + RLS) */}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.55} />
      </lineSegments>
      <points geometry={pktGeo}>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.95} depthWrite={false} />
      </points>
      {pPos.map((v, i) => (
        <mesh key={products[i].id} position={v} ref={(m) => { prodRefs.current[i] = m; }}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color={PRODUCT} />
        </mesh>
      ))}
      {iPos.map((v, i) => (
        <mesh key={integrations[i].id} position={v}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      ))}
    </group>
  );
}

export default function PortfolioGraph({
  products,
  integrations,
  edges,
  caption,
}: {
  products: GraphProduct[];
  integrations: GraphIntegration[];
  edges: GraphEdge[];
  caption: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [labels, setLabels] = useState<{ x: number; y: number; z: number }[]>([]);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const related = useMemo(() => new Set(edges.filter(([p]) => p === active).map(([, i]) => i)), [edges, active]);

  return (
    <figure className="pg" ref={wrap}>
      <div className="pg-stage">
        <Canvas
          className="pg-canvas"
          camera={{ position: [0, 0.6, 9.4], fov: 40 }}
          dpr={[1, 1.75]}
          frameloop={visible && !reduced ? "always" : "demand"}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          aria-hidden="true"
        >
          <Graph products={products} integrations={integrations} edges={edges} active={active} onProject={setLabels} />
        </Canvas>

        {products.map((p, i) => {
          const l = labels[i];
          if (!l) return null;
          return (
            <a
              key={p.id}
              href={p.href}
              className={`pg-node${active === p.id ? " is-on" : ""}${active && active !== p.id ? " is-dim" : ""}`}
              style={{ transform: `translate(${l.x}px, ${l.y}px)` }}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
            >
              <strong>{p.label}</strong>
              <span>{p.sub}</span>
            </a>
          );
        })}
        {integrations.map((it, k) => {
          const l = labels[products.length + k];
          if (!l) return null;
          const dim = active !== null && !related.has(it.id);
          return (
            <span key={it.id} className={`pg-int${dim ? " is-dim" : ""}${active && !dim ? " is-on" : ""}`} style={{ transform: `translate(${l.x}px, ${l.y}px)` }}>
              {it.label}
            </span>
          );
        })}
      </div>
      <figcaption className="pg-caption">{caption}</figcaption>
    </figure>
  );
}
