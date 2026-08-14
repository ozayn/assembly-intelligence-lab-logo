'use client'

import { motion } from 'framer-motion'
import { FACETS, RIGHT_PLANE, DURATION, EASE } from './Concept33FacetedA'

// Concept 38 — Concept 33 with the module cut out of it.
//
// A module parked in the middle of a plane, clear of every edge, stays a shape
// sitting on the letter however well it is placed. So the module here is not a
// shape at all: it is a hexagonal void, seated on the one line where a void can
// do structural work — the edge of the right plane that closes the counter. One
// of its faces lies exactly on that edge, starting at the counter's apex, so the
// white of the counter runs straight into it and the two are a single opening.
// The cell is not inside the negative space; from the apex down it is the
// negative space, and the letter's aperture is a triangle that begins as a cell.
//
// Everything else is Concept 33 untouched: same silhouette, same feet, same
// three left facets, same fold lines. The cell is sized to the leg rather than
// to itself — as large as it can be while the wall it leaves against the outer
// edge keeps the weight of a plane, which is what stops the leg from reading as
// pinched. Because the void belongs to the plane it is cut from, the mark also
// assembles exactly as Concept 33 does: the right plane seats last and arrives
// carrying the cell, so the opening appears in the same beat that closes the
// letter.

type Piece = (typeof FACETS)[number]
type Point = [number, number]

// Concept 33's counter: its apex, and the edge of the right plane that closes
// it. The cell is built on this edge, so it inherits the letter's own angle.
const APEX: Point = [100, 88]
const COUNTER_FOOT: Point = [130, 148]

const EDGE = Math.hypot(COUNTER_FOOT[0] - APEX[0], COUNTER_FOOT[1] - APEX[1])
const ALONG: Point = [(COUNTER_FOOT[0] - APEX[0]) / EDGE, (COUNTER_FOOT[1] - APEX[1]) / EDGE]
const INTO: Point = [ALONG[1], -ALONG[0]]

const CELL_R = 19.5
const CELL_DEPTH = Math.sqrt(3) * CELL_R

const at = (along: number, into: number): Point => [
  APEX[0] + along * ALONG[0] + into * INTO[0],
  APEX[1] + along * ALONG[1] + into * INTO[1],
]

// The five vertices the cell contributes to the plane's outline. Its sixth
// face is the counter's edge itself, from the apex down, and is therefore open.
const CELL: Point[] = [
  at(CELL_R, 0),
  at(1.5 * CELL_R, CELL_DEPTH / 2),
  at(CELL_R, CELL_DEPTH),
  at(0, CELL_DEPTH),
  at(-0.5 * CELL_R, CELL_DEPTH / 2),
]

// Concept 33's right plane, re-walked with the cell taken out of it: down the
// outer edge and the foot as before, then up the counter's edge, around the
// five closed faces of the cell, and out at the apex.
const CUT_RIGHT_PLANE = ([[78, 25], [122, 25], [185, 169], COUNTER_FOOT, ...CELL, APEX] as Point[])
  .map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`)
  .join(' ')

const CONCEPT_38: Piece[] = FACETS.map((facet) =>
  facet.points === RIGHT_PLANE ? { ...facet, points: CUT_RIGHT_PLANE } : facet
)

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

export function Concept38Static() {
  return <Mark pieces={CONCEPT_38} animated={false} />
}

export function Concept38Animated() {
  return <Mark pieces={CONCEPT_38} animated />
}
