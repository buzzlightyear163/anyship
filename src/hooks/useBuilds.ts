import { useEffect, useState } from 'react'
import { getBuilds } from '../lib/api'
import type { Launch, Stats } from '../lib/types'

export function useBuilds() {
  const [state, setState] = useState<{ loading: boolean; error: string | null; stats: Stats | null; launches: Launch[] }>({
    loading: true,
    error: null,
    stats: null,
    launches: [],
  })

  useEffect(() => {
    let alive = true
    getBuilds()
      .then((d) => alive && setState({ loading: false, error: null, stats: d.stats, launches: d.launches }))
      .catch((e: unknown) => alive && setState((s) => ({ ...s, loading: false, error: String(e) })))
    return () => {
      alive = false
    }
  }, [])

  return state
}

/** Tickar varje `ms` så att relativa tider och pågående builds uppdateras. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms)
    return () => window.clearInterval(id)
  }, [ms])
  return now
}
