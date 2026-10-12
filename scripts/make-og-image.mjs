/**
 * Renders the built-in share image (public/og-default.png, 1200x630) used in
 * link previews until an image is uploaded in Site Settings > SEO.
 *
 *   node scripts/make-og-image.mjs
 */
import { chromium } from 'playwright'

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0b0f1a; color: #f5f7fa;
         font-family: 'Segoe UI', Inter, system-ui, sans-serif; position: relative; }
  .glow { position: absolute; border-radius: 9999px; filter: blur(70px); }
  .g1 { width: 620px; height: 620px; left: -160px; top: -220px; background: rgba(34,211,238,.28); }
  .g2 { width: 560px; height: 560px; right: -140px; bottom: -220px; background: rgba(139,92,246,.34); }
  .grid { position: absolute; inset: 0; opacity: .5;
          background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, black 20%, transparent 75%); }
  .wrap { position: absolute; inset: 0; padding: 88px 96px; display: flex; flex-direction: column; justify-content: space-between; }
  .pill { display: inline-flex; align-items: center; gap: 12px; padding: 10px 18px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,.14); background: rgba(17,24,39,.7); font-size: 18px; letter-spacing: .22em;
          text-transform: uppercase; color: #9ca3af; font-weight: 600; width: max-content; }
  .pill i { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(90deg,#22d3ee,#8b5cf6); }
  h1 { font-size: 84px; line-height: 1.02; font-weight: 800; letter-spacing: -0.03em; margin-top: 36px; }
  h1 span { background: linear-gradient(90deg,#22d3ee,#8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent; }
  p { font-size: 28px; color: #c7cbd4; max-width: 820px; margin-top: 26px; line-height: 1.4; }
  .foot { display: flex; align-items: center; justify-content: space-between; font-size: 22px; color: #9ca3af; }
  .brand { font-weight: 800; letter-spacing: .18em; color: #f5f7fa; font-size: 26px; }
  .brand span { background: linear-gradient(90deg,#22d3ee,#8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent; }
</style></head><body>
  <div class="glow g1"></div><div class="glow g2"></div><div class="grid"></div>
  <div class="wrap">
    <div>
      <div class="pill"><i></i>AI • Web • Automation • Future Technology</div>
      <h1>Your Ideas. Our Technology.<br><span>Built for What's Next.</span></h1>
      <p>Modern websites, AI assistants and automation for growing businesses. Projects start from ₹5,000.</p>
    </div>
    <div class="foot"><div class="brand">KAPOSA <span>FUTEXI</span></div><div>kaposafutexi.com</div></div>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'load' })
await page.screenshot({ path: 'public/og-default.png', type: 'png' })
await browser.close()
console.log('wrote public/og-default.png')
