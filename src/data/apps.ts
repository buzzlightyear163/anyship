import type { Kind } from '../lib/types'

export interface StartApp {
  slug: string
  /** Produkten som inspirerar (används bara för att identifiera, aldrig som namn på bygget). */
  name: string
  kind: Kind
}

// Startpunkter på startsidan och i steg 1 på /build.
export const START_APPS: StartApp[] = [
  { slug: 'discord', name: 'Discord', kind: 'chat' },
  { slug: 'chrome', name: 'Chrome', kind: 'browser' },
  { slug: 'chatgpt', name: 'ChatGPT', kind: 'ai' },
  { slug: 'notion', name: 'Notion', kind: 'notes' },
  { slug: 'photoshop', name: 'Photoshop', kind: 'photo' },
  { slug: 'premiere-pro', name: 'Premiere Pro', kind: 'video' },
  { slug: 'spotify', name: 'Spotify', kind: 'musicPlayer' },
  { slug: 'figma', name: 'Figma', kind: 'design' },
  { slug: 'excel', name: 'Excel', kind: 'spreadsheet' },
  { slug: 'trello', name: 'Trello', kind: 'boards' },
  { slug: '1password', name: '1Password', kind: 'passwords' },
  { slug: 'fl-studio', name: 'FL Studio', kind: 'musicProd' },
]

export const SOMETHING_ELSE = 'something-else'
