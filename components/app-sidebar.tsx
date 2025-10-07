"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  BookOpen,
  User,
  Settings,
  Bell,
  Heart,
  Star,
  Sparkles,
  Moon,
  Sun,
  Compass,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "./ui/button"
import { BackgroundModeSwitch } from "./background-mode-switch"

interface AppSidebarProps {
  isOpen: boolean
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Übersicht & Fortschritt"
  },
  {
    label: "Bibliothek",
    href: "/bibliothek",
    icon: BookOpen,
    description: "Meine Kurse"
  },
  {
    label: "Kurse",
    href: "/courses",
    icon: Sparkles,
    description: "Alle Kurse"
  },
  {
    label: "Transmissions",
    href: "/dashboard?tab=transmissions",
    icon: Moon,
    description: "Galaktische Weisheiten"
  },
  {
    label: "Portal",
    href: "/dashboard?tab=portal",
    icon: Compass,
    description: "Spirituelle Angebote"
  },
  {
    label: "Chronik",
    href: "/dashboard?tab=chronik",
    icon: Sun,
    description: "Meine Erleuchtung"
  }
]

export function AppSidebar({ isOpen }: AppSidebarProps) {
  const pathname = usePathname()

  if (!isOpen) {
    return (
      <div className="fixed left-0 top-[57px] bottom-0 w-16 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col items-center py-4 z-40">
        <div className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-12 h-12 p-0 hover:bg-[#0E282E]",
                    isActive && "bg-primary/20 text-primary hover:bg-primary/30"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-[57px] bottom-0 w-64 bg-[#0A1A1A]/80 backdrop-blur-md border-r border-[#0E282E] flex flex-col font-montserrat-alt z-40">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-3 px-4 text-left transition-all duration-300 font-montserrat-alt rounded-xl",
                    "hover:bg-gradient-to-r hover:from-[#0E282E] hover:to-[#0A1A1A] hover:text-primary hover:shadow-lg hover:shadow-primary/5",
                    isActive 
                      ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/20 border border-primary/30 hover:border-primary/50 hover:shadow-primary/30" 
                      : "border border-transparent"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive 
                      ? "bg-primary/20 shadow-lg shadow-primary/20" 
                      : "bg-[#0E282E]/50"
                  )}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className={cn(
                      "text-sm font-light truncate transition-all duration-300",
                      isActive && "font-normal"
                    )}>
                      {item.label}
                    </span>
                    <span className={cn(
                      "text-xs font-light truncate transition-all duration-300",
                      isActive ? "text-primary/70" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                    </div>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Background Mode Switch */}
      <BackgroundModeSwitch />
    </div>
  )
}
