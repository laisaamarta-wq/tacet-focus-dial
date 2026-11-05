"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGES, store } from "@/lib/store";
import { auraFor, mixRGB } from "@/lib/stages";

/**
 * Full-screen living background. Flowing noise in three colours per chapter,
 * a soft glow that follows the object, an optional top spotlight (the "product shot" look),
 * a pulse ring when the object assembles, vignette and film grain.
 */

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime, uTurb, uSpot, uPulse, uAspect;
uniform vec3 uA, uB, uC, uLight;
uniform vec2 uObj;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  vec2 o = (uObj - 0.5) * vec2(uAspect, 1.0);
  float t = uTime * (0.035 + uTurb * 0.16);

  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t * 0.8 + 4.2));
  float n = fbm(p * 1.7 + q * (1.1 + uTurb * 2.2) + vec2(t * 0.6, -t * 0.4));
  float n2 = fbm(p * 2.3 - q * 1.3 + 8.0 - t * 0.5);

  vec3 col = uA;
  col = mix(col, uB, smoothstep(0.42, 0.95, n) * 0.62);
  col = mix(col, uC, smoothstep(0.5, 1.0, n2) * 0.5);

  // glow that follows the product, in the colour of its light
  float d = length(p - o);
  col += uLight * 0.38 * exp(-d * d * 5.0);

  // top spotlight: darken the room, light a cone onto the object
  float cone = exp(-pow((p.x - o.x) * 2.2, 2.0)) * smoothstep(-0.2, 0.55, p.y - o.y + 0.25);
  float pool = exp(-d * d * 3.0);
  vec3 lit = uA * 0.35 + vec3(1.0, 0.96, 0.92) * (cone * 0.10 + pool * 0.10) + uLight * pool * 0.12;
  col = mix(col, lit, uSpot);

  // pulse ring
  float ring = exp(-pow((d - uPulse * 1.6) * 9.0, 2.0)) * (1.0 - uPulse) * step(0.001, uPulse);
  col += uLight * ring * 0.9;

  // vignette + grain
  col *= mix(1.0, smoothstep(1.35, 0.25, length(p)), 0.7);
  col += (hash(vUv * 1000.0 + fract(uTime) * 100.0) - 0.5) * 0.03;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

function AuraPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTurb: { value: 0.3 },
      uSpot: { value: 0 },
      uPulse: { value: 0 },
      uAspect: { value: 1 },
      uA: { value: new THREE.Color("#060818") },
      uB: { value: new THREE.Color("#2440ff") },
      uC: { value: new THREE.Color("#7b3cff") },
      uLight: { value: new THREE.Color("#3d5bff") },
      uObj: { value: new THREE.Vector2(0.7, 0.5) },
    }),
    [],
  );
  const cur = useRef({ A: [0, 0, 0], B: [0, 0, 0], C: [0, 0, 0], turb: 0.3, spot: 0, init: false });

  useFrame(({ clock, size }, rawDt) => {
    const dt = Math.min(rawDt, 1 / 8);
    const u = mat.current.uniforms;
    const f = store.stageFloat;
    const i0 = Math.max(0, Math.min(STAGES.length - 1, Math.floor(f)));
    const i1 = Math.min(STAGES.length - 1, i0 + 1);
    const k = f - i0;
    const a0 = auraFor(STAGES[i0]);
    const a1 = auraFor(STAGES[i1]);
    const A = mixRGB(a0.A, a1.A, k), B = mixRGB(a0.B, a1.B, k), C = mixRGB(a0.C, a1.C, k);
    const turb = a0.turb + (a1.turb - a0.turb) * k;
    const spot = a0.spot + (a1.spot - a0.spot) * k;

    const c = cur.current;
    const e = c.init ? 1 - Math.exp(-4 * dt) : 1;
    c.init = true;
    for (let j = 0; j < 3; j++) {
      c.A[j] += (A[j] - c.A[j]) * e;
      c.B[j] += (B[j] - c.B[j]) * e;
      c.C[j] += (C[j] - c.C[j]) * e;
    }
    c.turb += (turb - c.turb) * e;
    c.spot += (spot - c.spot) * e;

    (u.uA.value as THREE.Color).setRGB(c.A[0], c.A[1], c.A[2]);
    (u.uB.value as THREE.Color).setRGB(c.B[0], c.B[1], c.B[2]);
    (u.uC.value as THREE.Color).setRGB(c.C[0], c.C[1], c.C[2]);
    (u.uLight.value as THREE.Color).setRGB(store.light[0], store.light[1], store.light[2]);
    u.uTurb.value = c.turb;
    u.uSpot.value = c.spot;
    u.uTime.value = store.reducedMotion ? 10 : clock.elapsedTime;
    u.uAspect.value = size.width / Math.max(1, size.height);
    (u.uObj.value as THREE.Vector2).set(store.objScreen[0], store.objScreen[1]);
    // pulse ring: rides the intro assembly, and fires when the twist lets go
    const tp = store.progress.twist ?? 0;
    const twistActive = STAGES[i0] === "twist" || STAGES[i1] === "twist";
    const twistPulse = twistActive && tp > 0.56 && tp < 0.9 ? (tp - 0.56) / 0.34 : 0;
    u.uPulse.value = store.intro > 0 && store.intro < 1 ? store.intro : twistPulse;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export default function Aura() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas dpr={[0.5, 0.75]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} flat linear>
        <AuraPlane />
      </Canvas>
    </div>
  );
}
