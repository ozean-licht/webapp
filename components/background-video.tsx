'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { BackgroundMode } from './background-mode-context'

interface BackgroundVideoProps {
  /**
   * Zeigt ein Fallback-Bild während des Video-Ladens
   * Kann ein Screenshot vom ersten Frame sein
   */
  posterImage?: string
  /**
   * CSS-Klassen für zusätzliches Styling
   */
  className?: string
  /**
   * Overlay-Opacity (0-1) für bessere Text-Lesbarkeit
   */
  overlayOpacity?: number
  /**
   * Overlay-Farbe (default: schwarz)
   */
  overlayColor?: string
  /**
   * Background-Modus: video, image oder none
   */
  mode?: BackgroundMode
}

export function BackgroundVideo({
  posterImage,
  className = '',
  overlayOpacity = 0.3,
  overlayColor = 'black',
  mode = 'video'
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle video loading and play/pause based on mode
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (mode === 'video') {
      const handleCanPlay = () => {
        setIsLoaded(true)
        video.play().catch(err => {
          console.warn('Auto-play prevented:', err)
        })
      }

      video.addEventListener('canplay', handleCanPlay)
      
      // If video is already loaded, play it
      if (video.readyState >= 3) {
        video.play().catch(err => {
          console.warn('Auto-play prevented:', err)
        })
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
      }
    } else {
      // Pause and reset video when not in video mode
      video.pause()
    }
  }, [mode])

  const videoSrc = isMobile
    ? 'https://api.ozean-licht.com/storage/v1/object/public/background_videos/ElectricWater_Mobile.mp4'
    : 'https://api.ozean-licht.com/storage/v1/object/public/background_videos/ElectricWater_Dekstop.mp4'

  const imageSrc = isMobile
    ? 'https://api.ozean-licht.com/storage/v1/object/public/assets/backgrounds/ElectricWaterMobile.webp'
    : 'https://api.ozean-licht.com/storage/v1/object/public/assets/backgrounds/ElectricWaterDesktop.webp'

  // Return nothing if mode is 'none'
  if (mode === 'none') {
    return null
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Zeige nur Bild wenn mode === 'image' */}
      {mode === 'image' && (
        <Image
          src={imageSrc}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
      )}

      {/* Fallback Poster Image während des Video-Ladens */}
      {mode === 'video' && posterImage && !isLoaded && (
        <Image
          src={posterImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={75}
        />
      )}

      {/* Background Video */}
      {mode === 'video' && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterImage}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay für bessere Text-Lesbarkeit */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Vignette-Effekt für noch bessere Ästhetik */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${overlayColor} 100%)`,
          opacity: 0.4,
        }}
      />
    </div>
  )
}

