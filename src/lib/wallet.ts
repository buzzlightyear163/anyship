// Plånboksanslutning för demoflödet. Om Phantom eller Solflare finns hämtas bara den
// publika adressen. Ingen transaktion signeras eller skickas.
// TODO(backend): POST /api/token (prepare/confirm) och POST /api/feeshare (build/confirm).

interface SolanaProvider {
  isPhantom?: boolean
  isSolflare?: boolean
  connect: () => Promise<{ publicKey?: { toString(): string } } | void>
  publicKey?: { toString(): string } | null
}

type WalletWindow = Window & {
  phantom?: { solana?: SolanaProvider }
  solflare?: SolanaProvider
  solana?: SolanaProvider
}

export function detectWallet(): { name: 'Phantom' | 'Solflare'; provider: SolanaProvider } | null {
  const w = window as WalletWindow
  const phantom = w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : undefined)
  if (phantom) return { name: 'Phantom', provider: phantom }
  if (w.solflare?.isSolflare) return { name: 'Solflare', provider: w.solflare }
  return null
}

export async function connectWallet(): Promise<{ address: string; name: string; demo: boolean }> {
  const found = detectWallet()
  if (found) {
    const res = await found.provider.connect()
    const key = (res && 'publicKey' in res ? res.publicKey : undefined) ?? found.provider.publicKey
    if (key) return { address: key.toString(), name: found.name, demo: false }
  }
  await new Promise((r) => setTimeout(r, 700))
  return { address: 'Demo1111111111111111111111111111111111111111', name: 'Demo wallet', demo: true }
}

export function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}
