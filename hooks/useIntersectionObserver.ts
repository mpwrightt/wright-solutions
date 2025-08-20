"use client"

import { useState, useEffect, useRef, RefObject, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  onEnter?: () => void
  onExit?: () => void
}

export interface IntersectionData {
  isIntersecting: boolean
  intersectionRatio: number
  boundingClientRect: DOMRectReadOnly | null
  isFullyVisible: boolean
  visibilityPercentage: number
}

/**
 * Enhanced intersection observer hook with advanced 3D rendering controls
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const handleIntersection = () => {
          const wasIntersecting = isIntersecting
          const nowIntersecting = entry.isIntersecting

          if (options.triggerOnce && hasTriggered.current) {
            return
          }

          setIsIntersecting(nowIntersecting)

          if (nowIntersecting && !wasIntersecting) {
            options.onEnter?.()
            if (options.triggerOnce) {
              hasTriggered.current = true
            }
          } else if (!nowIntersecting && wasIntersecting) {
            options.onExit?.()
          }
        }

        if (options.delay && options.delay > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(handleIntersection, options.delay)
        } else {
          handleIntersection()
        }
      },
      {
        threshold: options.threshold || 0.1,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(element)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      observer.unobserve(element)
    }
  }, [options.threshold, options.root, options.rootMargin, options.delay, options.triggerOnce])

  return [ref, isIntersecting]
}

/**
 * Advanced intersection observer with detailed visibility data
 */
export function useAdvancedIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, IntersectionData] {
  const [intersectionData, setIntersectionData] = useState<IntersectionData>({
    isIntersecting: false,
    intersectionRatio: 0,
    boundingClientRect: null,
    isFullyVisible: false,
    visibilityPercentage: 0
  })
  
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visibilityPercentage = Math.round(entry.intersectionRatio * 100)
        const isFullyVisible = entry.intersectionRatio >= 0.95

        setIntersectionData({
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
          isFullyVisible,
          visibilityPercentage
        })

        // Call callbacks based on visibility
        if (entry.isIntersecting && visibilityPercentage > 50) {
          options.onEnter?.()
        } else if (!entry.isIntersecting) {
          options.onExit?.()
        }
      },
      {
        threshold: options.threshold || [0, 0.25, 0.5, 0.75, 1],
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options.threshold, options.root, options.rootMargin])

  return [ref, intersectionData]
}

/**
 * 3D-optimized visibility hook with performance considerations
 */
export function use3DVisibilityObserver(options: {
  enableEagerLoading?: boolean
  visibilityThreshold?: number
  performanceLevel?: 'high' | 'medium' | 'low'
  onVisibilityChange?: (visible: boolean, ratio: number) => void
} = {}) {
  const {
    enableEagerLoading = false,
    visibilityThreshold = 0.3,
    performanceLevel = 'medium',
    onVisibilityChange
  } = options

  const [shouldRender3D, setShouldRender3D] = useState(enableEagerLoading)
  const [visibilityRatio, setVisibilityRatio] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // Performance-based threshold adjustments
  const getThreshold = useCallback(() => {
    const baseThreshold = visibilityThreshold
    
    switch (performanceLevel) {
      case 'high':
        return [0, baseThreshold * 0.5, baseThreshold, 1]
      case 'medium':
        return [0, baseThreshold, 1]
      case 'low':
        return [baseThreshold]
      default:
        return [baseThreshold]
    }
  }, [visibilityThreshold, performanceLevel])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio
        setVisibilityRatio(ratio)
        
        const shouldShow = entry.isIntersecting && ratio >= visibilityThreshold
        
        if (shouldShow !== shouldRender3D) {
          setShouldRender3D(shouldShow)
          onVisibilityChange?.(shouldShow, ratio)
        }
      },
      {
        threshold: getThreshold(),
        rootMargin: '50px' // Start loading slightly before visible
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [visibilityThreshold, performanceLevel, shouldRender3D, onVisibilityChange, getThreshold])

  return {
    ref,
    shouldRender3D,
    visibilityRatio,
    isFullyVisible: visibilityRatio >= 0.95
  }
}