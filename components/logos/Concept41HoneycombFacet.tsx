'use client'

import { motion } from 'framer-motion'
import { FACETS, RIGHT_PLANE, DURATION, EASE } from './Concept33FacetedA'

// Concept 41 — Concept 33 carrying the honeycomb from Shiva's reference.
//
// Everything but one region is Concept 33: the same silhouette, the same four
// planes, the same aperture, the same tones, the same seating order. In the
// lower right the wide plane is carved into hexagonal cells, and the channels
// between them are cut out of the plane rather than drawn over it, so they are
// the background — white on white, dark on dark — and the mark still flattens
// to one colour.
//
// The cluster is Shiva's, traced off her image rather than invented here. Her
// mark was measured cell by cell, her leg mapped onto Concept 33's, and what
// came back is what stands below: cells a little over a tenth of the mark
// across, ten of them in four columns of two and three, the top one reaching
// about two thirds of the way up the leg, the bottom ones running off the
// underside, the outer ones just catching the outer edge, and the foot left
// solid beyond them. Her lattice wanders, as a generated one does; this one is
// laid out true and set down a ninth of a cell up and over from where the trace
// put it, which is the one adjustment that keeps every crop at the letter's
// edges a piece worth having rather than a splinter.
//
// What is here is drawn as one lattice. The cells are taken as a block, the
// block's outline is walked, pushed out by half a channel and cut from the
// plane as a single hole, and every cell is then dropped back into that hole at
// half a channel under full size. Because each cell gives up the same half
// channel on every side, and the block the same half channel around its edge,
// every line — between two cells or around the outside of the whole cluster —
// is exactly one channel wide, and the three-way junctions come out of the
// geometry rather than being drawn. The block is clipped once, to the plane
// itself, so the only thing that ever cuts a cell is an edge of the letter.
//
// The plane carries the honeycomb in as one piece on Concept 33's own timing,
// which leaves the assembly exactly as approved.

type Point = [number, number]

const parse = (points: string): Point[] =>
  points.split(' ').map((pair) => pair.split(',').map(Number) as Point)

const PLANE = parse(RIGHT_PLANE)

// Both measured off the reference: her cells came back a little over a tenth of
// the mark across, held apart by a hairline about an eighth of a cell wide.
const CELL_R = 9
const CHANNEL = 1.2
const COLUMN = 1.5 * CELL_R
const ROW = Math.sqrt(3) * CELL_R

// Half a channel measured square to a cell wall, written as a change of radius,
// which is how both the inset cells and the pushed-out block come off the one
// grid.
const HALF = CHANNEL / Math.sqrt(3)

// The cell her cluster hangs from, sitting on the aperture's edge, and the rest
// of her cells as columns and rows off it.
const ORIGIN: Point = [124.13, 129.48]
const STANDING: [column: number, row: number][] = [
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [2, 0],
  [2, 1],
  [2, 2],
  [3, 0],
  [3, 1],
]

const CENTRES: Point[] = STANDING.map(([column, row]) => [
  ORIGIN[0] + column * COLUMN,
  ORIGIN[1] + (row + (column % 2 === 0 ? 0 : 0.5)) * ROW,
])

const snap = (value: number) => Math.round(value * 1000) / 1000
const corner = (point: Point) => `${snap(point[0])},${snap(point[1])}`

const hexagon = ([cx, cy]: Point, r: number): Point[] =>
  [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (Math.PI / 3) * i
    return [snap(cx + r * Math.cos(angle)), snap(cy + r * Math.sin(angle))]
  })

const signedArea = (polygon: Point[]) =>
  polygon.reduce((sum, [x, y], i) => {
    const [nx, ny] = polygon[(i + 1) % polygon.length]
    return sum + x * ny - nx * y
  }, 0) / 2

// Distance from a point to an edge of the plane, positive on the inside.
const depth = (from: Point, to: Point, point: Point) =>
  ((to[0] - from[0]) * (point[1] - from[1]) - (to[1] - from[1]) * (point[0] - from[0])) /
  Math.hypot(to[0] - from[0], to[1] - from[1])

// Sutherland–Hodgman against the plane, which is convex. Walked so that its
// inside is the positive side of every edge.
const BOUNDARY = signedArea(PLANE) < 0 ? [...PLANE].reverse() : PLANE

