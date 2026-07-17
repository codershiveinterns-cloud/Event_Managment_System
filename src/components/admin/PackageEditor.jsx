const emptyPackage = {
  name: '',
  price: '',
  description: '',
  includes: '',
  featured: false,
}

export default function PackageEditor({ packages, onChange }) {
  function updatePackage(index, field, value) {
    const next = packages.map((pkg, pkgIndex) => (pkgIndex === index ? { ...pkg, [field]: value } : pkg))
    onChange(next)
  }

  function addPackage() {
    onChange([...packages, { ...emptyPackage }])
  }

  function removePackage(index) {
    onChange(packages.filter((_pkg, pkgIndex) => pkgIndex !== index))
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Event Packages</h3>
          <p className="mt-1 text-sm text-zinc-400">Add packages such as Silver, Gold, and Platinum, along with their inclusions.</p>
        </div>
        <button type="button" onClick={addPackage} className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-zinc-950">
          Add Package
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {packages.map((pkg, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Package name" value={pkg.name} onChange={(event) => updatePackage(index, 'name', event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
              <input type="number" min="0" placeholder="Package price" value={pkg.price} onChange={(event) => updatePackage(index, 'price', event.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
            </div>
            <textarea placeholder="Package description" rows="2" value={pkg.description} onChange={(event) => updatePackage(index, 'description', event.target.value)} className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
            <textarea placeholder="Included services - one per line" rows="3" value={Array.isArray(pkg.includes) ? pkg.includes.join('\n') : pkg.includes} onChange={(event) => updatePackage(index, 'includes', event.target.value)} className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
            <div className="mt-4 flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                <input type="checkbox" checked={Boolean(pkg.featured)} onChange={(event) => updatePackage(index, 'featured', event.target.checked)} className="h-5 w-5 accent-amber-300" />
                Featured package
              </label>
              <button type="button" onClick={() => removePackage(index)} className="rounded-full border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-300/10">
                Remove
              </button>
            </div>
          </div>
        ))}
        {!packages.length && <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">No packages added yet.</p>}
      </div>
    </div>
  )
}
