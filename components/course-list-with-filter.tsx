"use client"

import { useState } from "react"
import { CourseCard } from "@/components/course-card"
import { CourseFilter } from "@/components/course-filter"

interface Course {
  slug: string
  title: string
  subtitle?: string
  description: string
  price: number
  is_public: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  tags?: string[]
  created_at: string
  updated_at: string
}

interface CourseListWithFilterProps {
  courses: Course[]
}

export function CourseListWithFilter({ courses }: CourseListWithFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Filter Kurse basierend auf ausgewähltem Filter
  const filteredCourses = courses.filter((course) => {
    if (selectedFilter === "all") return true
    
    // Check if course has the selected tag
    return course.tags?.some(tag => 
      tag.toLowerCase() === selectedFilter.toLowerCase()
    )
  })

  return (
    <>
      {/* Filter */}
      <div className="flex justify-start max-w-5xl mx-auto mb-12">
        <CourseFilter onFilterChange={setSelectedFilter} />
      </div>

      {/* Course Grid */}
      <div className="w-full">
        {filteredCourses.length > 0 ? (
          <>
            <div className="text-white/60 text-sm mb-4 max-w-7xl mx-auto">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Kurs' : 'Kurse'} gefunden
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredCourses.map((course) => (
                <CourseCard key={course.course_code} course={course} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-white/70 text-lg">
              Keine Kurse für die ausgewählte Kategorie gefunden.
              <br />
              <small className="text-white/50 mt-2 block">
                Versuche eine andere Kategorie auszuwählen.
              </small>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

