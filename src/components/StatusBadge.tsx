import type { BuildStatus } from '../lib/types'

export function StatusBadge({ status, stage }: { status: BuildStatus; stage?: string }) {
  switch (status) {
    case 'ready':
      return (
        <span className="badge badge-ready">
          <span className="dot" /> Ready
        </span>
      )
    case 'building':
      return (
        <span className="badge badge-building">
          <span className="dot dot-pulse" /> {stage ? `Building · ${stage}` : 'Building'}
        </span>
      )
    case 'feesplit':
      return (
        <span className="badge badge-warn">
          <span className="dot" /> Needs fee split
        </span>
      )
    case 'failed':
      return (
        <span className="badge badge-failed">
          <span className="dot" /> Failed
        </span>
      )
  }
}
