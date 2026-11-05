"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Headline that resolves character by character — rising out of a blur — when it scrolls into view.
 * Words stay unbroken; screen readers get the plain text.
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className = "",
  id,
  delay = 0,
  stagger = 0.022,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  let n = 0;
  const words = text.split(" ");
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => {
            const i = n++;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, delay: delay + i * stagger, ease }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

/** Paragraph that fades in from a blur */
export function BlurIn({ children, className = "", delay = 0.15 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, filter: "blur(12px)", y: 14 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
