'use client'

import { motion } from 'framer-motion'
import { buildSeatedMark } from './seatedMark'

// Static baseline of Shiva's selected faceted-A direction. The silhouette and
// four-plane construction follow the supplied source. The inner aperture is
// rebuilt as a balanced triangular unit, so its base and side vectors follow
// the same underlying facet logic instead of the source's stretched void.
const UPPER_FACET = '78,25 100,88 46,103'
const MIDDLE_FACET = '46,103 100,88 70,148'
const LOWER_FACET = '15,169 46,103 70,148'
export const RIGHT_PLANE = '78,25 122,25 185,169 130,148 100,88'

type Facet = {
  points: string
  fill: string
  // Offset the plane starts from, along its own outward direction, so each
  // piece slides in on the axis it belongs to rather than drifting freely.
  from: { x: number; y: number }
  seat: number
}

// Paint order is part of the approved static frame and is preserved exactly.
// The wide right plane seats last, so the negative-space aperture only reads
// once the surrounding facets are already in position.
export const FACETS: Facet[] = [
  { points: LOWER_FACET, fill: 'var(--logo-primary)', from: { x: -15, y: 11 }, seat: 0.08 },
  { points: UPPER_FACET, fill: 'var(--logo-accent)', from: { x: -9, y: -13 }, seat: 0.68 },
  { points: MIDDLE_FACET, fill: 'var(--logo-light)', from: { x: -14, y: 5 }, seat: 0.38 },
  { points: RIGHT_PLANE, fill: 'var(--logo-secondary)', from: { x: 18, y: -4 }, seat: 1 },
]

export const DURATION = 0.62
export const EASE = [0.16, 1, 0.3, 1] as const

export function Concept33Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {FACETS.map((facet) => (
        <polygon key={facet.points} points={facet.points} fill={facet.fill} />
      ))}
    </svg>
  )
}

// The same seating as the component below, written out as a file that stands
// on its own. The planes seat exactly as they do on the page, so the concept
// only has to say which pieces move and how quickly.
export function buildConcept33Animated(
  colour: (token: string) => string,
  size: number
): string {
  return buildSeatedMark(
    { scope: 'ail-concept-33-animated', pieces: FACETS, duration: DURATION, ease: EASE },
    colour,
    size
  )
}

export function Concept33Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {FACETS.map((facet) => (
        <motion.polygon
          key={facet.points}
          points={facet.points}
          fill={facet.fill}
          initial={{ x: facet.from.x, y: facet.from.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: DURATION, delay: facet.seat, ease: EASE }}
        />
      ))}
    </svg>
  )
}
