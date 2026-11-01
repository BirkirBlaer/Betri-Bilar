"use client";

/**
 * Signature 3D object: a ventilated, cross-drilled brake disc with hub and caliper,
 * modelled procedurally in code (no external model or licence needed).
 *
 * `progress` (0–1) is driven by the hero's scroll timeline:
 *   0.00–0.55  disc turns from face-on to three-quarter view, caliper slides off
 *   0.55–1.00  camera pushes in as the workshop photo opens over it
 */
import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import * as THREE from "three";

export type SceneState = { progress: number; pointerX: number; pointerY: number };

const ROTOR_R = 1.6;
const ROTOR_INNER = 0.82;
const HAT_R = 0.86;

function circlePath(x: number, y: number, r: number) {
  const p = new THREE.Path();
  p.absarc(x, y, r, 0, Math.PI * 2, true);
  return p;
}

function useRotorGeometry(detail: number) {
  return useMemo(() => {
    // One friction face, extruded; two of them with vanes between form a ventilated disc.
    const face = new THREE.Shape();
    face.absarc(0, 0, ROTOR_R, 0, Math.PI * 2, false);
    face.holes.push(circlePath(0, 0, ROTOR_INNER));
    // Cross-drilled pattern: 12 spokes × 3 radii, staggered like a real disc
    const radii = [1.06, 1.27, 1.48];
    for (let i = 0; i < 12; i++) {
      radii.forEach((r, j) => {
        const a = (i / 12) * Math.PI * 2 + j * 0.085;
        face.holes.push(circlePath(Math.cos(a) * r, Math.sin(a) * r, 0.042));
      });
    }
    const faceGeo = new THREE.ExtrudeGeometry(face, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: detail,
    });
    faceGeo.center();

    // Hat / hub with 5 wheel-bolt holes and centre bore
    const hat = new THREE.Shape();
    hat.absarc(0, 0, HAT_R, 0, Math.PI * 2, false);
    hat.holes.push(circlePath(0, 0, 0.3));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      hat.holes.push(circlePath(Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0.075));
    }
    const hatGeo = new THREE.ExtrudeGeometry(hat, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: detail,
    });
    hatGeo.center();

    const hatWall = new THREE.CylinderGeometry(HAT_R - 0.02, HAT_R + 0.04, 0.34, detail * 3, 1, true);
    hatWall.rotateX(Math.PI / 2);

    // Caliper: an arc-shaped body that straddles the disc edge
    const cal = new THREE.Shape();
    const a0 = -0.42;
    const a1 = 0.42;
    cal.absarc(0, 0, 1.92, a0, a1, false);
    cal.absarc(0, 0, 1.12, a1, a0, true);
    cal.closePath();
    const calGeo = new THREE.ExtrudeGeometry(cal, {
      depth: 0.56,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 5,
      curveSegments: detail,
    });
    calGeo.translate(0, 0, -0.28);

    return { faceGeo, hatGeo, hatWall, calGeo };
  }, [detail]);
}

