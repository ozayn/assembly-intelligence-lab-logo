'use client'

import { motion } from 'framer-motion'
import { FACETS, RIGHT_PLANE, DURATION, EASE } from './Concept33FacetedA'

// Concept 41 — Concept 33 with one region turned to honeycomb.
//
// Everything here is Concept 33: the same silhouette, the same four planes, the
// same aperture, the same tones, the same seating order. The single change is
// in the lower right of the wide plane, over the triangle that mirrors the dark
// facet on the lower left, where the plane is carved into whole hexagonal cells
// on one grid. The channels between them are cut out of the plane rather than
// drawn over it, so they are the background — white on white, dark on dark —
// and the mark still flattens to one colour.
//
// Cells are all one size and one orientation, flat side up, on a single grid,
// and clipped where that grid meets the triangle, so the honeycomb reads as the
// material the leg is made of rather than as a pattern laid on top of it. The
// plane carries it in as one piece on Concept 33's own timing, which leaves the
// assembly exactly as approved.

type Point = [number, number]

const parse = (points: string): Point[] =>
  points.split(' ').map((pair) => pair.split(',').map(Number) as Point)

const PLANE = parse(RIGHT_PLANE)

const atHeight = (from: Point, to: Point, y: number): Point => [
  from[0] + ((to[0] - from[0]) * (y - from[1])) / (to[1] - from[1]),
  y,
]

// Concept 33's lower-left facet mirrored across the mark's axis. Its upper
// corner is carried the last two units out to the leg's own edge, so the
// honeycomb is cut by the silhouette rather than stopping just short of it.
const MIRRORED: Point[] = parse('46,103 15,169 70,148').map(([x, y]) => [200 - x, y])
const REGION: Point[] = [
  atHeight(PLANE[1], PLANE[2], MIRRORED[0][1]),
  MIRRORED[1],
  MIRRORED[2],
]

// Cell size and channel follow Shiva's reference: a whole cell is a ninth of
// the mark wide, held apart by the channel the modules in Concept 34 are
// already held apart by, as a proportion of their own size.
const CELL_R = 10.5
const CHANNEL = 2.5
const CELL_INNER = CELL_R - CHANNEL / Math.sqrt(3)
const COLUMN = 1.5 * CELL_R
const ROW = Math.sqrt(3) * CELL_R

const hexagon = (cx: number, cy: number, r: number): Point[] =>
  [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (Math.PI / 3) * i
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })

const signedArea = (polygon: Point[]) =>
  polygon.reduce((sum, [x, y], i) => {
    const [nx, ny] = polygon[(i + 1) % polygon.length]
    return sum + x * ny - nx * y
  }, 0) / 2

// Sutherland–Hodgman. The boundary is walked so that its inside is the negative
// side of every edge.
const BOUNDARY = signedArea(REGION) > 0 ? [...REGION].reverse() : REGION

const clip = (polygon: Point[]): Point[] =>
  BOUNDARY.reduce((subject, edgeStart, i) => {
    if (subject.length === 0) return subject
    const edgeEnd = BOUNDARY[(i + 1) % BOUNDARY.length]
    const side = ([x, y]: Point) =>
      (edgeEnd[0] - edgeStart[0]) * (y - edgeStart[1]) -
      (edgeEnd[1] - edgeStart[1]) * (x - edgeStart[0])
    const meet = (a: Point, b: Point): Point => {
      const t = side(a) / (side(a) - side(b))
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
    }
    const kept: Point[] = []
    subject.forEach((current, index) => {
      const previous = subject[(index + subject.length - 1) % subject.length]
      if (side(current) <= 0) {
        if (side(previous) > 0) kept.push(meet(previous, current))
        kept.push(current)
      } else if (side(previous) <= 0) {
        kept.push(meet(previous, current))
      }
    })
    return kept
  }, polygon)

// One grid, seeded on the centre of the region so the clipped cells fall evenly
// either side of it.
const CENTRE: Point = [
  REGION.reduce((sum, [x]) => sum + x, 0) / REGION.length,
  REGION.reduce((sum, [, y]) => sum + y, 0) / REGION.length,
]

// A cell is kept only if a third of it survives the clip. Less than that and
// what is left reads as a stray channel lying along the region's edge rather
// than as a cell the edge has cut.
const KEEP = 0.35 * 2.598 * CELL_INNER ** 2
const CELLS: Point[][] = []
for (let column = -3; column <= 3; column += 1) {
  for (let row = -3; row <= 3; row += 1) {
    const cx = CENTRE[0] + column * COLUMN
    const cy = CENTRE[1] + row * ROW + (Math.abs(column) % 2 === 1 ? ROW / 2 : 0)
    const cell = clip(hexagon(cx, cy, CELL_INNER))
    if (cell.length >= 3 && Math.abs(signedArea(cell)) > KEEP) {
      CELLS.push(clip(hexagon(cx, cy, CELL_R)), cell)
    }
  }
}

const subpath = (polygon: Point[]) =>
  `M${polygon.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join('L')}Z`

// Concept 33's wide plane, re-walked with the honeycomb taken out of it: the
// outline, then every cell twice — once at full size and once inset — so that
// under the even-odd rule the cells stay plane and the channels around them
// become holes.
const HONEYCOMB = [PLANE, ...CELLS].map(subpath).join('')

function Mark({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {FACETS.map((facet) => {
        const enter = {
          initial: { x: facet.from.x, y: facet.from.y, opacity: 0 },
          animate: { x: 0, y: 0, opacity: 1 },
          transition: { duration: DURATION, delay: facet.seat, ease: EASE },
        }
        if (facet.points === RIGHT_PLANE) {
          return animated ? (
            <motion.path
              key={facet.points}
              d={HONEYCOMB}
              fillRule="evenodd"
              fill={facet.fill}
              {...enter}
            />
          ) : (
            <path key={facet.points} d={HONEYCOMB} fillRule="evenodd" fill={facet.fill} />
          )
        }
        return animated ? (
          <motion.polygon key={facet.points} points={facet.points} fill={facet.fill} {...enter} />
        ) : (
          <polygon key={facet.points} points={facet.points} fill={facet.fill} />
        )
      })}
    </svg>
  )
}

export function Concept41Static() {
  return <Mark animated={false} />
}

export function Concept41Animated() {
  return <Mark animated />
}
