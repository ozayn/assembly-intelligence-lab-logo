'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept02Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Left crescent: 4 particles */}
      <circle cx={centerX - 22} cy={centerY - 12} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 20} cy={centerY + 5} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 8} cy={centerY + 18} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 2} cy={centerY + 8} r="7" fill="var(--logo-primary)" />

      {/* Right crescent: 4 particles */}
      <circle cx={centerX + 22} cy={centerY - 12} r="8" fill="var(--logo-accent)" opacity="0.9" />
      <circle cx={centerX + 20} cy={centerY + 5} r="8" fill="var(--logo-accent)" opacity="0.9" />
      <circle cx={centerX + 8} cy={centerY + 18} r="8" fill="var(--logo-accent)" opacity="0.9" />
      <circle cx={centerX + 2} cy={centerY + 8} r="7" fill="var(--logo-accent)" opacity="0.7" />
    </svg>
  )
}

export function Concept02Animated() {
  const leftCrescent = [
    { startX: 50, startY: 40, finalX: centerX - 22, finalY: centerY - 12 },
    { startX: 45, startY: 90, finalX: centerX - 20, finalY: centerY + 5 },
    { startX: 60, startY: 140, finalX: centerX - 8, finalY: centerY + 18 },
    { startX: 70, startY: 120, finalX: centerX - 2, finalY: centerY + 8 },
  ]

  const rightCrescent = [
    { startX: 150, startY: 40, finalX: centerX + 22, finalY: centerY - 12 },
    { startX: 155, startY: 90, finalX: centerX + 20, finalY: centerY + 5 },
    { startX: 140, startY: 140, finalX: centerX + 8, finalY: centerY + 18 },
    { startX: 130, startY: 120, finalX: centerX + 2, finalY: centerY + 8 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Left crescent animates in */}
      {leftCrescent.map((p, i) => (
        <motion.circle
          key={`left-${i}`}
          cx={p.startX}
          cy={p.startY}
          r={i === 3 ? 7 : 8}
          fill="var(--logo-primary)"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.4,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}

      {/* Right crescent animates in with teal accent */}
      {rightCrescent.map((p, i) => (
        <motion.circle
          key={`right-${i}`}
          cx={p.startX}
          cy={p.startY}
          r={i === 3 ? 7 : 8}
          fill="var(--logo-accent)"
          opacity={i === 3 ? 0.7 : 0.9}
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.4,
            ease: 'easeInOut',
            delay: 0.3 + i * 0.12,
          }}
        />
      ))}
    </svg>
  )
}
