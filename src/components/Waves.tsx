// The three swept lines under the "CW" in the logo, drawn out full-width.
export function Waves({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 160" preserveAspectRatio="none" fill="none" aria-hidden>
      <path d="M0 96C220 40 470 34 720 78s520 72 720 18" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
      <path d="M0 118C220 62 470 56 720 100s520 72 720 18" stroke="currentColor" strokeWidth="1.25" opacity="0.3" />
      <path d="M0 140C220 84 470 78 720 122s520 72 720 18" stroke="currentColor" strokeWidth="1.25" opacity="0.15" />
    </svg>
  );
}
