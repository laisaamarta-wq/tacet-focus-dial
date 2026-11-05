"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Finish } from "@/lib/store";

/**
 * TACET One — procedural model, no external files.
 * Stack (bottom → top): machined base, haptic ring, sensor ring, knurled crown dial,
 * light core under a borosilicate dome.
 *
 * `controls` is a mutable object read every frame, so a parent can animate the model
 * without React re-renders.
 */
export type TacetControls = {
  explode: number; // 0 assembled → 1 exploded
  crown: number; // crown rotation, radians
  glow: number; // 0..1.4
  finish: Finish;
  visible: number; // 0..1, fades glow and shadow
  light: [number, number, number]; // core light colour, sRGB 0..1
};

const COBALT = new THREE.Color("#3047ff");

const FINISHES: Record<Finish, { base: string; baseMetal: number; baseRough: number; ceramic: string; crown: string }> = {
  basalt: { base: "#3a4146", baseMetal: 0.85, baseRough: 0.4, ceramic: "#e7e6e0", crown: "#c3c8c6" },
  fog: { base: "#c4c8c4", baseMetal: 0.9, baseRough: 0.32, ceramic: "#f4f3ef", crown: "#d9dcda" },
  moss: { base: "#2e3a32", baseMetal: 0.7, baseRough: 0.45, ceramic: "#e9e4d6", crown: "#c9b48a" },
};

function band(r0: number, r1: number, h: number, rad: number, seg = 6) {
  const pts: THREE.Vector2[] = [];
  const arc = (cx: number, cy: number, a0: number, a1: number) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + ((a1 - a0) * i) / seg;
      pts.push(new THREE.Vector2(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad));
    }
  };
  arc(r0 + rad, rad, Math.PI, Math.PI * 1.5);
  arc(r1 - rad, rad, -Math.PI / 2, 0);
  arc(r1 - rad, h - rad, 0, Math.PI / 2);
  arc(r0 + rad, h - rad, Math.PI / 2, Math.PI);
  pts.push(pts[0].clone());
  return new THREE.LatheGeometry(pts, 144);
}

function basePuck() {
  const pts = [
    [0, 0], [0.9, 0], [0.97, 0.015], [1, 0.06], [1, 0.26], [0.985, 0.31], [0.95, 0.335], [0.88, 0.34], [0, 0.34],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 160);
}

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const TICKS = 72;
const TMP_BASE = new THREE.Color();
const TMP_CERAMIC = new THREE.Color();
const TMP_CROWN = new THREE.Color();
const TMP_LIGHT = new THREE.Color();

