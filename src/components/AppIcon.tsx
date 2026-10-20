import { hueOf } from '../lib/format'

interface Props {
  name: string
  size?: number
  src?: string
  round?: boolean
}

/** Neutral monogram-ikon. Använder aldrig andra företags logotyper. */
export function AppIcon({ name, size = 36, src, round = false }: Props) {
  const radius = round ? '50%' : `${Math.round(size * 0.26)}px`
  if (src) {
    return <img className="app-icon" src={src} alt="" width={size} height={size} style={{ borderRadius: radius }} />
  }
  const h = hueOf(name)
  const letters = name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span
      className="app-icon"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(160deg, hsl(${h} 45% 20%), hsl(${h} 40% 13%))`,
        color: `hsl(${h} 80% 80%)`,
        boxShadow: `inset 0 0 0 1px hsl(${h} 35% 28%)`,
        fontSize: Math.round(size * (letters.length > 1 ? 0.34 : 0.42)),
      }}
    >
      {letters || '?'}
    </span>
  )
}
