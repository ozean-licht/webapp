"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Settings,
  LogOut,
  User,
  BookOpen,
  Bell,
  Search,
  Menu,
  ChevronRight,
  FileText,
  Crown
} from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  onMenuClick?: () => void
  showSidebarToggle?: boolean
}

export function AppHeader({ breadcrumbs = [], onMenuClick, showSidebarToggle = true }: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking auth:', error)
        // Mock user for development
        setUser({
          id: 'temp-user-id',
          email: 'user@ozean-licht.com',
          created_at: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // For development, just redirect
      router.push('/')
    }
  }

  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname.startsWith('/dashboard')) {
      return [
        { label: 'Dashboard', href: '/dashboard' }
      ]
    }
    if (pathname.startsWith('/courses/') && pathname.includes('/learn')) {
      const courseSlug = pathname.split('/')[2]
      return [
        { label: 'Kurse', href: '/courses' },
        { label: 'Kurs', href: `/courses/${courseSlug}` },
        { label: 'Lernen' }
      ]
    }
    return []
  }

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDefaultBreadcrumbs()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1A1A]/80 backdrop-blur-md border-b border-[#0E282E] w-full">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
            onClick={onMenuClick}
            className="text-primary hover:text-white hover:bg-[#0E282E] p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Image
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png"
                alt="Ozean Licht Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span className="text-white font-normal text-lg font-cinzel">Ozean Licht™</span>
          </Link>

          {/* Breadcrumbs */}
          {displayBreadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              {displayBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] p-2"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] p-2"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#0E282E]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1a2a3a" alt="User" />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0A1A1A] border-[#0E282E]" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1a2a3a" alt="User" />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-primary font-normal text-sm">
                      {user.email.split('@')[0]}
                    </p>
                    <p className="text-muted-foreground text-xs max-w-[140px] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-[#0E282E]" />
                <DropdownMenuItem asChild className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] cursor-pointer font-light">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] cursor-pointer font-light">
                  <Link href="/bibliothek" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Bibliothek
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] cursor-pointer font-light">
                  <Link href="/belege" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Belege
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-muted-foreground hover:text-primary hover:bg-[#0E282E] cursor-pointer font-light">
                  <Link href="/mitgliedschaft" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Mitgliedschaft
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#0E282E]" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-[#0E282E] cursor-pointer flex items-center gap-2 font-light"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
