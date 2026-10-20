import { BRAND } from '../lib/brand'
import { Mark } from './Mark'

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="logo">
      <Mark size={size} />
      <span className="logo-word">{BRAND.name}</span>
    </span>
  )
}
