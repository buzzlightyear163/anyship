import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, FileCode2 } from 'lucide-react'
import { BRAND } from '../lib/brand'

const STEPS = [
  {
    title: 'Describe the app',
    text: 'Start from a popular app or write your own idea, then pick the features it needs. One behavior per line.',
    caption: 'spec · 7 features',
  },
  {
    title: 'Launch the coin',
    text: 'Approve twice in your wallet: once to launch on pump.fun, once to set the 50/50 fee split.',
    caption: '$HEARTH · live on pump.fun',
  },
  {
    title: 'Get the file',
    text: 'Watch it get planned, written, reviewed and tested. Download it, host it, or ask the AI for changes.',
    caption: 'hearth.html · ready',
  },
]

const DEPTH = 7

/** Låst scrollsekvens: app-ikonen byggs från ritning till solid 3D-objekt medan man läser de tre stegen. */
export function StepsScroll() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = section.current
      const st = stage.current
      if (!el || !st) return
      const vh = window.innerHeight
      let p: number
      if (window.innerWidth <= 900) {
        // På mobil är bilden inte låst: bygg den medan den passerar skärmen
        const sr = st.getBoundingClientRect()
        p = Math.min(1, Math.max(0, (vh * 0.85 - sr.top) / (vh * 0.6)))
      } else {
        const r = el.getBoundingClientRect()
        const total = r.height - vh
        p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1
      }
      // linjen går från höger kant till vänster kant medan man scrollar
      const build = Math.min(1, Math.max(0, (p - 0.08) / 0.84))
      st.style.setProperty('--x', `${(1 - build) * 100}%`)
      st.style.setProperty('--ry', `${-28 + build * 18}deg`)
      st.style.setProperty('--rx', `${12 - build * 5}deg`)
      st.style.setProperty('--depth', String(build))
      st.style.setProperty('--lo', build >= 0.99 ? '0' : '1')
      setStep(p < 0.36 ? 0 : p < 0.7 ? 1 : 2)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="ss" ref={section} aria-labelledby="ss-title">
      <div className="container ss-grid">
        <div className="ss-sticky">
          <div className="ss-head">
            <span className="eyebrow">How it works</span>
            <h2 id="ss-title" className="h2">
              Three steps, about <em className="serif">20 minutes</em>
            </h2>
            <Link to="/watch" className="link-arrow">
              Watch a build <ArrowRight size={15} />
            </Link>
          </div>

          <div className="ss-scene">
            <div className={`ss-stage step-${step}`} ref={stage}>
              <div className="ss-dim">
                <i />
                <span>~20 MIN</span>
                <i />
              </div>
              <div className="ss-obj">
                {Array.from({ length: DEPTH }).map((_, i) => (
                  <div key={i} className="ss-depth" style={{ '--i': i + 1 } as CSSProperties} />
                ))}
                <div className="ss-solid">
                  <span className="ss-ui a" />
                  <span className="ss-ui b" />
                  <span className="ss-ui c" />
                  <span className="ss-ui d" />
                </div>
                <svg className="ss-wire" viewBox="0 0 168 196" preserveAspectRatio="none" aria-hidden="true">
                  <rect x="4" y="18" width="160" height="160" rx="40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="9 7" />
                  <line x1="4" y1="98" x2="164" y2="98" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity=".5" />
                  <line x1="84" y1="18" x2="84" y2="178" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity=".5" />
                  <circle cx="84" cy="98" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity=".5" />
                </svg>
                <div className="ss-line" />
              </div>
              <div className="ss-chip ss-coin">
                <span className="ss-chip-dot" /> $HEARTH <span className="faint">on pump.fun</span>
              </div>
              <div className="ss-chip ss-file">
                <FileCode2 size={14} /> hearth.html <Check size={13} className="ok" />
              </div>
              <div className="ss-ticks">
                <span>SPEC</span>
                <span>FILE</span>
              </div>
            </div>
            <p className="ss-caption mono">{STEPS[step].caption}</p>
          </div>
        </div>

        <ol className="ss-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`ss-step${step === i ? ' on' : ''}${step > i ? ' done' : ''}`}>
              <span className="ss-num mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {i === 2 && (
                <Link to="/build" className="btn btn-primary">
                  Launch an app · {BRAND.launchFeeSol} SOL
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
