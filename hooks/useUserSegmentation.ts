'use client'

import { useState, useEffect, useCallback } from 'react'
import { trackPersonalizationEvents } from '@/lib/analytics'

export type UserSegment = 'enterprise' | 'individual' | 'unknown'
export type UserBehavior = 'technical_focused' | 'business_focused' | 'exploring'

export interface UserProfile {
  segment: UserSegment
  behavior: UserBehavior
  confidence: number
  visitCount: number
  timeOnSite: number
  interactionDepth: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  referrerType: 'search' | 'direct' | 'social' | 'referral' | 'unknown'
  primaryInterests: string[]
  sessionStartTime: number
}

export interface SegmentationData {
  // Page interaction patterns
  heroCtaClicks: number
  servicesViewTime: number
  threeDInteractions: number
  processStepViews: number
  faqEngagement: number
  
  // Technical signals
  scrollDepth: number
  timeToFirstInteraction: number
  mousePrecision: number
  clickPatterns: 'careful' | 'rapid' | 'exploring'
  
  // Content preferences
  technicalContentTime: number
  businessBenefitsTime: number
  casesStudyEngagement: number
}

const DEFAULT_PROFILE: UserProfile = {
  segment: 'unknown',
  behavior: 'exploring',
  confidence: 0,
  visitCount: 1,
  timeOnSite: 0,
  interactionDepth: 0,
  deviceType: 'desktop',
  referrerType: 'unknown',
  primaryInterests: [],
  sessionStartTime: Date.now()
}

