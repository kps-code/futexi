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
import type { IconName } from '@/content/icon-names'

export type { IconName } from '@/content/icon-names'

/** Maps the string icon names used in content and admin to lucide components. */
export const icons: Record<IconName, ComponentType<LucideProps>> = {
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
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Comp = icons[name]
  return <Comp className={className} aria-hidden />
}
