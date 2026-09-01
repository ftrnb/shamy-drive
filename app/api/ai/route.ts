import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiChatSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiChatSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Message invalide" }, { status: 400 });

    const { message, history } = parsed.data;

    // 1. Interroger la vraie DB pour avoir le contexte disponible
    const cars = await prisma.car.findMany({
      where: { available: true },
      include: { images: true },
      orderBy: { pricePerDay: "asc" },
      take: 12,
    });

    const carContext = cars
      .map((c) => `- ${c.brand} ${c.model} (${c.category}, ${c.transmission}, ${c.fuel}, ${c.seats} places) — ${c.pricePerDay} DH/j — ${c.available ? "disponible" : "indisponible"} — ${c.description?.slice(0, 120) || ""}`)
      .join("\n");

    // 2. Si pas de clé OpenAI, fallback intelligent sans hallucination
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("placeholder")) {
      // Recherche lexicale simple sur le message
      const lower = message.toLowerCase();
      let filtered = cars;
      if (lower.includes("automatique")) filtered = filtered.filter((c) => c.transmission === "AUTOMATIC");
      if (lower.includes("manuelle")) filtered = filtered.filter((c) => c.transmission === "MANUAL");
      if (lower.includes("diesel")) filtered = filtered.filter((c) => c.fuel === "DIESEL");
      if (lower.includes("suv")) filtered = filtered.filter((c) => c.category.toLowerCase().includes("suv"));
      if (lower.includes("citadine")) filtered = filtered.filter((c) => c.category.toLowerCase().includes("citadine"));
      const priceMatch = lower.match(/(\d+)\s*dh/) || lower.match(/moins de\s*(\d+)/);
      if (priceMatch) {
        const max = parseInt(priceMatch[1]);
        if (!isNaN(max)) filtered = filtered.filter((c) => c.pricePerDay <= max);
      }

      const suggestions = filtered.slice(0, 3).map((c) => `**${c.brand} ${c.model}** — ${c.pricePerDay} DH/j — ${c.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"} — ${c.seats} places`).join("\n");
      const fallback = suggestions
        ? `Voici ce que j'ai trouvé dans notre flotte réelle à Agadir :\n${suggestions}\n\nTous ces véhicules sont disponibles à la réservation. Tu veux que je filtre par dates ?`
        : `Je n'ai pas trouvé de correspondance exacte, mais voici 3 options populaires :\n${cars.slice(0, 3).map((c) => `**${c.brand} ${c.model}** — ${c.pricePerDay} DH/j`).join("\n")}\n\nDis-moi : boîte auto/manuelle, budget max, et dates ?`;

      return NextResponse.json({
        reply: fallback,
        cars: filtered.slice(0, 3),
        mode: "fallback",
      });
    }

    // 3. Appel OpenAI réel
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `Tu es Shamy, assistant Shamy Drive, location premium à Agadir. Ton rôle: conseiller avec la VRAIE flotte ci-dessous. N'invente JAMAIS de modèle hors liste. Sois concis, chaleureux, ton marocain qui connaît Agadir. Réponds en français. Si budget/dates manquent, demande-les. Propose 1-3 voitures MAX avec prix exact.

FLOTTE RÉELLE:
${carContext}

Règles: pas de bleu/vert, reste premium, mentionne assistance 24/7 si pertinent. Ne promets pas de dispo sans vérifier dates via l'utilisateur.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-8).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu répondre. Réessaye.";

    // Extraire IDs suggérés si l'IA mentionne des modèles (pour afficher CarCards côté client)
    const mentionedCars = cars.filter((c) => reply.toLowerCase().includes(c.model.toLowerCase()) || reply.toLowerCase().includes(c.brand.toLowerCase()));

    return NextResponse.json({ reply, cars: mentionedCars.slice(0, 3), mode: "openai" });
  } catch (e) {
    console.error("Shamy IA error", e);
    return NextResponse.json({ error: "Erreur IA" }, { status: 500 });
  }
}
