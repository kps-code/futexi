'use client'

import { useEffect, useRef, type RefObject } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SpotLight,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { posesFor, type SceneState } from './scene-state'

export type PhoneThreeProps = {
  /** Scroll, pointer and drag state owned by the showroom. */
  state: RefObject<SceneState>
  /** One drawn screen per chapter. */
  screens: HTMLCanvasElement[]
  chapter: number
  light: boolean
  /** Called once the first frame has rendered, so the flat phone can hand over. */
  onReady?: () => void
}

const FLOOR_Y = -3

/**
 * The 3D phone: a glossy rounded slab with the current chapter's screen as its
 * face, a soft floor reflection, a key spotlight with cool and warm rims, and
 * drifting dust. Pose follows scroll progress, pointer and drag.
 * Desktop only; imported lazily by the showroom after the page has loaded.
 */
export function PhoneThree({ state, screens, chapter, light, onReady }: PhoneThreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ setScreen: (i: number) => void; setLight: (l: boolean) => void } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const scene = new Scene()
    const pmrem = new PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.4
    const camera = new PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.6, 14.6)

    const ambient = new AmbientLight(0xffffff, 0.22)
    const spot = new SpotLight(0xffffff, 420, 50, Math.PI / 6.5, 0.7, 1.4)
    spot.position.set(0, 10, 5)
    const cool = new PointLight(0x7dd3fc, 50, 30)
    cool.position.set(-6, 2, 3)
    const warm = new PointLight(0xfbbf24, 28, 30)
    warm.position.set(6, 1, 2)
    scene.add(ambient, spot, spot.target, cool, warm)

    const rig = new Group()
    const phone = new Group()
    rig.add(phone)
    scene.add(rig)

    const bodyMat = new MeshPhysicalMaterial({
      color: 0x171a21,
      metalness: 0.75,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
    })
    const bodyGeo = new RoundedBoxGeometry(2.7, 5.6, 0.28, 6, 0.32)
    const body = new Mesh(bodyGeo, bodyMat)
    const frame = new Mesh(
      new RoundedBoxGeometry(2.74, 5.64, 0.2, 6, 0.34),
      new MeshStandardMaterial({ color: 0x9aa3b2, metalness: 1, roughness: 0.25 }),
    )
    phone.add(body, frame)

    const textures = screens.map((c) => {
      const t = new CanvasTexture(c)
      t.colorSpace = SRGBColorSpace
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      return t
    })
    const screenGeo = new PlaneGeometry(2.46, 5.3)
    const screenMat = new MeshBasicMaterial({ map: textures[0], toneMapped: false })
    const screen = new Mesh(screenGeo, screenMat)
    screen.position.z = 0.145
    const glare = new Mesh(
      screenGeo,
      new MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        roughness: 0.05,
        clearcoat: 1,
      }),
    )
    glare.position.z = 0.15
    const flash = new Mesh(
      screenGeo,
      new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }),
    )
    flash.position.z = 0.152
    phone.add(screen, glare, flash)

    const floorMat = new MeshStandardMaterial({
      color: 0x0a0e15,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
    })
    const floor = new Mesh(new PlaneGeometry(60, 60), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = FLOOR_Y
    scene.add(floor)

    // Mirrored copy under the floor line: a cheap reflection.
    const reflection = new Group()
    const rBodyMat = bodyMat.clone()
    rBodyMat.transparent = true
    rBodyMat.opacity = 0.35
    const rBody = new Mesh(bodyGeo, rBodyMat)
    const rScreenMat = new MeshBasicMaterial({
      map: textures[0],
      transparent: true,
      opacity: 0.3,
      toneMapped: false,
    })
    const rScreen = new Mesh(screenGeo, rScreenMat)
    rScreen.position.z = 0.145
    reflection.add(rBody, rScreen)
    reflection.scale.y = -1
    rig.add(reflection)

    const DUST = 700
    const dustPos = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 22
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 12
      dustPos[i * 3 + 2] = -6 + Math.random() * 9
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3))
    const dustMat = new PointsMaterial({
      color: 0xcfd6e2,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
    const dust = new Points(dustGeo, dustMat)
    scene.add(dust)

    const setLight = (isLight: boolean) => {
      scene.environmentIntensity = isLight ? 1.1 : 0.4
      ambient.intensity = isLight ? 1.1 : 0.22
      spot.intensity = isLight ? 160 : 420
      cool.intensity = isLight ? 8 : 50
      warm.intensity = isLight ? 6 : 28
      floorMat.color.set(isLight ? 0xe6e9ee : 0x0a0e15)
      floorMat.opacity = isLight ? 0.9 : 0.72
      dustMat.color.set(isLight ? 0x6b7483 : 0xcfd6e2)
      dustMat.opacity = isLight ? 0.35 : 0.55
      rBodyMat.opacity = isLight ? 0.18 : 0.35
      rScreenMat.opacity = isLight ? 0.16 : 0.3
      renderer.toneMappingExposure = isLight ? 1.15 : 1.05
    }
    let flashAt = -1
    const setScreen = (i: number) => {
      const t = textures[Math.min(i, textures.length - 1)]
      if (!t || screenMat.map === t) return
      screenMat.map = t
      rScreenMat.map = t
      screenMat.needsUpdate = true
      rScreenMat.needsUpdate = true
      flashAt = performance.now()
    }
    api.current = { setScreen, setLight }
    setLight(light)
    setScreen(chapter)

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

    const poses = posesFor(screens.length)
    const ease = (t: number) => t * t * (3 - 2 * t)
    const t0 = performance.now()
    // Takes over from the flat phone: a short settle from slightly below, turning to face the visitor.
    const intro = { y: -1.4, ry: 0.7, start: performance.now() }
    let ready = false
    let hidden = document.hidden

    const frameLoop = () => {
      if (hidden) return
      const t = (performance.now() - t0) / 1000
      const s = state.current
      const f = s.progress * (poses.length - 1)
      const i = Math.min(poses.length - 2, Math.max(0, Math.floor(f)))
      const k = ease(f - i)
      const a = poses[i]
      const b = poses[Math.min(i + 1, poses.length - 1)]
      const L = (p: number, q: number) => p + (q - p) * k

      const introT = Math.min(1, (performance.now() - intro.start) / 1100)
      const introK = 1 - Math.pow(1 - introT, 3)
      const introY = intro.y * (1 - introK)
      const introRy = intro.ry * (1 - introK)

      if (!s.dragging) {
        s.dragVelocity *= 0.95
        s.drag += s.dragVelocity
        s.drag *= 0.985
      }
      phone.rotation.set(
        L(a.rx, b.rx) + Math.sin(t * 0.7) * 0.02 - s.pointer.y * 0.06,
        L(a.ry, b.ry) + introRy + s.drag + s.pointer.x * 0.12,
        L(a.rz, b.rz),
      )
      const scale = L(a.s, b.s) * s.scale
      phone.scale.setScalar(scale)
      phone.position.y = 0.3 + s.shiftY + Math.sin(t * 0.9) * 0.09 + introY
      rig.position.x = L(a.x, b.x) * (s.shiftX ? 0.4 : 1) + s.shiftX

      reflection.rotation.set(-phone.rotation.x, phone.rotation.y, -phone.rotation.z)
      reflection.scale.set(scale, -scale, scale)
      reflection.position.y = 2 * FLOOR_Y - phone.position.y
      ;(glare.material as MeshPhysicalMaterial).opacity =
        0.06 + Math.max(0, Math.sin(phone.rotation.y * 2 + 0.6)) * 0.12
      if (flashAt > 0) {
        const age = (performance.now() - flashAt) / 600
        ;(flash.material as MeshBasicMaterial).opacity = age >= 1 ? 0 : 0.7 * (1 - age) * (1 - age)
        if (age >= 1) flashAt = -1
      }

      camera.position.x += (s.pointer.x * 0.35 - camera.position.x) * 0.04
      camera.position.y += (0.6 - s.pointer.y * 0.25 - camera.position.y) * 0.04
      camera.lookAt(0, -0.35, 0)
      cool.position.x = -6 + Math.sin(t * 0.4) * 1.5
      warm.position.y = 1 + Math.cos(t * 0.5) * 1.2

      const p = dust.geometry.attributes.position as BufferAttribute
      for (let j = 0; j < DUST; j++) {
        let y = p.getY(j) + 0.0025
        if (y > 6) y = -6
        p.setY(j, y)
      }
      p.needsUpdate = true

      renderer.render(scene, camera)
      if (!ready) {
        ready = true
        onReady?.()
      }
    }
    renderer.setAnimationLoop(frameLoop)
    const onVisibility = () => {
      hidden = document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      renderer.setAnimationLoop(null)
      ro.disconnect()
      api.current = null
      textures.forEach((t) => t.dispose())
      pmrem.dispose()
      scene.traverse((o) => {
        const m = o as Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as { dispose?: () => void } | undefined
        if (mat && typeof mat.dispose === 'function') mat.dispose()
      })
      renderer.dispose()
    }
    // The scene is built once; chapter and theme changes go through the api ref below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screens, state])

  useEffect(() => {
    api.current?.setScreen(chapter)
  }, [chapter])
  useEffect(() => {
    api.current?.setLight(light)
  }, [light])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
}

export default PhoneThree
