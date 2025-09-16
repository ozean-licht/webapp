"use client"

import { PrimaryButton } from "@/components/primary-button"

interface CourseCardProps {
  variant?: "default" | "small"
}

export function CourseCard({ variant = "default" }: CourseCardProps) {
  const isSmall = variant === "small"

  return (
    <div
      className={`w-full ${isSmall ? "max-w-[358px]" : "max-w-[600px]"} mx-auto bg-[#0A1A1A] rounded-2xl overflow-hidden border border-[#0E282E] hover:border-primary/50 transition-colors relative`}
    >
      {/* Course Image */}
      <div className={`w-full ${isSmall ? "h-[432px]" : "h-[402.5px]"} overflow-hidden relative`}>
        <img
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_thumbs/Eqionox%2020.03.webp"
          alt="Course preview"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 drop-shadow-lg"
        />

        <div
          className={`absolute bottom-0 left-0 right-0 ${isSmall ? "p-4" : "p-6"} flex flex-col justify-end`}
          style={{
            height: "60%",
            background: `linear-gradient(to bottom, 
              rgba(0, 18, 18, 0) 0%, 
              rgba(0, 18, 18, 0.2) 30%, 
              rgba(0, 18, 18, 0.6) 70%, 
              rgba(0, 18, 18, 0.9) 100%)`,
          }}
        >
          <h3
            className={`text-white font-cinzel ${isSmall ? "text-lg mb-1" : "text-xl mb-1.5"} drop-shadow-lg`}
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}
          >
            Spirituelle Transformation
          </h3>
          <p
            className={`text-white/95 font-montserrat-alt ${isSmall ? "text-sm mb-2" : "text-base mb-3"} line-clamp-2 drop-shadow-md`}
            style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)" }}
          >
            Ein tiefgreifender Kurs zur Aktivierung deines spirituellen Potentials und zur Transformation deines
            Bewusstseins.
          </p>
          <PrimaryButton className="w-full">Kurs öffnen</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
