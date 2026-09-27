"use client";

import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "@/components/ui/Toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </LanguageProvider>
  );
}
