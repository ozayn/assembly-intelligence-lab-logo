'use client'

import { motion } from 'framer-motion'

// Concept 38 — the hexagonal counter.
//
// Concept 40's letter with the module moved to the one place in an A where a
// hexagon can be structural rather than applied: the counter. The void is a
// true regular hexagon, flat side up, sitting on the letter's axis and closed
// on all six sides, so it is read as a hexagon and not as an opening that
// happens to have corners. Everything around it is the letter doing its normal
// work — the hexagon's ceiling closes the head, its two widest corners set the
// waist of the legs, and its floor is carried by the bar the legs hang from,
// below which the counter opens again to the feet, which is what keeps the mark
// an A rather than a badge.
//
// The silhouette is Concept 40 untouched: the same apex, the same break at the
// shoulders, the same feet. Because the void now has corners of its own, the
// creases are struck from them rather than placed by eye — each leg folds on
// the line running out from the hexagon's widest corner, and the bar is split
// on the letter's axis. Three tones, arranged so no two planes meeting at a
// crease share a weight, and the counter is true negative space, so the mark
// survives being flattened to one colour.

type Point = [number, number]

const APEX: Point = [100, 24]
const SH_L: Point = [66, 54]
const SH_R: Point = [134, 54]
const OUT_L: Point = [12, 172]
const OUT_R: Point = [188, 172]
const IN_L: Point = [62, 156]
const IN_R: Point = [138, 156]

// The counter. This is the largest regular hexagon the letter will carry: any
// wider and the walls beside it fall below the weight of the bar under it, any
// lower and the opening left for the legs stops reading as part of the letter.
const CELL_R = 24
const CELL_TOP = 60
const CELL_MID = CELL_TOP + (Math.sqrt(3) / 2) * CELL_R
const CELL_BOTTOM = CELL_TOP + Math.sqrt(3) * CELL_R
const BAR = 12

const CEIL_L: Point = [100 - CELL_R / 2, CELL_TOP]
const CEIL_R: Point = [100 + CELL_R / 2, CELL_TOP]
const WAIST_L: Point = [100 - CELL_R, CELL_MID]
const WAIST_R: Point = [100 + CELL_R, CELL_MID]
const FLOOR_L: Point = [100 - CELL_R / 2, CELL_BOTTOM]
const FLOOR_R: Point = [100 + CELL_R / 2, CELL_BOTTOM]
const FLOOR_MID: Point = [100, CELL_BOTTOM]

// Where the legs part again, directly under the hexagon.
const NOTCH: Point = [100, CELL_BOTTOM + BAR]

const atHeight = (from: Point, to: Point, y: number): Point => {
  const t = (y - from[1]) / (to[1] - from[1])
  return [from[0] + (to[0] - from[0]) * t, y]
}

// Each leg folds where the hexagon is widest, carried straight out to the
// silhouette.
const FOLD_L = atHeight(SH_L, OUT_L, CELL_MID)
const FOLD_R = atHeight(SH_R, OUT_R, CELL_MID)

const poly = (points: Point[]) =>
  points.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(' ')

type Plane = {
  points: string
  fill: string
  /** Offset the plane enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

// Assembly runs from the ground up, feet first and the head last, so the
// ceiling is the final edge to arrive and the cell is only closed on the last
// beat.
const PLANES: Plane[] = [
  {
    points: poly([FOLD_L, WAIST_L, FLOOR_L, FLOOR_MID, NOTCH, IN_L, OUT_L]),
    fill: 'var(--logo-primary)',
    from: { x: -14, y: 10 },
    seat: 0.06,
  },
  {
    points: poly([FOLD_R, OUT_R, IN_R, NOTCH, FLOOR_MID, FLOOR_R, WAIST_R]),
    fill: 'var(--logo-secondary)',
    from: { x: 16, y: 9 },
    seat: 0.26,
  },
  {
    points: poly([SH_L, CEIL_L, WAIST_L, FOLD_L]),
    fill: 'var(--logo-secondary)',
    from: { x: -13, y: 2 },
    seat: 0.46,
  },
  {
    points: poly([SH_R, FOLD_R, WAIST_R, CEIL_R]),
    fill: 'var(--logo-accent)',
    from: { x: 14, y: -3 },
    seat: 0.66,
  },
  {
    points: poly([APEX, CEIL_L, SH_L]),
    fill: 'var(--logo-accent)',
    from: { x: -6, y: -14 },
    seat: 0.86,
  },
  {
    points: poly([APEX, SH_R, CEIL_R, CEIL_L]),
    fill: 'var(--logo-primary)',
    from: { x: 9, y: -15 },
    seat: 1.04,
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

export function Concept38Static() {
  return <Mark animated={false} />
}

export function Concept38Animated() {
  return <Mark animated />
}
