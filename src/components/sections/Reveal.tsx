"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { reveal } from "@/content/site";
import { Dock } from "@/components/ui/primitives";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The product shot: pinned under a spotlight while scrolling turns the object through
 * every view — top, three-quarter, on its edge, underside — like a turntable you drive.
 */
export function Reveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);

  const phase = p < 0.5 ? 0 : 1;
  const view = Math.min(reveal.views.length - 1, Math.round(p * (reveal.views.length - 1)));
  const copy = reveal.phases[phase];

  return (
    <section ref={ref} id="reveal" data-stage="reveal" aria-labelledby="reveal-title" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x relative z-20 grid h-full grid-cols-1 content-center gap-6 md:grid-cols-12 md:items-center">
          <div className="order-2 md:order-none md:col-span-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={copy.title}
                id="reveal-title"
                initial={{ opacity: 0, filter: "blur(14px)", y: 16 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(14px)", y: -16 }}
                transition={{ duration: 0.7, ease }}
                className="text-sheen font-display text-[clamp(2rem,1.3rem+2vw,3.3rem)] font-[340] leading-[1.02] tracking-[-0.035em]"
              >
                {copy.title}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="relative order-1 md:order-none md:col-span-5">
            <Dock id="dock-reveal" className="mx-auto aspect-square w-[min(84vw,46vh)] md:w-full md:max-w-[min(640px,70vh)]" />
          </div>

          <div className="order-3 md:order-none md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={copy.text}
                initial={{ opacity: 0, filter: "blur(14px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(14px)" }}
                transition={{ duration: 0.7, delay: 0.08, ease }}
                className="t-body max-w-[34ch] text-[15px] text-white/75 md:ml-auto md:text-right"
              >
                {copy.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* View index along the bottom, like a turntable readout */}
        <div className="container-x absolute bottom-8 left-0 right-0 z-20">
          <div className="flex items-center gap-4">
            <span className="t-small tabular w-12">{String(Math.round(p * 360)).padStart(3, "0")}°</span>
            <div className="relative h-px flex-1 bg-white/15">
              <div className="absolute inset-y-0 left-0 bg-white/80" style={{ width: `${p * 100}%` }} />
            </div>
          </div>
          <ol className="mt-3 hidden justify-between text-[12px] md:flex">
            {reveal.views.map((v, i) => (
              <li key={v} className="transition-colors duration-500" style={{ color: i === view ? "#fff" : "rgba(255,255,255,0.35)" }}>
                {v}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
