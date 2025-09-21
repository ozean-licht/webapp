import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-[#134e48] px-3 py-2 text-base text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:border-[#188689] focus-visible:ring-2 focus-visible:ring-[#188689]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{ borderColor: "#052a2a" }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
