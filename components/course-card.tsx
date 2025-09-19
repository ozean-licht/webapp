"use client"

import { PrimaryButton } from "@/components/primary-button"
// Temporarily disable framer-motion to avoid export issues
// import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface Course {
  slug: string
  title: string
  description: string
  price: number
  is_published: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  created_at: string
  updated_at: string
}

interface CourseCardProps {
  course: Course
  variant?: "default" | "small" | "preview"
}

export function CourseCard({ course, variant = "default" }: CourseCardProps) {
  const isSmall = variant === "small"
  const isPreview = variant === "preview"

  // Use appropriate thumbnail based on variant
  const thumbnailUrl = isSmall
    ? (course.thumbnail_url_mobile || course.thumbnail_url_desktop || "/api/placeholder/400/225")
    : (course.thumbnail_url_desktop || "/api/placeholder/600/337")

  // Calculate 16:9 dimensions
  const aspectRatio = 16 / 9
  const height = isSmall ? 225 : isPreview ? 200 : 337
  const width = height * aspectRatio

  return (
    <Link href={`/courses/${course.slug}`}>
      <div
        className={`group w-full ${isSmall ? "max-w-[300px]" : isPreview ? "max-w-[400px]" : "max-w-[600px]"} mx-auto bg-[#0A1A1A] rounded-2xl overflow-hidden border border-[#0E282E] hover:border-primary/50 transition-all duration-300 relative cursor-pointer`}
      >
        {/* Course Image - 16:9 Aspect Ratio */}
        <div className="w-full overflow-hidden relative group" style={{ aspectRatio: '16/9' }}>
          <Image
            src={thumbnailUrl}
            alt={course.title}
            width={width}
            height={height}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            priority={variant === "preview"}
          />

          {/* Quantum Energy Overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            style={{
              background: `radial-gradient(circle at center,
                rgba(0, 18, 18, 0.1) 0%,
                rgba(0, 18, 18, 0.3) 40%,
                rgba(0, 18, 18, 0.6) 70%,
                rgba(0, 18, 18, 0.8) 100%)`,
              backdropFilter: `blur(0.5px)`,
              WebkitBackdropFilter: `blur(0.5px)`,
            }}
          />

          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white font-semibold text-sm">
              €{course.price}
            </span>
          </div>
        </div>

        {/* Content Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 ${isSmall ? "p-4" : "p-6"} flex flex-col justify-end`}
          style={{
            height: "50%",
            background: `linear-gradient(to bottom,
              rgba(0, 18, 18, 0) 0%,
              rgba(0, 18, 18, 0.3) 40%,
              rgba(0, 18, 18, 0.8) 100%)`,
          }}
        >
          <div className="relative flex flex-col space-y-2">
            {/* Course Title */}
            <h3
              className={`text-white font-cinzel-decorative ${isSmall ? "text-lg" : "text-xl"} drop-shadow-lg leading-tight`}
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}
            >
              {course.title}
            </h3>

            {/* Course Description - Short version */}
            <p
              className={`text-white/90 font-montserrat-alt ${isSmall ? "text-sm" : "text-base"} line-clamp-2 drop-shadow-md`}
              style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)" }}
            >
              {course.description?.substring(0, isSmall ? 80 : 120) || "Entdecke transformative Inhalte für dein spirituelles Wachstum."}
              {course.description && course.description.length > (isSmall ? 80 : 120) ? "..." : ""}
            </p>

            {/* CTA Button */}
            <div className="mt-3">
              <PrimaryButton className="w-full opacity-90 group-hover:opacity-100 transition-opacity">
                Kurs entdecken
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl" />
        </div>
      </div>
    </Link>
  )
}

