"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 *  Arquitetura WebGL Multi-Camadas (Maldivas Tech):
 *   1. DataTerrain — Malha topográfica GLSL com corredor de leitura
 *   2. SystemConstellation — Grafo 3D de nós de arquitetura + conexões
 *   3. OrbitalGyroRings — Anéis geodésicos sutis com paralaxe no hero
 *   + Focus Mode automático em /cursos, /admin, /entrar, /perfil, /trilha
 * ------------------------------------------------------------------ */

const terrainVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uScroll;
  uniform float uSize;
  uniform float uFocus;

  varying float vElevation;
  varying float vDistance;
  varying vec2  vScreenUv;

  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec3 pos = position;

    float speedScale = mix(1.0, 0.35, uFocus);
    float t = uTime * 0.08 * speedScale;
    float ampScale = mix(1.0, 0.45, uFocus);

    float e  = snoise(vec3(pos.xy * 0.035, t)) * 3.4 * ampScale;
          e += snoise(vec3(pos.xy * 0.090, t * 1.6)) * 1.15 * ampScale;
          e += snoise(vec3(pos.xy * 0.210, t * 2.3)) * 0.38 * ampScale;

    float d = distance(pos.xy, uPointer * vec2(46.0, 26.0));
    e += smoothstep(24.0, 0.0, d) * 2.8 * ampScale;

    pos.z += e;
    pos.y += uScroll * 6.0;

    vElevation = e;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDistance = -mv.z;

    gl_Position = projectionMatrix * mv;
    vScreenUv = (gl_Position.xy / max(gl_Position.w, 0.0001)) * 0.5 + 0.5;
    gl_PointSize = uSize * (34.0 / max(vDistance, 1.0));
  }
`;

const terrainFragmentShader = /* glsl */ `
  uniform vec3  uColorLow;
  uniform vec3  uColorHigh;
  uniform vec3  uColorGold;
  uniform float uOpacity;
  uniform float uScroll;

  varying float vElevation;
  varying float vDistance;
  varying vec2  vScreenUv;

  void main() {
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.06, r);

    vec3 baseMix = mix(uColorLow, uColorHigh, smoothstep(-2.0, 3.2, vElevation));
    float goldWeight = smoothstep(1.2, 4.4, vElevation) * clamp(uScroll * 1.15, 0.1, 0.68);
    vec3 color = mix(baseMix, uColorGold, goldWeight);

    float centerDist = abs(vScreenUv.x - 0.5) * 2.0;
    float readingCorridor = mix(0.32, 1.0, smoothstep(0.18, 0.85, centerDist));
    float fog = 1.0 - smoothstep(38.0, 126.0, vDistance);

    gl_FragColor = vec4(color, alpha * fog * uOpacity * readingCorridor);
  }
`;

const nodeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFocus;
  uniform float uPointSize;
  attribute float aPhase;
  varying float vPhase;
  varying float vDistance;
  varying vec2 vScreenUv;

  void main() {
    vec3 pos = position;
    float floatAmp = mix(0.85, 0.25, uFocus);
    pos.y += sin(uTime * 0.75 + aPhase) * floatAmp;
    pos.x += cos(uTime * 0.55 + aPhase * 1.3) * floatAmp * 0.6;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDistance = -mv.z;
    vPhase = aPhase;
    gl_Position = projectionMatrix * mv;
    vScreenUv = (gl_Position.xy / max(gl_Position.w, 0.0001)) * 0.5 + 0.5;
    gl_PointSize = uPointSize * (42.0 / max(vDistance, 4.0));
  }
`;

const nodeFragmentShader = /* glsl */ `
  uniform vec3 uColorCyan;
  uniform vec3 uColorGold;
  uniform float uOpacity;

  varying float vPhase;
  varying float vDistance;
  varying vec2 vScreenUv;

  void main() {
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;
    float core = smoothstep(0.18, 0.0, r);
    float halo = smoothstep(0.5, 0.05, r) * 0.55;
    vec3 col = mix(uColorCyan, uColorGold, step(4.6, mod(vPhase, 6.283)));
    float corridor = mix(0.28, 1.0, smoothstep(0.16, 0.82, abs(vScreenUv.x - 0.5) * 2.0));
    float fog = 1.0 - smoothstep(42.0, 118.0, vDistance);
    gl_FragColor = vec4(col, (core + halo) * uOpacity * corridor * fog);
  }
`;

