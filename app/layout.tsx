import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"
import { AnimatedBackground } from "@/components/animated-background"
import { SchemaMarkup } from "@/components/schema-markup"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const sourceSansPro = Source_Sans_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Wright AI Solutions - Custom AI Applications for Business",
  description:
    "Transform your business with tailored AI applications that solve your specific challenges. Expert AI consulting and development services.",
  keywords: [
    "custom AI development",
    "AI consulting",
    "business AI solutions",
    "machine learning development",
    "AI automation",
    "predictive analytics",
    "AI process automation",
    "custom AI applications"
  ],
  authors: [{ name: "Wright AI Solutions" }],
  creator: "Wright AI Solutions",
  publisher: "Wright AI Solutions",
  generator: "Wright AI Solutions",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wrightaisolutions.com",
    title: "Wright AI Solutions - Custom AI Applications for Business",
    description: "Transform your business with tailored AI applications that solve your specific challenges. Expert AI consulting and development services.",
    siteName: "Wright AI Solutions",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wright AI Solutions - Custom AI Applications for Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wright AI Solutions - Custom AI Applications for Business",
    description: "Transform your business with tailored AI applications that solve your specific challenges. Expert AI consulting and development services.",
    images: ["/twitter-image.png"],
    creator: "@wrightaisolutions",
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://wrightaisolutions.com",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  metadataBase: new URL("https://wrightaisolutions.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${playfairDisplay.variable} ${sourceSansPro.variable} antialiased`}>
      <head>
        <SchemaMarkup type="organization" />
        <SchemaMarkup type="localBusiness" />
      </head>
      <body className="font-sans">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  )
}
