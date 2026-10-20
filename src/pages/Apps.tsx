import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Download, Play } from 'lucide-react'
import { AppIcon } from '../components/AppIcon'
import { LaunchesTable } from '../components/LaunchesTable'
import { PreviewModal, useLaunchFile } from '../components/PreviewModal'
import { useBuilds, useNow } from '../hooks/useBuilds'
import { useTitle } from '../hooks/useTitle'
import { liveStatus } from '../lib/api'
import { BRAND } from '../lib/brand'
import { CATALOG } from '../data/catalog'
import type { Launch } from '../lib/types'

const FORMAT_LABEL = { web: 'Web app', pwa: 'Installable', cli: 'Command line' } as const

function ReadyCard({ l, onOpen }: { l: Launch; onOpen: (l: Launch) => void }) {
  const { url, name } = useLaunchFile(l)
  return (
    <article className="ready-card">
      <Link to={`/coin/${l.mint}`} className="ready-top">
        <AppIcon name={l.name} src={l.icon} size={44} />
        <div>
          <strong>{l.name}</strong>
          <span>Inspired by {l.inspiredBy}</span>
        </div>
      </Link>
      <div className="ready-meta">
        <span className="tag">{FORMAT_LABEL[l.format]}</span>
        <span className="mono faint">{name}</span>
      </div>
      <div className="ready-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(l)}>
          <Play size={13} /> Open
        </button>
        <a className="btn btn-secondary btn-sm" href={url} download={name}>
          <Download size={13} /> Download
        </a>
        <span className="mono ready-ticker">${l.ticker}</span>
      </div>
    </article>
  )
}

export default function Apps() {
  useTitle('Apps', `Finished ${BRAND.name} apps you can open or download, plus every launch and its live build status.`)
  const { hash } = useLocation()
  const navigate = useNavigate()
  const { stats, launches, loading, error } = useBuilds()
  const now = useNow(5000)
  const [tab, setTab] = useState<'ready' | 'launches'>(hash === '#launches' ? 'launches' : 'ready')
  const [preview, setPreview] = useState<Launch | null>(null)

  useEffect(() => {
    if (hash === '#launches') setTab('launches')
  }, [hash])

  const ready = useMemo(() => launches.filter((l) => liveStatus(l, now) === 'ready'), [launches, now])

  function pick(next: 'ready' | 'launches') {
    setTab(next)
    navigate(next === 'launches' ? '/apps#launches' : '/apps', { replace: true })
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1 className="h1">Apps</h1>
          <p className="lead">Every coin launched on {BRAND.name}, where its build is at, and the finished apps you can open or download.</p>
        </header>

        <div className="stats">
          <div className="stat">
            <span>Builds shipped</span>
            <strong>{stats ? stats.shipped.toLocaleString('en-US') : '–'}</strong>
            <small>Ready to use</small>
          </div>
          <div className="stat">
            <span>Started this week</span>
            <strong>{stats ? stats.startedThisWeek : '–'}</strong>
            <small>Across all launches</small>
          </div>
          <div className="stat">
            <span>Median build time</span>
            <strong>{stats ? `${stats.medianBuildMinutes} min` : '–'}</strong>
            <small>Plan to package</small>
          </div>
        </div>

        <div className="tabs" role="tablist" id="launches">
          <button type="button" role="tab" aria-selected={tab === 'ready'} className={tab === 'ready' ? 'active' : ''} onClick={() => pick('ready')}>
            Ready to use <span className="count">{loading ? '–' : ready.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'launches'} className={tab === 'launches' ? 'active' : ''} onClick={() => pick('launches')}>
            Live launches <span className="count">{loading ? '–' : launches.length}</span>
          </button>
        </div>

        {tab === 'ready' ? (
          loading ? (
            <div className="empty-box">Loading apps…</div>
          ) : ready.length === 0 ? (
            <div className="empty-box">No finished apps yet.</div>
          ) : (
            <div className="ready-grid">
              {ready.map((l) => (
                <ReadyCard key={l.mint} l={l} onOpen={setPreview} />
              ))}
            </div>
          )
        ) : (
          <LaunchesTable launches={launches} loading={loading} error={error} />
        )}

        <div className="cta-cards">
          <div className="cta-card">
            <span className="eyebrow">Demo</span>
            <h3>Watch a build</h3>
            <p>See the five build stages run, from plan to a finished file.</p>
            <Link to="/watch" className="btn btn-secondary btn-sm">
              Watch a build <ArrowRight size={14} />
            </Link>
          </div>
          <div className="cta-card">
            <span className="eyebrow">Request rebuild</span>
            <h3>Something else</h3>
            <p>Pick any of {CATALOG.length} paid apps and launch your own version.</p>
            <Link to="/catalog" className="btn btn-secondary btn-sm">
              Browse software <ArrowRight size={14} />
            </Link>
          </div>
          <div className="cta-card">
            <span className="eyebrow">Submit</span>
            <h3>Get featured</h3>
            <p>Built an open-source alternative? Here's how to get it listed.</p>
            <Link to="/docs#apps" className="btn btn-secondary btn-sm">
              Read how <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <PreviewModal launch={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
