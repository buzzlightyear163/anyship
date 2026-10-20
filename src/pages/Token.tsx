import { useEffect, useState } from 'react'
import { ArrowUpRight, Hammer, Vote, Landmark } from 'lucide-react'
import { CopyCA } from '../components/CopyCA'
import { Mark } from '../components/Mark'
import { Reveal } from '../components/Reveal'
import { useTitle } from '../hooks/useTitle'
import { BRAND, isPlaceholderAddress, links } from '../lib/brand'
import { usd } from '../lib/format'

interface Market {
  price: number | null
  marketCap: number | null
  volume: number | null
  change: number | null
}

const BENEFITS = [
  { icon: Hammer, title: 'Rebuilds', text: 'Holders can ask for a new version of any shipped build without launching another coin.' },
  { icon: Vote, title: 'Pick the next target', text: 'A weekly holder vote picks which paid app gets the next featured build.' },
  { icon: Landmark, title: 'Platform revenue', text: `Launch fees from every build go to the ${BRAND.name} treasury, which pays for model runs and featured builds.` },
]

export default function Token() {
  useTitle('Token', `The ${BRAND.name} token: contract address, live market data and holder benefits.`)
  const placeholder = isPlaceholderAddress(BRAND.ca)
  const [market, setMarket] = useState<Market | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'none'>(placeholder ? 'none' : 'loading')

  useEffect(() => {
    if (placeholder) return
    let alive = true
    // Publik read-only data från DexScreener
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${BRAND.ca}`)
      .then((r) => r.json())
      .then((d: { pairs?: Array<{ priceUsd?: string; marketCap?: number; fdv?: number; volume?: { h24?: number }; priceChange?: { h24?: number } }> | null }) => {
        if (!alive) return
        const p = d.pairs?.[0]
        if (!p) return setState('none')
        setMarket({
          price: p.priceUsd ? Number(p.priceUsd) : null,
          marketCap: p.marketCap ?? p.fdv ?? null,
          volume: p.volume?.h24 ?? null,
          change: p.priceChange?.h24 ?? null,
        })
        setState('ok')
      })
      .catch(() => alive && setState('none'))
    return () => {
      alive = false
    }
  }, [placeholder])

  const change = market?.change
  return (
    <div className="page">
      <div className="container">
        <div className="token-top">
        <header className="page-head token-head">
          <span className="eyebrow">${BRAND.ticker}</span>
          <h1 className="h1">The {BRAND.name} token</h1>
          <p className="lead">The platform token. Holders get rebuilds and a say in what gets rebuilt next.</p>
          <CopyCA value={BRAND.ca} full className="ca-lg" />
          <div className="token-links">
            <a className="btn btn-primary" href={links.pumpFun(BRAND.ca)} target="_blank" rel="noreferrer">
              Buy on pump.fun <ArrowUpRight size={15} />
            </a>
            <a className="btn btn-secondary" href={links.dexscreener(BRAND.ca)} target="_blank" rel="noreferrer">
              DexScreener <ArrowUpRight size={15} />
            </a>
            <a className="btn btn-secondary" href={links.solscan(BRAND.ca)} target="_blank" rel="noreferrer">
              Solscan <ArrowUpRight size={15} />
            </a>
          </div>
        </header>
        <div className="token-coin" aria-hidden="true">
          <Mark size={140} />
          <span className="token-coin-label">${BRAND.ticker}</span>
        </div>
        </div>

        <div className="stats stats-4">
          <div className="stat">
            <span>Price</span>
            <strong>{usd(market?.price)}</strong>
          </div>
          <div className="stat">
            <span>Market cap</span>
            <strong>{usd(market?.marketCap)}</strong>
          </div>
          <div className="stat">
            <span>24h volume</span>
            <strong>{usd(market?.volume)}</strong>
          </div>
          <div className="stat">
            <span>24h change</span>
            <strong className={change == null ? '' : change >= 0 ? 'up' : 'down'}>
              {change == null ? '–' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
            </strong>
          </div>
        </div>
        <p className="market-note muted">
          {state === 'loading' && 'Loading market data…'}
          {state === 'ok' && 'Live from DexScreener.'}
          {state === 'none' && (import.meta.env.DEV && placeholder ? 'Set the CA in src/lib/brand.ts to show live market data.' : '')}
        </p>

        <Reveal>
          <h2 className="h2 section-title">What holding it gets you</h2>
          <div className="benefits">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="walk-card plain">
                <span className="walk-icon">
                  <b.icon size={18} />
                </span>
                <span className="mono faint benefit-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
