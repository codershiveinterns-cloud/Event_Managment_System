import { apiRequest } from './api.js'

export function getDashboardSummary(bookingId = '') {
  return apiRequest(`/admin/dashboard/summary${bookingId ? `?bookingId=${encodeURIComponent(bookingId)}` : ''}`)
}

export function getAdminEvents() {
  return apiRequest('/admin/events')
}

export function getAdminEvent(id) {
  return apiRequest(`/admin/events/${id}`)
}

export function addAdminEvent(formData) {
  return apiRequest('/admin/events', {
    method: 'POST',
    body: formData,
  })
}

export function updateAdminEvent(id, formData) {
  return apiRequest(`/admin/events/${id}`, {
    method: 'PUT',
    body: formData,
  })
}

export function deleteAdminEvent(id) {
  return apiRequest(`/admin/events/${id}`, {
    method: 'DELETE',
  })
}

export function getAdminGallery() {
  return apiRequest('/admin/gallery')
}

export function addAdminGallery(formData) {
  return apiRequest('/admin/gallery', {
    method: 'POST',
    body: formData,
  })
}

export function updateAdminGallery(id, formData) {
  return apiRequest(`/admin/gallery/${id}`, {
    method: 'PUT',
    body: formData,
  })
}

export function deleteAdminGallery(id) {
  return apiRequest(`/admin/gallery/${id}`, {
    method: 'DELETE',
  })
}

export function getBookings(status = '') {
  return apiRequest(`/admin/bookings${status ? `?status=${status}` : ''}`)
}

export function getBooking(id) {
  return apiRequest(`/admin/bookings/${id}`)
}

export function createBooking(payload) {
  return apiRequest('/admin/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateBooking(id, payload) {
  return apiRequest(`/admin/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteBooking(id) {
  return apiRequest(`/admin/bookings/${id}`, {
    method: 'DELETE',
  })
}

export function getStaff() {
  return apiRequest('/admin/staff')
}

export function createStaff(payload) {
  return apiRequest('/admin/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStaff(id, payload) {
  return apiRequest(`/admin/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteStaff(id) {
  return apiRequest(`/admin/staff/${id}`, {
    method: 'DELETE',
  })
}
