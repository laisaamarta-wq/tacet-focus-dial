"use client";

import { useEffect, useRef } from "react";
import { animate, motion } from "motion/react";
import { brand, hero } from "@/content/site";
import { store } from "@/lib/store";
import { Dock, MagneticButton } from "@/components/ui/primitives";

const ease = [0.16, 1, 0.3, 1] as const;
const CHIP_DOT = ["#3d5bff", "#8b5cff", "#3dffb0"];

export function Hero() {
  const dragRef = useRef<HTMLDivElement>(null);

  // Intro: the object assembles from its layers while a light ring pulses out
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      store.intro = 1;
      return;
    }
    const ctrl = animate(0, 1, { duration: 2.4, delay: 0.35, ease, onUpdate: (v) => (store.intro = v) });
    return () => ctrl.stop();
  }, []);

  // Horizontal drag spins the object with inertia
  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    let down = false;
    let lastX = 0;
    let lastT = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      lastT = performance.now();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      store.dragVelocity = Math.max(-14, Math.min(14, ((e.clientX - lastX) / dt) * 9));
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      down = false;
      el.style.cursor = "";
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section id="top" data-stage="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-[14vw] pt-24 md:pb-0">
      <div className="container-x relative z-20 grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[13px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt" />
            </span>
            {hero.badge}
          </motion.p>
          <h1 className="t-display text-[clamp(3.2rem,1.6rem+7vw,8.5rem)]">
            {hero.title.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="text-sheen block"
                  initial={{ y: "105%", filter: "blur(12px)" }}
                  animate={{ y: "0%", filter: "blur(0px)" }}
                  transition={{ duration: 1.3, delay: 0.25 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.1, delay: 1 }} className="mt-7">
            <p className="t-lead max-w-[40ch] text-white/80">{hero.lead}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="What happens when you twist the crown">
              {hero.chips.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.15, duration: 0.7, ease }}
                  className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]"
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: CHIP_DOT[i], boxShadow: `0 0 10px ${CHIP_DOT[i]}` }} />
                  {c}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href="#contact">{hero.ctaPrimary}</MagneticButton>
              <MagneticButton href="#reveal" variant="ghost">
                {hero.ctaSecondary}
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        <div className="relative order-first md:order-none md:col-span-6">
          <Dock id="dock-hero" className="mx-auto aspect-square w-[min(80vw,40vh)] md:w-full md:max-w-[640px]" />
          <div ref={dragRef} className="absolute inset-0 z-30 cursor-grab touch-pan-y" role="img" aria-label={`${brand.product}, interactive 3D model. Drag to turn it.`} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="t-small pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex"
          >
            <span aria-hidden className="inline-block h-px w-6 bg-current" />
            {hero.hint}
          </motion.p>
        </div>
      </div>

      {/* Giant outlined wordmark behind the object */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none overflow-hidden leading-[0.8]">
        <div className="text-outline container-x flex justify-between font-display text-[clamp(5rem,-1rem+24vw,24rem)] font-[300] tracking-[-0.04em]">
          {brand.name.split("").map((l, i) => (
            <motion.span key={i} initial={{ y: "70%", opacity: 0 }} animate={{ y: "24%", opacity: 1 }} transition={{ duration: 1.8, delay: 0.15 + i * 0.08, ease }}>
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.2em] text-[color:var(--page-muted)] md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span className="absolute inset-x-0 top-0 h-4 bg-white" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
        </span>
      </motion.div>
      <span className="sr-only">
        {brand.name} — {brand.tagline}
      </span>
    </section>
  );
}
