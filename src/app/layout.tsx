import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CGrow - Investissement Congo | Plateforme Mobile Money | 15% Rendement Quotidien",
  description: "🇨🇩 Plateforme d'investissement #1 au Congo ! 15% de croissance quotidienne garantie. Investissez via Airtel Money. Déposez, gagnez, retirez. Rejoignez 10,000+ investisseurs congolais.",
  keywords: [
    // Congo Investment Keywords
    "investissement congo", "placement congo", "investir congo", "finance congo",
    "investissement kinshasa", "investissement lubumbashi", "money congo",
    "argent congo", "business congo", "entrepreneur congo",
    
    // Mobile Money Keywords  
    "airtel money congo", "mobile money congo", "paiement mobile congo",
    "argent mobile congo", "airtel money investissement", "transaction mobile",
    
    // Investment Terms
    "rendement quotidien", "profit quotidien", "gain argent", "revenus passifs",
    "investissement rentable", "placement rentable", "croissance quotidienne",
    "15 pourcent quotidien", "retour investissement",
    
    // Congo Cities & Regions
    "investissement kinshasa", "investissement lubumbashi", "investissement goma",
    "investissement bukavu", "investissement kananga", "investissement kisangani",
    
    // French Investment Terms
    "plateforme investissement", "investir en ligne", "gagner argent internet",
    "investissement numérique", "finance participative", "crowdfunding congo"
  ],
  authors: [{ name: "Équipe CGrow Congo" }],
  robots: "index, follow",
  openGraph: {
    title: "CGrow - Investissement Congo | 15% Rendement Quotidien | Mobile Money",
    description: "🇨🇩 Plateforme d'investissement #1 au Congo ! 15% de croissance quotidienne. Airtel Money accepté. +10,000 investisseurs satisfaits.",
    url: "https://cgrow.netlify.app",
    siteName: "CGrow Congo Investment",
    type: "website",
    locale: "fr_CD",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CGrow - Investissement Congo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CGrow - Investissement Congo | 15% Rendement Quotidien",
    description: "🇨🇩 Plateforme d'investissement #1 au Congo ! 15% de croissance quotidienne via Airtel Money.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://cgrow.netlify.app",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "CGrow",
              "description": "Plateforme d'investissement #1 au Congo avec 15% de rendement quotidien",
              "url": "https://cgrow.netlify.app",
              "logo": "https://cgrow.netlify.app/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CD",
                "addressRegion": "Kinshasa"
              },
              "sameAs": [],
              "offers": {
                "@type": "Offer",
                "description": "Investissement avec 15% de rendement quotidien",
                "category": "Investissement"
              },
              "serviceType": "Investment Platform",
              "areaServed": {
                "@type": "Country",
                "name": "République Démocratique du Congo"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
