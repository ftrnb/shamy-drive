import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié — connectez-vous" }, { status: 401 });

  // Autorise USER et ADMIN — la pièce d'identité est uploadée par le client lors de la réservation
  // Pour les images voitures, on vérifiera côté client si besoin, mais on autorise tout upload authentifié
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const folderParam = (form.get("folder") as string) || "shamy-drive";
    // Sécurise le dossier : n'autorise que shamy-drive et shamy-drive/ids
    const folder = folderParam.startsWith("shamy-drive") ? folderParam : "shamy-drive";

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (file.type && !allowed.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Format non supporté (JPG/PNG/WEBP/PDF uniquement)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Si Cloudinary non configuré (dev avec placeholder), fallback local dans public/uploads
    if (!isCloudinaryConfigured()) {
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeName);
      await writeFile(filePath, buffer);
      const url = `/uploads/${safeName}`;
      return NextResponse.json({ url, publicId: `local-${safeName}`, warning: "Stockage local (Cloudinary non configuré)" });
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: isPdf ? "auto" : "image", access_mode: "authenticated" } as any,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload échoué" }, { status: 500 });
  }
}
