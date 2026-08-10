'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept07Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Clustered nodes: tight core with one approaching */}
      <circle cx={centerX - 10} cy={centerY - 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 8} cy={centerY - 8} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 6} cy={centerY + 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 10} cy={centerY + 8} r="8" fill="var(--logo-primary)" />

      {/* Joining particle */}
      <circle cx={centerX + 28} cy={centerY - 15} r="8" fill="var(--logo-accent)" opacity="0.9" />

      {/* Center highlight */}
      <circle cx={centerX} cy={centerY} r="4" fill="var(--logo-accent)" opacity="0.6" />
    </svg>
  )
}

export function Concept07Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Core cluster assembles first */}
      <motion.circle cx={60} cy={80} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 10, cy: centerY - 10 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={140} cy={70} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 8, cy: centerY - 8 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.1 }} />
      <motion.circle cx={70} cy={130} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 6, cy: centerY + 10 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }} />
      <motion.circle cx={130} cy={120} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 10, cy: centerY + 8 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.3 }} />

      {/* Joining particle approaches */}
      <motion.circle cx={160} cy={50} r="8" fill="var(--logo-accent)" opacity="0.9" animate={{ cx: centerX + 28, cy: centerY - 15 }} transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.4 }} />

      {/* Center highlight */}
      <motion.circle cx={centerX} cy={centerY} r="4" fill="var(--logo-accent)" opacity="0.6" />
    </svg>
  )
}
