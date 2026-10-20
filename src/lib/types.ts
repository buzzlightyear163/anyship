export type Kind =
  | 'chat'
  | 'browser'
  | 'ai'
  | 'notes'
  | 'photo'
  | 'video'
  | 'musicPlayer'
  | 'musicProd'
  | 'design'
  | 'spreadsheet'
  | 'boards'
  | 'passwords'
  | 'office'
  | 'pdf'
  | 'cad'
  | 'finance'
  | 'email'
  | 'calendar'
  | 'tasks'
  | 'generic'

export type ShipFormat = 'web' | 'pwa' | 'cli'

export type BuildStatus = 'ready' | 'building' | 'feesplit' | 'failed'

export interface Launch {
  mint: string
  name: string
  ticker: string
  inspiredBy: string
  kind: Kind
  format: ShipFormat
  status: BuildStatus
  features: string[]
  launchedAt: number
  startedAt?: number
  /** Simulerad hastighet för demo-builds (1 = realtid). */
  speed?: number
  file?: string
  sizeKb?: number
  icon?: string
  devBuy?: number
  local?: boolean
}

export interface Stats {
  shipped: number
  startedThisWeek: number
  medianBuildMinutes: number
}
