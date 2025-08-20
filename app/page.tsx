import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { BenefitsSection } from "@/components/benefits-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/Chatbot"
import { UserSegmentationDebug } from "@/components/AdaptiveContent"

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <BenefitsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      
      {/* AI Personalization Features */}
      <Chatbot />
      <UserSegmentationDebug />
    </main>
  )
}