export function TacetModel({ controls, shadow = true }: { controls: React.RefObject<TacetControls>; shadow?: boolean }) {
  const inner = useRef<THREE.Group>(null!);
  const haptic = useRef<THREE.Mesh>(null!);
  const sensor = useRef<THREE.Mesh>(null!);
  const crownG = useRef<THREE.Group>(null!);
  const ticks = useRef<THREE.InstancedMesh>(null!);
  const dome = useRef<THREE.Mesh>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.Sprite>(null!);
  const shadowM = useRef<THREE.Mesh>(null!);

  const geo = useMemo(
    () => ({
      base: basePuck(),
      haptic: band(0.8, 0.95, 0.075, 0.022),
      sensor: band(0.76, 0.91, 0.075, 0.022),
      crown: band(0.72, 0.87, 0.085, 0.02),
      tick: new THREE.BoxGeometry(0.012, 0.06, 0.035),
      marker: new THREE.CylinderGeometry(0.022, 0.022, 0.012, 24),
      dome: new THREE.SphereGeometry(0.6, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2),
      core: new THREE.SphereGeometry(0.21, 64, 32),
      accent: new THREE.TorusGeometry(0.995, 0.006, 12, 200),
    }),
    [],
  );

  const tex = useMemo(
    () => ({
      glow: radialTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,255,255,0.5)"], [1, "rgba(255,255,255,0)"]]),
      shadow: radialTexture([[0, "rgba(10,14,18,0.55)"], [0.5, "rgba(10,14,18,0.18)"], [1, "rgba(10,14,18,0)"]]),
    }),
    [],
  );

  const mat = useMemo(
    () => ({
      base: new THREE.MeshPhysicalMaterial({ color: FINISHES.basalt.base, metalness: 0.85, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: FINISHES.basalt.ceramic, metalness: 0, roughness: 0.55, clearcoat: 0.15 }),
      alu: new THREE.MeshPhysicalMaterial({ color: "#b9bfbe", metalness: 1, roughness: 0.3 }),
      crown: new THREE.MeshPhysicalMaterial({ color: FINISHES.basalt.crown, metalness: 1, roughness: 0.26 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.06,
        transmission: 1,
        thickness: 0.5,
        ior: 1.45,
        attenuationColor: new THREE.Color("#cfd8ff"),
        attenuationDistance: 2,
        transparent: true,
        side: THREE.DoubleSide,
      }),
      core: new THREE.MeshPhysicalMaterial({ color: "#f4f5ff", emissive: COBALT, emissiveIntensity: 1, roughness: 0.3, clearcoat: 1 }),
      accent: new THREE.MeshStandardMaterial({ color: "#3047ff", emissive: COBALT, emissiveIntensity: 1.6 }),
      marker: new THREE.MeshStandardMaterial({ color: "#3047ff", emissive: COBALT, emissiveIntensity: 2 }),
    }),
    [],
  );

  // Knurled crown: 72 detents around the outer edge
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2;
      m.position.set(Math.cos(a) * 0.872, 0.0425, Math.sin(a) * 0.872);
      m.rotation.set(0, -a, 0);
      m.updateMatrix();
      ticks.current.setMatrixAt(i, m.matrix);
    }
    ticks.current.instanceMatrix.needsUpdate = true;
  }, []);

  const baseMesh = useRef<THREE.Mesh>(null!);
  const accentMesh = useRef<THREE.Mesh>(null!);
  const crownMesh = useRef<THREE.Mesh>(null!);
  const markerMesh = useRef<THREE.Mesh>(null!);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 8);
    const c = controls.current;
    if (!c) return;
    const e = c.explode;

    inner.current.position.y = -(0.6 + e * 0.95);
    haptic.current.position.y = 0.355 + e * 0.32;
    sensor.current.position.y = 0.445 + e * 0.64;
    sensor.current.rotation.y = e * 0.5;
    crownG.current.position.y = 0.535 + e * 0.96;
    crownG.current.rotation.y = c.crown;
    dome.current.position.y = 0.625 + e * 1.35;
    core.current.position.y = 0.8 + e * 1.22;
    glow.current.position.y = core.current.position.y;

    const pulse = 0.88 + Math.sin(performance.now() / 900) * 0.12;
    type Std = THREE.MeshStandardMaterial;
    TMP_LIGHT.setRGB(c.light[0], c.light[1], c.light[2], THREE.SRGBColorSpace);
    (core.current.material as Std).emissive.copy(TMP_LIGHT);
    (accentMesh.current.material as Std).emissive.copy(TMP_LIGHT);
    (accentMesh.current.material as Std).color.copy(TMP_LIGHT);
    (markerMesh.current.material as Std).emissive.copy(TMP_LIGHT);
    (glow.current.material as THREE.SpriteMaterial).color.copy(TMP_LIGHT);
    (core.current.material as Std).emissiveIntensity = 0.25 + c.glow * 1.6 * pulse;
    (accentMesh.current.material as Std).emissiveIntensity = 0.5 + c.glow * 1.6;
    (markerMesh.current.material as Std).emissiveIntensity = 1 + c.glow * 2;
    (glow.current.material as THREE.SpriteMaterial).opacity = c.glow * 0.85 * pulse * c.visible;
    glow.current.scale.setScalar(1.2 + c.glow * 1.1);
    if (shadowM.current) (shadowM.current.material as THREE.MeshBasicMaterial).opacity = (1 - e) * 0.9 * c.visible;

    // Finish: ease colours toward the selected palette
    const f = FINISHES[c.finish];
    TMP_BASE.set(f.base);
    TMP_CERAMIC.set(f.ceramic);
    TMP_CROWN.set(f.crown);
    const k = 1 - Math.exp(-6 * dt);
    const baseMat = baseMesh.current.material as Std;
    baseMat.color.lerp(TMP_BASE, k);
    (haptic.current.material as Std).color.lerp(TMP_CERAMIC, k);
    (crownMesh.current.material as Std).color.lerp(TMP_CROWN, k);
    baseMat.metalness += (f.baseMetal - baseMat.metalness) * k;
    baseMat.roughness += (f.baseRough - baseMat.roughness) * k;
  });

  return (
    <>
      <group ref={inner}>
        <mesh ref={baseMesh} geometry={geo.base} material={mat.base} />
        <mesh ref={accentMesh} geometry={geo.accent} material={mat.accent} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh ref={haptic} geometry={geo.haptic} material={mat.ceramic} />
        <mesh ref={sensor} geometry={geo.sensor} material={mat.alu} />
        <group ref={crownG}>
          <mesh ref={crownMesh} geometry={geo.crown} material={mat.crown} />
          <instancedMesh ref={ticks} args={[geo.tick, mat.crown, TICKS]} />
          <mesh ref={markerMesh} geometry={geo.marker} material={mat.marker} position={[0, 0.088, 0.8]} />
        </group>
        <mesh ref={core} geometry={geo.core} material={mat.core} />
        <sprite ref={glow}>
          <spriteMaterial map={tex.glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <mesh ref={dome} geometry={geo.dome} material={mat.glass} />
      </group>
      {shadow && (
        <mesh ref={shadowM} position={[0, -0.75, -0.2]} rotation={[-Math.PI / 2.4, 0, 0]}>
          <planeGeometry args={[3.4, 3.4]} />
          <meshBasicMaterial map={tex.shadow} transparent depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
