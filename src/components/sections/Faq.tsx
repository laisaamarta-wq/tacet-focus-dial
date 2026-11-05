"use client";

import { useId, useState } from "react";
import { faq } from "@/content/site";
import { SplitReveal } from "@/components/ui/SplitReveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="faq" data-stage="faq" aria-labelledby="faq-title" className="relative py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20 grid grid-cols-1 gap-10 md:grid-cols-12">
        <SplitReveal id="faq-title" text={faq.title} className="text-sheen t-h2 md:col-span-4" />
        <ul className="border-t hairline md:col-span-7 md:col-start-6">
          {faq.items.map((it, i) => {
            const on = open === i;
            const pid = `${uid}-p${i}`;
            return (
              <li key={it.q} className="border-b hairline">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={pid}
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="t-h3">{it.q}</span>
                    <span aria-hidden className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span
                        className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-500 ease-out-expo"
                        style={{ transform: on ? "scaleY(0)" : "scaleY(1)" }}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={pid}
                  role="region"
                  className="grid transition-[grid-template-rows] duration-500 ease-out-expo"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="t-body max-w-[60ch] pb-7">{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
