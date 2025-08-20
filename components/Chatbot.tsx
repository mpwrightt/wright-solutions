'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send, Bot, Building, Code, Sparkles, Brain } from 'lucide-react'
import { useUserSegmentation } from '@/hooks/useUserSegmentation'
import { ChatIntakeForm } from '@/components/ChatIntakeForm'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  typing?: boolean
  persona?: {
    name: string
    industry: string
    expertise: string[]
  }
}

interface UserData {
  name: string
  email: string
  company: string
  industry: string
  role: string
}

interface ChatbotProps {
  className?: string
}

export function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showIntake, setShowIntake] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentPersona, setCurrentPersona] = useState<ChatMessage['persona'] | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { userProfile, trackInteraction } = useUserSegmentation()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  // Focus input when chatbot opens and intake is complete
  useEffect(() => {
    if (isOpen && !showIntake && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, showIntake])

  // Handle intake form completion
  const handleIntakeComplete = async (formData: UserData) => {
    setUserData(formData)
    setShowIntake(false)
    
    // Send initial welcome message with industry expert persona
    const welcomeMessage = `Hello ${formData.name}! I'm your dedicated AI consultant specializing in ${getIndustryDisplayName(formData.industry)} solutions. I understand the unique challenges and opportunities in your industry, and I'm here to help you explore how Wright AI Solutions can accelerate your ${formData.company}'s success.

Based on your role as ${getRoleDisplayName(formData.role)}, I can provide specific insights about AI implementations that will resonate with your technical and business objectives. What AI challenges or opportunities are you most interested in discussing?`

    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: welcomeMessage,
      timestamp: Date.now(),
      persona: {
        name: "AI Industry Expert",
        industry: formData.industry,
        expertise: ["AI Strategy", "Industry Solutions", "Technical Implementation"]
      }
    }

    setMessages([initialMessage])
    
    // Track user data for personalization
    trackInteraction.contentEngagement('business', 3000)
  }

  const handleIntakeSkip = () => {
    setShowIntake(false)
    
    // Default welcome message
    const welcomeMessage = `Hi! I'm the Wright AI Solutions assistant. I can help you understand our AI services, discuss technical solutions, or connect you with our experts. What would you like to know about AI development?`

    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: welcomeMessage,
      timestamp: Date.now()
    }

    setMessages([initialMessage])
  }

  // Call the Gemini-powered API
  const callGeminiAPI = async (userInput: string, conversation: ChatMessage[]): Promise<{ response: string; persona: ChatMessage['persona'] }> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userInput,
        conversation: conversation.slice(-6).map(msg => ({ // Send last 6 messages for context
          role: msg.role,
          content: msg.content
        })),
        userProfile: userData
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    return {
      response: data.response,
      persona: data.persona
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setHasInteracted(true)

    // Track chatbot interaction
    trackInteraction.contentEngagement('business', 5000)

    try {
      const { response, persona } = await callGeminiAPI(userMessage.content, messages)
      
      setCurrentPersona(persona)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        persona: persona
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or feel free to schedule a direct consultation with our team at calendly.com/wright-ai.",
        timestamp: Date.now()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Get industry display name
  const getIndustryDisplayName = (industry: string): string => {
    const industryMap: Record<string, string> = {
      'technology': 'Technology & Software',
      'healthcare': 'Healthcare & Medical',
      'finance': 'Finance & Banking',
      'construction': 'Construction & Engineering',
      'manufacturing': 'Manufacturing & Industrial',
      'retail': 'Retail & E-commerce',
      'education': 'Education & Training',
      'legal': 'Legal & Professional Services',
      'real_estate': 'Real Estate',
      'energy': 'Energy & Utilities',
      'transportation': 'Transportation & Logistics',
      'media': 'Media & Entertainment',
      'nonprofit': 'Non-profit & Government',
      'other': 'Other'
    }
    return industryMap[industry] || industry
  }

  // Get role display name
  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      'cto': 'CTO / Technical Director',
      'ceo': 'CEO / Founder',
      'engineering_manager': 'Engineering Manager',
      'product_manager': 'Product Manager',
      'developer': 'Software Developer',
      'architect': 'Solutions Architect',
      'data_scientist': 'Data Scientist',
      'operations': 'Operations Manager',
      'consultant': 'Consultant',
      'analyst': 'Business Analyst',
      'director': 'Director / VP',
      'other_tech': 'Other Technical Role',
      'other_business': 'Other Business Role'
    }
    return roleMap[role] || role
  }

  const getChatbotIcon = () => {
    if (currentPersona?.industry) {
      return <Brain className="h-5 w-5" />
    } else if (userProfile.segment === 'enterprise') {
      return <Building className="h-5 w-5" />
    } else if (userProfile.segment === 'individual') {
      return <Code className="h-5 w-5" />
    }
    return <Bot className="h-5 w-5" />
  }

  const getChatbotTitle = () => {
    if (currentPersona?.name) {
      return currentPersona.name
    } else if (userProfile.segment === 'enterprise') {
      return "Enterprise AI Assistant"
    } else if (userProfile.segment === 'individual') {
      return "Developer AI Assistant"
    }
    return "Wright AI Assistant"
  }

  const getChatbotSubtitle = () => {
    if (currentPersona?.industry) {
      return `${getIndustryDisplayName(currentPersona.industry)} Expert`
    }
    return null
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-accent shadow-lg hover:shadow-xl transition-all duration-300 z-[9999] ${isOpen ? 'hidden' : 'flex'} ${className}`}
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
        {!hasInteracted && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
        {currentPersona?.industry && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-accent rounded-full flex items-center justify-center">
            <Sparkles className="h-2 w-2 text-accent-foreground" />
          </div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-4 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] md:max-h-[calc(100vh-2rem)] bg-background border border-accent/20 rounded-2xl shadow-2xl z-[9999] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground">
                {getChatbotIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{getChatbotTitle()}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {getChatbotSubtitle() || "Online"}
                  {currentPersona?.industry && (
                    <Sparkles className="h-3 w-3 ml-1 text-accent" />
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                // Reset intake form if they close before completing
                if (showIntake) {
                  setShowIntake(true)
                }
              }}
              className="h-8 w-8 p-0 hover:bg-accent/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {showIntake ? (
              <ChatIntakeForm
                onComplete={handleIntakeComplete}
                onSkip={handleIntakeSkip}
              />
            ) : (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-accent text-accent-foreground ml-4'
                            : 'bg-accent/10 text-foreground mr-4'
                        }`}
                      >
                        {message.role === 'assistant' && message.persona && (
                          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                            {getChatbotIcon()}
                            <span>{message.persona.name}</span>
                            {message.persona.industry && (
                              <>
                                <span>•</span>
                                <span>{getIndustryDisplayName(message.persona.industry)}</span>
                                <Sparkles className="h-3 w-3 text-accent" />
                              </>
                            )}
                          </div>
                        )}
                        {message.role === 'assistant' && !message.persona && (
                          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                            {getChatbotIcon()}
                            <span>{getChatbotTitle()}</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-accent/10 text-foreground p-3 rounded-2xl mr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {currentPersona?.name || "AI"} is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0 p-4 border-t border-accent/20 bg-background">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        currentPersona?.industry 
                          ? `Ask about ${getIndustryDisplayName(currentPersona.industry)} AI solutions...`
                          : "Ask about AI solutions..."
                      }
                      className="flex-1 p-3 border border-accent/20 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-12 w-12 p-0 bg-gradient-accent hover:opacity-90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      Powered by Wright AI Solutions
                    </p>
                    {currentPersona?.expertise && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Brain className="h-3 w-3" />
                        <span>Industry Expert Mode</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}