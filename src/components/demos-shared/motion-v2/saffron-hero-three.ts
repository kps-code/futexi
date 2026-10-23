import {
  AdditiveBlending,
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
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

/**
 * Saffron Kitchen hero scene: a plated dish under a copper cloche at the
 * lower right. The cloche lifts once the scene is ready, then hovers; embers
 * rise through the whole frame and drift with the scroll. Mounted lazily on
 * desktop by HeroScene.
 */

const mat = (color: number, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
  new MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...extra })

function plate() {
  const g = new Group()
  const dish = new Mesh(new CylinderGeometry(1.3, 1.1, 0.08, 56), mat(0xf3ece2, { roughness: 0.45 }))
  const rim = new Mesh(
    new TorusGeometry(1.28, 0.035, 12, 72),
    mat(0xd9a441, { metalness: 0.8, roughness: 0.3 }),
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.05
  const mound = new Mesh(new SphereGeometry(0.52, 32, 20), mat(0x6b3a1e, { roughness: 0.85 }))
  mound.scale.set(1, 0.5, 1)
  mound.position.y = 0.12
  g.add(dish, rim, mound)
  ;[
    [0.18, 0.36, 0.1],
    [-0.2, 0.34, 0.14],
    [0.02, 0.4, -0.2],
  ].forEach(([x, y, z]) => {
    const leaf = new Mesh(new SphereGeometry(0.07, 10, 8), mat(0x4ade80, { roughness: 0.5 }))
    leaf.position.set(x, y, z)
    g.add(leaf)
  })
  const chilli = new Mesh(new CylinderGeometry(0.035, 0.02, 0.5, 10), mat(0xb3261e, { roughness: 0.5 }))
  chilli.rotation.z = 1.2
  chilli.position.set(0.3, 0.38, 0.25)
  g.add(chilli)
  return g
}

function cloche() {
  const g = new Group()
  const dome = new Mesh(
    new SphereGeometry(1.2, 56, 28, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0xb87333, { metalness: 0.92, roughness: 0.22 }),
  )
  const knob = new Mesh(new SphereGeometry(0.11, 16, 12), mat(0xd9a441, { metalness: 0.9, roughness: 0.25 }))
  knob.position.y = 1.26
  const lip = new Mesh(
    new TorusGeometry(1.2, 0.04, 12, 72),
    mat(0xb87333, { metalness: 0.92, roughness: 0.22 }),
  )
  lip.rotation.x = Math.PI / 2
  g.add(dome, knob, lip)
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
  const key = new DirectionalLight(0xffd9a0, 2.2)
  key.position.set(3, 6, 5)
  const rim = new DirectionalLight(0xe0892b, 1.4)
  rim.position.set(-5, -1, -3)
  const glow = new PointLight(0xff9a3c, 2.5, 8, 2)
  glow.position.set(3.4, -0.6, 0.6)
  scene.add(key, rim, glow, new AmbientLight(0x2a1a10, 0.9))

  const table = new Group()
  const dish = plate()
  const lid = cloche()
  lid.position.y = 0.05
  table.add(dish, lid)
  table.position.set(3.1, -1.9, -1)
  table.rotation.x = 0.35
  scene.add(table)

  // Embers: each point rises at its own speed and wraps around at the top.
  const COUNT = 520
  const positions = new Float32Array(COUNT * 3)
  const speeds = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = -4 + Math.random() * 5
    speeds[i] = 0.004 + Math.random() * 0.01
  }
  const emberGeo = new BufferGeometry()
  const emberAttr = new BufferAttribute(positions, 3)
  emberGeo.setAttribute('position', emberAttr)
  const emberMat = new PointsMaterial({
    color: 0xf59e0b,
    size: 0.07,
    transparent: true,
    opacity: 0.75,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  const embers = new Points(emberGeo, emberMat)
  scene.add(embers)

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

  const ease = (x: number) => 1 - Math.pow(1 - x, 3)
  const t0 = performance.now()
  let ready = false
  renderer.setAnimationLoop(() => {
    if (hidden) return
    const t = (performance.now() - t0) / 1000
    const scrollY = window.scrollY
    // The cloche lifts over the first two seconds, then hovers above the plate.
    const lift = ease(Math.min(1, Math.max(0, (t - 0.6) / 1.8)))
    lid.position.y = 0.05 + lift * 1.7 + Math.sin(t * 0.9) * 0.08 * lift
    lid.rotation.z = -0.3 * lift
    lid.position.x = 0.35 * lift
    table.rotation.y += (target.x * 0.3 - table.rotation.y) * 0.04
    table.position.y = -1.9 + Math.sin(t * 0.7) * 0.12 - scrollY * 0.002
    glow.intensity = 2.2 + Math.sin(t * 7) * 0.3 + Math.sin(t * 13) * 0.2
    const arr = emberAttr.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speeds[i]
      arr[i * 3] += Math.sin(t + i) * 0.0015
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5
    }
    emberAttr.needsUpdate = true
    embers.position.y = -scrollY * 0.001
    emberMat.opacity = 0.6 + Math.sin(t * 2) * 0.12
    camera.position.x += (target.x * 0.3 - camera.position.x) * 0.05
    camera.position.y += (-target.y * 0.2 - camera.position.y) * 0.05
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
    table.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose()
        ;(obj.material as MeshStandardMaterial).dispose()
      }
    })
    emberGeo.dispose()
    emberMat.dispose()
    renderer.dispose()
  }
}
