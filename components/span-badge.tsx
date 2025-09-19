import { Star, Heart, Lightbulb, Wand2, Moon, MessageCircle, Users, Sparkle } from "lucide-react"

interface SpanBadgeProps {
  icon?: string
  text?: string
  children?: React.ReactNode
  variant?: "default" | "justText"
}

export default function SpanBadge({ icon, text, children, variant = "default" }: SpanBadgeProps) {
  const getIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart size={16} className="text-white" />
      case "lightbulb":
        return <Lightbulb size={16} className="text-white" />
      case "magicwand":
        return <Wand2 size={16} className="text-white" />
      case "moon":
        return <Moon size={16} className="text-white" />
      case "feedback":
        return <MessageCircle size={16} className="text-white" />
      case "users":
        return <Users size={16} className="text-white" />
      case "sparkle":
        return <Sparkle size={16} className="text-white" />
      case "star":
        return <Star size={16} className="text-white" />
      default:
        return <Star size={16} className="text-white" />
    }
  }

  const displayText = children || text

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#5DABA3]/30 border border-[#5DABA3]/40 rounded-full text-white text-sm font-montserrat-alt">
      {variant === "default" && getIcon()}
      {displayText}
    </span>
  )
}

export { SpanBadge }
