import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompteClient from "./CompteClient";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?callbackUrl=/compte");

  const userId = user.id;
  let bookings: any[] = [];
  try {
    // In a real app with Supabase DB, you'd query Supabase here.
    // If you keep Prisma, you need to ensure userId matches.
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
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-ink p-7 text-white shadow-m3-2 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold text-white/85">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-tertiary-container" />
            Mon compte
          </p>
          <h1 className="mt-3 font-display text-[28px] font-bold leading-tight sm:text-[36px]">Bonjour, {user.user_metadata?.full_name || user.email}</h1>
          <p className="mt-2 text-[13px] text-white/60">{user.email} • {bookings.length} réservation(s)</p>
        </div>
      </div>
      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
        <CompteClient bookings={bookings as any} />
      </section>
      <Footer />
    </main>
  );
}
