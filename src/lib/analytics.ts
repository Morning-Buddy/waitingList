import { PLAUSIBLE_DOMAIN, isProduction } from './env'

// Plausible analytics configuration
export const plausibleConfig = {
  domain: PLAUSIBLE_DOMAIN,
  enabled: isProduction, // Only track in production
  scriptSrc: 'https://plausible.io/js/script.js'
}

// Custom event tracking
export interface PlausibleEvent {
  name: string
  props?: Record<string, string | number | boolean>
}

// Track custom events
export function trackEvent(event: PlausibleEvent) {
  if (!plausibleConfig.enabled || typeof window === 'undefined') {
    return
  }

  // Check if Plausible is loaded
  if (typeof window.plausible === 'function') {
    window.plausible(event.name, { props: event.props })
  } else {
    console.warn('Plausible not loaded, event not tracked:', event.name)
  }
}

// Predefined events for the landing page
export const events = {
  // Modal interactions
  modalOpened: () => trackEvent({ name: 'Modal Opened' }),
  modalClosed: () => trackEvent({ name: 'Modal Closed' }),
  
  // Form interactions
  formStarted: () => trackEvent({ name: 'Form Started' }),
  formSubmitted: (props?: { hasName: boolean }) => 
    trackEvent({ name: 'Form Submitted', props }),
  formError: (props: { error: string }) => 
    trackEvent({ name: 'Form Error', props }),
  
  // Page interactions
  ctaClicked: (props?: { location: string }) => 
    trackEvent({ name: 'CTA Clicked', props }),
  faqOpened: (props: { question: string }) => 
    trackEvent({ name: 'FAQ Opened', props }),
  
  // Social sharing
  socialShare: (props: { platform: string }) => 
    trackEvent({ name: 'Social Share', props }),
  
  // Email confirmation
  emailConfirmed: () => trackEvent({ name: 'Email Confirmed' }),
  
  // Page views (handled automatically by Plausible)
  thankYouPageView: () => trackEvent({ name: 'Thank You Page View' })
}

// Type declaration for Plausible global function
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void
  }
}