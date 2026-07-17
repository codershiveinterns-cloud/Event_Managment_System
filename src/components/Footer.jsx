import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { siteContent } from '../data/siteContent.js'

export default function Footer() {
  const { brand, navItems, legalItems, contact } = siteContent

  return (
    <footer className="border-t border-white/10 bg-black/30 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl min-w-0 gap-10 md:grid-cols-2 xl:grid-cols-[1.25fr_0.75fr_0.8fr_1fr]">
        <div className="min-w-0">
          <BrandLogo size="lg" />
          <p className="mt-5 max-w-md break-words leading-7 text-zinc-400">{brand.tagline}</p>
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-amber-200">Pages</h3>
          <div className="mt-4 flex flex-col gap-3 text-zinc-400">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="break-words transition hover:text-amber-200">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-amber-200">Legal</h3>
          <div className="mt-4 flex flex-col gap-3 text-zinc-400">
            {legalItems.map((item) => (
              <Link key={item.path} to={item.path} className="break-words transition hover:text-amber-200">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-amber-200">Contact</h3>
          <div className="mt-4 space-y-3 text-zinc-400">
            <p className="break-all">{contact.email}</p>
            <p className="break-words">{contact.location}</p>
            <p className="break-words">{contact.hours}</p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        © 2026 {brand.name}. All rights reserved.
      </p>
    </footer>
  )
}
