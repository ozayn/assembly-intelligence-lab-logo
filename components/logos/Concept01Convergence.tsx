'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2
const radius = 35

export function Concept01Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={centerX - 20} cy={centerY - 15} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 20} cy={centerY - 15} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX} cy={centerY + 25} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 15} cy={centerY} r="6" fill="var(--logo-primary)" />
      <circle cx={centerX + 15} cy={centerY} r="6" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept01Animated() {
  const particles = [
    { id: 1, startX: 30, startY: 40, finalX: centerX - 20, finalY: centerY - 15 },
    { id: 2, startX: 170, startY: 50, finalX: centerX + 20, finalY: centerY - 15 },
    { id: 3, startX: 100, startY: 20, finalX: centerX, finalY: centerY + 25 },
    { id: 4, startX: 50, startY: 130, finalX: centerX - 15, finalY: centerY },
    { id: 5, startX: 150, startY: 140, finalX: centerX + 15, finalY: centerY },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {particles.map((particle, i) => (
        <motion.circle
          key={particle.id}
          cx={particle.startX}
          cy={particle.startY}
          r={particle.id <= 3 ? 8 : 6}
          fill="var(--logo-primary)"
          animate={{
            cx: particle.finalX,
            cy: particle.finalY,
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </svg>
  )
}
