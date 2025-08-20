"use client"

import { useState, useEffect, useRef } from 'react'

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  isThrottled: boolean
  gpuMemory?: number
  drawCalls?: number
  triangleCount?: number
  textureMemory?: number
  averageFps: number
  minFps: number
  maxFps: number
  performanceGrade: 'excellent' | 'good' | 'fair' | 'poor'
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    isThrottled: false,
    averageFps: 60,
    minFps: 60,
    maxFps: 60,
    performanceGrade: 'excellent'
  })
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])
  const rafId = useRef<number | undefined>(undefined)
  const performanceObserver = useRef<PerformanceObserver | undefined>(undefined)

  // GPU performance tracking
  const trackGPUPerformance = useRef<{
    drawCalls: number
    triangles: number
    lastReset: number
  }>({
    drawCalls: 0,
    triangles: 0,
    lastReset: performance.now()
  })

  useEffect(() => {
    let isActive = true

    // Set up Performance Observer for paint timing
    if ('PerformanceObserver' in window) {
      try {
        performanceObserver.current = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          // Track paint metrics for additional performance insights
          entries.forEach((entry) => {
            if (entry.entryType === 'paint' || entry.entryType === 'measure') {
              // Additional performance tracking could be added here
            }
          })
        })
        
        performanceObserver.current.observe({ entryTypes: ['paint', 'measure'] })
      } catch (e) {
        console.warn('Performance Observer not supported')
      }
    }

    const measurePerformance = () => {
      if (!isActive) return

      const now = performance.now()
      const deltaTime = now - lastTime.current
      
      frameCount.current++

      // Calculate FPS every 30 frames for more responsive updates
      if (frameCount.current % 30 === 0) {
        const currentFps = 1000 / deltaTime * 30
        fpsHistory.current.push(currentFps)
        
        // Keep only last 20 measurements for better averaging
        if (fpsHistory.current.length > 20) {
          fpsHistory.current.shift()
        }

        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        const minFps = Math.min(...fpsHistory.current)
        const maxFps = Math.max(...fpsHistory.current)
        
        // Check for performance throttling
        const isThrottled = avgFps < 45 && fpsHistory.current.length > 3

        // Memory usage tracking
        let memoryUsage = 0
        let gpuMemory: number | undefined
        let textureMemory: number | undefined
        
        if ('memory' in performance) {
          const memory = (performance as any).memory
          memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
          
          // Estimate GPU memory usage
          if (memory.totalJSHeapSize && memory.usedJSHeapSize) {
            const heapRatio = memory.usedJSHeapSize / memory.totalJSHeapSize
            gpuMemory = heapRatio * 256 // Rough estimate in MB
          }
        }

        // Performance grading based on FPS and stability
        let performanceGrade: 'excellent' | 'good' | 'fair' | 'poor'
        const fpsVariance = maxFps - minFps
        
        if (avgFps >= 55 && fpsVariance < 10) {
          performanceGrade = 'excellent'
        } else if (avgFps >= 45 && fpsVariance < 15) {
          performanceGrade = 'good'
        } else if (avgFps >= 30 && fpsVariance < 20) {
          performanceGrade = 'fair'
        } else {
          performanceGrade = 'poor'
        }

        // Get GPU tracking data
        const gpuData = trackGPUPerformance.current
        const timeSinceReset = now - gpuData.lastReset
        
        setMetrics({
          fps: Math.round(currentFps),
          frameTime: 1000 / currentFps,
          memoryUsage: Math.round(memoryUsage),
          isThrottled,
          gpuMemory: gpuMemory ? Math.round(gpuMemory) : undefined,
          drawCalls: gpuData.drawCalls,
          triangleCount: gpuData.triangles,
          textureMemory,
          averageFps: Math.round(avgFps),
          minFps: Math.round(minFps),
          maxFps: Math.round(maxFps),
          performanceGrade
        })

        // Reset GPU tracking every 5 seconds
        if (timeSinceReset > 5000) {
          trackGPUPerformance.current = {
            drawCalls: 0,
            triangles: 0,
            lastReset: now
          }
        }
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
      if (performanceObserver.current) {
        performanceObserver.current.disconnect()
      }
    }
  }, [])

  // Method to manually track GPU operations
  const trackGPUOperation = (drawCalls: number = 1, triangles: number = 0) => {
    trackGPUPerformance.current.drawCalls += drawCalls
    trackGPUPerformance.current.triangles += triangles
  }

  return { ...metrics, trackGPUOperation }
}

/**
 * Hook for 3D-specific performance monitoring
 */
export function use3DPerformanceMonitoring() {
  const baseMetrics = usePerformanceMonitoring()
  const [render3DMetrics, setRender3DMetrics] = useState({
    renderTime: 0,
    sceneComplexity: 0,
    lodLevel: 0,
    culledObjects: 0
  })

  const measureRenderTime = (callback: () => void) => {
    const start = performance.now()
    callback()
    const end = performance.now()
    
    setRender3DMetrics(prev => ({
      ...prev,
      renderTime: end - start
    }))
  }

  const updateSceneMetrics = (complexity: number, lodLevel: number, culledObjects: number) => {
    setRender3DMetrics(prev => ({
      ...prev,
      sceneComplexity: complexity,
      lodLevel,
      culledObjects
    }))
  }

  return {
    ...baseMetrics,
    render3DMetrics,
    measureRenderTime,
    updateSceneMetrics
  }
}

/**
 * Performance monitoring with automatic fallback triggers
 */
export function useAdaptivePerformanceMonitoring(options: {
  fpsThreshold?: number
  memoryThreshold?: number
  onPerformanceDrop?: (metrics: PerformanceMetrics) => void
  onPerformanceRecover?: (metrics: PerformanceMetrics) => void
} = {}) {
  const {
    fpsThreshold = 30,
    memoryThreshold = 500, // MB
    onPerformanceDrop,
    onPerformanceRecover
  } = options

  const metrics = usePerformanceMonitoring()
  const previousGrade = useRef<string>('')

  useEffect(() => {
    const currentGrade = metrics.performanceGrade
    
    // Trigger performance drop callback
    if ((currentGrade === 'poor' || currentGrade === 'fair') && 
        (previousGrade.current === 'excellent' || previousGrade.current === 'good' || previousGrade.current === '')) {
      onPerformanceDrop?.(metrics)
    }
    
    // Trigger performance recovery callback
    if ((currentGrade === 'excellent' || currentGrade === 'good') && 
        (previousGrade.current === 'poor' || previousGrade.current === 'fair')) {
      onPerformanceRecover?.(metrics)
    }
    
    previousGrade.current = currentGrade
  }, [metrics.performanceGrade, metrics, onPerformanceDrop, onPerformanceRecover])

  return {
    ...metrics,
    shouldFallback: metrics.fps < fpsThreshold || metrics.memoryUsage > memoryThreshold,
    performanceStatus: metrics.performanceGrade
  }
}