import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CineHub BD — Premium Movie Booking in Bangladesh",
    template: "%s | CineHub BD",
  },
  description:
    "Bangladesh's premier movie discovery and booking platform. Browse movies, compare ticket prices, pick your perfect seat, and book instantly at all major cinemas.",
  keywords: [
    "movie tickets Bangladesh",
    "cinema booking Dhaka",
    "CineHub BD",
    "movie booking BD",
    "Bangladeshi cinema",
    "Cineplex tickets",
  ],
  authors: [{ name: "CineHub BD Team" }],
  creator: "CineHub BD",
  publisher: "CineHub BD",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://cinehubbd.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    url: "/",
    siteName: "CineHub BD",
    title: "CineHub BD — Premium Movie Booking in Bangladesh",
    description:
      "Bangladesh's premier movie discovery and booking platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CineHub BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineHub BD",
    description: "Bangladesh's premier movie discovery and booking platform.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0E" },
    { media: "(prefers-color-scheme: light)", color: "#0B0B0E" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
