/**
 * Renders the showroom phone screens to static WebP files, one per screen kind, so the
 * flat phone (phones, tablets, and desktop before the 3D phone loads) shows an image and
 * never draws on a canvas at load time. The desktop 3D phone still draws its textures.
 *
 *   node scripts/render-phone-screens.mjs
 *
 * Re-run after editing src/components/home/showroom/phone-screens.ts or the site fonts.
 * Output: public/home/screens/<kind>.webp (360 × 740, from the 720 × 1480 drawing).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public', 'home', 'screens')
await mkdir(out, { recursive: true })

// Transpile the drawing module to plain ESM for the browser (it has no runtime imports).
const source = await readFile(path.join(root, 'src/components/home/showroom/phone-screens.ts'), 'utf8')
const js = ts.transpileModule(source.replace(/^import type .*$/m, ''), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText

const serif = await readFile(path.join(root, 'src/app/(site)/fonts/instrument-serif-italic.woff2'))
const kinds = ['site', 'salon', 'chat', 'whatsapp', 'booking', 'stats', 'start']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 800, height: 1600 }, deviceScaleFactor: 1 })
await page.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>@font-face{font-family:'KF Serif';font-style:italic;src:url(data:font/woff2;base64,${serif.toString('base64')}) format('woff2')}</style>
</head><body><p style="font-family:Inter">warm 123</p><p style="font-family:'KF Serif';font-style:italic">warm</p></body></html>`)
await page.addScriptTag({ type: 'module', content: js + '\nwindow.__draw = drawScreen;' })
await page.evaluate(async () => {
  await Promise.all([
    document.fonts.load('400 20px Inter'),
    document.fonts.load('600 20px Inter'),
    document.fonts.load('700 20px Inter'),
    document.fonts.load("italic 20px 'KF Serif'"),
  ])
  await document.fonts.ready
})

for (const kind of kinds) {
  const dataUrl = await page.evaluate((kind) => {
    const full = window.__draw(kind, { sans: 'Inter', serif: "'KF Serif'" })
    const small = document.createElement('canvas')
    small.width = 360
    small.height = 740
    const g = small.getContext('2d')
    g.imageSmoothingQuality = 'high'
    g.drawImage(full, 0, 0, 360, 740)
    return small.toDataURL('image/webp', 0.86)
  }, kind)
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64')
  await writeFile(path.join(out, `${kind}.webp`), buf)
  console.log(`${kind}.webp ${buf.length} bytes`)
}
await browser.close()
