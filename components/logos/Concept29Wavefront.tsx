'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, type Tone } from './referenceTones'

// Descendant of historical reference 07. The nine positions are samples taken
// along the parent's own measured particle path — crest at 33% of the span,
// trough at 68%, amplitude falling away at the right end — rather than a
// generic sine. Refinement is the rhythm: even x-pitch, a controlled radius
// progression, and bonds kept only where the parent has them, at the rise into
// the crest and once on the descent.
type Dot = { cx: number; cy: number; r: number; tone: Tone }

const dots: Dot[] = [
  { cx: 13.6, cy: 123.2, r: 8.2, tone: 'navy' },
  { cx: 35.2, cy: 100.48, r: 7.9, tone: 'navy' },
  { cx: 56.8, cy: 80.48, r: 7.6, tone: 'blue' },
  { cx: 78.4, cy: 77.44, r: 7.3, tone: 'blue' },
  { cx: 100, cy: 94.24, r: 7, tone: 'teal' },
  { cx: 121.6, cy: 117.12, r: 6.7, tone: 'teal' },
  { cx: 143.2, cy: 124.8, r: 6.4, tone: 'lteal' },
  { cx: 164.8, cy: 112.64, r: 6.1, tone: 'lteal' },
  { cx: 186.4, cy: 83.36, r: 5.8, tone: 'pteal' },
]

const BONDS = [0, 1, 4]
const BOND_WIDTH = 2.1

export function Concept29Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {BONDS.map((i) => (
        <line
          key={`b${i}`}
          x1={dots[i].cx}
          y1={dots[i].cy}
          x2={dots[i + 1].cx}
          y2={dots[i + 1].cy}
          stroke={TONE_FILL[dots[i].tone]}
          strokeWidth={BOND_WIDTH}
          opacity={TONE_OPACITY[dots[i].tone]}
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={TONE_FILL[d.tone]} opacity={TONE_OPACITY[d.tone]} />
      ))}
    </svg>
  )
}

export function Concept29Animated() {
  const step = 0.13
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {/* Bonds snap in only once both of their particles have settled. */}
      {BONDS.map((i) => (
        <motion.line
          key={`b${i}`}
          x1={dots[i].cx}
          y1={dots[i].cy}
          x2={dots[i + 1].cx}
          y2={dots[i + 1].cy}
          stroke={TONE_FILL[dots[i].tone]}
          strokeWidth={BOND_WIDTH}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: TONE_OPACITY[dots[i].tone] }}
          transition={{ duration: 0.3, delay: (i + 1) * step + 0.45 }}
        />
      ))}
      {/* The wave propagates left to right, each particle rising as the one
          before it settles. */}
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          r={d.r}
          fill={TONE_FILL[d.tone]}
          initial={{ cy: d.cy + 34, opacity: 0 }}
          animate={{ cy: d.cy, opacity: TONE_OPACITY[d.tone] }}
          transition={{ duration: 0.7, delay: i * step, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  )
}
