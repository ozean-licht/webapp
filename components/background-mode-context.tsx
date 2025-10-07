'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type BackgroundMode = 'video' | 'image' | 'none'

interface BackgroundModeContextType {
  mode: BackgroundMode
  changeMode: (mode: BackgroundMode) => void
  isLoaded: boolean
}

const BackgroundModeContext = createContext<BackgroundModeContextType | undefined>(undefined)

const STORAGE_KEY = 'ozean-licht-background-mode'

export function BackgroundModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<BackgroundMode>('video')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY) as BackgroundMode | null
    if (stored && ['video', 'image', 'none'].includes(stored)) {
      setMode(stored)
    }
    setIsLoaded(true)
  }, [])

  const changeMode = (newMode: BackgroundMode) => {
    setMode(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
  }

  return (
    <BackgroundModeContext.Provider value={{ mode, changeMode, isLoaded }}>
      {children}
    </BackgroundModeContext.Provider>
  )
}

export function useBackgroundMode() {
  const context = useContext(BackgroundModeContext)
  if (context === undefined) {
    throw new Error('useBackgroundMode must be used within a BackgroundModeProvider')
  }
  return context
}

