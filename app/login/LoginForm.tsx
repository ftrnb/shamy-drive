"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/compte";
  const [email, setEmail] = useState("client@test.ma");
  const [password, setPassword] = useState("User123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200 p-8 shadow-xl">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C1272D]">Shamy Drive</p>
      <h1 className="mt-2 text-3xl font-black uppercase">Connexion</h1>
      <p className="mt-2 text-sm text-zinc-500">Connectez-vous pour réserver en temps réel.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D]" />
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Mot de passe</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D]" />
        </div>
        {error && <p className="bg-[#C1272D]/10 border border-[#C1272D]/20 px-4 py-3 text-sm text-[#C1272D]">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#0A0A0A] py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-[#C1272D] transition disabled:opacity-50">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Pas de compte ? <Link href="/register" className="font-bold text-[#C1272D] hover:text-black">Créer un compte</Link>
      </p>

      <div className="mt-6 border-t border-zinc-200 pt-4 text-xs text-zinc-400">
        <p>Test : client@test.ma / User123! — Admin : admin@shamydrive.ma / Admin123!</p>
      </div>
    </div>
  );
}
