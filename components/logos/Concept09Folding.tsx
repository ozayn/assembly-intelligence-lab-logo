'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept09Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Cascading steps: particles at different heights */}
      <circle cx={centerX - 28} cy={centerY - 15} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 12} cy={centerY} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 8} cy={centerY + 15} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 24} cy={centerY + 5} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX} cy={centerY - 8} r="6" fill="var(--logo-accent)" opacity="0.7" />
    </svg>
  )
}

export function Concept09Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.circle cx={40} cy={60} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 28, cy: centerY - 15 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={70} cy={100} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 12, cy: centerY }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.15 }} />
      <motion.circle cx={120} cy={140} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 8, cy: centerY + 15 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.3 }} />
      <motion.circle cx={150} cy={120} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX + 24, cy: centerY + 5 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.45 }} />
      <motion.circle cx={80} cy={60} r="6" fill="var(--logo-accent)" opacity="0.7" animate={{ cx: centerX, cy: centerY - 8 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }} />
    </svg>
  )
}
