import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompteClient from "./CompteClient";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/compte");

  const userId = (session.user as any).id as string;
  let bookings: any[] = [];
  try {
    bookings = await prisma.booking.findMany({
      where: { userId },
      include: { car: { include: { images: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("ComptePage DB error (build without DATABASE_URL):", e);
    bookings = [];
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="bg-[#0A0A0A] px-6 pb-8 pt-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C1272D]">Mon compte</p>
          <h1 className="mt-2 text-3xl font-black uppercase sm:text-4xl">Bonjour, {session.user.name || session.user.email}</h1>
          <p className="mt-2 text-sm text-zinc-400">{session.user.email} • {bookings.length} réservation(s)</p>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CompteClient bookings={bookings as any} />
      </section>
      <Footer />
    </main>
  );
}
