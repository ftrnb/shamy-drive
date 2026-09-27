"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastTone = "success" | "error" | "info";
export type Toast = { id: number; title: string; desc?: string; tone: ToastTone };

let push: ((t: Omit<Toast, "id">) => void) | null = null;

export function toast(title: string, opts?: { desc?: string; tone?: ToastTone }) {
  push?.({ title, desc: opts?.desc, tone: opts?.tone ?? "success" });
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    let id = 0;
    push = (t) => {
      const item = { ...t, id: ++id };
      setItems((prev) => [...prev.slice(-2), item]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== item.id)), 3800);
    };
    return () => { push = null; };
  }, []);

  const dismiss = useCallback((id: number) => setItems((prev) => prev.filter((x) => x.id !== id)), []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[92px] z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {items.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.05, 0.7, 0.1, 1] }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-ink py-2.5 pl-3 pr-5 text-left text-white shadow-m3-4"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.tone === "success" ? "bg-success-container text-on-success-container" : t.tone === "error" ? "bg-error-container text-error" : "bg-tertiary-container text-on-tertiary-container"}`}>
              {t.tone === "success" ? <CheckCircle2 className="h-5 w-5" /> : t.tone === "error" ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-bold">{t.title}</span>
              {t.desc && <span className="block truncate text-[12px] text-white/60">{t.desc}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
