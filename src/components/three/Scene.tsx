"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { CoreObject } from "./CoreObject";
import Aura from "./Aura";
import { store } from "@/lib/store";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Studio lighting built from light-formers — no external HDR files */
export function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.2} position={[-5, 1, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.6} position={[5, 0.5, -1]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" color="#3047ff" intensity={2} position={[0, -2, -4]} scale={3} />
      <Lightformer form="rect" intensity={0.6} position={[0, -4, 2]} scale={[10, 2, 1]} rotation-x={-Math.PI / 2} />
    </Environment>
  );
}

export default function Scene() {
  const [ok] = useState(hasWebGL);

  useEffect(() => {
    store.webgl = ok;
    document.documentElement.dataset.webgl = ok ? "1" : "0";
  }, [ok]);

  if (!ok) return null;

  return (
    <>
    <Aura />
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 12], fov: 26, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 6, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Studio />
          <CoreObject />
        </Suspense>
      </Canvas>
    </div>
    </>
  );
}
