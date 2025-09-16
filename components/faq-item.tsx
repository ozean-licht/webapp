"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface FaqItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className="backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#001212dd", border: "1px solid #0E282E" }} // increased opacity from #001212 to #001212dd for better contrast and updated border color
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-300"
      >
        <span className="font-montserrat-alt text-white text-lg font-normal pr-4">{question}</span>
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
          >
            <Plus size={20} className="text-primary" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-gray-100 font-montserrat-alt leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default FaqItem
