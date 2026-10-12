import type { GlobalConfig } from 'payload'
import { finalCta, howWeWork, technology, whyUs } from '@/content/home'
import { iconNames } from '@/content/icon-names'
import { hero } from '@/content/site'
import { anyone, isLoggedIn } from '../access'
import { revalidateHomePage } from '../hooks/revalidate'

/** Marketing lines on the home page that change with campaigns. Links stay in code. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Content',
    description:
      'Home page texts: hero, closing call to action, technology list, "Why Build With Us?" cards and "How We Work" steps. Changes go live within seconds.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
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
              label: 'Headline, gradient part',
              type: 'text',
              required: true,
              maxLength: 60,
              defaultValue: hero.headingLine2,
              admin: { description: 'Shown on its own line in the accent gradient.' },
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
                  label: 'Heading, gradient part',
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
      ],
    },
  ],
}
