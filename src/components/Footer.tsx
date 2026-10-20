import { Link } from 'react-router-dom'
import { BRAND } from '../lib/brand'
import { Logo } from './Logo'
import { XIcon } from './XIcon'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" aria-label={`${BRAND.name} home`}>
              <Logo />
            </Link>
            <p>{BRAND.tagline}</p>
            <a className="footer-x" href={BRAND.xUrl} target="_blank" rel="noreferrer">
              <XIcon size={14} /> {BRAND.xHandle}
            </a>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <Link to="/build">Launch</Link>
              <Link to="/catalog">Software</Link>
              <Link to="/apps">Apps</Link>
              <Link to="/watch">Watch a build</Link>
            </div>
            <div>
              <h4>Manual</h4>
              <Link to="/docs#quickstart">Quickstart</Link>
              <Link to="/docs#fees">Launches and fees</Link>
              <Link to="/docs#policy">Originality policy</Link>
              <Link to="/docs#api">API</Link>
            </div>
            <div>
              <h4>Token</h4>
              <Link to="/token">${BRAND.ticker}</Link>
              <Link to="/apps#launches">Live launches</Link>
              <Link to="/docs#faq">FAQ</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <span>Product names on this site only identify other software. {BRAND.name} isn't affiliated with their owners.</span>
        </div>
      </div>
    </footer>
  )
}
