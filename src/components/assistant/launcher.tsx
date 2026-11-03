'use client'

import { MessageSquareText } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

export type AssistantLauncherProps = {
  name: string
  welcome: string
  chips: string[]
  whatsappHref: string
}

/**
 * The "Ask us" bubble, bottom right on every main-site page (docs/architecture.md, section 4.8).
 * Only this small button ships with the page; the chat panel loads on the first click.
 */
const AssistantPanel = dynamic(() => import('./panel').then((m) => m.AssistantPanel), {
  ssr: false,
  loading: () => (
    <div
      className="fixed right-4 bottom-4 z-50 h-12 w-32 animate-pulse rounded-full bg-surface-strong"
      aria-hidden
    />
  ),
})

export function AssistantLauncher(props: AssistantLauncherProps) {
  const [open, setOpen] = useState(false)

  if (open) return <AssistantPanel {...props} onClose={() => setOpen(false)} />

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-label={`Open chat: ask ${props.name}`}
      data-track="assistant_open"
      className="btn-shine fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex h-12 items-center gap-2 rounded-full bg-foreground pr-5 pl-4 text-sm font-semibold text-background shadow-lg shadow-foreground/25 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
    >
      <MessageSquareText className="h-5 w-5" aria-hidden />
      Ask us
    </button>
  )
}
