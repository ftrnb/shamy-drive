import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  email: z.string().trim().email("Email invalide").max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message trop court (10 caractères min)").max(2000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Champs invalides" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;
  console.log("[CONTACT]", { name, email, phone, at: new Date().toISOString() });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail || adminEmail.includes("placeholder")) {
    // Honest degraded mode: logged server-side, visitor gets WhatsApp fallback
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const from = process.env.RESEND_FROM_EMAIL || "Shamy Drive <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: adminEmail,
      replyTo: email,
      subject: `Contact Shamy Drive — ${name}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:auto; background:#fff; color:#161112; padding:32px; border:1px solid #e8d5d1; border-radius:16px;">
          <p style="font-size:12px; font-weight:700; letter-spacing:0.15em; color:#c1272d;">CONTACT — SHAMY DRIVE</p>
          <h2 style="margin:8px 0 16px;">${name}</h2>
          <p><strong>Email:</strong> ${email}${phone ? `<br/><strong>Tél:</strong> ${phone}` : ""}</p>
          <hr style="margin:16px 0; border-color:#e8d5d1;" />
          <p style="white-space:pre-wrap;">${message.replace(/</g, "&lt;")}</p>
        </div>
      `,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("[CONTACT] send error", e);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
