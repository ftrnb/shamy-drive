import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQContent from "@/components/faq/FAQContent";

export const metadata = { title: "FAQ — Shamy Drive" };

export default function FAQPage() {
  return (
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <FAQContent />
      <Footer />
    </main>
  );
}
