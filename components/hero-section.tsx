"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Neural3DLoader } from "@/components/Neural3DLoader"
import { AdaptiveHeroContent, AdaptiveTrustIndicators, AdaptiveServiceHighlights } from "@/components/AdaptiveContent"
import { useInteractionTracking } from "@/hooks/useInteractionTracking"

export function HeroSection() {
  const { trackCtaClick } = useInteractionTracking()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/2 via-transparent to-primary/2"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Adaptive Hero Content with fallback */}
              <AdaptiveHeroContent
                fallback={
                  <>
                    <h1 className="text-4xl lg:text-6xl font-bold font-serif leading-tight">
                      <span className="text-gradient-primary">Custom AI Development</span>
                      <br />
                      <span className="text-foreground">& Machine Learning</span>
                      <br />
                      <span className="text-gradient-accent">Consulting</span>
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-accent hover:opacity-90 text-lg px-8 shadow-lg shadow-accent/25"
                        onClick={() => trackCtaClick('primary')}
                      >
                        <Link href="/contact" className="flex items-center gap-2">
                          Schedule Free Discovery Call
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 border-accent/50 hover:bg-accent/10 hover:border-accent bg-transparent"
                        onClick={() => trackCtaClick('secondary')}
                      >
                        <Link href="/services">Learn More</Link>
                      </Button>
                    </div>
                  </>
                }
              />
              
              <p className="text-xl text-accent font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Your AI Solution W.A.S Here The Whole Time
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transform your business with custom AI applications, intelligent process automation, and advanced data analytics. Our expert AI consulting services deliver measurable ROI through tailored machine learning solutions designed specifically for your challenges.
              </p>
            </div>

            {/* Adaptive Trust Indicators */}
            <AdaptiveTrustIndicators />

            {/* Personalized Service Highlights */}
            <AdaptiveServiceHighlights />
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-primary rounded-2xl p-8 flex items-center justify-center shadow-2xl shadow-primary/25 border border-accent/20">
              {/* Progressive 3D/SVG Neural Network */}
              <Neural3DLoader />
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
              AI Powered
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
              Custom Built
            </div>
            <div className="absolute top-1/2 -left-6 bg-gradient-secondary border border-accent/30 text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              W.A.S Here
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
