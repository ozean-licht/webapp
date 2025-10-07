'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { UniversalVideoPlayer } from "@/components/universal-video-player"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  FileText,
  Video,
  File,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Home,
  Settings
} from 'lucide-react'
import type { UserCourseProgress, CourseModule, ModuleContent } from '@/types'

// Mock Daten für Entwicklung
const mockCourseData: UserCourseProgress = {
  course: {
    id: 'course-1',
    slug: 'sirianische-lichtkodierungen',
    title: 'Sirianische Lichtkodierungen',
    description: 'Entdecke die heilenden Frequenzen der Sirianischen Lichtkodierungen und aktiviere dein göttliches Potential.',
    thumbnail_url_desktop: 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/sirian-gateway-event-thumbnail.webp',
    modules: [
      {
        id: 'module-1',
        course_id: 'course-1',
        title: 'Einführung in Sirianische Energien',
        description: 'Grundlagen der sirianischen Heilfrequenzen verstehen',
        order_index: 1,
        is_published: true,
        estimated_duration_minutes: 45,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        contents: [
          {
            id: 'content-1-1',
            module_id: 'module-1',
            title: 'Willkommen bei den Sirianischen Lichtkodierungen',
            description: 'Eine Einführung in die sirianische Energiearbeit',
            content_type: 'video',
            content_url: 'https://youtu.be/Yurty-cB3mo',
            order_index: 1,
            is_published: true,
            duration_minutes: 15,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'content-1-2',
            module_id: 'module-1',
            title: 'Die Geschichte der Sirianischen Wesenheiten',
            description: 'Erfahre mehr über die sirianische Zivilisation',
            content_type: 'text',
            content_text: 'Die Sirianischen Wesenheiten stammen aus dem Sirius-Sternensystem...',
            order_index: 2,
            is_published: true,
            duration_minutes: 10,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'content-1-3',
            module_id: 'module-1',
            title: 'Meditation: Erste Verbindung',
            description: 'Guided Meditation für deine erste sirianische Verbindung',
            content_type: 'audio',
            content_url: 'https://example.com/meditation1.mp3',
            order_index: 3,
            is_published: true,
            duration_minutes: 20,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          }
        ]
      },
      {
        id: 'module-2',
        course_id: 'course-1',
        title: 'Lichtkodierungen Aktivieren',
        description: 'Praktische Übungen zur Aktivierung der Lichtkodierungen',
        order_index: 2,
        is_published: true,
        estimated_duration_minutes: 60,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        contents: [
          {
            id: 'content-2-1',
            module_id: 'module-2',
            title: 'Die 12 Lichtkodierungen verstehen',
            description: 'Detaillierte Erklärung der verschiedenen Lichtkodierungen',
            content_type: 'video',
            content_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order_index: 1,
            is_published: true,
            duration_minutes: 25,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'content-2-2',
            module_id: 'module-2',
            title: 'Arbeitsblatt: Lichtkodierungen',
            description: 'PDF-Arbeitsblatt zum Download',
            content_type: 'pdf',
            content_url: 'https://example.com/worksheet1.pdf',
            order_index: 2,
            is_published: true,
            duration_minutes: 5,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          }
        ]
      },
      {
        id: 'module-3',
        course_id: 'course-1',
        title: 'Integration und Praxis',
        description: 'Die Lichtkodierungen in den Alltag integrieren',
        order_index: 3,
        is_published: true,
        estimated_duration_minutes: 30,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        contents: [
          {
            id: 'content-3-1',
            module_id: 'module-3',
            title: 'Tägliche Praxis-Routine',
            description: 'Wie du die Lichtkodierungen täglich praktizierst',
            content_type: 'text',
            content_text: 'Integriere die Lichtkodierungen in deinen täglichen Ablauf...',
            order_index: 1,
            is_published: true,
            duration_minutes: 15,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'content-3-2',
            module_id: 'module-3',
            title: 'Abschluss-Meditation',
            description: 'Finale Meditation zur Integration aller Lichtkodierungen',
            content_type: 'video',
            content_url: 'https://vimeo.com/148751763',
            order_index: 2,
            is_published: true,
            duration_minutes: 15,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          }
        ]
      }
    ]
  },
  userCourse: {
    id: 'user-course-1',
    user_id: 'temp-user-id',
    course_id: 'course-1',
    progress_percentage: 45,
    last_accessed_at: '2025-01-15T10:30:00Z',
    enrolled_at: '2025-01-10T09:00:00Z',
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  userProgress: {
    id: 'progress-1',
    user_id: 'temp-user-id',
    course_id: 'course-1',
    completed_modules: ['module-1'],
    watched_contents: ['content-1-1', 'content-1-2', 'content-1-3', 'content-2-1'],
    total_watched_time_minutes: 75,
    last_watched_content_id: 'content-2-1',
    last_watched_at: '2025-01-15T10:30:00Z',
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  }
}

const getContentIcon = (type: ModuleContent['content_type']) => {
  switch (type) {
    case 'video': return <Video className="h-4 w-4" />
    case 'audio': return <Volume2 className="h-4 w-4" />
    case 'text': return <FileText className="h-4 w-4" />
    case 'pdf': return <File className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

export default function CourseLearnPage() {
  const params = useParams()
  const slug = params.slug as string

  const [courseData, setCourseData] = useState<UserCourseProgress | null>(null)
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null)
  const [currentContent, setCurrentContent] = useState<ModuleContent | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock loading and data setup
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourseData(mockCourseData)

      // Set initial current module and content
      const firstIncompleteModule = mockCourseData.course.modules.find(
        module => !mockCourseData.userProgress.completed_modules.includes(module.id)
      ) || mockCourseData.course.modules[0]

      setCurrentModule(firstIncompleteModule)

      const lastWatchedContent = firstIncompleteModule.contents.find(
        content => content.id === mockCourseData.userProgress.last_watched_content_id
      ) || firstIncompleteModule.contents[0]

      setCurrentContent(lastWatchedContent)
    }, 500)
  }, [slug])

  const handleContentSelect = (content: ModuleContent, module: CourseModule) => {
    setCurrentContent(content)
    setCurrentModule(module)
  }

  const handleModuleSelect = (module: CourseModule) => {
    setCurrentModule(module)
    // Set first content of module as current
    setCurrentContent(module.contents[0])
  }

  if (!courseData || !currentModule || !currentContent) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const completedModulesCount = courseData.userProgress.completed_modules.length
  const totalModulesCount = courseData.course.modules.length

  // Custom Sidebar für Kurs-Lernumgebung
  const customSidebar = (
    <div className={`fixed left-0 top-[57px] bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#0A1A1A] border-r border-primary/20 transition-all duration-300 flex flex-col z-40 overflow-y-auto`}>
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between gap-2">
          <div className={`${sidebarCollapsed ? 'hidden' : 'block'} flex-1 min-w-0`}>
            <h2 className="text-white font-cinzel text-lg truncate">{courseData.course.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={courseData.userCourse.progress_percentage} className="flex-1 h-2" />
              <span className="text-xs text-white/70">{courseData.userCourse.progress_percentage}%</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white/70 hover:text-white flex-shrink-0"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {courseData.course.modules.map((module) => (
          <div key={module.id} className="border-b border-primary/10">
            {/* Module Header */}
            <button
              onClick={() => handleModuleSelect(module)}
              className={`w-full text-left p-4 hover:bg-primary/10 transition-colors ${
                currentModule.id === module.id ? 'bg-primary/20 border-r-2 border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  courseData.userProgress.completed_modules.includes(module.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/20 text-primary'
                }`}>
                  {courseData.userProgress.completed_modules.includes(module.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{module.order_index}</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{module.title}</h3>
                    <p className="text-white/60 text-xs">{module.contents.length} Lektionen</p>
                  </div>
                )}
              </div>
            </button>

            {/* Module Contents */}
            {!sidebarCollapsed && currentModule.id === module.id && (
              <div className="bg-primary/5">
                {module.contents.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => handleContentSelect(content, module)}
                    className={`w-full text-left p-3 pl-12 hover:bg-primary/10 transition-colors ${
                      currentContent.id === content.id ? 'bg-primary/20 text-primary' : 'text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        courseData.userProgress.watched_contents.includes(content.id)
                          ? 'bg-primary/30 text-primary'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {courseData.userProgress.watched_contents.includes(content.id) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          getContentIcon(content.content_type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{content.title}</p>
                        <p className="text-xs text-white/50">{content.duration_minutes} Min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20">
        <div className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <div className="text-center text-white/60 text-xs">
            {completedModulesCount} von {totalModulesCount} Modulen abgeschlossen
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
            <Home className="h-3 w-3 mr-1" />
            Zum Dashboard
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <AppLayout
      customSidebar={customSidebar}
      showSidebarToggle={false}
      breadcrumbs={[
        { label: 'Kurse', href: '/courses' },
        { label: courseData.course.title, href: `/courses/${slug}` },
        { label: 'Lernen' }
      ]}
      className="!ml-0"
    >
      <div className={`flex flex-col h-screen md:h-[calc(100vh-57px)] ${sidebarCollapsed ? 'ml-16' : 'ml-80'} transition-all duration-300`}>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-[#0A1A1A] border-b border-primary/20 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-white text-xl md:text-2xl font-cinzel truncate">{currentContent.title}</h1>
                <p className="text-white/70 mt-1 text-sm md:text-base truncate">{currentModule.title}</p>
              </div>
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 border border-white/20 text-white">
                  {getContentIcon(currentContent.content_type)}
                  <span className="text-xs md:text-sm font-medium">{currentContent.content_type.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-transparent border border-primary/50 text-primary">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs md:text-sm font-medium">{currentContent.duration_minutes} Min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Player */}
          <div className="flex-1 bg-gradient-to-br from-[#0A1A1A] via-background to-[#0A1A1A] overflow-y-auto">
            {currentContent.content_type === 'video' && (
              <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl">
                  {/* 16:9 Aspect Ratio Container with Border */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10">
                    <UniversalVideoPlayer
                      url={currentContent.content_url || 'https://youtu.be/Yurty-cB3mo'}
                      title={currentContent.title}
                      onTimeUpdate={(time) => {
                        // TODO: Progress tracking in Supabase
                        console.log('Video progress:', time)
                      }}
                      onEnded={() => {
                        // TODO: Mark content as completed
                        console.log('Video completed!')
                      }}
                    />
                  </div>
                  
                  {/* Optional: Video Info below */}
                  {currentContent.description && (
                    <div className="mt-6 p-4 rounded-lg bg-[#0A1A1A] border border-primary/20">
                      <p className="text-white/70 text-sm leading-relaxed">
                        {currentContent.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentContent.content_type === 'text' && (
              <div className="h-full p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <Card className="p-8 bg-[#0A1A1A] border-primary/20">
                    <CardContent className="prose prose-invert max-w-none">
                      <div className="text-white/90 leading-relaxed whitespace-pre-line">
                        {currentContent.content_text || 'Text-Inhalt würde hier angezeigt werden...'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentContent.content_type === 'pdf' && (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#0A1A1A] via-primary/10 to-primary/20 relative overflow-hidden">
                {/* Mystischer Hintergrund-Effekt */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-primary/10"></div>
                
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 backdrop-blur-3xl opacity-30"></div>
                
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-sm border border-primary/30 shadow-2xl shadow-primary/20">
                    <File className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cinzel text-white mb-4">PDF Dokument</h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto">
                    Lade dir das Arbeitsblatt herunter und vertiefe dein Wissen
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105">
                    <File className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}

            {currentContent.content_type === 'audio' && (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-8 mx-auto">
                    <Volume2 className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cinzel text-white mb-4">Audio Meditation</h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto">
                    Schließe deine Augen, atme tief durch und lass dich von den sirianischen Frequenzen führen.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      <Play className="h-5 w-5 mr-2" />
                      Abspielen
                    </Button>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="bg-[#0A1A1A] border-t border-primary/20 p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 w-full md:w-auto">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Vorherige Lektion
              </Button>

              <div className="flex items-center gap-2 md:gap-4">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-sm">
                  <CheckCircle className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Als abgeschlossen markieren</span>
                </Button>
              </div>

              <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                Nächste Lektion
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
