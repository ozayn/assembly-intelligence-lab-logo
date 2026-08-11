'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, type Tone } from './referenceTones'

// Synthesis of historical references 01, 11 and 24.
// From 11: the triangular macro silhouette and the apex-dark to base-pale
// gradient. From 24: a perimeter of discrete particles enclosing a real void.
// From 01: the single apex particle sitting on the vertical axis.
// The base row is left/right symmetric so the only gradient in the mark is
// 11's vertical one.
type Dot = { cx: number; cy: number; r: number; tone: Tone; seat: number }

const APEX = { x: 100, y: 34 }
const BASE_Y = 156
const HALF_W = 70

const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})

const BL = { x: APEX.x - HALF_W, y: BASE_Y }
const BR = { x: APEX.x + HALF_W, y: BASE_Y }

const EDGE: [number, number, Tone][] = [
  [0.2, 8.8, 'navy'],
  [0.4, 8.3, 'navy'],
  [0.6, 7.8, 'blue'],
  [0.785, 7.3, 'blue'],
  [0.945, 6.8, 'teal'],
]

const BASE: [number, number, Tone][] = [
  [0.145, 6.3, 'teal'],
  [0.32, 5.9, 'lteal'],
  [0.5, 5.6, 'pteal'],
  [0.68, 5.9, 'lteal'],
  [0.855, 6.3, 'teal'],
]

const dots: Dot[] = [
  { cx: APEX.x, cy: APEX.y, r: 9.6, tone: 'navy', seat: 0 },
  // Units propagate down both edges at once...
  ...EDGE.flatMap(([t, r, tone], i) =>
    [BL, BR].map((target) => {
      const p = lerp(APEX, target, t)
      return { cx: p.x, cy: p.y, r, tone, seat: 0.22 + i * 0.13 }
    })
  ),
  // ...and meet along the base, closing the form from the corners inward.
  ...BASE.map(([t, r, tone], i) => {
    const p = lerp(BL, BR, t)
    const fromCorner = Math.min(i, BASE.length - 1 - i)
    return { cx: p.x, cy: p.y, r, tone, seat: 0.95 + fromCorner * 0.14 }
  }),
]

export function Concept30Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={TONE_FILL[d.tone]} opacity={TONE_OPACITY[d.tone]} />
      ))}
    </svg>
  )
}

export function Concept30Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          fill={TONE_FILL[d.tone]}
          initial={{ r: d.r * 0.3, opacity: 0 }}
          animate={{ r: d.r, opacity: TONE_OPACITY[d.tone] }}
          transition={{ duration: 0.5, delay: d.seat, ease: [0.34, 1.4, 0.64, 1] }}
        />
      ))}
    </svg>
  )
}
