'use client'

import { motion } from 'framer-motion'

// Concept 39 — the A that a cell closes.
//
// The other hybrids treat the molecule as something added: a module parked in a
// facet, or a leg dissolving into units. This one asks where a cell would have
// to sit if it were holding the letter together. An A is two planes leaning on
// each other and everything it carries passes through the point where they
// meet, so the cell is put exactly there, at structural size, and the planes
// are cut to it: the left plane docks on its left face, the right plane on its
// right, and the two only reach each other underneath it, down the short seam
// to the counter. Take the cell out and the letter comes apart, which is the
// whole idea — not an A with a molecule on it, an A that a molecule closes.
//
// Its three upper faces are the silhouette, which is what keeps the reference
// discoverable: the crown reads first as a folded peak and only afterwards as
// the top half of a hexagon whose lower half is drawn by the seams inside the
// letter. Nothing else is decorative either. The cell's right face carries on
// down past it to cut the small facet above the counter, and its 30° face angle
// sets the fold that crosses the left plane, so every crease in the mark is the
// cell's own geometry propagating through the planes. The footprint, the stance
// and the triangular counter stay Concept 33's, and the tones keep its
// weighting: one plane dark and dominant, one lighter, a pale facet at the
// counter, and a single accent — here spent on the cell, so the eye reaches it
// last, after the letter.

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

// Concept 33's footprint: same feet, same inner corners, same counter apex, so
// the stance and the negative space carry over unchanged.
const COUNTER: Point = [100, 88]
const LEFT_INNER: Point = [70, 148]
const RIGHT_INNER: Point = [130, 148]
const LEFT_FOOT: Point = [15, 169]
const RIGHT_FOOT: Point = [185, 169]

// The fold across the left plane: cast from the counter apex on the cell's own
// face angle, out to the left edge.
function foldToLeftEdge(from: Point): Point {
  const edge: Point = [LEFT_FOOT[0] - CELL_UL[0], LEFT_FOOT[1] - CELL_UL[1]]
  const dir: Point = [-Math.cos(FACE_ANGLE), Math.sin(FACE_ANGLE)]
  const det = dir[1] * edge[0] - dir[0] * edge[1]
  const t = ((CELL_UL[1] - from[1]) * edge[0] - (CELL_UL[0] - from[0]) * edge[1]) / det
  return [from[0] + t * dir[0], from[1] + t * dir[1]]
}

const COUNTER_FOLD = foldToLeftEdge(COUNTER)
// The cell's right face, continued down until the same fold angle closes it off
// against the counter apex.
const SPINE: Point = [CELL_LR[0], COUNTER[1] - (CELL_LR[0] - COUNTER[0]) * Math.tan(FACE_ANGLE)]

const poly = (...points: Point[]) =>
  points.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(' ')

type Piece = {
  points: string
  fill: string
  /** Offset the piece enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

// Assembly order: the letter builds from the ground up on the left, the right
// plane swings in, and the cell drops into the crown last — the mark is only
// closed, and only reads as an A, once the cell is seated.
const PIECES: Piece[] = [
  {
    points: poly(COUNTER_FOLD, COUNTER, LEFT_INNER, LEFT_FOOT),
    fill: 'var(--logo-primary)',
    from: { x: -15, y: 11 },
    seat: 0.06,
  },
  {
    points: poly(CELL_UL, CELL_LL, CELL_BOTTOM, COUNTER, COUNTER_FOLD),
    fill: 'var(--logo-secondary)',
    from: { x: -13, y: 2 },
    seat: 0.3,
  },
  {
    points: poly(CELL_UR, RIGHT_FOOT, RIGHT_INNER, COUNTER, SPINE, CELL_LR),
    fill: 'var(--logo-primary)',
    from: { x: 18, y: -4 },
    seat: 0.56,
  },
  // The facet the cell's right face cuts out above the counter: the one piece
  // that touches no edge of the letter, so it can carry the pale tone in both
  // themes.
  {
    points: poly(CELL_LR, SPINE, COUNTER, CELL_BOTTOM),
    fill: 'var(--logo-light)',
    from: { x: 8, y: 6 },
    seat: 0.84,
  },
  {
    points: poly(CROWN, CELL_UR, CELL_LR, CELL_BOTTOM, CELL_LL, CELL_UL),
    fill: 'var(--logo-accent)',
    from: { x: 0, y: -18 },
    seat: 1.08,
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
