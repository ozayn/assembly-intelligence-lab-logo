'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept06Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Twin spiral arrangement: two interlocking patterns */}
      <circle cx={centerX + 20} cy={centerY - 18} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 25} cy={centerY} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 12} cy={centerY + 20} r="8" fill="var(--logo-primary)" />

      <circle cx={centerX - 20} cy={centerY - 18} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX - 25} cy={centerY} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX - 12} cy={centerY + 20} r="8" fill="var(--logo-accent)" opacity="0.85" />

      {/* Center bridge */}
      <circle cx={centerX} cy={centerY - 5} r="6" fill="var(--logo-primary)" opacity="0.7" />
    </svg>
  )
}

export function Concept06Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Right spiral */}
      <motion.circle cx={150} cy={60} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 20, cy: centerY - 18 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={160} cy={100} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 25, cy: centerY }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.1 }} />
      <motion.circle cx={140} cy={140} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 12, cy: centerY + 20 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.2 }} />

      {/* Left spiral */}
      <motion.circle cx={50} cy={60} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 20, cy: centerY - 18 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.15 }} />
      <motion.circle cx={40} cy={100} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 25, cy: centerY }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.25 }} />
      <motion.circle cx={60} cy={140} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 12, cy: centerY + 20 }} transition={{ duration: 2.3, ease: 'easeInOut', delay: 0.35 }} />

      {/* Center bridge */}
      <motion.circle cx={centerX} cy={centerY - 5} r="6" fill="var(--logo-primary)" opacity="0.7" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.5 }} />
    </svg>
  )
}
