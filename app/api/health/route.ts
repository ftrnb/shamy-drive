import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Diagnostic SANS secret : n'expose jamais les valeurs, uniquement des booléens.
// À ouvrir sur Vercel : https://ton-site.vercel.app/api/health
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const databaseUrlSet = databaseUrl.length > 0 && !databaseUrl.includes("placeholder");
  const authSecretSet = Boolean(process.env.AUTH_SECRET);

  let db = "not-checked";
  if (!databaseUrlSet) {
    db = "missing-DATABASE_URL";
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = "ok";
    } catch (e: any) {
      db = `error: ${(e?.code ?? e?.name ?? "unknown")}`;
    }
  }

  const status = db === "ok" && authSecretSet ? 200 : 503;
  return NextResponse.json(
    {
      db,
      databaseUrlSet,
      authSecretSet,
      authUrl: process.env.AUTH_URL ?? null,
    },
    { status }
  );
}
