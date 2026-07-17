import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'
import DetailModal from '../../components/admin/DetailModal.jsx'
import useAutoHideMessage from '../../hooks/useAutoHideMessage.js'
import { addAdminGallery, deleteAdminGallery, getAdminGallery, updateAdminGallery } from '../../services/adminService.js'
import { resolveAssetUrl } from '../../services/api.js'

const initialForm = {
  title: '',
  category: '',
  media: null,
}

function getMediaUrl(item) {
  return resolveAssetUrl(item.src || item.mediaUrl || item.imageUrl)
}

function isVideo(item) {
  return item.mediaType === 'video'
}

function MediaPreview({ item, className = 'h-full w-full object-cover' }) {
  const src = getMediaUrl(item)

  if (isVideo(item)) {
    return <video src={src} className={className} controls muted playsInline />
  }

  return <img src={src} alt={item.title} className={className} />
}

export default function GalleryManager() {
  const [formData, setFormData] = useState(initialForm)
  const [gallery, setGallery] = useState([])
  const [editingId, setEditingId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredGallery = normalizedSearchTerm
    ? gallery.filter((item) => [
      item.title,
      item.category,
      item.mediaType || 'image',
      item.mediaUrl,
      item.imageUrl,
      item.src,
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearchTerm)))
    : gallery

  useAutoHideMessage(error, () => setError(''))
  useAutoHideMessage(message, () => setMessage(''))

  async function loadGallery() {
    try {
      const data = await getAdminGallery()
      setGallery(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  function resetForm() {
    setFormData(initialForm)
    setEditingId('')
  }

  function handleChange(event) {
    const { name, value, type, files } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'file' ? files[0] : value,
    }))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setFormData({ title: item.title, category: item.category, media: null })
    setMessage(`Editing ${item.title}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function buildPayload() {
    const payload = new FormData()
    payload.append('title', formData.title)
    payload.append('category', formData.category)
    if (formData.media) payload.append('media', formData.media)
    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (editingId) {
        await updateAdminGallery(editingId, buildPayload())
        setMessage('Gallery media updated successfully.')
      } else {
        await addAdminGallery(buildPayload())
        setMessage('Gallery media added successfully. It will appear in the home page gallery.')
      }

      resetForm()
      event.target.reset()
      await loadGallery()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    try {
      await deleteAdminGallery(deleteTarget.id)
      setGallery((current) => current.filter((item) => item.id !== deleteTarget.id))
      if (editingId === deleteTarget.id) resetForm()
      setDeleteTarget(null)
      setMessage('Gallery media deleted successfully.')
      await loadGallery()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="flex min-w-0 flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.35em]">Gallery Manager</p>
          <h2 className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">Manage home page gallery</h2>
          <p className="mt-3 max-w-3xl break-words text-zinc-400">
            Manage premium images and videos for the home page gallery here.
          </p>
        </div>
        {editingId && (
          <button type="button" onClick={resetForm} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="mt-8 space-y-8">
        <form onSubmit={handleSubmit} className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 sm:p-6">
          {error && <p className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {message && <p className="mb-5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}

          <label className="block min-w-0">
            <span className="text-sm font-semibold text-zinc-200">Category</span>
            <input
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Wedding, Corporate, Birthday"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"
            />
          </label>

          <label className="mt-5 block min-w-0">
            <span className="text-sm font-semibold text-zinc-200">Title</span>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Grand Wedding Stage"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"
            />
          </label>

          <label className="mt-5 block min-w-0">
            <span className="text-sm font-semibold text-zinc-200">Gallery Media</span>
            <input
              type="file"
              accept="image/*,video/*"
              name="media"
              required={!editingId}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:font-bold file:text-zinc-950"
            />
            <p className="mt-2 text-xs text-zinc-500">You can upload both images and videos.</p>
          </label>

          <div className="mt-6 flex justify-end">
            <button disabled={loading} className="w-auto rounded-full bg-amber-300 px-6 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update Gallery Media' : 'Add Gallery Media'}
            </button>
          </div>
        </form>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h3 className="break-words text-2xl font-semibold text-white">Gallery Media</h3>
            <p className="text-sm text-zinc-400">{normalizedSearchTerm ? `${filteredGallery.length} of ${gallery.length} total` : `${gallery.length} total`}</p>
          </div>
          <label className="mt-5 block max-w-md">
            <span className="sr-only">Search gallery media</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search gallery by title, category, type..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
            />
          </label>
          <div className="mt-5 max-h-[36rem] overflow-y-auto pr-2">
            <div className="grid auto-rows-[12rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredGallery.map((item) => (
                <article
                  key={item.id}
                  className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/20"
                >
                  <MediaPreview item={item} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber-200 sm:tracking-[0.25em]">{item.category} • {item.mediaType || 'image'}</p>
                    <h3 className="mt-2 line-clamp-2 break-words text-base font-semibold text-white">{item.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setViewTarget(item)} className="rounded-full border border-sky-300/40 bg-black/40 px-3 py-1.5 text-xs font-bold text-sky-100 backdrop-blur hover:bg-sky-300/10">
                        View
                      </button>
                      <button type="button" onClick={() => startEdit(item)} className="rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-zinc-950">
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(item)} className="rounded-full border border-red-300/40 bg-black/40 px-3 py-1.5 text-xs font-bold text-red-100 backdrop-blur hover:bg-red-300/10">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {!filteredGallery.length && <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-zinc-400 sm:col-span-2 lg:col-span-3 2xl:col-span-4">{gallery.length ? 'No gallery media match your search.' : 'No gallery media added yet.'}</p>}
            </div>
          </div>
        </div>
      </div>

      <DetailModal open={Boolean(viewTarget)} title={viewTarget?.title || 'Gallery Media'} onClose={() => setViewTarget(null)} maxWidth="max-w-4xl">
        {viewTarget && (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <MediaPreview item={viewTarget} className="max-h-[18rem] w-full object-contain sm:max-h-[28rem]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <p><span className="font-semibold text-amber-200">Category:</span> {viewTarget.category}</p>
              <p><span className="font-semibold text-amber-200">Type:</span> {viewTarget.mediaType || 'image'}</p>
              <p className="sm:col-span-2 break-all"><span className="font-semibold text-amber-200">File:</span> {viewTarget.mediaUrl || viewTarget.imageUrl || viewTarget.src}</p>
            </div>
          </div>
        )}
      </DetailModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete gallery media?"
        message="This media will be removed from both the admin gallery and the home page gallery."
        confirmLabel="Delete Media"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  )
}
