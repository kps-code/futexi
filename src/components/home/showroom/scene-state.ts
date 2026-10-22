/**
 * Mutable state shared between the showroom (scroll, pointer) and the phone
 * renderers. Kept outside React state so the 3D loop can read it every frame
 * without re-rendering anything.
 */
export type SceneState = {
  /** 0 at the first chapter, 1 at the last. */
  progress: number
  /** Pointer position, -1 to 1 on both axes, relative to the viewport. */
  pointer: { x: number; y: number }
  /** Extra rotation from dragging the phone, in radians. */
  drag: number
  dragVelocity: number
  dragging: boolean
  /** Narrow desktops: the phone moves right so the copy keeps its room. */
  shiftX: number
  shiftY: number
  scale: number
}

export function createSceneState(): SceneState {
  return {
    progress: 0,
    pointer: { x: 0, y: 0 },
    drag: 0,
    dragVelocity: 0,
    dragging: false,
    shiftX: 0,
    shiftY: 0,
    scale: 1,
  }
}

/** Phone pose per chapter; the 3D scene eases between neighbours as you scroll. */
export type Pose = { ry: number; rx: number; rz: number; x: number; s: number }

export const POSES: readonly Pose[] = [
  { ry: -0.35, rx: 0.05, rz: 0, x: 0.7, s: 1 },
  { ry: -0.6, rx: -0.05, rz: 0.06, x: -0.3, s: 1.05 },
  { ry: 0.8, rx: 0.15, rz: -0.1, x: 0.5, s: 1 },
  { ry: 0.55, rx: 0.1, rz: -0.08, x: 0.4, s: 1.02 },
  { ry: -0.3, rx: 0.32, rz: 0.12, x: 0, s: 1.04 },
  { ry: 0, rx: 0, rz: 0, x: 0, s: 1.06 },
]

/** Poses for `n` chapters: the first and last poses always frame the story. */
export function posesFor(n: number): Pose[] {
  if (n <= 1) return [POSES[0]]
  const middle = POSES.slice(1, -1)
  const out: Pose[] = [POSES[0]]
  for (let i = 1; i < n - 1; i++) out.push(middle[(i - 1) % middle.length])
  out.push(POSES[POSES.length - 1])
  return out
}
