import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { carCreateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const transmission = searchParams.get("transmission");
  const fuel = searchParams.get("fuel");
  const seats = searchParams.get("seats");
  const maxPrice = searchParams.get("maxPrice");
  const minPrice = searchParams.get("minPrice");
  const available = searchParams.get("available");
  const q = searchParams.get("q");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: any = {};

  if (brand) where.brand = { contains: brand, mode: "insensitive" };
  if (category) where.category = { contains: category, mode: "insensitive" };
  if (transmission) where.transmission = transmission;
  if (fuel) where.fuel = fuel;
  if (seats) where.seats = parseInt(seats);
  if (maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: parseInt(maxPrice) };
  if (minPrice) where.pricePerDay = { ...where.pricePerDay, gte: parseInt(minPrice) };
  if (available === "true") where.available = true;
  if (available === "false") where.available = false;

  if (q) {
    where.OR = [
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Si dates fournies, exclure voitures déjà réservées sur ce créneau
  let excludeCarIds: string[] = [];
  if (startDate && endDate) {
    const s = new Date(`${startDate}T00:00:00`);
    const e = new Date(`${endDate}T00:00:00`);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s) {
      const overlapping = await prisma.booking.findMany({
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
          startDate: { lte: e },
          endDate: { gte: s },
        },
        select: { carId: true },
      });
      excludeCarIds = [...new Set(overlapping.map((b) => b.carId))];
      if (excludeCarIds.length) where.id = { notIn: excludeCarIds };
    }
  }

  // Parsing langage naturel simple: ex "automatique 4 places moins de 500"
  const nl = searchParams.get("nl");
  if (nl) {
    const lower = nl.toLowerCase();
    if (lower.includes("automatique")) where.transmission = "AUTOMATIC";
    if (lower.includes("manuelle") || lower.includes("manuel")) where.transmission = "MANUAL";
    if (lower.includes("diesel")) where.fuel = "DIESEL";
    if (lower.includes("essence")) where.fuel = "ESSENCE";
    if (lower.includes("hybride")) where.fuel = "HYBRIDE";
    const seatsMatch = lower.match(/(\d)\s*places?/);
    if (seatsMatch) where.seats = parseInt(seatsMatch[1]);
    const priceMatch = lower.match(/moins de\s*(\d+)/) || lower.match(/<\s*(\d+)/) || lower.match(/(\d+)\s*dh/);
    if (priceMatch) {
      const p = parseInt(priceMatch[1]);
      if (!isNaN(p)) where.pricePerDay = { ...where.pricePerDay, lte: p };
    }
    const catMatch = lower.match(/\b(suv|berline|citadine|compacte|4x4)\b/);
    if (catMatch) where.category = { contains: catMatch[1], mode: "insensitive" };
  }

  try {
    const cars = await prisma.car.findMany({
      where,
      include: { images: true, reviews: { select: { rating: true } } },
      orderBy: [{ available: "desc" }, { pricePerDay: "asc" }],
    });

    const withAvg = cars.map((c) => ({
      ...c,
      avgRating: c.reviews.length ? c.reviews.reduce((a, r) => a + r.rating, 0) / c.reviews.length : null,
      reviewCount: c.reviews.length,
    }));

    return NextResponse.json({ cars: withAvg });
  } catch (error) {
    console.error("GET /api/cars error", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = carCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { images, ...carData } = parsed.data;

    const car = await prisma.car.create({
      data: {
        ...carData,
        images: images?.length ? { create: images } : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cars error", error);
    return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  }
}
