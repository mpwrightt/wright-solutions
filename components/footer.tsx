import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gradient-primary/90 backdrop-blur-sm border-t border-accent/20 shadow-2xl shadow-primary/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-accent rounded-lg p-2">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-400">Wright AI Solutions</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Custom AI applications that solve real business problems. Your solution W.A.S waiting to be built.
              </p>
              <div className="space-y-2 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-slate-400">Remote Consultations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="text-slate-400">Help@wright-solutions.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-slate-400">315-857-8157</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-400">AI Solutions</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                    Custom AI Development
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    Process Automation
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    Data Analytics & Insights
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    AI Integration Services
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    Strategy & Consulting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-400">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/about" className="hover:text-accent transition-colors flex items-center gap-1 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                    About Wright AI
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent transition-colors flex items-center gap-1 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent transition-colors flex items-center gap-1 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                    Partnership Opportunities
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-400">Ready to Get Started?</h4>
              <p className="text-sm leading-relaxed text-slate-400">
                Your AI transformation W.A.S just a conversation away.
              </p>
              <Button asChild className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
                <Link href="/contact" className="flex items-center gap-2">
                  Free Discovery Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="text-xs text-primary-foreground/60">
                <p className="text-slate-400">✓ 30-minute consultation</p>
                <p className="text-slate-400">✓ Custom solution roadmap</p>
                <p className="text-slate-400">✓ No obligation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2025 Wright AI Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <span className="text-slate-400">Your Problem W.A.S Solved</span>
              <div className="w-1 h-1 bg-accent rounded-full"></div>
              <span className="text-slate-400">AI Solutions That Actually Work</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
