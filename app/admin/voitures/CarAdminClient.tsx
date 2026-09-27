"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X, Upload, Plus } from "lucide-react";
import { MField, fieldInput } from "@/components/ui/Field";
import { FadeImage, Spinner } from "@/components/ui/Motion";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

const EMPTY = { brand: "", model: "", category: "Berline", pricePerDay: 300, transmission: "MANUAL", fuel: "ESSENCE", seats: 5, year: 2023, description: "", imageUrl: "" };

export default function CarAdminClient({ cars }: { cars: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      brand: form.brand,
      model: form.model,
      category: form.category,
      pricePerDay: parseInt(String(form.pricePerDay)),
      transmission: form.transmission,
      fuel: form.fuel,
      seats: parseInt(String(form.seats)),
      year: form.year ? parseInt(String(form.year)) : undefined,
      mileage: null,
      description: form.description,
      available: true,
      images: form.imageUrl ? [{ url: form.imageUrl }] : [],
    };

    const url = editingId ? `/api/cars/${editingId}` : "/api/cars";
    const method = editingId ? "PATCH" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Échec de l'enregistrement");
      setForm({ ...EMPTY });
      setEditingId(null);
      toast(editingId ? "Véhicule mis à jour" : "Véhicule créé", { desc: `${payload.brand} ${payload.model}` });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suppression impossible");
      setDeleteId(null);
      toast("Véhicule supprimé");
      router.refresh();
    } catch (err: any) {
      toast(err.message, { tone: "error" });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload échoué — vérifie Cloudinary dans .env");
      setForm((f: any) => ({ ...f, imageUrl: data.url }));
      toast("Photo uploadée");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(car: any) {
    setEditingId(car.id);
    setError(null);
    setForm({
      brand: car.brand,
      model: car.model,
      category: car.category,
      pricePerDay: car.pricePerDay,
      transmission: car.transmission,
      fuel: car.fuel,
      seats: car.seats,
      year: car.year || "",
      description: car.description || "",
      imageUrl: car.images[0]?.url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="h-fit rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 lg:sticky lg:top-20">
        <h2 className="font-display text-[18px] font-bold">{editingId ? "Modifier véhicule" : "Ajouter un véhicule"}</h2>

        {error && <p role="alert" className="mt-4 rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{error}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <MField label="Marque"><input placeholder="Dacia" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className={fieldInput} /></MField>
          <MField label="Modèle"><input placeholder="Duster" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className={fieldInput} /></MField>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <MField label="Catégorie">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={fieldInput}>
              <option>Berline</option><option>Citadine</option><option>SUV</option><option>Compacte</option><option>4x4</option>
            </select>
          </MField>
          <MField label="Prix / jour (DH)"><input type="number" min={0} value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className={fieldInput} /></MField>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <MField label="Boîte">
            <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={fieldInput}>
              <option value="MANUAL">Manuelle</option><option value="AUTOMATIC">Auto</option>
            </select>
          </MField>
          <MField label="Carburant">
            <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className={fieldInput}>
              <option value="ESSENCE">Essence</option><option value="DIESEL">Diesel</option><option value="HYBRIDE">Hybride</option><option value="ELECTRIQUE">Élec</option>
            </select>
          </MField>
          <MField label="Places"><input type="number" min={2} max={9} value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className={fieldInput} /></MField>
        </div>

        <div className="mt-3 grid grid-cols-2 items-end gap-2.5">
          <MField label="Année"><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={fieldInput} /></MField>
          <p className="rounded-2xl bg-surface-container px-4 py-3 text-center text-[12px] font-bold text-on-surface-variant">Km illimité</p>
        </div>

        <div className="mt-3"><MField label="Description"><textarea placeholder="Équipements, état..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${fieldInput} h-auto min-h-[84px] py-3`} /></MField></div>

        <div className="mt-3"><MField label="Photo"><input placeholder="URL image ou upload ci-dessous" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={fieldInput} /></MField></div>
        <label className="mt-2.5 flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-outline-variant px-4 py-3.5 text-[13px] font-bold transition hover:border-primary active:scale-[0.98]">
          {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4 text-primary" />}
          {uploading ? "Upload..." : "Uploader via Cloudinary"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {form.imageUrl && <div className="img-fade mt-2.5 h-36 overflow-hidden rounded-2xl"><FadeImage src={form.imageUrl} alt="Aperçu" className="object-contain p-2" /></div>}

        <button type="submit" disabled={loading || uploading} className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[14px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
          {loading ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {loading ? "..." : editingId ? "Mettre à jour" : "Créer le véhicule"}
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ ...EMPTY }); setError(null); }} className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-outline-variant text-[13px] font-bold transition active:scale-[0.98]"><X className="h-4 w-4" /> Annuler l'édition</button>}
      </form>

      <div className="grid content-start gap-3 sm:grid-cols-2">
        {cars.map((car) => (
          <div key={car.id} className="rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-m3-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-m3-2">
            <div className="flex gap-3">
              <div className="img-fade h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
                <FadeImage src={car.images[0]?.url || "/cars/Loganblanche.png"} alt={`${car.brand} ${car.model}`} className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{car.brand}</p>
                <p className="truncate text-[14px] font-bold">{car.model} • {car.category}</p>
                <p className="mt-0.5 text-[12px] text-on-surface-variant">{car.pricePerDay} DH/j • {car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"} • {car.seats} pl • {car._count.bookings} résa</p>
                <p className="mt-1 inline-flex rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">{car.id.slice(0, 8)} • {car.available ? "Dispo" : "Indispo"}</p>
              </div>
            </div>
            {deleteId === car.id ? (
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => handleDelete(car.id)} className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-error text-[12px] font-bold text-white transition active:scale-[0.98]">Supprimer ?</button>
                <button type="button" onClick={() => setDeleteId(null)} className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-surface-container text-[12px] font-bold transition active:scale-[0.98]">Garder</button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => startEdit(car)} className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-outline-variant text-[12px] font-bold transition hover:border-primary hover:text-primary active:scale-[0.98]"><Pencil className="h-3.5 w-3.5" /> Éditer</button>
                <button type="button" onClick={() => setDeleteId(car.id)} className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[12px] font-bold text-white transition hover:bg-error active:scale-[0.98]"><Trash2 className="h-3.5 w-3.5" /> Supprimer</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
