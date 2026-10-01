import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { tone?: "light" | "dark" };

/** Understated text link with a sliding arrow — the site's primary CTA style. */
export function ArrowLink({ children, className = "", tone = "light", ...props }: Props) {
  const color = tone === "dark" ? "text-ivory" : "text-ink";
  const rule = tone === "dark" ? "bg-lime" : "bg-olive";
  return (
    <Link
      {...props}
      className={`group inline-flex items-center gap-4 text-[0.72rem] font-semibold tracking-[0.24em] uppercase ${color} ${className}`}
    >
      <span className="relative pb-1">
        {children}
        <span aria-hidden className={`absolute inset-x-0 bottom-0 h-px ${rule}`} />
      </span>
      <Arrow className="h-3 w-7 transition-transform duration-500 ease-out-soft group-hover:translate-x-1.5" />
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 12" fill="none" aria-hidden className={className}>
      <path d="M0 6h26M21 1l5 5-5 5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
