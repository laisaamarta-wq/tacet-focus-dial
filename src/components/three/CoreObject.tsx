"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { STAGES, store, smoothstep } from "@/lib/store";
import { STAGE_POSES, lightFor, mixRGB } from "@/lib/stages";
import { TacetModel, type TacetControls } from "./TacetModel";

/**
 * Director: every frame the object flies toward the "dock" element of the current chapter
 * and blends pose, explode, glow, crown and light colour between neighbouring chapters.
 * The "reveal" chapter scrubs a full tumble so the product is seen from every side.
 */

type Target = { x: number; y: number; s: number; visible: number };
const tmp: Target = { x: 0, y: 0, s: 0, visible: 1 };

/** A chapter can list several docks ("a,b"); the visible one nearest the screen centre wins. */
function pickDock(ids: string | null) {
  if (!ids) return undefined;
  let best: DOMRect | undefined;
  let bestD = Infinity;
  const mid = window.innerHeight / 2;
  for (const id of ids.split(",")) {
    const r = document.getElementById(id)?.getBoundingClientRect();
    if (!r || r.width < 2 || r.height < 2) continue;
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  }
  return best;
}

function dockTarget(ids: string | null, vw: number, vh: number, fill: number, out: Target) {
  const r = pickDock(ids);
  if (!r || r.width < 2 || r.height < 2) {
    out.x = vw * 0.32;
    out.y = vh * 0.85;
    out.s = Math.min(vw, vh) * 0.12;
    out.visible = 0;
    return out;
  }
  const W = window.innerWidth;
  const H = window.innerHeight;
  out.x = ((r.left + r.width / 2) / W - 0.5) * vw;
  out.y = (0.5 - (r.top + r.height / 2) / H) * vh;
  out.s = ((Math.min(r.width, r.height) * fill) / W) * vw * 0.5; // the object is ~2 units across
  out.visible = 1;
  return out;
}

/** Tumble keyframes for the reveal chapter: [progress, tiltX, rollZ, extra spin Y, scale] */
const TUMBLE: [number, number, number, number, number][] = [
  [0.0, 1.38, 0.0, 0.0, 1.0], // top view
  [0.2, 0.55, 0.28, 0.9, 1.0], // three-quarter
  [0.4, 0.04, 1.18, 1.8, 1.12], // on its edge, rolling
  [0.6, -0.95, 0.3, 2.7, 1.0], // underside
  [0.8, 0.32, -0.22, 3.9, 1.0], // three-quarter, other side
  [1.0, 0.42, 0.0, 6.283, 0.9], // settle
];

function tumbleAt(p: number) {
  for (let i = 0; i < TUMBLE.length - 1; i++) {
    const a = TUMBLE[i];
    const b = TUMBLE[i + 1];
    if (p <= b[0]) {
      const t = smoothstep((p - a[0]) / (b[0] - a[0]));
      return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t, a[4] + (b[4] - a[4]) * t];
    }
  }
  const z = TUMBLE[TUMBLE.length - 1];
  return [z[1], z[2], z[3], z[4]];
}

