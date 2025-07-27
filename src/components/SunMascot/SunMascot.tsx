// --- src/components/SunMascot/SunMascot.tsx

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'
import Ray from './Ray'
import { Expression, getExpressionConfig, EyeType, MouthType, getRandomExpression } from './expressions'

// Import custom wrapper components
import BaseWrapper from './BaseWrapper'

// Eye components
import EyeNormal from '../../icons/Eyes/Normal'
import EyeBig from '../../icons/Eyes/Big'
import EyeClosed from '../../icons/Eyes/Closed'
import EyeConfused from '../../icons/Eyes/Confused'
import EyeHappy from '../../icons/Eyes/Happy'
import EyeLove from '../../icons/Eyes/Love'
import EyeMotivated from '../../icons/Eyes/Motivated'
import EyeStar from '../../icons/Eyes/Star'

// Mouth components
import MouthSmile from '../../icons/Mouths/Smile'
import MouthExcited from '../../icons/Mouths/Excited'
import MouthFrown from '../../icons/Mouths/Frown'
import MouthShock from '../../icons/Mouths/Shock'
import MouthSly from '../../icons/Mouths/Sly'

interface SunMascotProps {
  expression?: Expression
  className?: string
  size?: number
}

export const SunMascot = ({ expression = 'idle', className, size = 400 }: SunMascotProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [scrollOffset, setScrollOffset] = useState(0)
  const [currentExpression, setCurrentExpression] = useState<Expression>(expression)
  const [isAsleep, setIsAsleep] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showZs, setShowZs] = useState(false)
  const [sleepMouthOpen, setSleepMouthOpen] = useState(false)
  const [isMouseNear, setIsMouseNear] = useState(false)
  const [showSlyMouth, setShowSlyMouth] = useState(false)
  const [isMouseAboveEyes, setIsMouseAboveEyes] = useState(false)
  const [isMouseOnRays, setIsMouseOnRays] = useState(false)
  const [showRays, setShowRays] = useState(true)
  const [lookingAroundMouth, setLookingAroundMouth] = useState<MouthType | null>(null)

  const mascotRef = useRef<HTMLDivElement>(null)
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const config = getExpressionConfig(isAsleep ? 'idle' : currentExpression)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Track user activity for sleep feature
  const resetActivity = useCallback(() => {
    setLastActivity(Date.now())
    if (isAsleep) {
      setIsAsleep(false)
      setShowZs(false)
      setShowRays(true) // Show rays when waking up
      setCurrentExpression(expression)
    }
  }, [isAsleep, expression])

  // Mouse movement tracking for eye following and all interactions
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      resetActivity()

      if (!mascotRef.current) return

      const rect = mascotRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Calculate distance for proximity detection
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Always check if mouse is close (within 150px) for shock face
      setIsMouseNear(distance < 150)

      // Check if mouse is above eyes (happy zone)
      const eyeZoneY = centerY - 30 // Eyes are positioned -30px from center
      const isAboveEyes = e.clientY < eyeZoneY && Math.abs(deltaX) < 60 && Math.abs(deltaY) < 80
      setIsMouseAboveEyes(isAboveEyes)

      // Check if mouse is on rays (sad zone)
      const rayZoneX = rect.left + (rect.width * 0.38) // 38% from left
      const rayZoneY = rect.top + 20 // 20px from top
      const isOnRays = Math.abs(e.clientX - rayZoneX) < 100 && Math.abs(e.clientY - rayZoneY) < 60
      setIsMouseOnRays(isOnRays)

      // Eyes always follow mouse
      const maxMovement = 8
      const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 100, 1) * maxMovement : 0
      const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 100, 1) * maxMovement : 0

      setEyePosition({ x: normalizedX, y: normalizedY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReducedMotion, isAsleep, resetActivity])

  // Scroll tracking for face movement
  useEffect(() => {
    const handleScroll = () => {
      resetActivity()
      const scrollY = window.scrollY
      const maxOffset = 15
      const offset = Math.min(scrollY / 10, maxOffset)
      setScrollOffset(offset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [resetActivity])

  // Activity monitoring for sleep
  useEffect(() => {
    const checkActivity = () => {
      const now = Date.now()
      if (now - lastActivity > 20000 && !isAsleep) { // 20 seconds
        setIsAsleep(true)
        setShowZs(true)
        setShowRays(false) // Hide rays when sleeping
        setCurrentExpression('idle')
      }
    }

    const interval = setInterval(checkActivity, 1000)
    return () => clearInterval(interval)
  }, [lastActivity, isAsleep])

  // Ray visibility animation for sleep/wake
  useEffect(() => {
    if (!isAsleep && !showRays) {
      // Show rays with pop animation when waking up
      setTimeout(() => setShowRays(true), 300)
    }
  }, [isAsleep, showRays])

  // Sleep mouth animation
  useEffect(() => {
    if (!isAsleep) return

    const animateSleepMouth = () => {
      setSleepMouthOpen(prev => !prev)
    }

    const interval = setInterval(animateSleepMouth, 2000) // Toggle every 2 seconds
    return () => clearInterval(interval)
  }, [isAsleep])

  // Sly mouth animation when smiling
  useEffect(() => {
    if (isAsleep || isMouseNear || config.mouth !== 'Smile') return

    const showSly = () => {
      setShowSlyMouth(true)
      setTimeout(() => setShowSlyMouth(false), 1000) // Show sly for 1 second
    }

    const interval = setInterval(showSly, 8000 + Math.random() * 7000) // Every 8-15 seconds
    return () => clearInterval(interval)
  }, [isAsleep, isMouseNear, config.mouth])

  // Occasional mouth movement as if looking around
  useEffect(() => {
    if (isAsleep || isMouseNear || isMouseAboveEyes || isMouseOnRays) return

    const lookAround = () => {
      const mouthOptions: MouthType[] = ['Sly', 'Smile', 'Frown']
      const randomMouth = mouthOptions[Math.floor(Math.random() * mouthOptions.length)]
      setLookingAroundMouth(randomMouth)

      setTimeout(() => setLookingAroundMouth(null), 800) // Show for 800ms
    }

    const interval = setInterval(lookAround, 6000 + Math.random() * 9000) // Every 6-15 seconds
    return () => clearInterval(interval)
  }, [isAsleep, isMouseNear, isMouseAboveEyes, isMouseOnRays])

  // Blinking animation
  useEffect(() => {
    if (prefersReducedMotion || isAsleep) return

    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 4000 // 3-7 seconds
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setIsBlinking(false)
          scheduleNextBlink()
        }, 150)
      }, delay)
    }

    scheduleNextBlink()

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current)
      }
    }
  }, [prefersReducedMotion, isAsleep])

  // Click handler for expression change
  const handleClick = () => {
    resetActivity()
    if (isAsleep) return

    const newExpression = getRandomExpression()
    setCurrentExpression(newExpression)

    // Return to original expression after 3 seconds
    setTimeout(() => {
      setCurrentExpression(expression)
    }, 3000)
  }

  // Eye component mapping
  const eyeComponents: Record<EyeType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    Normal: EyeNormal,
    Big: EyeBig,
    Closed: EyeClosed,
    Confused: EyeConfused,
    Happy: EyeHappy,
    Love: EyeLove,
    Motivated: EyeMotivated,
    Star: EyeStar
  }

  // Mouth component mapping
  const mouthComponents: Record<MouthType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    Smile: MouthSmile,
    Excited: MouthExcited,
    Frown: MouthFrown,
    Shock: MouthShock,
    Sly: MouthSly
  }

  const EyeComponent = eyeComponents[isBlinking || isAsleep ? 'Closed' : config.eye]

  // Determine mouth based on various states (priority order)
  const getMouthType = (): MouthType => {
    if (isAsleep) {
      return sleepMouthOpen ? 'Shock' : 'Smile'
    }
    if (isMouseOnRays) {
      return 'Frown' // Sad when touching rays
    }
    if (isMouseAboveEyes) {
      return 'Excited' // Happy when above eyes
    }
    if (isMouseNear) {
      return 'Shock' // Shocked when mouse is near
    }
    if (lookingAroundMouth) {
      return lookingAroundMouth // Looking around animation
    }
    if (config.mouth === 'Smile' && showSlyMouth) {
      return 'Sly'
    }
    return config.mouth
  }

  const MouthComponent = mouthComponents[getMouthType()]

  return (
    <div
      ref={mascotRef}
      className={`relative transform-gpu cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Main mascot container */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: scrollOffset
        }}
        transition={{
          opacity: { duration: 1, delay: 0.3, ease: 'easeOut' },
          scale: { duration: 1, delay: 0.3, ease: 'easeOut' },
          y: { duration: 0.3, ease: 'easeOut' }
        }}
      >
        {/* Rays positioned at 20px from top and 38% from left */}
        <AnimatePresence>
          {showRays && (
            <motion.div
              className="absolute"
              style={{
                top: '20px',
                left: '38%',
                zIndex: 25
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                duration: 0.4
              }}
            >
              {[...Array(4)].map((_, i) => (
                <Ray key={i} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Base sun body */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
        >
          <BaseWrapper
            width={size}
            height={size}
            className="drop-shadow-lg"
          />
        </motion.div>

        {/* Eyes with morphing transitions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 5 }}
          animate={{
            x: eyePosition.x,
            y: eyePosition.y - 30 + scrollOffset * 0.5
          }}
          transition={{
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <motion.div
            key={`eyes-${config.eye}-${isBlinking}-${isAsleep}`}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <EyeComponent
              width={size * 0.35}
              height={size * 0.18}
              className="drop-shadow-sm"
            />
          </motion.div>
        </motion.div>

        {/* Mouth with morphing transitions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 5 }}
          animate={{
            y: 20 + scrollOffset * 0.5
          }}
          transition={{
            y: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <motion.div
            key={`mouth-${getMouthType()}-${sleepMouthOpen}-${isMouseNear}-${isMouseAboveEyes}-${isMouseOnRays}-${showSlyMouth}-${lookingAroundMouth}`}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <MouthComponent
              width={size * 0.35}
              height={size * 0.18}
              className="drop-shadow-sm"
            />
          </motion.div>
        </motion.div>

        {/* Sleep Z's */}
        <AnimatePresence>
          {showZs && (
            <motion.div
              className="absolute top-4 right-4"
              style={{ zIndex: 25 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-600 font-bold"
                  style={{
                    fontSize: `${20 + i * 6}px`,
                    left: `${i * 12}px`,
                    top: `${i * -8}px`,
                  }}
                  animate={{
                    y: [-3, 3, -3],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  Z
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}