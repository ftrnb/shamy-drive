"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

/** Floating back-to-top pill — appears after scrolling, hidden on admin. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          aria-label="Retour en haut"
          className="fixed bottom-[152px] right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-lowest/95 text-on-surface shadow-m3-3 backdrop-blur-xl transition hover:bg-surface-container active:scale-90 md:bottom-8 md:right-8"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
