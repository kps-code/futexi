/** Icon names available to admin-editable content. Rendered by src/components/home/icons.tsx. */
export const iconNames = [
  'bot',
  'calendar',
  'check',
  'code',
  'globe',
  'hammer',
  'layout',
  'lightbulb',
  'megaphone',
  'message',
  'pen',
  'plug',
  'rocket',
  'search',
  'smartphone',
  'sparkles',
  'users',
  'workflow',
  'zap',
] as const

export type IconName = (typeof iconNames)[number]

export function isIconName(v: unknown): v is IconName {
  return typeof v === 'string' && (iconNames as readonly string[]).includes(v)
}
