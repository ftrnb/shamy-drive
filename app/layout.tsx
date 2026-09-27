import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Shamy Drive — Location premium à Agadir", template: "%s | Shamy Drive" },
  description: "Louez votre voiture à Agadir avec Shamy Drive. Flotte réelle, prix nets en DH dès 250/jour, kilométrage illimité. Citadines, berlines, SUV.",
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
import BackToTop from "@/components/layout/BackToTop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('shamy-theme')||'auto';var d=t==='dark'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white">
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
        <MobileNav />
        <BackToTop />
        <Script src="https://studio.pickaxe.co/api/embed/bundle.js" defer />
      </body>
    </html>
  );
}
