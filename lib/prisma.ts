import { PrismaClient } from "@prisma/client";

// Fix Vercel build: si DATABASE_URL manquant pendant le build (prerender), fournir un placeholder
// La vraie valeur sera injectée à runtime via Vercel Env Variables — la requête échouera gracieusement et sera catch dans FleetPreview
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=require";
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
