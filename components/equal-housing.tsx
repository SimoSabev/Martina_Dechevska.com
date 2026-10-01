/**
 * PLACEHOLDER — Equal Housing Opportunity notice.
 * Replace the glyph below with the official HUD Equal Housing Opportunity
 * logo file once confirmed (place it at public/images/equal-housing-opportunity.svg)
 * and check with the brokerage which wording/logo the state requires.
 */
export function EqualHousing({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden className="h-8 w-8 shrink-0" fill="none">
        <path d="M3 14 16 4l13 10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 12v15h18V12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 17h10M11 21h10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="text-[0.65rem] leading-snug font-semibold tracking-[0.2em] uppercase">
        Equal Housing
        <br />
        Opportunity
      </span>
    </div>
  );
}
