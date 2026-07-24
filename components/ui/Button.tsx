import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cta" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
          {
            "bg-[var(--color-primary)] text-white hover:opacity-90": variant === "primary",
            "bg-[var(--color-cta)] text-white hover:opacity-90": variant === "cta",
            "border border-[var(--color-text-secondary)] bg-transparent hover:bg-[var(--color-background)] text-[var(--color-primary)]": variant === "outline",
            "hover:bg-[var(--color-background)] text-[var(--color-primary)]": variant === "ghost",
            "h-12 px-6 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-14 rounded-md px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

