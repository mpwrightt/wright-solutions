'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, User, Mail, Briefcase } from 'lucide-react'

interface UserData {
  name: string
  email: string
  company: string
  industry: string
  role: string
}

interface ChatIntakeFormProps {
  onComplete: (userData: UserData) => void
  onSkip: () => void
}

const INDUSTRIES = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'construction', label: 'Construction & Engineering' },
  { value: 'manufacturing', label: 'Manufacturing & Industrial' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education & Training' },
  { value: 'legal', label: 'Legal & Professional Services' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'nonprofit', label: 'Non-profit & Government' },
  { value: 'other', label: 'Other' }
]

const ROLES = [
  { value: 'cto', label: 'CTO / Technical Director' },
  { value: 'ceo', label: 'CEO / Founder' },
  { value: 'engineering_manager', label: 'Engineering Manager' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'developer', label: 'Software Developer' },
  { value: 'architect', label: 'Solutions Architect' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'operations', label: 'Operations Manager' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'analyst', label: 'Business Analyst' },
  { value: 'director', label: 'Director / VP' },
  { value: 'other_tech', label: 'Other Technical Role' },
  { value: 'other_business', label: 'Other Business Role' }
]

export function ChatIntakeForm({ onComplete, onSkip }: ChatIntakeFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    company: '',
    industry: '',
    role: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Please select your industry'
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onComplete(formData)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 min-h-full">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-6 w-6 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Let&apos;s Personalize Your Experience</h3>
        <p className="text-sm text-muted-foreground">
          Help us connect you with an AI expert who understands your industry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Your Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Smith"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company *
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Acme Corp"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={errors.company ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Industry *
          </Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => handleInputChange('industry', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="z-[10000]">
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Your Role *
          </Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => handleInputChange('role', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="z-[10000]">
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-accent hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Setting up...' : 'Start Conversation'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isSubmitting}
            className="px-6"
          >
            Skip
          </Button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your information helps us provide better, industry-specific AI guidance.
        We never share your details with third parties.
      </p>
      </div>
    </div>
  )
}