"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { tryIt } from "@/content/site";
import { store, type Finish } from "@/lib/store";
import { Dock } from "@/components/ui/primitives";
import { SplitReveal } from "@/components/ui/SplitReveal";

const { minMinutes: MIN, maxMinutes: MAX, step: STEP } = tryIt;
const STEPS = (MAX - MIN) / STEP; // 17 clicks → 18 positions
const SWEEP = 300; // degrees of travel, starting at 12 o'clock

// Current time, refreshed every 20 s; null on the server
const subscribeClock = (cb: () => void) => {
  const id = setInterval(cb, 20_000);
  return () => clearInterval(id);
};
const clockSnapshot = () => Math.floor(Date.now() / 60_000);

function untilLabel(minutesFromNow: number, nowMinute: number | null) {
  if (nowMinute === null) return "";
  const d = new Date((nowMinute + minutesFromNow) * 60_000);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

function Dial({ minutes, onChange }: { minutes: number; onChange: (m: number) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const now = useSyncExternalStore(subscribeClock, clockSnapshot, () => null);
  const t = (minutes - MIN) / (MAX - MIN);
  const deg = t * SWEEP;

  const fromPointer = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    let a = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // 0 at 12 o'clock, clockwise
    if (a < 0) a += 360;
    if (a > SWEEP + (360 - SWEEP) / 2) a = 0; // past the gap → snap to start
    a = Math.min(SWEEP, a);
    const m = MIN + Math.round(((a / SWEEP) * (MAX - MIN)) / STEP) * STEP;
    if (m !== minutes) onChange(m);
  };

  const C = 140;
  const R = 112;
  const [hx, hy] = polar(C, C, R, deg);

  return (
    <div className="relative mx-auto w-full max-w-[250px] select-none sm:max-w-[300px]">
      <svg
        ref={ref}
        viewBox="0 0 280 280"
        className="w-full touch-none"
        role="slider"
        tabIndex={0}
        aria-label="Session length"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={minutes}
        aria-valuetext={`${minutes} minutes`}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(MAX, minutes + STEP));
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(MIN, minutes - STEP));
          else if (e.key === "Home") onChange(MIN);
          else if (e.key === "End") onChange(MAX);
          else return;
          e.preventDefault();
        }}
        style={{ cursor: "grab" }}
      >
        {Array.from({ length: STEPS + 1 }, (_, i) => {
          const a = (i / STEPS) * SWEEP;
          const [x0, y0] = polar(C, C, R + 16, a);
          const [x1, y1] = polar(C, C, R + (i % 3 === 0 ? 26 : 21), a);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="currentColor" strokeOpacity={a <= deg ? 0.9 : 0.25} strokeWidth="1.5" strokeLinecap="round" />;
        })}
        <path d={arcPath(C, C, R, 0, SWEEP)} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
        {deg > 0.5 && <path d={arcPath(C, C, R, 0, deg)} fill="none" stroke="var(--color-cobalt)" strokeWidth="10" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #3d5bff)" }} />}
        <circle cx={hx} cy={hy} r="15" fill="var(--page-bg)" stroke="var(--color-cobalt)" strokeWidth="3" />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-[clamp(3rem,2.2rem+3vw,4.2rem)] font-[300] leading-none tracking-[-0.05em] tabular">{minutes}</span>
        <span className="t-small mt-1">minutes</span>
        <span className="mt-3 text-[13px] text-cobalt" aria-live="polite">
          {now !== null ? `Focus until ${untilLabel(minutes, now)}` : " "}
        </span>
      </div>
    </div>
  );
}

export function Specs() {
  const [minutes, setMinutes] = useState(tryIt.defaultMinutes);
  const [finish, setFinish] = useState<Finish>("basalt");

  useEffect(() => {
    store.dial = (minutes - MIN) / (MAX - MIN);
  }, [minutes]);
  useEffect(() => {
    store.finish = finish;
    window.dispatchEvent(new CustomEvent("finish:choose", { detail: finish }));
  }, [finish]);

  return (
    <section id="specs" data-stage="specs" aria-labelledby="specs-title" className="relative py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20 grid grid-cols-1 items-start gap-x-10 gap-y-6 md:grid-cols-12 md:gap-y-0">
        <div className="md:col-span-5 md:col-start-8 md:row-start-1">
          <SplitReveal id="specs-title" text={tryIt.title} className="text-sheen t-h2" />
          <p className="t-lead mt-4 max-w-[34ch]">{tryIt.lead}</p>
        </div>

        <div className="relative md:sticky md:top-[12vh] md:col-span-6 md:col-start-1 md:row-span-2 md:row-start-1">
          <Dock id="dock-specs" className="mx-auto aspect-square w-[min(60vw,30vh)] md:w-full md:max-w-[640px]" />
        </div>

        <div className="md:col-span-5 md:col-start-8 md:row-start-2">
          <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto] md:mt-10">
            <Dial minutes={minutes} onChange={setMinutes} />
            <fieldset>
              <legend className="t-small mb-3">Finish</legend>
              <div className="flex gap-2 sm:flex-col">
                {tryIt.finishes.map((f) => {
                  const on = f.id === finish;
                  return (
                    <label
                      key={f.id}
                      className="glass flex cursor-pointer items-center gap-3 rounded-full border py-2 pl-2 pr-4 text-[14px] transition-colors duration-300"
                      style={{ borderColor: on ? "var(--color-cobalt)" : "var(--page-line)" }}
                    >
                      <input type="radio" name="finish" value={f.id} checked={on} onChange={() => setFinish(f.id as Finish)} className="sr-only" />
                      <span aria-hidden className="h-6 w-6 rounded-full border border-black/10" style={{ background: f.swatch }} />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <h3 className="t-small mt-14">{tryIt.specsTitle}</h3>
          <dl className="mt-3 border-t hairline">
            {tryIt.specs.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-6 border-b hairline py-4">
                <dt className="t-body">{r.label}</dt>
                <dd className="max-w-[60%] text-right font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
