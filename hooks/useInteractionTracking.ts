'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useUserSegmentation } from './useUserSegmentation'

export function useInteractionTracking() {
  const { trackInteraction } = useUserSegmentation()
  const scrollStartTime = useRef<number>(0)
  const sectionTimes = useRef<Record<string, number>>({})
  const mouseMovements = useRef<Array<{ x: number; y: number; time: number }>>([])
  const clickTimes = useRef<number[]>([])
  const firstInteractionTracked = useRef<boolean>(false)

  // Track first user interaction
  const trackFirstInteraction = useCallback(() => {
    if (!firstInteractionTracked.current) {
      firstInteractionTracked.current = true
      trackInteraction.firstInteraction(Date.now())
    }
  }, [trackInteraction])

  // Track scroll depth and speed
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollDepth = Math.min(scrollTop / documentHeight, 1)
          
          trackInteraction.scrollProgress(scrollDepth)
          trackFirstInteraction()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackInteraction, trackFirstInteraction])

  // Track mouse movement patterns to determine user type
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      mouseMovements.current.push({ x: e.clientX, y: e.clientY, time: now })
      
      // Keep only last 50 movements for performance
      if (mouseMovements.current.length > 50) {
        mouseMovements.current = mouseMovements.current.slice(-50)
      }
      
      // Calculate precision every 10 movements
      if (mouseMovements.current.length % 10 === 0) {
        const precision = calculateMousePrecision()
        trackInteraction.mouseMovement(precision)
      }

      trackFirstInteraction()
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [trackInteraction, trackFirstInteraction])

  // Track click patterns
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      clickTimes.current.push(now)
      
      // Keep only last 10 clicks
      if (clickTimes.current.length > 10) {
        clickTimes.current = clickTimes.current.slice(-10)
      }
      
      // Analyze click pattern
      if (clickTimes.current.length >= 3) {
        const intervals = []
        for (let i = 1; i < clickTimes.current.length; i++) {
          intervals.push(clickTimes.current[i] - clickTimes.current[i - 1])
        }
        
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
        const pattern = 
          avgInterval < 500 ? 'rapid' :
          avgInterval > 2000 ? 'careful' : 'exploring'
        
        trackInteraction.clickPattern(pattern)
      }

      trackFirstInteraction()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [trackInteraction, trackFirstInteraction])

  // Calculate mouse movement precision (higher = more deliberate/enterprise user)
  const calculateMousePrecision = useCallback(() => {
    if (mouseMovements.current.length < 10) return 0
    
    const movements = mouseMovements.current.slice(-10)
    let totalDistance = 0
    let directDistance = 0
    
    for (let i = 1; i < movements.length; i++) {
      const dx = movements[i].x - movements[i - 1].x
      const dy = movements[i].y - movements[i - 1].y
      totalDistance += Math.sqrt(dx * dx + dy * dy)
    }
    
    const firstPoint = movements[0]
    const lastPoint = movements[movements.length - 1]
    const dx = lastPoint.x - firstPoint.x
    const dy = lastPoint.y - firstPoint.y
    directDistance = Math.sqrt(dx * dx + dy * dy)
    
    // Precision ratio: direct/total (1 = perfectly straight, 0 = very winding)
    return directDistance / Math.max(totalDistance, 1)
  }, [])

  // Section visibility tracking
  const trackSectionView = useCallback((sectionId: string) => {
    const startTime = Date.now()
    sectionTimes.current[sectionId] = startTime

    return () => {
      const endTime = Date.now()
      const duration = endTime - sectionTimes.current[sectionId]
      
      switch (sectionId) {
        case 'services':
          trackInteraction.servicesView(duration)
          break
        case 'process':
          trackInteraction.processStepView()
          break
        case 'faq':
          // Engagement score based on time spent
          const engagementScore = Math.min(duration / 10000, 1) // 10s = full engagement
          trackInteraction.faqEngagement(engagementScore)
          break
      }
      
      // Track content type engagement
      if (sectionId === 'services' || sectionId === 'process') {
        trackInteraction.contentEngagement('technical', duration)
      } else if (sectionId === 'benefits' || sectionId === 'cta') {
        trackInteraction.contentEngagement('business', duration)
      }
    }
  }, [trackInteraction])

  // 3D interaction tracking
  const track3DInteraction = useCallback(() => {
    trackInteraction.threeDInteraction()
    trackFirstInteraction()
  }, [trackInteraction, trackFirstInteraction])

  // CTA click tracking
  const trackCtaClick = useCallback((ctaType: 'primary' | 'secondary') => {
    if (ctaType === 'primary') {
      trackInteraction.heroCtaClick()
    }
    trackFirstInteraction()
  }, [trackInteraction, trackFirstInteraction])

  return {
    trackSectionView,
    track3DInteraction,
    trackCtaClick,
    trackFirstInteraction
  }
}

// Hook for intersection observer with section tracking
export function useIntersectionTracking(ref: React.RefObject<HTMLElement | null>, sectionId: string) {
  const { trackSectionView } = useInteractionTracking()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const cleanup = trackSectionView(sectionId)
          
          // Return cleanup function after element leaves viewport
          const exitObserver = new IntersectionObserver(
            ([exitEntry]) => {
              if (!exitEntry.isIntersecting && cleanup) {
                cleanup()
                exitObserver.disconnect()
              }
            },
            { threshold: 0 }
          )
          
          exitObserver.observe(element)
        }
      },
      { 
        threshold: 0.5, // Track when 50% visible
        rootMargin: '-50px' // Only when actually in focus area
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, sectionId, trackSectionView])
}