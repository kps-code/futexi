import Image from 'next/image'
import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Team avatar. Shows the uploaded photo when there is one; otherwise an
 * illustrated placeholder: a friendly cartoon portrait behind glass, varied
 * per person so the three cards do not look identical.
 */

function hash(s: string): number {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

const skins = ['#d9a066', '#c68642', '#b5773f']
const shirts = ['#111c33', '#1a2338', '#15203a']
const hues = [
  ['#22d3ee', '#8b5cf6'],
  ['#38bdf8', '#6366f1'],
  ['#2dd4bf', '#a855f7'],
]

export function Avatar({
  name,
  photoUrl,
  photoAlt,
  size = 64,
  className,
}: {
  name: string
  photoUrl?: string
  photoAlt?: string
  size?: number
  className?: string
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={photoAlt ?? name}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    )
  }

  const v = hash(name) % 3
  const skin = skins[v]
  const shirt = shirts[v]
  const [from, to] = hues[v]
  const hair = '#1b1614'

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      role="img"
      aria-label={`${name}, illustrated avatar`}
      className={cn('shrink-0 rounded-full', className)}
    >
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`shine${id}`} cx="0.3" cy="0.22" r="0.65">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <circle cx="64" cy="64" r="64" />
        </clipPath>
      </defs>

      <circle cx="64" cy="64" r="64" fill={`url(#bg${id})`} />

      <g clipPath={`url(#clip${id})`}>
        {/* shoulders and collar */}
        <path d="M10 130 C12 98 36 86 64 86 C92 86 116 98 118 130 Z" fill={shirt} />
        <path d="M50 88 L64 104 L78 88 L72 86 L64 93 L56 86 Z" fill="#e5e7eb" opacity="0.9" />
        {/* neck */}
        <rect x="54" y="64" width="20" height="26" rx="8" fill={skin} />
        <rect x="54" y="64" width="20" height="10" fill="#000" opacity="0.12" />
        {/* ears */}
        <ellipse cx="41" cy="54" rx="4.5" ry="6" fill={skin} />
        <ellipse cx="87" cy="54" rx="4.5" ry="6" fill={skin} />
        {/* head */}
        <path d="M42 50 C42 30 86 30 86 50 L86 58 C86 72 76 80 64 80 C52 80 42 72 42 58 Z" fill={skin} />
        {/* hair, three styles */}
        {v === 0 && (
          <path d="M41 50 C41 28 87 24 87 50 C84 42 76 37 64 37 C52 37 44 42 41 50 Z" fill={hair} />
        )}
        {v === 1 && (
          <path
            d="M41 52 C40 28 88 22 87 50 C86 44 80 40 70 39 C66 46 56 46 48 42 C45 44 42 47 41 52 Z"
            fill={hair}
          />
        )}
        {v === 2 && (
          <path d="M41 52 C39 26 89 22 87 52 C85 40 74 33 64 33 C54 33 43 40 41 52 Z" fill={hair} />
        )}
        {/* eyebrows */}
        <path d="M50 48 q6 -3 12 0" stroke={hair} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M66 48 q6 -3 12 0" stroke={hair} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="56" cy="55" r="2.4" fill="#1b1614" />
        <circle cx="72" cy="55" r="2.4" fill="#1b1614" />
        <circle cx="56.8" cy="54.2" r="0.7" fill="#fff" />
        <circle cx="72.8" cy="54.2" r="0.7" fill="#fff" />
        {/* glasses on the second style */}
        {v === 1 && (
          <g stroke="#1b1614" strokeWidth="1.8" fill="none" opacity="0.85">
            <rect x="48" y="50" width="15" height="10" rx="4" />
            <rect x="65" y="50" width="15" height="10" rx="4" />
            <path d="M63 55 L65 55" />
          </g>
        )}
        {/* nose and smile */}
        <path
          d="M64 57 q-2 5 1 7"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M57 68 q7 5 14 0" stroke="#7a3b2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* glass finish */}
        <rect x="0" y="0" width="128" height="128" fill={`url(#glass${id})`} />
        <ellipse cx="40" cy="30" rx="30" ry="16" fill={`url(#shine${id})`} transform="rotate(-25 40 30)" />
      </g>
      <circle cx="64" cy="64" r="63" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  )
}
