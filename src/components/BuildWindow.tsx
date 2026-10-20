import { useEffect, useRef } from 'react'
import { progressAt, TOTAL_SECONDS } from '../lib/buildEngine'
import { clock } from '../lib/format'
import { WINDOWS, type Shape, type Template } from '../data/windows'

interface Props {
  template: Template
  fileName: string
  /** Styrd position 0–1 (0 = bara ritning, 1 = färdig app). Utelämna för automatisk loop. */
  progress?: number
  /** Anropas när en automatisk loop är klar. */
  onCycle?: () => void
  /** Ändra värdet för att starta om loopen (t.ex. vid hover på en startpunkt). */
  restartKey?: string | number
  showTag?: boolean
  className?: string
}

const SWEEP_MS = 5200
const HOLD_MS = 1900

function Shapes({ shapes }: { shapes: Shape[] }) {
  return (
    <>
      {shapes.map((s, i) => (
        <span
          key={i}
          className={`bw-s s-${s.t} v${s.v ?? 0}${s.round ? ' r' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: s.h != null ? `${s.h}%` : undefined }}
        />
      ))}
    </>
  )
}

function Frame({ template, fileName }: { template: Template; fileName: string }) {
  return (
    <div className="bw-win">
      <div className="bw-bar">
        <i />
        <i />
        <i />
        <span className="bw-title">{fileName}</span>
      </div>
      <div className="bw-body">
        <Shapes shapes={WINDOWS[template]} />
      </div>
    </div>
  )
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Ett app-fönster som är ritning till vänster om den blå linjen och färdig app till höger om den. */
export function BuildWindow({ template, fileName, progress, onCycle, restartKey, showTag = true, className = '' }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const tag = useRef<HTMLSpanElement>(null)
  const cycle = useRef(onCycle)
  cycle.current = onCycle

  const apply = (p: number) => {
    const el = root.current
    if (!el) return
    const x = (1 - p) * 100
    el.style.setProperty('--x', `${x}%`)
    el.style.setProperty('--xn', String(1 - p))
    el.classList.toggle('is-done', p >= 1)
    if (tag.current) {
      if (p >= 1) tag.current.textContent = `READY · ${fileName}`
      else {
        const pr = progressAt(p * TOTAL_SECONDS)
        tag.current.textContent = `${pr.stage.label.toUpperCase()} · ${clock(pr.elapsed)} / ${clock(TOTAL_SECONDS)}`
      }
    }
  }

  // Styrt läge
  useEffect(() => {
    if (progress != null) apply(Math.min(1, Math.max(0, progress)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, fileName])

  // Automatisk loop
  useEffect(() => {
    if (progress != null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      apply(0.55)
      const t = window.setTimeout(() => cycle.current?.(), 4000)
      return () => window.clearTimeout(t)
    }
    let raf = 0
    let start = performance.now()
    let fired = false
    const tick = (now: number) => {
      const t = now - start
      if (t < SWEEP_MS) apply(ease(t / SWEEP_MS))
      else {
        apply(1)
        if (t > SWEEP_MS + HOLD_MS && !fired) {
          fired = true
          if (cycle.current) cycle.current()
          else {
            start = now
            fired = false
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress == null, template, restartKey])

  return (
    <div className={`bw ${className}`} ref={root} aria-hidden="true">
      <div className="bw-layer bw-wire">
        <Frame template={template} fileName={fileName} />
      </div>
      <div className="bw-layer bw-solid">
        <Frame template={template} fileName={fileName} />
      </div>
      <div className="bw-line">{showTag && <span className="bw-tag" ref={tag} />}</div>
    </div>
  )
}
