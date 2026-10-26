import {
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
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
 * Nova Studio hero scene: a skincare set for the treatment room. A dark glass
 * serum bottle with a dropper and red serum inside, a black cream jar with a red
 * lid, a thin red ring on the floor and red petals drifting past, with red sparks
 * in the dark. Turns gently with the cursor and sinks with the scroll.
 * Mounted lazily on desktop by HeroScene.
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
  const key = new DirectionalLight(0xffffff, 2.6)
  key.position.set(3, 6, 5)
  const fill = new DirectionalLight(0xe11d2e, 1.4)
  fill.position.set(-4, -1, 3)
  scene.add(key, fill, new HemisphereLight(0xffffff, 0x0a0a0a, 0.8))

  const glassMat = new MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.12,
    metalness: 0.35,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  const blackMat = new MeshStandardMaterial({ color: 0x151515, roughness: 0.45, metalness: 0.2 })
  const redMat = new MeshStandardMaterial({
    color: 0xe11d2e,
    emissive: 0xe11d2e,
    emissiveIntensity: 0.22,
    roughness: 0.35,
    metalness: 0.1,
  })
  const petalMat = new MeshStandardMaterial({ color: 0xe11d2e, roughness: 0.65, side: DoubleSide })
  const ringMat = new MeshStandardMaterial({
    color: 0xe11d2e,
    emissive: 0xe11d2e,
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.3,
  })
  const mats = [glassMat, blackMat, redMat, petalMat, ringMat]

  const bodyGeo = new CylinderGeometry(0.55, 0.55, 1.9, 48)
  const liquidGeo = new CylinderGeometry(0.5, 0.5, 1.2, 48)
  const shoulderGeo = new CylinderGeometry(0.3, 0.55, 0.25, 48)
  const neckGeo = new CylinderGeometry(0.3, 0.3, 0.2, 32)
  const capGeo = new CylinderGeometry(0.34, 0.34, 0.5, 32)
  const bulbGeo = new SphereGeometry(0.3, 32, 24)
  const pipetteGeo = new CylinderGeometry(0.04, 0.03, 2.1, 12)
  const jarGeo = new CylinderGeometry(0.75, 0.72, 0.7, 48)
  const lidGeo = new CylinderGeometry(0.78, 0.78, 0.22, 48)
  const ringGeo = new TorusGeometry(2.1, 0.02, 12, 180)
  const petalGeo = new SphereGeometry(1, 20, 12)
  const geos = [
    bodyGeo,
    liquidGeo,
    shoulderGeo,
    neckGeo,
    capGeo,
    bulbGeo,
    pipetteGeo,
    jarGeo,
    lidGeo,
    ringGeo,
    petalGeo,
  ]

  const set = new Group()

  // Serum bottle: the liquid and the pipette sit inside the glass body (base at y = 0).
  const bottle = new Group()
  const part = (geo: CylinderGeometry | SphereGeometry, mat: MeshStandardMaterial, y: number) => {
    const m = new Mesh(geo, mat)
    m.position.y = y
    bottle.add(m)
    return m
  }
  part(liquidGeo, redMat, 0.6)
  part(pipetteGeo, glassMat, 1.3)
  part(bodyGeo, glassMat, 0.95)
  part(shoulderGeo, glassMat, 2.025)
  part(neckGeo, blackMat, 2.25)
  part(capGeo, blackMat, 2.6)
  part(bulbGeo, blackMat, 3.05).scale.y = 1.15
  bottle.position.set(-0.3, -1.6, 0)
  set.add(bottle)

  // Cream jar, front right, with a red lid.
  const jar = new Group()
  const jarBody = new Mesh(jarGeo, blackMat)
  jarBody.position.y = 0.35
  const lid = new Mesh(lidGeo, redMat)
  lid.position.y = 0.81
  jar.add(jarBody, lid)
  jar.position.set(1.15, -1.6, 0.7)
  set.add(jar)

  const ring = new Mesh(ringGeo, ringMat)
  ring.rotation.x = 1.3
  ring.position.y = -1.5
  set.add(ring)

  // Petals: flat red lenses drifting around the set.
  const petals: { mesh: Mesh; base: number; phase: number; spin: number }[] = []
  for (let i = 0; i < 9; i++) {
    const mesh = new Mesh(petalGeo, petalMat)
    const a = (i / 9) * Math.PI * 2
    const r = 1.6 + (i % 3) * 0.5
    const base = -1.1 + (i % 4) * 0.85
    mesh.position.set(Math.cos(a) * r, base, Math.sin(a) * r * 0.6)
    mesh.scale.set(0.28, 0.05, 0.16)
    mesh.rotation.set(a, i * 0.9, a * 0.5)
    petals.push({ mesh, base, phase: i * 0.7, spin: 0.2 + (i % 3) * 0.1 })
    set.add(mesh)
  }

  set.position.set(-1.3, -1.3, -0.4)
  set.scale.setScalar(0.55)
  scene.add(set)

  const COUNT = 500
  const positions = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 16
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new BufferAttribute(positions, 3))
  const dustMat = new PointsMaterial({ color: 0xe11d2e, size: 0.05, transparent: true, opacity: 0.6 })
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
    set.rotation.y += (target.x * 0.5 + t * 0.08 - set.rotation.y) * 0.03
    set.rotation.x += (target.y * 0.18 - set.rotation.x) * 0.03
    set.position.y = -1.3 + Math.sin(t * 0.6) * 0.1 - scrollY * 0.002
    ring.rotation.z = t * 0.12
    for (const p of petals) {
      p.mesh.position.y = p.base + Math.sin(t * 0.8 + p.phase) * 0.25
      p.mesh.rotation.y += p.spin * 0.01
      p.mesh.rotation.x += 0.004
    }
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
    geos.forEach((g) => g.dispose())
    mats.forEach((m) => m.dispose())
    dustGeo.dispose()
    dustMat.dispose()
    renderer.dispose()
  }
}
