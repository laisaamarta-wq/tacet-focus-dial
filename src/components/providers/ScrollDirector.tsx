"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { STAGES, store, smoothstep, type StageId } from "@/lib/store";
import { edgeFor } from "@/lib/stages";

let lenis: Lenis | null = null;

/** Smooth scroll to a section — used by navigation and buttons */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: 0 });
  else el.scrollIntoView({ behavior: store.reducedMotion ? "auto" : "smooth" });
}

export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: store.reducedMotion ? "auto" : "smooth" });
}

type Box = { id: StageId; top: number; height: number };

/**
 * Turns scroll position into a continuous chapter index (store.stageFloat),
 * per-chapter progress, and the strength of the edge glow (--edge).
 */
export function ScrollDirector() {
  useEffect(() => {
    store.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!store.reducedMotion) lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });

    let boxes: Box[] = [];
    const measure = () => {
      boxes = STAGES.map((id) => {
        const el = document.querySelector<HTMLElement>(`[data-stage="${id}"]`);
        if (!el) return { id, top: 0, height: 0 };
        const r = el.getBoundingClientRect();
        return { id, top: r.top + window.scrollY, height: r.height };
      }).filter((b) => b.height > 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    const root = document.documentElement;
    let lastEdge = -1;

    const tick = (time: number) => {
      lenis?.raf(time);
      const vh = window.innerHeight;
      const ref = window.scrollY + vh * 0.5;
      const span = vh * 0.8;

      let float = 0;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const bottom = b.top + b.height;
        store.progress[b.id] = Math.min(1, Math.max(0, (window.scrollY - b.top) / Math.max(1, b.height - vh)));
        if (ref >= b.top && ref < bottom) {
          if (i < boxes.length - 1 && ref > bottom - span / 2) float = i + smoothstep((ref - (bottom - span / 2)) / span);
          else if (i > 0 && ref < b.top + span / 2) float = i - 1 + smoothstep((ref - (b.top - span / 2)) / span);
          else float = i;
        } else if (i === boxes.length - 1 && ref >= bottom) {
          float = i;
        }
      }
      // map the measured index back onto STAGES order (all stages are present on the page)
      store.stageFloat = float;

      const i0 = Math.floor(float);
      const k = float - i0;
      const s0 = boxes[i0]?.id;
      const s1 = boxes[Math.min(boxes.length - 1, i0 + 1)]?.id;
      if (s0 && s1) {
        const edge = edgeFor(s0) * (1 - k) + edgeFor(s1) * k;
        if (Math.abs(edge - lastEdge) > 0.004) {
          lastEdge = edge;
          root.style.setProperty("--edge", edge.toFixed(3));
        }
      }

      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    const onPointer = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // In-page anchor links → smooth scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
