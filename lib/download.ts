"use client";

/**
 * Download utility — handles CORS via proxy fallback.
 * Used for image results and any remote asset.
 */

export function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

export function getFilenameFromUrl(url: string, fallback = "download"): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const last = pathname.split("/").filter(Boolean).pop() || fallback;
    // ensure extension
    if (!last.includes(".")) return `${last}.jpg`;
    return last;
  } catch {
    return `${fallback}.jpg`;
  }
}

export async function downloadImage(url: string, filename?: string): Promise<void> {
  const finalName = filename || getFilenameFromUrl(url, "image");
  // Try direct fetch first (blob)
  try {
    const res = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);
    const blob = await res.blob();
    triggerBlobDownload(blob, finalName);
    return;
  } catch (err) {
    // fallback via proxy
    console.warn("[download] direct fetch failed, trying proxy", err);
  }

  // Proxy fallback
  try {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(finalName)}`;
    const res = await fetch(proxyUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`proxy fetch failed ${res.status}`);
    const blob = await res.blob();
    triggerBlobDownload(blob, finalName);
    return;
  } catch (err) {
    console.error("[download] proxy also failed", err);
    // Last resort: open in new tab
    window.open(url, "_blank", "noopener");
    throw err;
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  // cleanup
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
    a.remove();
  }, 1500);
}

export async function downloadViaProxy(url: string, filename?: string) {
  return downloadImage(url, filename);
}
