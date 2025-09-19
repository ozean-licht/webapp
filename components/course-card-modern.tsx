"use client"

import { PrimaryButton } from "@/components/primary-button"
import Link from "next/link"
import { useEffect, useState } from "react"

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

// Erstelle ein Fallback-Bild als Data-URL
function createFallbackImage(title: string) {
  // Entferne Sonderzeichen und kodierv für Base64
  const cleanTitle = title
    .replace(/[äöüÄÖÜß]/g, (match) => {
      const map: { [key: string]: string } = {
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue',
        'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
        'ß': 'ss'
      };
      return map[match] || match;
    })
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Entferne andere Sonderzeichen
    .substring(0, 25);

  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#001212"/>
    <rect x="20" y="20" width="560" height="297" fill="#00D4FF" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${cleanTitle}...</text>
  </svg>`;

  // Verwende encodeURIComponent und dann btoa für sichere Base64-Kodierung
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

interface CourseCardModernProps {
  course: Course
}

function ReliableImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setImageSrc(createFallbackImage('No Image'));
      setIsLoading(false);
      return;
    }

    // Edge Function behandelt problematische URLs bereits automatisch
    // Hier nur noch als Backup für unerwartete Fälle
    if (src && src.startsWith('data:image/svg+xml')) {
      // Bereits ein Fallback-Bild von der Edge Function
      console.log(`🔄 Using pre-generated fallback from Edge Function: ${alt}`);
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Versuche das Bild direkt zu laden
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.log(`❌ Direct load failed for: ${src}`);
      setImageSrc(createFallbackImage(alt));
      setIsLoading(false);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, alt]);

  if (isLoading) {
    return (
      <div className={`${className} bg-[#001212] flex items-center justify-center`}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <img src={imageSrc!} alt={alt} className={className} />;
}

export function CourseCardModern({ course }: CourseCardModernProps) {
  // Verwende direkte Supabase URLs
  const imageUrl = course.thumbnail_url_desktop ||
                   course.thumbnail_url_mobile ||
                   createFallbackImage(course.title)

  // Debug für problematische Kurse
  if (course.title.includes('Q&A') || course.title.includes('Energie Update') || course.title.includes('Partner & Friends')) {
    console.log(`🎯 CourseCardModern for: ${course.title.substring(0, 50)}...`);
    console.log(`   thumbnail_url_desktop: ${course.thumbnail_url_desktop}`);
    console.log(`   thumbnail_url_mobile: ${course.thumbnail_url_mobile}`);
    console.log(`   Final imageUrl: ${imageUrl.substring(0, 100)}...`);
  }

  return (
    <Link href={`/courses/${course.slug}`}>
      {/* Haupt-Container mit relativer Positionierung */}
      <div className="group bg-[#001212] rounded-2xl overflow-hidden shadow-lg border border-[#0E282E] transition-all duration-300 cursor-pointer">
        {/* Image Section - Hintergrund Layer (z-index: 0) */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-[#001212] to-[#002433] overflow-hidden">
                 {/* Course Image */}
                 <ReliableImage
                   src={imageUrl}
                   alt={course.title}
                   className="w-full h-full object-cover"
                 />


          {/* Fallback on error */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#001212] to-[#002433] transition-opacity duration-300 opacity-0">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-white font-cinzel-decorative text-lg font-semibold leading-tight px-4">
                {course.title}
              </div>
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-primary/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-primary/20">
              <span className="text-white font-semibold text-sm">
                €{course.price}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section - relativ positioniert unter dem Bild */}
        <div className="p-6 bg-[#001212]">
          {/* Title */}
          <h3 className="font-cinzel-decorative text-xl text-white mb-3 leading-tight line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
            {course.description?.substring(0, 120) || "Entdecke transformative Inhalte für dein spirituelles Wachstum und deine persönliche Entwicklung."}
            {course.description && course.description.length > 120 ? "..." : ""}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-white/60 mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Verfügbar
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c.98.98 2.28 1.58 3.74 1.58 2.21 0 4.17-1.23 5.19-3.12.21-.38.15-.87-.14-1.19-.29-.32-.78-.38-1.16-.17z"/>
              </svg>
              Lebenslang
            </span>
          </div>

          {/* CTA Button */}
          <PrimaryButton className="w-full bg-primary hover:bg-primary/90 text-white border-0">
            Kurs ansehen
          </PrimaryButton>

        </div>
      </div>
    </Link>
  )
}
