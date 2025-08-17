import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Award, BookOpen, Brain, Code, Lightbulb, Target, Users } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Wright AI Solutions - Expert AI Consultant & Developer",
  description: "Meet the AI expert behind Wright AI Solutions. 5+ years in tech, 10+ AI projects. Specializing in custom AI applications, machine learning, and business process automation.",
  keywords: [
    "AI consultant",
    "AI expert",
    "machine learning developer",
    "AI business solutions",
    "custom AI development",
    "AI automation expert",
    "business intelligence consultant"
  ],
  openGraph: {
    title: "About Wright AI Solutions - Expert AI Consultant & Developer",
    description: "Meet the AI expert behind Wright AI Solutions. 5+ years in tech, 10+ AI projects. Specializing in custom AI applications and business automation.",
    url: "https://wrightaisolutions.com/about",
  },
  twitter: {
    title: "About Wright AI Solutions - Expert AI Consultant & Developer",
    description: "Meet the AI expert behind Wright AI Solutions. 5+ years in tech, 10+ AI projects",
  },
  alternates: {
    canonical: "https://wrightaisolutions.com/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold font-serif">
              <span className="text-gradient-primary">Meet the Mind</span>
              <br />
              <span className="text-foreground">Behind W.A.S</span>
            </h1>
            <p className="text-xl text-accent font-semibold">Where Artificial Intelligence Meets Real Solutions</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transforming complex business challenges into elegant AI solutions, one custom application at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Professional Photo & Quick Stats */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-gradient-primary rounded-2xl p-8 text-center shadow-2xl shadow-primary/25 border border-accent/20">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent/30 bg-gradient-accent flex items-center justify-center">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="text-accent-foreground">
                      <circle cx="32" cy="24" r="12" fill="currentColor" opacity="0.8" />
                      <path d="M32 40c-8 0-16 4-16 8v4h32v-4c0-4-8-8-16-8z" fill="currentColor" opacity="0.8" />
                      <circle cx="24" cy="20" r="2" fill="currentColor" opacity="0.6" />
                      <circle cx="40" cy="20" r="2" fill="currentColor" opacity="0.6" />
                      <circle cx="20" cy="30" r="1.5" fill="currentColor" opacity="0.4" />
                      <circle cx="44" cy="30" r="1.5" fill="currentColor" opacity="0.4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">AI Solutions Expert</h3>
                  <p className="text-primary-foreground/80 text-sm">Turning &quot;What if?&quot; into &quot;What W.A.S&quot;</p>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-secondary rounded-xl p-6 border border-accent/20">
                  <h4 className="font-semibold text-foreground mb-4">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Code className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">5+ Years in Tech</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">10+ AI Projects</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Industry Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Bio Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Story */}
              <div className="bg-gradient-secondary rounded-xl p-8 border border-accent/20">
                <h2 className="text-2xl font-bold text-gradient-accent mb-6 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6" />
                  The Journey to W.A.S
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    My journey into AI wasn&apos;t planned it W.A.S discovered. What started as curiosity about machine
                    learning during my computer science studies evolved into a passion for solving real-world problems
                    with artificial intelligence.
                  </p>
                  <p>
                    As a hobbyist coder, I&apos;ve seen how frustrating it can be when people get bogged down by repetitive tasks and data overload. This made it clear to me that the best way to help is by building custom AI applications that are specifically designed to solve these problems, rather than relying on one-size-fits-all tools.
                  </p>
                  <p>
                    Today, Wright AI Solutions exists because every business deserves AI that W.A.S built specifically
                    for them. No cookie-cutter solutions, no one-size-fits-all approaches just intelligent systems that
                    understand your unique challenges and deliver measurable results.
                  </p>
                </div>
              </div>

              {/* Expertise Areas */}
              <div className="bg-gradient-secondary rounded-xl p-8 border border-accent/20">
                <h2 className="text-2xl font-bold text-gradient-accent mb-6 flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  Core Expertise
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Technical Skills</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Machine Learning & Deep Learning</li>
                      <li>• Natural Language Processing</li>
                      <li>• Computer Vision & Image Analysis</li>
                      <li>• Predictive Analytics & Forecasting</li>
                      <li>• Process Automation & Optimization</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Business Focus</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Custom AI Application Development</li>
                      <li>• Business Process Analysis</li>
                      <li>• ROI-Focused Implementation</li>
                      <li>• Team Training & Knowledge Transfer</li>
                      <li>• Ongoing Support & Optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mission & Values */}
              <div className="bg-gradient-secondary rounded-xl p-8 border border-accent/20">
                <h2 className="text-2xl font-bold text-gradient-accent mb-6 flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Mission & Values
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To democratize AI by making custom, intelligent solutions accessible to businesses of all sizes.
                      Every challenge W.A.S meant to be solved we just need to build the right tool for the job.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-accent/10">
                      <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground text-sm">Transparency</h4>
                      <p className="text-xs text-muted-foreground mt-1">Clear communication, honest timelines</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-accent/10">
                      <Target className="h-8 w-8 text-accent mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground text-sm">Results-Driven</h4>
                      <p className="text-xs text-muted-foreground mt-1">Measurable outcomes, real ROI</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-accent/10">
                      <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                      <h4 className="font-semibold text-foreground text-sm">Partnership</h4>
                      <p className="text-xs text-muted-foreground mt-1">Your success is our success</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-primary rounded-xl p-8 text-center border border-accent/20 shadow-2xl shadow-primary/25">
                <h2 className="text-2xl font-bold text-primary-foreground mb-4">
                  Ready to Discover What W.A.S Possible?
                </h2>
                <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                  Let&apos;s discuss your specific challenges and explore how custom AI can transform your business
                  operations.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-accent hover:opacity-90 text-lg px-8 shadow-lg shadow-accent/25"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    Schedule Your Discovery Call
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
