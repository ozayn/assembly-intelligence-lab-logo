'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept04Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Inner ring: 3 small particles */}
      <circle cx={centerX} cy={centerY - 12} r="6" fill="var(--logo-primary)" />
      <circle cx={centerX + 10} cy={centerY + 6} r="6" fill="var(--logo-primary)" />
      <circle cx={centerX - 10} cy={centerY + 6} r="6" fill="var(--logo-primary)" />

      {/* Middle ring: 4 medium particles */}
      <circle cx={centerX + 18} cy={centerY - 10} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX + 15} cy={centerY + 18} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 15} cy={centerY + 18} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 18} cy={centerY - 10} r="7" fill="var(--logo-primary)" />

      {/* Outer accent: 2 larger particles with teal */}
      <circle cx={centerX + 28} cy={centerY + 2} r="7" fill="var(--logo-accent)" opacity="0.8" />
      <circle cx={centerX - 28} cy={centerY + 2} r="7" fill="var(--logo-accent)" opacity="0.8" />
    </svg>
  )
}

export function Concept04Animated() {
  const innerRing = [
    { startX: 100, startY: 50, finalX: centerX, finalY: centerY - 12 },
    { startX: 130, startY: 110, finalX: centerX + 10, finalY: centerY + 6 },
    { startX: 70, startY: 110, finalX: centerX - 10, finalY: centerY + 6 },
  ]

  const middleRing = [
    { startX: 140, startY: 60, finalX: centerX + 18, finalY: centerY - 10 },
    { startX: 130, startY: 140, finalX: centerX + 15, finalY: centerY + 18 },
    { startX: 70, startY: 140, finalX: centerX - 15, finalY: centerY + 18 },
    { startX: 60, startY: 60, finalX: centerX - 18, finalY: centerY - 10 },
  ]

  const outerRing = [
    { startX: 160, startY: 100, finalX: centerX + 28, finalY: centerY + 2 },
    { startX: 40, startY: 100, finalX: centerX - 28, finalY: centerY + 2 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Inner ring animates first */}
      {innerRing.map((p, i) => (
        <motion.circle
          key={`inner-${i}`}
          cx={p.startX}
          cy={p.startY}
          r="6"
          fill="var(--logo-primary)"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.0,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Middle ring follows */}
      {middleRing.map((p, i) => (
        <motion.circle
          key={`mid-${i}`}
          cx={p.startX}
          cy={p.startY}
          r="7"
          fill="var(--logo-primary)"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.0,
            ease: 'easeInOut',
            delay: 0.4 + i * 0.12,
          }}
        />
      ))}

      {/* Outer ring with teal accent comes last */}
      {outerRing.map((p, i) => (
        <motion.circle
          key={`outer-${i}`}
          cx={p.startX}
          cy={p.startY}
          r="7"
          fill="var(--logo-accent)"
          opacity="0.8"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.0,
            ease: 'easeInOut',
            delay: 0.8 + i * 0.15,
          }}
        />
      ))}
    </svg>
  )
}
