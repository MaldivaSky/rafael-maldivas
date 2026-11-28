"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Move3d, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

export interface CameraControlAction {
  type: "zoom-in" | "zoom-out" | "reset" | "fly";
  seq: number;
  position?: [number, number, number];
  target?: [number, number, number];
}

interface ThreeCameraRigProps {
  defaultPosition: [number, number, number];
  defaultTarget?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  action?: CameraControlAction | null;
}

/**
 * Native Three.js OrbitControls rig with inertia damping, free 360° drag/touch,
 * scroll/pinch zoom, and user-respecting smooth cinematic fly-to transitions.
 * Immediately yields 100% control to the user the instant they touch or drag.
 */
export function ThreeCameraRig({
  defaultPosition,
  defaultTarget = [0, 0, 0],
  minDistance = 3.2,
  maxDistance = 13,
  autoRotate = true,
  autoRotateSpeed = 0.75,
  action = null,
}: ThreeCameraRigProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  const flyTargetPos = useRef<THREE.Vector3 | null>(null);
  const flyLookAt = useRef<THREE.Vector3 | null>(null);
  const isUserInteracting = useRef(false);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.85;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.9;
    controls.enablePan = true;
    controls.panSpeed = 0.55;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.target.set(...defaultTarget);
    controls.update();

    const onStart = () => {
      isUserInteracting.current = true;
      // Immediately cancel any cinematic fly-to so we never fight the user
      flyTargetPos.current = null;
      flyLookAt.current = null;
    };
    const onEnd = () => {
      isUserInteracting.current = false;
    };

    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    controlsRef.current = controls;

    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
  }, [autoRotate, autoRotateSpeed]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !action) return;

    if (action.type === "reset") {
      flyTargetPos.current = new THREE.Vector3(...defaultPosition);
      flyLookAt.current = new THREE.Vector3(...defaultTarget);
    } else if (action.type === "fly" && action.position) {
      flyTargetPos.current = new THREE.Vector3(...action.position);
      flyLookAt.current = new THREE.Vector3(...(action.target ?? defaultTarget));
    } else if (action.type === "zoom-in" || action.type === "zoom-out") {
      const dir = camera.position.clone().sub(controls.target);
      const dist = dir.length();
      const factor = action.type === "zoom-in" ? 0.78 : 1.28;
      const nextDist = THREE.MathUtils.clamp(dist * factor, minDistance, maxDistance);
      dir.normalize().multiplyScalar(nextDist);
      flyTargetPos.current = controls.target.clone().add(dir);
      flyLookAt.current = controls.target.clone();
    }
  }, [action, camera, defaultPosition, defaultTarget, minDistance, maxDistance]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!isUserInteracting.current && flyTargetPos.current && flyLookAt.current) {
      camera.position.lerp(flyTargetPos.current, 0.085);
      controls.target.lerp(flyLookAt.current, 0.085);
      if (
        camera.position.distanceTo(flyTargetPos.current) < 0.04 &&
        controls.target.distanceTo(flyLookAt.current) < 0.04
      ) {
        flyTargetPos.current = null;
        flyLookAt.current = null;
      }
    }

    controls.update();
  });

  return null;
}

/**
 * Volumetric 3D particle field so orbiting the camera gives genuine spatial depth.
 */
export function AmbientStarfield({
  count = 260,
  radius = 12,
  color = "#38bdf8",
  opacity = 0.45,
}: {
  count?: number;
  radius?: number;
  color?: string;
  opacity?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution (no hydration mismatch)
      const u = ((i * 2654435761) % 10000) / 10000;
      const v = (((i + 17) * 2246822519) % 10000) / 10000;
      const w = (((i + 53) * 3266489917) % 10000) / 10000;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.48 + w * 0.52);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.055}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Interactive Camera Control HUD Overlay (Zoom +, Zoom -, Auto-Rotate, Reset 360°)
 */
export function ThreeCameraHud({
  pt,
  autoRotate,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onReset,
  extraButton,
}: {
  pt: boolean;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  extraButton?: React.ReactNode;
}) {
  return (
    <div className="cam3d-hud" aria-label={pt ? "Controles de câmera 3D" : "3D camera controls"}>
      <span className="cam3d-hint">
        <Move3d size={12} aria-hidden="true" />
        {pt ? "Arraste 360° · Scroll Zoom" : "Drag 360° · Scroll Zoom"}
      </span>
      <div className="cam3d-btns">
        {extraButton}
        <button
          type="button"
          className="cam3d-btn"
          onClick={onZoomIn}
          title={pt ? "Aproximar (Zoom +)" : "Zoom in"}
          aria-label={pt ? "Aproximar câmera 3D" : "Zoom in 3D camera"}
        >
          <ZoomIn size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="cam3d-btn"
          onClick={onZoomOut}
          title={pt ? "Afastar (Zoom -)" : "Zoom out"}
          aria-label={pt ? "Afastar câmera 3D" : "Zoom out 3D camera"}
        >
          <ZoomOut size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`cam3d-btn${autoRotate ? " is-active" : ""}`}
          onClick={onToggleAutoRotate}
          title={autoRotate ? (pt ? "Pausar rotação" : "Pause rotation") : pt ? "Girar automaticamente" : "Auto-rotate"}
          aria-label={autoRotate ? (pt ? "Pausar rotação automática" : "Pause auto-rotation") : pt ? "Ativar rotação automática" : "Enable auto-rotation"}
        >
          {autoRotate ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="cam3d-btn"
          onClick={onReset}
          title={pt ? "Resetar câmera" : "Reset camera"}
          aria-label={pt ? "Resetar posição da câmera 3D" : "Reset 3D camera view"}
        >
          <RotateCcw size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

