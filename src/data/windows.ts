import type { Kind } from '../lib/types'

// Wireframes för byggfönstret. Varje form anges i procent av fönstrets innehållsyta (under titelraden).
// t: panel | line | strong | box | media | circle | accent | soft | clip | sel
export type ShapeType = 'panel' | 'line' | 'strong' | 'box' | 'media' | 'circle' | 'accent' | 'soft' | 'clip' | 'sel'
export interface Shape {
  t: ShapeType
  x: number
  y: number
  w: number
  h?: number
  /** färgvariant för media/circle/clip */
  v?: number
  round?: boolean
}

export type Template = 'chat' | 'browser' | 'assistant' | 'video' | 'photo' | 'notes' | 'player' | 'design'

const S = (t: ShapeType, x: number, y: number, w: number, h?: number, v?: number, round?: boolean): Shape => ({ t, x, y, w, h, v, round })

export const WINDOWS: Record<Template, Shape[]> = {
  chat: [
    S('panel', 0, 0, 25, 100),
    S('line', 4, 8, 13),
    S('soft', 3, 16, 19, 8),
    S('line', 4, 29, 15),
    S('line', 4, 37, 11),
    S('line', 4, 45, 14),
    S('circle', 30, 8, 5.5, undefined, 0),
    S('strong', 38.5, 9, 11),
    S('line', 38.5, 15, 46),
    S('line', 38.5, 21, 32),
    S('circle', 30, 31, 5.5, undefined, 1),
    S('strong', 38.5, 32, 9),
    S('line', 38.5, 38, 38),
    S('media', 38.5, 45, 34, 20, 0),
    S('soft', 38.5, 68, 7, 5, undefined, true),
    S('soft', 46.5, 68, 7, 5, undefined, true),
    S('box', 29, 82, 67, 12),
    S('accent', 89.6, 84.5, 4.6, 7),
  ],
  browser: [
    S('panel', 0, 0, 100, 13),
    S('circle', 2.5, 3.6, 2.8, undefined, 3),
    S('circle', 6.5, 3.6, 2.8, undefined, 3),
    S('box', 12, 2.6, 76, 7.6, undefined, true),
    S('line', 16, 5.2, 26),
    S('media', 5, 19, 90, 32, 1),
    S('strong', 5, 56, 38),
    S('line', 5, 63, 62),
    S('line', 5, 68.5, 50),
    S('box', 5, 76, 28, 19),
    S('box', 36, 76, 28, 19),
    S('box', 67, 76, 28, 19),
    S('accent', 8, 88, 10, 4, undefined, true),
  ],
  assistant: [
    S('panel', 0, 0, 22, 100),
    S('accent', 3, 6, 16, 7),
    S('line', 3.5, 19, 13),
    S('line', 3.5, 26, 15),
    S('line', 3.5, 33, 11),
    S('soft', 58, 7, 36, 10, undefined, true),
    S('circle', 27, 24, 4.6, undefined, 2),
    S('line', 34, 25, 52),
    S('line', 34, 31, 58),
    S('line', 34, 37, 40),
    S('media', 34, 44, 56, 20, 2),
    S('soft', 62, 69, 32, 8, undefined, true),
    S('box', 27, 82, 68, 13, undefined, true),
    S('accent', 88.6, 84.6, 4.6, 7.6, undefined, true),
  ],
  video: [
    S('panel', 0, 0, 100, 9),
    S('line', 3, 3.4, 10),
    S('line', 16, 3.4, 8),
    S('accent', 86, 2, 11, 5.4, undefined, true),
    S('media', 3, 13, 62, 50, 0),
    S('panel', 68, 13, 29, 50),
    S('strong', 71, 17, 14),
    S('line', 71, 23, 22),
    S('line', 71, 29, 18),
    S('line', 71, 35, 22),
    S('accent', 32, 65, 3.4, 4.6, undefined, true),
    S('panel', 3, 72, 94, 26),
    S('clip', 6, 75, 22, 8, 0),
    S('clip', 29, 75, 30, 8, 1),
    S('clip', 60, 75, 19, 8, 0),
    S('clip', 6, 86, 52, 8, 2),
    S('accent', 46, 71, 0.6, 28),
  ],
  photo: [
    S('panel', 0, 0, 8, 100),
    S('soft', 1.6, 4, 4.8, 7),
    S('line', 2, 15, 4),
    S('line', 2, 22, 4),
    S('line', 2, 29, 4),
    S('media', 12, 6, 56, 88, 3),
    S('panel', 72, 0, 28, 100),
    S('soft', 74, 5, 24, 9),
    S('box', 74, 16, 24, 9),
    S('box', 74, 27, 24, 9),
    S('line', 74, 58, 22),
    S('accent', 84, 62.6, 2.4, 3.6, undefined, true),
    S('line', 74, 70, 22),
    S('accent', 78, 74.6, 2.4, 3.6, undefined, true),
  ],
  notes: [
    S('panel', 0, 0, 24, 100),
    S('strong', 4, 7, 12),
    S('line', 6, 15, 13),
    S('soft', 4, 21, 18, 7),
    S('line', 6, 32, 11),
    S('line', 6, 39, 14),
    S('strong', 32, 9, 34, 6),
    S('line', 32, 21, 58),
    S('line', 32, 27, 52),
    S('line', 32, 33, 60),
    S('accent', 32, 42, 2.8, 4.2),
    S('line', 36.5, 43, 28),
    S('box', 32, 49.5, 2.8, 4.2),
    S('line', 36.5, 50.5, 34),
    S('box', 32, 57, 2.8, 4.2),
    S('line', 36.5, 58, 22),
    S('media', 32, 67, 58, 24, 1),
  ],
  player: [
    S('panel', 0, 0, 20, 85),
    S('line', 3, 7, 12),
    S('soft', 2.4, 14, 15, 6),
    S('line', 3, 24, 10),
    S('line', 3, 31, 13),
    S('media', 24, 6, 16, 26, 0),
    S('media', 42.5, 6, 16, 26, 1),
    S('media', 61, 6, 16, 26, 2),
    S('media', 79.5, 6, 16, 26, 3),
    S('line', 24, 35, 12),
    S('line', 42.5, 35, 10),
    S('line', 61, 35, 13),
    S('line', 79.5, 35, 9),
    S('media', 24, 44, 16, 26, 2),
    S('media', 42.5, 44, 16, 26, 3),
    S('media', 61, 44, 16, 26, 0),
    S('media', 79.5, 44, 16, 26, 1),
    S('panel', 0, 86, 100, 14),
    S('media', 2, 88, 6, 10, 1),
    S('line', 10, 90.5, 12),
    S('accent', 47, 88.4, 3.6, 5.6, undefined, true),
    S('line', 36, 95.4, 28),
  ],
  design: [
    S('panel', 0, 0, 17, 100),
    S('line', 3, 6, 10),
    S('soft', 2, 12, 13, 6),
    S('line', 4, 22, 9),
    S('line', 4, 29, 11),
    S('box', 23, 9, 32, 56),
    S('media', 25.5, 13, 27, 22, 1),
    S('strong', 25.5, 39, 18),
    S('line', 25.5, 45, 24),
    S('accent', 25.5, 54, 11, 6, undefined, true),
    S('box', 59, 9, 18, 36),
    S('line', 61, 14, 13),
    S('line', 61, 20, 10),
    S('sel', 58, 8, 20, 38),
    S('panel', 82, 0, 18, 100),
    S('line', 85, 6, 10),
    S('circle', 85, 14, 3, undefined, 0),
    S('circle', 89.5, 14, 3, undefined, 1),
    S('circle', 94, 14, 3, undefined, 2),
    S('line', 85, 26, 11),
    S('line', 85, 32, 8),
  ],
}

export function templateFor(kind: Kind): Template {
  switch (kind) {
    case 'chat':
      return 'chat'
    case 'browser':
      return 'browser'
    case 'ai':
      return 'assistant'
    case 'video':
      return 'video'
    case 'photo':
      return 'photo'
    case 'notes':
    case 'office':
    case 'pdf':
      return 'notes'
    case 'musicPlayer':
    case 'musicProd':
      return 'player'
    case 'design':
    case 'cad':
    case 'spreadsheet':
    case 'boards':
      return 'design'
    case 'email':
      return 'chat'
    default:
      return 'notes'
  }
}