export function CoreObject() {
  const outer = useRef<THREE.Group>(null!);
  const tiltG = useRef<THREE.Group>(null!);
  const spinG = useRef<THREE.Group>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  const { viewport, camera } = useThree();
  const controls = useRef<TacetControls>({ explode: 1, crown: 0, glow: 0, finish: "basalt", visible: 0, light: [0.24, 0.36, 1] });

  const state = useRef({ x: 0, y: 0, s: 0.0001, explode: 1, glow: 0, tilt: 0.4, roll: 0, spin: 0, rot: 0, vis: 0, crown: 0, scale: 1, init: false });
  const a = useRef<Target>({ x: 0, y: 0, s: 0, visible: 1 });
  const b = useRef<Target>({ x: 0, y: 0, s: 0, visible: 1 });

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 8);
    const st = state.current;
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);

    const f = store.stageFloat;
    const i0 = Math.max(0, Math.min(STAGES.length - 1, Math.floor(f)));
    const i1 = Math.min(STAGES.length - 1, i0 + 1);
    const k = f - i0;
    const s0 = STAGES[i0];
    const s1 = STAGES[i1];
    const p0 = STAGE_POSES[s0];
    const p1 = STAGE_POSES[s1];
    dockTarget(p0.dock, vp.width, vp.height, p0.fill, a.current);
    dockTarget(p1.dock, vp.width, vp.height, p1.fill, b.current);
    const A = a.current;
    const B = b.current;
    tmp.x = A.x + (B.x - A.x) * k;
    tmp.y = A.y + (B.y - A.y) * k;
    tmp.s = A.s + (B.s - A.s) * k;
    tmp.visible = A.visible + (B.visible - A.visible) * k;

    const w = (id: string) => (s0 === id ? 1 - k : 0) + (s1 === id ? k : 0);

    // explode: "how" opens with scroll
    const explodeHow = Math.min(1, (store.progress.how ?? 0) * 1.6);
    const ex0 = s0 === "how" ? explodeHow : p0.explode;
    const ex1 = s1 === "how" ? explodeHow : p1.explode;
    const explode = Math.max(ex0 + (ex1 - ex0) * k, 1 - store.intro);

    // glow, crown
    const specsW = w("specs");
    const twistW = w("twist");
    const tp = store.progress.twist ?? 0;
    let glowT = p0.glow + (p1.glow - p0.glow) * k;
    glowT = glowT * (1 - specsW) + (0.35 + store.dial * 0.95) * specsW;
    glowT = glowT * (1 - twistW) + (0.25 + smoothstep((tp - 0.55) / 0.25) * 1.15) * twistW;
    const twistCrown = smoothstep((tp - 0.3) / 0.3) * Math.PI * 1.5;
    const crownT = specsW * store.dial * Math.PI * 1.9 + twistW * twistCrown;

    // tumble in "reveal"
    const revealW = w("reveal");
    const [rx, rz, ry, rs] = tumbleAt(store.progress.reveal ?? 0);
    const tiltBase = p0.tilt + (p1.tilt - p0.tilt) * k;
    const tilt = tiltBase * (1 - revealW) + rx * revealW;
    const roll = rz * revealW;
    const spin = p0.spin + (p1.spin - p0.spin) * k + ry * revealW;
    const scaleT = 1 + (rs - 1) * revealW;

    if (!st.init) Object.assign(st, { x: tmp.x, y: tmp.y, s: tmp.s, spin, init: true });

    const lam = store.reducedMotion ? 30 : 5.5;
    st.x = THREE.MathUtils.damp(st.x, tmp.x, lam, dt);
    st.y = THREE.MathUtils.damp(st.y, tmp.y, lam, dt);
    st.s = THREE.MathUtils.damp(st.s, tmp.s, lam, dt);
    st.vis = THREE.MathUtils.damp(st.vis, tmp.visible, 4, dt);
    st.explode = THREE.MathUtils.damp(st.explode, explode, 4.5, dt);
    st.glow = THREE.MathUtils.damp(st.glow, glowT, 3, dt);
    st.tilt = THREE.MathUtils.damp(st.tilt, tilt, revealW > 0.5 ? 6 : 3, dt);
    st.roll = THREE.MathUtils.damp(st.roll, roll, 6, dt);
    st.spin = THREE.MathUtils.damp(st.spin, spin, revealW > 0.5 ? 6 : 2.2, dt);
    st.crown = THREE.MathUtils.damp(st.crown, crownT, 7, dt);
    st.scale = THREE.MathUtils.damp(st.scale, scaleT, 5, dt);

    // idle rotation pauses while scroll drives the tumble or the dial
    const idle = store.reducedMotion ? 0 : 0.16 * (1 - specsW * 0.85) * (1 - revealW) * (1 - twistW * 0.7);
    st.rot += (idle + store.dragVelocity) * dt;
    store.dragVelocity *= Math.pow(0.04, dt);

    const e = st.explode;
    outer.current.position.set(st.x, st.y, 0);
    outer.current.scale.setScalar(Math.max(0.0001, st.s * (1 - e * 0.28) * st.scale));
    tiltG.current.rotation.x = st.tilt + store.pointer.y * 0.12 * (1 - e * 0.5) * (1 - revealW);
    tiltG.current.rotation.z = st.roll - store.pointer.x * 0.08 * (1 - revealW);
    spinG.current.rotation.y = st.rot + st.spin;
    outer.current.visible = st.vis > 0.01;

    // light colour of the core, shared with the aura
    const L = mixRGB(lightFor(s0), lightFor(s1), k);
    store.light = L;
    store.objScreen = [st.x / vp.width + 0.5, st.y / vp.height + 0.5];
    rim.current.color.setRGB(L[0], L[1], L[2], THREE.SRGBColorSpace);
    rim.current.intensity = 6 + st.glow * 10;

    const c = controls.current;
    c.explode = e;
    c.crown = st.crown;
    c.glow = st.glow;
    c.finish = store.finish;
    c.visible = st.vis;
    c.light = L;
  });

  return (
    <group ref={outer}>
      <pointLight ref={rim} position={[0, 0.6, -1.6]} distance={6} decay={1.4} />
      <group ref={tiltG}>
        <group ref={spinG}>
          <TacetModel controls={controls} />
        </group>
      </group>
    </group>
  );
}
