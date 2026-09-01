import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactContent from "@/components/contact/ContactContent";

export const metadata = { title: "Contact — Shamy Drive" };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  );
}
