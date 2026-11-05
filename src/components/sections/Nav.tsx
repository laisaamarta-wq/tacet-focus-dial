"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { brand, hero, nav } from "@/content/site";
import { MagneticButton } from "@/components/ui/primitives";
import { Logo } from "@/components/brand/Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
      style={{
        background: scrolled && !open ? "color-mix(in srgb, var(--page-bg) 72%, transparent)" : "transparent",
        backdropFilter: scrolled && !open ? "blur(14px) saturate(1.2)" : "none",
        borderBottom: `1px solid ${scrolled && !open ? "var(--page-line)" : "transparent"}`,
        color: open ? "#ecebe5" : undefined,
      }}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-cobalt focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label={`${brand.name}, back to top`}>
          <Logo />
        </a>
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex gap-8 text-[14px]">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="relative py-2 opacity-75 transition-opacity hover:opacity-100">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <MagneticButton href="#contact" className="!h-11 !px-5">
              {hero.ctaPrimary}
            </MagneticButton>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border hairline lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="absolute h-px w-4 bg-current transition-transform duration-500 ease-out-expo" style={{ transform: open ? "rotate(45deg)" : "translateY(-3px)" }} />
            <span aria-hidden className="absolute h-px w-4 bg-current transition-transform duration-500 ease-out-expo" style={{ transform: open ? "rotate(-45deg)" : "translateY(3px)" }} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 -z-10 flex flex-col justify-between bg-basalt px-6 pb-10 pt-28 text-[#ecebe5] lg:hidden"
          >
            <nav aria-label="Mobile navigation">
              <ul className="space-y-2">
                {nav.map((n, i) => (
                  <motion.li key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <a href={`#${n.id}`} onClick={() => setOpen(false)} className="font-display text-[2.2rem] font-[300] tracking-[-0.03em]">
                      {n.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <MagneticButton href="#contact" onClick={() => setOpen(false)}>
              {hero.ctaPrimary}
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
