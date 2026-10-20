import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import Apps from './pages/Apps'
import Build from './pages/Build'
import Catalog from './pages/Catalog'
import Coin from './pages/Coin'
import Docs from './pages/Docs'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Token from './pages/Token'
import Watch from './pages/Watch'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="build" element={<Build />} />
        <Route path="apps" element={<Apps />} />
        <Route path="watch" element={<Watch />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="docs" element={<Docs />} />
        <Route path="token" element={<Token />} />
        <Route path="coin/:mint" element={<Coin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
