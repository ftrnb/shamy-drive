import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactContent from "@/components/contact/ContactContent";

export const metadata = { title: "Contact — Shamy Drive" };

export default function ContactPage() {
  return (
    <main id="contenu" className="min-h-screen bg-background pb-28 md:pb-10">
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  );
}
