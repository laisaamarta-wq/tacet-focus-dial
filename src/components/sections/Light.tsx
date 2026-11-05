"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { light } from "@/content/site";
import { Dock } from "@/components/ui/primitives";
import { SplitReveal } from "@/components/ui/SplitReveal";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The light language, pinned: scrolling walks the core through blue → amber → mint.
 * The object, the aura behind it and the screen-edge glow all take the colour of the state.
 */
export function Light() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);

  const n = light.states.length;
  const active = Math.min(n - 1, Math.round(Math.min(1, p * 1.15) * (n - 1)));
  const s = light.states[active];

  return (
    <section ref={ref} id="light" data-stage="light" aria-labelledby="light-title" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x relative z-20 grid h-full grid-cols-1 content-center gap-8 py-20 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <SplitReveal id="light-title" text={light.title} className="text-sheen t-h2" />
            <p className="t-lead mt-4 max-w-[34ch]">{light.lead}</p>

            <ol className="mt-10 space-y-3" aria-label="Light states">
              {light.states.map((st, i) => {
                const on = i === active;
                return (
                  <li key={st.id} className="flex items-center gap-4 transition-opacity duration-500" style={{ opacity: on ? 1 : 0.4 }}>
                    <span
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 rounded-full transition-transform duration-500"
                      style={{ background: st.color, boxShadow: on ? `0 0 18px 4px ${st.color}` : "none", transform: on ? "scale(1.25)" : "scale(1)" }}
                    />
                    <span className="font-display text-[1.05rem] font-[400] tracking-[-0.01em]">{st.name}</span>
                    <span className="t-small">{st.title}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 min-h-[9rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(14px)", y: -16 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <p
                    className="font-display text-[clamp(2.2rem,1.4rem+3vw,4rem)] font-[340] leading-[1] tracking-[-0.04em]"
                    style={{ color: s.color, textShadow: `0 0 40px ${s.color}66` }}
                  >
                    {s.title}
                  </p>
                  <p className="t-body mt-4 max-w-[40ch]">{s.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative order-first md:order-none md:col-span-6 md:col-start-7">
            <Dock id="dock-light" className="mx-auto aspect-square w-[min(70vw,38vh)] md:w-full md:max-w-[620px]" />
          </div>
        </div>

        {/* progress through the three states */}
        <div aria-hidden className="container-x absolute bottom-8 left-0 right-0 z-20">
          <div className="relative h-px w-full bg-white/12">
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: `${Math.min(1, p * 1.15) * 100}%`, background: `linear-gradient(90deg, ${light.states.map((x) => x.color).join(",")})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
