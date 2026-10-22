/**
 * Builds the self-hosted italic accent font: Instrument Serif Italic (SIL OFL 1.1),
 * subset to the Latin characters the site can show. The full Google Fonts file is
 * 16 KB; the subset keeps the home page inside the 90 KB font budget.
 *
 *   node scripts/subset-serif-font.mjs <path-to-InstrumentSerif-Italic.(ttf|woff2)>
 *
 * Source file: https://fonts.google.com/specimen/Instrument+Serif (download family),
 * or the file Next.js cached under .next/static/media after a build with the Google font.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import subsetFont from 'subset-font'

const src = process.argv[2]
if (!src) {
  console.error('usage: node scripts/subset-serif-font.mjs <InstrumentSerif-Italic file>')
  process.exit(1)
}

// Printable ASCII plus the typographic punctuation and the rupee sign the admin may type.
// Accented letters fall back to the system serif for that glyph only; the admin texts are English.
const ranges = [[0x20, 0x7e]]
let text = ''
for (const [a, b] of ranges) for (let c = a; c <= b; c++) text += String.fromCodePoint(c)
text += '‘’“”–—…₹• '

const input = await readFile(src)
const out = await subsetFont(input, text, { targetFormat: 'woff2' })
const dest = path.resolve('src/app/(site)/fonts/instrument-serif-italic.woff2')
await mkdir(path.dirname(dest), { recursive: true })
await writeFile(dest, out)
console.log(`wrote ${dest} (${out.length} bytes, from ${input.length})`)
