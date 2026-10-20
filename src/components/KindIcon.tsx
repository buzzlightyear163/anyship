import {
  AudioLines,
  Clapperboard,
  Globe,
  Image,
  KeyRound,
  MessagesSquare,
  Music2,
  NotebookPen,
  PenTool,
  Sparkles,
  SquareKanban,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import type { Kind } from '../lib/types'

const ICONS: Partial<Record<Kind, LucideIcon>> = {
  chat: MessagesSquare,
  browser: Globe,
  ai: Sparkles,
  video: Clapperboard,
  photo: Image,
  notes: NotebookPen,
  musicPlayer: Music2,
  design: PenTool,
  spreadsheet: Table2,
  boards: SquareKanban,
  passwords: KeyRound,
  musicProd: AudioLines,
}

export function KindIcon({ kind, size = 18 }: { kind: Kind; size?: number }) {
  const I = ICONS[kind] ?? Sparkles
  return <I size={size} strokeWidth={1.75} />
}
