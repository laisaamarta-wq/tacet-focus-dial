"use client";

import { useState } from "react";
import { pricing } from "@/content/site";
import { Dock, MagneticButton } from "@/components/ui/primitives";
import { scrollToId } from "@/components/providers/ScrollDirector";
import { SplitReveal } from "@/components/ui/SplitReveal";

export const TIER_EVENT = "tier:choose";

export function Pricing() {
  const initial = pricing.tiers.find((t) => "featured" in t && t.featured) ?? pricing.tiers[0];
  const [sel, setSel] = useState(initial.id);

  const choose = (id: string) => {
    window.dispatchEvent(new CustomEvent(TIER_EVENT, { detail: id }));
    scrollToId("contact");
  };

  return (
    <section id="pricing" data-stage="pricing" aria-labelledby="pricing-title" className="relative py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <SplitReveal id="pricing-title" text={pricing.title} className="text-sheen t-h2 md:col-span-7" />
          <p className="t-lead md:col-span-4 md:col-start-9">{pricing.lead}</p>
        </div>

        <Dock id="dock-pricing" className="mx-auto my-6 aspect-square w-[min(66vw,34vh)] md:my-4 md:aspect-[16/5] md:w-full" />

        <div role="radiogroup" aria-label="Package" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pricing.tiers.map((t) => {
            const on = t.id === sel;
            const featured = "featured" in t && t.featured;
            return (
              <div
                key={t.id}
                onPointerEnter={(e) => e.pointerType === "mouse" && setSel(t.id)}
                className="glass relative flex flex-col overflow-hidden rounded-[26px] p-6 transition-[transform,box-shadow] duration-500 md:p-8"
                style={{
                  boxShadow: on ? "0 0 0 1px rgba(140,160,255,0.55), 0 30px 80px -30px rgba(61,91,255,0.7)" : undefined,
                  transform: on ? "translateY(-4px)" : "none",
                }}
              >
                {featured && <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#7b3cff] opacity-40 blur-3xl" />}
                <button role="radio" aria-checked={on} onClick={() => setSel(t.id)} className="flex items-baseline justify-between gap-4 text-left">
                  <span className="font-display text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-[300] tracking-[-0.03em]">{t.name}</span>
                  {featured && <span className="rounded-full bg-cobalt px-2.5 py-0.5 text-[12px] font-medium text-white">Most chosen</span>}
                </button>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[clamp(2.4rem,1.8rem+2vw,3.4rem)] font-[300] leading-none tracking-[-0.04em] tabular">
                    {pricing.currency}
                    {t.price}
                  </span>
                  <span className="t-small">{t.unit}</span>
                </p>
                <p className="t-body mt-4 max-w-[34ch]">{t.summary}</p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px]">
                      <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-current opacity-50" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <MagneticButton variant={on ? "solid" : "ghost"} onClick={() => choose(t.id)} className="w-full md:w-auto">
                    {t.cta}
                  </MagneticButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
