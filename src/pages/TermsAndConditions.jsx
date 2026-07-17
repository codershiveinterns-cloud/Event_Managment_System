import SectionHeader from '../components/SectionHeader.jsx'
import { siteContent } from '../data/siteContent.js'

const terms = [
  {
    title: 'Website Use',
    content: 'This website is provided to share KM Events services, event categories, and inquiry options. Please use the website only for lawful and genuine event-related communication.',
  },
  {
    title: 'Event Inquiries',
    content: 'Submitting an inquiry does not confirm a booking. Bookings are confirmed only after event details, scope, pricing, and availability are reviewed and accepted by KM Events.',
  },
  {
    title: 'Pricing and Quotations',
    content: 'Any package, estimate, or quotation may vary based on venue, date, guest count, decor requirements, vendor availability, logistics, and final scope of work.',
  },
  {
    title: 'Client Responsibilities',
    content: 'Clients are responsible for sharing accurate event details, approvals, venue rules, guest requirements, and timelines needed for smooth planning and execution.',
  },
  {
    title: 'Vendor and Venue Coordination',
    content: 'KM Events may coordinate with vendors and venues as part of the event plan. Vendor availability, venue permissions, and third-party service terms may affect final execution.',
  },
  {
    title: 'Rescheduling and Cancellations',
    content: 'Rescheduling, cancellation, and refund terms depend on the confirmed event agreement, vendor commitments, date proximity, and work already completed.',
  },
  {
    title: 'Photography and Media',
    content: 'Event photos or videos may be used for portfolio or promotional purposes only with appropriate permission or as agreed during the booking process.',
  },
  {
    title: 'Limitation of Liability',
    content: 'KM Events works to deliver reliable planning and coordination, but is not responsible for delays or failures caused by circumstances outside reasonable control, including weather, venue restrictions, or third-party issues.',
  },
]

export default function TermsAndConditions() {
  const { contact } = siteContent

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl min-w-0">
        <SectionHeader
          eyebrow="Terms & Conditions"
          title="Clear terms for website use and event inquiries"
          description="These terms are provided for general website use and service communication. Confirmed bookings may include additional event-specific terms in written quotations or agreements."
        />

        <div className="mt-10 min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
          {terms.map((term) => (
            <article key={term.title} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
              <h2 className="break-words text-xl font-semibold text-white">{term.title}</h2>
              <p className="mt-3 break-words leading-7 text-zinc-400">{term.content}</p>
            </article>
          ))}

          <article className="min-w-0 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
            <h2 className="break-words text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3 break-words leading-7 text-zinc-300">
              For questions about these terms, email us at <span className="break-all font-semibold text-amber-200">{contact.email}</span>.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
