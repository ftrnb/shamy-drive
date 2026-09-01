import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id, role } = await request.json();
    if (!id || !["USER", "ADMIN"].includes(role)) return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });

    // Empêcher de se rétrograder soi-même si dernier admin ?
    const currentId = (session?.user as any)?.id as string;
    if (id === currentId && role === "USER") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) return NextResponse.json({ error: "Impossible de retirer le dernier admin" }, { status: 400 });
    }

    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ users });
}
