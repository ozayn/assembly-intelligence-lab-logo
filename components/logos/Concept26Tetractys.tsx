'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, TONE_ORDER } from './referenceTones'

// Descendant of historical reference 11, kept at the parent's full density.
// Measured off the sheet: five rows of 1/2/3/4/5, horizontal pitch 17.6 and
// row pitch 15.55 (a lattice slightly taller than equilateral), radius
// tapering about 5% per row, lattice centred on the vertical axis.
// Everything here is calibration — drift removed, baseline trued, the off-tone
// slate particle in row 4 brought back onto the ramp — not reduction.
const SCALE = 1.76
const H_PITCH = 17.6 * SCALE
const ROW_PITCH = 15.55 * SCALE
const APEX_Y = 40
const R0 = 5.55 * SCALE
const TAPER = 0.95
const ROWS = 5

type Dot = { cx: number; cy: number; r: number; row: number; col: number }

const dots: Dot[] = Array.from({ length: ROWS }).flatMap((_, row) => {
  const count = row + 1
  const cy = APEX_Y + row * ROW_PITCH
  const r = R0 * TAPER ** row
  return Array.from({ length: count }).map((_, col) => ({
    cx: 100 + (col - (count - 1) / 2) * H_PITCH,
    cy,
    r,
    row,
    col,
  }))
})

const toneFor = (row: number) => TONE_ORDER[row]

export function Concept26Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={TONE_FILL[toneFor(d.row)]}
          opacity={TONE_OPACITY[toneFor(d.row)]}
        />
      ))}
    </svg>
  )
}

export function Concept26Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => {
        const tone = toneFor(d.row)
        // Rows seat from the base upward: the structure consolidates toward
        // the apex, so fifteen particles read as five deliberate events.
        const delay = (ROWS - 1 - d.row) * 0.3 + d.col * 0.06
        return (
          <motion.circle
            key={i}
            cx={d.cx}
            r={d.r}
            fill={TONE_FILL[tone]}
            initial={{ cy: d.cy + 26, opacity: 0 }}
            animate={{ cy: d.cy, opacity: TONE_OPACITY[tone] }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}
    </svg>
  )
}
