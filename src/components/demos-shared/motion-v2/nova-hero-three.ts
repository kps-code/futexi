import {
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

/**
 * Nova Studio hero scene: a stack of matte stones under a thin gold ring,
 * with gold dust drifting in the evening light. Turns gently with the cursor
 * and sinks with the scroll. Mounted lazily on desktop by HeroScene.
 */
export function mountScene(canvas: HTMLCanvasElement, onReady?: () => void): () => void {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const scene = new Scene()
  const camera = new PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const key = new DirectionalLight(0xfff1dc, 2.4)
  key.position.set(3, 6, 5)
  const gold = new DirectionalLight(0xd9b36a, 1.4)
  gold.position.set(-4, -1, 3)
  scene.add(key, gold, new HemisphereLight(0xfff4e6, 0x1b2a41, 0.9))

  // Stones: flattened spheres, each a little off-axis like a hand-balanced stack.
  const stack = new Group()
  const stones = [
    { r: [1.3, 0.42, 1.15], c: 0xcfc2ae, y: 0 },
    { r: [1.08, 0.38, 0.98], c: 0xb7a892, y: 0.72 },
    { r: [0.86, 0.34, 0.8], c: 0xa29381, y: 1.36 },
    { r: [0.6, 0.28, 0.58], c: 0x8d8070, y: 1.92 },
  ]
  const geo = new SphereGeometry(1, 48, 32)
  const mats: MeshStandardMaterial[] = []
  stones.forEach((s, i) => {
    const m = new MeshStandardMaterial({ color: s.c, roughness: 0.88, metalness: 0.04 })
    mats.push(m)
    const mesh = new Mesh(geo, m)
    mesh.scale.set(s.r[0], s.r[1], s.r[2])
    mesh.position.y = s.y - 1.1
    mesh.rotation.y = i * 0.7
    mesh.rotation.z = (i % 2 ? -1 : 1) * 0.05
    stack.add(mesh)
  })
  const ringGeo = new TorusGeometry(2.3, 0.02, 12, 180)
  const ringMat = new MeshStandardMaterial({ color: 0xd9b36a, metalness: 0.9, roughness: 0.3 })
  const ring = new Mesh(ringGeo, ringMat)
  ring.rotation.x = 1.3
  ring.position.y = 0.1
  stack.add(ring)
  stack.position.set(2.5, 0.1, -0.6)
  scene.add(stack)

  const COUNT = 500
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 16
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new BufferAttribute(positions, 3))
  const dustMat = new PointsMaterial({ color: 0xd9b36a, size: 0.045, transparent: true, opacity: 0.7 })
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
    stack.rotation.y += (target.x * 0.5 + t * 0.08 - stack.rotation.y) * 0.03
    stack.rotation.x += (target.y * 0.18 - stack.rotation.x) * 0.03
    stack.position.y = 0.1 + Math.sin(t * 0.6) * 0.12 - scrollY * 0.002
    ring.rotation.z = t * 0.12
    dust.rotation.y = t * 0.02
    dust.position.y = Math.sin(t * 0.25) * 0.3 - scrollY * 0.001
    camera.position.x += (target.x * 0.35 - camera.position.x) * 0.05
    camera.position.y += (-target.y * 0.25 - camera.position.y) * 0.05
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
    geo.dispose()
    mats.forEach((m) => m.dispose())
    ringGeo.dispose()
    ringMat.dispose()
    dustGeo.dispose()
    dustMat.dispose()
    renderer.dispose()
  }
}
