import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo.jsx'
import PasswordField from '../../components/PasswordField.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { signupAdmin } from '../../services/authService.js'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useAutoHideMessage(error, () => setError(''))

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signupAdmin(formData)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(125,68,255,0.12),transparent_28rem)]" />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
        <div className="mb-8 flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Admin Signup</p>
        <h1 className="mt-4 break-words text-2xl font-bold text-white sm:text-3xl">Create admin account</h1>
        <p className="mt-3 break-words text-sm leading-6 text-zinc-400">This signup page is available by direct URL only. The navigation will only show the Login button.</p>

        {error && <p className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <label className="mt-6 block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Name</span>
          <input required name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
        </label>

        <label className="mt-5 block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Email</span>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
        </label>

        <label className="mt-5 block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Password</span>
          <PasswordField required minLength="6" name="password" value={formData.password} onChange={handleChange} className="mt-2" />
        </label>

        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Admin'}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have account? <Link to="/admin/login" className="font-semibold text-amber-200">Login</Link>
        </p>
      </form>
    </section>
  )
}
