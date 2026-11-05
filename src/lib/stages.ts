import { clamp01, smoothstep, store, type StageId } from "./store";

/**
 * Per-chapter direction.
 * dock    — id of the DOM box the object lands in; layout decides where, so responsive comes free.
 * fill    — share of the dock the object occupies.
 * explode — 0 assembled, 1 opened into layers.
 * tilt    — lean toward the viewer (rad); spin — extra Y rotation.
 * aura    — background colours [base, glow A, glow B], turbulence and top spotlight strength.
 */
export type StagePose = {
  dock: string | null;
  fill: number;
  explode: number;
  glow: number;
  tilt: number;
  spin: number;
  aura: { a: string; b: string; c: string; turb: number; spot: number };
  /** Iridescent glow around the screen edges, 0..1 */
  edge: number;
};

export const STAGE_POSES: Record<StageId, StagePose> = {
  hero: { dock: "dock-hero", fill: 0.78, explode: 0, glow: 0.9, tilt: 0.42, spin: 0, aura: { a: "#060818", b: "#2440ff", c: "#7b3cff", turb: 0.3, spot: 0.15 }, edge: 0.55 },
  reveal: { dock: "dock-reveal", fill: 0.82, explode: 0, glow: 0.8, tilt: 0.4, spin: 0, aura: { a: "#05050a", b: "#2a2f8f", c: "#1a1f5c", turb: 0.1, spot: 1 }, edge: 0 },
  twist: { dock: "dock-twist", fill: 0.62, explode: 0, glow: 0.3, tilt: 0.55, spin: 1.2, aura: { a: "#09040f", b: "#ff3d6e", c: "#ff8a3d", turb: 1, spot: 0.2 }, edge: 0 },
  does: { dock: null, fill: 0.6, explode: 0, glow: 0.9, tilt: 0.4, spin: 2, aura: { a: "#0b0720", b: "#6b3cff", c: "#2b8cff", turb: 0.3, spot: 0 }, edge: 0.25 },
  how: { dock: "dock-how", fill: 0.92, explode: 1, glow: 0.9, tilt: 0.55, spin: 3.2, aura: { a: "#03121f", b: "#00b8ff", c: "#2440ff", turb: 0.25, spot: 0.3 }, edge: 0.2 },
  light: { dock: "dock-light", fill: 0.8, explode: 0, glow: 1.3, tilt: 0.5, spin: 4, aura: { a: "#05070f", b: "#3d5bff", c: "#3d5bff", turb: 0.2, spot: 0 }, edge: 0.85 },
  showcase: { dock: "dock-showcase", fill: 0.62, explode: 0, glow: 0.9, tilt: 0.35, spin: 4.6, aura: { a: "#0a0820", b: "#5a3cff", c: "#e04fd8", turb: 0.25, spot: 0 }, edge: 0.3 },
  value: { dock: "dock-value", fill: 0.8, explode: 0.35, glow: 0.8, tilt: 0.5, spin: 5.4, aura: { a: "#120b06", b: "#ff8a2b", c: "#7b3cff", turb: 0.2, spot: 0.5 }, edge: 0.2 },
  specs: { dock: "dock-specs", fill: 0.85, explode: 0, glow: 1, tilt: 0.45, spin: 6, aura: { a: "#050a22", b: "#2f55ff", c: "#00c8ff", turb: 0.2, spot: 0.2 }, edge: 0.45 },
  testimonials: { dock: null, fill: 0.6, explode: 0, glow: 0.4, tilt: 0.4, spin: 6.6, aura: { a: "#0d0820", b: "#7b3cff", c: "#2440ff", turb: 0.25, spot: 0 }, edge: 0.2 },
  pricing: { dock: "dock-pricing", fill: 0.7, explode: 0, glow: 0.9, tilt: 0.5, spin: 7.2, aura: { a: "#050820", b: "#2f4bff", c: "#d94fff", turb: 0.25, spot: 0.3 }, edge: 0.45 },
  faq: { dock: null, fill: 0.6, explode: 0, glow: 0.4, tilt: 0.4, spin: 7.6, aura: { a: "#06070d", b: "#24305a", c: "#2f4bff", turb: 0.15, spot: 0 }, edge: 0.1 },
  contact: { dock: "dock-contact,dock-footer", fill: 0.85, explode: 0, glow: 1.1, tilt: 0.42, spin: 8, aura: { a: "#060818", b: "#3d5bff", c: "#8b3cff", turb: 0.35, spot: 0.2 }, edge: 0.75 },
};

/** Light states of the core (sRGB hex) */
export const LIGHT = { focus: "#3d5bff", warn: "#ffad3d", done: "#3dffb0", chaos: "#ff3d6e" };

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mixRGB = (a: number[], b: number[], t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** Which light-language state is showing, 0..2 continuous, from the "light" chapter progress */
export function lightStateFloat() {
  return clamp01((store.progress.light ?? 0) * 1.15) * 2;
}

/** Core light colour for one chapter */
export function lightFor(stage: StageId): [number, number, number] {
  if (stage === "light") {
    const s = lightStateFloat();
    const f = hex(LIGHT.focus), w = hex(LIGHT.warn), d = hex(LIGHT.done);
    return s < 1 ? mixRGB(f, w, smoothstep(s)) : mixRGB(w, d, smoothstep(s - 1));
  }
  if (stage === "twist") {
    const p = store.progress.twist ?? 0;
    return mixRGB(hex(LIGHT.chaos), hex(LIGHT.focus), smoothstep((p - 0.3) / 0.3));
  }
  return hex(LIGHT.focus);
}

/** Aura colours for one chapter (dynamic chapters react to their own progress) */
export function auraFor(stage: StageId) {
  const a = STAGE_POSES[stage].aura;
  let A = hex(a.a), B = hex(a.b), C = hex(a.c), turb = a.turb;
  const spot = a.spot;
  if (stage === "twist") {
    // chaos (hot pink, orange, turbulent) → silence (deep cobalt, still)
    const k = smoothstep(((store.progress.twist ?? 0) - 0.35) / 0.4);
    A = mixRGB(A, hex("#04061a"), k);
    B = mixRGB(B, hex("#2440ff"), k);
    C = mixRGB(C, hex("#1a1f6a"), k);
    turb = turb + (0.08 - turb) * k;
  }
  if (stage === "light") {
    const L = lightFor("light");
    B = L;
    C = mixRGB(L, [0.2, 0.1, 0.6], 0.5);
  }
  return { A, B, C, turb, spot };
}

export { mixRGB };

/** Edge glow for one chapter */
export function edgeFor(stage: StageId) {
  if (stage === "twist") {
    const p = store.progress.twist ?? 0;
    return smoothstep((p - 0.55) / 0.2);
  }
  if (stage === "specs") return 0.25 + store.dial * 0.6;
  return STAGE_POSES[stage].edge;
}
