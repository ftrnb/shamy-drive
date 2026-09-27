import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AproposContent from "@/components/apropos/AproposContent";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata = { title: "À propos — Shamy Drive" };

export default function AProposPage() {
  return (
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <ScrollProgress />
      <AproposContent />
      <Footer />
    </main>
  );
}