function BrakeAssembly({ state, detail, showLabels }: { state: MutableRefObject<SceneState>; detail: number; showLabels: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const caliper = useRef<THREE.Group>(null);
  const labels = useRef<HTMLDivElement[]>([]);
  const { faceGeo, hatGeo, hatWall, calGeo } = useRotorGeometry(detail);

  const iron = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#a9aba5", metalness: 0.78, roughness: 0.36 }),
    [],
  );
  const ironDark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#4a4c47", metalness: 0.9, roughness: 0.55 }),
    [],
  );
  const zinc = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#6d6f6a", metalness: 0.7, roughness: 0.45 }),
    [],
  );
  const paint = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d9a823", metalness: 0.25, roughness: 0.42 }),
    [],
  );

  const vanes = useMemo(() => {
    const out: { a: number }[] = [];
    for (let i = 0; i < 36; i++) out.push({ a: (i / 36) * Math.PI * 2 });
    return out;
  }, []);

  useFrame(({ camera }, dt) => {
    const s = state.current;
    const p = s.progress;
    const turn = THREE.MathUtils.smoothstep(p, 0, 0.6);
    const push = THREE.MathUtils.smoothstep(p, 0.45, 1);

    if (spin.current) spin.current.rotation.z -= dt * 0.12; // slow, constant turn
    if (root.current) {
      const tx = -0.28 + turn * -0.42 + s.pointerY * 0.12;
      const ty = 0.38 + turn * 0.5 + s.pointerX * 0.18;
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, tx, 5, dt);
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, ty, 5, dt);
    }
    if (caliper.current) {
      // Lift the caliper up and off the disc (kept inside the frame)
      caliper.current.position.x = THREE.MathUtils.damp(caliper.current.position.x, turn * 0.25, 6, dt);
      caliper.current.position.y = THREE.MathUtils.damp(caliper.current.position.y, turn * 0.45, 6, dt);
      caliper.current.position.z = THREE.MathUtils.damp(caliper.current.position.z, turn * 0.75, 6, dt);
    }
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.4 - push * 2.6, 6, dt);
    const labelOpacity = String(Math.max(0, 1 - p * 5));
    labels.current.forEach((el) => el && (el.style.opacity = labelOpacity));
  });

  const label = (i: number, text: string, side: "left" | "right" = "right") => (
    <div
      ref={(el) => {
        if (el) labels.current[i] = el;
      }}
      className={`pointer-events-none flex items-center gap-2 whitespace-nowrap font-mono text-[11px] text-steel-light transition-opacity ${side === "left" ? "flex-row-reverse -translate-x-full" : ""}`}
    >
      <span className="size-1.5 rounded-full bg-signal" />
      <span className="h-px w-10 bg-steel-light/50" />
      <span>{text}</span>
    </div>
  );

  return (
    <group ref={root} rotation={[-0.28, 0.38, 0]}>
      <group ref={spin}>
        {/* Two friction faces with radial vanes between them (ventilated disc) */}
        <mesh geometry={faceGeo} material={iron} position={[0, 0, 0.09]} />
        <mesh geometry={faceGeo} material={iron} position={[0, 0, -0.09]} />
        {vanes.map(({ a }, i) => (
          <mesh key={i} material={ironDark} position={[Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.74, 0.035, 0.12]} />
          </mesh>
        ))}
        {/* Hat */}
        <mesh geometry={hatWall} material={zinc} position={[0, 0, 0.27]} />
        <mesh geometry={hatGeo} material={zinc} position={[0, 0, 0.45]} />
        {showLabels && (
          <>
            <Html position={[1.05, -1.1, 0.15]} zIndexRange={[10, 0]}>{label(0, "Bremsudiskur")}</Html>
          </>
        )}
      </group>
      {/* Caliper does not spin with the disc */}
      <group ref={caliper}>
        <group rotation={[0, 0, 0.62]}>
          <mesh geometry={calGeo} material={paint} />
          {[-0.22, 0.22].map((a) => (
            <mesh key={a} material={zinc} position={[Math.cos(a) * 1.52, Math.sin(a) * 1.52, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
            </mesh>
          ))}
        </group>
        {showLabels && <Html position={[1.35, 1.45, 0.3]} zIndexRange={[10, 0]}>{label(2, "Bremsudæla")}</Html>}
      </group>
    </group>
  );
}

export default function BrakeScene({
  state,
  onReady,
  compact,
  labels = !compact,
  active = true,
}: {
  state: MutableRefObject<SceneState>;
  onReady?: () => void;
  compact: boolean;
  /** Show part labels (wide screens only). */
  labels?: boolean;
  /** Stop rendering when the hero is scrolled past. */
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      aria-hidden
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <directionalLight position={[-6, -2, 2]} intensity={0.35} color="#b9c2cc" />
      <directionalLight position={[-3, 2, -5]} intensity={0.9} />
      {/* Studio reflections built from light panels — no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 1, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-3, -3, -4]} scale={[6, 1, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 0, 6]} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>
      <BrakeAssembly state={state} detail={compact ? 20 : 40} showLabels={labels} />
    </Canvas>
  );
}
