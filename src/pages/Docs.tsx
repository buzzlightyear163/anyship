import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { CopyCA } from '../components/CopyCA'
import { useTitle } from '../hooks/useTitle'
import { BRAND } from '../lib/brand'

const NAV = [
  {
    group: 'Start',
    items: [
      ['overview', 'Overview'],
      ['quickstart', 'Quickstart'],
      ['specs', 'Writing a good spec'],
    ],
  },
  {
    group: 'Platform',
    items: [
      ['fees', 'Launches and fees'],
      ['policy', 'Originality policy'],
      ['outputs', 'What you get'],
      ['apps', 'Apps'],
    ],
  },
  {
    group: 'Reference',
    items: [
      ['api', 'API'],
      ['token', 'Token'],
      ['faq', 'FAQ'],
    ],
  },
] as const

const IDS = NAV.flatMap((g) => g.items.map(([id]) => id))

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="doc-section">
      <h2>
        <a href={`#${id}`}>{title}</a>
      </h2>
      {children}
    </section>
  )
}

const API_ROWS: [string, string, string][] = [
  ['GET', '/api/builds', 'The 25 newest builds plus platform stats'],
  ['GET', '/api/build?ca=<mint>', "One build's name, status and code. Add &dl=1 to download the file"],
  ['GET', '/api/token?mint=<mint>', "Metadata for a coin launched here, in pump.fun's format"],
  ['POST', '/api/token', 'Used by the Launch page. prepare returns the unsigned launch transaction, confirm checks the launch and fee on-chain'],
  ['GET', '/api/coin?mint=<mint>', 'Public coin details: name, ticker, launch and fee-split status, build status'],
  ['POST', '/api/feeshare', 'build returns the unsigned fee-split transaction, confirm checks the 50/50 split'],
  ['POST', '/api/generate', 'Starts the build for a launched coin once its fee split is set'],
  ['GET', '/api/advance?ca=<mint>', "A build's stage, start time and log. POST { \"ca\": \"…\" } also moves the build forward"],
]

const FAQ: [string, string][] = [
  [
    `Is ${BRAND.name} copying software?`,
    "No. Every build is written from scratch from a list of features. The original's code, files, screens, text and branding are never used, and every build needs its own name.",
  ],
  ['Which model writes the code?', 'A top coding model picked for how reliably it writes long single-file programs.'],
  [
    'How long does a build take?',
    'About 20 minutes: a plan, a full writing pass, a review pass that fixes bugs, and automated checks before packaging. You can follow along on the coin page.',
  ],
  ['Can I build again?', 'One coin unlocks one build. If a build fails, retrying is free. A new version needs a new coin.'],
]

