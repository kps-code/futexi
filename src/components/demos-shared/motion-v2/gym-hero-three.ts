import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
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
 * Pulse Fitness hero scene: gym iron built from primitives. A chrome and
 * rubber dumbbell rolls slowly behind the headline, a bumper plate leans at
 * the lower left and a kettlebell swings at the lower right, all in a cloud
 * of green particles that drift with the scroll. Mounted lazily on desktop
 * by HeroScene; returns a dispose function.
 */

const RUBBER = 0x1f2937
const CHROME = 0xdfe6f5
const GREEN = 0xa3e635

const rubber = () => new MeshStandardMaterial({ color: RUBBER, roughness: 0.65, metalness: 0.15 })
const chrome = () => new MeshStandardMaterial({ color: CHROME, metalness: 0.95, roughness: 0.18 })
const green = () =>
  new MeshStandardMaterial({ color: GREEN, emissive: GREEN, emissiveIntensity: 0.35, roughness: 0.5 })

/** Lies along the group's x axis so rotation.x rolls it around its own handle. */
function dumbbell() {
  const g = new Group()
  const alongX = (m: Mesh) => {
    m.rotation.z = Math.PI / 2
    return m
  }
  g.add(alongX(new Mesh(new CylinderGeometry(0.14, 0.14, 2.7, 24), chrome())))
  const plates: Array<[number, number]> = [
    [0.78, 0.24],
    [0.64, 0.22],
    [0.5, 0.2],
  ]
  ;[-1, 1].forEach((side) => {
    const collar = alongX(new Mesh(new CylinderGeometry(0.21, 0.21, 0.12, 24), chrome()))
    collar.position.x = side * 0.82
    g.add(collar)
    let x = 0.9
    plates.forEach(([r, w], i) => {
      const plate = alongX(new Mesh(new CylinderGeometry(r, r, w, 48), rubber()))
      plate.position.x = side * (x + w / 2)
      g.add(plate)
      if (i === 0) {
        const ring = new Mesh(new TorusGeometry(r - 0.08, 0.025, 10, 64), green())
        ring.rotation.y = Math.PI / 2
        ring.position.x = side * (x - 0.01)
        g.add(ring)
      }
      x += w + 0.03
    })
    const cap = alongX(new Mesh(new CylinderGeometry(0.16, 0.16, 0.08, 24), chrome()))
    cap.position.x = side * (x + 0.04)
    g.add(cap)
  })
  return g
}

function kettlebell() {
  const g = new Group()
  const body = new Mesh(new SphereGeometry(0.72, 32, 24), rubber())
  body.scale.y = 0.94
  const base = new Mesh(new CylinderGeometry(0.42, 0.46, 0.12, 32), rubber())
  base.position.y = -0.66
  const band = new Mesh(new TorusGeometry(0.72, 0.03, 10, 64), green())
  band.rotation.x = Math.PI / 2
  band.position.y = 0.05
  const handle = new Mesh(new TorusGeometry(0.5, 0.1, 16, 48), chrome())
  handle.position.y = 0.8
  handle.scale.y = 0.8
  g.add(body, base, band, handle)
  return g
}

function plate() {
  const g = new Group()
  const disc = new Mesh(new TorusGeometry(1.0, 0.44, 24, 72), rubber())
  disc.scale.z = 0.4
  const rim = new Mesh(new TorusGeometry(1.0, 0.05, 12, 72), green())
  rim.position.z = 0.18
  const hub = new Mesh(new TorusGeometry(0.58, 0.05, 12, 48), chrome())
  g.add(disc, rim, hub)
  g.rotation.y = 0.55
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
  const camera = new PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const key = new DirectionalLight(0xffffff, 2.4)
  key.position.set(4, 5, 6)
  const rim = new DirectionalLight(GREEN, 3)
  rim.position.set(-5, -2, -4)
  const fill = new DirectionalLight(0xbfdbfe, 0.8)
  fill.position.set(-3, 3, 5)
  scene.add(key, rim, fill, new AmbientLight(0x38bdf8, 0.35))

  const iron = new Group()
  const bell = dumbbell()
  bell.position.set(1.7, 2.1, -1.6)
  const bumper = plate()
  bumper.position.set(-6.3, -0.6, -3.2)
  const kb = kettlebell()
  kb.position.set(5.7, -2.6, -2.2)
  iron.add(bell, bumper, kb)
  scene.add(iron)

  const COUNT = 900
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 18
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new BufferAttribute(positions, 3))
  const dustMat = new PointsMaterial({ color: GREEN, size: 0.05, transparent: true, opacity: 0.8 })
  const dust = new Points(dustGeo, dustMat)
  scene.add(dust)

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
    // The dumbbell rolls around its handle and tilts a little with the cursor.
    bell.rotation.x = t * 0.35
    bell.rotation.z += (-0.38 + target.y * 0.12 - bell.rotation.z) * 0.04
    bell.rotation.y += (target.x * 0.35 - bell.rotation.y) * 0.04
    bell.position.y = 2.1 + Math.sin(t * 0.8) * 0.25 - scrollY * 0.0025
    bumper.rotation.z = t * 0.3
    bumper.position.y = -0.6 + Math.sin(t * 0.6 + 1) * 0.2 - scrollY * 0.002
    kb.rotation.z = Math.sin(t * 1.1) * 0.1
    kb.rotation.y = Math.sin(t * 0.4) * 0.5
    kb.position.y = -2.6 + Math.sin(t * 0.7 + 2) * 0.2 - scrollY * 0.002
    dust.rotation.y = t * 0.03
    dust.position.y = -scrollY * 0.001
    camera.position.x += (target.x * 0.4 - camera.position.x) * 0.05
    camera.position.y += (-target.y * 0.3 - camera.position.y) * 0.05
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
    iron.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose()
        ;(obj.material as MeshStandardMaterial).dispose()
      }
    })
    dustGeo.dispose()
    dustMat.dispose()
    renderer.dispose()
  }
}
