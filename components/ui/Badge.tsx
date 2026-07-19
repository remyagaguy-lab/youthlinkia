import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "neutral" | "info"
}

function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[var(--color-success)] text-white": variant === "success",
          "border-transparent bg-[var(--color-warning)] text-white": variant === "warning",
          "border-transparent bg-[var(--color-background)] text-[var(--color-foreground)]": variant === "neutral",
          "border-transparent bg-[var(--color-primary)] text-white": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
