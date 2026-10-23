import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

/**
 * Vidya Academy hero scene: study props built from primitives floating at the
 * hero edges like things on a desk: a graduation cap, a stack of books, a
 * pencil, an atom, a light bulb and a ruler, with a few amber dots. Mounted
 * lazily on desktop by HeroScene.
 */

const INDIGO = 0x3730a3
const INDIGO_DARK = 0x312e81
const AMBER = 0xf59e0b
const MINT = 0x34d399
const SKY = 0x60a5fa
const PEACH = 0xfb923c
const PAGES = 0xf8fafc
const WOOD = 0xe7c9a1
const GREY = 0x9ca3af
const GRAPHITE = 0x374151

const mat = (color: number, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
  new MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...extra })

const part = (
  geometry: BoxGeometry | CylinderGeometry | ConeGeometry | SphereGeometry | TorusGeometry,
  m: MeshStandardMaterial,
) => new Mesh(geometry, m)

function books() {
  const g = new Group()
  ;[INDIGO, AMBER, MINT].forEach((color, i) => {
    const cover = part(new BoxGeometry(1.5, 0.24, 1.05), mat(color))
    const pages = part(new BoxGeometry(1.42, 0.18, 1.0), mat(PAGES, { roughness: 0.9 }))
    pages.position.x = 0.05
    const book = new Group()
    book.add(cover, pages)
    book.position.y = i * 0.26
    book.rotation.y = (i - 1) * 0.28
    g.add(book)
  })
  return g
}

function pencil() {
  const g = new Group()
  const body = part(new CylinderGeometry(0.13, 0.13, 2.2, 6), mat(0xfbbf24))
  const wood = part(new ConeGeometry(0.13, 0.38, 6), mat(WOOD, { roughness: 0.9 }))
  wood.position.y = 1.29
  const lead = part(new ConeGeometry(0.05, 0.16, 6), mat(GRAPHITE))
  lead.position.y = 1.56
  const band = part(
    new CylinderGeometry(0.135, 0.135, 0.1, 16),
    mat(GREY, { metalness: 0.5, roughness: 0.3 }),
  )
  band.position.y = -1.14
  const eraser = part(new CylinderGeometry(0.13, 0.13, 0.26, 16), mat(0xf9a8d4))
  eraser.position.y = -1.32
  g.add(body, wood, lead, band, eraser)
  g.rotation.z = -0.65
  return g
}

function gradCap() {
  const g = new Group()
  const board = part(new BoxGeometry(1.7, 0.08, 1.7), mat(INDIGO))
  board.position.y = 0.3
  board.rotation.y = Math.PI / 4
  const cap = part(new CylinderGeometry(0.55, 0.66, 0.42, 24), mat(INDIGO_DARK))
  const button = part(new CylinderGeometry(0.07, 0.07, 0.06, 12), mat(AMBER))
  button.position.y = 0.37
  const cord = part(new CylinderGeometry(0.018, 0.018, 0.8, 8), mat(AMBER))
  cord.position.set(0.72, -0.05, 0.72)
  const tassel = part(new SphereGeometry(0.08, 12, 8), mat(AMBER))
  tassel.position.set(0.72, -0.48, 0.72)
  g.add(board, cap, button, cord, tassel)
  g.rotation.x = 0.18
  return g
}

function atom() {
  const g = new Group()
  g.add(part(new SphereGeometry(0.3, 24, 16), mat(SKY)))
  const ringGeo = new TorusGeometry(0.95, 0.035, 8, 72)
  const ringMat = mat(INDIGO, { metalness: 0.2, roughness: 0.4 })
  ;[0, Math.PI / 3, -Math.PI / 3].forEach((rx, i) => {
    const ring = new Mesh(ringGeo, ringMat)
    ring.rotation.x = rx
    ring.rotation.y = i * 0.6
    const electron = part(new SphereGeometry(0.09, 12, 8), mat(AMBER))
    electron.position.set(0.95, 0, 0)
    ring.add(electron)
    g.add(ring)
  })
  return g
}

