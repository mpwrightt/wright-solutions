import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Lightbulb, Code, Rocket, HeadphonesIcon } from "lucide-react"

const processSteps = [
  {
    icon: Search,
    title: "Discovery",
    description: "Understanding your unique challenges and identifying the perfect AI solution for your needs.",
  },
  {
    icon: Lightbulb,
    title: "Design",
    description: "Architecting the perfect AI solution with detailed planning and technical specifications.",
  },
  {
    icon: Code,
    title: "Development",
    description: "Building and testing your custom application with cutting-edge AI technologies.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Implementing your solution and training your team for seamless adoption.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description: "Ongoing optimization and maintenance to ensure continued success and growth.",
  },
]

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary font-serif">How Your Solution W.A.S Created</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven 5-step process that ensures your AI solution delivers real business value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="text-center border-border bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-lg font-semibold text-primary">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
