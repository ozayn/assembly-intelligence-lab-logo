'use client'

import { motion } from 'framer-motion'

// A single open contour differentiates into several asymmetric, unevenly
// spaced layers — ONE structure becoming ORGANIZED MANY, the reverse of the
// usual many-converge-to-one grammar used elsewhere in this project. No
// closed loops, no shared exact center — deliberately not concentric rings.

const CURVE_1 = 'M 40 155 Q 75 172 108 132 Q 138 95 172 58'
const CURVE_2 = 'M 50 145 Q 82 160 113 125 Q 140 92 176 56'
const CURVE_3 = 'M 65 150 Q 95 148 122 115 Q 148 85 175 62'
const CURVE_4 = 'M 90 138 Q 115 128 138 105 Q 158 82 178 68'

const CURVES = [
  { d: CURVE_1, role: 'primary' as const, opacity: 1, width: 5 },
  { d: CURVE_2, role: 'secondary' as const, opacity: 0.85, width: 4 },
  { d: CURVE_3, role: 'accent' as const, opacity: 0.75, width: 3.5 },
  { d: CURVE_4, role: 'primary' as const, opacity: 0.45, width: 3 },
]

function colorFor(role: 'primary' | 'secondary' | 'accent') {
  return `var(--logo-${role})`
}

export function Concept24Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {CURVES.map((c, i) => (
        <path
          key={i}
          d={c.d}
          stroke={colorFor(c.role)}
          strokeWidth={c.width}
          strokeLinecap="round"
          fill="none"
          opacity={c.opacity}
        />
      ))}
    </svg>
  )
}

export function Concept24Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <path d={CURVE_1} stroke={colorFor('primary')} strokeWidth={5} strokeLinecap="round" fill="none" />
      {CURVES.slice(1).map((c, i) => (
        <motion.path
          key={i}
          stroke={colorFor(c.role)}
          strokeWidth={c.width}
          strokeLinecap="round"
          fill="none"
          initial={{ d: CURVE_1, opacity: 0 }}
          animate={{ d: c.d, opacity: c.opacity }}
          transition={{
            duration: 1.2,
            delay: 0.35 + i * 0.25,
            ease: [0.34, 0.9, 0.4, 1],
          }}
        />
      ))}
    </svg>
  )
}
