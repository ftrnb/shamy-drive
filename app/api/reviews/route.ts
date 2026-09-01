import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const carId = searchParams.get("carId");
  if (!carId) return NextResponse.json({ error: "carId requis" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { carId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Connectez-vous" }, { status: 401 });
  const userId = (session.user as any).id as string;

  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { carId, rating, comment } = parsed.data;

    // Vérifier que l'utilisateur a au moins une réservation terminée/confirmée pour ce véhicule
    const hasBooking = await prisma.booking.findFirst({
      where: { carId, userId, status: { in: ["COMPLETED", "CONFIRMED"] } },
    });
    if (!hasBooking && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Vous devez avoir réservé ce véhicule pour laisser un avis" }, { status: 403 });
    }

    const review = await prisma.review.upsert({
      where: { carId_userId: { carId, userId } },
      create: { carId, userId, rating, comment },
      update: { rating, comment },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur avis" }, { status: 500 });
  }
}
