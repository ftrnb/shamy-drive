import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import FleetPreview from "@/components/home/FleetPreview";
import HomeFeatures from "@/components/home/HomeFeatures";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main id="contenu" className="min-h-screen bg-background pb-2">
      <Navbar />
      <Hero />
      <div className="h-5" />
      <SearchBar />
      <FleetPreview />
      <HomeFeatures />
      <Footer />
    </main>
  );
}
