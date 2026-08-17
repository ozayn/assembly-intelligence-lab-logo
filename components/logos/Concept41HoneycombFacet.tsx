'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FACETS, RIGHT_PLANE } from './Concept33FacetedA'

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
// underside, the outer ones catching the outer edge. Two more carry the same
// lattice on into the foot, which she left solid, so the honeycomb runs to the
// corner and it is the letter that ends it rather than the pattern stopping
// short. Her lattice wanders, as a generated one does; this one is laid out
// true and set down a ninth of a cell up and over from where the trace put it,
// which is the one adjustment that keeps every crop at the letter's edges a
// piece worth having rather than a splinter.
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
// The animation departs from the other concepts on purpose: the letter does not
// assemble, the lattice does, and it opens on Concept 33's own solid leg. What
// plays is set out where the growth is worked out below.

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
  [4, 1],
  [4, 2],
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

const CELLS = STANDING.map(([column, row], i) => ({
  name: `${column},${row}`,
  at: CENTRES[i],
  shape: clip(hexagon(CENTRES[i], CELL_R - HALF)),
})).filter((cell) => cell.shape.length >= 3)

const subpath = (polygon: Point[]) =>
  `M${polygon.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join('L')}Z`

// Concept 33's wide plane, re-walked with the honeycomb taken out of it: the
// plane's outline, then the block as a hole, then the cells filling that hole
// back in. What is left unfilled is the channel.
const HONEYCOMB = [PLANE, ...BLOCK, ...CELLS.map((cell) => cell.shape)].map(subpath).join('')

// A cell wall is the channel's centre line: the cells are set half a channel
// back from the lattice and the block half a channel out from it, so a stroke a
// channel wide laid along the lattice covers exactly what the static drawing
// cuts away. Three walls meeting at a lattice corner cover the corner between
// them exactly too, which is why the strokes are cut square and not rounded.
const WALLS = new Map<string, [Point, Point]>()
CENTRES.forEach((centre) => {
  const corners = hexagon(centre, CELL_R)
  corners.forEach((from, i) => {
    const to = corners[(i + 1) % corners.length]
    const wall = [corner(from), corner(to)].sort().join('|')
    if (!WALLS.has(wall)) WALLS.set(wall, [from, to])
  })
})

const LEAVING = new Map<string, string[]>()
WALLS.forEach(([from, to], wall) => {
  ;[from, to].forEach((end) => {
    const here = LEAVING.get(corner(end))
    if (here) here.push(wall)
    else LEAVING.set(corner(end), [wall])
  })
})

// Whether any part of a wall falls on the plane. Walls beyond the letter's
// edges still carry the growth, but nothing of them is ever seen, so they are
// left out of the reckoning of how long the whole thing takes.
const shows = (from: Point, to: Point) => {
  let entering = 0
  let leaving = 1
  for (let i = 0; i < BOUNDARY.length; i += 1) {
    const edge = BOUNDARY[i]
    const next = BOUNDARY[(i + 1) % BOUNDARY.length]
    const here = depth(edge, next, from)
    const there = depth(edge, next, to)
    if (here < 0 && there < 0) return false
    if (here < 0) entering = Math.max(entering, here / (here - there))
    else if (there < 0) leaving = Math.min(leaving, here / (here - there))
  }
  return leaving > entering
}

// Growth. One wall between the two cells at the middle of the cluster is drawn
// first; a wall's ends are live once it is nearly complete, and every wall
// leaving a live end then sets off, so nothing is ever drawn that is not
// already joined to what is there. Vertices are taken in the order they come
// alive, which is what makes a cell close as its sixth wall lands and the front
// carry on outward from it.
const SEED_CELLS = ['1,0', '2,1']
const DRAW = 1
const GAP = 0.16
const JOINED = 0.86
// Each wall is laid a shade faster than the one before it, so the network
// quickens as it spreads.
const QUICKEN = 0.985

