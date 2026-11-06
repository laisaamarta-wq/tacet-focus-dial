"use client";

/* eslint-disable @next/next/no-img-element -- static renders, also used in the single-file HTML build */
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type Props = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
};

/**
 * A render that behaves like an object, not a flat picture:
 * the card leans toward the pointer (desktop), rocks gently with scroll (all devices),
 * and the image drifts inside its frame for parallax depth.
 */
export function TiltFigure({ src, alt, caption, width, height, className = "", imgClassName = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollTilt = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const drift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), spring);
  const rotateX = useTransform([rx, scrollTilt] as const, ([a, b]: number[]) => a + b);
  const glareX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useTransform([glareX, glareY] as const, ([x, y]: string[]) => `radial-gradient(60% 50% at ${x} ${y}, rgba(255,255,255,0.14), transparent 70%)`);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className={`relative z-20 min-w-0 [perspective:1100px] ${className}`}>
      <motion.figure
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-[14px] bg-[#05060c] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
      >
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: drift, scale: 1.07 }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
        {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: glare }} />}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <figcaption className="absolute bottom-4 left-5 right-5 text-[13px] tracking-[0.01em] text-white/85">{caption}</figcaption>
      </motion.figure>
    </div>
  );
}
