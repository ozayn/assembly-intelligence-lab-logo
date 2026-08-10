'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept05Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Arc convergence: particles in curved arrangement */}
      {/* Upper arc: 4 particles */}
      <circle cx={centerX - 25} cy={centerY - 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX} cy={centerY - 30} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 25} cy={centerY - 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 30} cy={centerY} r="8" fill="var(--logo-primary)" />

      {/* Lower arc: 3 particles */}
      <circle cx={centerX + 20} cy={centerY + 25} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX} cy={centerY + 28} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX - 20} cy={centerY + 25} r="8" fill="var(--logo-accent)" opacity="0.85" />

      {/* Center anchor */}
      <circle cx={centerX} cy={centerY} r="5" fill="var(--logo-primary)" opacity="0.6" />
    </svg>
  )
}

export function Concept05Animated() {
  const upperArc = [
    { startX: 60, startY: 40, finalX: centerX - 25, finalY: centerY - 20 },
    { startX: 100, startY: 30, finalX: centerX, finalY: centerY - 30 },
    { startX: 140, startY: 40, finalX: centerX + 25, finalY: centerY - 20 },
    { startX: 160, startY: 90, finalX: centerX + 30, finalY: centerY },
  ]

  const lowerArc = [
    { startX: 140, startY: 150, finalX: centerX + 20, finalY: centerY + 25 },
    { startX: 100, startY: 160, finalX: centerX, finalY: centerY + 28 },
    { startX: 60, startY: 150, finalX: centerX - 20, finalY: centerY + 25 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Upper arc animates */}
      {upperArc.map((p, i) => (
        <motion.circle
          key={`upper-${i}`}
          cx={p.startX}
          cy={p.startY}
          r="8"
          fill="var(--logo-primary)"
          animate={{ cx: p.finalX, cy: p.finalY }}
          transition={{ duration: 2.3, ease: 'easeInOut', delay: i * 0.1 }}
        />
      ))}

      {/* Lower arc animates */}
      {lowerArc.map((p, i) => (
        <motion.circle
          key={`lower-${i}`}
          cx={p.startX}
          cy={p.startY}
          r="8"
          fill="var(--logo-accent)"
          opacity="0.85"
          animate={{ cx: p.finalX, cy: p.finalY }}
          transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.5 + i * 0.12 }}
        />
      ))}

      {/* Center anchor */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="5"
        fill="var(--logo-primary)"
        opacity="0.6"
      />
    </svg>
  )
}
