'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept03Static() {
  const dots = [
    { x: 70, y: 60 },
    { x: 100, y: 50 },
    { x: 130, y: 60 },
    { x: 75, y: 85 },
    { x: 125, y: 85 },
    { x: 85, y: 110 },
    { x: 115, y: 110 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="5" fill="var(--logo-primary)" />
      ))}
    </svg>
  )
}

export function Concept03Animated() {
  const dots = [
    { x: 70, y: 60, sx: 30, sy: 50 },
    { x: 100, y: 50, sx: 100, sy: 20 },
    { x: 130, y: 60, sx: 170, sy: 40 },
    { x: 75, y: 85, sx: 50, sy: 110 },
    { x: 125, y: 85, sx: 150, sy: 100 },
    { x: 85, y: 110, sx: 45, sy: 150 },
    { x: 115, y: 110, sx: 155, sy: 160 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {dots.map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.sx}
          cy={dot.sy}
          r="5"
          fill="var(--logo-primary)"
          animate={{
            cx: dot.x,
            cy: dot.y,
          }}
          transition={{
            duration: 2.8,
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
        />
      ))}
    </svg>
  )
}
