'use client'

import { BackgroundVideo } from "@/components/background-video"
import { useBackgroundMode } from "@/components/background-mode-context"

interface VideoLayoutWrapperProps {
  children: React.ReactNode
  overlayOpacity?: number
  overlayColor?: string
}

export function VideoLayoutWrapper({ 
  children, 
  overlayOpacity = 0.5, 
  overlayColor = "black" 
}: VideoLayoutWrapperProps) {
  const { mode, isLoaded } = useBackgroundMode()

  return (
    <>
      {isLoaded && (
        <BackgroundVideo 
          mode={mode}
          overlayOpacity={overlayOpacity}
          overlayColor={overlayColor}
        />
      )}
      {children}
    </>
  )
}
