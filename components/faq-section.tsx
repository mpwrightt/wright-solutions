"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { SchemaMarkup } from "@/components/schema-markup"

const faqs = [
  {
    question: "What types of AI solutions does Wright AI Solutions develop?",
    answer: "We specialize in custom AI applications including machine learning models, natural language processing solutions, computer vision applications, predictive analytics systems, and intelligent process automation. Our solutions are tailored specifically to your business challenges and requirements.",
    keywords: ["AI solutions", "machine learning", "custom AI applications", "predictive analytics"]
  },
  {
    question: "How long does it take to develop a custom AI application?",
    answer: "Development timelines vary based on complexity and requirements. Simple process automation projects typically take 2-8 weeks, while comprehensive AI applications usually require 8-12 weeks. We provide detailed timelines during our discovery phase and maintain regular communication throughout the project.",
    keywords: ["AI development timeline", "custom AI development", "project timeline"]
  },
  {
    question: "What is the cost of custom AI development services?",
    answer: "Our AI solutions start at $5,000 for strategic consulting, with process automation beginning at $15,000 and comprehensive custom applications starting at $35,000. Final pricing depends on project complexity, required features, and integration needs. We provide transparent pricing after understanding your specific requirements.",
    keywords: ["AI development cost", "AI consulting pricing", "custom AI pricing"]
  },
  {
    question: "Do you provide ongoing support after AI implementation?",
    answer: "Yes, we include 3 months of optimization and support with every custom AI project. We also offer ongoing maintenance packages, performance monitoring, and system updates to ensure your AI solution continues to deliver optimal results as your business grows.",
    keywords: ["AI support", "AI maintenance", "ongoing AI optimization"]
  },
  {
    question: "Can AI solutions integrate with our existing business systems?",
    answer: "Absolutely! We specialize in seamless AI integration with existing software, databases, and workflows. Our approach ensures minimal disruption to your current operations while maximizing the value of your existing technology investments.",
    keywords: ["AI integration", "system integration", "legacy system AI enhancement"]
  },
  {
    question: "What industries does Wright AI Solutions serve?",
    answer: "We work with businesses across various industries including healthcare, finance, manufacturing, retail, logistics, and professional services. Our custom approach means we can develop AI solutions for virtually any industry with specific business challenges that can benefit from intelligent automation.",
    keywords: ["AI for healthcare", "AI for finance", "AI for manufacturing", "business AI solutions"]
  },
  {
    question: "How do you ensure AI solutions deliver measurable ROI?",
    answer: "We begin every project with a comprehensive ROI analysis and establish clear success metrics. Our solutions are designed to deliver tangible benefits such as time savings, error reduction, cost optimization, and improved decision-making. We track these metrics throughout implementation and provide ongoing performance reports.",
    keywords: ["AI ROI", "measurable AI results", "AI performance metrics"]
  },
  {
    question: "Do you provide training for our team to use AI solutions?",
    answer: "Yes, comprehensive training and knowledge transfer are included with every project. We ensure your team understands how to use, maintain, and optimize the AI solutions we develop. We also provide documentation and ongoing support to build internal AI capabilities.",
    keywords: ["AI training", "team training", "AI knowledge transfer"]
  }
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqSchema = faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))

  return (
    <section className="py-20 relative overflow-hidden">
      <SchemaMarkup type="faq" data={{ faqs: faqSchema }} />
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-accent" />
            <h2 className="text-3xl lg:text-4xl font-bold font-serif">
              <span className="text-gradient-primary">Frequently Asked</span>
              <br />
              <span className="text-gradient-accent">Questions</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our AI development services, pricing, timelines, and implementation process.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-gradient-secondary border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground text-left pr-4">
                    {faq.question}
                  </CardTitle>
                  <div className="flex-shrink-0">
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-accent" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-accent" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {openItems.includes(index) && (
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-primary border-accent/30 shadow-2xl shadow-primary/25">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">
                Still Have Questions?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Schedule a free consultation to discuss your specific AI needs and get personalized answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-accent hover:opacity-90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/25 transition-opacity"
              >
                Schedule Free Consultation
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}