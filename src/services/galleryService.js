import { apiRequest, resolveAssetUrl } from './api.js'

function normalizeGalleryItem(item) {
  const src = item.src || item.mediaUrl || item.imageUrl
  return {
    id: item.id || item._id,
    title: item.title,
    category: item.category,
    src: resolveAssetUrl(src),
    mediaType: item.mediaType || 'image',
  }
}

export async function getGalleryImages() {
  try {
    const gallery = await apiRequest('/gallery')
    return gallery.map(normalizeGalleryItem)
  } catch (_error) {
    return []
  }
}
