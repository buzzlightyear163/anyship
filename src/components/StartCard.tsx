import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { templateFor } from '../data/windows'
import type { Kind } from '../lib/types'
import { BuildWindow } from './BuildWindow'
import { KindIcon } from './KindIcon'

export const HERO_STARTS: { slug: string; kind: Kind; title: string; like: string; file: string }[] = [
  { slug: 'discord', kind: 'chat', title: 'Chat app', like: 'Discord', file: 'hearth.html' },
  { slug: 'chrome', kind: 'browser', title: 'Web browser', like: 'Chrome', file: 'tabula.html' },
  { slug: 'chatgpt', kind: 'ai', title: 'AI assistant', like: 'ChatGPT', file: 'lumen.html' },
  { slug: 'premiere-pro', kind: 'video', title: 'Video editor', like: 'Premiere', file: 'reelcut.html' },
  { slug: 'photoshop', kind: 'photo', title: 'Photo editor', like: 'Photoshop', file: 'inkwell.html' },
  { slug: 'notion', kind: 'notes', title: 'Notes app', like: 'Notion', file: 'quill.html' },
  { slug: 'spotify', kind: 'musicPlayer', title: 'Music player', like: 'Spotify', file: 'driftwave.html' },
  { slug: 'figma', kind: 'design', title: 'Design tool', like: 'Figma', file: 'framewise.html' },
]

/** Hero-kortet: byggfönstret överst och startpunkterna under. Hover byter app i fönstret. */
export function StartCard() {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [restart, setRestart] = useState(0)
  const cur = HERO_STARTS[hover ?? active]

  return (
    <div className="start-card">
      <div className="start-card-stage">
        <BuildWindow
          template={templateFor(cur.kind)}
          fileName={cur.file}
          restartKey={`${hover ?? active}-${restart}`}
          onCycle={() => {
            if (hover == null) setActive((a) => (a + 1) % HERO_STARTS.length)
            else setRestart((r) => r + 1)
          }}
        />
      </div>
      <div className="start-card-head">
        <strong>Pick a starting point</strong>
        <span>Tap one to start</span>
      </div>
      <div className="start-grid" onMouseLeave={() => setHover(null)}>
        {HERO_STARTS.map((s, i) => (
          <Link
            key={s.slug}
            to={`/build?app=${s.slug}`}
            className={`start-tile${(hover ?? active) === i ? ' on' : ''}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          >
            <span className="start-ico">
              <KindIcon kind={s.kind} />
            </span>
            <span className="start-txt">
              <strong>{s.title}</strong>
              <small>like {s.like}</small>
            </span>
            <ArrowUpRight size={15} className="start-go" />
          </Link>
        ))}
      </div>
    </div>
  )
}
