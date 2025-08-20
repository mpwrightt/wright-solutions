import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"
import { AnimatedBackground } from "@/components/animated-background"

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
  title: "Wright AI Solutions - Custom AI Development & Consulting",
  description:
    "Transform your business with custom AI applications, intelligent process automation, and advanced data analytics. Expert AI consulting services with measurable ROI.",
  keywords: [
    "AI development",
    "machine learning",
    "custom AI solutions",
    "AI consulting",
    "business automation",
    "data analytics",
    "artificial intelligence"
  ],
  authors: [{ name: "Wright AI Solutions" }],
  creator: "Wright AI Solutions",
  publisher: "Wright AI Solutions",
  generator: "Wright AI Solutions",
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${playfairDisplay.variable} ${sourceSansPro.variable} antialiased`}>
      <head></head>
      <body className="font-sans">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  )
}
