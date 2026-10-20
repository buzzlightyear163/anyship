import { Check, Copy } from 'lucide-react'
import { useCopy } from '../hooks/useCopy'
import { shortAddr } from '../lib/format'

interface Props {
  value: string
  label?: string
  className?: string
  full?: boolean
}

export function CopyCA({ value, label = 'CA', className = '', full = false }: Props) {
  const { copied, copy } = useCopy()
  return (
    <div className={`ca-pill ${className}`}>
      <span className="ca-label">{label}</span>
      <span className="ca-value" title={value}>
        {full ? (
          <>
            <span className="ca-full">{value}</span>
            <span className="ca-short">{shortAddr(value, 6, 6)}</span>
          </>
        ) : (
          shortAddr(value, 6, 6)
        )}
      </span>
      <button type="button" onClick={() => copy(value)} aria-label={`Copy ${label}`}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
