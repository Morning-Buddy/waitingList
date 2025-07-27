"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
// import { Loader2 } from "lucide-react"; // Removed - using custom spinner
import * as React from "react";

interface AnimatedButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export function AnimatedButton({
  className,
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  variant = "default",
  ...props
}: AnimatedButtonProps) {
  // Determine if this should be a mascot-style button
  const isMascotButton = variant === "default" || className?.includes("gradient-button");
  
  return (
    <Button
      className={cn(
        // Base mascot button styling
        isMascotButton && "bubble-button",
        // Fallback for non-mascot buttons
        !isMascotButton && [
          "transition-all duration-200 ease-out",
          "hover:shadow-xl hover:brightness-110",
          "active:shadow-lg active:brightness-95",
          "transform-gpu will-change-auto",
        ],
        // Enhanced focus styles for accessibility
        "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
        // Loading state styling
        loading && "cursor-not-allowed opacity-90",
        // Reduced motion support
        "motion-reduce:transition-none motion-reduce:hover:brightness-100 motion-reduce:hover:shadow-none motion-reduce:active:brightness-100 motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        className
      )}
      variant={isMascotButton ? "ghost" : variant} // Use ghost to override default styling
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? "loading-description" : undefined}
      {...props}
    >
      {loading && (
        <>
          <div className="mascot-spinner mr-2" aria-hidden="true" />
          <span id="loading-description" className="sr-only">
            Button is loading, please wait
          </span>
        </>
      )}
      <span className={loading ? "opacity-75" : ""}>
        {loading ? loadingText : children}
      </span>
    </Button>
  );
}

// Export variants for consistency
export { buttonVariants };