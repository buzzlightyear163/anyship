// Datalager. Läser mockdata från /public/api och lägger på demo-coins från webbläsaren.
// TODO(backend): byt mot riktiga endpoints – GET /api/builds, GET /api/coin?mint=…, GET /api/advance?ca=…
import { FEATURES } from '../data/features'
import { progressAt, TOTAL_SECONDS } from './buildEngine'
import { getLocalCoins, getOverrides } from './storage'
import type { BuildStatus, Kind, Launch, ShipFormat, Stats } from './types'

interface RawBuild {
  mint: string
  name: string
  ticker: string
  inspiredBy: string
  kind: Kind
  format: ShipFormat
  status: BuildStatus
  launchedMinutesAgo: number
  startedMinutesAgo?: number
  file?: string
  sizeKb?: number
  features?: string[]
}

interface RawResponse {
  stats: Stats
  builds: RawBuild[]
}

let cache: Promise<{ stats: Stats; launches: Launch[] }> | null = null
const loadedAt = Date.now()

function fromRaw(b: RawBuild): Launch {
  return {
    mint: b.mint,
    name: b.name,
    ticker: b.ticker,
    inspiredBy: b.inspiredBy,
    kind: b.kind,
    format: b.format,
    status: b.status,
    features: b.features ?? FEATURES[b.kind].slice(0, 7),
    launchedAt: loadedAt - b.launchedMinutesAgo * 60_000,
    startedAt: b.startedMinutesAgo != null ? loadedAt - b.startedMinutesAgo * 60_000 : undefined,
    file: b.file,
    sizeKb: b.sizeKb,
    speed: 1,
  }
}

function fetchRemote() {
  if (!cache) {
    cache = fetch('/api/builds.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<RawResponse>
      })
      .then((data) => ({ stats: data.stats, launches: data.builds.map(fromRaw) }))
      .catch((err) => {
        cache = null
        throw err
      })
  }
  return cache
}

/** Elapsed (simulerade sekunder) för en build som pågår. */
export function buildElapsed(l: Launch, now = Date.now()) {
  if (!l.startedAt) return 0
  return ((now - l.startedAt) / 1000) * (l.speed ?? 1)
}

/** Räknar fram aktuell status – en build som hunnit klart blir "ready". */
export function liveStatus(l: Launch, now = Date.now()): BuildStatus {
  if (l.status === 'building' && buildElapsed(l, now) >= TOTAL_SECONDS) return 'ready'
  return l.status
}

export function liveStage(l: Launch, now = Date.now()) {
  return progressAt(buildElapsed(l, now)).stage
}

function applyOverrides(list: Launch[]) {
  const ov = getOverrides()
  return list.map((l) => (ov[l.mint] ? { ...l, ...ov[l.mint] } : l))
}

export async function getBuilds() {
  const remote = await fetchRemote()
  const local = getLocalCoins()
  const launches = applyOverrides([...local, ...remote.launches]).sort((a, b) => b.launchedAt - a.launchedAt)
  const stats: Stats = {
    ...remote.stats,
    startedThisWeek: remote.stats.startedThisWeek + local.length,
  }
  return { stats, launches }
}

export async function getCoin(mint: string) {
  const { launches } = await getBuilds()
  return launches.find((l) => l.mint === mint) ?? null
}

export function fileNameFor(l: Pick<Launch, 'name' | 'format' | 'file'>) {
  if (l.file) return l.file.split('/').pop() ?? l.file
  const base = l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-app'
  return `${base}.${l.format === 'cli' ? 'mjs' : 'html'}`
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)

/** Demo-fil för builds som saknar en riktig fil i mockdatan. */
export function stubFile(l: Launch): { content: string; type: string } {
  if (l.format === 'cli') {
    const content = `#!/usr/bin/env node
// ${l.name} ($${l.ticker}) – demo build
// TODO(backend): den riktiga filen hämtas från /api/build?ca=${l.mint}&dl=1
const features = ${JSON.stringify(l.features, null, 2)};
console.log('${l.name.replace(/'/g, "\\'")} – ' + features.length + ' features');
features.forEach((f, i) => console.log('  ' + (i + 1) + '. ' + f));
`
    return { content, type: 'text/javascript' }
  }
  const items = l.features.map((f) => `<li>${esc(f)}</li>`).join('')
  const content = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(l.name)}</title>
<style>body{margin:0;font:15px/1.55 system-ui,sans-serif;background:#fafafa;color:#111;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
main{max-width:520px;width:100%;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:28px}
h1{margin:0 0 4px;font-size:24px;letter-spacing:-.02em}p{margin:0 0 18px;color:#666}ol{margin:0;padding-left:20px}li{margin:6px 0}
small{display:block;margin-top:20px;color:#999;font-size:12px}</style></head>
<body><main><h1>${esc(l.name)}</h1><p>Demo build · $${esc(l.ticker)}</p><ol>${items}</ol>
<small>This is a placeholder file from the local demo. The real build comes from the build API.</small></main></body></html>`
  return { content, type: 'text/html' }
}
