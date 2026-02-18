import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Find Top Software Companies | TopTechAgencies.com',
    template: '%s | TopTechAgencies.com',
  },
  description: 'Compare 31,000+ vetted IT companies across 51 US cities. Find the best software development, web design, AI, and cloud consulting companies.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toptechagencies.com',
    siteName: 'TopTechAgencies.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TopTechAgencies.com - Find Top Tech Talent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@toptechagencies',
    creator: '@toptechagencies',
  },
  metadataBase: new URL('https://toptechagencies.com'),
  alternates: {
    canonical: './',
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
    google: 'EwrTS3q5MD-oTjytLy5g6CMrqluppWwxpeJIOF_8hcQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
