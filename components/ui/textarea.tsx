import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border bg-[#134e48] px-3 py-2 text-base text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:border-[#188689] focus-visible:ring-2 focus-visible:ring-[#188689]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{ borderColor: "#052a2a" }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
