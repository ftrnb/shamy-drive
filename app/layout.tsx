import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({ variable: "--font-archivo", subsets: ["latin"], weight: "400" });
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
