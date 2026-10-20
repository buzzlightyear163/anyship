import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Loader2, LogOut, Menu, Wallet, X } from 'lucide-react'
import { BRAND } from '../lib/brand'
import { shortAddr } from '../lib/format'
import { useWallet } from '../lib/walletContext'
import { Logo } from './Logo'
import { XIcon } from './XIcon'

export const NAV = [
  { to: '/catalog', label: 'Software' },
  { to: '/apps', label: 'Apps' },
  { to: '/docs', label: 'Manual' },
  { to: '/token', label: 'Token' },
]

function WalletButton({ block = false }: { block?: boolean }) {
  const w = useWallet()
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenu(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menu])

  if (!w.address) {
    return (
      <button type="button" className={`btn btn-secondary btn-sm wallet-btn${block ? ' btn-block btn-lg' : ''}`} onClick={() => void w.connect()} disabled={w.connecting}>
        {w.connecting ? <Loader2 size={14} className="spin" /> : <Wallet size={14} />}
        {w.connecting ? 'Connecting…' : 'Connect wallet'}
      </button>
    )
  }
  return (
    <div className="wallet-wrap" ref={ref}>
      <button type="button" className={`btn btn-secondary btn-sm wallet-btn on${block ? ' btn-block btn-lg' : ''}`} onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
        <i className="wallet-dot" />
        <span className="mono">{shortAddr(w.address, 4, 4)}</span>
      </button>
      {menu && (
        <div className="wallet-menu" role="menu">
          <span className="wallet-menu-label">{w.demo ? 'Demo wallet' : w.name}</span>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              w.disconnect()
              setMenu(false)
            }}
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
  }, [open])

  return (
    <header className={`header${scrolled || open ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label={`${BRAND.name} home`}>
          <Logo />
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          <a className="icon-btn header-x" href={BRAND.xUrl} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`}>
            <XIcon />
          </a>
          <div className="header-wallet">
            <WalletButton />
          </div>
          <Link to="/build" className="btn btn-primary btn-sm header-cta">
            Launch an app
          </Link>
          <button
            type="button"
            className="icon-btn burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        <nav className="container" aria-label="Mobile">
          <NavLink to="/build" tabIndex={open ? 0 : -1}>
            Launch
          </NavLink>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} tabIndex={open ? 0 : -1}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/watch" tabIndex={open ? 0 : -1}>
            Watch a build
          </NavLink>
          <div className="mobile-actions">
            <WalletButton block />
            <Link to="/build" className="btn btn-primary btn-lg btn-block" tabIndex={open ? 0 : -1}>
              Launch an app
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
