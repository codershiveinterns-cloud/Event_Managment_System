import SectionHeader from '../components/SectionHeader.jsx'

const values = [
  {
    title: 'Premium Design Sense',
    description: 'Every stage, table, entry, and guest moment is designed to feel elegant and intentional.',
  },
  {
    title: 'Vendor Coordination',
    description: 'Decor, catering, lighting, music, and hospitality partners are managed through one clear plan.',
  },
  {
    title: 'Stress-free Execution',
    description: 'From planning timeline to event-day flow, our team keeps the celebration smooth and controlled.',
  },
]

export default function About() {
  return (
    <>
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl min-w-0 gap-12 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-center">
          <SectionHeader
            eyebrow="About Us"
            title="Ajmer-based event planning with style, structure, and dependable execution."
            description="KM Events is built for clients who want refined planning, calm coordination, and celebrations that look as good as they feel."
          />

          <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 sm:rounded-[2.5rem] sm:p-8">
            <p className="break-words text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9">
              We manage weddings, birthdays, office gatherings, and private celebrations from concept to execution. Our approach keeps the process clear, the styling polished, and the event-day experience smooth for every host and guest.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Concept Planning', 'Decor Styling', 'Guest Experience', 'On-site Management'].map((item) => (
                <div key={item} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 font-semibold text-amber-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl min-w-0">
          <SectionHeader
            align="center"
            eyebrow="Why Choose Us"
            title="A premium process, not just premium decoration"
            description="Good events need design, planning, coordination, and calm execution. Our workflow covers all four."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-amber-300/40 hover:bg-white/[0.07] sm:p-7">
                <h3 className="break-words text-xl font-semibold text-white">{value.title}</h3>
                <p className="mt-4 break-words leading-7 text-zinc-400">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
