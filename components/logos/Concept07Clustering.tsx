'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept07Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="95" cy="75" r="5" fill="var(--logo-primary)" />
      <circle cx="105" cy="75" r="5" fill="var(--logo-primary)" />
      <circle cx="90" cy="90" r="5" fill="var(--logo-primary)" />
      <circle cx="110" cy="90" r="5" fill="var(--logo-primary)" />
      <circle cx="100" cy="105" r="5" fill="var(--logo-primary)" />
      <circle cx="85" cy="105" r="5" fill="var(--logo-primary)" />
      <circle cx="115" cy="105" r="5" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept07Animated() {
  const positions = [
    { start: [30, 40], end: [95, 75] },
    { start: [170, 35], end: [105, 75] },
    { start: [20, 100], end: [90, 90] },
    { start: [180, 110], end: [110, 90] },
    { start: [60, 160], end: [100, 105] },
    { start: [140, 170], end: [85, 105] },
    { start: [100, 20], end: [115, 105] },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {positions.map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.start[0]}
          cy={pos.start[1]}
          r="5"
          fill="var(--logo-primary)"
          animate={{
            cx: pos.end[0],
            cy: pos.end[1],
          }}
          transition={{
            duration: 2.8,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </svg>
  )
}
