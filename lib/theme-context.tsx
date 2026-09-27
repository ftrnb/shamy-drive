"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const KEY = "shamy-theme";

type Ctx = {
  theme: Theme;
  resolved: ResolvedTheme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<Ctx>({ theme: "auto", resolved: "light", setTheme: () => {} });

function resolve(t: Theme): ResolvedTheme {
  if (t !== "auto") return t;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(r: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", r === "dark");
  document.documentElement.style.colorScheme = r;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    const initial: Theme = saved === "light" || saved === "dark" || saved === "auto" ? saved : "auto";
    setThemeState(initial);
    const r = resolve(initial);
    setResolved(r);
    apply(r);
  }, []);

  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r: ResolvedTheme = mq.matches ? "dark" : "light";
      setResolved(r);
      apply(r);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(KEY, t);
    const r = resolve(t);
    setResolved(r);
    apply(r);
  }, []);

  return <ThemeContext.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
