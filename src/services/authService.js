import { apiRequest, clearAuthSession, getStoredAdmin, setAuthSession, setStoredAdmin } from './api.js'

export async function signupAdmin(payload) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setAuthSession(data)
  return data
}

export async function loginAdmin(payload) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setAuthSession(data)
  return data
}

export function forgotPassword(payload) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentAdmin() {
  return apiRequest('/auth/me')
}

export async function updateAdminProfile(payload) {
  const data = await apiRequest('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  setStoredAdmin(data.admin)
  return data
}

export function logoutAdmin() {
  clearAuthSession()
}

export { getStoredAdmin }
