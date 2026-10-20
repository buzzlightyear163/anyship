import type { Kind } from '../lib/types'
import { slugify } from '../lib/format'

export type Platform = 'Windows' | 'macOS' | 'Linux' | 'Web' | 'iOS' | 'Android'

export interface CatalogItem {
  slug: string
  name: string
  category: string
  kind: Kind
  platforms: Platform[]
  /** Ungefärligt amerikanskt listpris i USD. */
  price: number
  per: 'yr' | 'once'
  rank: number
}

const P: Record<string, Platform> = { w: 'Windows', m: 'macOS', l: 'Linux', b: 'Web', i: 'iOS', a: 'Android' }

// [namn, kategori, kind, plattformar, pris, per]
type Row = [string, string, Kind, string, number, 'yr' | 'once']

// Sorterad efter ungefärlig popularitet. Priser är ungefärliga listpriser.
const ROWS: Row[] = [
  ['Adobe Photoshop', 'Photo editing', 'photo', 'wmi', 263, 'yr'],
  ['Microsoft 365', 'Office suite', 'office', 'wmbia', 100, 'yr'],
  ['Adobe Premiere Pro', 'Video editing', 'video', 'wm', 263, 'yr'],
  ['ChatGPT Plus', 'AI assistant', 'ai', 'wmbia', 240, 'yr'],
  ['Figma Professional', 'Interface design', 'design', 'wmb', 192, 'yr'],
  ['Notion Plus', 'Notes and docs', 'notes', 'wmbia', 120, 'yr'],
  ['Slack Pro', 'Team chat', 'chat', 'wmlbia', 105, 'yr'],
  ['Spotify Premium', 'Music streaming', 'musicPlayer', 'wmbia', 144, 'yr'],
  ['Discord Nitro', 'Chat', 'chat', 'wmlbia', 100, 'yr'],
  ['Zoom Pro', 'Video calls', 'generic', 'wmlbia', 160, 'yr'],
  ['Canva Pro', 'Graphic design', 'design', 'wmbia', 120, 'yr'],
  ['Adobe Illustrator', 'Vector graphics', 'design', 'wmi', 263, 'yr'],
  ['Adobe Acrobat Pro', 'PDF editing', 'pdf', 'wmbia', 240, 'yr'],
  ['Adobe Lightroom', 'Photo editing', 'photo', 'wmbia', 120, 'yr'],
  ['Final Cut Pro', 'Video editing', 'video', 'mi', 300, 'once'],
  ['DaVinci Resolve Studio', 'Video editing', 'video', 'wml', 295, 'once'],
  ['Adobe After Effects', 'Motion graphics', 'video', 'wm', 263, 'yr'],
  ['Grammarly Premium', 'Writing assistant', 'office', 'wmbia', 144, 'yr'],
  ['1Password', 'Password manager', 'passwords', 'wmlbia', 36, 'yr'],
  ['Dropbox Plus', 'Cloud storage', 'generic', 'wmlbia', 120, 'yr'],
  ['Evernote Personal', 'Notes', 'notes', 'wmbia', 130, 'yr'],
  ['Microsoft Excel', 'Spreadsheets', 'spreadsheet', 'wmbia', 100, 'yr'],
  ['Trello Premium', 'Kanban boards', 'boards', 'wmbia', 120, 'yr'],
  ['Asana Starter', 'Project management', 'boards', 'wmbia', 132, 'yr'],
  ['Todoist Pro', 'To-do list', 'tasks', 'wmlbia', 48, 'yr'],
  ['Midjourney Basic', 'AI images', 'ai', 'b', 120, 'yr'],
  ['GitHub Copilot Pro', 'Coding assistant', 'ai', 'wmlb', 100, 'yr'],
  ['Cursor Pro', 'Code editor', 'generic', 'wml', 240, 'yr'],
  ['FL Studio Producer', 'Music production', 'musicProd', 'wm', 199, 'once'],
  ['Ableton Live Suite', 'Music production', 'musicProd', 'wm', 749, 'once'],
  ['Logic Pro', 'Music production', 'musicProd', 'mi', 200, 'once'],
  ['Pro Tools Studio', 'Audio editing', 'musicProd', 'wm', 299, 'yr'],
  ['AutoCAD', 'CAD', 'cad', 'wmb', 2030, 'yr'],
  ['SketchUp Pro', '3D modeling', 'cad', 'wmb', 349, 'yr'],
  ['Autodesk Maya', '3D animation', 'cad', 'wml', 1945, 'yr'],
  ['Cinema 4D', '3D motion', 'cad', 'wml', 720, 'yr'],
  ['Rhino 8', '3D CAD', 'cad', 'wm', 995, 'once'],
  ['SolidWorks Standard', 'Mechanical CAD', 'cad', 'w', 2820, 'yr'],
  ['Sketch', 'Interface design', 'design', 'm', 120, 'yr'],
  ['Adobe InDesign', 'Page layout', 'office', 'wm', 263, 'yr'],
  ['Miro Starter', 'Whiteboard', 'design', 'wmbia', 96, 'yr'],
  ['Microsoft Visio', 'Diagrams', 'design', 'wb', 60, 'yr'],
  ['Airtable Team', 'Database', 'spreadsheet', 'wmbia', 240, 'yr'],
  ['monday.com Basic', 'Work management', 'boards', 'wmbia', 108, 'yr'],
  ['ClickUp Unlimited', 'Project management', 'boards', 'wmlbia', 84, 'yr'],
  ['Linear Basic', 'Issue tracking', 'boards', 'wmbi', 96, 'yr'],
  ['Jira Standard', 'Issue tracking', 'boards', 'wmbia', 94, 'yr'],
  ['Zapier Professional', 'Automation', 'generic', 'b', 240, 'yr'],
  ['Calendly Standard', 'Scheduling', 'calendar', 'bia', 120, 'yr'],
  ['Fantastical', 'Calendar', 'calendar', 'wmi', 57, 'yr'],
  ['Superhuman', 'Email', 'email', 'wmbia', 360, 'yr'],
  ['Spark Premium', 'Email', 'email', 'wmia', 60, 'yr'],
  ['DocuSign Personal', 'E-signatures', 'pdf', 'bia', 120, 'yr'],
  ['QuickBooks Online', 'Accounting', 'finance', 'bia', 420, 'yr'],
  ['Xero Standard', 'Accounting', 'finance', 'bia', 360, 'yr'],
  ['FreshBooks Plus', 'Invoicing', 'finance', 'bia', 396, 'yr'],
  ['YNAB', 'Budgeting', 'finance', 'bia', 109, 'yr'],
  ['TurboTax Deluxe', 'Taxes', 'finance', 'wmb', 89, 'once'],
  ['Mailchimp Standard', 'Email marketing', 'email', 'b', 240, 'yr'],
  ['Hootsuite Professional', 'Social media', 'generic', 'bia', 1188, 'yr'],
  ['Loom Business', 'Screen recording', 'video', 'wmbia', 180, 'yr'],
  ['Camtasia', 'Screen recording', 'video', 'wm', 180, 'yr'],
  ['Snagit', 'Screenshots', 'photo', 'wm', 39, 'yr'],
  ['CleanMyMac', 'Mac cleanup', 'generic', 'm', 40, 'yr'],
  ['Parallels Desktop', 'Virtual machines', 'generic', 'm', 100, 'yr'],
  ['NordVPN', 'VPN', 'generic', 'wmlia', 60, 'yr'],
  ['Dashlane', 'Password manager', 'passwords', 'wmbia', 60, 'yr'],
  ['Things 3', 'To-do list', 'tasks', 'mi', 50, 'once'],
  ['TickTick Premium', 'To-do list', 'tasks', 'wmbia', 36, 'yr'],
  ['Bear Pro', 'Notes', 'notes', 'mi', 30, 'yr'],
  ['Obsidian Sync', 'Notes sync', 'notes', 'wmlia', 48, 'yr'],
  ['Ulysses', 'Writing', 'office', 'mi', 40, 'yr'],
  ['Scrivener', 'Long-form writing', 'office', 'wmi', 59, 'once'],
  ['Final Draft', 'Screenwriting', 'office', 'wmi', 250, 'once'],
  ['Capture One Pro', 'Photo editing', 'photo', 'wm', 179, 'yr'],
  ['Procreate', 'Illustration', 'photo', 'i', 13, 'once'],
  ['Clip Studio Paint Pro', 'Illustration', 'photo', 'wmia', 50, 'once'],
  ['Pixelmator Pro', 'Photo editing', 'photo', 'm', 50, 'once'],
  ['Adobe Audition', 'Audio editing', 'musicProd', 'wm', 263, 'yr'],
  ['Descript Creator', 'Video and podcasts', 'video', 'wmb', 288, 'yr'],
  ['Webflow CMS', 'Website builder', 'design', 'b', 276, 'yr'],
  ['Squarespace Core', 'Website builder', 'design', 'b', 276, 'yr'],
  ['Shopify Basic', 'Online store', 'generic', 'b', 348, 'yr'],
  ['Typeform Basic', 'Forms', 'generic', 'b', 300, 'yr'],
  ['SurveyMonkey Standard', 'Surveys', 'generic', 'bia', 468, 'yr'],
  ['Toggl Track Starter', 'Time tracking', 'tasks', 'wmlbia', 108, 'yr'],
  ['Harvest Pro', 'Time tracking', 'finance', 'wmbia', 132, 'yr'],
  ['Tableau Creator', 'Analytics', 'spreadsheet', 'wmb', 900, 'yr'],
  ['MATLAB', 'Numerical computing', 'spreadsheet', 'wml', 940, 'yr'],
  ['Mathematica', 'Technical computing', 'spreadsheet', 'wml', 445, 'yr'],
  ['Duolingo Max', 'Language learning', 'generic', 'bia', 168, 'yr'],
  ['Rosetta Stone', 'Language learning', 'generic', 'bia', 120, 'yr'],
  ['Headspace', 'Meditation', 'generic', 'bia', 70, 'yr'],
  ['Strava', 'Fitness tracking', 'generic', 'bia', 80, 'yr'],
  ['MyFitnessPal Premium', 'Nutrition', 'generic', 'bia', 80, 'yr'],
  ['Audible Premium Plus', 'Audiobooks', 'musicPlayer', 'bia', 180, 'yr'],
  ['Kindle Unlimited', 'E-books', 'generic', 'bia', 144, 'yr'],
  ['Google Workspace', 'Office suite', 'office', 'bia', 84, 'yr'],
  ['Microsoft Project', 'Project planning', 'boards', 'wb', 120, 'yr'],
  ['Microsoft Teams Essentials', 'Team chat', 'chat', 'wmbia', 48, 'yr'],
  ['Telegram Premium', 'Chat', 'chat', 'wmlbia', 36, 'yr'],
  ['JetBrains IntelliJ IDEA', 'Code editor', 'generic', 'wml', 169, 'yr'],
  ['Postman Basic', 'API testing', 'generic', 'wmlb', 168, 'yr'],
  ['TablePlus', 'Database client', 'spreadsheet', 'wml', 99, 'once'],
  ['Tower', 'Git client', 'generic', 'wm', 69, 'yr'],
  ['Raycast Pro', 'Launcher', 'generic', 'm', 96, 'yr'],
  ['Alfred Powerpack', 'Launcher', 'generic', 'm', 39, 'once'],
  ['Bartender', 'Menu bar', 'generic', 'm', 16, 'once'],
  ['Magnet', 'Window manager', 'generic', 'm', 5, 'once'],
  ['Day One Premium', 'Journal', 'notes', 'mbia', 50, 'yr'],
  ['Craft Plus', 'Docs', 'notes', 'wmbi', 60, 'yr'],
  ['Readwise Reader', 'Read-later', 'notes', 'bia', 120, 'yr'],
  ['Pocket Casts Plus', 'Podcasts', 'musicPlayer', 'wmbia', 40, 'yr'],
  ['Tidal', 'Music streaming', 'musicPlayer', 'wmbia', 132, 'yr'],
  ['Apple Music', 'Music streaming', 'musicPlayer', 'wmbia', 132, 'yr'],
  ['Serato DJ Pro', 'DJ software', 'musicProd', 'wm', 249, 'once'],
  ['Native Instruments Komplete', 'Instruments', 'musicProd', 'wm', 599, 'once'],
  ['Affinity Designer', 'Vector graphics', 'design', 'wmi', 70, 'once'],
  ['Blender Studio', '3D course library', 'cad', 'b', 132, 'yr'],
  ['Substance 3D', '3D texturing', 'cad', 'wm', 600, 'yr'],
  ['Unity Pro', 'Game engine', 'generic', 'wml', 2200, 'yr'],
  ['DeepL Pro', 'Translation', 'ai', 'wmbia', 105, 'yr'],
  ['Otter.ai Pro', 'Transcription', 'ai', 'bia', 100, 'yr'],
]

export const CATALOG: CatalogItem[] = ROWS.map(([name, category, kind, plats, price, per], i) => ({
  slug: slugify(name),
  name,
  category,
  kind,
  platforms: plats.split('').map((c) => P[c]),
  price,
  per,
  rank: i + 1,
}))

export const PLATFORMS: Platform[] = ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android']

export function findCatalog(slug: string | null | undefined) {
  if (!slug) return undefined
  return CATALOG.find((c) => c.slug === slug)
}
