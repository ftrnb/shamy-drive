import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import FleetPreview from "@/components/home/FleetPreview";
import HomeFeatures from "@/components/home/HomeFeatures";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchBar />
      <FleetPreview />
      <HomeFeatures />
      <Footer />
    </main>
  );
}