const wobble = (wall: string) => {
  let hash = 0
  for (let i = 0; i < wall.length; i += 1) hash = (hash * 31 + wall.charCodeAt(i)) % 997
  return hash / 997
}

const ring = (centre: Point) =>
  hexagon(centre, CELL_R).map((from, i, corners) =>
    [corner(from), corner(corners[(i + 1) % corners.length])].sort().join('|')
  )

const GROWTH = (() => {
  const seeded = SEED_CELLS.map((name) => CELLS.find((cell) => cell.name === name)?.at as Point)
  const between = new Set(ring(seeded[0]))
  const seed = ring(seeded[1]).find((wall) => between.has(wall)) as string
  // The cell that first wall belongs to is closed before the front is let go,
  // so a whole cell is legible early and the rest reads as spreading from it.
  const first = new Set(ring(seeded[1]))

  const laid = new Map<string, { from: Point; to: Point; start: number; draw: number }>()
  const live = new Map<string, number>()
  const waiting: [string, number][] = []

  const lay = (wall: string, end: string, start: number) => {
    const [head, tail] = WALLS.get(wall) as [Point, Point]
    const from = corner(head) === end ? head : tail
    const to = corner(head) === end ? tail : head
    const draw = DRAW * QUICKEN ** laid.size
    laid.set(wall, { from, to, start, draw })
    const reached = start + draw * JOINED
    ;[corner(to), corner(from)].forEach((vertex) => {
      if (live.has(vertex) && (live.get(vertex) as number) <= reached) return
      live.set(vertex, reached)
      waiting.push([vertex, reached])
    })
  }

  lay(seed, corner((WALLS.get(seed) as [Point, Point])[0]), 0)

  while (waiting.length > 0) {
    let soonest = 0
    waiting.forEach(([, when], i) => {
      if (when < (waiting[soonest][1] as number)) soonest = i
    })
    const [vertex, when] = waiting.splice(soonest, 1)[0]
    if ((live.get(vertex) as number) < when) continue
    ;(LEAVING.get(vertex) ?? [])
      .filter((wall) => !laid.has(wall))
      .sort((one, other) => Number(first.has(other)) - Number(first.has(one)))
      .forEach((wall, branch) => {
        if (laid.has(wall)) return
        const pause =
          GAP *
          QUICKEN ** laid.size *
          (first.has(wall) ? 0.35 : 0.7 + 0.6 * wobble(wall)) *
          (branch + 1)
        lay(wall, vertex, when + pause)
      })
  }

  const last = [...laid.values()]
    .filter((wall) => shows(wall.from, wall.to))
    .reduce((latest, wall) => Math.max(latest, wall.start + wall.draw), 0)

  return [...laid.entries()].map(([wall, { from, to, start, draw }]) => ({
    wall,
    from,
    to,
    start: start / last,
    draw: draw / last,
  }))
})()

// A beat on the solid leg, the spread, then the finished lattice held before
// the static drawing takes over.
const LEAD = 0.18
const SPREAD = 1.7
const HOLD = 0.3
const TOTAL = LEAD + SPREAD + HOLD
const GROW = [0.3, 0.7, 0.35, 1] as const
const MASK = 'concept41-growth'

export function Concept41Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {FACETS.map((facet) =>
        facet.points === RIGHT_PLANE ? (
          <path key={facet.points} d={HONEYCOMB} fillRule="evenodd" fill={facet.fill} />
        ) : (
          <polygon key={facet.points} points={facet.points} fill={facet.fill} />
        )
      )}
    </svg>
  )
}