export default function Docs() {
  useTitle('Manual', `How ${BRAND.name} works: writing specs, launching coins, fees, the originality policy and the public API.`)
  const [active, setActive] = useState<string>('overview')

  useEffect(() => {
    const els = IDS.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <div className="page docs-page">
      <div className="container docs-grid">
        <aside className="docs-side">
          <nav aria-label="Manual">
            {NAV.map((g) => (
              <div key={g.group} className="docs-group">
                <span className="docs-group-label">{g.group}</span>
                {g.items.map(([id, label]) => (
                  <a key={id} href={`#${id}`} className={active === id ? 'active' : undefined}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <article className="docs-body">
          <div className="crumbs">
            <span>Documentation</span>
            <ChevronRight size={14} />
            <span>Manual</span>
          </div>
          <h1 className="h1">Manual</h1>
          <p className="lead">Everything you need to rebuild paid software with {BRAND.name}.</p>

          <Section id="overview" title="Overview">
            <p>
              {BRAND.name} turns a description of a paid app into an original program you own. You describe the app, launch a coin for the build, and
              a coding model writes a new version from scratch. You get one file you can open, host or sell.
            </p>
            <p>
              {BRAND.name} never sees the original product's code, files or screens. It only works from what you write.
            </p>
          </Section>

          <Section id="quickstart" title="Quickstart">
            <ol className="doc-steps">
              <li>
                Find an app under <Link to="/catalog">Software</Link> and click <strong>Build mine</strong>, or go straight to{' '}
                <Link to="/build">Launch</Link>.
              </li>
              <li>Give your version a name and ticker, and list what it should do.</li>
              <li>
                Click <strong>Launch coin &amp; build</strong> and approve two transactions in Phantom or Solflare: one to launch, one to set the fee
                split.
              </li>
              <li>
                The build runs five stages (plan, write, review, test, package) over about 20 minutes. You can close the page while it runs. Want to
                see it first? <Link to="/watch">Watch a demo build</Link>.
              </li>
            </ol>
            <p>
              Builds belong to their coin. They show under <Link to="/apps#launches">Live launches</Link> while they run and under{' '}
              <Link to="/apps">Apps</Link> once they're done.
            </p>
          </Section>

          <Section id="specs" title="Writing a good spec">
            <p>The spec is the only thing the model reads, so a clear spec makes a better app. Write one behavior per line: what the user does and what they see.</p>
            <pre className="doc-code">{`Draw with pen, line, rectangle and eraser tools
Pick any color and brush size
Undo and redo every stroke
Export the canvas as a PNG
Remember the last drawing when the page reopens`}</pre>
            <ul>
              <li>Describe behavior, not looks.</li>
              <li>Stay focused. Five to fifteen features beat fifty.</li>
              <li>Don't paste text, code or screenshots from the original product. The originality rules reject them.</li>
            </ul>
          </Section>

          <Section id="fees" title="Launches and fees">
            <p>
              Every build is unlocked by one coin launched on pump.fun through {BRAND.name}. You sign two transactions: the first creates the coin and
              pays the launch fee, the second sets how trading fees are split.
            </p>
            <div className="table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Goes to</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Launch fee</td>
                    <td className="mono">{BRAND.launchFeeSol} SOL</td>
                    <td>{BRAND.name} treasury</td>
                  </tr>
                  <tr>
                    <td>Dev buy</td>
                    <td>Optional</td>
                    <td>Your own coin</td>
                  </tr>
                  <tr>
                    <td>Creator trading fees</td>
                    <td className="mono">{BRAND.creatorShare}%</td>
                    <td>You, the launcher</td>
                  </tr>
                  <tr>
                    <td>Creator trading fees</td>
                    <td className="mono">{100 - BRAND.creatorShare}%</td>
                    <td>{BRAND.name} treasury</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>
                The launch fee is part of the launch transaction, so a launch that fails charges nothing. Treasury:{' '}
                <code className="addr">{BRAND.treasury}</code>
              </li>
              <li>
                <strong>Fee split.</strong> The second approval sets a 50/50 split through pump.fun's fee sharing. The build only unlocks once the split
                is confirmed on-chain. If the page closed too early, use <strong>Finish setup</strong> on your coin page.
              </li>
              <li>
                <strong>Coin page.</strong> Every coin gets a page at <code>/coin/&lt;mint&gt;</code>, which is also the website in the coin's
                metadata. It shows the coin, the fee split, the build and the preview and download buttons.
              </li>
              <li>One coin unlocks one build. A failed build can be retried from the same coin for free.</li>
              <li>Coins launched somewhere else can't unlock builds.</li>
            </ul>
          </Section>

          <Section id="policy" title="Originality policy">
            <p>Builds are written from a description only, with no access to the original's code or assets. Four rules keep it that way:</p>
            <dl className="doc-dl">
              <div>
                <dt>Specs only</dt>
                <dd>Programs, installers, source code and screenshots aren't accepted.</dd>
              </div>
              <div>
                <dt>Original names</dt>
                <dd>A build's name and ticker can't reuse the name of the product that inspired it.</dd>
              </div>
              <div>
                <dt>Server-side instructions</dt>
                <dd>The model is told to write everything from scratch and never reproduce a vendor's code, text, icons or branding.</dd>
              </div>
              <div>
                <dt>No trademarks</dt>
                <dd>Builds can't use another company's logo, product name or interface copy.</dd>
              </div>
            </dl>
            <p className="muted">
              Product names on the Software page only identify other products. {BRAND.name} isn't affiliated with their owners.
            </p>
          </Section>

          <Section id="outputs" title="What you get">
            <dl className="doc-dl">
              <div>
                <dt>Web app</dt>
                <dd>
                  One self-contained <code>.html</code> file that runs in any browser and can be hosted anywhere.
                </dd>
              </div>
              <div>
                <dt>Installable web app</dt>
                <dd>The same single file, set up to install like a desktop or phone app.</dd>
              </div>
              <div>
                <dt>Command-line tool</dt>
                <dd>
                  One <code>.mjs</code> file that runs with Node.js.
                </dd>
              </div>
            </dl>
            <p>The build is yours. Ship it, change it or sell it.</p>
          </Section>

          <Section id="apps" title="Apps">
            <p>
              The <Link to="/apps">Apps</Link> page has two views:
            </p>
            <ul>
              <li>
                <strong>Ready to use</strong>: finished {BRAND.name} builds, plus featured open-source alternatives credited to their authors under their
                own licenses.
              </li>
              <li>
                <strong>Live launches</strong>: every coin launched on {BRAND.name} and where its build is at.
              </li>
            </ul>
            <p>
              Want an app featured? It needs an open-source license that allows redistribution and a working build. Send it to{' '}
              <a href={BRAND.xUrl} target="_blank" rel="noreferrer">
                {BRAND.xHandle}
              </a>{' '}
              on X.
            </p>
          </Section>

          <Section id="api" title="API">
            <p>The public endpoints return JSON. Reading needs no key.</p>
            <div className="table-wrap">
              <table className="doc-table api-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>What it returns</th>
                  </tr>
                </thead>
                <tbody>
                  {API_ROWS.map(([m, path, desc]) => (
                    <tr key={m + path}>
                      <td>
                        <span className={`method method-${m.toLowerCase()}`}>{m}</span>
                      </td>
                      <td>
                        <code>{path}</code>
                      </td>
                      <td>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="token" title="Token">
            <p>The {BRAND.name} token's contract address:</p>
            <CopyCA value={BRAND.ca} full />
            <p>
              Live market data and what holders get are on the <Link to="/token">Token</Link> page.
            </p>
          </Section>

          <Section id="faq" title="FAQ">
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </Section>
        </article>
      </div>
    </div>
  )
}
