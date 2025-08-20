"use client"

import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useDevicePerformance } from '@/hooks/useDevicePerformance'
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring'
import { useInteractionTracking } from '@/hooks/useInteractionTracking'

// Lazy load the 3D component
const Brain3D = lazy(() => 
  import('./Brain3D').then(module => ({
    default: module.Brain3D
  }))
)

// Error boundary for 3D component
class Neural3DErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('3D rendering failed, falling back to SVG:', error)
    // Optional: Send telemetry data
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).gtag('event', 'exception', {
        description: '3D_render_fallback',
        fatal: false
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Loading skeleton for 3D component
function Neural3DSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Animated loading indicator */}
        <div className="w-24 h-24 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-accent opacity-20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// SVG fallback component (existing SVG from hero)
function SVGNeuralNetwork() {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nodeGradient2D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(var(--color-accent), 0.8)" />
          <stop offset="100%" stopColor="rgba(var(--color-primary), 0.6)" />
        </linearGradient>
        <linearGradient id="connectionGradient2D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(var(--color-accent), 0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      
      {/* Network Connections */}
      <g opacity="0.6">
        <line x1="100" y1="100" x2="200" y2="150" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="200" y1="150" x2="300" y2="100" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="300" y1="100" x2="350" y2="200" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="350" y1="200" x2="300" y2="300" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="300" y1="300" x2="200" y2="320" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="200" y1="320" x2="100" y2="280" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="100" y1="280" x2="50" y2="200" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="50" y1="200" x2="100" y2="100" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="200" y1="150" x2="200" y2="200" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="200" y1="200" x2="200" y2="320" stroke="url(#connectionGradient2D)" strokeWidth="2" />
        <line x1="100" y1="100" x2="300" y2="100" stroke="url(#connectionGradient2D)" strokeWidth="1" />
        <line x1="50" y1="200" x2="350" y2="200" stroke="url(#connectionGradient2D)" strokeWidth="1" />
      </g>
      
      {/* Network Nodes */}
      <g>
        <circle cx="100" cy="100" r="12" fill="url(#nodeGradient2D)" opacity="0.9" />
        <circle cx="200" cy="150" r="16" fill="url(#nodeGradient2D)" opacity="1" />
        <circle cx="300" cy="100" r="12" fill="url(#nodeGradient2D)" opacity="0.9" />
        <circle cx="350" cy="200" r="10" fill="url(#nodeGradient2D)" opacity="0.8" />
        <circle cx="300" cy="300" r="12" fill="url(#nodeGradient2D)" opacity="0.9" />
        <circle cx="200" cy="320" r="14" fill="url(#nodeGradient2D)" opacity="0.9" />
        <circle cx="100" cy="280" r="10" fill="url(#nodeGradient2D)" opacity="0.8" />
        <circle cx="50" cy="200" r="10" fill="url(#nodeGradient2D)" opacity="0.8" />
        <circle cx="200" cy="200" r="20" fill="url(#nodeGradient2D)" opacity="1" />
      </g>
      
      {/* Central AI Brain */}
      <g transform="translate(200, 200)">
        <circle r="25" fill="none" stroke="rgba(var(--color-accent), 0.6)" strokeWidth="2" strokeDasharray="5,5" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" values="0;360" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle r="15" fill="rgba(var(--color-accent), 0.2)" stroke="rgba(var(--color-accent), 0.8)" strokeWidth="2" />
        <text textAnchor="middle" dy="0.3em" fontSize="10" fill="rgba(var(--color-accent), 0.9)" fontWeight="bold">AI</text>
      </g>
      
      {/* Floating Data Points */}
      <g opacity="0.6">
        <circle cx="80" cy="60" r="3" fill="rgba(var(--color-accent), 0.7)">
          <animate attributeName="cy" values="60;80;60" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="70" r="2" fill="rgba(var(--color-accent), 0.7)">
          <animate attributeName="cy" values="70;50;70" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="160" r="2" fill="rgba(var(--color-accent), 0.7)">
          <animate attributeName="cx" values="380;360;380" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="250" r="3" fill="rgba(var(--color-accent), 0.7)">
          <animate attributeName="cy" values="250;270;250" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

// Main progressive loader component
export function Neural3DLoader() {
  const [shouldLoad3D, setShouldLoad3D] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [fallbackTo2D, setFallbackTo2D] = useState(false)
  const [ref, inView] = useIntersectionObserver({ threshold: 0.3 })
  const performanceLevel = useDevicePerformance()
  const performanceMetrics = usePerformanceMonitoring()
  const { track3DInteraction } = useInteractionTracking()

  // Performance monitoring - fallback to 2D if performance drops
  useEffect(() => {
    if (shouldLoad3D && performanceMetrics.isThrottled && performanceMetrics.fps < 30) {
      console.warn('3D performance degraded, falling back to 2D')
      setFallbackTo2D(true)
      setShouldLoad3D(false)
      
      // Optional: Send telemetry
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).gtag('event', 'performance_fallback', {
          event_category: '3D_rendering',
          event_label: `fps_${performanceMetrics.fps}`,
          value: performanceMetrics.fps
        })
      }
    }
  }, [shouldLoad3D, performanceMetrics])

  // Progressive loading strategy
  useEffect(() => {
    if (!inView || fallbackTo2D) return

    // Only load 3D for high performance devices initially
    if (performanceLevel === 'high') {
      const timer = setTimeout(() => {
        setShouldLoad3D(true)
      }, 1500) // Delay to prioritize critical content

      return () => clearTimeout(timer)
    }
  }, [inView, performanceLevel, fallbackTo2D])

  // Load 3D on user interaction for medium performance devices
  const handleInteraction = () => {
    if (!hasInteracted && performanceLevel !== 'low' && !fallbackTo2D) {
      setHasInteracted(true)
      setShouldLoad3D(true)
      track3DInteraction() // Track user interaction with 3D content
    }
  }

  // Determine which component to render
  const renderVisualization = () => {
    // Always use SVG for low performance devices or after fallback
    if (performanceLevel === 'low' || fallbackTo2D) {
      return <SVGNeuralNetwork />
    }

    // For medium performance, show interaction hint
    if (performanceLevel === 'medium' && !shouldLoad3D) {
      return (
        <div 
          className="relative cursor-pointer group"
          onClick={handleInteraction}
          onMouseEnter={handleInteraction}
        >
          <SVGNeuralNetwork />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
            <div className="text-center">
              <div className="text-accent font-semibold mb-2">✨ Interactive 3D Available</div>
              <div className="text-sm text-accent/80">Click to activate</div>
            </div>
          </div>
        </div>
      )
    }

    // Show 3D component
    if (shouldLoad3D) {
      return (
        <Neural3DErrorBoundary fallback={<SVGNeuralNetwork />}>
          <Suspense fallback={<Neural3DSkeleton />}>
            <Brain3D modelPath="/models/ann-model.glb" />
          </Suspense>
        </Neural3DErrorBoundary>
      )
    }

    // Default to SVG
    return <SVGNeuralNetwork />
  }

  return (
    <div 
      ref={ref} 
      className="w-full h-full"
      role="img"
      aria-label="Interactive AI Neural Network Visualization"
      aria-describedby="neural-network-description"
    >
      {renderVisualization()}
      
      {/* Screen reader description */}
      <div 
        id="neural-network-description" 
        className="sr-only"
      >
        {shouldLoad3D 
          ? "Interactive 3D Artificial Neural Network (ANN) model showing interconnected nodes and layers representing machine learning architecture. The model features realistic materials and lighting with dynamic animations."
          : "AI neural network diagram showing interconnected nodes representing artificial intelligence and machine learning systems."
        }
      </div>
      
      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && shouldLoad3D && (
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {performanceLevel} | {performanceMetrics.fps}fps
        </div>
      )}
      
      {/* Model Attribution - ANN model by M.E on Sketchfab */}
      {shouldLoad3D && (
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground opacity-60">
          <a 
            href="https://sketchfab.com/3d-models/artificial-neural-network-ann-8400016f745643a4b25a57dd0bde04ab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity"
            title="Artificial Neural Network by M.E on Sketchfab"
          >
            3D Model © M.E
          </a>
        </div>
      )}
    </div>
  )
}