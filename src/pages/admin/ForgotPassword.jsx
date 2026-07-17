import { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { forgotPassword } from '../../services/authService.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(message, () => setMessage(''))

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const data = await forgotPassword({ email })
      setMessage(data.message || 'Your password reset request has been received.')
      setEmail('')
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
        <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Admin Password Reset</p>
        <h1 className="mt-4 break-words text-2xl font-bold text-white sm:text-3xl">Forgot your password?</h1>
        <p className="mt-3 break-words text-sm leading-6 text-zinc-400">
          Enter your admin email address. If the account exists, we will record your reset request.
        </p>

        {error && <p className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {message && <p className="mt-5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">{message}</p>}

        <label className="mt-6 block min-w-0">
          <span className="text-sm font-semibold text-zinc-200">Email</span>
          <input required type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" />
        </label>

        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
          {loading ? 'Sending request...' : 'Send Reset Request'}
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link to="/admin/login" className="font-semibold text-amber-200 hover:text-amber-100">
            Back to Login
          </Link>
          <Link to="/" className="font-semibold text-zinc-300 hover:text-white">
            Home
          </Link>
        </div>
      </form>
    </section>
  )
}
