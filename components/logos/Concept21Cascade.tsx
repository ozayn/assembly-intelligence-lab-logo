'use client'

import { motion } from 'framer-motion'

// Substantial ticks along an authored, bent (non-circular) trajectory. Each
// tick's rotation and tone shift from the last — a rule propagating along a
// chain, not a spinner segment. No amplitude modulation (no waveform read),
// no full/near-full circular arc (no gauge/Wi-Fi read).

interface Tick {
  x: number
  y: number
  baseAngle: number
  role: 'primary' | 'secondary' | 'accent'
}

const TICKS: Tick[] = [
  { x: 45, y: 150, baseAngle: -35, role: 'primary' },
  { x: 62, y: 136, baseAngle: -35, role: 'primary' },
  { x: 79, y: 124, baseAngle: -35, role: 'secondary' },
  { x: 97, y: 118, baseAngle: -14, role: 'secondary' },
  { x: 115, y: 113, baseAngle: -14, role: 'secondary' },
  { x: 133, y: 102, baseAngle: -49, role: 'accent' },
  { x: 150, y: 85, baseAngle: -49, role: 'accent' },
  { x: 166, y: 64, baseAngle: -49, role: 'accent' },
]

const CASCADE_STEP = 18
const TICK_W = 17
const TICK_H = 7

function colorFor(role: Tick['role']) {
  return `var(--logo-${role})`
}

export function Concept21Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {TICKS.map((t, i) => {
        const rotation = t.baseAngle + i * CASCADE_STEP
        return (
          <rect
            key={i}
            x={t.x - TICK_W / 2}
            y={t.y - TICK_H / 2}
            width={TICK_W}
            height={TICK_H}
            rx={TICK_H / 2}
            fill={colorFor(t.role)}
            transform={`rotate(${rotation} ${t.x} ${t.y})`}
          />
        )
      })}
    </svg>
  )
}

export function Concept21Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {TICKS.map((t, i) => {
        const finalRotation = t.baseAngle + i * CASCADE_STEP
        return (
          <motion.rect
            key={i}
            x={t.x - TICK_W / 2}
            y={t.y - TICK_H / 2}
            width={TICK_W}
            height={TICK_H}
            rx={TICK_H / 2}
            fill={colorFor(t.role)}
            style={{ transformOrigin: `${t.x}px ${t.y}px` }}
            initial={{ rotate: t.baseAngle, opacity: 0, scale: 0.5 }}
            animate={{ rotate: finalRotation, opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: i * 0.16,
              ease: [0.34, 1.3, 0.64, 1],
            }}
          />
        )
      })}
    </svg>
  )
}
