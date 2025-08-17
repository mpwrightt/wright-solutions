"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bg-gradient-secondary/95 backdrop-blur-sm border-b border-accent/20 sticky top-0 z-50 shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-accent rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient-primary font-serif group-hover:opacity-80 transition-opacity">
                Wright AI Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-foreground hover:text-accent transition-colors relative ${
                isActive("/") ? "text-accent font-medium" : ""
              }`}
            >
              Home
              {isActive("/") && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></div>
              )}
            </Link>
            <Link
              href="/services"
              className={`text-foreground hover:text-accent transition-colors relative ${
                isActive("/services") ? "text-accent font-medium" : ""
              }`}
            >
              Services
              {isActive("/services") && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></div>
              )}
            </Link>
            <Link
              href="/about"
              className={`text-foreground hover:text-accent transition-colors relative ${
                isActive("/about") ? "text-accent font-medium" : ""
              }`}
            >
              About
              {isActive("/about") && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></div>
              )}
            </Link>
            <Link
              href="/contact"
              className={`text-foreground hover:text-accent transition-colors relative ${
                isActive("/contact") ? "text-accent font-medium" : ""
              }`}
            >
              Contact
              {isActive("/contact") && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></div>
              )}
            </Link>
            <Button asChild className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
              <Link href="/contact">Get Your Free Consultation</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:bg-accent/10">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-primary/10 backdrop-blur-sm rounded-lg mt-2 border border-accent/20">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/")
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/services")
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/about")
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive("/contact")
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    Get Your Free Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
