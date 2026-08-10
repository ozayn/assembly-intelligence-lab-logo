'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Round3Concept03Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Central solid circle */}
      <circle cx={centerX} cy={centerY} r="18" fill="var(--logo-primary)" />

      {/* Three curved complement pieces arranged around */}
      {/* Top curve (concave toward center) */}
      <path
        d="M 100 50 Q 100 70 120 70 Q 100 70 100 50"
        fill="var(--logo-accent)"
        opacity="0.8"
      />

      {/* Bottom-left curve */}
      <path
        d="M 80 140 Q 70 120 85 115 Q 75 125 80 140"
        fill="var(--logo-accent)"
        opacity="0.8"
      />

      {/* Bottom-right curve */}
      <path
        d="M 120 140 Q 130 120 115 115 Q 125 125 120 140"
        fill="var(--logo-accent)"
        opacity="0.8"
      />
    </svg>
  )
}

export function Round3Concept03StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={centerX} cy={centerY} r="18" fill="#001e3c" />
      <path
        d="M 100 50 Q 100 70 120 70 Q 100 70 100 50"
        fill="#001e3c"
        opacity="0.6"
      />
      <path
        d="M 80 140 Q 70 120 85 115 Q 75 125 80 140"
        fill="#001e3c"
        opacity="0.6"
      />
      <path
        d="M 120 140 Q 130 120 115 115 Q 125 125 120 140"
        fill="#001e3c"
        opacity="0.6"
      />
    </svg>
  )
}

export function Round3Concept03Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Central solid circle animates in first */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="18"
        fill="var(--logo-primary)"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: 18, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Complement pieces animate toward center from scattered positions */}
      <motion.path
        d="M 100 50 Q 100 70 120 70 Q 100 70 100 50"
        fill="var(--logo-accent)"
        opacity="0.8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
      />

      <motion.path
        d="M 80 140 Q 70 120 85 115 Q 75 125 80 140"
        fill="var(--logo-accent)"
        opacity="0.8"
        initial={{ x: -25, y: 20, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 0.8 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.5 }}
      />

      <motion.path
        d="M 120 140 Q 130 120 115 115 Q 125 125 120 140"
        fill="var(--logo-accent)"
        opacity="0.8"
        initial={{ x: 25, y: 20, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 0.8 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  )
}
