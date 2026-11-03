import 'server-only'
import { getAboutPage, getFaqs, getHomePage, getSiteSettings, getVisibleDemos } from '@/server/site-data'
import { buildKnowledge, defaultKnowledgeInput, type KnowledgeInput } from './knowledge'

/**
 * Fills the knowledge sheet from the admin-editable globals. Every getter is already cached for an
 * hour and revalidated on save, so a chat message costs no database read in the common case.
 * When Payload is unreachable the sheet falls back to the content files so the assistant keeps
 * answering.
 */
export async function loadKnowledgeInput(
  extra: { assistantName?: string; extraNotes?: string } = {},
): Promise<KnowledgeInput> {
  const fallback = defaultKnowledgeInput()
  try {
    const [settings, faqs, demos, home, about] = await Promise.all([
      getSiteSettings(),
      getFaqs(),
      getVisibleDemos(),
      getHomePage(),
      getAboutPage(),
    ])
    return {
      ...extra,
      settings: {
        phone: settings.phone,
        whatsappNumber: settings.whatsappNumber,
        email: settings.email,
        replyTimeText: settings.replyTimeText,
        startingPriceText: settings.startingPriceText,
        city: settings.city,
        region: settings.region,
        serviceAreaText: settings.serviceAreaText,
        tagline: settings.tagline,
      },
      faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
      demos,
      pricing: home.pricing,
      howWeWork: home.howWeWork.steps,
      whyUs: home.whyUs.cards,
      technology: home.technology.items,
      about: about.intro,
    }
  } catch {
    return { ...fallback, ...extra }
  }
}

export async function getKnowledge(extra?: { assistantName?: string; extraNotes?: string }): Promise<string> {
  return buildKnowledge(await loadKnowledgeInput(extra))
}
