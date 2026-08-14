'use client'

import { motion } from 'framer-motion'

// Concept 39 — the A that a cell joins.
//
// The cell at the top is the point of this mark, so the rest is built as
// something the cell holds. It sits at structural size with its three upper
// faces forming the crown, and the two sides of the letter hang off the two
// faces underneath it: the left plane docks on the lower-left face, the right
// leg on the lower-right. Nothing else connects them — the counter opens
// straight from the cell's bottom vertex, so take the cell away and the letter
// falls into two pieces. That is what keeps the hexagon from reading as an
// ornament on top of an A: it is the joint the A is assembled at.
//
// The two sides are deliberately unequal. The left plane grips two faces of the
// cell, its left and its lower-left, so it starts high and carries the weight of
// the mark, and it is creased on the cell's own face angle into a dark base and
// a lighter shoulder. The right leg grips one face only. It is exactly as wide
// at the joint as the face it hangs from, leaves on that face's right angle, and
// opens to Concept 33's foot — one plane, enough weight to finish the letter,
// and still the lighter of the two. Feet, inner corners and stance are Concept
// 33's, so the letter stands the way the family does.

type Point = [number, number]

const CELL_R = 25
const CELL_HALF = (CELL_R * Math.sqrt(3)) / 2
const FACE_ANGLE = Math.PI / 6

// The cell, seated so its apex is the top of the letter.
const CROWN: Point = [100, 22]
const CELL_Y = CROWN[1] + CELL_R
const CELL_UR: Point = [100 + CELL_HALF, CELL_Y - CELL_R / 2]
const CELL_LR: Point = [100 + CELL_HALF, CELL_Y + CELL_R / 2]
const CELL_BOTTOM: Point = [100, CELL_Y + CELL_R]
const CELL_LL: Point = [100 - CELL_HALF, CELL_Y + CELL_R / 2]
const CELL_UL: Point = [100 - CELL_HALF, CELL_Y - CELL_R / 2]

// Concept 33's footprint: same feet and same inner corners, so the stance and
// the width of the counter at the baseline carry over unchanged.
const LEFT_FOOT: Point = [15, 169]
const LEFT_INNER: Point = [70, 148]
const RIGHT_INNER: Point = [130, 148]
const RIGHT_FOOT: Point = [185, 169]

const direction = (from: Point, to: Point): Point => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]]
  const length = Math.hypot(dx, dy)
  return [dx / length, dy / length]
}

const intersect = (a: Point, da: Point, b: Point, db: Point): Point => {
  const det = da[0] * db[1] - da[1] * db[0]
  const t = ((b[0] - a[0]) * db[1] - (b[1] - a[1]) * db[0]) / det
  return [a[0] + t * da[0], a[1] + t * da[1]]
}

// The crease across the left plane, cast on the cell's face angle. It is struck
// from the letter's axis below the joint, so the plane folds without disturbing
// the point where the two sides meet the cell.
const CREASE_ORIGIN: Point = [100, 88]
const CREASE: Point = [-Math.cos(FACE_ANGLE), Math.sin(FACE_ANGLE)]
const CREASE_INNER = intersect(CELL_BOTTOM, direction(CELL_BOTTOM, LEFT_INNER), CREASE_ORIGIN, CREASE)
const CREASE_OUTER = intersect(CELL_UL, direction(CELL_UL, LEFT_FOOT), CREASE_ORIGIN, CREASE)

const poly = (...points: Point[]) =>
  points.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(' ')

type Piece = {
  points: string
  fill: string
  /** Offset the piece enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

// Assembly order: the left plane builds from the ground up, the right leg swings
// in, and the cell drops into the crown last. Until it lands the two sides are
// two separate pieces leaning at each other, so the letter is closed by the
// joint rather than merely decorated by it.
const PIECES: Piece[] = [
  {
    points: poly(CREASE_OUTER, CREASE_INNER, LEFT_INNER, LEFT_FOOT),
    fill: 'var(--logo-primary)',
    from: { x: -15, y: 11 },
    seat: 0.06,
  },
  {
    points: poly(CELL_UL, CELL_LL, CELL_BOTTOM, CREASE_INNER, CREASE_OUTER),
    fill: 'var(--logo-secondary)',
    from: { x: -13, y: 2 },
    seat: 0.3,
  },
  {
    points: poly(CELL_LR, RIGHT_FOOT, RIGHT_INNER, CELL_BOTTOM),
    fill: 'var(--logo-secondary)',
    from: { x: 18, y: -4 },
    seat: 0.56,
  },
  {
    points: poly(CROWN, CELL_UR, CELL_LR, CELL_BOTTOM, CELL_LL, CELL_UL),
    fill: 'var(--logo-accent)',
    from: { x: 0, y: -18 },
    seat: 0.88,
  },
]

const DURATION = 0.62
const EASE = [0.16, 1, 0.3, 1] as const

function Mark({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {PIECES.map((piece) =>
        animated ? (
          <motion.polygon
            key={piece.points}
            points={piece.points}
            fill={piece.fill}
            initial={{ x: piece.from.x, y: piece.from.y, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: DURATION, delay: piece.seat, ease: EASE }}
          />
        ) : (
          <polygon key={piece.points} points={piece.points} fill={piece.fill} />
        )
      )}
    </svg>
  )
}

export function Concept39Static() {
  return <Mark animated={false} />
}

export function Concept39Animated() {
  return <Mark animated />
}
