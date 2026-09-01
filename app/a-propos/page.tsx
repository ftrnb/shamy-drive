import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AproposContent from "@/components/apropos/AproposContent";

export const metadata = { title: "À propos — Shamy Drive" };

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AproposContent />
      <Footer />
    </main>
  );
}
