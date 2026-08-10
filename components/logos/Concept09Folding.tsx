'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept09Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 100 60 L 130 95 L 100 105 L 70 95 Z"
        fill="var(--logo-primary)"
      />
      <circle cx="100" cy="82" r="8" fill="none" stroke="var(--logo-primary)" strokeWidth="1.5" />
    </svg>
  )
}

export function Concept09Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.path
        d="M 100 60 L 130 95 L 100 105 L 70 95 Z"
        fill="var(--logo-primary)"
        initial={{
          d: 'M 100 20 L 170 80 L 100 140 L 30 80 Z',
          rotate: 45,
        }}
        animate={{
          d: 'M 100 60 L 130 95 L 100 105 L 70 95 Z',
          rotate: 0,
        }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
        }}
        style={{ originX: 100, originY: 100 }}
      />

      <motion.circle
        cx="100"
        cy="82"
        r="8"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 2,
        }}
      />
    </svg>
  )
}
