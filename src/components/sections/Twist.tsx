"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { twist } from "@/content/site";
import { smoothstep } from "@/lib/store";
import { Dock } from "@/components/ui/primitives";

const ease = [0.16, 1, 0.3, 1] as const;
const APP_COLOR: Record<string, string> = {
  "Team chat": "#8b5cff",
  Mail: "#3d8bff",
  Calendar: "#ff5c5c",
  News: "#ffad3d",
  Shop: "#ff3dae",
  Social: "#3dd8ff",
};

/**
 * The story in one pinned scene: notifications pile up around the object (chaos, hot colours),
 * the crown turns, and everything is pulled into the core (silence, deep blue, edge glow).
 */
export function Twist() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);

  const phase = p < 0.3 ? 0 : p < 0.58 ? 1 : 2;
  const copy = twist.phases[phase];
  const turn = smoothstep((p - 0.3) / 0.3); // crown twist 0..1
  const minutes = Math.round(turn * 9) * 5; // 0..45 in five-minute clicks
  const n = twist.notifications.length;
  const shown = twist.notifications.filter((_, i) => p > 0.02 + i * 0.028).length;
  const held = Math.round(smoothstep((p - 0.6) / 0.25) * 37);

  return (
    <section ref={ref} id="twist" data-stage="twist" aria-labelledby="twist-title" className="relative h-[360vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* object + twist ring */}
        <div className="absolute inset-0 flex items-start justify-center pt-[17vh] md:items-center md:pt-0">
          <div className="relative w-[min(50vw,30vh)] md:w-[min(30vw,46vh)]">
            <Dock id="dock-twist" className="aspect-square w-full" />
            <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-[-14%] h-[128%] w-[128%] -rotate-90">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#3d5bff"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${turn * 50} 100`}
                style={{ filter: "drop-shadow(0 0 4px #3d5bff)" }}
              />
            </svg>
            <AnimatePresence>
              {phase >= 1 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-[22%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] font-[300] tabular"
                >
                  {phase === 1 ? `${minutes} min` : "In focus"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* notifications */}
        <div aria-hidden className="absolute inset-0">
          {twist.notifications.map((nt, i) => {
            const appear = smoothstep((p - (0.02 + i * 0.028)) / 0.08);
            const absorb = smoothstep((p - (0.58 + (i / n) * 0.12)) / 0.14);
            const bob = Math.sin(p * 40 + i * 1.7) * (1 - absorb) * 0.6;
            const x = nt.x * (1 - absorb) * (1 + (1 - appear) * 0.6);
            const y = (nt.y + bob) * (1 - absorb) * (1 + (1 - appear) * 0.6);
            const scale = (0.9 + appear * 0.1) * (1 - absorb * 0.85);
            const blur = (1 - appear) * 12 + absorb * 10;
            const opacity = appear * (1 - absorb);
            return (
              <div
                key={i}
                className="glass absolute left-1/2 top-1/2 w-[min(46vw,250px)] rounded-2xl px-3.5 py-3"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}vw, ${y}vh) rotate(${nt.r * (1 - absorb)}deg) scale(${scale})`,
                  filter: `blur(${blur}px)`,
                  opacity,
                  zIndex: 15,
                }}
              >
                <div className="flex items-center gap-2 text-[11px] text-white/60">
                  <span className="h-3.5 w-3.5 rounded-[4px]" style={{ background: APP_COLOR[nt.app] ?? "#888" }} />
                  {nt.app}
                  <span className="ml-auto">now</span>
                </div>
                <p className="mt-1 truncate text-[13px] text-white/90">{nt.text}</p>
              </div>
            );
          })}
        </div>

        {/* copy */}
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-[7vh] z-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(14px)", y: -18 }}
              transition={{ duration: 0.7, ease }}
              className="max-w-[30rem]"
            >
              <p className="t-small">{copy.kicker}</p>
              <h2 id="twist-title" className="text-sheen mt-2 font-display text-[clamp(2.2rem,1.3rem+3.4vw,4.6rem)] font-[340] leading-[1] tracking-[-0.04em]">
                {copy.title}
              </h2>
              <p className="t-body mt-4 max-w-[38ch] text-white/75">{copy.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="text-left md:text-right" aria-live="polite">
            <p className="font-display text-[clamp(2.6rem,1.6rem+3vw,4.4rem)] font-[300] leading-none tracking-[-0.04em] tabular">
              {phase < 2 ? shown : held}
            </p>
            <p className="t-small mt-2">{phase < 2 ? "notifications this minute" : `${twist.heldLabel}, until 11:40`}</p>
            <p className="mt-1 text-[11px] text-white/35">{twist.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
