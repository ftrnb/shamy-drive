import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQContent from "@/components/faq/FAQContent";

export const metadata = { title: "FAQ — Shamy Drive" };

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FAQContent />
      <Footer />
    </main>
  );
}
