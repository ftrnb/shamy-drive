import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookingCreateSchema, bookingStatusSchema } from "@/lib/validations";
import { calculateDays } from "@/lib/utils";
import { sendBookingConfirmation, sendAdminNewBookingAlert } from "@/lib/resend";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const where: any = {};
  if (role !== "ADMIN") where.userId = userId;
  else {
    const filterUser = searchParams.get("userId");
    if (filterUser) where.userId = filterUser;
  }

  const status = searchParams.get("status");
  if (status) where.status = status;

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: { car: { include: { images: true } }, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Connectez-vous pour réserver" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const userEmail = session.user.email as string;

  try {
    const body = await request.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { carId, startDate, endDate, customerName, customerPhone, customerEmail, pickupLocation, dropoffLocation, pickupTime, dropoffTime, notes, identityDocumentUrl, identityDocumentPublicId } = parsed.data;

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
    if (!car.available) return NextResponse.json({ error: "Véhicule indisponible" }, { status: 400 });

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const days = calculateDays(start, end);
    if (days <= 0) return NextResponse.json({ error: "Durée invalide" }, { status: 400 });

    // Vérification chevauchement en transaction
    const overlapping = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Véhicule déjà réservé sur ces dates. Choisissez d'autres dates." },
        { status: 409 }
      );
    }

    const totalPrice = days * car.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        carId,
        userId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "PENDING",
        customerName: customerName || (session.user.name as string) || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || userEmail,
        pickupLocation: pickupLocation || "Agadir Aéroport Al Massira",
        dropoffLocation: dropoffLocation || "Agadir Aéroport Al Massira",
        pickupTime: pickupTime || "10:00",
        dropoffTime: dropoffTime || "10:00",
        notes: notes || null,
        identityDocumentUrl: identityDocumentUrl || null,
        identityDocumentPublicId: identityDocumentPublicId || null,
      },
      include: { car: true },
    });

    // Emails async, ne bloquent pas la réponse
    sendBookingConfirmation(customerEmail || userEmail, {
      car: `${car.brand} ${car.model}`,
      startDate,
      endDate,
      total: totalPrice,
      days,
    }).catch(() => {});
    sendAdminNewBookingAlert({
      car: `${car.brand} ${car.model}`,
      startDate,
      endDate,
      total: totalPrice,
      days,
      customerName: customerName || (session.user.name as string) || "—",
      customerPhone: customerPhone || "—",
      customerEmail: customerEmail || userEmail,
      pickupLocation: pickupLocation || "Agadir Aéroport Al Massira",
      dropoffLocation: dropoffLocation || "Agadir Aéroport Al Massira",
      bookingId: booking.id,
    }).catch(() => {});

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e) {
    console.error("POST /api/bookings", e);
    return NextResponse.json({ error: "Erreur réservation" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "id et status requis" }, { status: 400 });
    const parsed = bookingStatusSchema.safeParse(status);
    if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

    // Règles métier
    if (role !== "ADMIN") {
      // User peut seulement annuler sa propre réservation, jusqu'à 48h avant
      if (booking.userId !== userId) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      if (parsed.data !== "CANCELLED") return NextResponse.json({ error: "Seule l'annulation est permise" }, { status: 403 });
      const now = new Date();
      const start = new Date(booking.startDate);
      const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 48) return NextResponse.json({ error: "Annulation gratuite jusqu'à 48h avant le départ" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: parsed.data },
      include: { car: { include: { images: true } } },
    });

    return NextResponse.json({ booking: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}
