// localStorage-hjälpare. Allt är inslaget i try/catch eftersom lagringen kan saknas
// (privat läge, blockerad sajtdata). Används bara för demo-state i webbläsaren.
import type { Launch } from './types'

const KEY_COINS = 'anyship:coins'
const KEY_OVERRIDES = 'anyship:overrides'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* lagring saknas – demo-state lever bara i minnet */
  }
}

const memory: { coins: Launch[] | null; overrides: Record<string, Partial<Launch>> | null } = {
  coins: null,
  overrides: null,
}

export function getLocalCoins(): Launch[] {
  if (!memory.coins) memory.coins = read<Launch[]>(KEY_COINS, [])
  return memory.coins
}

export function saveLocalCoin(coin: Launch) {
  const next = [coin, ...getLocalCoins().filter((c) => c.mint !== coin.mint)]
  memory.coins = next
  write(KEY_COINS, next)
}

export function getOverrides(): Record<string, Partial<Launch>> {
  if (!memory.overrides) memory.overrides = read<Record<string, Partial<Launch>>>(KEY_OVERRIDES, {})
  return memory.overrides
}

export function setOverride(mint: string, patch: Partial<Launch>) {
  const next = { ...getOverrides(), [mint]: { ...getOverrides()[mint], ...patch } }
  memory.overrides = next
  write(KEY_OVERRIDES, next)
}
