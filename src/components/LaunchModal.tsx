import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Loader2, X } from 'lucide-react'
import { BRAND } from '../lib/brand'
import { demoMint, shortAddr } from '../lib/format'
import { saveLocalCoin } from '../lib/storage'
import type { Launch } from '../lib/types'
import { wait } from '../lib/wallet'
import { useWallet } from '../lib/walletContext'
import { Modal } from './Modal'

type Phase = 'connect' | 'launch' | 'split' | 'done'
const ORDER: Phase[] = ['connect', 'launch', 'split', 'done']

interface Props {
  open: boolean
  onClose: () => void
  draft: Omit<Launch, 'mint' | 'launchedAt' | 'status'>
}

/** Demo av launch-flödet: anslut → godkänn launch → godkänn fee split → build startar. */
export function LaunchModal({ open, onClose, draft }: Props) {
  const navigate = useNavigate()
  const w = useWallet()
  const [phase, setPhase] = useState<Phase>(w.address ? 'launch' : 'connect')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wallet = w.address ? { address: w.address, name: w.demo ? 'Demo wallet' : (w.name ?? 'Wallet') } : null
  const [mint, setMint] = useState<string | null>(null)

  useEffect(() => {
    if (open && phase === 'connect' && w.address) setPhase('launch')
  }, [open, phase, w.address])

  const total = (BRAND.launchFeeSol + (draft.devBuy ?? 0)).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
  const idx = ORDER.indexOf(phase)

  const reset = () => {
    setPhase(w.address ? 'launch' : 'connect')
    setBusy(false)
    setError(null)
    setMint(null)
  }

  const close = () => {
    if (busy) return
    onClose()
    if (phase === 'done') reset()
  }

  async function run() {
    setError(null)
    setBusy(true)
    try {
      if (phase === 'connect') {
        const res = await w.connect()
        if (!res) throw new Error('Could not connect the wallet.')
        setPhase('launch')
      } else if (phase === 'launch') {
        await wait(1400) // TODO(backend): POST /api/token { action: 'prepare' } → signera → { action: 'confirm' }
        const m = demoMint()
        setMint(m)
        setPhase('split')
      } else if (phase === 'split') {
        await wait(1200) // TODO(backend): POST /api/feeshare { action: 'build' } → signera → { action: 'confirm' }
        const now = Date.now()
        const m = mint ?? demoMint()
        saveLocalCoin({
          ...draft,
          mint: m,
          status: 'building',
          launchedAt: now,
          startedAt: now, // TODO(backend): POST /api/generate
          speed: 30,
          local: true,
        })
        setMint(m)
        setPhase('done')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const steps: { id: Phase; title: string; desc: string }[] = [
    {
      id: 'connect',
      title: wallet ? `Connected · ${wallet.name}` : 'Connect a wallet',
      desc: wallet ? shortAddr(wallet.address, 6, 6) : 'Phantom or Solflare',
    },
    {
      id: 'launch',
      title: 'Approve the launch',
      desc: `Creates $${draft.ticker || 'TICKER'} on pump.fun and pays ${total} SOL`,
    },
    {
      id: 'split',
      title: 'Approve the fee split',
      desc: `Creator fees: ${BRAND.creatorShare}% you · ${100 - BRAND.creatorShare}% ${BRAND.name}`,
    },
    { id: 'done', title: 'Build started', desc: `About ${BRAND.buildMinutes} minutes. You can close this page.` },
  ]

  const cta: Record<Phase, string> = {
    connect: 'Connect wallet',
    launch: 'Approve in wallet',
    split: 'Approve fee split',
    done: 'Open coin page',
  }

  return (
    <Modal open={open} onClose={close} label="Launch coin and build">
      <div className="modal-head">
        <div>
          <h3>Launch {draft.name || 'your app'}</h3>
          <p className="muted">Two approvals: one to launch, one to set the fee split.</p>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close" disabled={busy}>
          <X size={18} />
        </button>
      </div>
      <ol className="lsteps">
        {steps.map((s, i) => {
          const st = i < idx || (s.id === 'done' && phase === 'done') ? 'done' : i === idx ? 'active' : 'waiting'
          return (
            <li key={s.id} className={`lstep is-${st}`}>
              <span className="lstep-dot">
                {st === 'done' ? (
                  <Check size={13} strokeWidth={3} />
                ) : busy && st === 'active' ? (
                  <Loader2 size={14} className="spin" />
                ) : (
                  i + 1
                )}
              </span>
              <div>
                <strong>{s.title}</strong>
                <span>{s.desc}</span>
              </div>
            </li>
          )
        })}
      </ol>
      {error && <p className="form-error">{error}</p>}
      <button
        type="button"
        className="btn btn-primary btn-lg btn-block"
        disabled={busy}
        onClick={() => (phase === 'done' && mint ? navigate(`/coin/${mint}`) : run())}
      >
        {busy ? <Loader2 size={16} className="spin" /> : null}
        {busy ? 'Waiting for wallet…' : cta[phase]}
      </button>
      <p className="modal-note">Demo mode: nothing is signed or sent. If a launch doesn't go through, nothing is charged.</p>
    </Modal>
  )
}
