import { useEffect } from 'react'
import { BRAND } from '../lib/brand'

export function useTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND.name}` : BRAND.name
    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      meta?.setAttribute('content', description)
    }
  }, [title, description])
}
