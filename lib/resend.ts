import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder"
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendBookingConfirmation(to: string, booking: { car: string; startDate: string; endDate: string; total: number; days: number }) {
  if (!resend) {
    console.log("[Resend] skip — clé manquante. Booking:", booking);
    return { skipped: true };
  }
  const from = process.env.RESEND_FROM_EMAIL || "Shamy Drive <onboarding@resend.dev>";
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Confirmation Shamy Drive — ${booking.car}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:auto; background:#0A0A0A; color:#fff; padding:32px;">
          <h1 style="color:#fff; font-size:24px; margin:0 0 8px;">SHAMY DRIVE</h1>
          <p style="color:#C1272D; font-weight:700; letter-spacing:0.2em; font-size:11px; margin:0 0 24px;">LOCATION PREMIUM À AGADIR</p>
          <h2 style="margin:0 0 16px;">Réservation confirmée</h2>
          <p>Véhicule: <strong>${booking.car}</strong></p>
          <p>Du ${booking.startDate} au ${booking.endDate} — ${booking.days} jour(s)</p>
          <p><strong>Total: ${booking.total} DH</strong></p>
          <p style="color:#a1a1aa; font-size:13px; margin-top:24px;">Nous vous contacterons pour finaliser. Assistance 24/7.</p>
          <hr style="border-color:#27272a; margin:24px 0;"/>
          <p style="font-size:12px; color:#71717a;">Shamy Drive — Agadir, Maroc</p>
        </div>
      `,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[Resend] error", err);
    return null;
  }
}

export async function sendAdminNewBookingAlert(booking: {
  car: string;
  startDate: string;
  endDate: string;
  total: number;
  days: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  bookingId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "Shamy Drive <onboarding@resend.dev>";

  // Toujours logger pour toi même sans email
  console.log(`[ADMIN ALERT] Nouvelle réservation ${booking.bookingId}: ${booking.car} ${booking.startDate}→${booking.endDate} par ${booking.customerName} ${booking.customerPhone}`);

  // WhatsApp admin (log + lien cliquable dans le dashboard)
  const adminWa = process.env.ADMIN_WHATSAPP || "212661689659";
  const waText = `Nouvelle réservation Shamy Drive 🔔%0A${booking.car}%0A${booking.startDate} → ${booking.endDate} (${booking.days}j) - ${booking.total} DH%0AClient: ${booking.customerName} ${booking.customerPhone} ${booking.customerEmail}%0ALieux: ${booking.pickupLocation} → ${booking.dropoffLocation}%0AID: ${booking.bookingId}%0AVoir: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/reservations`;
  console.log(`[ADMIN WHATSAPP] https://wa.me/${adminWa}?text=${waText}`);

  if (!resend || !adminEmail || adminEmail.includes("placeholder")) {
    console.log("[Resend] admin skip — ADMIN_EMAIL ou RESEND_API_KEY manquant. Voir logs ci-dessus.");
    return { skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: adminEmail,
      subject: `🔔 Nouvelle réservation — ${booking.car} — ${booking.customerName}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:auto; background:#fff; color:#0A0A0A; padding:32px; border:1px solid #e4e4e7;">
          <p style="background:#C1272D; color:#fff; display:inline-block; padding:6px 12px; font-size:11px; font-weight:800; letter-spacing:0.15em;">NOUVELLE RÉSERVATION — PENDING</p>
          <h2 style="margin:16px 0 8px;">${booking.car}</h2>
          <p><strong>${booking.startDate} → ${booking.endDate}</strong> — ${booking.days} jour(s) — <strong>${booking.total} DH</strong></p>
          <p>Lieux: ${booking.pickupLocation} → ${booking.dropoffLocation}</p>
          <hr style="margin:16px 0;" />
          <p><strong>Client:</strong> ${booking.customerName}<br/>📞 ${booking.customerPhone}<br/>📧 ${booking.customerEmail}</p>
          <p><strong>Réf:</strong> ${booking.bookingId}</p>
          <p style="margin-top:20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/reservations" style="background:#0A0A0A; color:#fff; padding:12px 20px; text-decoration:none; font-weight:800; font-size:12px; letter-spacing:0.1em;">VOIR DANS ADMIN →</a></p>
          <p style="margin-top:16px;"><a href="https://wa.me/${adminWa}?text=${waText}">Ouvrir WhatsApp admin</a></p>
        </div>
      `,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[Resend] admin error", err);
    return null;
  }
}
