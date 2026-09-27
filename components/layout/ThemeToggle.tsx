"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; icon: typeof Sun }[] = [
  { value: "auto", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { lang } = useLanguage();
  const label = (v: Theme) =>
    v === "auto" ? (lang === "fr" ? "Auto" : "Auto") : v === "light" ? (lang === "fr" ? "Clair" : "Light") : (lang === "fr" ? "Sombre" : "Dark");

  if (compact) {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "auto" : "light";
    const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
    return (
      <button
        onClick={() => setTheme(next)}
        aria-label={`${lang === "fr" ? "Thème" : "Theme"}: ${label(theme)}`}
        title={`${lang === "fr" ? "Thème" : "Theme"}: ${label(theme)}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface transition hover:bg-surface-container-high active:scale-95"
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div role="group" aria-label={lang === "fr" ? "Thème d'affichage" : "Color theme"} className="flex items-center gap-0.5 rounded-full bg-surface-container p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          aria-pressed={theme === o.value}
          title={label(o.value)}
          className={cn(
            "flex h-10 min-w-[52px] items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all duration-200 active:scale-95",
            theme === o.value ? "bg-ink text-white shadow-m3-1" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <o.icon className="h-4 w-4" />
          {label(o.value)}
        </button>
      ))}
    </div>
  );
}
