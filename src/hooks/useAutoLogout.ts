import { useEffect, useRef, useState, useCallback } from 'react'

const INACTIVITY_MS = 15 * 60 * 1000   // 15 minutes idle → warning
const COUNTDOWN_S   = 60                 // 60-second countdown before forced logout

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click',
]

export function useAutoLogout(onLogout: () => void) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown]     = useState(COUNTDOWN_S)

  const idleTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const warningRef   = useRef(false)

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_S)
    clearCountdown()
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearCountdown()
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [onLogout])

  const resetIdle = useCallback(() => {
    // Dismiss warning and restart idle timer on any activity
    if (warningRef.current) {
      warningRef.current = false
      setShowWarning(false)
      clearCountdown()
      setCountdown(COUNTDOWN_S)
    }

    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      warningRef.current = true
      setShowWarning(true)
      startCountdown()
    }, INACTIVITY_MS)
  }, [startCountdown])

  // Attach activity listeners
  useEffect(() => {
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetIdle, { passive: true }))
    resetIdle() // start the idle timer immediately

    return () => {
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetIdle))
      if (idleTimer.current)    clearTimeout(idleTimer.current)
      clearCountdown()
    }
  }, [resetIdle])

  const stayLoggedIn = useCallback(() => {
    resetIdle()
  }, [resetIdle])

  return { showWarning, countdown, stayLoggedIn }
}
