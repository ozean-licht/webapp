'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { AppLayout } from "@/components/app-layout"
import { SpanDesign } from "@/components/span-design"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  Star,
  Sparkles,
  Heart,
  Moon,
  TrendingUp,
  Award,
  Calendar,
  Zap,
  Crown,
  Target,
  ArrowRight,
  Users,
  Globe,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface UserData {
  id: string
  email: string
  created_at: string
  user_metadata: {
    full_name?: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalHours: number
  currentStreak: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        
        // Get user from Supabase Auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          console.error('Auth error:', authError)
          router.push('/login')
          return
        }

        setUser(authUser as UserData)

        // Fetch user stats (courses, progress, etc.)
        // TODO: Implement real queries
        setStats({
          totalCourses: 8,
          completedCourses: 3,
          totalHours: 47,
          currentStreak: 12
        })

      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return null
  }

  // Extract name and member number
  const firstName = user.user_metadata?.first_name || user.email.split('@')[0]
  const lastName = user.user_metadata?.last_name || ''
  const fullName = user.user_metadata?.full_name || `${firstName} ${lastName}`.trim()
  const memberNumber = user.id.slice(-8).toUpperCase()
  const joinDate = new Date(user.created_at)
  const completionRate = stats ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <SpanDesign>Deine Zentrale</SpanDesign>
          </div>

          {/* Hero Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>

            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={fullName}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {firstName.charAt(0)}{lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-3xl md:text-4xl font-cinzel-decorative font-normal text-foreground mb-2">
                      Willkommen zurück, {firstName}!
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      Setze deine spirituelle Reise fort und erweitere dein Bewusstsein
                    </p>
                  </motion.div>

                  {/* Member Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Mitgliedsnummer:</span>
                      <span className="font-mono font-bold text-primary">{memberNumber}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-background/50 border border-primary/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Mitglied seit:</span>
                      <span className="font-medium text-foreground">
                        {joinDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <Badge className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30">
                      <Crown className="h-4 w-4 mr-2 text-amber-500" />
                      Lichtarbeiter
                    </Badge>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-2"
                >
                  <Button asChild className="gap-2">
                    <Link href="/bibliothek">
                      <BookOpen className="h-4 w-4" />
                      Meine Kurse
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/courses">
                      <Sparkles className="h-4 w-4" />
                      Neue Kurse
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Courses */}
          <motion.div variants={itemVariants}>
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +2 diese Woche
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stats?.totalCourses || 0}
                </p>
                <p className="text-sm text-muted-foreground">Aktive Kurse</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion Rate */}
          <motion.div variants={itemVariants}>
            <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {completionRate}%
                </p>
                <p className="text-sm text-muted-foreground">Abschlussrate</p>
                <Progress value={completionRate} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Hours */}
          <motion.div variants={itemVariants}>
            <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +5h diese Woche
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stats?.totalHours || 0}h
                </p>
                <p className="text-sm text-muted-foreground">Lernzeit insgesamt</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Streak */}
          <motion.div variants={itemVariants}>
            <Card className="border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stats?.currentStreak || 0}
                </p>
                <p className="text-sm text-muted-foreground">Tage Streak 🔥</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-cinzel-decorative font-normal flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary" />
                      Lernfortschritt
                    </CardTitle>
                    <CardDescription>
                      Setze deine spirituelle Reise fort
                    </CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/bibliothek" className="gap-2">
                      Alle anzeigen
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Progress Cards */}
                {[
                  {
                    title: 'Sirianische Lichtkodierungen',
                    progress: 75,
                    image: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/sirian-gateway-event-thumbnail.webp',
                    tag: 'Sirianisch',
                    nextLesson: 'Modul 3: Frequenz-Aktivierung'
                  },
                  {
                    title: 'Plejadische Ascension',
                    progress: 42,
                    image: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/free-video-1.webp',
                    tag: 'Plejadisch',
                    nextLesson: 'Modul 2: DNA-Aktivierung'
                  }
                ].map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="border-primary/10 hover:border-primary/30 transition-all group cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {course.nextLesson}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {course.tag}
                              </Badge>
                            </div>

                            {/* Progress */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Fortschritt</span>
                                <span className="font-medium text-primary">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            {/* Quick Links */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-cinzel-decorative font-normal flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Schnellzugriff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                  <Link href="/bibliothek">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Bibliothek</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                  <Link href="/courses">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Kurse durchstöbern</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                  <Link href="/magazine">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Magazin</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-cinzel-decorative font-normal flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Letzte Aktivitäten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    text: 'Modul 2 abgeschlossen',
                    time: 'vor 2h'
                  },
                  {
                    icon: Star,
                    color: 'text-amber-500',
                    text: 'Level Up: Fortgeschritten',
                    time: 'gestern'
                  },
                  {
                    icon: Heart,
                    color: 'text-pink-500',
                    text: 'Kurs favorisiert',
                    time: 'vor 3 Tagen'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <activity.icon className={`h-5 w-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                    <Moon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-cinzel-decorative font-normal text-foreground mb-1">
                      Bereit für mehr?
                    </h3>
                    <p className="text-muted-foreground">
                      Entdecke neue galaktische Weisheiten und erweitere dein Bewusstsein
                    </p>
                  </div>
                </div>
                <Button size="lg" asChild className="gap-2 shadow-lg">
                  <Link href="/courses">
                    <Sparkles className="h-5 w-5" />
                    Neue Kurse entdecken
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
