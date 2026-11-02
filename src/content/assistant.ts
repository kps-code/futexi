/**
 * Defaults for the Ask-us assistant on the main site (Admin > AI > Site Assistant).
 * Everything here can be changed in the admin; these values apply until the global is saved.
 */
export const assistantDefaults = {
  enabled: true,
  name: 'KAPOSA Assistant',
  welcome: 'Hi! Ask us anything about websites, demos or pricing. Tanglish-um ok.',
  chips: ['What do you build?', 'How much does a website cost?', 'How long does it take?'],
  extraNotes: '',
  dailyCap: 300,
  perChatMax: 20,
} as const

export type AssistantDefaults = typeof assistantDefaults
