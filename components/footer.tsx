"use client"

import { useEffect, useState } from "react"

const motivationalQuotes = [
  "SUCCESS IS THE SUM OF SMALL EFFORTS REPEATED DAY IN AND DAY OUT",
  "THE ONLY IMPOSSIBLE JOURNEY IS THE ONE YOU NEVER BEGIN",
  "EXCELLENCE IS NOT A SKILL, IT'S AN ATTITUDE",
  "CHAMPIONS KEEP PLAYING UNTIL THEY GET IT RIGHT",
  "THE DIFFERENCE BETWEEN ORDINARY AND EXTRAORDINARY IS THAT LITTLE EXTRA",
  "SUCCESS IS NOT FINAL, FAILURE IS NOT FATAL: IT IS THE COURAGE TO CONTINUE THAT COUNTS",
  "DON'T WATCH THE CLOCK; DO WHAT IT DOES. KEEP GOING",
  "THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR DREAMS",
  "HARD WORK BEATS TALENT WHEN TALENT DOESN'T WORK HARD",
  "YOUR LIMITATION—IT'S ONLY YOUR IMAGINATION",
  "PUSH YOURSELF, BECAUSE NO ONE ELSE IS GOING TO DO IT FOR YOU",
  "GREAT THINGS NEVER COME FROM COMFORT ZONES",
  "DREAM IT. WISH IT. DO IT",
  "SUCCESS DOESN'T JUST FIND YOU. YOU HAVE TO GO OUT AND GET IT",
  "THE HARDER YOU WORK FOR SOMETHING, THE GREATER YOU'LL FEEL WHEN YOU ACHIEVE IT",
  "DREAM BIGGER. DO BIGGER",
  "DON'T STOP WHEN YOU'RE TIRED. STOP WHEN YOU'RE DONE",
  "WAKE UP WITH DETERMINATION. GO TO BED WITH SATISFACTION",
  "DO SOMETHING TODAY THAT YOUR FUTURE SELF WILL THANK YOU FOR",
  "LITTLE THINGS MAKE BIG THINGS HAPPEN"
]

export function ScrollingQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
    }, 4000) // Change quote every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-gradient-primary/95 backdrop-blur-sm border-t border-accent/30 shadow-2xl shadow-primary/25">
      <div className="relative overflow-hidden py-6">
        {/* Scrolling text container */}
        <div className="flex animate-scroll-right whitespace-nowrap">
          <div className="flex items-center gap-16 px-8">
            {/* Repeat the quote multiple times for seamless scroll */}
            {Array.from({ length: 3 }).map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex items-center gap-16">
                <span className="text-2xl md:text-3xl lg:text-4xl font-black tracking-wider text-gradient-accent text-shadow-lg">
                  {motivationalQuotes[currentQuoteIndex]}
                </span>
                <span className="text-accent text-2xl md:text-3xl">•</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient overlay to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none"></div>
      </div>
    </footer>
  )
}

// Export Footer as an alias for ScrollingQuotes to maintain compatibility
export const Footer = ScrollingQuotes
