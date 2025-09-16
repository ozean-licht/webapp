"use client"

import type React from "react"

interface NavButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export function NavButton({ children, active = false, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-[14px] py-2 rounded-full font-light font-montserrat transition-all duration-200
        text-lg md:text-[17px] lg:text-[18px]
        ${active ? "text-[#E1E3E9] border" : "text-[#C4C8D4] hover:text-[#F0F1F4]"}
      `}
      style={
        active
          ? {
              backgroundColor: "#133338",
              borderColor: "#164045",
            }
          : {}
      }
    >
      {children}
    </button>
  )
}
