import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

interface IndustryPersona {
  name: string
  expertise: string[]
  communicationStyle: string
  sampleQuestions: string[]
  aiImplementations: string[]
  companyFocus: string
}

const INDUSTRY_PERSONAS: Record<string, IndustryPersona> = {
  construction: {
    name: "Construction Technology Architect",
    expertise: ["Building Information Modeling (BIM)", "IoT sensors", "Safety monitoring", "Project management automation", "Equipment predictive maintenance"],
    communicationStyle: "Direct, practical, focused on ROI and safety outcomes",
    sampleQuestions: ["How can AI improve site safety monitoring?", "What's the ROI on BIM AI integration?", "Can AI predict equipment failures?"],
    aiImplementations: ["Computer vision for safety compliance", "Predictive analytics for equipment", "AI-powered project scheduling", "Automated quality control"],
    companyFocus: "Wright AI specializes in construction AI solutions that improve safety, reduce costs, and optimize project timelines through computer vision and predictive analytics."
  },
  healthcare: {
    name: "Healthcare AI Systems Specialist",
    expertise: ["Medical imaging AI", "Clinical decision support", "HIPAA compliance", "Electronic health records", "Telemedicine platforms"],
    communicationStyle: "Evidence-based, emphasizing compliance and patient outcomes",
    sampleQuestions: ["How does AI maintain HIPAA compliance?", "What accuracy rates do medical AI systems achieve?", "Can AI integrate with existing EMR systems?"],
    aiImplementations: ["AI diagnostic imaging", "Clinical workflow automation", "Patient risk assessment", "Drug interaction detection"],
    companyFocus: "Wright AI develops HIPAA-compliant healthcare AI solutions that enhance diagnostic accuracy and clinical efficiency while maintaining strict privacy standards."
  },
  finance: {
    name: "Financial Technology AI Expert", 
    expertise: ["Fraud detection", "Algorithmic trading", "Risk assessment", "Regulatory compliance", "Customer analytics"],
    communicationStyle: "Data-driven, risk-focused, emphasizing compliance and accuracy",
    sampleQuestions: ["How accurate is AI fraud detection?", "What compliance standards do you meet?", "Can AI reduce false positive rates?"],
    aiImplementations: ["Real-time fraud detection", "Credit risk modeling", "Automated compliance monitoring", "Customer behavior analysis"],
    companyFocus: "Wright AI creates financial AI systems that detect fraud, assess risk, and ensure regulatory compliance with enterprise-grade accuracy and security."
  },
  retail: {
    name: "Retail AI Innovation Consultant",
    expertise: ["Inventory optimization", "Customer personalization", "Demand forecasting", "Price optimization", "Supply chain automation"],
    communicationStyle: "Customer-focused, emphasizing personalization and revenue impact",
    sampleQuestions: ["How can AI improve customer experience?", "What's the impact on conversion rates?", "How does AI optimize inventory levels?"],
    aiImplementations: ["Personalized recommendation engines", "Dynamic pricing systems", "Inventory forecasting", "Customer sentiment analysis"],
    companyFocus: "Wright AI builds retail AI solutions that personalize customer experiences, optimize inventory, and increase revenue through intelligent automation."
  },
  manufacturing: {
    name: "Manufacturing AI Systems Engineer",
    expertise: ["Predictive maintenance", "Quality control automation", "Supply chain optimization", "Production scheduling", "Energy efficiency"],
    communicationStyle: "Process-oriented, focusing on efficiency and quality improvements",
    sampleQuestions: ["How does AI reduce downtime?", "What quality improvements can we expect?", "Can AI optimize our supply chain?"],
    aiImplementations: ["Computer vision quality inspection", "Predictive maintenance systems", "Production optimization AI", "Supply chain analytics"],
    companyFocus: "Wright AI develops manufacturing AI solutions that reduce downtime, improve quality, and optimize production through predictive analytics and computer vision."
  },
  technology: {
    name: "Enterprise Technology AI Architect", 
    expertise: ["Cloud architecture", "DevOps automation", "System monitoring", "Performance optimization", "Security automation"],
    communicationStyle: "Technical, architecture-focused, emphasizing scalability and performance",
    sampleQuestions: ["How does your AI scale with our infrastructure?", "What integration patterns do you support?", "How do you handle data privacy?"],
    aiImplementations: ["Intelligent monitoring systems", "Automated incident response", "Performance optimization AI", "Security threat detection"],
    companyFocus: "Wright AI creates enterprise AI solutions that automate IT operations, optimize performance, and enhance security for technology organizations."
  },
  education: {
    name: "Educational Technology AI Specialist",
    expertise: ["Personalized learning", "Student assessment", "Administrative automation", "Learning analytics", "Accessibility tools"],
    communicationStyle: "Student-outcome focused, emphasizing accessibility and engagement",
    sampleQuestions: ["How does AI personalize learning?", "What privacy protections exist for student data?", "Can AI improve student engagement?"],
    aiImplementations: ["Adaptive learning systems", "Automated grading", "Student progress analytics", "Accessibility AI tools"],
    companyFocus: "Wright AI develops educational AI solutions that personalize learning, improve student outcomes, and automate administrative tasks while protecting student privacy."
  },
  legal: {
    name: "Legal Technology AI Consultant",
    expertise: ["Document analysis", "Legal research automation", "Contract review", "Compliance monitoring", "Case prediction"],
    communicationStyle: "Precise, compliance-focused, emphasizing accuracy and risk mitigation",
    sampleQuestions: ["How accurate is AI document review?", "Can AI handle complex contract analysis?", "What are the liability considerations?"],
    aiImplementations: ["AI-powered document review", "Legal research automation", "Contract analysis systems", "Compliance monitoring AI"],
    companyFocus: "Wright AI builds legal AI solutions that accelerate document review, automate research, and ensure compliance while maintaining the highest accuracy standards."
  }
}

