"use client"

import { useState, useEffect, useRef } from 'react'

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  isThrottled: boolean
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    isThrottled: false
  })
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    let isActive = true

    const measurePerformance = () => {
      if (!isActive) return

      const now = performance.now()
      const deltaTime = now - lastTime.current
      
      frameCount.current++

      // Calculate FPS every 60 frames
      if (frameCount.current % 60 === 0) {
        const fps = 1000 / deltaTime * 60
        fpsHistory.current.push(fps)
        
        // Keep only last 10 measurements
        if (fpsHistory.current.length > 10) {
          fpsHistory.current.shift()
        }

        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        
        // Check for performance throttling
        const isThrottled = avgFps < 45 && fpsHistory.current.length > 3

        // Memory usage (if available)
        let memoryUsage = 0
        if ('memory' in performance) {
          const memory = (performance as any).memory
          memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        }

        setMetrics({
          fps: Math.round(avgFps),
          frameTime: 1000 / avgFps,
          memoryUsage: Math.round(memoryUsage),
          isThrottled
        })
      }

      lastTime.current = now
      rafId.current = requestAnimationFrame(measurePerformance)
    }

    rafId.current = requestAnimationFrame(measurePerformance)

    return () => {
      isActive = false
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return metrics
}