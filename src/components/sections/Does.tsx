"use client";

import { motion } from "motion/react";
import { does } from "@/content/site";
import { BlurIn, SplitReveal } from "@/components/ui/SplitReveal";

const ease = [0.16, 1, 0.3, 1] as const;
const ACCENT = ["#3d5bff", "#8b5cff", "#3dd8ff", "#3dffb0"];

function Icon({ i }: { i: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (i === 0)
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" {...common} />
        <path d="M10.5 18.5h3" {...common} />
        <path d="M13.5 8.5a3 3 0 1 1-3.6 3.6 3.6 3.6 0 0 0 3.6-3.6z" {...common} />
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" {...common} />
        <path d="M3.5 9.5h17M8 3v4M16 3v4M8 14h8" {...common} />
      </svg>
    );
  if (i === 2)
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M4 5.5h16v10H9l-5 4z" {...common} />
        <circle cx="16.5" cy="10.5" r="1.4" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path d="M17.5 4.5a8.5 8.5 0 1 1-11 0" {...common} />
      <circle cx="12" cy="12.5" r="3" fill="currentColor" />
    </svg>
  );
}

export function Does() {
  return (
    <section id="does" data-stage="does" aria-labelledby="does-title" className="relative py-[clamp(3.5rem,8vh,5rem)] md:py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <SplitReveal id="does-title" text={does.title} className="text-sheen t-h2 md:col-span-7" />
          <BlurIn className="md:col-span-4 md:col-start-9">
            <p className="t-lead">{does.lead}</p>
          </BlurIn>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {does.items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: i * 0.1, ease }}
              className="glass group relative flex flex-col overflow-hidden rounded-[22px] p-5"
            >
              {/* glow wash in the card's colour */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
                style={{ background: ACCENT[i] }}
              />
              {/* mini status widget */}
              <div className="relative rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-[12px] text-white/60" style={{ color: ACCENT[i] }}>
                  <Icon i={i} />
                  <span className="text-white/60">{it.ui.label}</span>
                </div>
                <p className="mt-3 flex items-center gap-2 font-display text-[1.35rem] font-[350] tracking-[-0.02em]">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT[i], boxShadow: `0 0 12px ${ACCENT[i]}` }} />
                  {it.ui.state}
                </p>
                <p className="t-small mt-1 tabular">{it.ui.detail}</p>
              </div>
              <h3 className="t-h3 relative mt-6">{it.title}</h3>
              <p className="t-body relative mt-2">{it.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
