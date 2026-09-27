"use client";

import { motion, useReducedMotion, useInView, animate } from "framer-motion";
import * as React from "react";

export const EASE = [0.05, 0.7, 0.1, 1] as const;
export const easeOut = [...EASE] as unknown as [number, number, number, number];

/** Animated counter — counts up when scrolled into view. */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: easeOut,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("fr-MA")}
      {suffix}
    </span>
  );
}

/** Image with blur-up fade + shimmer placeholder. Perfect visual feedback on slow networks. */
export function FadeImage({
  src,
  alt,
  className,
  sizes,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const show = failed ? "/cars/Loganblanche.png" : src;
  return (
    <span className={`relative block h-full w-full overflow-hidden ${loaded ? "" : "animate-shimmer"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={show}
        alt={alt}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) setFailed(true);
          else setLoaded(true);
        }}
        className={`${className ?? ""} transition-all duration-700 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
      />
    </span>
  );
}

/** Small inline spinner for buttons. */
export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`${className} animate-spin`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Stagger container + item for grids. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 22 }: { children: React.ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } }}
    >
      {children}
    </motion.div>
  );
}
