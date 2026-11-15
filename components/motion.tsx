"use client";

import { ReactLenis } from "lenis/react";
import {
  LazyMotion,
  MotionConfig,
  animate,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Motion language for the whole site: slow, soft, short travel.
 * One easing curve, long durations, small distances, every element animates once.
 * Users with "reduce motion" enabled get no movement (MotionConfig + Lenis both honour it).
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 1.3;
const TRAVEL = 28;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/* ---------- Providers ---------- */

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: DURATION, ease: EASE }}>
        <ReactLenis root options={{ lerp: 0.085, smoothWheel: true, anchors: true, stopInertiaOnNavigate: true }} />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

// Set after the first page has hydrated, so the very first load is never hidden behind a fade.
let hasNavigated = false;

/** Soft fade between pages (client-side navigations only). */
export function PageTransition({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/* ---------- Reveal ---------- */

type Tag = "div" | "p" | "span" | "section" | "header" | "figure" | "li" | "h2" | "h3";

type RevealProps = {
  children?: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  y?: number;
  duration?: number;
  /** Animate on mount instead of on scroll (above-the-fold content). */
  immediate?: boolean;
};

/** Fades and lifts content into place as it enters the viewport. */
export function Reveal({ children, className, as = "div", delay = 0, y = TRAVEL, duration = DURATION, immediate }: RevealProps) {
  const Comp = m[as];
  const target = { opacity: 1, y: 0 };
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: target } : { whileInView: target, viewport: VIEWPORT })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Text that rises from behind an invisible edge, like a line of type being set. */
export function MaskReveal({
  children,
  className,
  delay = 0,
  immediate,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const target = { y: "0%" };
  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className ?? ""}`}>
      <m.span
        className="block"
        initial={{ y: "105%" }}
        {...(immediate ? { animate: target } : { whileInView: target, viewport: VIEWPORT })}
        transition={{ duration: 1.5, delay, ease: EASE }}
      >
        {children}
      </m.span>
    </span>
  );
}

/* ---------- Stagger ---------- */

const itemVariants = {
  hidden: { opacity: 0, y: TRAVEL },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
  stagger?: number;
  delay?: number;
};

/** Container whose StaggerItem children appear one after another. */
export function Stagger({ children, className, as = "div", stagger = 0.14, delay = 0 }: StaggerProps) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}

/* ---------- Images ---------- */

/**
 * Fills a positioned box. The frame opens from the bottom while the image
 * settles from a slight zoom. `eager` (hero / LCP images) skips the clip so
 * the image is painted immediately and only the zoom settles.
 */
export function ImageReveal({ children, eager, delay = 0 }: { children: ReactNode; eager?: boolean; delay?: number }) {
  return (
    <m.div
      className="absolute inset-0 overflow-hidden"
      initial={eager ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.6, delay, ease: EASE }}
    >
      <m.div
        className="absolute inset-0"
        initial={{ scale: eager ? 1.06 : 1.14 }}
        {...(eager ? { animate: { scale: 1 } } : { whileInView: { scale: 1 }, viewport: VIEWPORT })}
        transition={{ duration: eager ? 2.2 : 2, delay, ease: EASE }}
      >
        {children}
      </m.div>
    </m.div>
  );
}

/** Drifts its content slightly slower than the page while scrolling. */
export function Parallax({ children, className, distance = 40 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </m.div>
  );
}

/* ---------- Numbers ---------- */

/**
 * Counts a figure such as "15+", "23" or "15.8%" up from zero the first time it
 * scrolls into view. The server renders the final value, so it is correct
 * without JavaScript and for search engines; text that is not a number is left alone.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  // Below the fold at load: reset to zero while still off-screen, then count when seen.
  useEffect(() => {
    if (!match || reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      setDisplay(`${match[1]}0${match[3]}`);
      setArmed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!armed || !inView || !match) return;
    const target = parseFloat(match[2].replace(",", "."));
    const decimals = (match[2].split(/[.,]/)[1] ?? "").length;
    const controls = animate(0, target, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${match[1]}${v.toFixed(decimals)}${match[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
