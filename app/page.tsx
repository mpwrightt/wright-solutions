import { LockInDisplay } from "@/components/hero-section"
import { ScrollingQuotes } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen relative flex flex-col">
      <LockInDisplay />
      <ScrollingQuotes />
    </main>
  )
}
