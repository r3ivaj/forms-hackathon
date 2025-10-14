import { useState, useEffect, useCallback } from 'react'

interface UseTimerProps {
  durationMinutes: number
  onTimeExpired?: () => void
}

interface UseTimerReturn {
  timeLeft: number
  isExpired: boolean
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  formatTime: (seconds: number) => string
}

export function useTimer({
  durationMinutes,
  onTimeExpired,
}: UseTimerProps): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60) // Convert to seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  const start = useCallback(() => {
    setIsRunning(true)
    setIsExpired(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(durationMinutes * 60)
    setIsRunning(false)
    setIsExpired(false)
  }, [durationMinutes])

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsExpired(true)
            onTimeExpired?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, timeLeft, onTimeExpired])

  return {
    timeLeft,
    isExpired,
    isRunning,
    start,
    pause,
    reset,
    formatTime,
  }
}
