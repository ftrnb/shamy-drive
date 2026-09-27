"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import { MField, fieldInput } from "@/components/ui/Field";
import { Spinner, easeOut } from "@/components/ui/Motion";
import { motion, useReducedMotion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "USER",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Inscription échouée");
        return;
      }

      router.push("/compte");
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: easeOut }}
        className="w-full max-w-md rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest p-7 shadow-m3-2 sm:p-9"
      >
        <Link href="/" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-surface-container px-4 text-[13px] font-bold text-on-surface-variant"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
        <p className="mt-5 inline-flex rounded-full bg-primary-container px-3.5 py-1.5 text-[12px] font-bold text-on-primary-container">Shamy Drive</p>
        <h1 className="mt-3 font-display text-[30px] font-bold">Créer un compte</h1>
        <p className="mt-1 text-[14px] text-on-surface-variant">Réserve plus vite, suis tes locations.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <MField label="Nom complet"><input value={name} onChange={(e) => setName(e.target.value)} required className={fieldInput} placeholder="Ex : Youssef Benali" autoComplete="name" /></MField>
          <MField label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className={fieldInput} placeholder="toi@email.com" autoComplete="email" /></MField>
          <MField label="Mot de passe"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className={fieldInput} placeholder="8 caractères minimum" autoComplete="new-password" /></MField>
          {error && <p role="alert" className="rounded-2xl bg-error-container/60 px-4 py-3 text-[13px] font-semibold text-error">{typeof error === "string" ? error : JSON.stringify(error)}</p>}
          <button type="submit" disabled={loading} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-bold text-white shadow-m3-1 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
            {loading ? <Spinner /> : null}
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] text-on-surface-variant">Déjà inscrit ? <Link href="/login" className="font-bold text-primary hover:underline">Se connecter</Link></p>
      </motion.div>
    </main>
  );
}
