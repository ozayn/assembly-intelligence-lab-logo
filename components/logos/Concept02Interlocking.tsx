'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept02Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 100 50 L 130 80 L 100 100 L 70 80 Z"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 100 100 L 130 120 L 100 150 L 70 120 Z"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="100" r="3" fill="var(--logo-primary)" />
    </svg>
  )
}

export function Concept02Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.g
        animate={{ rotate: 0 }}
        initial={{ rotate: -90, x: -40, y: -40 }}
        transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
      >
        <path
          d="M 100 50 L 130 80 L 100 100 L 70 80 Z"
          fill="none"
          stroke="var(--logo-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      <motion.g
        animate={{ rotate: 0 }}
        initial={{ rotate: 90, x: 40, y: 40 }}
        transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
      >
        <path
          d="M 100 100 L 130 120 L 100 150 L 70 120 Z"
          fill="none"
          stroke="var(--logo-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      <motion.circle
        cx="100"
        cy="100"
        r="3"
        fill="var(--logo-primary)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />
    </svg>
  )
}
