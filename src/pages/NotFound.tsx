import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTitle } from '../hooks/useTitle'

export default function NotFound() {
  useTitle('Not found')
  return (
    <div className="page">
      <div className="container narrow-page">
        <span className="eyebrow mono">404</span>
        <h1 className="h1">This page doesn't exist</h1>
        <p className="lead">The link might be old, or the page moved.</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={15} /> Back home
        </Link>
      </div>
    </div>
  )
}
