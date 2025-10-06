"use client"

import { useState } from "react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
  customSidebar?: React.ReactNode
  showSidebarToggle?: boolean
}

export function AppLayout({
  children,
  breadcrumbs,
  className,
  customSidebar,
  showSidebarToggle = true
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        breadcrumbs={breadcrumbs}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={showSidebarToggle}
      />

      <div className="flex">
        {customSidebar ? (
          customSidebar
        ) : (
          <AppSidebar isOpen={sidebarOpen} />
        )}

        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
