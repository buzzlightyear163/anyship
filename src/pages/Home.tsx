import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Globe, Monitor, Smartphone } from 'lucide-react'
import { CopyCA } from '../components/CopyCA'
import { LaunchesTable } from '../components/LaunchesTable'
import { LaunchTicker } from '../components/LaunchTicker'
import { Mark } from '../components/Mark'
import { Reveal } from '../components/Reveal'
import { StartCard } from '../components/StartCard'
import { StepsScroll } from '../components/StepsScroll'
import { useBuilds } from '../hooks/useBuilds'
import { useTitle } from '../hooks/useTitle'
import { BRAND } from '../lib/brand'

export default function Home() {
  useTitle(undefined, `Describe any app, launch its coin, and ${BRAND.name} builds your own original version from scratch in about 20 minutes.`)
  const navigate = useNavigate()
  const [idea, setIdea] = useState('')
  const { launches, loading, error } = useBuilds()

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = idea.trim()
    navigate(q ? `/build?idea=${encodeURIComponent(q)}` : '/build')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker rise">
              <span className="live-pill">
                <i /> Live on pump.fun
              </span>
              <span className="mono faint">${BRAND.ticker}</span>
            </div>
            <h1 className="hero-title rise d1">
              Describe it.
              <br />
              <em>Ship it.</em>
            </h1>
            <p className="hero-sub rise d2">
              A chat app like Discord, a browser like Chrome, an AI assistant like ChatGPT. Describe it, launch its coin, and {BRAND.name} writes your
              own original version from scratch in about 20 minutes.
            </p>

            <form className="hero-form rise d3" onSubmit={submit}>
              <label htmlFor="idea">What do you want to build?</label>
              <div className="hero-input">
                <input id="idea" placeholder="e.g. a group chat with voice rooms" value={idea} onChange={(e) => setIdea(e.target.value)} autoComplete="off" />
                <button type="submit" className="btn btn-primary">
                  Start building <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="hero-meta rise d4">
              <CopyCA value={BRAND.ca} />
              <ul className="hero-facts mono">
                <li>{BRAND.launchFeeSol} SOL to launch</li>
                <li>{BRAND.creatorShare}% of creator fees</li>
                <li>1 file, yours</li>
              </ul>
            </div>
          </div>

          <div className="hero-visual rise d2">
            <StartCard />
          </div>
        </div>
      </section>

      <LaunchTicker launches={launches} />

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">What you get</span>
                <h2 className="h2">What you walk away with</h2>
              </div>
            </div>
            <div className="walk-grid">
              <article className="walk-card">
                <div className="walk-vis">
                  <div className="wv-own">
                    <span className="wv-icon">H</span>
                    <div>
                      <strong>Hearth</strong>
                      <span className="mono">hearth.html</span>
                    </div>
                    <span className="wv-ok">
                      <Check size={12} strokeWidth={3} /> Original
                    </span>
                  </div>
                </div>
                <span className="walk-num mono">01</span>
                <h3>Your own app</h3>
                <p>An original name, original code and your own icon. Nothing is copied from the app that inspired it.</p>
              </article>

              <article className="walk-card">
                <div className="walk-vis">
                  <div className="wv-file">
                    <span className="wv-doc mono">HTML</span>
                    <div className="wv-targets">
                      <span>
                        <Globe size={13} /> Browser
                      </span>
                      <span>
                        <Smartphone size={13} /> Phone
                      </span>
                      <span>
                        <Monitor size={13} /> Desktop
                      </span>
                    </div>
                  </div>
                </div>
                <span className="walk-num mono">02</span>
                <h3>One file that runs anywhere</h3>
                <p>A single web app you can open, host, install on a phone or sell.</p>
              </article>

              <article className="walk-card">
                <div className="walk-vis">
                  <div className="wv-split">
                    <div className="wv-split-labels mono">
                      <span>YOU {BRAND.creatorShare}%</span>
                      <span>{BRAND.name.toUpperCase()} {100 - BRAND.creatorShare}%</span>
                    </div>
                    <div className="wv-bar">
                      <span />
                    </div>
                    <span className="wv-note mono">every trade · on-chain</span>
                  </div>
                </div>
                <span className="walk-num mono">03</span>
                <h3>Half the creator fees</h3>
                <p>Every trade of your app's coin on pump.fun pays you {BRAND.creatorShare}% of the creator fee.</p>
              </article>

              <article className="walk-card">
                <div className="walk-vis">
                  <div className="wv-chat">
                    <span className="wv-ask">Add a dark mode and keyboard shortcuts</span>
                    <span className="wv-reply mono">
                      <i /> Updated · v2
                    </span>
                  </div>
                </div>
                <span className="walk-num mono">04</span>
                <h3>Changes on request</h3>
                <p>Tell the AI what to fix or add and it updates your app in minutes.</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <StepsScroll />

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">Live</span>
                <h2 className="h2">Latest launches</h2>
              </div>
              <Link to="/apps#launches" className="link-arrow">
                See all launches <ArrowRight size={15} />
              </Link>
            </div>
            <LaunchesTable launches={launches} loading={loading} error={error} limit={6} />
          </Reveal>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <Reveal>
            <div className="cta">
              <div className="cta-bg" aria-hidden="true" />
              <Mark size={420} className="cta-mark" />
              <div className="cta-copy">
                <h2>
                  Your app is about <em>20 minutes</em> away.
                </h2>
                <p>Launching costs {BRAND.launchFeeSol} SOL. The build is included, and the app is yours to keep.</p>
                <div className="cta-actions">
                  <Link to="/build" className="btn btn-primary btn-lg">
                    Launch an app <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/watch" className="btn btn-secondary btn-lg">
                    Watch a build
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
