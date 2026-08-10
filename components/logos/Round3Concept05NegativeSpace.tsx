'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Round3Concept05Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Four curved segments arranged to form a diamond-shaped void in center */}
      {/* Top segment */}
      <path
        d="M 90 75 Q 100 85 110 75"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right segment */}
      <path
        d="M 125 90 Q 115 100 125 110"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />

      {/* Bottom segment */}
      <path
        d="M 110 125 Q 100 115 90 125"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left segment */}
      <path
        d="M 75 110 Q 85 100 75 90"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />

      {/* Central void highlight (very subtle) */}
      <circle
        cx={centerX}
        cy={centerY}
        r="8"
        fill="none"
        stroke="var(--logo-accent)"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  )
}

export function Round3Concept05StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 90 75 Q 100 85 110 75"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 125 90 Q 115 100 125 110"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 110 125 Q 100 115 90 125"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 75 110 Q 85 100 75 90"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r="8"
        fill="none"
        stroke="#001e3c"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  )
}

export function Round3Concept05Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Segments start far apart and move toward center, creating void */}
      <motion.path
        d="M 90 75 Q 100 85 110 75"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0 }}
      />

      <motion.path
        d="M 125 90 Q 115 100 125 110"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ x: 25, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.15 }}
      />

      <motion.path
        d="M 110 125 Q 100 115 90 125"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
      />

      <motion.path
        d="M 75 110 Q 85 100 75 90"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ x: -25, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.15 }}
      />

      <motion.circle
        cx={centerX}
        cy={centerY}
        r="8"
        fill="none"
        stroke="var(--logo-accent)"
        strokeWidth="1"
        initial={{ opacity: 0, r: 0 }}
        animate={{ opacity: 0.3, r: 8 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      />
    </svg>
  )
}
