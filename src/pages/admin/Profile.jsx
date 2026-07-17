import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PasswordField from '../../components/PasswordField.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { getStoredAdmin, updateAdminProfile } from '../../services/authService.js'

function buildInitialForm(admin) {
  return {
    name: admin?.name || '',
    email: admin?.email || '',
    currentPassword: '',
    newPassword: '',
  }
}

export default function Profile() {
  const context = useOutletContext() || {}
  const admin = context.admin || getStoredAdmin()
  const [formData, setFormData] = useState(buildInitialForm(admin))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(success, () => setSuccess(''))

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      name: admin?.name || '',
      email: admin?.email || '',
    }))
  }, [admin?.name, admin?.email])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }

    const wantsPasswordChange = formData.currentPassword || formData.newPassword
    if (wantsPasswordChange && (!formData.currentPassword || !formData.newPassword)) {
      setError('Current password and new password both are required to change password')
      return
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      ...(wantsPasswordChange
        ? {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }
        : {}),
    }

    setLoading(true)
    try {
      const data = await updateAdminProfile(payload)
      context.setAdmin?.(data.admin)
      setFormData((current) => ({
        ...current,
        currentPassword: '',
        newPassword: '',
      }))
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_24rem)]" />
        <div className="relative min-w-0">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Admin Profile</p>
          <h2 className="mt-4 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">Edit profile</h2>
          <p className="mt-4 max-w-3xl break-words leading-7 text-zinc-300">
            Update your admin name, email, and password for the KM Events dashboard.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid min-w-0 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 sm:p-6">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">Profile Details</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Account information</h3>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-zinc-200">Name</span>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
              placeholder="Admin name"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-zinc-200">Email</span>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
              placeholder="admin@example.com"
            />
          </label>
        </section>

        <section className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 sm:p-6">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">Security</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Change password</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Leave password fields empty if you only want to update name or email.</p>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-zinc-200">Current Password</span>
            <PasswordField
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-2"
              placeholder="Current password"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-zinc-200">New Password</span>
            <PasswordField
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-2"
              placeholder="Minimum 6 characters"
            />
          </label>
        </section>

        <div className="xl:col-span-2">
          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {success && <p className="rounded-2xl bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}

          <button type="submit" disabled={loading} className="mt-5 w-full rounded-full bg-amber-300 px-8 py-4 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60 sm:w-auto">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </section>
  )
}
