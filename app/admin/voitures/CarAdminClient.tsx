"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CarAdminClient({ cars }: { cars: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    brand: "",
    model: "",
    category: "Berline",
    pricePerDay: 300,
    transmission: "MANUAL",
    fuel: "ESSENCE",
    seats: 5,
    year: 2023,
    description: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      alert(JSON.stringify(data.error));
      return;
    }
    setForm({ brand: "", model: "", category: "Berline", pricePerDay: 300, transmission: "MANUAL", fuel: "ESSENCE", seats: 5, year: 2023, description: "", imageUrl: "" });
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce véhicule ? Seuls les véhicules sans réservations futures peuvent être supprimés.")) return;
    const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    router.refresh();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Upload échoué — vérifie Cloudinary dans .env");
      return;
    }
    setForm((f: any) => ({ ...f, imageUrl: data.url }));
  }

  function startEdit(car: any) {
    setEditingId(car.id);
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
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-6 space-y-3 h-fit">
        <h2 className="text-sm font-black uppercase tracking-widest">{editingId ? "Modifier véhicule" : "Ajouter un véhicule"}</h2>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Marque" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="border border-zinc-300 px-3 py-2 text-sm" />
          <input placeholder="Modèle" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm">
            <option>Berline</option><option>Citadine</option><option>SUV</option><option>Compacte</option><option>4x4</option>
          </select>
          <input type="number" placeholder="Prix/j" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm">
            <option value="MANUAL">Manuelle</option><option value="AUTOMATIC">Auto</option>
          </select>
          <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm">
            <option value="ESSENCE">Essence</option><option value="DIESEL">Diesel</option><option value="HYBRIDE">Hybride</option><option value="ELECTRIQUE">Élec</option>
          </select>
          <input type="number" placeholder="Places" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Année" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="border border-zinc-300 px-3 py-2 text-sm" />
          <div className="flex items-center border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-500">Kilométrage illimité</div>
        </div>

        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-zinc-300 px-3 py-2 text-sm" />

        <input placeholder="Image URL (ou upload Cloudinary ci-dessous)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full border border-zinc-300 px-3 py-2 text-sm" />
        <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-xs" />
        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-32 w-full object-contain border border-zinc-200 bg-zinc-50 p-2" />}

        <button type="submit" disabled={loading} className="w-full bg-[#C1272D] py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-black disabled:opacity-50">
          {loading ? "..." : editingId ? "Mettre à jour" : "Créer le véhicule"}
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ brand: "", model: "", category: "Berline", pricePerDay: 300, transmission: "MANUAL", fuel: "ESSENCE", seats: 5, year: 2023, description: "", imageUrl: "" }); }} className="w-full border border-zinc-300 py-2 text-xs">Annuler édition</button>}
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {cars.map((car) => (
          <div key={car.id} className="bg-white border border-zinc-200 p-4">
            <div className="flex gap-3">
              <img src={car.images[0]?.url || ""} alt="" className="h-20 w-28 object-contain bg-zinc-50 p-1 border border-zinc-100" />
              <div className="flex-1">
                <p className="text-xs font-black uppercase text-[#C1272D]">{car.brand}</p>
                <p className="text-sm font-black">{car.model} • {car.category}</p>
                <p className="text-xs text-zinc-500">{car.pricePerDay} DH/j • {car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"} • {car.seats} pl • {car._count.bookings} résa</p>
                <p className="mt-1 text-[10px] text-zinc-400">{car.id.slice(0, 8)} • {car.available ? "Dispo" : "Indispo"}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => startEdit(car)} className="flex-1 border border-zinc-300 py-2 text-xs font-bold hover:border-black">Éditer</button>
              <button onClick={() => handleDelete(car.id)} className="flex-1 bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-[#C1272D]">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
