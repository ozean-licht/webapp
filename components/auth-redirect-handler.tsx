'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Component to handle auth tokens in URL hash on any page
 * and redirect to the proper callback page for processing
 */
export function AuthRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if there are auth tokens in the URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const authType = hashParams.get('type')

      // If we have auth tokens, redirect to callback page with the hash intact
      if (accessToken && refreshToken) {
        console.log('🔐 Auth tokens detected on homepage, redirecting to callback...')
        console.log('📍 Auth Type:', authType)
        
        // Redirect to callback page with the hash
        window.location.href = '/auth/callback' + window.location.hash
      }
    }
  }, [router])

  // This component doesn't render anything
  return null
}

