"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export function MField({
  label,
  icon,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string | null;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-on-surface-variant">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 rounded-lg bg-error-container/60 px-3 py-1.5 text-[13px] font-medium text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] leading-5 text-outline">{hint}</p>
      ) : null}
    </div>
  );
}

export const fieldInput =
  "h-[56px] w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 text-[15px] font-medium text-on-surface placeholder:text-outline outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/15 hover:border-outline";

export const fieldSelect = fieldInput;
