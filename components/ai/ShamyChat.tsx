"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Send, Bot, User, X, MessageCircle } from "lucide-react";

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
  }, [messages]);

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
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#C1272D] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-xl hover:bg-black transition">
        <MessageCircle className="h-5 w-5" /> Shamy IA
      </button>
    );
  }

  const panel = (
    <div className={`flex flex-col bg-white shadow-2xl border border-zinc-200 ${floating ? "fixed bottom-5 right-5 z-40 h-[520px] w-[380px] max-w-[92vw]" : "h-[600px] w-full max-w-2xl mx-auto"}`}>
      <div className="flex items-center justify-between bg-[#0A0A0A] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#C1272D]"><Sparkles className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide">Shamy IA</p>
            <p className="text-xs text-zinc-400">Assistant Shamy Drive • DB temps réel</p>
          </div>
        </div>
        {floating && <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>}
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 bg-zinc-50 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#0A0A0A] text-white"><Bot className="h-4 w-4" /></div>}
            <div className={`max-w-[80%] px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-[#C1272D] text-white" : "bg-white border border-zinc-200 text-zinc-800"}`}>
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
            {m.role === "user" && <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-zinc-200"><User className="h-4 w-4" /></div>}
          </div>
        ))}
        {loading && <p className="text-xs text-zinc-400 animate-pulse">Shamy réfléchit...</p>}

        {suggestedCars.length > 0 && (
          <div className="grid gap-2">
            {suggestedCars.map((c: any) => (
              <Link key={c.id} href={`/voitures/${c.id}`} className="flex items-center gap-3 border border-zinc-200 bg-white p-3 hover:border-[#C1272D] transition">
                <img src={c.images?.[0]?.url || "/shamydrive.png"} alt={c.model} className="h-14 w-20 object-contain bg-zinc-50" />
                <div className="flex-1">
                  <p className="text-xs font-black uppercase text-[#C1272D]">{c.brand}</p>
                  <p className="text-sm font-black">{c.model} — {c.pricePerDay} DH/j</p>
                </div>
                <span className="text-xs font-bold text-[#C1272D]">Voir →</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ex: SUV auto 5 places <400 DH du 5 au 10 juillet"
          className="flex-1 border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D]"
        />
        <button onClick={send} disabled={loading || !input.trim()} className="flex h-[46px] w-[46px] items-center justify-center bg-[#0A0A0A] text-white hover:bg-[#C1272D] disabled:opacity-40 transition">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return floating ? panel : <div className="w-full">{panel}</div>;
}
