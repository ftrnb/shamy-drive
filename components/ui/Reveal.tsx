"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

const EASE = [0.05, 0.7, 0.1, 1] as const;

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [...EASE] as unknown as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}
