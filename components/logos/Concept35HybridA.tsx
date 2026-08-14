'use client'

import { motion } from 'framer-motion'

// Concept 35 — one A built from both of the languages already on the table:
// the folded planes of Concept 33 and the hexagonal modules of Concept 34.
//
// The two systems are held together by three rules, applied in all three
// variations: the modules keep Concept 34's point-up geometry, a module is
// sized to the width of the leg it belongs to rather than dropped on at a
// decorative size, and every plane edge that faces a module is parallel to
// that module's face across a five-unit channel — the same channel Concept 34
// leaves between its own modules. A plane and a module read as the same
// material in two states rather than as two marks side by side.

type Piece = {
  points: string
  fill: string
  /** Offset the piece enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

// Point-up hexagon, matching Concept 34's module.
export function hex(cx: number, cy: number, r: number) {
  const h = (r * Math.sqrt(3)) / 2
  return [
    `${cx},${cy - r}`,
    `${cx + h},${cy - r / 2}`,
    `${cx + h},${cy + r / 2}`,
    `${cx},${cy + r}`,
    `${cx - h},${cy + r / 2}`,
    `${cx - h},${cy - r / 2}`,
  ].join(' ')
}

const DURATION = 0.58
const EASE = [0.16, 1, 0.3, 1] as const

function Mark({ pieces, animated }: { pieces: Piece[]; animated: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {pieces.map((piece) =>
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

// ---------------------------------------------------------------------------
// 35A — Integrated leg
//
// Concept 34's structure with one leg folded. The apex, the right-hand run and
// the centre unit keep Concept 34's exact positions and radius; the three
// modules that made up its left leg are replaced by a single folded plane
// occupying the footprint they swept. Same lattice, same channels, same
// silhouette — one leg is simply in the other state.
// ---------------------------------------------------------------------------

const A_MODULE_R = 20.3
// Concept 34's apex, right-hand run, and centre unit — coordinates unchanged.
const A_APEX: [number, number] = [100, 34]
const A_RUN: Array<[number, number]> = [
  [120, 69],
  [140, 104],
  [160, 139],
]
const A_CENTRE: [number, number] = [100, 104]

// The folded left leg. Its ends are square to the leg's own axis, so the top
// edge runs parallel to the apex module's lower-left face across the same
// channel Concept 34 leaves between modules, and the foot is cut on the slant
// Concept 33 uses. Two fold lines break the plane into three facets.
const A_UPPER = '72.3,44.2 101.4,60.8 46.1,90.1'
const A_MIDDLE = '46.1,90.1 101.4,60.8 65.3,124'
const A_LOWER = '46.1,90.1 65.3,124 43.1,162.8 14,146.2'

const CONCEPT_35A: Piece[] = [
  // The plane carries Concept 33's tones for its left half; the modules carry
  // Concept 34's, with both feet on primary so the letter stays grounded. Pale
  // is left out of all three variations: the dark theme maps it to navy, which
  // drops isolated pieces out of the mark on a dark background.
  { points: A_LOWER, fill: 'var(--logo-primary)', from: { x: -14, y: 10 }, seat: 0.06 },
  { points: A_MIDDLE, fill: 'var(--logo-light)', from: { x: -13, y: 4 }, seat: 0.28 },
  { points: A_UPPER, fill: 'var(--logo-accent)', from: { x: -8, y: -12 }, seat: 0.5 },
  { points: hex(A_APEX[0], A_APEX[1], A_MODULE_R), fill: 'var(--logo-secondary)', from: { x: 0, y: -15 }, seat: 0.72 },
  { points: hex(A_RUN[0][0], A_RUN[0][1], A_MODULE_R), fill: 'var(--logo-accent)', from: { x: 9, y: -10 }, seat: 0.88 },
  { points: hex(A_RUN[1][0], A_RUN[1][1], A_MODULE_R), fill: 'var(--logo-light)', from: { x: 13, y: 2 }, seat: 1.02 },
  { points: hex(A_RUN[2][0], A_RUN[2][1], A_MODULE_R), fill: 'var(--logo-primary)', from: { x: 13, y: 8 }, seat: 1.16 },
  // Seats last: the letter only closes once the crossbar unit docks between
  // the two systems.
  { points: hex(A_CENTRE[0], A_CENTRE[1], A_MODULE_R), fill: 'var(--logo-secondary)', from: { x: 0, y: 13 }, seat: 1.32 },
]

export function Concept35AStatic() {
  return <Mark pieces={CONCEPT_35A} animated={false} />
}

export function Concept35AAnimated() {
  return <Mark pieces={CONCEPT_35A} animated />
}

// ---------------------------------------------------------------------------
// 35B — Assembly transition
//
// Concept 33's silhouette, cut. The right plane runs from the apex and stops
// on a clean break perpendicular to its own axis; the leg is then finished by
// modules continuing on the same centre line. The first module is cut to the
// full width of the leg, so the leg does not thin at the break, and the last
// is smaller — the structure is caught part way through resolving.
// ---------------------------------------------------------------------------

const B_UPPER_LEFT = '78,25 100,88 46,103'
const B_MIDDLE_LEFT = '46,103 100,88 70,148'
const B_LOWER_LEFT = '15,169 46,103 70,148'
// Concept 33's right plane, cut at 55% of the leg. The break is not square to
// the leg: it is parallel to the face of the module below it, one channel
// away, so the plane ends exactly where the first module begins.
const B_RIGHT_PLANE = '78,25 122,25 149.5,87.9 111,110.1 100,88'

const CONCEPT_35B: Piece[] = [
  { points: B_LOWER_LEFT, fill: 'var(--logo-primary)', from: { x: -15, y: 11 }, seat: 0.06 },
  { points: B_UPPER_LEFT, fill: 'var(--logo-accent)', from: { x: -9, y: -13 }, seat: 0.3 },
  { points: B_MIDDLE_LEFT, fill: 'var(--logo-light)', from: { x: -14, y: 5 }, seat: 0.5 },
  { points: B_RIGHT_PLANE, fill: 'var(--logo-secondary)', from: { x: 16, y: -6 }, seat: 0.72 },
  { points: hex(141.1, 120.5, 22), fill: 'var(--logo-accent)', from: { x: 11, y: -5 }, seat: 0.96 },
  { points: hex(156.4, 156.1, 17), fill: 'var(--logo-light)', from: { x: 12, y: 7 }, seat: 1.14 },
]

export function Concept35BStatic() {
  return <Mark pieces={CONCEPT_35B} animated={false} />
}

export function Concept35BAnimated() {
  return <Mark pieces={CONCEPT_35B} animated />
}

// ---------------------------------------------------------------------------
// 35C — Molecular interior
//
// The outer silhouette stays a solid folded A. The molecular language moves
// into the letter: the counter is cut as a module rather than a triangle, its
// lower faces form the crossbar, and one unit is docked at its centre. Nothing
// hangs off the outside of the letter.
// ---------------------------------------------------------------------------

// The counter, as a point-up module: centre (100,88), r 28.
const C_VOID_T = '100,60'
const C_VOID_UR = '124.2,74'
const C_VOID_LR = '124.2,102'
const C_VOID_B = '100,116'
const C_VOID_LL = '75.8,102'
const C_VOID_UL = '75.8,74'
// Where the legs part below the crossbar.
const C_NOTCH = '100,132'

const C_LEFT_UPPER = `80,22 100,22 ${C_VOID_T} ${C_VOID_UL} 50.5,90`
const C_LEFT_LOWER = `50.5,90 ${C_VOID_UL} ${C_VOID_LL} ${C_VOID_B} ${C_NOTCH} 62,174 14,174`
const C_RIGHT_UPPER = `100,22 120,22 149.5,90 ${C_VOID_UR} ${C_VOID_T}`
const C_RIGHT_LOWER = `149.5,90 186,174 138,174 ${C_NOTCH} ${C_VOID_B} ${C_VOID_LR} ${C_VOID_UR}`

const CONCEPT_35C: Piece[] = [
  { points: C_LEFT_LOWER, fill: 'var(--logo-primary)', from: { x: -13, y: 8 }, seat: 0.06 },
  { points: C_LEFT_UPPER, fill: 'var(--logo-accent)', from: { x: -9, y: -11 }, seat: 0.28 },
  { points: C_RIGHT_UPPER, fill: 'var(--logo-secondary)', from: { x: 9, y: -11 }, seat: 0.5 },
  { points: C_RIGHT_LOWER, fill: 'var(--logo-light)', from: { x: 13, y: 8 }, seat: 0.72 },
  // The docked unit: same geometry as the counter around it, at rest.
  { points: hex(100, 88, 10.5), fill: 'var(--logo-accent)', from: { x: 0, y: -9 }, seat: 0.98 },
]

export function Concept35CStatic() {
  return <Mark pieces={CONCEPT_35C} animated={false} />
}

export function Concept35CAnimated() {
  return <Mark pieces={CONCEPT_35C} animated />
}
