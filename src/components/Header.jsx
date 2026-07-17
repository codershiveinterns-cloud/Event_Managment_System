import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { siteContent } from '../data/siteContent.js'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { navItems } = siteContent

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
      isActive ? 'bg-amber-300 text-zinc-950 shadow-lg shadow-amber-950/20' : 'text-zinc-200 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
      <nav className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo asLink size="md" onClick={() => setIsOpen(false)} />

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="whitespace-nowrap rounded-full border border-amber-300/40 px-5 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300 hover:text-zinc-950">
            Login
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-amber-300/50 hover:bg-white/10 lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
        >
          Menu
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 px-4 pb-5 sm:px-6 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass} onClick={() => setIsOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/admin/login" onClick={() => setIsOpen(false)} className="rounded-full border border-amber-300/40 px-4 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300 hover:text-zinc-950">
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
