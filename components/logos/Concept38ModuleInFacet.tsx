'use client'

import { motion } from 'framer-motion'
import { FACETS, DURATION, EASE } from './Concept33FacetedA'
import { hex } from './Concept35HybridA'

// Concepts 38 and 39 — Concept 33 carrying Concept 34's module.
//
// Concept 36 put its modules where the leg ended, so the letter lost weight on
// one side. Here the silhouette is not touched at all: Concept 33's four facets
// are imported as they are, so the proportions, the fold lines and the white
// counter are literally its own. Everything added sits inside the filled mass.
//
// Two rules place a module. It is a point-up module of Concept 34's geometry,
// cut to the plane that holds it so that it stands five units clear of every
// edge of that plane — the channel Concept 34 leaves between its own modules,
// which is why the surrounding facet never thins to a seam. And it takes the
// tone of the plane facing it across the counter, so it reads as material
// traded between the two halves of the letter rather than as a shape laid on
// top of one of them.

type Piece = (typeof FACETS)[number]

// In the right plane, on the bisector of the leg: the one line along which a
// module can hold the same channel to both of the leg's edges.
const RIGHT_LEG_MODULE = hex(140, 120, 16.5)

// In the upper-left facet, at its incentre: the one point where a module can
// hold the same channel to all three of the facet's edges.
const UPPER_FACET_MODULE = hex(76.5, 76, 13)

// The modules dock once the letter is already standing, so the mark still
// assembles as Concept 33 does and the molecular language arrives into a
// finished structure rather than competing with it.
const CONCEPT_38: Piece[] = [
  ...FACETS,
  { points: RIGHT_LEG_MODULE, fill: 'var(--logo-accent)', from: { x: 7, y: 12 }, seat: 1.28 },
]

const CONCEPT_39: Piece[] = [
  ...FACETS,
  { points: UPPER_FACET_MODULE, fill: 'var(--logo-secondary)', from: { x: -8, y: -11 }, seat: 1.28 },
  { points: RIGHT_LEG_MODULE, fill: 'var(--logo-accent)', from: { x: 7, y: 12 }, seat: 1.46 },
]

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

export function Concept39Static() {
  return <Mark pieces={CONCEPT_39} animated={false} />
}

export function Concept39Animated() {
  return <Mark pieces={CONCEPT_39} animated />
}
