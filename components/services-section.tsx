"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Cog, BarChart3, Puzzle, Users } from "lucide-react"
import { useRef } from "react"
import { useIntersectionTracking } from "@/hooks/useInteractionTracking"

const services = [
  {
    icon: Brain,
    title: "Custom AI Application Development",
    description: "Tailored machine learning solutions and AI applications built specifically for your business challenges. From predictive analytics to intelligent automation systems.",
  },
  {
    icon: Cog,
    title: "Intelligent Process Automation",
    description: "AI-powered automation solutions that streamline operations, reduce manual work by 80%+, and eliminate human error in repetitive tasks.",
  },
  {
    icon: BarChart3,
    title: "Advanced Data Analytics & AI",
    description: "Transform raw data into competitive advantage with machine learning models, predictive analytics, and intelligent business intelligence systems.",
  },
  {
    icon: Puzzle,
    title: "Enterprise AI Integration",
    description: "Seamlessly integrate AI capabilities into existing business systems and workflows without disrupting current operations or requiring system replacement.",
  },
  {
    icon: Users,
    title: "AI Strategy & Consulting",
    description: "Expert AI consulting services including technology roadmaps, implementation strategies, and ROI analysis to accelerate your AI transformation.",
  },
]

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useIntersectionTracking(sectionRef, 'services')

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-serif">
            <span className="text-gradient-primary">AI Development Services</span>
            <br />
            <span className="text-gradient-accent">That Drive Results</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From custom AI application development to intelligent automation and predictive analytics - comprehensive machine learning solutions designed to solve your specific business challenges and deliver measurable ROI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-background/80 backdrop-blur-sm border-accent/20 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-accent/25">
                  <service.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
