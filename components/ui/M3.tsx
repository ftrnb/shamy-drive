"use client";

import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 text-[12px] font-bold tracking-wide text-on-primary-container", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow className={dark ? "bg-white/10 text-white" : undefined}>{eyebrow}</Eyebrow>
      <h2 className={cn("mt-4 font-display text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[44px]", dark ? "text-white" : "text-on-background")}>
        {title}
      </h2>
      {desc && <p className={cn("mt-3 text-[15px] leading-7", dark ? "text-white/70" : "text-on-surface-variant")}>{desc}</p>}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
  href,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls = cn(
    "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200",
    active
      ? "border-transparent bg-ink text-white shadow-m3-1"
      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline hover:bg-surface-container"
  );
  if (href) return <a href={href} onClick={onClick} className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} aria-pressed={active} className={cls}>{children}</button>;
}
