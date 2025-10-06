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
      <div className="w-16 bg-[#0A1A1A] border-r border-[#0E282E] flex flex-col items-center py-4">
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
    <div className="w-64 bg-[#0A1A1A] border-r border-[#0E282E] flex flex-col">
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
                    "w-full justify-start gap-3 h-12 px-3 text-left hover:bg-[#0E282E] hover:text-primary",
                    isActive && "bg-primary/20 text-primary hover:bg-primary/30 border-l-2 border-primary"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
