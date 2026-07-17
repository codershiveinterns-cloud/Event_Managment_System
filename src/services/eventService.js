import { apiRequest } from './api.js'

function normalizeEvent(event) {
  return {
    ...event,
    id: event.id || event._id,
    image: event.image || event.imageUrl,
    priceLabel: event.priceLabel || (typeof event.price === 'number' ? `Starting from ₹${event.price.toLocaleString('en-IN')}` : event.price),
  }
}

export async function getEvents() {
  try {
    const events = await apiRequest('/events')
    return events.map(normalizeEvent)
  } catch (error) {
    return []
  }
}

export async function getFeaturedEvents() {
  try {
    const events = await apiRequest('/events/featured')
    return events.map(normalizeEvent)
  } catch (error) {
    try {
      const events = await apiRequest('/events')
      return events.filter((event) => event.featured).slice(0, 3).map(normalizeEvent)
    } catch (_fallbackError) {
      return []
    }
  }
}

export async function getContactEvents() {
  try {
    const events = await apiRequest('/events/contact-options')
    return events.map(normalizeEvent)
  } catch (error) {
    try {
      const events = await apiRequest('/events')
      return events.map(normalizeEvent)
    } catch (_fallbackError) {
      return []
    }
  }
}

export async function getEventById(eventId) {
  const events = await getContactEvents()
  return events.find((event) => event.id === eventId || event._id === eventId)
}
