import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo.jsx'
import { getStoredAdmin, logoutAdmin } from '../services/authService.js'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', helper: 'Overview' },
  { label: 'Events', path: '/admin/dashboard/events', helper: 'Catalog' },
  { label: 'Bookings', path: '/admin/dashboard/bookings', helper: 'Operations' },
  { label: 'Staff', path: '/admin/dashboard/staff', helper: 'Team' },
  { label: 'Gallery', path: '/admin/dashboard/gallery', helper: 'Media' },
  { label: 'Profile', path: '/admin/dashboard/profile', helper: 'Account' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(getStoredAdmin)

  function handleLogout() {
    logoutAdmin()
    setAdmin(null)
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `group relative shrink-0 overflow-hidden whitespace-nowrap rounded-2xl border px-4 py-3.5 text-sm font-black tracking-wide transition duration-300 ${
      isActive
        ? 'border-amber-200/70 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 !text-zinc-950 shadow-xl shadow-amber-950/40 ring-1 ring-amber-100/40'
        : 'border-white/10 bg-white/[0.04] text-zinc-200 shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:border-amber-300/45 hover:bg-amber-300/10 hover:text-amber-100 hover:shadow-amber-950/20'
    }`

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="min-h-screen min-w-0 lg:block">
        <aside className="relative overflow-hidden border-b border-white/10 bg-zinc-950/90 p-4 backdrop-blur-xl sm:p-5 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-[18rem] lg:border-b-0 lg:border-r lg:p-6 xl:w-[20rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.18),transparent_18rem)]" />
          <div className="relative flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:block">
            <div className="min-w-0">
              <BrandLogo size="md" />
              <p className="mt-4 break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80 sm:tracking-[0.35em]">Admin Suite</p>
              <p className="mt-2 max-w-[14rem] break-words text-sm leading-6 text-zinc-400">Premium control center for KM Events operations.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-amber-300/60 hover:bg-white/10 sm:w-auto lg:mt-6 lg:w-full"
            >
              Logout
            </button>
          </div>

          {admin && (
            <div className="relative mt-6 min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-300 font-black text-zinc-950">
                  {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{admin.name}</p>
                  <p className="truncate text-xs text-zinc-500">{admin.email}</p>
                </div>
              </div>
              <Link to="/admin/dashboard/profile" className="mt-4 inline-flex max-w-full justify-center rounded-full border border-amber-300/30 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.12em] text-amber-100 transition hover:bg-amber-300 hover:text-zinc-950 sm:tracking-[0.16em]">
                Edit Profile
              </Link>
            </div>
          )}

          <nav className="relative mt-8 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {adminLinks.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.path === '/admin/dashboard'} className={linkClass}>
                <span className="block uppercase tracking-[0.16em] text-current">{link.label}</span>
                <span className="mt-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-current opacity-80 group-hover:opacity-95">{link.helper}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:ml-[18rem] lg:p-10 xl:ml-[20rem]">
          <Outlet context={{ admin, setAdmin }} />
        </main>
      </div>
    </div>
  )
}
