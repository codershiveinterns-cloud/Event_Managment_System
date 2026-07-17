export default function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : ''

  return (
    <div className={`max-w-3xl min-w-0 ${alignment}`}>
      {eyebrow && (
        <p className="mb-3 break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80 sm:text-sm sm:tracking-[0.35em]">
          {eyebrow}
        </p>
      )}
      <h2 className="break-words text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
    </div>
  )
}
