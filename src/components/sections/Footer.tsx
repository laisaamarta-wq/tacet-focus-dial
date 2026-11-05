"use client";

import { useEffect, useRef, useState } from "react";
import { brand, footer, legal } from "@/content/site";
import { Logo } from "@/components/brand/Logo";
import { LEGAL_EVENT } from "@/lib/form-config";
import { Dock } from "@/components/ui/primitives";

type LegalKey = keyof typeof legal;

function LegalDialog({ which, onClose }: { which: LegalKey | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (which && !d.open) d.showModal();
    if (!which && d.open) d.close();
  }, [which]);
  const doc = which ? legal[which] : null;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="legal-title"
      className="m-auto w-[min(92vw,560px)] rounded-[20px] bg-chalk p-0 text-ink backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {doc && (
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-6">
            <h2 id="legal-title" className="font-display text-2xl font-[350] tracking-[-0.02em]">
              {doc.title}
            </h2>
            <button type="button" onClick={onClose} className="rounded-full border border-ink/15 px-3 py-1 text-[13px]">
              Close
            </button>
          </div>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-graphite">
            {doc.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Footer() {
  const [which, setWhich] = useState<LegalKey | null>(null);

  useEffect(() => {
    const on = (e: Event) => setWhich((e as CustomEvent<LegalKey>).detail);
    window.addEventListener(LEGAL_EVENT, on);
    return () => window.removeEventListener(LEGAL_EVENT, on);
  }, []);

  return (
    <footer className="relative overflow-hidden pt-10" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Footer
      </h2>
      <div className="container-x relative z-20 grid grid-cols-2 gap-10 border-t hairline pt-12 md:grid-cols-12">
        {/* the object comes to rest here at the very end of the page */}
        <Dock id="dock-footer" className="order-last col-span-2 mx-auto aspect-square w-[min(56vw,28vh)] md:order-none md:col-span-2 md:col-start-5 md:row-start-1 md:mx-auto md:my-0 md:w-full md:max-w-[160px]" />
        <div className="col-span-2 md:col-span-4 md:row-start-1">
          <Logo />
          <p className="t-body mt-5 max-w-[34ch]">{brand.tagline} A focus dial with no screen, designed for desks that do real work.</p>
          <a href={`mailto:${footer.contact.email}`} className="mt-6 inline-block text-[1.05rem] underline-offset-4 hover:underline">
            {footer.contact.email}
          </a>
        </div>

        {footer.columns.map((col, i) => (
          <nav key={col.title} aria-label={col.title} className={i === 0 ? "md:col-span-2 md:col-start-7 md:row-start-1" : "md:col-span-2 md:row-start-1"}>
            <p className="t-small">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-2 md:row-start-1">
          <p className="t-small">Follow</p>
          <ul className="mt-3 space-y-2">
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none mt-16 select-none overflow-hidden">
        <div className="container-x flex items-end gap-[2vw] opacity-[0.09]">
          <p className="font-display text-[clamp(5rem,-1rem+22vw,22rem)] font-[250] leading-[0.78] tracking-[0.02em]">{brand.name}</p>
        </div>
      </div>

      <div className="container-x relative z-20 border-t hairline py-6 text-[13px] text-[color:var(--page-muted)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {brand.name}. Design concept.</p>
          <ul className="flex flex-wrap gap-6">
            {(Object.keys(legal) as LegalKey[]).map((k) => (
              <li key={k}>
                <button type="button" onClick={() => setWhich(k)} className="hover:text-[color:var(--page-fg)]">
                  {legal[k].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 max-w-[90ch]">{brand.disclaimer}</p>
      </div>

      <LegalDialog which={which} onClose={() => setWhich(null)} />
    </footer>
  );
}
