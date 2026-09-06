"use client";

import * as React from "react";
import { setDesktopViewport } from "./viewport";

type DesktopModeContextType = {
  isDesktopMode: boolean;
  toggle: () => void;
  setMode: (v: boolean) => void;
};

const DesktopModeContext = React.createContext<DesktopModeContextType | null>(null);

export function DesktopModeProvider({ children }: { children: React.ReactNode }) {
  const [isDesktopMode, setIsDesktopMode] = React.useState(false);

  // init from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("shamy-desktop-mode");
      const enabled = stored === "1";
      setIsDesktopMode(enabled);
      document.documentElement.classList.toggle("desktop-mode", enabled);
      setDesktopViewport(enabled);
    } catch {}
  }, []);

  // sync side effects
  React.useEffect(() => {
    try {
      localStorage.setItem("shamy-desktop-mode", isDesktopMode ? "1" : "0");
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("desktop-mode", isDesktopMode);
      setDesktopViewport(isDesktopMode);
    }
  }, [isDesktopMode]);

  const toggle = React.useCallback(() => setIsDesktopMode((v) => !v), []);
  const setMode = React.useCallback((v: boolean) => setIsDesktopMode(v), []);

  return <DesktopModeContext.Provider value={{ isDesktopMode, toggle, setMode }}>{children}</DesktopModeContext.Provider>;
}

export function useDesktopMode() {
  const ctx = React.useContext(DesktopModeContext);
  if (!ctx) throw new Error("useDesktopMode must be used within DesktopModeProvider");
  return ctx;
}

export function useDesktopModeOptional() {
  return React.useContext(DesktopModeContext);
}
