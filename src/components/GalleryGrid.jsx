function GalleryMedia({ image }) {
  if (image.mediaType === 'video') {
    return (
      <video
        src={image.src}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        controls
        muted
        playsInline
      />
    )
  }

  return (
    <img
      src={image.src}
      alt={image.title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  )
}

export default function GalleryGrid({ images }) {
  return (
    <div className="grid auto-rows-[14rem] gap-4 sm:auto-rows-[16rem] sm:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
      {images.map((image, index) => (
        <article
          key={image.id}
          className={`group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/20 ${
            index === 0 || index === 3 ? 'lg:row-span-2' : ''
          }`}
        >
          <GalleryMedia image={image} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 min-w-0 p-4 sm:p-5">
            <p className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-xs sm:tracking-[0.3em]">
              {image.category}
            </p>
            <h3 className="mt-2 line-clamp-2 break-words text-lg font-semibold text-white sm:mt-3 sm:text-xl">{image.title}</h3>
          </div>
        </article>
      ))}
    </div>
  )
}
