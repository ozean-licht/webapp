'use client'

import { Video, Image as ImageIcon, Power } from 'lucide-react'
import { useBackgroundMode, type BackgroundMode } from './background-mode-context'
import { cn } from '@/lib/utils'

export function BackgroundModeSwitch() {
  const { mode, changeMode, isLoaded } = useBackgroundMode()

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return null
  }

  const modes: Array<{ value: BackgroundMode; icon: typeof Video }> = [
    { value: 'video', icon: Video },
    { value: 'image', icon: ImageIcon },
    { value: 'none', icon: Power },
  ]

  return (
    <div className="px-3 py-4 border-t border-[#0E282E]">
      <div className="flex items-center justify-center gap-3 p-2 bg-gradient-to-b from-[#0A1A1A] to-[#0D1F1F] rounded-3xl">
        {modes.map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => changeMode(value)}
            className={cn(
              "relative w-12 h-12 rounded-xl transition-all duration-300",
              "flex items-center justify-center",
              mode === value
                ? [
                    "bg-gradient-to-br from-[#0A1A1A] to-[#050F0F]",
                    "text-primary",
                    "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(25,45,50,0.1)]",
                    "scale-95"
                  ].join(" ")
                : "text-muted-foreground/30 hover:text-muted-foreground/50 hover:scale-105"
            )}
          >
            <Icon className={cn(
              "transition-all duration-300",
              mode === value ? "h-5 w-5" : "h-4.5 w-4.5"
            )} />
          </button>
        ))}
      </div>
    </div>
  )
}