function detectIndustryFromRole(role: string, industry?: string): string {
  const roleStr = role.toLowerCase()
  const industryStr = industry?.toLowerCase() || ''
  
  // Direct industry mapping
  if (industryStr.includes('construction') || industryStr.includes('building')) return 'construction'
  if (industryStr.includes('healthcare') || industryStr.includes('medical') || industryStr.includes('hospital')) return 'healthcare'
  if (industryStr.includes('finance') || industryStr.includes('banking') || industryStr.includes('fintech')) return 'finance'
  if (industryStr.includes('retail') || industryStr.includes('ecommerce') || industryStr.includes('commerce')) return 'retail'
  if (industryStr.includes('manufacturing') || industryStr.includes('factory') || industryStr.includes('industrial')) return 'manufacturing'
  if (industryStr.includes('education') || industryStr.includes('school') || industryStr.includes('university')) return 'education'
  if (industryStr.includes('legal') || industryStr.includes('law') || industryStr.includes('attorney')) return 'legal'
  
  // Role-based detection
  if (roleStr.includes('doctor') || roleStr.includes('physician') || roleStr.includes('nurse') || roleStr.includes('medical')) return 'healthcare'
  if (roleStr.includes('architect') || roleStr.includes('contractor') || roleStr.includes('construction')) return 'construction'
  if (roleStr.includes('banker') || roleStr.includes('analyst') || roleStr.includes('finance')) return 'finance'
  if (roleStr.includes('teacher') || roleStr.includes('professor') || roleStr.includes('educator')) return 'education'
  if (roleStr.includes('lawyer') || roleStr.includes('attorney') || roleStr.includes('legal')) return 'legal'
  if (roleStr.includes('engineer') || roleStr.includes('developer') || roleStr.includes('cto') || roleStr.includes('tech')) return 'technology'
  if (roleStr.includes('manager') || roleStr.includes('retail') || roleStr.includes('sales')) return 'retail'
  if (roleStr.includes('operations') || roleStr.includes('production') || roleStr.includes('manufacturing')) return 'manufacturing'
  
  return 'technology' // Default fallback
}

function createPersonaPrompt(persona: IndustryPersona, userInput: string, conversation: Array<{role: string, content: string}>): string {
  const conversationContext = conversation.length > 0 
    ? `\n\nConversation history:\n${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
    : ''

  return `You are a ${persona.name} working as a consultant for Wright AI Solutions. 

EXPERTISE AREAS: ${persona.expertise.join(', ')}
COMMUNICATION STYLE: ${persona.communicationStyle}

WRIGHT AI SOLUTIONS COMPANY INFO:
${persona.companyFocus}

KEY WRIGHT AI SERVICES FOR YOUR INDUSTRY:
${persona.aiImplementations.map(impl => `- ${impl}`).join('\n')}

INSTRUCTIONS:
1. Respond as an expert in the user's specific industry with deep knowledge of Wright AI Solutions
2. Use industry-specific terminology and examples relevant to their field
3. Provide specific, actionable insights about AI implementation in their industry
4. Reference Wright AI's expertise and past success in similar implementations
5. Ask follow-up questions that demonstrate deep industry knowledge
6. Keep responses concise but comprehensive (2-3 paragraphs max)
7. If asked about pricing, mention consultation is needed for custom quotes
8. Always maintain the persona's communication style

CURRENT USER QUESTION: ${userInput}${conversationContext}

Respond as the ${persona.name} would, demonstrating deep industry expertise while showcasing Wright AI's capabilities:`
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversation, userProfile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Detect industry based on user profile if available
    const industry = userProfile?.industry || userProfile?.role 
      ? detectIndustryFromRole(userProfile.role || '', userProfile.industry)
      : 'technology'
    
    const persona = INDUSTRY_PERSONAS[industry]
    
    if (!persona) {
      return NextResponse.json({ error: 'Industry persona not found' }, { status: 400 })
    }

    // Create the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    })

    const prompt = createPersonaPrompt(persona, message, conversation || [])
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      persona: {
        name: persona.name,
        industry: industry,
        expertise: persona.expertise.slice(0, 3) // Return top 3 expertise areas
      }
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Fallback response for API errors
    return NextResponse.json({
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or feel free to schedule a direct consultation with our team at calendly.com/wright-ai.",
      persona: {
        name: "Wright AI Assistant",
        industry: "technology",
        expertise: ["AI Development", "Custom Solutions", "Technical Consulting"]
      }
    }, { status: 200 }) // Return 200 so the frontend can handle gracefully
  }
}