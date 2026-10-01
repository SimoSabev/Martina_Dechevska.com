import Link from "next/link";
import { Nav } from "./nav";

export function Header({ name }: { name: string }) {
  return (
    <header className="relative z-20 border-b border-sand">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <div className="container-site flex h-20 items-center justify-between md:h-24">
        <Link href="/" className="group flex items-center gap-3">
          <Monogram className="h-9 w-9 text-ink transition-colors duration-500 group-hover:text-olive" />
          <span className="font-serif text-[1.35rem] leading-none tracking-[0.02em] sm:text-2xl">
            {name}
          </span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="currentColor" strokeWidth="1" />
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="17"
        letterSpacing="0.5"
        fill="currentColor"
      >
        MD
      </text>
    </svg>
  );
}
