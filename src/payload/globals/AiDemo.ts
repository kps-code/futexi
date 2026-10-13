import type { GlobalConfig } from 'payload'
import { aiScript } from '@/content/ai-script'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateAiDemo } from '../hooks/revalidate'

/** The scripted "Ask our AI Assistant" conversation on the home page. No live model. */
export const AiDemo: GlobalConfig = {
  slug: 'ai-demo',
  label: 'AI Assistant Demo',
  admin: {
    group: 'Content',
    hidden: hiddenUnless('aiDemo'),
    description:
      'The sample conversation in the "Ask our AI Assistant" box on the home page. Each row is a chip the visitor can click: the question appears, then the answer is typed out.',
  },
  access: {
    read: anyone,
    update: edit('aiDemo'),
  },
  hooks: { afterChange: [revalidateAiDemo] },
  fields: [
    {
      name: 'conversations',
      type: 'array',
      labels: { singular: 'Conversation', plural: 'Conversations' },
      minRows: 1,
      maxRows: 8,
      defaultValue: aiScript.map((s) => ({ chip: s.chip, question: s.question, answer: s.answer })),
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'chip',
              label: 'Chip label',
              type: 'text',
              required: true,
              maxLength: 24,
              admin: { description: 'The business type button, e.g. Salon.' },
            },
            {
              name: 'question',
              label: 'Visitor question',
              type: 'text',
              required: true,
              maxLength: 120,
            },
          ],
        },
        {
          name: 'answer',
          label: 'Assistant answer',
          type: 'textarea',
          required: true,
          maxLength: 400,
        },
      ],
    },
  ],
}