// The same growth as the component below, written out as a file that stands on
// its own: the transitions become CSS keyframes inside the SVG, the tokens
// become the colours they resolve to, and nothing outside the file is read. It
// steps from the masked plane to the static drawing after the same hold the
// component keeps, for the reason given there, so the frame it rests on is the
// approved one rather than a masked likeness of it — and the file and the page
// change over on the same beat.
export function buildConcept41Animated(
  colour: (token: string) => string,
  size: number
): string {
  const paint = (fill: string) =>
    fill.replace(/var\((--logo-[a-z]+)\)/, (whole, token: string) => colour(token) || whole)

  const scope = 'ail-concept-41-animated'
  const settles = snap(TOTAL)

  const walls = GROWTH.map(({ from, to, start, draw }) => {
    const length = snap(Math.hypot(to[0] - from[0], to[1] - from[1]))
    return (
      `<path class="wall" d="M${corner(from)}L${corner(to)}"` +
      ` stroke-dasharray="${length}" stroke-dashoffset="${length}"` +
      ` style="animation-delay:${snap(LEAD + start * SPREAD)}s;` +
      `animation-duration:${snap(draw * SPREAD)}s"/>`
    )
  }).join('')

  const plane = FACETS.find((facet) => facet.points === RIGHT_PLANE) as (typeof FACETS)[number]
  const standing = FACETS.filter((facet) => facet.points !== RIGHT_PLANE)
    .map((facet) => `<polygon points="${facet.points}" fill="${paint(facet.fill)}"/>`)
    .join('')

  // Selectors are held inside the mark's own id so that pasting the file into a
  // page cannot reach anything else on it.
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" id="${scope}">` +
    `<style>` +
    `#${scope} .wall{animation-name:${scope}-grow;` +
    `animation-timing-function:cubic-bezier(${GROW.join(',')});animation-fill-mode:both}` +
    // step-start rather than a crossfade: both layers change on the same
    // frame, so the lattice is never seen through the drawing that replaces it.
    `#${scope} .growing{animation:${scope}-clear 1ms step-start ${settles}s both}` +
    `#${scope} .settled{opacity:0;animation:${scope}-settle 1ms step-start ${settles}s both}` +
    `@keyframes ${scope}-grow{to{stroke-dashoffset:0}}` +
    `@keyframes ${scope}-clear{to{opacity:0}}` +
    `@keyframes ${scope}-settle{to{opacity:1}}` +
    `</style>` +
    `<defs><mask id="${scope}-growth" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">` +
    `<rect x="0" y="0" width="200" height="200" fill="#fff"/>` +
    `<g fill="none" stroke="#000" stroke-width="${CHANNEL}" stroke-linecap="butt">${walls}</g>` +
    `</mask></defs>` +
    standing +
    `<polygon class="growing" points="${RIGHT_PLANE}" fill="${paint(plane.fill)}" mask="url(#${scope}-growth)"/>` +
    `<path class="settled" d="${HONEYCOMB}" fill-rule="evenodd" fill="${paint(plane.fill)}"/>` +
    `</svg>`
  )
}

export function Concept41Animated() {
  // Once the network is complete the mark hands over to the static drawing. A
  // masked edge is not antialiased quite like a cut in the path itself, and the
  // strokes stop a hair short of the block's mitred corners, so this is what
  // makes the frame it comes to rest on the approved one.
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const done = setTimeout(() => setGrown(true), TOTAL * 1000)
    return () => clearTimeout(done)
  }, [])

  if (grown) return <Concept41Static />

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* The channel is cut out of the plane rather than painted over it, so
            it is the background itself and stays right on either ground. */}
        <mask id={MASK} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect x="0" y="0" width="200" height="200" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth={CHANNEL} strokeLinecap="butt">
            {GROWTH.map((wall) => (
              <motion.path
                key={wall.wall}
                d={`M${corner(wall.from)}L${corner(wall.to)}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: wall.draw * SPREAD,
                  delay: LEAD + wall.start * SPREAD,
                  ease: GROW,
                }}
              />
            ))}
          </g>
        </mask>
      </defs>
      {FACETS.map((facet) =>
        facet.points === RIGHT_PLANE ? (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={facet.fill}
            mask={`url(#${MASK})`}
          />
        ) : (
          <polygon key={facet.points} points={facet.points} fill={facet.fill} />
        )
      )}
    </svg>
  )
}
