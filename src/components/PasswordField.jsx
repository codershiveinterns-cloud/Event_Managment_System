import { useState } from 'react'

export default function PasswordField({ className = '', inputClassName = '', ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 pr-12 text-white outline-none transition focus:border-amber-300 ${inputClassName}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.08A9.77 9.77 0 0112 4.85c5.5 0 9 5.15 9 7.15a5.34 5.34 0 01-1.42 2.86" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.1 6.1C4.15 7.42 3 10.02 3 12c0 2 3.5 7.15 9 7.15a9.7 9.7 0 004.05-.88" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12s3.5-7.15 9-7.15S21 12 21 12s-3.5 7.15-9 7.15S3 12 3 12z" />
            <circle cx="12" cy="12" r="2.6" />
          </svg>
        )}
      </button>
    </div>
  )
}
