import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Clock, ImagePlus, Plus, Sparkles, Terminal, Trash2, Smartphone, Globe } from 'lucide-react'
import { AppIcon } from '../components/AppIcon'
import { BuildWindow } from '../components/BuildWindow'
import { KindIcon } from '../components/KindIcon'
import { LaunchModal } from '../components/LaunchModal'
import { SOMETHING_ELSE, START_APPS } from '../data/apps'
import { findCatalog } from '../data/catalog'
import { templateFor } from '../data/windows'
import { DEFAULT_CHECKED, FEATURES, KIND_LABEL } from '../data/features'
import { useTitle } from '../hooks/useTitle'
import { BRAND } from '../lib/brand'
import { slugify } from '../lib/format'
import type { Kind, ShipFormat } from '../lib/types'

const FORMATS: { id: ShipFormat; title: string; text: string; tag: string; icon: typeof Globe }[] = [
  { id: 'web', title: 'Web app', text: 'One .html file that runs anywhere', tag: 'Web app', icon: Globe },
  { id: 'pwa', title: 'Installable app', text: 'Add it to a home screen or dock', tag: 'Installable web app', icon: Smartphone },
  { id: 'cli', title: 'Command line', text: 'A Node script for the terminal', tag: 'Command-line tool', icon: Terminal },
]

const GENERIC_WORDS = new Set(['pro', 'plus', 'premium', 'studio', 'basic', 'standard', 'team', 'personal', 'online', 'desktop', 'starter', 'suite', 'max', 'microsoft', 'adobe', 'google', 'apple', 'autodesk'])

function protectedWords(inspiredBy: string) {
  return inspiredBy
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !GENERIC_WORDS.has(w))
}

