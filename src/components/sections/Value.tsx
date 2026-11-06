"use client";

import { motion } from "motion/react";
import { value } from "@/content/site";
import { Dock } from "@/components/ui/primitives";
import { BlurIn, SplitReveal } from "@/components/ui/SplitReveal";

const ease = [0.16, 1, 0.3, 1] as const;

/** Why it costs what it costs: six concrete reasons, each a number you can check. */
export function Value() {
  return (
    <section id="value" data-stage="value" aria-labelledby="value-title" className="relative py-[clamp(3.5rem,8vh,5rem)] md:py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20 grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[14vh]">
            <SplitReveal id="value-title" text={value.title} className="text-sheen t-h2" />
            <BlurIn>
              <p className="t-lead mt-5 max-w-[34ch]">{value.lead}</p>
            </BlurIn>
            <Dock id="dock-value" className="mt-8 hidden aspect-square w-full max-w-[440px] md:block" />
          </div>
        </div>

        <div className="md:col-span-7">
          <ul className="grid gap-4 sm:grid-cols-2">
            {value.items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 1, delay: (i % 2) * 0.12, ease }}
                className="glass relative overflow-hidden rounded-[22px] p-6"
              >
                <span aria-hidden className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[#ff8a2b] opacity-20 blur-3xl" />
                <p className="relative flex items-baseline gap-2">
                  <span className="text-sheen font-display text-[clamp(3rem,2.2rem+2.6vw,4.6rem)] font-[300] leading-none tracking-[-0.05em] tabular">{it.n}</span>
                  <span className="t-small">{it.unit}</span>
                </p>
                <h3 className="t-h3 relative mt-6">{it.title}</h3>
                <p className="t-body relative mt-2">{it.text}</p>
              </motion.li>
            ))}
          </ul>
          <p className="t-small mt-6">{value.note}</p>
        </div>
      </div>
    </section>
  );
}
