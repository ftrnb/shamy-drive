"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Thin M3 scroll progress bar pinned under the navbar. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-primary"
    />
  );
}
