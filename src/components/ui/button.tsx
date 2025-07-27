import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:from-amber-600 hover:to-orange-600 focus-visible:ring-amber-500/50",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500/50",
        outline:
          "border border-amber-200 bg-white text-amber-700 shadow-sm hover:bg-amber-50 hover:text-amber-800 focus-visible:ring-amber-500/50",
        secondary:
          "bg-amber-100 text-amber-900 shadow-sm hover:bg-amber-200 focus-visible:ring-amber-500/50",
        ghost:
          "text-amber-700 hover:bg-amber-100 hover:text-amber-800 focus-visible:ring-amber-500/50",
        link: "text-amber-600 underline-offset-4 hover:underline hover:text-amber-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
