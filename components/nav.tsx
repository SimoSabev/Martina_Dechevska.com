"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Main">
      <ul className="hidden items-center gap-10 md:flex">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="group relative py-2 text-[0.72rem] font-semibold tracking-[0.24em] text-ink uppercase"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-olive transition-transform duration-500 ease-out-soft group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
              />
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="relative -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden className="relative block h-3 w-7">
          <span
            className={`absolute left-0 h-px w-full bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-px w-full bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-sand bg-ivory md:hidden"
      >
        <ul className="container-site flex flex-col py-6">
          {navigation.map((item) => (
            <li key={item.href} className="border-b border-sand/70 last:border-0">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-3xl text-ink aria-[current=page]:text-olive"
              >
                {item.label}
                <span aria-hidden className="text-base text-olive">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
