import {
  Bot,
  CalendarCheck,
  Check,
  Code,
  Globe,
  Hammer,
  LayoutTemplate,
  Lightbulb,
  Megaphone,
  MessageCircle,
  PenTool,
  Plug,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

/** Maps the string icon names used in content files to lucide components. */
export const icons = {
  bot: Bot,
  calendar: CalendarCheck,
  check: Check,
  code: Code,
  globe: Globe,
  hammer: Hammer,
  layout: LayoutTemplate,
  lightbulb: Lightbulb,
  megaphone: Megaphone,
  message: MessageCircle,
  pen: PenTool,
  plug: Plug,
  rocket: Rocket,
  search: Search,
  smartphone: Smartphone,
  sparkles: Sparkles,
  users: Users,
  workflow: Workflow,
  zap: Zap,
} satisfies Record<string, ComponentType<LucideProps>>

export type IconName = keyof typeof icons

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Comp = icons[name]
  return <Comp className={className} aria-hidden />
}
