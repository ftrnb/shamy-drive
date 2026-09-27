import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getFilenameFromUrl(url: string, fallback: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() || fallback;
    if (!last.includes(".")) return `${last}.jpg`;
    return last;
  } catch {
    return `${fallback}.jpg`;
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const filenameParam = req.nextUrl.searchParams.get("filename");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http/https allowed" }, { status: 400 });
  }

  const filename = filenameParam || getFilenameFromUrl(url, "image");

  try {
    const upstream = await fetch(url, {
      cache: "no-store",
      headers: {
        // spoof UA to avoid hotlink protection
        "User-Agent": "Mozilla/5.0 (compatible; ShamyDrive/1.0)",
        Accept: "image/*,*/*",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream fetch failed ${upstream.status}` }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Fetch error" }, { status: 500 });
  }
}
