import type { GlobalConfig } from 'payload'
import { finalCta, howWeWork, journey, journeyScreens, pricing, technology, whyUs } from '@/content/home'
import { iconNames } from '@/content/icon-names'
import { hero } from '@/content/site'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateHomePage } from '../hooks/revalidate'

/** Marketing lines on the home page that change with campaigns. Links stay in code. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Content',
    hidden: hiddenUnless('homePage'),
    description:
      'Home page texts: hero, the scroll journey after it, closing call to action, technology list, "Why Build With Us?" cards and "How We Work" steps. Changes go live within seconds.',
  },
  access: {
    read: anyone,
    update: edit('homePage'),
  },
  hooks: { afterChange: [revalidateHomePage] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            {
              name: 'headingLine1',
              label: 'Headline, first part',
              type: 'text',
              required: true,
              maxLength: 60,
              defaultValue: hero.headingLine1,
            },
            {
              name: 'headingLine2',
              label: 'Headline, accent line',
              type: 'text',
              required: true,
              maxLength: 60,
              defaultValue: hero.headingLine2,
              admin: { description: 'Shown on its own line in the italic accent style.' },
            },
            {
              name: 'sub',
              label: 'Sub-text',
              type: 'textarea',
              required: true,
              maxLength: 240,
              defaultValue: hero.sub,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryLabel',
                  label: 'Primary button',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: hero.primary.label,
                  admin: { description: 'Opens the Demos page.' },
                },
                {
                  name: 'secondaryLabel',
                  label: 'Secondary button',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: hero.secondary.label,
                  admin: { description: 'Opens the Contact page.' },
                },
              ],
            },
            {
              name: 'trustLine',
              label: 'Trust line',
              type: 'text',
              hasMany: true,
              defaultValue: [...hero.trustLine],
              admin: { description: 'Short labels under the buttons. Press Enter after each.' },
            },
          ],
        },
        {
          label: 'Journey',
          name: 'journey',
          description:
            'The scroll story on the home page. The hero is always chapter 01 ("Your website"); these chapters follow it, each with its own phone screen.',
          fields: [
            {
              name: 'heroLabel',
              label: 'Chapter 01 label',
              type: 'text',
              maxLength: 24,
              defaultValue: journey.heroLabel,
              admin: { description: 'Shown on the side rail for the hero chapter.' },
            },
            {
              name: 'chapters',
              type: 'array',
              labels: { singular: 'Chapter', plural: 'Chapters' },
              minRows: 1,
              maxRows: 5,
              defaultValue: journey.chapters.map((c) => ({ ...c })),
              admin: { initCollapsed: true, description: 'Numbered from 02 in this order.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Rail label', type: 'text', required: true, maxLength: 24 },
                    {
                      name: 'screen',
                      label: 'Phone screen',
                      type: 'select',
                      required: true,
                      defaultValue: 'chat',
                      options: journeyScreens.map((s) => ({ label: s.label, value: s.value })),
                    },
                  ],
                },
                { name: 'eyebrow', label: 'Small line above the heading', type: 'text', maxLength: 40 },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headingLine1',
                      label: 'Heading, first line',
                      type: 'text',
                      required: true,
                      maxLength: 32,
                    },
                    { name: 'headingLine2', label: 'Heading, second line', type: 'text', maxLength: 32 },
                  ],
                },
                { name: 'line', label: 'Text', type: 'textarea', required: true, maxLength: 180 },
                {
                  name: 'tagline',
                  label: 'Tagline (italic, right side)',
                  type: 'text',
                  maxLength: 40,
                },
              ],
            },
          ],
        },
        {
          label: 'Final call to action',
          name: 'finalCta',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heading',
                  label: 'Heading',
                  type: 'text',
                  required: true,
                  maxLength: 60,
                  defaultValue: finalCta.heading,
                },
                {
                  name: 'headingAccent',
                  label: 'Heading, accent line',
                  type: 'text',
                  maxLength: 60,
                  defaultValue: finalCta.headingAccent,
                },
              ],
            },
            {
              name: 'sub',
              label: 'Sub-text',
              type: 'textarea',
              required: true,
              maxLength: 200,
              defaultValue: finalCta.sub,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryLabel',
                  label: 'Primary button',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: finalCta.primary.label,
                },
                {
                  name: 'whatsappLabel',
                  label: 'WhatsApp button',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: finalCta.whatsapp,
                },
              ],
            },
          ],
        },
        {
          label: 'Technology',
          name: 'technology',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              maxLength: 80,
              defaultValue: technology.heading,
            },
            {
              name: 'line',
              label: 'Sub-text',
              type: 'textarea',
              maxLength: 200,
              defaultValue: technology.line,
            },
            {
              name: 'items',
              label: 'Technologies',
              type: 'text',
              hasMany: true,
              defaultValue: [...technology.items],
              admin: { description: 'Shown as pills. Press Enter after each.' },
            },
          ],
        },
        {
          label: 'Why us',
          name: 'whyUs',
          fields: [
            { name: 'heading', type: 'text', required: true, maxLength: 80, defaultValue: whyUs.heading },
            {
              name: 'cards',
              type: 'array',
              labels: { singular: 'Card', plural: 'Cards' },
              minRows: 1,
              maxRows: 9,
              defaultValue: whyUs.cards.map((c) => ({ title: c.title, line: c.line })),
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true, maxLength: 60 },
                { name: 'line', type: 'text', required: true, maxLength: 140 },
              ],
            },
          ],
        },
        {
          label: 'How we work',
          name: 'howWeWork',
          fields: [
            { name: 'heading', type: 'text', required: true, maxLength: 80, defaultValue: howWeWork.heading },
            {
              name: 'steps',
              type: 'array',
              labels: { singular: 'Step', plural: 'Steps' },
              minRows: 1,
              maxRows: 9,
              defaultValue: howWeWork.steps.map((s) => ({ title: s.title, line: s.line, icon: s.icon })),
              admin: { initCollapsed: true, description: 'Numbered automatically in this order.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, maxLength: 40 },
                    {
                      name: 'icon',
                      type: 'select',
                      required: true,
                      defaultValue: 'check',
                      options: iconNames.map((n) => ({ label: n, value: n })),
                    },
                  ],
                },
                { name: 'line', type: 'text', required: true, maxLength: 140 },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          name: 'pricing',
          description:
            'The home pricing section. {price} in the line is replaced with the starting price text from Site Settings > Texts.',
          fields: [
            { name: 'heading', type: 'text', required: true, maxLength: 60, defaultValue: pricing.heading },
            {
              name: 'line',
              label: 'Line under the heading',
              type: 'textarea',
              required: true,
              maxLength: 240,
              defaultValue: pricing.line,
              admin: { description: 'Keep {price} where the starting price should appear.' },
            },
            {
              name: 'note',
              label: 'How quotes work card',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'tag',
                      label: 'Small label',
                      type: 'text',
                      required: true,
                      maxLength: 30,
                      defaultValue: pricing.note.tag,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      maxLength: 60,
                      defaultValue: pricing.note.title,
                    },
                  ],
                },
                {
                  name: 'body',
                  type: 'textarea',
                  required: true,
                  maxLength: 300,
                  defaultValue: pricing.note.body,
                },
              ],
            },
            {
              name: 'setups',
              label: 'Typical setups',
              type: 'array',
              labels: { singular: 'Setup', plural: 'Setups' },
              minRows: 1,
              maxRows: 4,
              defaultValue: pricing.setups.map((s) => ({
                tag: s.tag,
                title: s.title,
                bestFor: s.bestFor,
                items: [...s.items],
              })),
              admin: {
                initCollapsed: true,
                description:
                  'Cards next to the quote card, in this order. No amounts: the quote comes on WhatsApp. Leave the list empty to show the three built-in setups.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'tag', label: 'Small label', type: 'text', required: true, maxLength: 30 },
                    { name: 'title', type: 'text', required: true, maxLength: 40 },
                  ],
                },
                { name: 'bestFor', label: 'Best for', type: 'text', maxLength: 60 },
                {
                  name: 'items',
                  label: 'What is included',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Press Enter after each item. Three reads best.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsappLabel',
                  label: 'WhatsApp button',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: pricing.cta.label,
                },
                {
                  name: 'secondaryLabel',
                  label: 'Second button (opens Contact)',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                  defaultValue: pricing.secondary.label,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
