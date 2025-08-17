import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Brain,
  Target,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Wright AI Solutions - Free AI Consultation | Get Started Today",
  description: "Schedule your free 30-minute AI discovery call with Wright AI Solutions. Remote & on-site consultations available. Response within 24 hours. Transform your business with custom AI applications.",
  keywords: [
    "AI consultation",
    "free AI discovery call",
    "AI project inquiry",
    "custom AI development quote",
    "AI business consultation",
    "AI automation consultation",
    "machine learning consultation"
  ],
  openGraph: {
    title: "Contact Wright AI Solutions - Free AI Consultation | Get Started Today",
    description: "Schedule your free 30-minute AI discovery call. Remote & on-site consultations available. Response within 24 hours.",
    url: "https://wrightaisolutions.com/contact",
  },
  twitter: {
    title: "Contact Wright AI Solutions - Free AI Consultation",
    description: "Schedule your free 30-minute AI discovery call. Response within 24 hours.",
  },
  alternates: {
    canonical: "https://wrightaisolutions.com/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold font-serif">
              <span className="text-gradient-primary">Your Solution</span>
              <br />
              <span className="text-gradient-accent">W.A.S Here</span>
            </h1>
            <p className="text-xl text-accent font-semibold">Ready to Transform Your Business with AI?</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let&apos;s discuss your specific challenges and discover how custom AI solutions can drive real results for
              your business.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Priority Contact - Discovery Call */}
          <div className="mb-12">
            <Card className="bg-gradient-primary border-accent/30 shadow-2xl shadow-primary/25">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-accent rounded-full p-3">
                    <Calendar className="h-8 w-8 text-accent-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-primary-foreground">
                  Free Discovery Call - Your Problem W.A.S Meant to Be Solved
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  30-minute consultation to explore your AI opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-primary-foreground/80">30 Minutes</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-primary-foreground/80">Tailored Strategy</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-primary-foreground/80">No Obligation</p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        className="bg-primary-foreground/10 border-accent/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        className="bg-primary-foreground/10 border-accent/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Company Name"
                        className="bg-primary-foreground/10 border-accent/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      />
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger className="bg-primary-foreground/10 border-accent/30 text-primary-foreground">
                          <SelectValue placeholder="Preferred Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                          <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Briefly describe your biggest business challenge or AI opportunity..."
                    className="bg-primary-foreground/10 border-accent/30 text-primary-foreground placeholder:text-primary-foreground/60 min-h-[100px]"
                  />
                  <Button
                    size="lg"
                    className="w-full bg-gradient-accent hover:opacity-90 text-lg shadow-lg shadow-accent/25"
                  >
                    Schedule My Free Discovery Call
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Alternative Contact Methods */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Inquiry Form */}
            <Card className="bg-gradient-secondary border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl text-foreground">Project Inquiry</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Have a specific AI project in mind? Let&apos;s discuss the details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <Input placeholder="Your Name" className="bg-input border-border" />
                  <Input type="email" placeholder="Email Address" className="bg-input border-border" />
                  <Input placeholder="Company Name" className="bg-input border-border" />
                  <Select>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automation">Process Automation</SelectItem>
                      <SelectItem value="analytics">Data Analytics & Insights</SelectItem>
                      <SelectItem value="nlp">Natural Language Processing</SelectItem>
                      <SelectItem value="vision">Computer Vision</SelectItem>
                      <SelectItem value="prediction">Predictive Analytics</SelectItem>
                      <SelectItem value="custom">Custom AI Application</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                      <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Describe your project requirements and goals..."
                    className="bg-input border-border min-h-[120px]"
                  />
                  <Button className="w-full bg-gradient-accent hover:opacity-90">Submit Project Inquiry</Button>
                </form>
              </CardContent>
            </Card>

            {/* General Contact & Info */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card className="bg-gradient-secondary border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-accent" />
                    <CardTitle className="text-xl text-foreground">Quick Contact</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Get in touch for general questions or information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form className="space-y-4">
                    <Input placeholder="Your Name" className="bg-input border-border" />
                    <Input type="email" placeholder="Email Address" className="bg-input border-border" />
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Inquiry Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Information</SelectItem>
                        <SelectItem value="pricing">Pricing Questions</SelectItem>
                        <SelectItem value="timeline">Timeline & Availability</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Your message..." className="bg-input border-border min-h-[100px]" />
                    <Button className="w-full bg-primary hover:bg-primary/90">Send Message</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-secondary border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">hello@wrightaisolutions.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Remote & On-site Consultations</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-2">Response Times</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discovery Calls:</span>
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          Within 24 hours
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Inquiries:</span>
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          Within 48 hours
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">General Questions:</span>
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          Within 72 hours
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Overview */}
          <div className="mt-16">
            <Card className="bg-gradient-secondary border-accent/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gradient-accent">What Happens Next?</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your journey to AI transformation W.A.S designed to be simple and effective.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-foreground font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Discovery Call</h4>
                    <p className="text-sm text-muted-foreground">
                      We discuss your challenges and explore AI opportunities
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-foreground font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Custom Proposal</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a tailored solution plan with timeline and pricing
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-foreground font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Development</h4>
                    <p className="text-sm text-muted-foreground">
                      We build your custom AI solution with regular updates
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-foreground font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Launch & Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Deploy your solution and provide ongoing optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
