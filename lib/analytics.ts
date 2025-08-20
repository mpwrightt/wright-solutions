// Analytics integration for AI personalization and conversion tracking
export interface ConversionEvent {
  event: string
  category: string
  label?: string
  value?: number
  user_segment?: string
  user_behavior?: string
  device_type?: string
}

export interface PersonalizationEvent {
  event: string
  segment: 'enterprise' | 'individual' | 'unknown'
  confidence: number
  interaction_type: string
  session_id?: string
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

class AnalyticsService {
  private isInitialized = false
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.userId = this.getUserId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('was_user_id') || null
  }

  private setUserId(userId: string): void {
    if (typeof window === 'undefined') return
    this.userId = userId
    localStorage.setItem('was_user_id', userId)
  }

  // Initialize analytics with user data
  initialize(userId?: string): void {
    if (this.isInitialized) return

    if (userId) {
      this.setUserId(userId)
    }

    // Initialize Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        session_id: this.sessionId,
        user_id: this.userId,
        custom_map: {
          custom_parameter_1: 'user_segment',
          custom_parameter_2: 'device_performance'
        }
      })
    }

    this.isInitialized = true
  }

  // Track conversion events (form submissions, CTA clicks, etc.)
  trackConversion(event: ConversionEvent): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.user_segment,
        custom_parameter_2: event.device_type,
        session_id: this.sessionId,
        user_id: this.userId
      })
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Conversion Event:', event)
    }

    // Could also send to other analytics providers here
    this.sendToCustomAnalytics('conversion', event)
  }

  // Track personalization events
  trackPersonalization(event: PersonalizationEvent): void {
    const analyticsEvent = {
      event: event.event,
      category: 'personalization',
      label: event.interaction_type,
      value: Math.round(event.confidence * 100),
      user_segment: event.segment,
      session_id: this.sessionId
    }

    this.trackConversion(analyticsEvent)

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Personalization Event:', event)
    }
  }

  // Track user engagement metrics
  trackEngagement(
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void {
    this.trackConversion({
      event: action,
      category,
      label,
      value
    })
  }

  // Track 3D interaction performance
  track3DPerformance(
    performanceLevel: 'high' | 'medium' | 'low',
    fps: number,
    interactionType: 'auto_load' | 'user_interaction' | 'fallback'
  ): void {
    this.trackConversion({
      event: '3d_performance',
      category: '3d_visualization',
      label: `${performanceLevel}_${interactionType}`,
      value: fps
    })
  }

  // Track AI chatbot interactions
  trackChatbotInteraction(
    action: 'open' | 'message_sent' | 'message_received' | 'close',
    userSegment?: string,
    messageType?: string
  ): void {
    this.trackConversion({
      event: 'chatbot_interaction',
      category: 'ai_features',
      label: `${action}_${messageType || 'unknown'}`,
      user_segment: userSegment
    })
  }

  // Track page performance metrics
  trackPerformance(metrics: {
    loadTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
  }): void {
    Object.entries(metrics).forEach(([metric, value]) => {
      this.trackConversion({
        event: 'performance_metric',
        category: 'web_vitals',
        label: metric,
        value: Math.round(value)
      })
    })
  }

  // Track form interactions
  trackFormInteraction(
    formName: string,
    action: 'start' | 'field_complete' | 'abandon' | 'submit',
    fieldName?: string
  ): void {
    this.trackConversion({
      event: 'form_interaction',
      category: 'conversion_funnel',
      label: `${formName}_${action}${fieldName ? `_${fieldName}` : ''}`
    })
  }

  // Send to custom analytics endpoint (for internal tracking)
  private async sendToCustomAnalytics(
    type: string,
    data: ConversionEvent | PersonalizationEvent
  ): Promise<void> {
    try {
      // Only in production and if endpoint is configured
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
          })
        })
      }
    } catch (error) {
      console.warn('[Analytics] Failed to send custom analytics:', error)
    }
  }

  // Get analytics session data
  getSessionData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      isInitialized: this.isInitialized
    }
  }
}

// Singleton instance
const analyticsService = new AnalyticsService()

export default analyticsService

// Convenience hooks for React components
export function useAnalytics() {
  return analyticsService
}

// Helper functions for common tracking scenarios
export const trackConversionFunnel = {
  landingPageView: () => analyticsService.trackConversion({
    event: 'page_view',
    category: 'conversion_funnel',
    label: 'landing_page'
  }),

  ctaClick: (ctaType: 'primary' | 'secondary', location: string) => 
    analyticsService.trackConversion({
      event: 'cta_click',
      category: 'conversion_funnel',
      label: `${ctaType}_${location}`
    }),

  formStart: (formName: string) => 
    analyticsService.trackFormInteraction(formName, 'start'),

  formSubmit: (formName: string) => 
    analyticsService.trackFormInteraction(formName, 'submit'),

  contactAttempt: (method: 'form' | 'phone' | 'email' | 'chat') =>
    analyticsService.trackConversion({
      event: 'contact_attempt',
      category: 'conversion_funnel',
      label: method
    })
}

export const trackPersonalizationEvents = {
  segmentIdentified: (segment: 'enterprise' | 'individual', confidence: number) =>
    analyticsService.trackPersonalization({
      event: 'segment_identified',
      segment,
      confidence,
      interaction_type: 'behavior_analysis'
    }),

  adaptiveContentShown: (segment: 'enterprise' | 'individual', contentType: string) =>
    analyticsService.trackPersonalization({
      event: 'adaptive_content_shown',
      segment,
      confidence: 1,
      interaction_type: contentType
    }),

  chatbotPersonalized: (segment: 'enterprise' | 'individual') =>
    analyticsService.trackPersonalization({
      event: 'chatbot_personalized',
      segment,
      confidence: 1,
      interaction_type: 'chatbot_response'
    })
}