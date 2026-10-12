import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isLoggedIn } from '../access'
import { revalidateFaqs, revalidateFaqsOnDelete } from '../hooks/revalidate'

export const faqPlacements = [
  { label: 'Home and Contact', value: 'home' },
  { label: 'Contact only', value: 'contact' },
  { label: 'Hidden', value: 'hidden' },
] as const

export type FaqPlacement = (typeof faqPlacements)[number]['value']

/** Questions and answers for the Contact page and the home page FAQ block. */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'placement', 'order'],
    group: 'Content',
    description:
      'Questions and answers for the website. "Where to show" decides the page: the Contact page lists every question, the home page shows a short list. Changes go live within seconds.',
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateFaqs], afterDelete: [revalidateFaqsOnDelete] },
  fields: [
    { name: 'question', type: 'text', required: true, maxLength: 120 },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: { description: 'Write {price} to insert the starting price text from Site Settings.' },
    },
    {
      name: 'placement',
      label: 'Where to show',
      type: 'radio',
      required: true,
      defaultValue: 'contact',
      options: [...faqPlacements],
      admin: {
        layout: 'horizontal',
        description: 'Hidden keeps the question in the admin but off every page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Lower numbers show first.' },
    },
  ],
}
