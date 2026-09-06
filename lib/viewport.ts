"use client";

/**
 * Viewport helper for desktop mode.
 * Switches <meta name="viewport"> between device-width and fixed 1024 for desktop zoom-out.
 */

const DESKTOP_VIEWPORT = "width=1024, initial-scale=0.7, minimum-scale=0.7, maximum-scale=2, user-scalable=yes";
const DEFAULT_VIEWPORT = "width=device-width, initial-scale=1, viewport-fit=cover";

export function setDesktopViewport(enable: boolean): void {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.content = enable ? DESKTOP_VIEWPORT : DEFAULT_VIEWPORT;
}

export function isDesktopViewport(): boolean {
  if (typeof document === "undefined") return false;
  const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
  return meta?.content.includes("width=1024") ?? false;
}