export function useUserSegmentation() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [segmentationData, setSegmentationData] = useState<SegmentationData>({
    heroCtaClicks: 0,
    servicesViewTime: 0,
    threeDInteractions: 0,
    processStepViews: 0,
    faqEngagement: 0,
    scrollDepth: 0,
    timeToFirstInteraction: 0,
    mousePrecision: 0,
    clickPatterns: 'exploring',
    technicalContentTime: 0,
    businessBenefitsTime: 0,
    casesStudyEngagement: 0
  })

  // Initialize user profile from localStorage and detect device/referrer
  useEffect(() => {
    const initializeProfile = () => {
      // Load existing profile
      const stored = localStorage.getItem('was_user_profile')
      let profile = stored ? JSON.parse(stored) : { ...DEFAULT_PROFILE }
      
      // Update session data
      profile.visitCount = (profile.visitCount || 0) + 1
      profile.sessionStartTime = Date.now()
      
      // Detect device type
      const userAgent = navigator.userAgent.toLowerCase()
      profile.deviceType = 
        /mobile|android|iphone/.test(userAgent) ? 'mobile' :
        /tablet|ipad/.test(userAgent) ? 'tablet' : 'desktop'
      
      // Detect referrer type
      const referrer = document.referrer.toLowerCase()
      profile.referrerType = 
        referrer.includes('google') || referrer.includes('bing') ? 'search' :
        referrer.includes('linkedin') || referrer.includes('twitter') ? 'social' :
        referrer ? 'referral' : 'direct'
      
      setUserProfile(profile)
      localStorage.setItem('was_user_profile', JSON.stringify(profile))
    }

    initializeProfile()
  }, [])

  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setUserProfile(prev => {
        const updated = {
          ...prev,
          timeOnSite: Date.now() - prev.sessionStartTime
        }
        localStorage.setItem('was_user_profile', JSON.stringify(updated))
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // AI-powered segmentation algorithm
  const updateSegmentation = useCallback((data: Partial<SegmentationData>) => {
    setSegmentationData(prev => {
      const updated = { ...prev, ...data }
      
      // Calculate segment based on behavior patterns
      let newSegment: UserSegment = 'unknown'
      let newBehavior: UserBehavior = 'exploring'
      let confidence = 0
      
      // Enterprise indicators
      const enterpriseScore = 
        (updated.processStepViews > 2 ? 0.3 : 0) +
        (updated.businessBenefitsTime > 30000 ? 0.25 : 0) +
        (updated.scrollDepth > 0.8 ? 0.2 : 0) +
        (updated.clickPatterns === 'careful' ? 0.15 : 0) +
        (userProfile.deviceType === 'desktop' ? 0.1 : 0)
      
      // Individual developer indicators  
      const individualScore = 
        (updated.threeDInteractions > 3 ? 0.3 : 0) +
        (updated.technicalContentTime > 20000 ? 0.25 : 0) +
        (updated.mousePrecision > 0.7 ? 0.2 : 0) +
        (updated.timeToFirstInteraction < 5000 ? 0.15 : 0) +
        (userProfile.deviceType === 'mobile' ? 0.1 : 0)
      
      // Behavior classification
      if (updated.technicalContentTime > updated.businessBenefitsTime * 1.5) {
        newBehavior = 'technical_focused'
      } else if (updated.businessBenefitsTime > updated.technicalContentTime * 1.5) {
        newBehavior = 'business_focused'
      }
      
      // Segment classification with confidence
      if (enterpriseScore > individualScore && enterpriseScore > 0.4) {
        newSegment = 'enterprise'
        confidence = Math.min(enterpriseScore, 0.9)
      } else if (individualScore > 0.4) {
        newSegment = 'individual'
        confidence = Math.min(individualScore, 0.9)
      } else {
        newSegment = 'unknown'
        confidence = Math.max(enterpriseScore, individualScore)
      }
      
      // Update user profile with new insights
      setUserProfile(prev => {
        const updatedProfile = {
          ...prev,
          segment: newSegment,
          behavior: newBehavior,
          confidence,
          interactionDepth: Object.values(updated).reduce((sum: number, val: unknown) => 
            typeof val === 'number' ? sum + val : sum, 0
          ) / 100
        }
        
        // Track segment identification if it changed and confidence is high
        if (prev.segment !== newSegment && confidence > 0.6 && newSegment !== 'unknown') {
          trackPersonalizationEvents.segmentIdentified(newSegment, confidence)
        }
        
        localStorage.setItem('was_user_profile', JSON.stringify(updatedProfile))
        return updatedProfile
      })
      
      return updated
    })
  }, [userProfile.deviceType])

  // Tracking functions for different interactions
  const trackInteraction = {
    heroCtaClick: useCallback(() => updateSegmentation({ heroCtaClicks: segmentationData.heroCtaClicks + 1 }), [updateSegmentation, segmentationData.heroCtaClicks]),
    
    servicesView: useCallback((duration: number) => 
      updateSegmentation({ servicesViewTime: segmentationData.servicesViewTime + duration }), [updateSegmentation, segmentationData.servicesViewTime]),
    
    threeDInteraction: useCallback(() => 
      updateSegmentation({ threeDInteractions: segmentationData.threeDInteractions + 1 }), [updateSegmentation, segmentationData.threeDInteractions]),
    
    processStepView: useCallback(() => 
      updateSegmentation({ processStepViews: segmentationData.processStepViews + 1 }), [updateSegmentation, segmentationData.processStepViews]),
    
    faqEngagement: useCallback((engagement: number) => 
      updateSegmentation({ faqEngagement: segmentationData.faqEngagement + engagement }), [updateSegmentation, segmentationData.faqEngagement]),
    
    scrollProgress: useCallback((depth: number) => 
      updateSegmentation({ scrollDepth: Math.max(segmentationData.scrollDepth, depth) }), [updateSegmentation, segmentationData.scrollDepth]),
    
    firstInteraction: useCallback((time: number) => {
      if (segmentationData.timeToFirstInteraction === 0) {
        updateSegmentation({ timeToFirstInteraction: time })
      }
    }, [updateSegmentation, segmentationData.timeToFirstInteraction]),
    
    mouseMovement: useCallback((precision: number) => 
      updateSegmentation({ mousePrecision: Math.max(segmentationData.mousePrecision, precision) }), [updateSegmentation, segmentationData.mousePrecision]),
    
    clickPattern: useCallback((pattern: 'careful' | 'rapid' | 'exploring') => 
      updateSegmentation({ clickPatterns: pattern }), [updateSegmentation]),
    
    contentEngagement: useCallback((type: 'technical' | 'business', duration: number) => 
      updateSegmentation({
        [type === 'technical' ? 'technicalContentTime' : 'businessBenefitsTime']: 
          segmentationData[type === 'technical' ? 'technicalContentTime' : 'businessBenefitsTime'] + duration
      }), [updateSegmentation, segmentationData.technicalContentTime, segmentationData.businessBenefitsTime])
  }

  // Get personalized content recommendations
  const getPersonalizedContent = useCallback(() => {
    const { segment, behavior } = userProfile
    
    if (segment === 'enterprise') {
      return {
        heroMessage: behavior === 'technical_focused' 
          ? "Enterprise AI Solutions with Technical Excellence" 
          : "Transform Your Business with Enterprise AI Strategy",
        ctaPrimary: "Schedule Enterprise Consultation",
        ctaSecondary: "View Enterprise Solutions",
        focusAreas: ['ROI metrics', 'scalability', 'compliance', 'integration'],
        testimonialType: 'enterprise',
        caseStudyFocus: 'business_transformation'
      }
    } else if (segment === 'individual') {
      return {
        heroMessage: behavior === 'business_focused'
          ? "AI Tools That Accelerate Your Projects"
          : "Custom AI Development for Technical Teams",
        ctaPrimary: "Start Your AI Project", 
        ctaSecondary: "Explore Technical Docs",
        focusAreas: ['quick_implementation', 'developer_tools', 'documentation', 'support'],
        testimonialType: 'developer',
        caseStudyFocus: 'technical_implementation'
      }
    } else {
      return {
        heroMessage: "Custom AI Development & Machine Learning Consulting",
        ctaPrimary: "Schedule Free Discovery Call",
        ctaSecondary: "Learn More",
        focusAreas: ['versatility', 'expertise', 'custom_solutions'],
        testimonialType: 'mixed',
        caseStudyFocus: 'general'
      }
    }
  }, [userProfile])

  return {
    userProfile,
    segmentationData,
    trackInteraction,
    getPersonalizedContent,
    isSegmented: userProfile.confidence > 0.6
  }
}