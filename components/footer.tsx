"use client"

export function Footer() {
  return (
    <footer className="bg-gradient-primary/95 backdrop-blur-sm border-t border-accent/30 shadow-2xl shadow-primary/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Wright AI Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Export ScrollingQuotes as an alias for Footer to maintain compatibility
export const ScrollingQuotes = Footer
