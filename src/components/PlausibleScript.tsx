import Script from 'next/script'
import { plausibleConfig } from '@/lib/analytics'

export function PlausibleScript() {
  // Only render in production
  if (!plausibleConfig.enabled) {
    return null
  }

  return (
    <Script
      defer
      data-domain={plausibleConfig.domain}
      src={plausibleConfig.scriptSrc}
      strategy="afterInteractive"
    />
  )
}