async function toIcon(file: File): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('Could not read that image.'))
      i.src = url
    })
    const size = 256
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    if (!ctx) throw new Error('Canvas not available.')
    const s = Math.min(img.naturalWidth, img.naturalHeight)
    ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size)
    return c.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function Build() {
  useTitle('Launch', `Pick an app, launch its coin on ${BRAND.name}, and get an original version built from scratch.`)
  const [params] = useSearchParams()
  const fromItem = findCatalog(params.get('from'))

  const [sel, setSel] = useState<string | null>(() => {
    if (fromItem) return `catalog:${fromItem.slug}`
    const app = params.get('app')
    if (app && (app === SOMETHING_ELSE || START_APPS.some((a) => a.slug === app))) return app
    if (params.get('idea')) return SOMETHING_ELSE
    return null
  })
  const [idea, setIdea] = useState(params.get('idea') ?? '')
  const [checked, setChecked] = useState<string[]>([])
  const [custom, setCustom] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [extra, setExtra] = useState('')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [tickerTouched, setTickerTouched] = useState(false)
  const [icon, setIcon] = useState<string | undefined>()
  const [iconError, setIconError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [format, setFormat] = useState<ShipFormat>('web')
  const [devBuy, setDevBuy] = useState('')
  const [modal, setModal] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const selection = useMemo((): { inspiredBy: string; kind: Kind } | null => {
    if (!sel) return null
    if (sel === SOMETHING_ELSE) return { inspiredBy: '', kind: 'generic' }
    if (sel.startsWith('catalog:')) {
      const item = findCatalog(sel.slice(8))
      return item ? { inspiredBy: item.name, kind: item.kind } : null
    }
    const a = START_APPS.find((x) => x.slug === sel)
    return a ? { inspiredBy: a.name, kind: a.kind } : null
  }, [sel])

  const available = useMemo(() => (selection && sel !== SOMETHING_ELSE ? FEATURES[selection.kind] : []), [selection, sel])

  // Nytt val → förbocka de första funktionerna
  useEffect(() => {
    setChecked(available.slice(0, DEFAULT_CHECKED))
  }, [available])

  // Föreslå ticker från namnet tills användaren skriver en egen
  useEffect(() => {
    if (tickerTouched) return
    const t = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)
    setTicker(t)
  }, [name, tickerTouched])

  const features = useMemo(() => [...available.filter((f) => checked.includes(f)), ...custom], [available, checked, custom])
  const ext = format === 'cli' ? 'mjs' : 'html'
  const fileName = `${name.trim() ? slugify(name) : 'your-app'}.${ext}`
  const fmt = FORMATS.find((f) => f.id === format)!

  const nameError = useMemo(() => {
    if (!selection?.inspiredBy || !name.trim()) return null
    const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const hit = protectedWords(selection.inspiredBy).find((w) => lower.includes(w))
    return hit ? `Pick an original name. It can't reuse “${selection.inspiredBy}”.` : null
  }, [name, selection])

  const devBuyNum = Math.max(0, Number(devBuy) || 0)
  const total = BRAND.launchFeeSol + devBuyNum

  const blocker = !sel
    ? 'Pick an app to start'
    : sel === SOMETHING_ELSE && !idea.trim() && custom.length === 0
      ? 'Describe your app or add a feature'
      : features.length === 0 && !extra.trim() && sel !== SOMETHING_ELSE
        ? 'Pick at least one feature'
        : name.trim().length < 2
          ? 'Add a name'
          : nameError
            ? 'Pick an original name'
            : !/^[A-Z0-9]{2,10}$/.test(ticker)
              ? 'Add a ticker (2–10 letters or digits)'
              : null

  function toggle(f: string) {
    setChecked((c) => (c.includes(f) ? c.filter((x) => x !== f) : [...c, f]))
  }

  function addFeature() {
    const f = newFeature.trim()
    if (!f) return
    if (!custom.includes(f) && !available.includes(f)) setCustom((c) => [...c, f])
    setNewFeature('')
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    setIconError(null)
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) {
      setIconError('Use a PNG, JPG, WebP or GIF.')
      return
    }
    try {
      setIcon(await toIcon(file))
    } catch (e) {
      setIconError(e instanceof Error ? e.message : 'Could not read that image.')
    }
  }

  const readiness =
    ([!!sel, features.length + custom.length > 0 || !!idea.trim(), name.trim().length >= 2 && !nameError, /^[A-Z0-9]{2,10}$/.test(ticker), !!icon].filter(Boolean)
      .length /
      5) *
    0.5

  const draftFeatures = [...(sel === SOMETHING_ELSE && idea.trim() ? [idea.trim()] : []), ...features, ...(extra.trim() ? [extra.trim()] : [])]

  return (
    <div className="page build-page">
      <div className="container">
        <header className="page-head build-head">
          <div>
            <h1 className="h1">Launch an app</h1>
            <p className="lead">
              Shape it below and watch the blueprint fill in. One launch starts the coin and the build.{' '}
              <Link to="/watch" className="inline-link">
                Watch a demo build
              </Link>
            </p>
          </div>
          <span className="pill">
            <Clock size={14} /> Ready in about 20 minutes
          </span>
        </header>

        <div className="build-grid">
          <div className="build-form">
            {/* 1 */}
            <section className="bstep">
              <div className="bstep-head">
                <span className="bstep-num">1</span>
                <div>
                  <h2>Start from an app</h2>
                  <p>
                    Or pick <em>Something else</em> and describe your own
                  </p>
                </div>
              </div>
              <div className="app-grid">
                {fromItem && (
                  <button
                    type="button"
                    className={`app-tile${sel === `catalog:${fromItem.slug}` ? ' selected' : ''}`}
                    onClick={() => setSel(`catalog:${fromItem.slug}`)}
                  >
                    <span className="app-tile-ico">
                      <KindIcon kind={fromItem.kind} size={16} />
                    </span>
                    <span className="app-tile-text">
                      <strong>{fromItem.name}</strong>
                      <small>{fromItem.category}</small>
                    </span>
                    <Check size={14} className="app-tile-check" />
                  </button>
                )}
                {START_APPS.map((a) => (
                  <button key={a.slug} type="button" className={`app-tile${sel === a.slug ? ' selected' : ''}`} onClick={() => setSel(a.slug)}>
                    <span className="app-tile-ico">
                      <KindIcon kind={a.kind} size={16} />
                    </span>
                    <span className="app-tile-text">
                      <strong>{a.name}</strong>
                      <small>{KIND_LABEL[a.kind]}</small>
                    </span>
                    <Check size={14} className="app-tile-check" />
                  </button>
                ))}
                <button
                  type="button"
                  className={`app-tile app-tile-else${sel === SOMETHING_ELSE ? ' selected' : ''}`}
                  onClick={() => setSel(SOMETHING_ELSE)}
                >
                  <span className="app-tile-plus">
                    <Sparkles size={15} />
                  </span>
                  <span className="app-tile-text">
                    <strong>Something else</strong>
                    <small>Your own idea</small>
                  </span>
                  <Check size={14} className="app-tile-check" />
                </button>
              </div>
              <Link to="/catalog" className="link-arrow small">
                Browse all paid software <ArrowRight size={14} />
              </Link>
            </section>

            {/* 2 */}
            <section className="bstep">
              <div className="bstep-head">
                <span className="bstep-num">2</span>
                <div>
                  <h2>What it does</h2>
                  <p>The model only sees this list</p>
                </div>
              </div>

              {!sel && <div className="empty-box">Pick an app above and its features show up here.</div>}

              {sel === SOMETHING_ELSE && (
                <div className="field">
                  <label className="label" htmlFor="idea">
                    Describe your app
                  </label>
                  <textarea
                    id="idea"
                    className="input"
                    rows={3}
                    placeholder="A habit tracker with streaks, reminders and a weekly chart"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                </div>
              )}

              {sel && (
                <>
                  {available.length > 0 && (
                    <ul className="feat-list">
                      {available.map((f) => {
                        const on = checked.includes(f)
                        return (
                          <li key={f}>
                            <label className={`feat${on ? ' on' : ''}`}>
                              <input type="checkbox" checked={on} onChange={() => toggle(f)} />
                              <span className="feat-box">{on && <Check size={12} strokeWidth={3} />}</span>
                              <span>{f}</span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {custom.length > 0 && (
                    <ul className="feat-list">
                      {custom.map((f) => (
                        <li key={f}>
                          <div className="feat on custom">
                            <span className="feat-box">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span>{f}</span>
                            <button type="button" className="feat-del" onClick={() => setCustom((c) => c.filter((x) => x !== f))} aria-label={`Remove ${f}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="add-feat">
                    <input
                      className="input"
                      placeholder="Add a feature, one behavior per line"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addFeature()
                        }
                      }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={addFeature} disabled={!newFeature.trim()}>
                      <Plus size={15} /> Add
                    </button>
                  </div>
                </>
              )}

              <div className="field">
                <label className="label" htmlFor="extra">
                  Anything else? <span className="faint">(optional)</span>
                </label>
                <textarea
                  id="extra"
                  className="input"
                  rows={2}
                  placeholder="A detail the list doesn't cover"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                />
              </div>
            </section>

            {/* 3 */}
            <section className="bstep">
              <div className="bstep-head">
                <span className="bstep-num">3</span>
                <div>
                  <h2>Name and icon</h2>
                  <p>One name for the app and the coin</p>
                </div>
              </div>
              <div className="row-2">
                <div className="field">
                  <label className="label" htmlFor="name">
                    App and coin name
                  </label>
                  <input
                    id="name"
                    className={`input${nameError ? ' invalid' : ''}`}
                    maxLength={32}
                    placeholder="Hearth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!nameError}
                  />
                  {nameError && <p className="field-error">{nameError}</p>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="ticker">
                    Ticker
                  </label>
                  <div className="input-prefix">
                    <span>$</span>
                    <input
                      id="ticker"
                      className="input mono"
                      maxLength={10}
                      placeholder="HEARTH"
                      value={ticker}
                      onChange={(e) => {
                        setTickerTouched(true)
                        setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`drop${dragging ? ' dragging' : ''}${icon ? ' has-icon' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => fileInput.current?.click()}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
                onDragOver={(e: DragEvent) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e: DragEvent) => {
                  e.preventDefault()
                  setDragging(false)
                  void onFile(e.dataTransfer.files[0])
                }}
              >
                {icon ? <img src={icon} alt="Coin image preview" className="drop-img" /> : <span className="drop-icon"><ImagePlus size={20} /></span>}
                <div>
                  <strong>{icon ? 'Replace your app icon' : 'Upload your app icon'}</strong>
                  <span>Drop an image or click to choose. Square PNG, JPG, WebP or GIF works best. It's also your coin image.</span>
                  {iconError && <span className="field-error">{iconError}</span>}
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  hidden
                  onChange={(e: ChangeEvent<HTMLInputElement>) => void onFile(e.target.files?.[0])}
                />
              </div>
            </section>

            {/* 4 */}
            <section className="bstep">
              <div className="bstep-head">
                <span className="bstep-num">4</span>
                <div>
                  <h2>How it ships</h2>
                  <p>Buy some of your own coin at launch if you like</p>
                </div>
              </div>
              <div className="fmt-grid" role="radiogroup" aria-label="Output format">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={format === f.id}
                    className={`fmt${format === f.id ? ' selected' : ''}`}
                    onClick={() => setFormat(f.id)}
                  >
                    <f.icon size={18} />
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </button>
                ))}
              </div>
              <div className="field narrow">
                <label className="label" htmlFor="devbuy">
                  Dev buy <span className="faint">(SOL, optional)</span>
                </label>
                <input
                  id="devbuy"
                  className="input mono"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={devBuy}
                  onChange={(e) => setDevBuy(e.target.value.replace(',', '.').replace(/[^0-9.]/g, ''))}
                />
              </div>
            </section>
          </div>

          <aside className="build-aside">
            <div className="blueprint">
              <div className="bp-bar">
                <span className="mono">{fileName}</span>
                <span className="tag">{fmt.tag}</span>
              </div>
              <div className="bp-body">
                <div className="bp-window">
                  <BuildWindow template={templateFor(selection?.kind ?? 'chat')} fileName={fileName} progress={readiness} showTag={false} />
                </div>
                <div className="bp-app">
                  {icon ? (
                    <img src={icon} alt="" className="bp-icon" />
                  ) : name.trim() ? (
                    <AppIcon name={name} size={52} />
                  ) : (
                    <span className="bp-icon bp-icon-empty" />
                  )}
                  <div>
                    <strong>{name.trim() || 'Your app'}</strong>
                    <span>
                      {selection
                        ? `${selection.inspiredBy ? `Inspired by ${selection.inspiredBy}` : 'Original idea'} · ${draftFeatures.length} item${draftFeatures.length === 1 ? '' : 's'}`
                        : 'Pick an app below to start'}
                    </span>
                  </div>
                </div>
                <ol className="bp-list">
                  {draftFeatures.length === 0 && (
                    <>
                      <li className="bp-ghost" />
                      <li className="bp-ghost" style={{ width: '72%' }} />
                      <li className="bp-ghost" style={{ width: '84%' }} />
                    </>
                  )}
                  {draftFeatures.map((f, i) => (
                    <li key={`${i}-${f}`} className="bp-item">
                      <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="summary">
              <div className="sum-coin">
                {icon ? (
                  <img src={icon} alt="" className="sum-icon" />
                ) : name.trim() ? (
                  <AppIcon name={name} size={36} />
                ) : (
                  <span className="sum-icon bp-icon-empty" />
                )}
                <div>
                  <strong>{name.trim() || 'Your app'}</strong>
                  <span className="mono">${ticker || 'TICKER'}</span>
                </div>
              </div>
              <div className="sum-split">
                <div className="sum-split-row">
                  <span>
                    Creator fees{' '}
                    <strong>
                      {BRAND.creatorShare}% you · {100 - BRAND.creatorShare}% {BRAND.name}
                    </strong>
                  </span>
                  <Link to="/docs#fees" className="inline-link small">
                    Fee details
                  </Link>
                </div>
                <div className="split-bar">
                  <span style={{ width: `${BRAND.creatorShare}%` }} />
                </div>
              </div>
              <dl className="sum-rows">
                <div>
                  <dt>Launch fee</dt>
                  <dd className="mono">{BRAND.launchFeeSol} SOL</dd>
                </div>
                {devBuyNum > 0 && (
                  <div>
                    <dt>Dev buy</dt>
                    <dd className="mono">{devBuyNum} SOL</dd>
                  </div>
                )}
                <div>
                  <dt>Build</dt>
                  <dd>Included</dd>
                </div>
                <div>
                  <dt>Creator fees</dt>
                  <dd className="mono">
                    {BRAND.creatorShare}% / {100 - BRAND.creatorShare}%
                  </dd>
                </div>
              </dl>
              <p className="sum-note">
                You approve twice: once to launch, once to set the fee split. If the launch doesn't go through, nothing is charged.{' '}
                <Link to="/docs#fees" className="inline-link">
                  How fees work
                </Link>
              </p>
              <div className="sum-total">
                <span>Total to launch</span>
                <strong className="mono">{Number(total.toFixed(4))} SOL</strong>
              </div>
              <button type="button" className="btn btn-primary btn-lg btn-block" disabled={!!blocker} onClick={() => setModal(true)}>
                Launch coin &amp; build
              </button>
              {blocker && <p className="sum-blocker">{blocker}</p>}
            </div>
          </aside>
        </div>
      </div>

      <LaunchModal
        open={modal}
        onClose={() => setModal(false)}
        draft={{
          name: name.trim(),
          ticker,
          inspiredBy: selection?.inspiredBy || 'Original idea',
          kind: selection?.kind ?? 'generic',
          format,
          features: draftFeatures,
          icon,
          devBuy: devBuyNum,
        }}
      />
    </div>
  )
}
