'use client'

import { motion } from 'framer-motion'

// Three bold solid components whose narrow shared gaps trace one continuous
// channel of negative space. The silhouette must read as strong solid mass
// first; the channel rewards a second look.

const BLOCKS = [
  { x: 30, y: 27, w: 76, h: 76, rx: 16, role: 'primary' as const },
  { x: 115, y: 68, w: 60, h: 60, rx: 13, role: 'secondary' as const },
  { x: 138, y: 135, w: 40, h: 40, rx: 10, role: 'accent' as const },
]

// Shared collapse point used only by the animated version, roughly the
// mass-weighted center of the three final positions.
const ORIGIN = { x: 124, y: 106 }

function colorFor(role: 'primary' | 'secondary' | 'accent') {
  return `var(--logo-${role})`
}

export function Concept22Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {BLOCKS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.rx} fill={colorFor(b.role)} />
      ))}
    </svg>
  )
}

export function Concept22Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {BLOCKS.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={b.rx}
          fill={colorFor(b.role)}
          style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}
          initial={{ scale: 0.22, opacity: 0.65 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            delay: i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </svg>
  )
}
