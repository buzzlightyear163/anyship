import { useCallback, useEffect, useRef, useState } from 'react'
import { TOTAL_SECONDS } from '../lib/buildEngine'

/** Spelar upp en build i given hastighet. `speed` = simulerade sekunder per verklig sekund. */
export function useReplay(initialSpeed: number) {
  const [speed, setSpeedState] = useState(initialSpeed)
  const [elapsed, setElapsed] = useState(0)
  const base = useRef({ real: performance.now(), sim: 0 })
  const speedRef = useRef(initialSpeed)

  useEffect(() => {
    const id = window.setInterval(() => {
      const sim = base.current.sim + ((performance.now() - base.current.real) / 1000) * speedRef.current
      setElapsed(Math.min(sim, TOTAL_SECONDS))
    }, 100)
    return () => window.clearInterval(id)
  }, [])

  const setSpeed = useCallback((next: number) => {
    const now = performance.now()
    const sim = base.current.sim + ((now - base.current.real) / 1000) * speedRef.current
    base.current = { real: now, sim: Math.min(sim, TOTAL_SECONDS) }
    speedRef.current = next
    setSpeedState(next)
  }, [])

  const restart = useCallback(() => {
    base.current = { real: performance.now(), sim: 0 }
    setElapsed(0)
  }, [])

  return { elapsed, speed, setSpeed, restart, done: elapsed >= TOTAL_SECONDS }
}
