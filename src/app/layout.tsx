import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ScrollToTop } from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: "Morning Buddy – AI alarm clock that calls to wake you",
  description: "Get a morning call from a friendly AI buddy. Customize voice and personality for the perfect wake-up experience. Join our waiting list for early access.",
  keywords: "AI alarm clock, morning calls, wake up buddy, personalized alarm, voice alarm",
  authors: [{ name: "Morning Buddy Team" }],
  creator: "Morning Buddy",
  publisher: "Morning Buddy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://morningbuddy.co.uk'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Morning Buddy – AI alarm clock that calls to wake you",
    description: "Get a morning call from a friendly AI buddy—no more jarring alarms.",
    url: '/',
    siteName: 'Morning Buddy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Morning Buddy - AI alarm clock that calls to wake you',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Morning Buddy – AI alarm clock that calls to wake you",
    description: "Get a morning call from a friendly AI buddy—no more jarring alarms.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Skip link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="skip-link"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
