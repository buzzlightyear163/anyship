// Simulerad build-pipeline: plan → write → review → test → package (~20 min).
// TODO(backend): i produktion kommer stage, starttid och logg från GET /api/advance?ca=<mint>.

export type StageId = 'plan' | 'write' | 'review' | 'test' | 'package'

export interface Stage {
  id: StageId
  label: string
  desc: string
  seconds: number
}

export const STAGES: Stage[] = [
  { id: 'plan', label: 'Plan', desc: 'Turns your feature list into a file plan', seconds: 120 },
  { id: 'write', label: 'Write', desc: 'Writes the whole app in one pass', seconds: 660 },
  { id: 'review', label: 'Review', desc: 'Reads it back and fixes bugs', seconds: 240 },
  { id: 'test', label: 'Test', desc: 'Opens it and runs automated checks', seconds: 120 },
  { id: 'package', label: 'Package', desc: 'Bundles one file to download', seconds: 60 },
]

export const TOTAL_SECONDS = STAGES.reduce((s, x) => s + x.seconds, 0)

export const STAGE_START: Record<StageId, number> = (() => {
  const out = {} as Record<StageId, number>
  let t = 0
  for (const s of STAGES) {
    out[s.id] = t
    t += s.seconds
  }
  return out
})()

export interface Progress {
  index: number
  stage: Stage
  stageElapsed: number
  elapsed: number
  pct: number
  done: boolean
}

export function progressAt(elapsedRaw: number): Progress {
  const elapsed = Math.min(Math.max(0, elapsedRaw), TOTAL_SECONDS)
  let index = STAGES.length - 1
  for (let i = 0; i < STAGES.length; i++) {
    const end = STAGE_START[STAGES[i].id] + STAGES[i].seconds
    if (elapsed < end) {
      index = i
      break
    }
  }
  const stage = STAGES[index]
  return {
    index,
    stage,
    stageElapsed: elapsed - STAGE_START[stage.id],
    elapsed,
    pct: elapsed / TOTAL_SECONDS,
    done: elapsed >= TOTAL_SECONDS,
  }
}

export interface LogLine {
  t: number
  stage: StageId
  text: string
  tone?: 'ok' | 'warn' | 'dim'
}

interface LogInput {
  name: string
  file: string
  features: string[]
  sizeKb?: number
  lines?: number
}

export function makeLog({ name, file, features, sizeKb = 32, lines = 900 }: LogInput): LogLine[] {
  const out: LogLine[] = []
  const at = (stage: StageId, offset: number, text: string, tone?: LogLine['tone']) =>
    out.push({ t: STAGE_START[stage] + offset, stage, text, tone })

  const n = Math.max(1, features.length)
  at('plan', 1, `Build queued for ${name}`, 'dim')
  at('plan', 4, `Reading spec: ${n} feature${n === 1 ? '' : 's'}`)
  at('plan', 18, 'Checking names and copy for originality', 'dim')
  at('plan', 31, 'Originality check passed', 'ok')
  at('plan', 52, 'Choosing layout: toolbar, main view, side panel')
  at('plan', 78, `File plan: state, ui, ${features.length > 4 ? 'shortcuts, ' : ''}storage, export`)
  at('plan', 112, 'Plan ready', 'ok')

  at('write', 3, `Writing ${file}`)
  const step = (STAGES[1].seconds - 60) / n
  features.forEach((f, i) => {
    at('write', Math.round(25 + i * step), `Feature ${i + 1}/${n}: ${f}`)
  })
  at('write', STAGES[1].seconds - 20, `First draft done: ${lines.toLocaleString('en-US')} lines`, 'ok')

  at('review', 4, 'Reading the draft back against the spec')
  at('review', 60, 'Found 3 issues: an off-by-one, a missing empty state, a stale event listener', 'warn')
  at('review', 130, 'Fixed 3 of 3 issues', 'ok')
  at('review', 200, 'Second pass: no new issues', 'ok')

  at('test', 3, 'Opening the file in a headless browser')
  at('test', 40, 'Clicking through every feature in the spec')
  at('test', 95, `${n * 2 + 4}/${n * 2 + 4} checks passed, 0 console errors`, 'ok')

  at('package', 5, 'Inlining styles and scripts')
  at('package', 30, `${file} · ${sizeKb} KB`)
  at('package', 58, 'Ready to download', 'ok')

  return out.sort((a, b) => a.t - b.t)
}

export function visibleLog(log: LogLine[], elapsed: number) {
  return log.filter((l) => l.t <= elapsed)
}
