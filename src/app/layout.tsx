import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import DeletionBanner from "@/components/DeletionBanner";

export const metadata: Metadata = {
  title: "Guidiqo - Créez votre branding IA | Brand Guidelines Professionnels",
  description: "Créez un branding professionnel en quelques clics avec l'IA. Palette de couleurs, typographie, brand guidelines et PDF téléchargeable. Outil de création d'identité visuelle pour entreprises et créateurs.",
  keywords: ["branding", "identité visuelle", "palette de couleurs", "typographie", "brand guidelines", "IA", "design", "logo", "charte graphique"],
  authors: [{ name: "Guidiqo" }],
  creator: "Guidiqo",
  publisher: "Guidiqo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Guidiqo - Créez votre branding IA",
    description: "Créez un branding professionnel en quelques clics avec l'IA. Palette de couleurs, typographie et guidelines.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "Guidiqo",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Guidiqo - Brand Guidelines IA',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Guidiqo - Créez votre branding IA",
    description: "Créez un branding professionnel en quelques clics avec l'IA.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <DeletionBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}

