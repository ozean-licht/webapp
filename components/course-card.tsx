"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface Course {
  slug: string
  title: string
  subtitle?: string
  description?: string
  price?: number
  is_published?: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code?: number
  tags?: string[]
  created_at?: string
  updated_at?: string
}

interface CourseCardProps {
  course: Course
  variant?: "default" | "compact"
}

// Tag-Farben für verschiedene Kategorien
function getTagStyle(tag: string): string {
  const tagLower = tag.toLowerCase();
  
  // LCQ = Gelb
  if (tagLower === 'lcq') {
    return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30';
  }
  // Master = Rötlich
  if (tagLower === 'master') {
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30';
  }
  // Basis = Blau
  if (tagLower === 'basis') {
    return 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30';
  }
  // Aufbau = Rosa
  if (tagLower === 'aufbau') {
    return 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30';
  }
  // Fortgeschritten = Lila
  if (tagLower === 'fortgeschritten') {
    return 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30';
  }
  // Interview = Cyan
  if (tagLower === 'interview') {
    return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30';
  }
  // Q&A = Cyan
  if (tagLower === 'q&a') {
    return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30';
  }
  // Kostenlos = Grünliches Cyan (Teal)
  if (tagLower === 'kostenlos') {
    return 'bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30';
  }
  // Intensiv = Rot
  if (tagLower === 'intensiv') {
    return 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30';
  }
  
  // Default style
  return 'bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30';
}

export function CourseCard({ course, variant = "default" }: CourseCardProps) {
  const isCompact = variant === "compact"
  
  const thumbnailUrl = course.thumbnail_url_desktop || 
                       course.thumbnail_url_mobile || 
                       "/api/placeholder/600/337"

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group relative w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden glass-card glass-hover transition-all duration-500 cursor-pointer">
        {/* Cover Image Container */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          {/* Main Image */}
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Special 10px Blur Overlay - Das macht die Card besonders! */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[10px] backdrop-blur-md bg-gradient-to-b from-transparent to-black/20"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Price Badge */}
          {course.price !== undefined && (
            <div className="absolute top-4 right-4 z-10">
              <div className="glass-card-strong px-4 py-2 rounded-full border border-primary/30">
                <span className="text-white font-semibold text-sm font-montserrat-alt">
                  €{course.price}
                </span>
              </div>
            </div>
          )}
          
          {/* Sparkle Effect on Hover */}
          <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Content Section - Glass Effect */}
        <div className="relative p-6 space-y-4">
          {/* Title */}
          <h3 className="font-cinzel-decorative text-xl text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {course.title}
          </h3>
          
          {/* Subtitle or Description */}
          {(course.subtitle || course.description) && (
            <p className="text-sm text-muted-foreground font-light font-montserrat-alt line-clamp-2 leading-relaxed">
              {course.subtitle || course.description?.substring(0, 100)}
              {!course.subtitle && course.description && course.description.length > 100 ? "..." : ""}
            </p>
          )}
          
          {/* CTA Button */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-normal font-montserrat-alt gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20"
          >
            <Sparkles className="h-4 w-4" />
            Kurs entdecken
          </Button>
          
          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {course.tags.map((tag) => (
                <span
                  key={`${course.course_code}-${tag}`}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium font-montserrat-alt
                    transition-all duration-300
                    ${getTagStyle(tag)}
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Subtle Border Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
        </div>
      </div>
    </Link>
  )
}