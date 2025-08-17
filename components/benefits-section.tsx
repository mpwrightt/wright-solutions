import { Card, CardContent } from "@/components/ui/card"
import { Check, User, Wrench, TrendingUp, Shield, MapPin } from "lucide-react"

const benefits = [
  {
    icon: User,
    title: "Solo Focus",
    description: "Direct access to an AI expert, no middlemen",
  },
  {
    icon: Wrench,
    title: "Custom Solutions",
    description: "Built specifically for your business needs",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Solutions that deliver measurable ROI",
  },
  {
    icon: Shield,
    title: "Ongoing Support",
    description: "Partnership that extends beyond deployment",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Based in New York, serving businesses nationwide",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary font-serif">Why Wright AI Solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the difference of working with a dedicated AI expert who understands your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-border bg-background/80 backdrop-blur-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <benefit.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-primary">{benefit.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
