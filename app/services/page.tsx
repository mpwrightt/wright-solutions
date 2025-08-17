import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  Cog,
  BarChart3,
  Puzzle,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Zap,
  Shield,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Services - Custom Development, Automation & Analytics | Wright AI Solutions",
  description: "Comprehensive AI services including custom application development, process automation, data analytics, AI integration, and strategic consulting. Transform your business with expert AI solutions.",
  keywords: [
    "AI development services",
    "custom AI applications",
    "AI process automation",
    "AI data analytics",
    "machine learning consulting",
    "AI integration services",
    "business AI solutions",
    "predictive analytics services"
  ],
  openGraph: {
    title: "AI Services - Custom Development, Automation & Analytics | Wright AI Solutions",
    description: "Comprehensive AI services including custom application development, process automation, data analytics, AI integration, and strategic consulting.",
    url: "https://wrightaisolutions.com/services",
  },
  twitter: {
    title: "AI Services - Custom Development, Automation & Analytics",
    description: "Comprehensive AI services including custom application development, process automation, data analytics, AI integration, and strategic consulting.",
  },
  alternates: {
    canonical: "https://wrightaisolutions.com/services",
  },
}

const services = [
  {
    id: "ai-development",
    icon: Brain,
    title: "MVP AI Application Development",
    subtitle: "Custom AI Solutions Built for Your Business",
    description:
      "Transform your business processes with custom AI applications designed specifically for your unique challenges and requirements.",
    features: [
      "Machine Learning Model Development",
      "Natural Language Processing Solutions",
      "Computer Vision Applications",
      "Predictive Analytics Systems",
      "Custom AI Algorithms",
      "API Integration & Development",
    ],
    benefits: [
      "Solve complex business problems automatically",
      "Reduce manual processing time by 80%+",
      "Improve decision-making with data insights",
      "Scale operations without proportional cost increases",
    ],
    timeline: "8-12 weeks",
    investment: "Starting at $35,000",
    deliverables: [
      "Custom AI application tailored to your needs",
      "Complete source code and documentation",
      "Training and deployment support",
      "3 months of optimization and support",
    ],
  },
  {
    id: "automation",
    icon: Cog,
    title: "Process Automation",
    subtitle: "Intelligent Automation That Works Around the Clock",
    description:
      "Streamline your operations with smart automation solutions that handle repetitive tasks, freeing your team to focus on high-value work.",
    features: [
      "Workflow Automation Design",
      "Document Processing Automation",
      "Email & Communication Automation",
      "Data Entry & Validation Systems",
      "Report Generation Automation",
      "Integration with Existing Tools",
    ],
    benefits: [
      "Eliminate repetitive manual tasks",
      "Reduce human error by 95%+",
      "24/7 automated processing",
      "Immediate ROI through time savings",
    ],
    timeline: "2-8 weeks",
    investment: "Starting at $15,000",
    deliverables: [
      "Automated workflow systems",
      "Integration with your existing tools",
      "Process documentation and training",
      "Ongoing monitoring and optimization",
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Data Analytics & Insights",
    subtitle: "Turn Your Data Into Competitive Advantage",
    description:
      "Unlock the hidden value in your data with advanced analytics, predictive modeling, and intelligent reporting systems.",
    features: [
      "Advanced Data Analysis",
      "Predictive Modeling & Forecasting",
      "Interactive Dashboard Development",
      "Real-time Analytics Systems",
      "Custom Reporting Solutions",
      "Data Visualization & Storytelling",
    ],
    benefits: [
      "Make data-driven decisions with confidence",
      "Predict trends and opportunities",
      "Identify cost-saving opportunities",
      "Improve customer insights and targeting",
    ],
    timeline: "3-10 weeks",
    investment: "Starting at $12,000",
    deliverables: [
      "Custom analytics dashboard",
      "Predictive models and forecasts",
      "Automated reporting systems",
      "Training on data interpretation",
    ],
  },
  {
    id: "integration",
    icon: Puzzle,
    title: "AI Integration",
    subtitle: "Seamlessly Add AI to Your Existing Systems",
    description:
      "Enhance your current software and workflows with AI capabilities without disrupting your established processes.",
    features: [
      "Legacy System AI Enhancement",
      "API Development & Integration",
      "Cloud Platform Integration",
      "Database Optimization for AI",
      "Security & Compliance Implementation",
      "Performance Monitoring & Scaling",
    ],
    benefits: [
      "Enhance existing systems without replacement",
      "Minimal disruption to current operations",
      "Gradual AI adoption at your pace",
      "Maximize existing technology investments",
    ],
    timeline: "2-6 weeks",
    investment: "Starting at $10,000",
    deliverables: [
      "AI-enhanced existing systems",
      "Seamless integration architecture",
      "Migration and testing support",
      "Performance optimization",
    ],
  },
  {
    id: "consulting",
    icon: Users,
    title: "Consulting & Strategy",
    subtitle: "Expert Guidance for Your AI Journey",
    description:
      "Get strategic direction and expert advice on AI implementation, technology selection, and digital transformation planning.",
    features: [
      "AI Readiness Assessment",
      "Technology Stack Recommendations",
      "Implementation Roadmap Development",
      "ROI Analysis & Business Case",
      "Team Training & Change Management",
      "Ongoing Strategic Advisory",
    ],
    benefits: [
      "Clear roadmap for AI implementation",
      "Avoid costly technology mistakes",
      "Build internal AI capabilities",
      "Accelerate time-to-value",
    ],
    timeline: "1-4 weeks",
    investment: "Starting at $5,000",
    deliverables: [
      "Comprehensive AI strategy document",
      "Implementation roadmap and timeline",
      "Technology recommendations",
      "Team training and support plan",
    ],
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold font-serif">
              <span className="text-gradient-primary">AI Solutions</span>
              <br />
              <span className="text-foreground">That W.A.S</span>
              <br />
              <span className="text-gradient-accent">Made for You</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive AI services designed to solve your specific business challenges. From custom development to
              strategic consulting, your perfect solution W.A.S waiting to be discovered.
            </p>
            <Button asChild size="lg" className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
              <Link href="/contact" className="flex items-center gap-2">
                Schedule Your Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/25">
                        <service.icon className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gradient-primary font-serif">{service.title}</h2>
                        <p className="text-lg text-accent font-semibold">{service.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">What&apos;s Included</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">Key Benefits</h3>
                    <div className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
                    <Link href="/contact" className="flex items-center gap-2">
                      Get Started with {service.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Service Details Card */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <Card className="bg-gradient-secondary border-accent/20 shadow-2xl shadow-primary/25">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">Project Details</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        What you can expect when working with us
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Timeline */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                          <Clock className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Timeline</p>
                          <p className="text-sm text-muted-foreground">{service.timeline}</p>
                        </div>
                      </div>

                      {/* Investment */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                          <DollarSign className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Investment</p>
                          <p className="text-sm text-muted-foreground">{service.investment}</p>
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-accent" />
                          <p className="font-semibold text-foreground">What You&apos;ll Receive</p>
                        </div>
                        <ul className="space-y-2">
                          {service.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-muted-foreground">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-accent/50 hover:bg-accent/10 hover:border-accent bg-transparent"
                        >
                          <Link href="/contact">Schedule Free Discovery Call</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 bg-gradient-secondary relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif">
              <span className="text-gradient-accent">How Every Project</span>
              <br />
              <span className="text-gradient-primary">W.A.S Delivered</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our proven methodology ensures successful outcomes for every AI implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-gradient-primary border-accent/30 shadow-2xl shadow-primary/25">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/25">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl text-primary-foreground">Discovery & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/80">
                  We start with a deep dive into your business challenges, goals, and technical requirements to design
                  the perfect solution.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-primary border-accent/30 shadow-2xl shadow-primary/25">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/25">
                  <Zap className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl text-primary-foreground">Development & Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/80">
                  Agile development with regular check-ins, ensuring your solution meets expectations and delivers real
                  value.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-primary border-accent/30 shadow-2xl shadow-primary/25">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/25">
                  <Shield className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl text-primary-foreground">Deployment & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/80">
                  Seamless deployment with comprehensive training and ongoing support to ensure long-term success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-10 left-20 w-80 h-80 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif">
              <span className="text-gradient-primary">Ready to Transform</span>
              <br />
              <span className="text-gradient-accent">Your Business?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Every successful AI project starts with a conversation. Let&apos;s discuss how we can solve your specific
              challenges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-accent hover:opacity-90 shadow-lg shadow-accent/25">
              <Link href="/contact" className="flex items-center gap-2">
                Schedule Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent/50 hover:bg-accent/10 hover:border-accent bg-transparent"
            >
              <Link href="/about">Learn About Our Expertise</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            <Badge variant="secondary" className="px-4 py-2 bg-accent/20 text-accent border-accent/30">
              Free 30-min consultation
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-accent/20 text-accent border-accent/30">
              No obligation
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-accent/20 text-accent border-accent/30">
              Expert guidance
            </Badge>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
