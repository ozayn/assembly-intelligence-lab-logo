'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Concept12Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Distributed lattice: loosely organized particles */}
      <circle cx={centerX - 22} cy={centerY - 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX} cy={centerY - 25} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 22} cy={centerY - 20} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 15} cy={centerY + 5} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX + 18} cy={centerY + 8} r="8" fill="var(--logo-primary)" />
      <circle cx={centerX - 8} cy={centerY + 22} r="8" fill="var(--logo-accent)" opacity="0.85" />
      <circle cx={centerX + 12} cy={centerY + 20} r="8" fill="var(--logo-accent)" opacity="0.85" />
    </svg>
  )
}

export function Concept12Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.circle cx={60} cy={50} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 22, cy: centerY - 20 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0 }} />
      <motion.circle cx={100} cy={30} r="8" fill="var(--logo-primary)" animate={{ cx: centerX, cy: centerY - 25 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.1 }} />
      <motion.circle cx={140} cy={50} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 22, cy: centerY - 20 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.2 }} />
      <motion.circle cx={70} cy={110} r="8" fill="var(--logo-primary)" animate={{ cx: centerX - 15, cy: centerY + 5 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }} />
      <motion.circle cx={140} cy={120} r="8" fill="var(--logo-primary)" animate={{ cx: centerX + 18, cy: centerY + 8 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.4 }} />
      <motion.circle cx={50} cy={150} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX - 8, cy: centerY + 22 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.5 }} />
      <motion.circle cx={130} cy={160} r="8" fill="var(--logo-accent)" opacity="0.85" animate={{ cx: centerX + 12, cy: centerY + 20 }} transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.6 }} />
    </svg>
  )
}
