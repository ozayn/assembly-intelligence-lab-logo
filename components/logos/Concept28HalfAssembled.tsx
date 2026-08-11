'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, type Tone } from './referenceTones'

// Second descendant of historical reference 01: the same chevron envelope and
// the same axial column, but the right leg is built from discrete units
// instead of drawn. Unit diameter stays close to the drawn leg's stroke width
// so both legs carry equal weight and the chevron still reads as one
// silhouette; a unit sits on the apex so the drawn and built legs meet at a
// real joint. The axial particles are the heaviest in the mark, keeping
// reference 01's axis as the primary event.
const APEX = { x: 100, y: 34 }
const LEG_END_Y = 121.72
const LEFT_X = 56.14
const RIGHT_X = 143.86
const STROKE = 6.12

const LEFT_LEG = `M${APEX.x} ${APEX.y} L${LEFT_X} ${LEG_END_Y}`

type Dot = { cx: number; cy: number; r: number; tone: Tone }

const apexDot: Dot = { cx: APEX.x, cy: APEX.y, r: 4.9, tone: 'navy' }

const legTones: Tone[] = ['navy', 'navy', 'navy', 'blue', 'blue', 'teal', 'teal', 'teal']
const legDots: Dot[] = legTones.map((tone, i) => {
  const t = 0.155 + (1 - 0.155) * (i / (legTones.length - 1))
  return {
    cx: APEX.x + (RIGHT_X - APEX.x) * t,
    cy: APEX.y + (LEG_END_Y - APEX.y) * t,
    r: 4.55 - 0.06 * i,
    tone,
  }
})

const axialDots: Dot[] = [
  { cx: 100, cy: LEG_END_Y + 13, r: 6.4, tone: 'teal' },
  { cx: 100, cy: LEG_END_Y + 31.5, r: 5.7, tone: 'lteal' },
]

function Dots({ dots }: { dots: Dot[] }) {
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={TONE_FILL[d.tone]} opacity={TONE_OPACITY[d.tone]} />
      ))}
    </>
  )
}

export function Concept28Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <path d={LEFT_LEG} fill="none" stroke="var(--logo-primary)" strokeWidth={STROKE} strokeLinecap="butt" />
      <Dots dots={[apexDot, ...legDots, ...axialDots]} />
    </svg>
  )
}

export function Concept28Animated() {
  const LEG_START = 0.55
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {/* The finished edge draws first, from the apex downward. */}
      <motion.path
        d={LEFT_LEG}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinecap="butt"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx={apexDot.cx}
        cy={apexDot.cy}
        fill={TONE_FILL[apexDot.tone]}
        initial={{ r: apexDot.r * 0.3, opacity: 0 }}
        animate={{ r: apexDot.r, opacity: TONE_OPACITY[apexDot.tone] }}
        transition={{ duration: 0.4, delay: LEG_START - 0.15, ease: [0.34, 1.4, 0.64, 1] }}
      />
      {/* Then the drawn edge recruits units down the other leg, one at a time. */}
      {legDots.map((d, i) => (
        <motion.circle
          key={i}
          cy={d.cy}
          r={d.r}
          fill={TONE_FILL[d.tone]}
          initial={{ cx: d.cx + 22, opacity: 0 }}
          animate={{ cx: d.cx, opacity: TONE_OPACITY[d.tone] }}
          transition={{ duration: 0.55, delay: LEG_START + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {axialDots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          r={d.r}
          fill={TONE_FILL[d.tone]}
          initial={{ cy: d.cy + 46, opacity: 0 }}
          animate={{ cy: d.cy, opacity: TONE_OPACITY[d.tone] }}
          transition={{
            duration: 0.8,
            delay: LEG_START + legDots.length * 0.09 + i * 0.14,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </svg>
  )
}
