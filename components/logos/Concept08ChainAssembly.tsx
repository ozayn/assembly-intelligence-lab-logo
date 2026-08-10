'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept08Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Radial bloom: particles around central core */}
      <circle cx={centerX} cy={centerY - 28} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 24} cy={centerY - 14} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 24} cy={centerY + 14} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX} cy={centerY + 28} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 24} cy={centerY + 14} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX - 24} cy={centerY - 14} r="8" fill="var(--logo-accent)" opacity="0.85" />

      {/* Core */}
      <circle cx={centerX} cy={centerY} r="6" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept08Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.circle cx={100} cy={40} r="8" fill="var(--logo-primary)" animate={{ cx: centerX, cy: centerY - 28 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={150} cy={80} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 24, cy: centerY - 14 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.12 }} />
      <motion.circle cx={150} cy={120} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 24, cy: centerY + 14 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.24 }} />
      <motion.circle cx={100} cy={160} r="8" fill="var(--logo-primary)" animate={{ cx: centerX, cy: centerY + 28 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.36 }} />
      <motion.circle cx={50} cy={120} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 24, cy: centerY + 14 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.48 }} />
      <motion.circle cx={50} cy={80} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 24, cy: centerY - 14 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.6 }} />

      <motion.circle cx={centerX} cy={centerY} r="6" fill="var(--logo-primary)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} />
    </svg>
  )
}
