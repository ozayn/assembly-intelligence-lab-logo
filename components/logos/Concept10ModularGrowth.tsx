'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept10Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Orbital structure: nested orbits */}
      {/* Core */}
      <circle cx={centerX} cy={centerY} r="5" fill="var(--logo-accent)" />

      {/* Inner orbit: 3 particles */}
      <circle cx={centerX + 18} cy={centerY} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 9} cy={centerY + 16} r="7" fill="var(--logo-primary)" />
      <circle cx={centerX - 9} cy={centerY - 16} r="7" fill="var(--logo-primary)" />

      {/* Outer orbit: 3 particles */}
      <circle cx={centerX + 28} cy={centerY + 15} r="7" fill="var(--logo-accent)" opacity="0.8" />
      <circle cx={centerX - 18} cy={centerY - 22} r="7" fill="var(--logo-accent)" opacity="0.8" />
      <circle cx={centerX + 2} cy={centerY + 28} r="7" fill="var(--logo-accent)" opacity="0.8" />
    </svg>
  )
}

export function Concept10Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Core */}
      <circle cx={centerX} cy={centerY} r="5" fill="var(--logo-accent)" />

      {/* Inner orbit assembles */}
      <motion.circle cx={140} cy={100} r="7" fill="var(--logo-primary)" animate={{ cx: centerX + 18, cy: centerY }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.2 }} />
      <motion.circle cx={70} cy={140} r="7" fill="var(--logo-primary)" animate={{ cx: centerX - 9, cy: centerY + 16 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.35 }} />
      <motion.circle cx={70} cy={60} r="7" fill="var(--logo-primary)" animate={{ cx: centerX - 9, cy: centerY - 16 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.5 }} />

      {/* Outer orbit follows */}
      <motion.circle cx={160} cy={140} r="7" fill="var(--logo-accent)" opacity="0.8" animate={{ cx: centerX + 28, cy: centerY + 15 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.7 }} />
      <motion.circle cx={50} cy={40} r="7" fill="var(--logo-accent)" opacity="0.8" animate={{ cx: centerX - 18, cy: centerY - 22 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.85 }} />
      <motion.circle cx={100} cy={160} r="7" fill="var(--logo-accent)" opacity="0.8" animate={{ cx: centerX + 2, cy: centerY + 28 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 1 }} />
    </svg>
  )
}
