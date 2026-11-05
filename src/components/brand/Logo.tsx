/**
 * TACET logo.
 * Mark: an open ring (the crown, with a gap at twelve o'clock where a session starts)
 * around a solid core. Wordmark: Unbounded, tracked wide.
 */
export function LogoMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <path d="M19.5 3.5 A13 13 0 1 1 12.5 3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="5.2" fill="var(--color-cobalt)" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-[17px] font-[500] tracking-[0.18em]">TACET</span>
    </span>
  );
}
