import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { AppIcon } from '../components/AppIcon'
import { CATALOG, PLATFORMS, type Platform } from '../data/catalog'
import { useTitle } from '../hooks/useTitle'
import { BRAND } from '../lib/brand'

type Sort = 'popular' | 'cost' | 'az'
const PAGE = 24

export default function Catalog() {
  useTitle('Software', 'Search paid software across every platform and start a rebuild.')
  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState<Platform | 'All'>('All')
  const [sort, setSort] = useState<Sort>('popular')
  const [limit, setLimit] = useState(PAGE)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = CATALOG.filter(
      (c) =>
        (platform === 'All' || c.platforms.includes(platform)) &&
        (!term || c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term)),
    )
    const sorted = [...list]
    if (sort === 'cost') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name))
    else sorted.sort((a, b) => a.rank - b.rank)
    return sorted
  }, [q, platform, sort])

  const shown = results.slice(0, limit)

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Catalog</span>
          <h1 className="h1">Find the software you pay for</h1>
          <p className="lead">
            Search paid apps on Windows, macOS, Linux, the web and mobile. Pick one and {BRAND.name} builds an original alternative from scratch.
          </p>
        </header>

        <div className="cat-tools">
          <div className="search">
            <Search size={16} />
            <input
              type="search"
              placeholder={`Search ${CATALOG.length} apps`}
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setLimit(PAGE)
              }}
              aria-label="Search software"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="seg" role="radiogroup" aria-label="Sort">
            {(
              [
                ['popular', 'Most popular'],
                ['cost', 'Highest cost'],
                ['az', 'A to Z'],
              ] as [Sort, string][]
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={sort === id} className={sort === id ? 'active' : ''} onClick={() => setSort(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="chips" role="radiogroup" aria-label="Platform">
          {(['All', ...PLATFORMS] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={platform === p}
              className={`chip${platform === p ? ' active' : ''}`}
              onClick={() => {
                setPlatform(p)
                setLimit(PAGE)
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="cat-count muted">
          {results.length} app{results.length === 1 ? '' : 's'}
        </p>

        {results.length === 0 ? (
          <div className="empty-box">
            Nothing matches “{q}”.{' '}
            <Link to={`/build?app=something-else${q ? `&idea=${encodeURIComponent(q)}` : ''}`} className="inline-link">
              Describe it yourself
            </Link>
          </div>
        ) : (
          <div className="cat-grid">
            {shown.map((c) => (
              <article key={c.slug} className="cat-card">
                <div className="cat-top">
                  <AppIcon name={c.name} size={40} />
                  <div className="cat-name">
                    <strong>{c.name}</strong>
                    <span>{c.category}</span>
                  </div>
                  <span className="cat-price mono">
                    ${c.price.toLocaleString('en-US')}
                    <small>{c.per === 'yr' ? '/yr' : ' once'}</small>
                  </span>
                </div>
                <div className="cat-bottom">
                  <span className="cat-plats">{c.platforms.join(' · ')}</span>
                  <Link to={`/build?from=${c.slug}`} className="btn btn-secondary btn-sm">
                    Build mine <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {limit < results.length && (
          <div className="more">
            <button type="button" className="btn btn-secondary" onClick={() => setLimit((l) => l + PAGE)}>
              Show more
            </button>
          </div>
        )}

        <p className="footnote">
          Prices are approximate US list prices. Product names identify the software only; {BRAND.name} isn't affiliated with their owners and doesn't
          use their logos.
        </p>
      </div>
    </div>
  )
}