function bulb() {
  const g = new Group()
  const glass = part(
    new SphereGeometry(0.62, 32, 24),
    mat(0xfde68a, {
      emissive: AMBER,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.92,
      roughness: 0.3,
    }),
  )
  glass.position.y = 0.3
  const neck = part(new CylinderGeometry(0.3, 0.42, 0.3, 24), mat(0xfde68a, { roughness: 0.4 }))
  neck.position.y = -0.3
  const base = part(new CylinderGeometry(0.3, 0.3, 0.42, 24), mat(GREY, { metalness: 0.6, roughness: 0.35 }))
  base.position.y = -0.66
  const tip = part(new CylinderGeometry(0.14, 0.14, 0.1, 16), mat(GRAPHITE))
  tip.position.y = -0.92
  g.add(glass, neck, base, tip)
  return g
}

function ruler() {
  const g = new Group()
  g.add(part(new BoxGeometry(2.2, 0.08, 0.5), mat(WOOD, { roughness: 0.9 })))
  const tickMat = mat(GRAPHITE)
  for (let i = -5; i <= 5; i++) {
    const tall = i % 5 === 0
    const tick = part(new BoxGeometry(0.03, 0.02, tall ? 0.26 : 0.14), tickMat)
    tick.position.set(i * 0.2, 0.05, 0.12 + (tall ? 0 : 0.06))
    g.add(tick)
  }
  g.rotation.z = 0.12
  return g
}

type Prop = { node: Group; pos: [number, number, number]; swing: number; spin?: boolean }

export function mountScene(canvas: HTMLCanvasElement, onReady?: () => void): () => void {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const key = new DirectionalLight(0xffffff, 2.2)
  key.position.set(3, 5, 6)
  scene.add(key, new HemisphereLight(0xffffff, 0xe0e7ff, 1.1))

  const group = new Group()
  const props: Prop[] = [
    { node: gradCap(), pos: [-8.5, 3.7, -2.8], swing: 0.5 },
    { node: atom(), pos: [7.3, 3.0, -2.5], swing: 0.4, spin: true },
    { node: books(), pos: [-7.8, -3.8, -2], swing: 0.3 },
    { node: bulb(), pos: [7.3, -2.9, -2], swing: 0.35 },
    { node: pencil(), pos: [0.3, 3.5, -3], swing: 0.45 },
    { node: ruler(), pos: [0.2, -3.5, -2], swing: 0.3 },
  ]
  props.forEach((p) => {
    p.node.position.set(...p.pos)
    group.add(p.node)
  })
  scene.add(group)

  const COUNT = 300
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 18
  const dotGeo = new BufferGeometry()
  dotGeo.setAttribute('position', new BufferAttribute(positions, 3))
  const dotMat = new PointsMaterial({ color: PEACH, size: 0.06, transparent: true, opacity: 0.5 })
  const dots = new Points(dotGeo, dotMat)
  scene.add(dots)

  const size = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  size()
  const ro = new ResizeObserver(size)
  ro.observe(canvas)

  const target = { x: 0, y: 0 }
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  let hidden = document.hidden
  const onVisibility = () => {
    hidden = document.hidden
  }
  document.addEventListener('visibilitychange', onVisibility)

  const t0 = performance.now()
  let ready = false
  renderer.setAnimationLoop(() => {
    if (hidden) return
    const t = (performance.now() - t0) / 1000
    const scrollY = window.scrollY
    props.forEach((p, i) => {
      // A gentle swing keeps each object readable; only the atom spins.
      p.node.rotation.y = p.spin ? t * 0.6 : Math.sin(t * p.swing + i) * 0.45 + i * 0.3
      p.node.position.y = p.pos[1] + Math.sin(t * 0.7 + i * 1.3) * 0.3
    })
    group.rotation.y += (target.x * 0.08 - group.rotation.y) * 0.04
    group.rotation.x += (target.y * 0.05 - group.rotation.x) * 0.04
    group.position.y = -scrollY * 0.002
    dots.rotation.y = t * 0.02
    dots.position.y = -scrollY * 0.001
    camera.position.x += (target.x * 0.25 - camera.position.x) * 0.05
    camera.position.y += (-target.y * 0.18 - camera.position.y) * 0.05
    renderer.render(scene, camera)
    if (!ready) {
      ready = true
      onReady?.()
    }
  })

  return () => {
    renderer.setAnimationLoop(null)
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('visibilitychange', onVisibility)
    group.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose()
        ;(obj.material as MeshStandardMaterial).dispose()
      }
    })
    dotGeo.dispose()
    dotMat.dispose()
    renderer.dispose()
  }
}
