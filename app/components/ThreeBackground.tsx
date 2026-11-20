"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 *  Terreno de dados — point cloud deslocado inteiramente em GLSL.
 *  Evoluído com:
 *   1. Route-Aware Deep Focus Mode (atenuação em /cursos, /admin, /perfil)
 *   2. Corredor Óptico de Leitura no fragmentShader (texto sempre nítido)
 *   3. Transição cromática Ciano -> Ouro conforme elevação e profundidade
 * ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
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

    float e  = snoise(vec3(pos.xy * 0.035, t)) * 3.2 * ampScale;
          e += snoise(vec3(pos.xy * 0.090, t * 1.6)) * 1.1 * ampScale;
          e += snoise(vec3(pos.xy * 0.210, t * 2.3)) * 0.35 * ampScale;

    float d = distance(pos.xy, uPointer * vec2(46.0, 26.0));
    e += smoothstep(22.0, 0.0, d) * 2.6 * ampScale;

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

const fragmentShader = /* glsl */ `
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

    // Transição cromática por altura + scroll (Ciano -> Ouro nos picos em seções profundas)
    vec3 baseMix = mix(uColorLow, uColorHigh, smoothstep(-2.0, 3.2, vElevation));
    float goldWeight = smoothstep(1.2, 4.4, vElevation) * clamp(uScroll * 1.15, 0.08, 0.65);
    vec3 color = mix(baseMix, uColorGold, goldWeight);

    // Corredor Óptico de Leitura: atenuação suave no centro da tela para preservar legibilidade do texto
    float centerDist = abs(vScreenUv.x - 0.5) * 2.0;
    float readingCorridor = mix(0.32, 1.0, smoothstep(0.18, 0.85, centerDist));

    // Névoa por profundidade
    float fog = 1.0 - smoothstep(38.0, 122.0, vDistance);

    gl_FragColor = vec4(color, alpha * fog * uOpacity * readingCorridor);
  }
`;

function DataTerrain({ dark, focusMode }: { dark: boolean; focusMode: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { size } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(190, 110, 220, 120);
    g.rotateX(-Math.PI / 2.42);
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uSize: { value: 2.4 },
      uFocus: { value: 0 },
      uColorLow: { value: new THREE.Color("#0E9384") },
      uColorHigh: { value: new THREE.Color("#5FE3FF") },
      uColorGold: { value: new THREE.Color("#F5B544") },
      uOpacity: { value: 0.9 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uColorLow.value.set(dark ? "#0E9384" : "#0166BB");
    uniforms.uColorHigh.value.set(dark ? "#5FE3FF" : "#22B5F2");
    uniforms.uColorGold.value.set(dark ? "#F5B544" : "#B45309");
    uniforms.uFocus.value = focusMode ? 1.0 : 0.0;

    if (focusMode) {
      uniforms.uOpacity.value = dark ? 0.18 : 0.08;
    } else {
      uniforms.uOpacity.value = dark ? 0.85 : 0.28;
    }
  }, [dark, focusMode, uniforms]);

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
    uniforms.uTime.value += d;

    pointer.current.lerp(target.current, 1 - Math.pow(0.002, d));
    uniforms.uPointer.value.copy(pointer.current);
    uniforms.uScroll.value += (scroll.current - uniforms.uScroll.value) * (1 - Math.pow(0.01, d));

    const parallaxAmp = focusMode ? 0.25 : 1.0;

    if (ref.current) {
      ref.current.rotation.z = Math.sin(uniforms.uTime.value * 0.05) * 0.035 * parallaxAmp;
      ref.current.position.x = pointer.current.x * -2.2 * parallaxAmp;
    }

    state.camera.position.x += (pointer.current.x * 3.0 * parallaxAmp - state.camera.position.x) * 0.03;
    state.camera.position.y += (6 + pointer.current.y * 1.4 * parallaxAmp - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    uniforms.uSize.value = size.width < 768 ? 1.8 : focusMode ? 1.7 : 2.4;
  }, [size.width, focusMode, uniforms]);

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        camera={{ position: [0, 6, 46], fov: 55, near: 0.1, far: 200 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <DataTerrain dark={resolvedTheme !== "light"} focusMode={isFocusRoute} />
      </Canvas>
    </div>
  );
}
