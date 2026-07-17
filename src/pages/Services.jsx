import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader.jsx'

const services = [
  {
    title: 'Wedding Planning',
    description: 'Complete support for ceremonies, receptions, decor themes, vendor coordination, and guest flow.',
  },
  {
    title: 'Birthday Celebrations',
    description: 'Stylish birthday concepts for children, families, milestone celebrations, and intimate parties.',
  },
  {
    title: 'Corporate Events',
    description: 'Professional planning for office parties, launches, annual functions, and team gatherings.',
  },
  {
    title: 'Private Parties',
    description: 'Thoughtful setup, hospitality planning, and smooth coordination for personal occasions.',
  },
  {
    title: 'Decor & Theme Styling',
    description: 'Color palettes, stage styling, entry concepts, table settings, lighting direction, and detail planning.',
  },
  {
    title: 'Vendor Coordination',
    description: 'A clear bridge between decor, catering, music, photography, venue teams, and on-ground execution.',
  },
]

const process = [
  'Consultation',
  'Concept & Budget Planning',
  'Vendor Coordination',
  'Event-day Execution',
]

export default function Services() {
  return (
    <>
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl min-w-0">
          <SectionHeader
            eyebrow="Our Services"
            title="Complete event planning support from concept to celebration."
            description="KM Events brings together design, planning, vendor coordination, and event-day management so your celebration feels polished and stress-free."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-amber-300/40 hover:bg-white/[0.07] sm:p-7">
                <h3 className="break-words text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 break-words leading-7 text-zinc-400">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl min-w-0 rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/15 via-white/[0.05] to-zinc-950 p-6 shadow-2xl shadow-black/30 sm:rounded-[2.5rem] sm:p-10">
          <SectionHeader
            align="center"
            eyebrow="Our Process"
            title="A clear workflow for a calm event experience"
            description="Every event is planned step by step, with practical timelines and coordinated execution."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div key={item} className="min-w-0 rounded-3xl border border-white/10 bg-black/25 p-5 text-center sm:p-6">
                <p className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-black text-zinc-950">{index + 1}</p>
                <h3 className="mt-4 break-words font-semibold text-white">{item}</h3>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex w-full justify-center rounded-full bg-amber-300 px-8 py-4 font-bold text-zinc-950 transition hover:bg-amber-200 sm:w-auto">
              Discuss Your Event
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
