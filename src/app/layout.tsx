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
  title: "CGrow - Plateforme d'Investissement Intelligent",
  description: "La plateforme d'investissement la plus fiable du Congo avec 15% de croissance quotidienne. Commencez votre voyage d'investissement aujourd'hui.",
  keywords: ["CGrow", "Investissement", "Congo", "Finance", "Croissance Quotidienne"],
  authors: [{ name: "Équipe CGrow" }],
  openGraph: {
    title: "CGrow",
    description: "La plateforme d'investissement la plus fiable du Congo avec 15% de croissance quotidienne",
    url: "https://cgrow.com",
    siteName: "CGrow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGrow",
    description: "La plateforme d'investissement la plus fiable du Congo avec 15% de croissance quotidienne",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
