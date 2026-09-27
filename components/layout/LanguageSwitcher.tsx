"use client";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={cn("flex items-center gap-0.5 rounded-full p-1", dark ? "bg-white/10" : "bg-surface-container")} role="group" aria-label="Langue">
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "flex h-9 min-w-[44px] items-center justify-center rounded-full px-3 text-[13px] font-bold uppercase transition",
            lang === l ? "bg-ink text-white shadow-m3-1" : dark ? "text-white/60 hover:text-white" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
