"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CarFront, Send, User, ChevronDown } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ShamyChat({ floating = false }: { floating?: boolean }) {
  const [open, setOpen] = useState(!floating);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Salam ! Je suis Shamy, ton assistant Shamy Drive. Dis-moi ton budget, tes dates et le type de voiture — je te propose la vraie dispo à Agadir." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedCars, setSuggestedCars] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        if (data.cars) setSuggestedCars(data.cars);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "Oups, réessaie dans un instant." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erreur réseau. Réessaie." }]);
    } finally {
      setLoading(false);
    }
  }

  if (floating && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#0A0A0A] py-2 pl-2 pr-5 text-white shadow-2xl ring-1 ring-white/10 transition hover:bg-black"
        aria-label="Ouvrir l'assistant Shamy"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#C1272D]">
          <CarFront className="h-5 w-5 text-white" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-white" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-black uppercase tracking-wider">Shamy</span>
          <span className="block text-[11px] font-medium text-zinc-400">Assistant IA • En ligne</span>
        </span>
      </button>
    );
  }

  const panel = (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 ${
        floating ? "fixed bottom-5 right-5 z-40 h-[560px] w-[390px] max-w-[92vw]" : "h-[600px] w-full max-w-2xl mx-auto"
      }`}
    >
      {/* Header pro */}
      <div className="bg-[#0A0A0A] px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1272D] shadow-lg">
              <CarFront className="h-6 w-6 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0A0A0A] bg-white" />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Shamy</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                Assistant IA Shamy Drive
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                <span className="text-zinc-300">En ligne</span>
              </p>
            </div>
          </div>
          {floating ? (
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          ) : (
            <span className="hidden items-center gap-1.5 border border-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300 sm:flex">
              <CarFront className="h-3.5 w-3.5 text-[#C1272D]" /> Agadir
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-zinc-50 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-white">
                <CarFront className="h-4 w-4" />
              </span>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-6 ${
                m.role === "user"
                  ? "rounded-2xl rounded-br-md bg-[#C1272D] text-white shadow"
                  : "rounded-2xl rounded-bl-md border border-zinc-200 bg-white text-zinc-800 shadow-sm"
              }`}
            >
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
            {m.role === "user" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200">
                <User className="h-4 w-4 text-zinc-600" />
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A] text-white">
              <CarFront className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3.5 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
            </div>
          </div>
        )}

        {suggestedCars.length > 0 && (
          <div className="grid gap-2">
            {suggestedCars.map((c: any) => (
              <Link
                key={c.id}
                href={`/voitures/${c.id}`}
                className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-[#C1272D] hover:shadow"
              >
                <img src={c.images?.[0]?.url || "/shamydrive.png"} alt={c.model} className="h-14 w-20 rounded-lg bg-zinc-50 object-contain" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C1272D]">
                    {c.brand}
                  </p>
                  <p className="text-sm font-black text-zinc-900">
                    {c.model} — {c.pricePerDay} DH/j
                  </p>
                </div>
                <span className="rounded-full bg-[#0A0A0A] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white transition group-hover:bg-[#C1272D]">
                  Voir
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ex: SUV auto 5 places <400 DH du 5 au 10 juillet"
            className="h-[46px] flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#C1272D] focus:bg-white focus:ring-1 focus:ring-[#C1272D]"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#C1272D] text-white shadow transition hover:bg-[#0A0A0A] disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-400">Shamy répond à partir des voitures réellement disponibles</p>
      </div>
    </div>
  );

  return floating ? panel : <div className="w-full">{panel}</div>;
}
