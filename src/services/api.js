export const API_URL = import.meta.env.VITE_API_URL || '/api'
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || ''

export function getAuthToken() {
  return localStorage.getItem('adminToken')
}

export function setStoredAdmin(admin) {
  localStorage.setItem('adminUser', JSON.stringify(admin))
}

export function setAuthSession({ token, admin }) {
  localStorage.setItem('adminToken', token)
  setStoredAdmin(admin)
}

export function clearAuthSession() {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
}

export function getStoredAdmin() {
  const admin = localStorage.getItem('adminUser')
  return admin ? JSON.parse(admin) : null
}

export function resolveAssetUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/images')) return url
  return `${API_ORIGIN}${url}`
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
