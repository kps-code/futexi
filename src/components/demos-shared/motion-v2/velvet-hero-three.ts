import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'

/**
 * Velvet Salon hero scene: a champagne-gold ribbon of silk rolling slowly
 * behind the headline, with blush dust in the dark. The ribbon is a plane
 * whose vertices ride two sine waves each frame. Mounted lazily on desktop.
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
  const camera = new PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0, 9)
  const key = new DirectionalLight(0xfff0dc, 2.6)
  key.position.set(2, 4, 6)
  const blush = new DirectionalLight(0xe2b98a, 1.3)
  blush.position.set(-4, -2, 3)
  scene.add(key, blush, new AmbientLight(0x3a2f24, 0.8))

  const geo = new PlaneGeometry(18, 1.7, 180, 12)
  const base = (geo.getAttribute('position') as BufferAttribute).array.slice() as Float32Array
  const mat = new MeshStandardMaterial({
    color: 0xc9a063,
    metalness: 0.85,
    roughness: 0.42,
    side: DoubleSide,
  })
  const ribbon = new Mesh(geo, mat)
  ribbon.position.set(0.8, -3.1, -2.5)
  ribbon.rotation.set(0.35, 0, -0.28)
  scene.add(ribbon)

  const COUNT = 400
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 16
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new BufferAttribute(positions, 3))
  const dustMat = new PointsMaterial({ color: 0xe2b98a, size: 0.04, transparent: true, opacity: 0.6 })
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

  const pos = geo.getAttribute('position') as BufferAttribute
  const t0 = performance.now()
  let ready = false
  renderer.setAnimationLoop(() => {
    if (hidden) return
    const t = (performance.now() - t0) / 1000
    const scrollY = window.scrollY
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      pos.setZ(i, Math.sin(x * 0.55 + t * 0.7) * 0.7 + Math.sin(x * 1.4 - t * 0.45 + y) * 0.22)
      pos.setY(i, y + Math.sin(x * 0.35 + t * 0.5) * 0.35)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    ribbon.rotation.y += (target.x * 0.22 - ribbon.rotation.y) * 0.04
    ribbon.rotation.x += (0.35 + target.y * 0.12 - ribbon.rotation.x) * 0.04
    ribbon.position.y = -3.1 - scrollY * 0.0025
    dust.rotation.y = t * 0.02
    dust.position.y = -scrollY * 0.001
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
    geo.dispose()
    mat.dispose()
    dustGeo.dispose()
    dustMat.dispose()
    renderer.dispose()
  }
}
