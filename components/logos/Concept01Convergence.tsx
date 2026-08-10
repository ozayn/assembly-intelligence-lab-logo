'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept01Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Central cluster: 6 particles forming hexagon */}
      <circle cx={centerX} cy={centerY - 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 17} cy={centerY - 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 17} cy={centerY + 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX} cy={centerY + 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 17} cy={centerY + 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 17} cy={centerY - 10} r="8" fill="var(--logo-primary)" />

      {/* Center accent dot */}
      <circle cx={centerX} cy={centerY} r="4" fill="var(--logo-accent)" opacity="0.8" />
    </svg>
  )
}

export function Concept01Animated() {
  const particles = [
    { id: 0, startX: 60, startY: 50, finalX: centerX, finalY: centerY - 20 },
    { id: 1, startX: 140, startY: 60, finalX: centerX + 17, finalY: centerY - 10 },
    { id: 2, startX: 150, startY: 140, finalX: centerX + 17, finalY: centerY + 10 },
    { id: 3, startX: 100, startY: 160, finalX: centerX, finalY: centerY + 20 },
    { id: 4, startX: 50, startY: 140, finalX: centerX - 17, finalY: centerY + 10 },
    { id: 5, startX: 40, startY: 60, finalX: centerX - 17, finalY: centerY - 10 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Animated particles */}
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.startX}
          cy={p.startY}
          r="8"
          fill="var(--logo-primary)"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.4,
            ease: 'easeInOut',
            delay: p.id * 0.08,
          }}
        />
      ))}

      {/* Center accent dot fades in */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="4"
        fill="var(--logo-accent)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.4, delay: 1.8 }}
      />
    </svg>
  )
}
