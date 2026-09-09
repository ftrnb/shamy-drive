import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "USER" },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e: any) {
    console.error("[register]", e);
    // Base de données injoignable (mauvaise DATABASE_URL sur Vercel, Neon en pause, etc.)
    if (e?.code === "P1001" || /can't reach database|connect|timed out|ENOTFOUND|ECONNREFUSED/i.test(e?.message ?? "")) {
      return NextResponse.json(
        { error: "Service momentanément indisponible (base de données). Réessayez dans un instant." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Erreur inscription" }, { status: 500 });
  }
}
