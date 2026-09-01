import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://shamydrive.ma";

  const staticRoutes = ["", "/voitures", "/a-propos", "/contact", "/faq", "/login", "/register"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  let carRoutes: MetadataRoute.Sitemap = [];
  try {
    const cars = await prisma.car.findMany({ select: { id: true, updatedAt: true } });
    carRoutes = cars.map((car: { id: string | number; updatedAt: Date }) => ({
      url: `${base}/voitures/${car.id}`,
      lastModified: car.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not ready during build — skip dynamic routes
  }

  return [...staticRoutes, ...carRoutes];
}
