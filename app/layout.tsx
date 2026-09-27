import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Shamy Drive — Location premium à Agadir", template: "%s | Shamy Drive" },
  description: "Louez votre voiture à Agadir avec Shamy Drive. Flotte premium, prix transparents, assistance 24/7. Berlines, SUV, citadines dès 250 DH/jour.",
  openGraph: {
    title: "Shamy Drive — Location premium à Agadir",
    description: "Votre route. Votre style. Location de véhicules à Agadir.",
    images: [{ url: "/shamydrive.png", width: 1200, height: 630, alt: "Shamy Drive" }],
    type: "website",
    locale: "fr_MA",
  },
  twitter: { card: "summary_large_image", images: ["/shamydrive.png"] },
  icons: { icon: "/shamydrive.png", apple: "/shamydrive.png" },
};

import Providers from "./providers";
import Script from "next/script";
import MobileNav from "@/components/layout/MobileNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff8f6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white">
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
        <MobileNav />
        <Script src="https://studio.pickaxe.co/api/embed/bundle.js" defer />
      </body>
    </html>
  );
}
