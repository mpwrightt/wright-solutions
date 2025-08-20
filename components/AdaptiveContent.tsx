'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useUserSegmentation } from '@/hooks/useUserSegmentation'
import { trackPersonalizationEvents } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building, Code, Sparkles, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface AdaptiveContentProps {
  children?: ReactNode
  fallback?: ReactNode
  className?: string
}

export function AdaptiveHeroContent({ children, fallback, className }: AdaptiveContentProps) {
  const { userProfile, getPersonalizedContent, isSegmented } = useUserSegmentation()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<ReturnType<typeof getPersonalizedContent> | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isSegmented || userProfile.visitCount > 1) {
      const personalizedContent = getPersonalizedContent()
      setContent(personalizedContent)
      
      // Track when adaptive content is shown
      if (userProfile.segment !== 'unknown') {
        trackPersonalizationEvents.adaptiveContentShown(userProfile.segment, 'hero_content')
      }
    }
  }, [isSegmented, userProfile.visitCount, userProfile.segment, getPersonalizedContent])

  if (!mounted || !content) {
    return <>{fallback || children}</>
  }

  const getSegmentIcon = () => {
    switch (userProfile.segment) {
      case 'enterprise': return <Building className="h-5 w-5" />
      case 'individual': return <Code className="h-5 w-5" />
      default: return <Sparkles className="h-5 w-5" />
    }
  }

  const getSegmentBadge = () => {
    if (userProfile.segment === 'enterprise') {
      return (
        <div className="inline-flex items-center gap-2 bg-gradient-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Building className="h-4 w-4" />
          Enterprise Solutions
        </div>
      )
    } else if (userProfile.segment === 'individual') {
      return (
        <div className="inline-flex items-center gap-2 bg-gradient-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Code className="h-4 w-4" />
          Developer Tools
        </div>
      )
    }
    return null
  }

  return (
    <div className={className}>
      {getSegmentBadge()}
      <h1 className="text-4xl lg:text-6xl font-bold font-serif leading-tight">
        <span className="text-gradient-primary">{content.heroMessage}</span>
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          asChild
          size="lg"
          className="bg-gradient-accent hover:opacity-90 text-lg px-8 shadow-lg shadow-accent/25"
        >
          <Link href="/contact" className="flex items-center gap-2">
            {getSegmentIcon()}
            {content.ctaPrimary}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="text-lg px-8 border-accent/50 hover:bg-accent/10 hover:border-accent bg-transparent"
        >
          <Link href="/services">{content.ctaSecondary}</Link>
        </Button>
      </div>
    </div>
  )
}

export function AdaptiveTrustIndicators() {
  const { userProfile } = useUserSegmentation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-6 pt-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <span className="text-sm text-muted-foreground">AI Expert</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          <span className="text-sm text-muted-foreground">Custom Solutions</span>
        </div>
      </div>
    )
  }

  const getTrustIndicators = () => {
    if (userProfile.segment === 'enterprise') {
      return [
        { icon: <Building className="h-5 w-5 text-accent" />, text: "Enterprise Ready" },
        { icon: <Users className="h-5 w-5 text-accent" />, text: "Fortune 500 Trusted" },
        { icon: <Zap className="h-5 w-5 text-accent" />, text: "Scalable Solutions" }
      ]
    } else if (userProfile.segment === 'individual') {
      return [
        { icon: <Code className="h-5 w-5 text-accent" />, text: "Developer Friendly" },
        { icon: <Sparkles className="h-5 w-5 text-accent" />, text: "Quick Integration" },
        { icon: <Zap className="h-5 w-5 text-accent" />, text: "Open Source Tools" }
      ]
    } else {
      return [
        { icon: <Zap className="h-5 w-5 text-accent" />, text: "AI Expert" },
        { icon: <Users className="h-5 w-5 text-accent" />, text: "Custom Solutions" },
        { icon: <Sparkles className="h-5 w-5 text-accent" />, text: "Proven Results" }
      ]
    }
  }

  const indicators = getTrustIndicators()

  return (
    <div className="flex items-center gap-6 pt-4">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center gap-2">
          {indicator.icon}
          <span className="text-sm text-muted-foreground">{indicator.text}</span>
        </div>
      ))}
    </div>
  )
}

export function AdaptiveServiceHighlights() {
  const { userProfile, getPersonalizedContent, isSegmented } = useUserSegmentation()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<ReturnType<typeof getPersonalizedContent> | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isSegmented || userProfile.visitCount > 1) {
      setContent(getPersonalizedContent())
      
      // Track service highlights shown
      if (userProfile.segment !== 'unknown') {
        trackPersonalizationEvents.adaptiveContentShown(userProfile.segment, 'service_highlights')
      }
    }
  }, [isSegmented, userProfile.visitCount, userProfile.segment, getPersonalizedContent])

  if (!mounted || !content) {
    return null
  }

  const getHighlightedServices = () => {
    if (userProfile.segment === 'enterprise') {
      return [
        {
          title: "Enterprise AI Strategy",
          description: "End-to-end AI transformation with ROI tracking and compliance assurance",
          icon: <Building className="h-6 w-6" />
        },
        {
          title: "Scalable ML Operations",
          description: "Production-ready ML pipelines with enterprise monitoring and governance",
          icon: <Users className="h-6 w-6" />
        }
      ]
    } else if (userProfile.segment === 'individual') {
      return [
        {
          title: "Rapid AI Development",
          description: "Fast-track your AI projects with developer-friendly tools and frameworks",
          icon: <Code className="h-6 w-6" />
        },
        {
          title: "Custom AI Models",
          description: "Tailored machine learning solutions with comprehensive documentation",
          icon: <Sparkles className="h-6 w-6" />
        }
      ]
    } else {
      return []
    }
  }

  const highlights = getHighlightedServices()

  if (highlights.length === 0) return null

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 rounded-xl border border-accent/20">
      <h3 className="text-lg font-semibold mb-4 text-center">Recommended for You</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {highlights.map((service, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              {service.icon}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{service.title}</h4>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Debug component for development
export function UserSegmentationDebug() {
  const { userProfile, segmentationData, isSegmented } = useUserSegmentation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-40">
      <h4 className="font-bold mb-2">User Segmentation Debug</h4>
      <div className="space-y-1">
        <div><strong>Segment:</strong> {userProfile.segment}</div>
        <div><strong>Behavior:</strong> {userProfile.behavior}</div>
        <div><strong>Confidence:</strong> {(userProfile.confidence * 100).toFixed(1)}%</div>
        <div><strong>Is Segmented:</strong> {isSegmented ? 'Yes' : 'No'}</div>
        <div><strong>Visit Count:</strong> {userProfile.visitCount}</div>
        <div><strong>Device:</strong> {userProfile.deviceType}</div>
        <div><strong>3D Interactions:</strong> {segmentationData.threeDInteractions}</div>
        <div><strong>Scroll Depth:</strong> {(segmentationData.scrollDepth * 100).toFixed(1)}%</div>
      </div>
    </div>
  )
}