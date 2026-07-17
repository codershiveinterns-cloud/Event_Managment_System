import SectionHeader from '../components/SectionHeader.jsx'
import { siteContent } from '../data/siteContent.js'

const faqs = [
  {
    question: 'What types of events does KM Events manage?',
    answer: 'We plan and coordinate weddings, birthdays, corporate gatherings, private parties, family functions, decor setups, and customized celebrations.',
  },
  {
    question: 'Where is KM Events located?',
    answer: 'KM Events is based in Ajmer and supports clients with professional planning, decor coordination, and event-day management.',
  },
  {
    question: 'How early should I contact KM Events?',
    answer: 'For larger events, it is best to contact us a few weeks or months in advance. Smaller celebrations can still be discussed based on date and vendor availability.',
  },
  {
    question: 'Can you help with decor and theme planning?',
    answer: 'Yes. We help with theme direction, color palettes, stage styling, entry concepts, table settings, lighting ideas, and vendor coordination.',
  },
  {
    question: 'Do you provide customized event packages?',
    answer: 'Yes. Event plans can be customized based on guest count, venue, budget range, event type, decor expectations, and required services.',
  },
  {
    question: 'How can I send my event inquiry?',
    answer: 'You can use the contact form on the website or email KM Events with your event date, location, guest count, and basic requirements.',
  },
]

export default function Faq() {
  const { contact } = siteContent

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl min-w-0">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Find quick answers about KM Events services, planning timelines, customization, and contact details."
        />

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-amber-300/40 hover:bg-white/[0.07] sm:p-6">
              <h2 className="break-words text-xl font-semibold text-white">{faq.question}</h2>
              <p className="mt-3 break-words leading-7 text-zinc-400">{faq.answer}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 min-w-0 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-zinc-300 sm:p-6">
          <h2 className="break-words text-xl font-semibold text-white">Still have a question?</h2>
          <p className="mt-3 break-words leading-7">
            Email us at <span className="break-all font-semibold text-amber-200">{contact.email}</span> or visit the Contact page to share your event details.
          </p>
        </div>
      </div>
    </section>
  )
}