const clip = (polygon: Point[]): Point[] =>
  BOUNDARY.reduce((subject, from, i) => {
    if (subject.length === 0) return subject
    const to = BOUNDARY[(i + 1) % BOUNDARY.length]
    const meet = (a: Point, b: Point): Point => {
      const t = depth(from, to, a) / (depth(from, to, a) - depth(from, to, b))
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
    }
    const kept: Point[] = []
    subject.forEach((current, index) => {
      const previous = subject[(index + subject.length - 1) % subject.length]
      if (depth(from, to, current) >= 0) {
        if (depth(from, to, previous) < 0) kept.push(meet(previous, current))
        kept.push(current)
      } else if (depth(from, to, previous) >= 0) {
        kept.push(meet(previous, current))
      }
    })
    return kept
  }, polygon)

// The outline of the block: every wall not shared with a neighbour, linked head
// to tail into closed loops. Walls keep the direction the cells are wound in,
// so the plane the cells stand on is always to the same side of a wall and the
// way out of the block is the same turn from every one of them.
function outline(centres: Point[]): Point[][] {
  const walls = new Map<string, [Point, Point]>()
  centres.forEach((centre) => {
    const corners = hexagon(centre, CELL_R)
    corners.forEach((from, i) => {
      const to = corners[(i + 1) % corners.length]
      const shared = `${corner(to)}|${corner(from)}`
      if (walls.has(shared)) walls.delete(shared)
      else walls.set(`${corner(from)}|${corner(to)}`, [from, to])
    })
  })

  const leaving = new Map<string, [Point, Point][]>()
  walls.forEach((wall) => {
    const at = leaving.get(corner(wall[0]))
    if (at) at.push(wall)
    else leaving.set(corner(wall[0]), [wall])
  })

  const take = (at: string) => {
    const remaining = leaving.get(at)
    if (!remaining || remaining.length === 0) return undefined
    const wall = remaining.pop() as [Point, Point]
    if (remaining.length === 0) leaving.delete(at)
    return wall
  }

  const loops: Point[][] = []
  walls.forEach((start) => {
    let wall = take(corner(start[0]))
    const loop: Point[] = []
    while (wall) {
      loop.push(wall[0])
      wall = take(corner(wall[1]))
    }
    if (loop.length >= 3) loops.push(loop)
  })
  return loops
}

const OUTWARD = signedArea(hexagon([0, 0], 1)) > 0 ? 1 : -1

// Miter offset: every wall is pushed out by the same distance and the new
// corners are where consecutive pushed walls now cross. On a lattice outline
// consecutive walls always turn, so those crossings always exist.
function push(loop: Point[], distance: number): Point[] {
  const lines = loop.map((from, i) => {
    const to = loop[(i + 1) % loop.length]
    const length = Math.hypot(to[0] - from[0], to[1] - from[1])
    const away: Point = [
      (OUTWARD * (to[1] - from[1])) / length,
      (-OUTWARD * (to[0] - from[0])) / length,
    ]
    return {
      on: [from[0] + away[0] * distance, from[1] + away[1] * distance] as Point,
      along: [(to[0] - from[0]) / length, (to[1] - from[1]) / length] as Point,
    }
  })

  return lines.map((line, i) => {
    const previous = lines[(i + lines.length - 1) % lines.length]
    const turn = previous.along[0] * line.along[1] - previous.along[1] * line.along[0]
    const t =
      ((line.on[0] - previous.on[0]) * line.along[1] -
        (line.on[1] - previous.on[1]) * line.along[0]) /
      turn
    return [
      previous.on[0] + previous.along[0] * t,
      previous.on[1] + previous.along[1] * t,
    ] as Point
  })
}

const BLOCK = outline(CENTRES)
  .map((loop) => clip(push(loop, HALF)))
  .filter((loop) => loop.length >= 3)

const CELLS = CENTRES.map((centre) => clip(hexagon(centre, CELL_R - HALF))).filter(
  (cell) => cell.length >= 3
)

const subpath = (polygon: Point[]) =>
  `M${polygon.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join('L')}Z`

// Concept 33's wide plane, re-walked with the honeycomb taken out of it: the
// plane's outline, then the block as a hole, then the cells filling that hole
// back in. What is left unfilled is the channel.
const HONEYCOMB = [PLANE, ...BLOCK, ...CELLS].map(subpath).join('')

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
