"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MField, fieldInput } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Motion";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/compte";
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message || "Email ou mot de passe incorrect");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest p-7 shadow-m3-2 sm:p-9">
      <Link href="/" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-surface-container px-4 text-[13px] font-bold text-on-surface-variant hover:text-on-surface"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
      <p className="mt-5 inline-flex rounded-full bg-primary-container px-3.5 py-1.5 text-[12px] font-bold text-on-primary-container">Shamy Drive</p>
      <h1 className="mt-3 font-display text-[30px] font-bold">Bon retour</h1>
      <p className="mt-1 text-[14px] text-on-surface-variant">Connecte-toi pour réserver en temps réel.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <MField label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="toi@email.com" className={fieldInput} /></MField>
        <MField label="Mot de passe"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" placeholder="••••••••" className={fieldInput} /></MField>
        {error && <p role="alert" className="rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{error}</p>}
        <button type="submit" disabled={loading} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-bold text-white transition hover:bg-primary active:scale-[0.98] disabled:opacity-50">
          {loading ? <Spinner /> : null}
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-5 text-center text-[14px] text-on-surface-variant">
        Pas de compte ? <Link href="/register" className="font-bold text-primary hover:underline">Créer un compte</Link>
      </p>
    </div>
  );
}
