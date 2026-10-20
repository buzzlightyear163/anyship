import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowUpRight, Check, Download, Loader2, Play, RotateCcw } from 'lucide-react'
import { AppIcon } from '../components/AppIcon'
import { BuildWindow } from '../components/BuildWindow'
import { LogPanel, ProgressHead, StageList } from '../components/BuildPanels'
import { CopyCA } from '../components/CopyCA'
import { PreviewModal, useLaunchFile } from '../components/PreviewModal'
import { StatusBadge } from '../components/StatusBadge'
import { useNow } from '../hooks/useBuilds'
import { useTitle } from '../hooks/useTitle'
import { buildElapsed, fileNameFor, getCoin, liveStatus } from '../lib/api'
import { BRAND, links } from '../lib/brand'
import { makeLog, progressAt, TOTAL_SECONDS } from '../lib/buildEngine'
import { templateFor } from '../data/windows'
import { timeAgo } from '../lib/format'
import { setOverride } from '../lib/storage'
import type { Launch } from '../lib/types'
import { wait } from '../lib/wallet'

const FORMAT_LABEL = { web: 'Web app', pwa: 'Installable web app', cli: 'Command-line tool' } as const

export default function Coin() {
  const { mint = '' } = useParams()
  const [coin, setCoin] = useState<Launch | null | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<Launch | null>(null)
  const now = useNow(500)

  useTitle(coin ? `${coin.name} ($${coin.ticker})` : 'Coin')

  useEffect(() => {
    let alive = true
    setCoin(undefined)
    getCoin(mint)
      .then((c) => alive && setCoin(c))
      .catch(() => alive && setCoin(null))
    return () => {
      alive = false
    }
  }, [mint])

  const log = useMemo(
    () => (coin ? makeLog({ name: coin.name, file: fileNameFor(coin), features: coin.features, sizeKb: coin.sizeKb }) : []),
    [coin],
  )
  const file = useLaunchFile(coin ?? null)

  if (coin === undefined) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-box">Loading coin…</div>
        </div>
      </div>
    )
  }

  if (coin === null) {
    return (
      <div className="page">
        <div className="container narrow-page">
          <h1 className="h1">Coin not found</h1>
          <p className="lead">There's no {BRAND.name} launch with that address. Coins launched somewhere else can't unlock builds.</p>
          <Link to="/apps#launches" className="btn btn-secondary">
            <ArrowLeft size={15} /> See all launches
          </Link>
        </div>
      </div>
    )
  }

  const status = liveStatus(coin, now)
  const elapsed = status === 'ready' ? TOTAL_SECONDS : status === 'building' ? buildElapsed(coin, now) : 0
  const p = progressAt(elapsed)

  async function startBuild() {
    if (!coin) return
    setBusy(true)
    await wait(1100) // TODO(backend): POST /api/feeshare confirm + POST /api/generate
    const patch: Partial<Launch> = { status: 'building', startedAt: Date.now(), speed: 30 }
    setOverride(coin.mint, patch)
    setCoin({ ...coin, ...patch })
    setBusy(false)
  }

  return (
    <div className="page coin-page">
      <div className="container">
        <Link to="/apps#launches" className="back-link">
          <ArrowLeft size={15} /> Live launches
        </Link>

        <header className="coin-head">
          <div className="coin-id">
            <AppIcon name={coin.name} src={coin.icon} size={60} />
            <div>
              <div className="coin-title">
                <h1>{coin.name}</h1>
                <span className="mono coin-ticker">${coin.ticker}</span>
              </div>
              <div className="coin-sub">
                <StatusBadge status={status} stage={status === 'building' ? p.stage.label : undefined} />
                <span className="muted">
                  Inspired by {coin.inspiredBy} · launched {timeAgo(coin.launchedAt, now)}
                </span>
              </div>
            </div>
          </div>
          <div className="coin-actions">
            <CopyCA value={coin.mint} />
            <a className="btn btn-secondary btn-sm" href={links.pumpFun(coin.mint)} target="_blank" rel="noreferrer">
              pump.fun <ArrowUpRight size={13} />
            </a>
            <a className="btn btn-secondary btn-sm" href={links.solscan(coin.mint)} target="_blank" rel="noreferrer">
              Solscan <ArrowUpRight size={13} />
            </a>
          </div>
        </header>

        <div className="coin-grid">
          <section className="card coin-build">
            <div className="card-head">
              <h2>Build</h2>
              {(coin.speed ?? 1) > 1 && status === 'building' && <span className="tag">Demo build at {coin.speed}×</span>}
            </div>

            {status === 'feesplit' && (
              <div className="notice notice-warn">
                <AlertTriangle size={18} />
                <div>
                  <strong>Waiting for the fee split</strong>
                  <p>The coin is live, but the 50/50 split isn't confirmed yet. The build starts as soon as it is.</p>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={startBuild} disabled={busy}>
                  {busy ? <Loader2 size={14} className="spin" /> : null} Finish setup
                </button>
              </div>
            )}
            {status === 'failed' && (
              <div className="notice notice-fail">
                <AlertTriangle size={18} />
                <div>
                  <strong>The build stopped during Test</strong>
                  <p>Retries from the same coin are free.</p>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={startBuild} disabled={busy}>
                  {busy ? <Loader2 size={14} className="spin" /> : <RotateCcw size={14} />} Retry build
                </button>
              </div>
            )}

            <div className="coin-preview">
              <BuildWindow template={templateFor(coin.kind)} fileName={file.name} progress={elapsed / TOTAL_SECONDS} />
            </div>

            {(status === 'building' || status === 'ready') && (
              <>
                <ProgressHead elapsed={elapsed} />
                <StageList elapsed={elapsed} />
                <LogPanel log={log} elapsed={elapsed} />
              </>
            )}
          </section>

          <div className="coin-side">
            <section className="card">
              <div className="card-head">
                <h2>Your file</h2>
              </div>
              <div className="file-row">
                <span className="result-ext mono">{coin.format === 'cli' ? 'MJS' : 'HTML'}</span>
                <div>
                  <strong className="mono">{file.name}</strong>
                  <span>{status === 'ready' ? `${coin.sizeKb ? `${coin.sizeKb} KB · ` : ''}${FORMAT_LABEL[coin.format]}` : 'Available when the build is done'}</span>
                </div>
              </div>
              <div className="file-actions">
                <button type="button" className="btn btn-primary btn-sm" disabled={status !== 'ready'} onClick={() => setPreview(coin)}>
                  <Play size={13} /> Preview
                </button>
                {status === 'ready' ? (
                  <a className="btn btn-secondary btn-sm" href={file.url} download={file.name}>
                    <Download size={13} /> Download
                  </a>
                ) : (
                  <button type="button" className="btn btn-secondary btn-sm" disabled>
                    <Download size={13} /> Download
                  </button>
                )}
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Fee split</h2>
                {status === 'feesplit' ? (
                  <span className="badge badge-warn">Not set</span>
                ) : (
                  <span className="badge badge-ready">
                    <Check size={12} strokeWidth={3} /> Confirmed
                  </span>
                )}
              </div>
              <div className="split-legend">
                <span>
                  <i className="sw sw-you" /> Launcher <strong>{BRAND.creatorShare}%</strong>
                </span>
                <span>
                  <i className="sw sw-plat" /> {BRAND.name} <strong>{100 - BRAND.creatorShare}%</strong>
                </span>
              </div>
              <div className="split-bar">
                <span style={{ width: `${BRAND.creatorShare}%` }} />
              </div>
              <p className="small muted">Every trade on pump.fun pays creator fees, split on-chain.</p>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Coin</h2>
              </div>
              <dl className="sum-rows">
                <div>
                  <dt>Inspired by</dt>
                  <dd>{coin.inspiredBy}</dd>
                </div>
                <div>
                  <dt>Ships as</dt>
                  <dd>{FORMAT_LABEL[coin.format]}</dd>
                </div>
                <div>
                  <dt>Launch fee</dt>
                  <dd className="mono">{BRAND.launchFeeSol} SOL</dd>
                </div>
                {!!coin.devBuy && (
                  <div>
                    <dt>Dev buy</dt>
                    <dd className="mono">{coin.devBuy} SOL</dd>
                  </div>
                )}
                <div>
                  <dt>Features</dt>
                  <dd>{coin.features.length}</dd>
                </div>
              </dl>
              <details className="spec">
                <summary>Spec the model saw</summary>
                <ol>
                  {coin.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ol>
              </details>
            </section>
          </div>
        </div>
      </div>
      <PreviewModal launch={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
