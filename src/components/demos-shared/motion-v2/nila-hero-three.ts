import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'

/**
 * Atelier Nila hero scene: a small room drawn like an architect's model. A
 * wire cube with a white floor and two walls, a sofa, a coffee table, a floor
 * lamp, a plant and three pendant lights, turning slowly behind the headline.
 * Mounted lazily on desktop by HeroScene.
 */

const mat = (color: number, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
  new MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.02, ...extra })

const INK = 0x141414
const OAK = 0xb4825a
const WHITE = 0xffffff
const FLOOR = 0xefede8
const FABRIC = 0xdddad4
const CHARCOAL = 0x2b2b2b
const LEAF = 0x5f8f5a

function room() {
  const g = new Group()
  const W = 4
  const H = 2.6
  const D = 4
  const floor = new Mesh(new PlaneGeometry(W, D), mat(FLOOR, { roughness: 0.9 }))
  floor.rotation.x = -Math.PI / 2
  const back = new Mesh(new PlaneGeometry(W, H), mat(WHITE, { roughness: 0.95 }))
  back.position.set(0, H / 2, -D / 2)
  const left = new Mesh(new PlaneGeometry(D, H), mat(WHITE, { roughness: 0.95 }))
  left.rotation.y = Math.PI / 2
  left.position.set(-W / 2, H / 2, 0)
  const wire = new LineSegments(
    new EdgesGeometry(new BoxGeometry(W, H, D)),
    new LineBasicMaterial({ color: INK }),
  )
  wire.position.y = H / 2
  g.add(floor, back, left, wire)

  const rug = new Mesh(new PlaneGeometry(2.2, 1.5), mat(OAK, { roughness: 0.9 }))
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0.1, 0.005, 0.4)
  g.add(rug)

  const sofa = new Group()
  const seat = new Mesh(new BoxGeometry(1.9, 0.42, 0.8), mat(FABRIC))
  seat.position.y = 0.3
  const backrest = new Mesh(new BoxGeometry(1.9, 0.5, 0.22), mat(FABRIC))
  backrest.position.set(0, 0.76, -0.29)
  const armL = new Mesh(new BoxGeometry(0.18, 0.62, 0.8), mat(FABRIC))
  armL.position.set(-0.86, 0.4, 0)
  const armR = armL.clone()
  armR.position.x = 0.86
  const cushion = new Mesh(new BoxGeometry(0.5, 0.14, 0.4), mat(OAK, { roughness: 0.8 }))
  cushion.position.set(-0.45, 0.58, 0.05)
  sofa.add(seat, backrest, armL, armR, cushion)
  sofa.position.set(0.1, 0, -1.15)
  g.add(sofa)

  const table = new Group()
  const top = new Mesh(new CylinderGeometry(0.5, 0.5, 0.05, 32), mat(OAK, { roughness: 0.5 }))
  top.position.y = 0.42
  table.add(top)
  for (let i = 0; i < 3; i++) {
    const leg = new Mesh(new CylinderGeometry(0.025, 0.025, 0.42, 8), mat(INK))
    const a = (i / 3) * Math.PI * 2
    leg.position.set(Math.cos(a) * 0.32, 0.21, Math.sin(a) * 0.32)
    table.add(leg)
  }
  table.position.set(0.2, 0, 0.45)
  g.add(table)

  const lamp = new Group()
  const pole = new Mesh(new CylinderGeometry(0.02, 0.02, 1.6, 8), mat(INK))
  pole.position.y = 0.8
  const shade = new Mesh(new ConeGeometry(0.28, 0.4, 24, 1, true), mat(CHARCOAL, { side: 2 }))
  shade.position.y = 1.7
  const foot = new Mesh(new CylinderGeometry(0.16, 0.16, 0.03, 24), mat(INK))
  lamp.add(pole, shade, foot)
  lamp.position.set(1.5, 0, -1.3)
  g.add(lamp)

  const plant = new Group()
  const pot = new Mesh(new CylinderGeometry(0.16, 0.12, 0.3, 16), mat(WHITE))
  pot.position.y = 0.15
  const leaves = new Mesh(new ConeGeometry(0.3, 0.7, 10), mat(LEAF, { roughness: 0.6 }))
  leaves.position.y = 0.65
  plant.add(pot, leaves)
  plant.position.set(-1.5, 0, 1.3)
  g.add(plant)

  ;[-0.45, 0, 0.45].forEach((x, i) => {
    const cord = new Mesh(new CylinderGeometry(0.008, 0.008, 0.9 - i * 0.15, 6), mat(INK))
    cord.position.set(x + 0.2, H - (0.9 - i * 0.15) / 2, 0.45)
    const bulb = new Mesh(
      new SphereGeometry(0.11, 20, 14),
      mat(WHITE, { emissive: 0xfff2d6, emissiveIntensity: 0.9 }),
    )
    bulb.position.set(x + 0.2, H - (0.9 - i * 0.15), 0.45)
    g.add(cord, bulb)
  })
  return g
}

export function mountScene(canvas: HTMLCanvasElement, onReady?: () => void): () => void {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const scene = new Scene()
  const camera = new PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.set(0, 0, 10)
  const key = new DirectionalLight(0xffffff, 1.6)
  key.position.set(3, 6, 5)
  scene.add(key, new HemisphereLight(0xffffff, 0xd9d4cc, 1.2))

  const model = room()
  model.scale.setScalar(0.5)
  model.position.set(-5.9, -3.3, -2.2)
  model.rotation.set(0.42, -0.65, 0)
  scene.add(model)

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
    model.rotation.y += (-0.65 + Math.sin(t * 0.25) * 0.25 + target.x * 0.25 - model.rotation.y) * 0.04
    model.rotation.x += (0.42 + target.y * 0.08 - model.rotation.x) * 0.04
    model.position.y = -3.3 + Math.sin(t * 0.6) * 0.06 - scrollY * 0.002
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
    model.traverse((obj: Object3D) => {
      if (obj instanceof Mesh || obj instanceof LineSegments) {
        obj.geometry.dispose()
        ;(obj.material as MeshStandardMaterial | LineBasicMaterial).dispose()
      }
    })
    renderer.dispose()
  }
}
