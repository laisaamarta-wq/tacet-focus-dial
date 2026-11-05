/**
 * Shared state without React re-renders.
 * The DOM layer writes here (scroll, pointer, dial, finish); the 3D scene and the aura read it every frame.
 */

export type StageId =
  | "hero"
  | "reveal"
  | "twist"
  | "does"
  | "how"
  | "light"
  | "showcase"
  | "value"
  | "specs"
  | "testimonials"
  | "pricing"
  | "faq"
  | "contact";

export const STAGES: StageId[] = [
  "hero",
  "reveal",
  "twist",
  "does",
  "how",
  "light",
  "showcase",
  "value",
  "specs",
  "testimonials",
  "pricing",
  "faq",
  "contact",
];

export type Finish = "basalt" | "fog" | "moss";

export const store = {
  /** Continuous chapter index: 2.4 = 40% of the way from chapter 2 to chapter 3 */
  stageFloat: 0,
  /** Scroll progress inside each chapter, 0..1 (for pinned chapters: through the pin) */
  progress: {} as Record<StageId, number>,
  /** Pointer position, -1..1 */
  pointer: { x: 0, y: 0 },
  /** Angular velocity from dragging the hero object */
  dragVelocity: 0,
  finish: "basalt" as Finish,
  /** Session length set on the Try it dial, 0..1 of the range */
  dial: 0.47,
  /** 0 → 1 while the object assembles on load */
  intro: 0,
  /** Colour of the core light right now (linear 0..1 RGB), shared with the aura */
  light: [0.24, 0.36, 1] as [number, number, number],
  /** Object position on screen, 0..1 (y up), shared with the aura */
  objScreen: [0.7, 0.5] as [number, number],
  reducedMotion: false,
  webgl: true,
};

for (const s of STAGES) store.progress[s] = 0;

export const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
