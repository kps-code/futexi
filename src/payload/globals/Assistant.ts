import type { GlobalConfig } from 'payload'
import { assistantDefaults } from '@/content/assistant'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateAssistant } from '../hooks/revalidate'

/**
 * The "Ask us" chat on the main website (docs/architecture.md, section 4.8). Prices, timelines
 * and team names are not repeated here: the assistant reads them from Site Settings, FAQ and
 * Team Members, so there is one place to change each fact.
 */
export const Assistant: GlobalConfig = {
  slug: 'assistant',
  label: 'Site Assistant',
  admin: {
    group: 'AI',
    hidden: hiddenUnless('assistant'),
    description:
      'The "Ask us" chat bubble on the main website. It answers from the site content, Site Settings, FAQ, Team Members and the notes below. It is never shown inside the demos.',
  },
  access: {
    read: anyone,
    update: edit('assistant'),
  },
  hooks: { afterChange: [revalidateAssistant] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Show the chat on the website',
              defaultValue: assistantDefaults.enabled,
              admin: {
                description:
                  'Off hides the bubble everywhere. The chat also stays off while the AI key is missing on the server.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  label: 'Assistant name',
                  type: 'text',
                  maxLength: 40,
                  defaultValue: assistantDefaults.name,
                  admin: { description: 'Shown in the chat header and used when it introduces itself.' },
                },
              ],
            },
            {
              name: 'welcome',
              label: 'Welcome message',
              type: 'textarea',
              maxLength: 200,
              defaultValue: assistantDefaults.welcome,
              admin: { description: 'The first line visitors see when they open the chat.' },
            },
            {
              name: 'chips',
              label: 'Suggested questions',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              maxRows: 3,
              defaultValue: assistantDefaults.chips.map((label) => ({ label })),
              admin: { description: 'Up to three one-tap questions under the welcome message.' },
              fields: [{ name: 'label', type: 'text', required: true, maxLength: 60 }],
            },
          ],
        },
        {
          label: 'Knowledge',
          description:
            'What the assistant knows. Facts live where the website already shows them; the notes here are extra instructions it follows first.',
          fields: [
            {
              name: 'sources',
              type: 'ui',
              admin: { components: { Field: '/payload/admin/fields/AssistantSources#AssistantSources' } },
            },
            {
              name: 'extraNotes',
              label: 'Notes from the team',
              type: 'textarea',
              maxLength: 2000,
              defaultValue: assistantDefaults.extraNotes,
              admin: {
                description:
                  'Plain sentences the assistant must follow. Offers, things to say or avoid, answers for questions the site does not cover. Example: "Diwali offer: 10% off until 5 Nov." or "If asked about Shopify, say we can discuss it on WhatsApp." These override everything else.',
              },
            },
            {
              name: 'knowledgePreview',
              type: 'ui',
              admin: { components: { Field: '/payload/admin/fields/KnowledgePreview#KnowledgePreview' } },
            },
          ],
        },
        {
          label: 'Limits',
          description:
            'Keeps the chat inside the free tiers. Over a limit, visitors get a scripted answer and the WhatsApp link.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dailyCap',
                  label: 'Messages per day (whole site)',
                  type: 'number',
                  min: 0,
                  max: 5000,
                  defaultValue: assistantDefaults.dailyCap,
                  admin: { description: 'Counted in India time. 0 pauses the AI for the day.' },
                },
                {
                  name: 'perChatMax',
                  label: 'Messages per visitor chat',
                  type: 'number',
                  min: 5,
                  max: 100,
                  defaultValue: assistantDefaults.perChatMax,
                  admin: { description: 'After this the visitor is pointed to WhatsApp.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
