// --- src/components/SunMascot/Ray.tsx

'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import RayWrapper from './RayWrapper'

interface RayProps {
  index: number
  className?: string
}

const Ray = ({ index, className }: RayProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Use ray number based on index (1-4)
  const rayNumber = (index + 1) as 1 | 2 | 3 | 4

  // Position rays to cut through the speech bubble (4 rays total)
  // Longer, more spread out, positioned higher up
  const positions = [
    { x: -120, y: 20, rotation: 0 }, // Far left
    { x: -40, y: -20, rotation: 0 }, // Top-left
    { x: 40, y: -20, rotation: 0 },  // Top-right
    { x: 120, y: 20, rotation: 0 }   // Far right
  ]

  const position = positions[index]

  // Get animation properties for gentle floating
  const getAnimationProps = () => {
    if (prefersReducedMotion) {
      return {
        initial: { y: 0, opacity: 1 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 }
      }
    }

    return {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: [-4, 4, -4], // Gentle floating movement
        opacity: 1, // Keep solid opacity
      },
      transition: {
        duration: 2.5 + (index * 0.3), // Stagger the timing
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: index * 0.4 // Stagger the start
      }
    }
  }

  const animationProps = getAnimationProps()

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: 'center',
        willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
        zIndex: 30 // Ensure rays appear in front of everything
      }}
      initial={animationProps.initial}
      animate={animationProps.animate}
      transition={animationProps.transition}
    >
      <RayWrapper 
        rayNumber={rayNumber}
        width={100} 
        height={120}
        style={{
          transform: `rotate(${position.rotation}deg)`,
          filter: 'drop-shadow(0 2px 6px rgba(251, 173, 2, 0.3))'
        }}
      />
    </motion.div>
  )
}

export default Ray