function buildRingGeometry(radius: number, segments = 120): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function ArchitecturalScene({ dark, focusMode }: { dark: boolean; focusMode: boolean }) {
  const terrainRef = useRef<THREE.Points>(null);
  const constellationGroupRef = useRef<THREE.Group>(null);
  const ringPrimaryRef = useRef<THREE.LineLoop>(null);
  const ringSecondaryRef = useRef<THREE.LineLoop>(null);
  const { size } = useThree();

  const terrainGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(190, 110, 220, 120);
    g.rotateX(-Math.PI / 2.42);
    return g;
  }, []);

  const { nodesGeo, edgesGeo } = useMemo(() => {
    const nodeCount = 44;
    const positions = new Float32Array(nodeCount * 3);
    const phases = new Float32Array(nodeCount);
    const pts: THREE.Vector3[] = [];

    // Deterministic Fibonacci-like architectural distribution biased away from central text column
    for (let i = 0; i < nodeCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const u = ((i * 37) % nodeCount) / nodeCount;
      const v = ((i * 53) % nodeCount) / nodeCount;
      const x = side * (9 + u * 34);
      const y = 3.5 + v * 17.5;
      const z = -18 + (((i * 29) % nodeCount) / nodeCount) * 32;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      phases[i] = i * 0.92;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const edgeVerts: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 19.5) {
          edgeVerts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgeVerts, 3));

    return { nodesGeo: nGeo, edgesGeo: eGeo };
  }, []);

  const ringOuterGeo = useMemo(() => buildRingGeometry(19, 120), []);
  const ringInnerGeo = useMemo(() => buildRingGeometry(13.5, 96), []);

  useEffect(() => {
    return () => {
      terrainGeo.dispose();
      nodesGeo.dispose();
      edgesGeo.dispose();
      ringOuterGeo.dispose();
      ringInnerGeo.dispose();
    };
  }, [terrainGeo, nodesGeo, edgesGeo, ringOuterGeo, ringInnerGeo]);

  const terrainUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uSize: { value: 2.4 },
      uFocus: { value: 0 },
      uColorLow: { value: new THREE.Color("#0166BB") },
      uColorHigh: { value: new THREE.Color("#22B5F2") },
      uColorGold: { value: new THREE.Color("#F5B544") },
      uOpacity: { value: 0.85 },
    }),
    [],
  );

  const nodeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFocus: { value: 0 },
      uPointSize: { value: 4.8 },
      uColorCyan: { value: new THREE.Color("#22B5F2") },
      uColorGold: { value: new THREE.Color("#F5B544") },
      uOpacity: { value: 0.72 },
    }),
    [],
  );

  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const ringMatOuterRef = useRef<THREE.LineBasicMaterial>(null);
  const ringMatInnerRef = useRef<THREE.LineBasicMaterial>(null);

  useEffect(() => {
    terrainUniforms.uColorLow.value.set(dark ? "#0166BB" : "#01458F");
    terrainUniforms.uColorHigh.value.set(dark ? "#5FE3FF" : "#0166BB");
    terrainUniforms.uColorGold.value.set(dark ? "#F5B544" : "#B45309");
    terrainUniforms.uFocus.value = focusMode ? 1.0 : 0.0;
    terrainUniforms.uOpacity.value = focusMode ? (dark ? 0.16 : 0.07) : dark ? 0.88 : 0.28;

    nodeUniforms.uColorCyan.value.set(dark ? "#22B5F2" : "#0166BB");
    nodeUniforms.uColorGold.value.set(dark ? "#F5B544" : "#B45309");
    nodeUniforms.uFocus.value = focusMode ? 1.0 : 0.0;
    nodeUniforms.uOpacity.value = focusMode ? (dark ? 0.14 : 0.05) : dark ? 0.82 : 0.34;
  }, [dark, focusMode, terrainUniforms, nodeUniforms]);

  const pointer = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    terrainUniforms.uTime.value += d;
    nodeUniforms.uTime.value += d;

    pointer.current.lerp(target.current, 1 - Math.pow(0.002, d));
    terrainUniforms.uPointer.value.copy(pointer.current);
    terrainUniforms.uScroll.value += (scroll.current - terrainUniforms.uScroll.value) * (1 - Math.pow(0.01, d));

    const parallaxAmp = focusMode ? 0.2 : 1.0;
    const t = terrainUniforms.uTime.value;
    const scrollProgress = terrainUniforms.uScroll.value;

    if (terrainRef.current) {
      terrainRef.current.rotation.z = Math.sin(t * 0.05) * 0.035 * parallaxAmp;
      terrainRef.current.position.x = pointer.current.x * -2.2 * parallaxAmp;
    }

    if (constellationGroupRef.current) {
      constellationGroupRef.current.rotation.y = Math.sin(t * 0.14) * 0.08 * parallaxAmp + pointer.current.x * 0.06 * parallaxAmp;
      constellationGroupRef.current.position.y = scrollProgress * 4.5;
    }

    const ringFade = focusMode ? 0.04 : Math.max(0.05, 1.0 - scrollProgress * 1.9);
    if (ringPrimaryRef.current) {
      ringPrimaryRef.current.rotation.x = 1.15 + pointer.current.y * 0.12 * parallaxAmp;
      ringPrimaryRef.current.rotation.y = 0.25 + t * 0.06 * parallaxAmp;
      ringPrimaryRef.current.rotation.z = t * 0.03 * parallaxAmp;
    }
    if (ringSecondaryRef.current) {
      ringSecondaryRef.current.rotation.x = -0.95 + pointer.current.y * 0.1 * parallaxAmp;
      ringSecondaryRef.current.rotation.y = -0.35 - t * 0.08 * parallaxAmp;
      ringSecondaryRef.current.rotation.z = -t * 0.04 * parallaxAmp;
    }

    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = focusMode ? 0.04 : dark ? 0.2 : 0.1;
    }
    if (ringMatOuterRef.current) {
      ringMatOuterRef.current.opacity = (dark ? 0.22 : 0.12) * ringFade;
    }
    if (ringMatInnerRef.current) {
      ringMatInnerRef.current.opacity = (dark ? 0.16 : 0.09) * ringFade;
    }

    state.camera.position.x += (pointer.current.x * 3.0 * parallaxAmp - state.camera.position.x) * 0.03;
    state.camera.position.y += (6.5 + pointer.current.y * 1.4 * parallaxAmp - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 1.5, 0);
  });

  useEffect(() => {
    const mobile = size.width < 768;
    terrainUniforms.uSize.value = mobile ? 1.8 : focusMode ? 1.7 : 2.5;
    nodeUniforms.uPointSize.value = mobile ? 3.4 : focusMode ? 2.6 : 5.2;
  }, [size.width, focusMode, terrainUniforms, nodeUniforms]);

  return (
    <>
      {/* Layer 1: Topographic Data Terrain */}
      <points ref={terrainRef} geometry={terrainGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={terrainVertexShader}
          fragmentShader={terrainFragmentShader}
          uniforms={terrainUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Layer 2: 3D Architectural Systems Graph */}
      <group ref={constellationGroupRef}>
        <points geometry={nodesGeo} frustumCulled={false}>
          <shaderMaterial
            vertexShader={nodeVertexShader}
            fragmentShader={nodeFragmentShader}
            uniforms={nodeUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <lineSegments geometry={edgesGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={edgeMatRef}
            color={dark ? "#22B5F2" : "#0166BB"}
            transparent
            opacity={dark ? 0.2 : 0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Layer 3: Geodesic Orbital Gyro Rings framing the right visual focal zone */}
      <group position={[18, 9.5, -14]}>
        <lineLoop ref={ringPrimaryRef} geometry={ringOuterGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={ringMatOuterRef}
            color={dark ? "#22B5F2" : "#0166BB"}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </lineLoop>
        <lineLoop ref={ringSecondaryRef} geometry={ringInnerGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={ringMatInnerRef}
            color={dark ? "#F5B544" : "#B45309"}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </lineLoop>
      </group>
    </>
  );
}

export default function ThreeBackground() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  const isFocusRoute = pathname
    ? /\/(cursos|admin|entrar|perfil|trilha)(\/|$)/.test(pathname)
    : false;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak =
      window.innerWidth < 640 ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      !document.createElement("canvas").getContext("webgl2");
    setEnabled(!reduced && !weak);

    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={`three-bg${isFocusRoute ? " three-bg--focus" : ""}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 6.5, 46], fov: 55, near: 0.1, far: 220 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <ArchitecturalScene dark={resolvedTheme !== "light"} focusMode={isFocusRoute} />
      </Canvas>
    </div>
  );
}
