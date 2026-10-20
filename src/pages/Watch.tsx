import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Download, ExternalLink, RotateCcw } from 'lucide-react'
import { CodePanel, LogPanel, ProgressHead, StageStepper } from '../components/BuildPanels'
import { BuildWindow } from '../components/BuildWindow'
import { useReplay } from '../hooks/useReplay'
import { useTitle } from '../hooks/useTitle'
import { BRAND } from '../lib/brand'
import { makeLog, TOTAL_SECONDS } from '../lib/buildEngine'
import { FEATURES } from '../data/features'

const DEMO = {
  name: 'Reelcut',
  file: 'reelcut.html',
  src: '/apps/reelcut.html',
  features: FEATURES.video,
}

const SPEEDS = [
  { label: '20×', value: 20 },
  { label: '60×', value: 60 },
  { label: 'Real time', value: 1 },
]

export default function Watch() {
  useTitle('Watch a build', `A sped-up replay of an ${BRAND.name} build: plan, write, review, test and package.`)
  const { elapsed, speed, setSpeed, restart, done } = useReplay(20)
  const [code, setCode] = useState('')

  useEffect(() => {
    let alive = true
    fetch(DEMO.src)
      .then((r) => r.text())
      .then((t) => alive && setCode(t))
      .catch(() => alive && setCode('// Could not load the demo source.'))
    return () => {
      alive = false
    }
  }, [])

  const lines = code ? code.split('\n').length : 400
  const sizeKb = code ? Math.max(1, Math.round(code.length / 1024)) : 14
  const log = useMemo(() => makeLog({ name: DEMO.name, file: DEMO.file, features: DEMO.features, sizeKb, lines }), [sizeKb, lines])

  return (
    <div className="page watch-page">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Demo replay</span>
          <h1 className="h1">Watch a build</h1>
          <p className="lead">
            This is what happens after you launch: five stages over about 20 minutes, from plan to a finished file. The replay below builds{' '}
            {DEMO.name}, our example video editor, sped up.
          </p>
        </header>

        <div className="replay">
          <div className="replay-bar">
            <span className="eyebrow">Replay</span>
            <div className="seg" role="radiogroup" aria-label="Replay speed">
              {SPEEDS.map((s) => (
                <button key={s.label} type="button" role="radio" aria-checked={speed === s.value} className={speed === s.value ? 'active' : ''} onClick={() => setSpeed(s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={restart}>
              <RotateCcw size={14} /> Restart
            </button>
          </div>

          <ProgressHead elapsed={elapsed} />
          <StageStepper elapsed={elapsed} />

          <div className="replay-top">
            <div className="replay-preview">
              <BuildWindow template="video" fileName={DEMO.file} progress={elapsed / TOTAL_SECONDS} />
            </div>
            <LogPanel log={log} elapsed={elapsed} />
          </div>
          <div className="replay-code">
            <CodePanel code={code} elapsed={elapsed} fileName={DEMO.file} />
          </div>

          <div className={`result${done ? ' show' : ''}`} aria-hidden={!done}>
            <div className="result-file">
              <span className="result-ext mono">HTML</span>
              <div>
                <strong className="mono">{DEMO.file}</strong>
                <span>
                  {lines.toLocaleString('en-US')} lines · {sizeKb} KB · one file, no install
                </span>
              </div>
            </div>
            <div className="result-actions">
              <a className="btn btn-secondary" href={DEMO.src} target="_blank" rel="noreferrer" tabIndex={done ? 0 : -1}>
                <ExternalLink size={15} /> Open {DEMO.name}
              </a>
              <a className="btn btn-secondary" href={DEMO.src} download={DEMO.file} tabIndex={done ? 0 : -1}>
                <Download size={15} /> Download
              </a>
              <Link to="/build" className="btn btn-primary" tabIndex={done ? 0 : -1}>
                Launch your own <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
