import { z } from "zod";

export const carCreateSchema = z.object({
  brand: z.string().min(1, "Marque requise").max(50),
  model: z.string().min(1, "Modèle requis").max(50),
  category: z.string().min(1, "Catégorie requise"),
  pricePerDay: z.coerce.number().int().min(50, "Min 50 DH").max(10000),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuel: z.enum(["ESSENCE", "DIESEL", "HYBRIDE", "ELECTRIQUE"]),
  seats: z.coerce.number().int().min(2).max(9),
  year: z.coerce.number().int().min(2000).max(2030).optional().nullable(),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  available: z.boolean().optional().default(true),
  images: z.array(z.object({ url: z.string().url().or(z.string().startsWith("/")), publicId: z.string().optional() })).optional().default([]),
});

export const carUpdateSchema = carCreateSchema.partial();

export const bookingCreateSchema = z.object({
  carId: z.string().cuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  customerName: z.string().min(2).max(100).optional(),
  customerPhone: z.string().min(8).max(20).optional(),
  customerEmail: z.string().email().optional(),
  pickupLocation: z.string().max(100).optional(),
  dropoffLocation: z.string().max(100).optional(),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  dropoffTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().max(2000).optional(),
  identityDocumentUrl: z.string().min(1, "Pièce d'identité requise (CIN/Passeport)").refine((v) => v.startsWith("/") || z.string().url().safeParse(v).success, "URL de pièce invalide"),
  identityDocumentPublicId: z.string().optional(),
}).refine((d) => new Date(`${d.endDate}T00:00:00`) > new Date(`${d.startDate}T00:00:00`), {
  message: "La date de retour doit être après la date de départ",
  path: ["endDate"],
});

export const bookingStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

export const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(80),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum").max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const reviewSchema = z.object({
  carId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional().default([]),
});
