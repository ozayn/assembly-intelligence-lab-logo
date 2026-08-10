'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept11Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Asymmetric fold: particles organizing around axis */}
      <circle cx={centerX - 20} cy={centerY - 18} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 15} cy={centerY + 10} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 10} cy={centerY - 8} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 22} cy={centerY + 20} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX + 8} cy={centerY + 15} r="6" fill="var(--logo-primary)" opacity="0.6" />
    </svg>
  )
}

export function Concept11Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.circle cx={50} cy={60} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 20, cy: centerY - 18 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={60} cy={130} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 15, cy: centerY + 10 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.15 }} />
      <motion.circle cx={120} cy={80} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 10, cy: centerY - 8 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.3 }} />
      <motion.circle cx={150} cy={150} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX + 22, cy: centerY + 20 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.45 }} />
      <motion.circle cx={100} cy={110} r="6" fill="var(--logo-primary)" opacity="0.6" animate={{ cx: centerX + 8, cy: centerY + 15 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.25 }} />
    </svg>
  )
}
