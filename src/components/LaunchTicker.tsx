import { Link } from 'react-router-dom'
import { useNow } from '../hooks/useBuilds'
import { liveStage, liveStatus } from '../lib/api'
import type { Launch } from '../lib/types'

/** Löpande rad med de senaste launcharna under hero. */
export function LaunchTicker({ launches }: { launches: Launch[] }) {
  const now = useNow(4000)
  if (launches.length === 0) return <div className="ticker ticker-empty" />
  const items = launches.slice(0, 12)
  const row = (hidden: boolean) => items.map((l) => {
    const st = liveStatus(l, now)
    const label = st === 'building' ? `Building · ${liveStage(l, now).label}` : st === 'ready' ? 'Ready' : st === 'feesplit' ? 'Fee split' : 'Failed'
    return (
      <Link key={l.mint} to={`/coin/${l.mint}`} className={`tick-item st-${st}`} tabIndex={hidden ? -1 : undefined}>
        <i />
        <strong>{l.name}</strong>
        <span className="mono">${l.ticker}</span>
        <span className="tick-st">{label}</span>
      </Link>
    )
  })
  return (
    <div className="ticker" aria-label="Latest launches">
      <div className="ticker-track">
        <div className="ticker-row">{row(false)}</div>
        <div className="ticker-row" aria-hidden="true">
          {row(true)}
        </div>
      </div>
    </div>
  )
}
