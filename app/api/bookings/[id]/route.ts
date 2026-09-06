import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { car: { include: { images: true } }, user: { select: { name: true, email: true } } },
    });
    if (!booking) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    const role = user.app_metadata?.role || user.user_metadata?.role;
    const isAdmin = role === "ADMIN";
    const userId = user.id;

    if (!isAdmin && booking.userId !== userId) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    return NextResponse.json({ booking });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
