"use client";

import { useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";

type BtnProps = {
  children: ReactNode;
  variant?: "solid" | "ghost";
  href?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

/** Button with a light magnetic pull toward the cursor */
export function MagneticButton({ children, variant = "solid", href, className = "", ...rest }: BtnProps) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const base =
    "group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[15px] font-medium transition-[transform,background-color,color] duration-500 ease-out-expo will-change-transform";
  const styles =
    variant === "solid"
      ? "bg-cobalt text-white hover:bg-[#2340e6]"
      : "border border-[color:var(--page-line)] text-[color:var(--page-fg)] hover:border-[color:var(--page-fg)]";
  const inner = (
    <span className="relative flex items-center gap-3">
      {children}
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70 transition-transform duration-500 ease-out-expo group-hover:scale-[2.2]" />
    </span>
  );
  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={rest.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`${base} ${styles} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      {inner}
    </button>
  );
}

/** Empty box the 3D object docks into */
export function Dock({ id, className = "" }: { id: string; className?: string }) {
  return <div id={id} aria-hidden className={`dock relative ${className}`} />;
}
