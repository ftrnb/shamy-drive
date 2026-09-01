import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { carUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({
      where: { id },
      include: { images: true, reviews: { include: { user: { select: { name: true } } } } },
    });
    if (!car) return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
    const avgRating = car.reviews.length ? car.reviews.reduce((a, r) => a + r.rating, 0) / car.reviews.length : null;
    return NextResponse.json({ car: { ...car, avgRating } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = carUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { images, ...data } = parsed.data as any;

    // Si images fournies, on remplace
    if (images) {
      await prisma.carImage.deleteMany({ where: { carId: id } });
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        ...data,
        ...(images ? { images: { create: images } } : {}),
      },
      include: { images: true },
    });
    return NextResponse.json({ car });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Mise à jour échouée" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    // Vérifier réservations futures
    const future = await prisma.booking.findFirst({
      where: { carId: id, status: { in: ["PENDING", "CONFIRMED"] }, endDate: { gte: new Date() } },
    });
    if (future) return NextResponse.json({ error: "Véhicule avec réservations futures — désactivez-le plutôt" }, { status: 400 });

    await prisma.carImage.deleteMany({ where: { carId: id } });
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Suppression échouée" }, { status: 500 });
  }
}
