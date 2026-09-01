import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const [totalCars, totalBookings, pendingBookings, totalUsers, revenue] = await Promise.all([
    prisma.car.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.aggregate({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, _sum: { totalPrice: true } }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { car: { select: { brand: true, model: true } }, user: { select: { name: true } } },
  });

  return NextResponse.json({
    stats: { totalCars, totalBookings, pendingBookings, totalUsers, revenue: revenue._sum.totalPrice || 0 },
    recentBookings,
  });
}
