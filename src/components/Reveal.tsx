import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

export function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
