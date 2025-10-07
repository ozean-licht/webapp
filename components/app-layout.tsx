"use client"

import { useState } from "react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { VideoLayoutWrapper } from "./video-layout-wrapper"
import { BackgroundModeProvider } from "./background-mode-context"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
  customSidebar?: React.ReactNode
  showSidebarToggle?: boolean
  overlayOpacity?: number
  overlayColor?: string
}

export function AppLayout({
  children,
  breadcrumbs,
  className,
  customSidebar,
  showSidebarToggle = true,
  overlayOpacity = 0.5,
  overlayColor = "black"
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <BackgroundModeProvider>
      <VideoLayoutWrapper overlayOpacity={overlayOpacity} overlayColor={overlayColor}>
        <div className="min-h-screen text-foreground">
          <AppHeader
            breadcrumbs={breadcrumbs}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            showSidebarToggle={showSidebarToggle}
          />

          <div className="flex pt-[57px]">
            {customSidebar ? (
              customSidebar
            ) : (
              <AppSidebar isOpen={sidebarOpen} />
            )}

            <main className={cn(
              "relative z-10 flex-1 transition-all duration-300 ease-in-out",
              sidebarOpen ? "ml-64" : "ml-16",
              className
            )}>
              {children}
            </main>
          </div>
        </div>
      </VideoLayoutWrapper>
    </BackgroundModeProvider>
  )
}
