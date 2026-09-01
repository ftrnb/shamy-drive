import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <Suspense fallback={<div className="text-sm text-zinc-500">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
