"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { how } from "@/content/site";
import { Dock } from "@/components/ui/primitives";
import { scrollToY } from "@/components/providers/ScrollDirector";

const ease = [0.16, 1, 0.3, 1] as const;
const CALLOUT_Y = ["58%", "30%", "80%"]; // crown, haptic ring, core

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [p, setP] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setP(v);
    const idx = Math.min(how.steps.length - 1, Math.floor(v * how.steps.length * 0.999));
    if (idx !== active) setActive(idx);
  });

  return (
    <section ref={ref} id="how" data-stage="how" aria-labelledby="how-title" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x relative z-20 grid h-full grid-cols-1 content-center gap-6 py-20 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5 md:self-center">
            <h2 id="how-title" className="text-sheen t-h2">
              {how.title}
            </h2>
            <p className="t-lead mt-4 max-w-[30ch]">{how.lead}</p>

            <ol className="mt-10 hidden space-y-1 md:block">
              {how.steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = ref.current;
                      if (!el) return;
                      const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / how.steps.length;
                      scrollToY(top);
                    }}
                    aria-current={i === active ? "step" : undefined}
                    className="grid w-full grid-cols-[3rem_1fr] items-baseline border-t hairline py-5 text-left transition-opacity duration-500"
                    style={{ opacity: i === active ? 1 : 0.38 }}
                  >
                    <span className="tabular t-small">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="t-h3 block">{s.title}</span>
                      <span
                        className="t-body grid transition-[grid-template-rows] duration-700 ease-out-expo"
                        style={{ gridTemplateRows: i === active ? "1fr" : "0fr" }}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-[40ch] pt-2">
                            {s.text}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 hidden h-px w-full bg-[color:var(--page-line)] md:block" aria-hidden>
              <div className="h-px bg-[#3dd8ff] shadow-[0_0_8px_#3dd8ff]" style={{ width: `${p * 100}%` }} />
            </div>
          </div>

          <div className="relative order-first md:order-none md:col-span-7">
            <Dock id="dock-how" className="mx-auto aspect-square w-[min(80vw,44vh)] md:w-full md:max-w-[680px]" />
            {/* Part callouts */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] md:block">
              {how.steps.map((s, i) => {
                const layer = i; // step 1 = crown (top)
                return (
                  <div
                    key={s.title}
                    className="absolute right-0 flex w-full items-center gap-3 transition-opacity duration-700"
                    style={{ bottom: CALLOUT_Y[layer], opacity: i === active ? 1 : 0.28 }}
                  >
                    <span className="h-px flex-1 bg-current opacity-40" />
                    <span className="t-small whitespace-nowrap text-[color:var(--page-fg)]">{s.part}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: only the active step */}
          <div className="md:hidden">
            <div className="mb-4 flex gap-1.5" aria-hidden>
              {how.steps.map((_, i) => (
                <span key={i} className="h-0.5 flex-1 rounded-full" style={{ background: i <= active ? "var(--color-cobalt)" : "var(--page-line)" }} />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
                aria-live="polite"
              >
                <p className="t-small tabular">
                  Step {active + 1} of {how.steps.length}
                </p>
                <h3 className="t-h3 mt-1">{how.steps[active].title}</h3>
                <p className="t-body mt-2">
                  {how.steps[active].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
