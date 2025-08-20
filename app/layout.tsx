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
  title: "Lock In - Motivational Status Display",
  description:
    "Stay focused and motivated with a bold Lock In reminder and scrolling inspirational quotes.",
  keywords: [
    "motivation",
    "focus",
    "productivity",
    "lock in",
    "inspirational quotes",
    "status display"
  ],
  authors: [{ name: "Lock In App" }],
  creator: "Lock In App",
  publisher: "Lock In App",
  generator: "Lock In App",
  robots: {
    index: false,
    follow: false,
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
