'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, TONE_ORDER, type Tone } from './referenceTones'

// Descendant of historical reference 24, transcribed from the sheet rather
// than approximated: every particle position is the parent's own, scaled into
// the 200 box. Cleanup only — the JPEG specks and the stray comma-shaped
// stroke are gone, touching pairs are separated to a legible edge gap, radii
// are quantised to four steps, and the tonal sweep is read off the ring's
// geometry so it no longer inherits the parent's few stray off-tone dots.
// The two interacting flows, the asymmetry and the off-centre porous void are
// the parent's, untouched.
type Particle = { cx: number; cy: number; r: number; tone: Tone }

const particles: Particle[] = [
  { cx: 95.4, cy: 26, r: 3.2, tone: 'navy' },
  { cx: 113.5, cy: 29.7, r: 5.7, tone: 'navy' },
  { cx: 74.2, cy: 31.4, r: 5.7, tone: 'navy' },
  { cx: 89.2, cy: 38.8, r: 4.5, tone: 'navy' },
  { cx: 102.3, cy: 48.7, r: 4.5, tone: 'navy' },
  { cx: 115.1, cy: 48.7, r: 4.5, tone: 'navy' },
  { cx: 125, cy: 42.3, r: 3.2, tone: 'navy' },
  { cx: 136.8, cy: 42.3, r: 3.2, tone: 'teal' },
  { cx: 153.7, cy: 49.7, r: 5.7, tone: 'teal' },
  { cx: 51, cy: 56.1, r: 5.7, tone: 'navy' },
  { cx: 70.5, cy: 59.1, r: 5.7, tone: 'navy' },
  { cx: 85.5, cy: 59.1, r: 5.7, tone: 'navy' },
  { cx: 103.8, cy: 61.3, r: 4.5, tone: 'navy' },
  { cx: 131.1, cy: 60.8, r: 4.5, tone: 'teal' },
  { cx: 142.9, cy: 60.8, r: 4.5, tone: 'teal' },
  { cx: 34.9, cy: 65.7, r: 6.9, tone: 'navy' },
  { cx: 118.7, cy: 67.6, r: 4.5, tone: 'teal' },
  { cx: 158.7, cy: 67.6, r: 5.7, tone: 'teal' },
  { cx: 77, cy: 73.1, r: 3.2, tone: 'navy' },
  { cx: 134.8, cy: 80.2, r: 6.9, tone: 'teal' },
  { cx: 65.5, cy: 80.7, r: 6.9, tone: 'navy' },
  { cx: 48.4, cy: 85.7, r: 5.7, tone: 'navy' },
  { cx: 157.4, cy: 85, r: 4.5, tone: 'teal' },
  { cx: 172, cy: 94.7, r: 5.7, tone: 'lteal' },
  { cx: 33.6, cy: 99.8, r: 6.9, tone: 'navy' },
  { cx: 146.6, cy: 95.6, r: 3.2, tone: 'teal' },
  { cx: 61.3, cy: 105.6, r: 5.7, tone: 'navy' },
  { cx: 137.8, cy: 105.6, r: 4.5, tone: 'lteal' },
  { cx: 152.6, cy: 105.8, r: 4.5, tone: 'lteal' },
  { cx: 28, cy: 119, r: 6.9, tone: 'navy' },
  { cx: 171.7, cy: 116.3, r: 3.2, tone: 'pteal' },
  { cx: 131.3, cy: 117, r: 3.2, tone: 'lteal' },
  { cx: 52.7, cy: 122, r: 5.7, tone: 'navy' },
  { cx: 155.4, cy: 120.3, r: 4.5, tone: 'lteal' },
  { cx: 74.8, cy: 128.7, r: 5.7, tone: 'blue' },
  { cx: 123.4, cy: 130, r: 4.5, tone: 'pteal' },
  { cx: 140, cy: 128.8, r: 4.5, tone: 'pteal' },
  { cx: 98.1, cy: 139.2, r: 5.7, tone: 'blue' },
  { cx: 51.5, cy: 141.4, r: 5.7, tone: 'navy' },
  { cx: 111.3, cy: 137.5, r: 3.2, tone: 'blue' },
  { cx: 77.6, cy: 145.7, r: 5.7, tone: 'blue' },
  { cx: 155.5, cy: 148.5, r: 4.5, tone: 'pteal' },
  { cx: 114.5, cy: 150.5, r: 4.5, tone: 'blue' },
  { cx: 133.4, cy: 155.2, r: 4.5, tone: 'pteal' },
  { cx: 58.7, cy: 161.3, r: 5.7, tone: 'blue' },
  { cx: 87.8, cy: 161.1, r: 5.7, tone: 'blue' },
  { cx: 104.7, cy: 171.7, r: 5.7, tone: 'blue' },
  { cx: 83.2, cy: 174, r: 3.2, tone: 'blue' },
]

// Centre of the transcribed field — particles drift in from outside along the
// radius through this point.
const FIELD_CX = 105.1
const FIELD_CY = 95.7

// The dense dark flow consolidates first, the teal flow interleaves with it,
// and the pale periphery is still arriving as the motion settles.
const seatOrder = new Map<Particle, number>()
TONE_ORDER.forEach((tone, group) => {
  particles
    .filter((p) => p.tone === tone)
    .forEach((p, i) => seatOrder.set(p, group * 0.4 + i * 0.045))
})

export function Concept27Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {particles.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={TONE_FILL[p.tone]} opacity={TONE_OPACITY[p.tone]} />
      ))}
    </svg>
  )
}

export function Concept27Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {particles.map((p, i) => {
        const dx = p.cx - FIELD_CX
        const dy = p.cy - FIELD_CY
        const d = Math.hypot(dx, dy) || 1
        const drift = 58
        return (
          <motion.circle
            key={i}
            r={p.r}
            fill={TONE_FILL[p.tone]}
            initial={{ cx: p.cx + (dx / d) * drift, cy: p.cy + (dy / d) * drift, opacity: 0 }}
            animate={{ cx: p.cx, cy: p.cy, opacity: TONE_OPACITY[p.tone] }}
            transition={{
              duration: 0.95,
              delay: seatOrder.get(p) ?? 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        )
      })}
    </svg>
  )
}
