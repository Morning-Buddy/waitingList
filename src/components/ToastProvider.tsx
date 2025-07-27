"use client";

import { Toaster } from "@/components/ui/sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #fbbf24", // amber-400 border
          color: "#374151",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        className: "toast font-medium",
        duration: 4000,
        // Custom styling for different toast types
        classNames: {
          error: "border-red-400 text-red-700",
          success: "border-green-400 text-green-700",
          warning: "border-amber-400 text-amber-700",
          info: "border-blue-400 text-blue-700",
        },
      }}
    />
  );
}