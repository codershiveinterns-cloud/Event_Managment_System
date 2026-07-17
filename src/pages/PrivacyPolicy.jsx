import SectionHeader from '../components/SectionHeader.jsx'
import { siteContent } from '../data/siteContent.js'

const sections = [
  {
    title: 'Information We Collect',
    content: 'When you submit an inquiry, we may collect your name, email address, event type, event date, guest count, venue details, budget range, and any message you choose to share.',
  },
  {
    title: 'How We Use Your Information',
    content: 'We use inquiry details to understand your event needs, prepare planning suggestions, coordinate services, respond to questions, and improve the experience we provide.',
  },
  {
    title: 'Sharing of Information',
    content: 'We do not sell your personal information. We may share event-relevant details with trusted vendors, venues, or service partners only when needed to plan or coordinate your requested celebration.',
  },
  {
    title: 'Data Security',
    content: 'We take reasonable steps to keep submitted information safe and accessible only to people involved in responding to or planning your event inquiry.',
  },
  {
    title: 'Cookies and Basic Analytics',
    content: 'The website may use basic browser storage, server logs, or analytics tools to understand website performance and improve visitor experience.',
  },
  {
    title: 'Your Choices',
    content: 'You can contact us to request updates, corrections, or deletion of inquiry information that you previously shared with KM Events.',
  },
]

export default function PrivacyPolicy() {
  const { contact } = siteContent

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl min-w-0">
        <SectionHeader
          eyebrow="Privacy Policy"
          title="How KM Events handles your information"
          description="This policy explains how we collect, use, and protect information shared through our website and event inquiry forms."
        />

        <div className="mt-10 min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
          {sections.map((section) => (
            <article key={section.title} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
              <h2 className="break-words text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 break-words leading-7 text-zinc-400">{section.content}</p>
            </article>
          ))}

          <article className="min-w-0 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
            <h2 className="break-words text-xl font-semibold text-white">Contact for Privacy Questions</h2>
            <p className="mt-3 break-words leading-7 text-zinc-300">
              For privacy-related questions, email us at <span className="break-all font-semibold text-amber-200">{contact.email}</span>.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
