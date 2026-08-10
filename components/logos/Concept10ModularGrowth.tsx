'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept10Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="100" cy="100" r="8" fill="var(--logo-primary)" />
      <rect x="88" y="70" width="24" height="24" rx="2" fill="var(--logo-primary)" />
      <rect x="75" y="85" width="20" height="20" rx="2" fill="var(--logo-primary)" />
      <rect x="105" y="85" width="20" height="20" rx="2" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept10Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.circle
        cx="100"
        cy="100"
        r="8"
        fill="var(--logo-primary)"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0 }}
      />

      <motion.rect
        x="88"
        y="70"
        width="24"
        height="24"
        rx="2"
        fill="var(--logo-primary)"
        initial={{ opacity: 0, y: 50, scaleY: 0 }}
        animate={{ opacity: 1, y: 70, scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      />

      <motion.rect
        x="75"
        y="85"
        width="20"
        height="20"
        rx="2"
        fill="var(--logo-primary)"
        initial={{ opacity: 0, x: 55, scaleX: 0 }}
        animate={{ opacity: 1, x: 75, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
      />

      <motion.rect
        x="105"
        y="85"
        width="20"
        height="20"
        rx="2"
        fill="var(--logo-primary)"
        initial={{ opacity: 0, x: 125, scaleX: 0 }}
        animate={{ opacity: 1, x: 105, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1.7, ease: 'easeOut' }}
      />
    </svg>
  )
}
