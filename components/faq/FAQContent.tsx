"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Info,
  CalendarCheck,
  Car,
  CreditCard,
  FileText,
  MapPin,
  RefreshCw,
  Bot,
  MessageCircle,
  Shield,
  Search,
  X,
  Link2,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Reveal from "@/components/ui/Reveal";
import { toast } from "@/components/ui/Toaster";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/ui/Motion";

type FAQItem = { q: string; a: string };
type FAQCategory = { id: string; icon: React.ElementType; label: string; labelEn: string; items: FAQItem[]; itemsEn: FAQItem[] };

function FaqItem({
  id,
  q,
  a,
  open,
  onToggle,
  copyLabel,
  copiedLabel,
}: {
  id: string;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  copyLabel: string;
  copiedLabel: string;
}) {
  const reduce = useReducedMotion();

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast(copiedLabel, { desc: url });
    } catch {
      toast(copyLabel, { tone: "error" });
    }
  }

  return (
    <div
      id={id}
      className={`scroll-mt-32 border-b border-outline-variant/40 px-1 transition-colors duration-200 sm:px-3 ${
        open ? "bg-surface-container/70" : "hover:bg-surface-container/40"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex min-h-[68px] w-full cursor-pointer items-center gap-4 py-4 text-left"
      >
        <span className={`flex-1 text-[15px] font-bold leading-6 transition-colors duration-200 sm:text-[16px] ${open ? "text-primary" : ""}`}>{q}</span>
        <motion.span
          animate={reduce ? undefined : { rotate: open ? 45 : 0, scale: open ? 1.08 : 1 }}
          transition={{ duration: 0.3, ease: easeOut }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] font-light leading-none transition-all duration-200 group-active:scale-90 ${
            open ? "bg-ink text-white shadow-m3-1" : "border border-outline-variant/60 text-on-surface-variant group-hover:border-primary group-hover:text-primary"
          }`}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="px-0 pb-1 text-sm leading-7 text-on-surface-variant sm:pr-14">{a}</p>
            <div className="pb-5 pt-3 sm:pr-14">
              <button
                type="button"
                onClick={copyLink}
                aria-label={copyLabel}
                className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-surface-container px-3.5 text-[12px] font-bold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface active:scale-95"
              >
                <Link2 className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" />
                {copyLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Unified categories with both languages - rendered based on lang
const categories: FAQCategory[] = [
  {
    id: "general",
    icon: Info,
    label: "Général",
    labelEn: "General",
    items: [
      {
        q: "Qu'est-ce que Shamy Drive ?",
        a: "Shamy Drive est une agence de location de voitures premium à Agadir. Nous proposons une réservation simple en ligne, une flotte sélectionnée et entretenue, et un accompagnement digital avant, pendant et après votre location. Chaque voiture sort vérifiée, assurée et prête à rouler.",
      },
      {
        q: "Dans quelles villes puis-je louer ?",
        a: "Nous couvrons Agadir, l'aéroport Agadir Al Massira, Taghazout, Tamraght et Aourir, avec livraison sur la côte Atlantique selon disponibilité. Essaouira et Marrakech sont possibles sur devis — indiquez votre lieu à la réservation.",
      },
      {
        q: "Shamy Drive convient-il aux touristes et aux professionnels ?",
        a: "Oui. Nos offres s'adressent aux voyageurs, familles, expatriés et entreprises qui recherchent un véhicule fiable, un prix net en DH et un parcours clair sans surprise. Kilométrage illimité inclus sur Agadir.",
      },
      {
        q: "Le site est-il disponible en plusieurs langues ?",
        a: "Oui : français et anglais dès maintenant, et arabe bientôt pour faciliter la réservation depuis le Maroc ou l'étranger. Changez de langue via FR/EN en haut du site — la FAQ suit automatiquement.",
      },
    ],
    itemsEn: [
      {
        q: "What is Shamy Drive?",
        a: "Shamy Drive is a premium car rental agency in Agadir. We offer easy online booking, a curated and maintained fleet, and digital support before, during and after your rental. Every car leaves checked, insured and ready to drive.",
      },
      {
        q: "In which cities can I rent?",
        a: "We cover Agadir, Agadir Al Massira Airport, Taghazout, Tamraght and Aourir, with delivery along the Atlantic coast subject to availability. Essaouira and Marrakech are available on request — tell us your location when booking.",
      },
      {
        q: "Is Shamy Drive suitable for tourists and professionals?",
        a: "Yes. Our offers are for travelers, families, expats and businesses looking for a reliable vehicle, net price in MAD and a clear journey with no surprises. Unlimited mileage included around Agadir.",
      },
      {
        q: "Is the site available in several languages?",
        a: "Yes: French and English now, Arabic coming soon to make booking easier from Morocco or abroad. Switch FR/EN at the top — the FAQ follows automatically.",
      },
    ],
  },
  {
    id: "reservation",
    icon: CalendarCheck,
    label: "Réservation en ligne",
    labelEn: "Online booking",
    items: [
      {
        q: "Comment réserver une voiture avec Shamy Drive ?",
        a: "Choisissez vos dates et lieu, comparez les véhicules disponibles en temps réel, ajoutez vos options puis confirmez. Vous payez à la livraison après état des lieux — pas de prépaiement bloquant.",
      },
      {
        q: "Dois-je créer un compte ?",
        a: "Non pour démarrer. Vous pouvez réserver sans compte. Créer un compte facilite le suivi de vos réservations, documents et factures dans « Mon compte ».",
      },
      {
        q: "Puis-je réserver depuis un mobile ?",
        a: "Oui, le parcours est mobile-first : recherche, choix d'options et confirmation sont optimisés smartphone. Besoin naturel type « SUV auto 5 places <400 DH » compris par Shamy IA.",
      },
      {
        q: "Combien de temps prend une réservation ?",
        a: "En général moins de deux minutes une fois vos dates connues. Saisie minimale, vérification instantanée de disponibilité et confirmation par l'équipe dès validation.",
      },
    ],
    itemsEn: [
      {
        q: "How do I book a car with Shamy Drive?",
        a: "Pick your dates and location, compare available cars in real time, add options and confirm. You pay on delivery after inspection — no blocking prepayment.",
      },
      {
        q: "Do I need to create an account?",
        a: "No to start. You can book without an account. Creating one makes it easier to track bookings, documents and invoices in “My account”.",
      },
      {
        q: "Can I book from my phone?",
        a: "Yes, the flow is mobile-first: search, options and confirmation are phone-optimized. Natural needs like “SUV auto 5 seats <400 MAD” are understood by Shamy AI.",
      },
      {
        q: "How long does a booking take?",
        a: "Usually under two minutes once your dates are known. Minimal input, instant availability check and confirmation within 2 business hours by the team.",
      },
    ],
  },
  {
    id: "vehicules",
    icon: Car,
    label: "Véhicules et disponibilité",
    labelEn: "Vehicles & availability",
    items: [
      {
        q: "Les véhicules affichés sont-ils garantis disponibles ?",
        a: "La disponibilité est calculée en temps réel selon vos dates. La confirmation reste soumise à validation finale et à la présentation des documents à la remise. En haute saison, réservez tôt.",
      },
      {
        q: "Puis-je choisir un modèle précis ?",
        a: "Vous réservez une catégorie (citadine, SUV, etc.). Le modèle peut varier « ou similaire » dans cette catégorie selon le planning — nous garantissons la catégorie et les équipements clés (boîte, places).",
      },
      {
        q: "Comment consulter la flotte ?",
        a: "Allez sur « Véhicules » puis lancez une recherche avec vos dates pour voir uniquement les voitures réellement disponibles. Prix nets en DH/jour, assurance de base incluse et kilométrage illimité.",
      },
    ],
    itemsEn: [
      {
        q: "Are displayed vehicles guaranteed available?",
        a: "Availability is calculated in real time for your dates. Confirmation remains subject to final validation and document check at hand-over. In high season, book early.",
      },
      {
        q: "Can I choose an exact model?",
        a: "You book a category (city car, SUV, etc.). Model may vary “or similar” within that category depending on schedule — we guarantee the category and key specs (gear, seats).",
      },
      {
        q: "How do I browse the fleet?",
        a: "Go to “Cars” and search with your dates to see only truly available cars. Net prices in MAD/day, basic insurance included and unlimited mileage.",
      },
    ],
  },
  {
    id: "prix",
    icon: CreditCard,
    label: "Prix, caution et paiement",
    labelEn: "Prices, deposit & payment",
    items: [
      {
        q: "Les prix affichés sont-ils définitifs ?",
        a: "Ils sont indicatifs selon saison et durée ; le montant exact est confirmé avant validation et repris dans le contrat. Pas de « à partir de » trompeur — ce que vous voyez pour vos dates est ce que vous payez.",
      },
      {
        q: "Comment fonctionne la caution ?",
        a: "Une caution est demandée à la remise (empreinte carte). Montant selon catégorie, restituée en fin de location sans dommage ni manquement au contrat. Blocage temporaire, pas de débit si tout est OK.",
      },
      {
        q: "Quels moyens de paiement ?",
        a: "Paiement à la livraison : espèces, carte ou virement selon agence — vous réglez quand la voiture arrive après vérification. Paiement en ligne sécurisé possible à la réservation si proposé. Aucun prépaiement bloquant obligatoire.",
      },
      {
        q: "Y a-t-il des frais cachés ?",
        a: "Non. Transparence sur options, franchise et carburant avant validation. Lisez le récapitulatif et le contrat — tout est détaillé : kilométrage illimité inclus, pas de surprise.",
      },
    ],
    itemsEn: [
      {
        q: "Are displayed prices final?",
        a: "They are indicative depending on season and duration; the exact amount is confirmed before checkout and in the contract. No misleading “from” — what you see for your dates is what you pay.",
      },
      {
        q: "How does the deposit work?",
        a: "A deposit is requested at hand-over (card hold). Amount depends on category, refunded at the end if no damage or breach. Temporary hold, not charged if all is OK.",
      },
      {
        q: "Which payment methods?",
        a: "Pay on delivery: cash, card or transfer depending on agency — you pay when the car arrives after inspection. Secure online payment at booking if offered. No mandatory blocking prepayment.",
      },
      {
        q: "Are there hidden fees?",
        a: "No. Transparency on options, excess and fuel before confirming. Read the summary and contract — all detailed: unlimited mileage included, no surprises.",
      },
    ],
  },
  {
    id: "documents",
    icon: FileText,
    label: "Documents nécessaires",
    labelEn: "Required documents",
    items: [
      {
        q: "Quels documents pour louer ?",
        a: "Pièce d'identité (CIN ou passeport), permis de conduire valide et pièce pour conducteur supplémentaire si applicable. Documents vérifiés à la remise avant signature du contrat.",
      },
      {
        q: "Permis étranger accepté ?",
        a: "Oui, permis valide avec passeport ou carte d'identité. Pour un séjour prolongé, renseignez-vous — un permis international peut être conseillé.",
      },
      {
        q: "Envoyer mes documents via le site ?",
        a: "Utilisez uniquement les parcours sécurisés indiqués lors de la réservation (upload chiffré via Cloudinary). Ne transmettez pas de carte bancaire ni de documents complets via le chatbot.",
      },
    ],
    itemsEn: [
      {
        q: "Which documents are required?",
        a: "ID (CIN or passport), valid driving licence and extra docs for additional driver if applicable. Checked at hand-over before signing.",
      },
      {
        q: "Is a foreign licence accepted?",
        a: "Yes, valid licence with passport or ID. For longer stays, ask — an international permit may be advised.",
      },
      {
        q: "Send my documents via the site?",
        a: "Use only the secure flows indicated at booking (encrypted upload via Cloudinary). Do not send bank card or full documents via the chatbot.",
      },
    ],
  },
  {
    id: "livraison",
    icon: MapPin,
    label: "Livraison et récupération",
    labelEn: "Delivery & pick-up",
    items: [
      {
        q: "Comment se passe la remise ?",
        a: "Présentation en agence ou au point convenu avec vos documents. État des lieux contradictoire et contrat détaillés avant remise des clés. Prévoyez 10-15 min.",
      },
      {
        q: "Livraison aéroport ?",
        a: "Oui sur l'aéroport Agadir Al Massira et hôtels d'Agadir/Taghazout. Indiquez votre vol et horaires à la réservation pour une remise à l'heure dite. Si retard, on prévient et on s'adapte.",
      },
      {
        q: "Restitution ailleurs ?",
        a: "Possible selon conditions de réservation (aller simple sur devis). Vérifiez les lieux proposés au booking ou contactez-nous via WhatsApp pour organiser.",
      },
    ],
    itemsEn: [
      {
        q: "How does hand-over work?",
        a: "At the agency or agreed point with your documents. Joint inspection and contract before keys. Allow 10–15 min.",
      },
      {
        q: "Airport delivery?",
        a: "Yes at Agadir Al Massira Airport and hotels in Agadir/Taghazout. Provide flight and times at booking for on-time delivery. If delayed, we inform and adapt.",
      },
      {
        q: "Return elsewhere?",
        a: "Possible per booking conditions (one-way on request). Check locations at booking or contact us on WhatsApp to arrange.",
      },
    ],
  },
  {
    id: "modification",
    icon: RefreshCw,
    label: "Modification et annulation",
    labelEn: "Changes & cancellation",
    items: [
      {
        q: "Modifier ma réservation ?",
        a: "Oui selon disponibilité et délai — via « Mon compte > Mes réservations » ou en contactant l'agence directement. Changement de dates/catégorie possible sans frais si dispo.",
      },
      {
        q: "Comment annuler ?",
        a: "Conditions indiquées à la réservation et dans le contrat. Annulation gratuite jusqu'à 48h avant départ ; au-delà, frais possibles selon délai — on trouve une solution ensemble.",
      },
      {
        q: "L'assistant IA peut-il annuler pour moi ?",
        a: "Non — il oriente et explique la marche à suivre ; l'annulation effective se fait via l'espace client ou un conseiller humain. Le contrat fait foi.",
      },
    ],
    itemsEn: [
      {
        q: "Change my booking?",
        a: "Yes subject to availability and notice — via “My account > My bookings” or by contacting the agency. Date/category change free if available.",
      },
      {
        q: "How to cancel?",
        a: "Terms shown at booking and in the contract. Free cancellation up to 48h before departure; beyond, fees may apply per notice — we find a solution together.",
      },
      {
        q: "Can the AI assistant cancel for me?",
        a: "No — it guides and explains next steps; actual cancellation is via customer area or human agent. The contract prevails.",
      },
    ],
  },
  {
    id: "assistant",
    icon: Bot,
    label: "Assistant IA",
    labelEn: "AI Assistant",
    items: [
      {
        q: "L'assistant peut-il m'aider à choisir un véhicule ?",
        a: "Oui : il recommande des catégories, explique les étapes de réservation et répond aux questions fréquentes en interrogeant la vraie base de disponibilité avant de conseiller.",
      },
      {
        q: "Question avant de réserver ?",
        a: "Utilisez « Parler à Shamy » sur le site — décrivez votre besoin en phrase naturelle (« SUV auto 5 places <400 DH ») et Shamy vous oriente.",
      },
      {
        q: "L'assistant peut-il modifier ma réservation ?",
        a: "Non pour les actions contractuelles — il indique la marche à suivre et vous redirige vers Mon compte ou WhatsApp pour validation humaine.",
      },
      {
        q: "Si l'assistant ne comprend pas ?",
        a: "Reformulez plus simplement, consultez cette FAQ ou contactez-nous via WhatsApp / Contact. L'équipe prend le relais.",
      },
    ],
    itemsEn: [
      {
        q: "Can the assistant help me choose a car?",
        a: "Yes: it recommends categories, explains booking steps and FAQ, querying real availability before advising.",
      },
      {
        q: "Question before booking?",
        a: "Use “Talk to Shamy” on the site — describe your need naturally (“SUV auto 5 seats <400 MAD”) and Shamy guides you.",
      },
      {
        q: "Can the assistant change my booking?",
        a: "No for contractual actions — it shows the steps and redirects to My account or WhatsApp for human validation.",
      },
      {
        q: "If the assistant doesn't understand?",
        a: "Rephrase simply, check this FAQ or reach us on WhatsApp / Contact. The team takes over.",
      },
    ],
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "Support WhatsApp",
    labelEn: "WhatsApp support",
    items: [
      {
        q: "Contacter sur WhatsApp ?",
        a: "Oui via le bouton du site avec message pré-rempli. Numéro : +212 6 61 68 96 59. Réponse en horaires bureau, idéal pour urgences en location.",
      },
      {
        q: "WhatsApp ou chatbot ?",
        a: "Chatbot pour explorer, comparer et questions rapides. WhatsApp pour l'urgent, une réservation confirmée, l'envoi de documents ou une question de paiement.",
      },
      {
        q: "Conseiller humain disponible ?",
        a: "Oui aux horaires indiqués sur le site. L'IA et WhatsApp complètent le service sans remplacer le contrat — un humain valide toujours les points sensibles.",
      },
    ],
    itemsEn: [
      {
        q: "Contact on WhatsApp?",
        a: "Yes via the site button with pre-filled message. Number: +212 6 61 68 96 59. Reply during office hours, ideal for rental emergencies.",
      },
      {
        q: "WhatsApp or chatbot?",
        a: "Chatbot to explore, compare and ask quick questions. WhatsApp for urgent matters, confirmed booking, document sending or payment question.",
      },
      {
        q: "Is a human agent available?",
        a: "Yes during hours shown on site. AI and WhatsApp complement service without replacing the contract — a human always validates sensitive points.",
      },
    ],
  },
  {
    id: "securite",
    icon: Shield,
    label: "Sécurité et confidentialité",
    labelEn: "Security & privacy",
    items: [
      {
        q: "Données protégées ?",
        a: "Oui, mesures de sécurité adaptées (chiffrement, stockage sécurisé Cloudinary pour les pièces). Voir notre politique de confidentialité pour le détail des traitements.",
      },
      {
        q: "Données sensibles dans le chatbot ?",
        a: "Non — ne saisissez jamais de numéro complet de carte bancaire ni de documents complets dans le chat. Utilisez les parcours sécurisés dédiés.",
      },
      {
        q: "Conversations enregistrées ?",
        a: "Possiblement pour améliorer l'assistance et la qualité de service, conformément à la politique de confidentialité. Pas de revente de données.",
      },
    ],
    itemsEn: [
      {
        q: "Is my data protected?",
        a: "Yes, appropriate security measures (encryption, secure Cloudinary storage for IDs). See our privacy policy for processing details.",
      },
      {
        q: "Sensitive data in the chatbot?",
        a: "No — never enter full bank card numbers or complete documents in the chat. Use dedicated secure flows.",
      },
      {
        q: "Are conversations stored?",
        a: "Possibly to improve assistance and service quality, per privacy policy. No data resale.",
      },
    ],
  },
];

export default function FAQContent() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((c) => {
        const items = (isFr ? c.items : c.itemsEn).filter(
          (it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        );
        return { ...c, _filtered: items } as FAQCategory & { _filtered: FAQItem[] };
      })
      .filter((c) => (c as unknown as { _filtered: FAQItem[] })._filtered.length > 0);
  }, [query, isFr]);

  const totalQuestions = categories.reduce((acc, c) => acc + c.items.length, 0);
  const resultCount = filtered.reduce(
    (a, c) => a + ((c as unknown as { _filtered?: FAQItem[] })._filtered?.length ?? (isFr ? c.items : c.itemsEn).length),
    0
  );

  // Scroll-spy: highlight the pill of the section currently in view
  useEffect(() => {
    if (query.trim()) {
      setActiveCat(null);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveCat(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    filtered.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [filtered, query]);

  return (
    <>
      {/* Hero */}
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink p-7 text-white shadow-m3-3 sm:p-10"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold tracking-wide text-white/85">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-tertiary-container" />
            FAQ
          </p>
          <h1 className="mt-4 font-display text-[38px] font-bold leading-[1.0] tracking-tight sm:text-[52px]">
            {isFr ? "Questions" : "Frequently"}
            <br />
            <span className="text-tertiary-container">{isFr ? "fréquentes." : "asked."}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-7 text-white/65">
            {isFr
              ? "Tout ce que nos clients demandent avant de réserver. Recherche instantanée ci-dessous. Si tu ne trouves pas, Shamy ou WhatsApp te répondent en direct."
              : "Everything clients ask before booking. Instant search below. If you don't find an answer, Shamy or WhatsApp will reply live."}
          </p>
          {/* Search */}
          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isFr ? "Rechercher (ex: caution, aéroport, annulation...)" : "Search (e.g. deposit, airport, cancellation...)"}
              aria-label={isFr ? "Rechercher dans la FAQ" : "Search the FAQ"}
              className="h-[56px] w-full rounded-full border border-white/15 bg-white/10 pl-12 pr-12 text-[15px] text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-tertiary-container focus:bg-white/[0.14] focus:ring-4 focus:ring-tertiary-container/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white active:scale-90"
                aria-label={isFr ? "Effacer" : "Clear"}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-3 flex min-h-[28px] items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={query ? `r-${resultCount}` : "t"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container" />
                {isFr ? `${totalQuestions} questions • ${categories.length} catégories` : `${totalQuestions} questions • ${categories.length} categories`}
                {query && ` • ${resultCount} ${isFr ? "résultats" : "results"}`}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Category pills */}
      <div className="sticky top-[76px] z-30 px-3 sm:px-5">
        <div className="mx-auto max-w-6xl">
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-6 py-3 sm:mx-0 sm:px-0">
            {categories.map((c) => {
              const label = isFr ? c.label : c.labelEn;
              const active = activeCat === c.id;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  aria-current={active ? "true" : undefined}
                  className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                    active
                      ? "border-transparent bg-ink text-white shadow-m3-2"
                      : "border-outline-variant bg-surface-container-lowest/95 text-on-surface shadow-m3-1 backdrop-blur hover:border-primary hover:shadow-m3-1"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ sections */}
      <section className="mx-auto max-w-6xl px-6 py-8 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-10">
            {filtered.map((cat, ci) => {
              const Icon = cat.icon;
              const label = isFr ? cat.label : cat.labelEn;
              const items: FAQItem[] =
                (cat as unknown as { _filtered?: FAQItem[] })._filtered ?? (isFr ? cat.items : cat.itemsEn);
              if (items.length === 0) return null;
              return (
                <Reveal key={cat.id}>
                <div id={cat.id} className="scroll-mt-28">
                  <div className="flex items-end gap-4 px-1 sm:px-3">
                    <span aria-hidden className="font-display text-[52px] font-bold leading-[0.85] text-outline-variant/50 transition-colors duration-300 sm:text-[64px]">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <div className="pb-0.5">
                      <h2 className="font-display text-[22px] font-bold tracking-tight sm:text-[26px]">{label}</h2>
                      <p className="mt-1 text-[13px] font-semibold text-on-surface-variant">
                        {items.length} {isFr ? "questions" : "questions"}
                      </p>
                    </div>
                    <span className="mb-2 ml-auto hidden h-11 w-11 items-center justify-center rounded-2xl bg-surface-container text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6 sm:flex">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4 border-t border-outline-variant/40">
                    {items.map((f, fi) => {
                      const key = `${cat.id}-${f.q}`;
                      const itemId = `faq-${cat.id}-${fi}`;
                      const isOpen = query ? true : openKey === key;
                      return (
                        <FaqItem
                          key={f.q}
                          id={itemId}
                          q={f.q}
                          a={f.a}
                          open={isOpen}
                          onToggle={() => {
                            if (query) return;
                            setOpenKey(isOpen ? null : key);
                          }}
                          copyLabel={isFr ? "Copier le lien" : "Copy link"}
                          copiedLabel={isFr ? "Lien copié" : "Link copied"}
                        />
                      );
                    })}
                  </div>
                </div>
                </Reveal>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
                <p className="font-display text-[16px] font-bold">
                  {isFr ? "Aucun résultat" : "No results"}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {isFr ? "Essayez un autre mot-clé ou contactez-nous." : "Try another keyword or contact us."}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <Reveal delay={0.1}>
          <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-m3-1 transition-shadow duration-300 hover:shadow-m3-2">
              <p className="text-[12px] font-bold uppercase tracking-widest text-primary">
                {isFr ? "Besoin d'aide ?" : "Need help?"}
              </p>
              <h3 className="mt-2 font-display text-[18px] font-bold leading-snug">
                {isFr ? "On te répond vite." : "We reply fast."}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-on-surface-variant">
                {isFr
                  ? "Shamy IA pour explorer, WhatsApp pour l'urgent. L'équipe confirme chaque demande."
                  : "Shamy AI to explore, WhatsApp for urgent. The team confirms every request."}
              </p>
              <div className="mt-5 space-y-2.5">
                <Link
                  href="/contact"
                  className="flex min-h-[52px] items-center justify-center rounded-full bg-ink px-5 text-[14px] font-bold text-white transition hover:bg-primary active:scale-[0.98]"
                >
                  {isFr ? "Contact" : "Contact us"}
                </Link>
                <a
                  href="https://wa.me/212661689659"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-success-container px-5 text-[14px] font-bold text-on-success-container transition hover:brightness-95 active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4 transition-transform duration-300 hover:scale-125 hover:-rotate-12" />
                  WhatsApp
                </a>
                <Link
                  href="/voitures"
                  className="link-underline block pt-1 text-center text-[13px] font-bold text-on-surface-variant hover:text-on-surface"
                >
                  {isFr ? "Voir les véhicules →" : "View cars →"}
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] bg-surface-container p-5 transition-colors duration-300">
              <p className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">Shamy Drive</p>
              <p className="mt-2 text-[12px] leading-5 text-on-surface-variant">
                {isFr
                  ? "Agadir • Aéroport Al Massira • Taghazout • Tamraght • Aourir. Livraison côte Atlantique. Paiement à la livraison • Km illimité."
                  : "Agadir • Al Massira Airport • Taghazout • Tamraght • Aourir. Atlantic coast delivery. Pay on delivery • Unlimited mileage."}
              </p>
            </div>

            {/* JSON-LD for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: categories.flatMap((c) =>
                    (isFr ? c.items : c.itemsEn).map((it) => ({
                      "@type": "Question",
                      name: it.q,
                      acceptedAnswer: { "@type": "Answer", text: it.a },
                    }))
                  ),
                }),
              }}
            />
          </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
