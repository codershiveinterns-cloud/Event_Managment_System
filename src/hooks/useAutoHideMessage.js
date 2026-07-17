import { useEffect } from 'react'

export default function useAutoHideMessage(message, onClear, duration = 7000) {
  useEffect(() => {
    if (!message) return undefined

    const timer = window.setTimeout(onClear, duration)
    return () => window.clearTimeout(timer)
  }, [duration, message, onClear])
}
