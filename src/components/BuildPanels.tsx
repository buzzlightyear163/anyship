import { useEffect, useMemo, useRef } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { clock } from '../lib/format'
import { progressAt, STAGE_START, STAGES, TOTAL_SECONDS, visibleLog, type LogLine } from '../lib/buildEngine'

type StageState = 'done' | 'running' | 'waiting'

function stateOf(i: number, elapsed: number): StageState {
  const p = progressAt(elapsed)
  if (p.done || i < p.index) return 'done'
  if (i === p.index) return 'running'
  return 'waiting'
}

function StageDot({ state }: { state: StageState }) {
  if (state === 'done')
    return (
      <span className="sdot sdot-done">
        <Check size={12} strokeWidth={3} />
      </span>
    )
  if (state === 'running')
    return (
      <span className="sdot sdot-run">
        <Loader2 size={13} className="spin" />
      </span>
    )
  return <span className="sdot" />
}

export function ProgressHead({ elapsed, label }: { elapsed: number; label?: string }) {
  const p = progressAt(elapsed)
  return (
    <div className="phead">
      <div className="phead-row">
        <span className="phead-stage">
          {p.done ? 'Done' : label ?? `${p.stage.label} · ${p.stage.desc.toLowerCase()}`}
        </span>
        <span className="phead-time mono">
          {clock(p.elapsed)} <span className="faint">/ {clock(TOTAL_SECONDS)}</span>
        </span>
      </div>
      <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p.pct * 100)}>
        {STAGES.map((s) => {
          const start = STAGE_START[s.id]
          const fill = Math.min(1, Math.max(0, (p.elapsed - start) / s.seconds))
          return (
            <span key={s.id} className="pbar-seg" style={{ flexGrow: s.seconds }}>
              <span style={{ transform: `scaleX(${fill})` }} />
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function StageStepper({ elapsed }: { elapsed: number }) {
  return (
    <ol className="stepper">
      {STAGES.map((s, i) => {
        const st = stateOf(i, elapsed)
        const p = progressAt(elapsed)
        const t = st === 'done' ? s.seconds : st === 'running' ? p.stageElapsed : 0
        return (
          <li key={s.id} className={`stepper-item is-${st}`}>
            <StageDot state={st} />
            <div>
              <strong>{s.label}</strong>
              <span className="mono">{st === 'waiting' ? `~${clock(s.seconds)}` : clock(t)}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function StageList({ elapsed }: { elapsed: number }) {
  return (
    <ol className="slist">
      {STAGES.map((s, i) => {
        const st = stateOf(i, elapsed)
        const p = progressAt(elapsed)
        const t = st === 'done' ? s.seconds : st === 'running' ? p.stageElapsed : 0
        return (
          <li key={s.id} className={`slist-item is-${st}`}>
            <StageDot state={st} />
            <div className="slist-text">
              <strong>{s.label}</strong>
              <span>{s.desc}</span>
            </div>
            <span className="slist-time mono">{st === 'waiting' ? `~${clock(s.seconds)}` : clock(t)}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function LogPanel({ log, elapsed, title = 'Build log' }: { log: LogLine[]; elapsed: number; title?: string }) {
  const lines = useMemo(() => visibleLog(log, elapsed), [log, elapsed])
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines.length])

  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{title}</span>
        <span className="term-count mono">{lines.length} lines</span>
      </div>
      <div className="term-body" ref={ref}>
        {lines.length === 0 && <div className="term-line dim">Waiting for the build to start…</div>}
        {lines.map((l, i) => (
          <div key={i} className={`term-line ${l.tone ?? ''}`}>
            <span className="term-t">{clock(l.t)}</span>
            <span className={`term-tag tag-${l.stage}`}>{l.stage}</span>
            <span className="term-text">{l.text}</span>
          </div>
        ))}
        {!progressAt(elapsed).done && <span className="term-caret" />}
      </div>
    </div>
  )
}

/** Visar källkoden som "skrivs" under Write-steget. */
export function CodePanel({ code, elapsed, fileName }: { code: string; elapsed: number; fileName: string }) {
  const all = useMemo(() => code.split('\n'), [code])
  const ws = STAGE_START.write
  const we = ws + STAGES[1].seconds
  const frac = elapsed <= ws ? 0 : elapsed >= we ? 1 : (elapsed - ws) / (we - ws)
  const count = Math.floor(all.length * frac)
  const shown = all.slice(Math.max(0, count - 220), count)
  const ref = useRef<HTMLPreElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [count])
  const offset = Math.max(0, count - 220)
  const kb = ((code.length * frac) / 1024).toFixed(1)

  return (
    <div className="code">
      <div className="code-bar">
        <span className="mono">{fileName}</span>
        <span className="mono faint">
          {count.toLocaleString('en-US')} lines · {kb} KB
        </span>
      </div>
      <pre ref={ref} className="code-body">
        {count === 0 ? (
          <span className="faint">{elapsed < ws ? '// Planning. Code starts in the Write stage.' : ''}</span>
        ) : (
          shown.map((line, i) => (
            <div key={offset + i} className="code-line">
              <span className="code-ln">{offset + i + 1}</span>
              <span>{line || ' '}</span>
            </div>
          ))
        )}
      </pre>
    </div>
  )
}
