"use client"

import { useState, useEffect } from 'react'

export type PerformanceLevel = 'high' | 'medium' | 'low'

export function useDevicePerformance(): PerformanceLevel {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('high')

  useEffect(() => {
    let level: PerformanceLevel = 'high'

    // Check for WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    
    if (!gl) {
      setPerformanceLevel('low')
      return
    }

    // Check GPU renderer info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      if (renderer && typeof renderer === 'string') {
        // Detect integrated graphics
        if (renderer.toLowerCase().includes('intel') || 
            renderer.toLowerCase().includes('integrated')) {
          level = 'medium'
        }
      }
    }

    // Check device memory (if available)
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory
      if (memory < 4) {
        level = 'low'
      } else if (memory < 8 && level === 'high') {
        level = 'medium'
      }
    }

    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection?.effectiveType === '2g' || connection?.effectiveType === '3g') {
        level = 'low'
      }
    }

    // Check if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile && level === 'high') {
      level = 'medium'
    }

    // Battery level consideration (experimental API)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2) {
          setPerformanceLevel('low')
        } else {
          setPerformanceLevel(level)
        }
      }).catch(() => {
        setPerformanceLevel(level)
      })
    } else {
      setPerformanceLevel(level)
    }

    // Cleanup canvas
    canvas.remove()
  }, [])

  return performanceLevel
}