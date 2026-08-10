'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept03Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Spiral arrangement: particles moving inward along curved path */}
      {/* Outermost: 3 particles */}
      <circle cx={centerX + 35} cy={centerY - 15} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 5} cy={centerY - 38} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 35} cy={centerY + 5} r="8" fill="var(--logo-primary)" />

      {/* Middle: 3 particles closer to center */}
      <circle cx={centerX + 18} cy={centerY + 8} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 8} cy={centerY + 20} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 12} cy={centerY - 15} r="7" fill="var(--logo-primary)" />

      {/* Core: 1 central accent */}
      <circle cx={centerX} cy={centerY} r="5" fill="var(--logo-accent)" opacity="0.85" />

      {/* Curved path hint (very subtle line) */}
      <path
        d={`M ${centerX + 35} ${centerY - 15} Q ${centerX + 28} ${centerY + 5} ${centerX + 18} ${centerY + 8} T ${centerX} ${centerY}`}
        stroke="var(--logo-accent)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}

export function Concept03Animated() {
  const spiral = [
    { startX: 150, startY: 30, finalX: centerX + 35, finalY: centerY - 15 },
    { startX: 100, startY: 20, finalX: centerX - 5, finalY: centerY - 38 },
    { startX: 40, startY: 80, finalX: centerX - 35, finalY: centerY + 5 },
    { startX: 120, startY: 120, finalX: centerX + 18, finalY: centerY + 8 },
    { startX: 70, startY: 140, finalX: centerX - 8, finalY: centerY + 20 },
    { startX: 60, startY: 60, finalX: centerX - 12, finalY: centerY - 15 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Particles spiral inward */}
      {spiral.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.startX}
          cy={p.startY}
          r={i < 3 ? 8 : 7}
          fill="var(--logo-primary)"
          animate={{
            cx: p.finalX,
            cy: p.finalY,
          }}
          transition={{
            duration: 2.6,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Core accent appears */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="5"
        fill="var(--logo-accent)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.5, delay: 2.0 }}
      />

      {/* Path line fades in subtly */}
      <motion.path
        d={`M ${centerX + 35} ${centerY - 15} Q ${centerX + 28} ${centerY + 5} ${centerX + 18} ${centerY + 8} T ${centerX} ${centerY}`}
        stroke="var(--logo-accent)"
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      />
    </svg>
  )
}
