"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Inscription échouée");
        return;
      }
      // auto login
      const login = await signIn("credentials", { email, password, redirect: false });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/compte");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 shadow-xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C1272D]">Shamy Drive</p>
        <h1 className="mt-2 text-3xl font-black uppercase">Créer un compte</h1>
        <p className="mt-2 text-sm text-zinc-500">Réservez plus vite, suivez vos locations.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Nom complet</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" placeholder="Ex: Youssef Benali" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Mot de passe</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" placeholder="8 caractères minimum" />
          </div>
          {error && <p className="bg-[#C1272D]/10 border border-[#C1272D]/20 px-4 py-3 text-sm text-[#C1272D]">{typeof error === "string" ? error : JSON.stringify(error)}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#C1272D] py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-black transition disabled:opacity-50">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">Déjà inscrit ? <Link href="/login" className="font-bold text-[#C1272D] hover:text-black">Se connecter</Link></p>
      </div>
    </main>
  );
}
