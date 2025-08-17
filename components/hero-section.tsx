"use client"

import { useEffect, useState } from "react"
import { Target, Zap, Clock } from "lucide-react"

export function LockInDisplay() {
  const [currentTime, setCurrentTime] = useState("")
  const [pulseClass, setPulseClass] = useState("animate-pulse")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    // Pulse effect
    const pulseTimer = setInterval(() => {
      setPulseClass("animate-pulse scale-105")
      setTimeout(() => setPulseClass("animate-pulse"), 200)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(pulseTimer)
    }
  }, [])

  return (
    <section className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Time Display */}
        <div className="text-2xl md:text-3xl font-mono text-accent font-bold tracking-wider">
          {currentTime}
        </div>

        {/* Main Lock In Message */}
        <div className={`transition-all duration-200 ${pulseClass}`}>
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black font-serif leading-none tracking-tight text-shadow-lg">
            <span className="text-gradient-primary block text-shadow-glow">LOCK</span>
            <span className="text-gradient-accent block -mt-4 md:-mt-8 text-shadow-glow">IN</span>
          </h1>
        </div>

        {/* Motivational tagline */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl text-accent font-bold flex items-center justify-center gap-3">
            <Target className="h-6 w-6 md:h-8 md:w-8" />
            FOCUS. EXECUTE. DOMINATE.
            <Target className="h-6 w-6 md:h-8 md:w-8" />
          </p>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-lg font-semibold">ENERGY HIGH</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-lg font-semibold">TIME NOW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
