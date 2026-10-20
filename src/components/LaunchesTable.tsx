import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useNow } from '../hooks/useBuilds'
import { liveStage, liveStatus } from '../lib/api'
import { timeAgo } from '../lib/format'
import type { Launch } from '../lib/types'
import { AppIcon } from './AppIcon'
import { StatusBadge } from './StatusBadge'

interface Props {
  launches: Launch[]
  loading?: boolean
  error?: string | null
  limit?: number
}

export function LaunchesTable({ launches, loading, error, limit }: Props) {
  const now = useNow(2000)
  const rows = limit ? launches.slice(0, limit) : launches

  return (
    <div className="ltable" role="table" aria-label="Launches">
      <div className="lrow lhead" role="row">
        <span role="columnheader">App</span>
        <span role="columnheader" className="lc-insp">
          Inspired by
        </span>
        <span role="columnheader">Status</span>
        <span role="columnheader" className="lc-coin">
          Coin
        </span>
        <span role="columnheader" className="lc-time">
          Launched
        </span>
        <span role="columnheader" aria-label="Open" />
      </div>
      {loading && (
        <div className="lrow lempty" role="row">
          <span>Loading launches…</span>
        </div>
      )}
      {!loading && error && (
        <div className="lrow lempty" role="row">
          <span>Couldn't load launches. Refresh to try again.</span>
        </div>
      )}
      {!loading && !error && rows.length === 0 && (
        <div className="lrow lempty" role="row">
          <span>No launches yet.</span>
        </div>
      )}
      {rows.map((l) => {
        const status = liveStatus(l, now)
        return (
          <Link key={l.mint} to={`/coin/${l.mint}`} className="lrow" role="row">
            <span className="lc-app" role="cell">
              <AppIcon name={l.name} src={l.icon} size={32} />
              <span className="lc-app-text">
                <strong>{l.name}</strong>
                <small>
                  {l.inspiredBy} · {timeAgo(l.launchedAt, now)}
                </small>
              </span>
            </span>
            <span className="lc-insp" role="cell">
              {l.inspiredBy}
            </span>
            <span role="cell">
              <StatusBadge status={status} stage={status === 'building' ? liveStage(l, now).label : undefined} />
            </span>
            <span className="lc-coin mono" role="cell">
              ${l.ticker}
            </span>
            <span className="lc-time" role="cell">
              {timeAgo(l.launchedAt, now)}
            </span>
            <span className="lc-go" role="cell" aria-hidden="true">
              <ChevronRight size={16} />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
