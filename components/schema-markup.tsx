import React from 'react'

interface SchemaMarkupProps {
  type: 'organization' | 'localBusiness' | 'service' | 'faq'
  data?: {
    name?: string
    description?: string
    serviceType?: string
    price?: string
    faqs?: Array<{
      "@type": string
      name: string
      acceptedAnswer: {
        "@type": string
        text: string
      }
    }>
  }
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const getSchema = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Wright AI Solutions",
          "alternateName": "W.A.S",
          "url": "https://wrightaisolutions.com",
          "logo": "https://wrightaisolutions.com/logo.png",
          "description": "Custom AI applications and consulting services for businesses. Expert AI development, automation, and strategic consulting.",
          "foundingDate": "2024",
          "founder": {
            "@type": "Person",
            "name": "Wright AI Solutions Team"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Remote",
            "addressCountry": "US"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "customer service",
            "email": "hello@wrightaisolutions.com",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://linkedin.com/company/wright-ai-solutions",
            "https://twitter.com/wrightaisolutions"
          ],
          "serviceType": [
            "AI Development",
            "Machine Learning Consulting",
            "Process Automation",
            "Data Analytics",
            "AI Integration"
          ]
        }

      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Wright AI Solutions",
          "image": "https://wrightaisolutions.com/logo.png",
          "description": "Expert AI consulting and custom application development services. Transform your business with tailored AI solutions.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Remote & On-site",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.7128",
            "longitude": "-74.0060"
          },
          "url": "https://wrightaisolutions.com",
          "telephone": "+1-555-123-4567",
          "email": "hello@wrightaisolutions.com",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday", 
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          },
          "priceRange": "$5,000 - $100,000+",
          "serviceArea": {
            "@type": "Place",
            "name": "Worldwide"
          }
        }

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data?.name || "Custom AI Application Development",
          "description": data?.description || "Custom AI applications designed specifically for your business challenges and requirements.",
          "provider": {
            "@type": "Organization",
            "name": "Wright AI Solutions",
            "url": "https://wrightaisolutions.com"
          },
          "serviceType": data?.serviceType || "AI Development",
          "category": "Information Technology",
          "offers": {
            "@type": "Offer",
            "price": data?.price || "35000",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": data?.price || "35000",
              "priceCurrency": "USD",
              "valueAddedTaxIncluded": false
            }
          },
          "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
          },
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": "https://wrightaisolutions.com/contact",
            "serviceSmsNumber": "+1-555-123-4567"
          }
        }

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data?.faqs || [
            {
              "@type": "Question",
              "name": "What types of AI solutions does Wright AI Solutions develop?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We develop custom AI applications including machine learning models, natural language processing solutions, computer vision applications, predictive analytics systems, and process automation tools."
              }
            },
            {
              "@type": "Question", 
              "name": "How long does it take to develop a custom AI application?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Development timelines vary based on complexity, typically ranging from 2-12 weeks. Simple automation projects may take 2-8 weeks, while comprehensive AI applications typically require 8-12 weeks."
              }
            },
            {
              "@type": "Question",
              "name": "What is the cost of custom AI development?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI solutions start at $5,000 for consulting and strategy, with custom applications typically ranging from $15,000 to $100,000+ depending on complexity and requirements."
              }
            }
          ]
        }

      default:
        return null
    }
  }

  const schema = getSchema()
  
  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}