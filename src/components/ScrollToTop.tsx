"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Scroll to top when component mounts (page loads)
    window.scrollTo(0, 0);
    
    // Also handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null; // This component doesn't render anything
}