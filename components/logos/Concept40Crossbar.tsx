'use client'

import { motion } from 'framer-motion'

// Concept 40 — the crossbar A.
//
// Taken from the reference Oz brought in, and kept as plain as that reference
// is. Two things give the letter its character and nothing else is added to
// them. Its outer edges break at the shoulders, so the top is a broad wedge and
// the legs below it stand steeper than the wedge would if it simply carried on
// to the feet. And its counter is closed by a flat ceiling instead of running
// up to a point, which is what makes the head read as one solid plane and the
// letter as an A rather than a peak.
//
// Five planes, all of them meeting the silhouette. The head folds along a
// crease from the apex to the near corner of the ceiling, so the wedge is two
// weights rather than one flat shape; the right leg is left as a single
// uninterrupted plane; and the left leg creases once above the foot, on the 30°
// angle the family's modules are built from, to put dark weight diagonally
// opposite the dark head. Tones stay restrained to three, and the counter is
// true negative space, so the mark survives being flattened to one colour.

type Point = [number, number]

const APEX: Point = [100, 24]
const SH_L: Point = [66, 54]
const SH_R: Point = [134, 54]
const OUT_L: Point = [12, 172]
const OUT_R: Point = [188, 172]
const IN_L: Point = [62, 156]
const IN_R: Point = [138, 156]
const CEIL_L: Point = [84, 88]
const CEIL_R: Point = [116, 88]

const FACE_ANGLE = Math.PI / 6

const direction = (from: Point, to: Point): Point => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]]
  const length = Math.hypot(dx, dy)
  return [dx / length, dy / length]
}

const atHeight = (from: Point, to: Point, y: number): Point => {
  const t = (y - from[1]) / (to[1] - from[1])
  return [from[0] + (to[0] - from[0]) * t, y]
}

const intersect = (a: Point, da: Point, b: Point, db: Point): Point => {
  const det = da[0] * db[1] - da[1] * db[0]
  const t = ((b[0] - a[0]) * db[1] - (b[1] - a[1]) * db[0]) / det
  return [a[0] + t * da[0], a[1] + t * da[1]]
}

// The single fold in the left leg, struck from the edge that closes the counter
// out to the silhouette.
const FOLD_INNER = atHeight(CEIL_L, IN_L, 116)
const FOLD_OUTER = intersect(
  FOLD_INNER,
  [-Math.cos(FACE_ANGLE), Math.sin(FACE_ANGLE)],
  SH_L,
  direction(SH_L, OUT_L)
)

const poly = (points: Point[]) =>
  points.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(' ')

type Plane = {
  points: string
  fill: string
  /** Offset the plane enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

// Assembly runs from the ground up: the left foot, the plane above it, the
// right leg, then the head in two folds, so the counter is the last thing to
// close.
const PLANES: Plane[] = [
  {
    points: poly([FOLD_OUTER, FOLD_INNER, IN_L, OUT_L]),
    fill: 'var(--logo-primary)',
    from: { x: -14, y: 10 },
    seat: 0.06,
  },
  {
    points: poly([SH_L, CEIL_L, FOLD_INNER, FOLD_OUTER]),
    fill: 'var(--logo-secondary)',
    from: { x: -13, y: 4 },
    seat: 0.3,
  },
  {
    points: poly([SH_R, OUT_R, IN_R, CEIL_R]),
    fill: 'var(--logo-secondary)',
    from: { x: 16, y: -2 },
    seat: 0.52,
  },
  {
    points: poly([APEX, CEIL_L, SH_L]),
    fill: 'var(--logo-accent)',
    from: { x: -6, y: -14 },
    seat: 0.74,
  },
  {
    points: poly([APEX, SH_R, CEIL_R, CEIL_L]),
    fill: 'var(--logo-primary)',
    from: { x: 9, y: -15 },
    seat: 0.96,
  },
]

const DURATION = 0.62
const EASE = [0.16, 1, 0.3, 1] as const

function Mark({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {PLANES.map((plane) =>
        animated ? (
          <motion.polygon
            key={plane.points}
            points={plane.points}
            fill={plane.fill}
            initial={{ x: plane.from.x, y: plane.from.y, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: DURATION, delay: plane.seat, ease: EASE }}
          />
        ) : (
          <polygon key={plane.points} points={plane.points} fill={plane.fill} />
        )
      )}
    </svg>
  )
}

export function Concept40Static() {
  return <Mark animated={false} />
}

export function Concept40Animated() {
  return <Mark animated />
}
