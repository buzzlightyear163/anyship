import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { connectWallet } from './wallet'

interface WalletState {
  address: string | null
  name: string | null
  demo: boolean
  connecting: boolean
  error: string | null
  connect: () => Promise<{ address: string; name: string; demo: boolean } | null>
  disconnect: () => void
}

const Ctx = createContext<WalletState | null>(null)

/** Delad plånboksstatus för header-knappen och launch-modalen. Läser bara den publika adressen. */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [demo, setDemo] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setName(w.name)
      setDemo(w.demo)
      return w
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not connect.')
      return null
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setName(null)
    setDemo(false)
  }, [])

  const value = useMemo(
    () => ({ address, name, demo, connecting, error, connect, disconnect }),
    [address, name, demo, connecting, error, connect, disconnect],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWallet() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWallet must be used inside WalletProvider')
  return v
}
