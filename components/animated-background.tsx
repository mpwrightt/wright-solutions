"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      setIsVisible(true)
    }

    // Handle visibility change to pause animations when tab is not active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
      } else if (!prefersReducedMotion) {
        setIsVisible(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (!isVisible) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Optimized orbs - reduced from 6 to 3 */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-accent/20 rounded-full blur-2xl animate-pulse will-change-transform"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-32 h-32 bg-gradient-primary/15 rounded-full blur-xl animate-pulse will-change-transform"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-3/4 w-28 h-28 bg-gradient-secondary/15 rounded-full blur-lg animate-pulse will-change-transform"
          style={{ animationDuration: "10s", animationDelay: "4s" }}
        />
      </div>

      {/* Reduced particles from 30 to 12 */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse will-change-transform ${
              i % 3 === 0
                ? "w-2 h-2 bg-accent/30"
                : i % 3 === 1
                  ? "w-1.5 h-1.5 bg-primary/25"
                  : "w-1 h-1 bg-secondary/20"
            }`}
            style={{
              left: `${(i * 7 + 10) % 90}%`, // More predictable positioning
              top: `${(i * 11 + 15) % 85}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/10 to-primary/8 animate-pulse will-change-transform"
        style={{ animationDuration: "15s" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
               linear-gradient(rgba(var(--color-accent), 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(var(--color-accent), 0.3) 1px, transparent 1px)
             `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  )
}
