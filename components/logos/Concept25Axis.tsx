'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, type Tone } from './referenceTones'

// Descendant of historical reference 01.
// Proportions are measured off the historical sheet: the chevron's width
// equals its height (26.6° half-angle), stroke is 0.070 of that height, the
// first particle sits at 0.706 of it, and particle radius is 0.081 of it.
// Refinement is the column itself: four evenly pitched dots become three on a
// pitch that tightens toward the apex, with the top one at crossbar height.
const CHEVRON = 'M51.55 134.9 L100 38 L148.45 134.9'
const STROKE = 6.76

const dots: { cy: number; r: number; tone: Tone }[] = [
  { cy: 106.41, r: 7.8, tone: 'navy' },
  { cy: 127.91, r: 7.5, tone: 'blue' },
  { cy: 152.41, r: 6.9, tone: 'teal' },
]

export function Concept25Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <path
        d={CHEVRON}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={100} cy={d.cy} r={d.r} fill={TONE_FILL[d.tone]} opacity={TONE_OPACITY[d.tone]} />
      ))}
    </svg>
  )
}

export function Concept25Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {/* pathOffset tracking pathLength keeps the visible run centred on the
          middle of the path, so the chevron grows outward from its apex. */}
      <motion.path
        d={CHEVRON}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={100}
          r={d.r}
          fill={TONE_FILL[d.tone]}
          initial={{ cy: d.cy + 56, opacity: 0 }}
          animate={{ cy: d.cy, opacity: TONE_OPACITY[d.tone] }}
          transition={{
            duration: 0.85,
            delay: i * 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </svg>
  )
}
