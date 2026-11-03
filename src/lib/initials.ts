/** "Sankaralingam K" -> "SK", "Kannan" -> "K", "  " -> "?" */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const letters = parts.length === 1 ? [parts[0][0]] : [parts[0][0], parts[parts.length - 1][0]]
  return letters.join('').toUpperCase()
}

/** "Sankaralingam K" -> "Sankaralingam" */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}
