'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept11Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="85" cy="85" r="7" fill="var(--logo-primary)" />
      <circle cx="100" cy="70" r="7" fill="var(--logo-primary)" />
      <circle cx="115" cy="85" r="7" fill="var(--logo-primary)" />
      <circle cx="100" cy="110" r="7" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept11Animated() {
  const configs = [
    { x: 85, y: 85 },
    { x: 100, y: 70 },
    { x: 115, y: 85 },
    { x: 100, y: 110 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {configs.map((config, i) => (
        <motion.circle
          key={i}
          cx={config.x}
          cy={config.y}
          r="7"
          fill="var(--logo-primary)"
          initial={{
            cx: 100,
            cy: 60,
            opacity: 0,
          }}
          animate={{
            cx: [50 + i * 20, 100, config.x],
            cy: [60, 100, config.y],
            opacity: 1,
          }}
          transition={{
            duration: 2.8,
            ease: 'easeInOut',
            delay: i * 0.15,
            times: [0, 0.6, 1],
          }}
        />
      ))}
    </svg>
  )
}
