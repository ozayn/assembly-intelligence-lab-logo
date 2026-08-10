'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Round3Concept04Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Final state: nested arcs that form a cohesive mark */}
      <path
        d="M 85 80 Q 100 90 115 80"
        stroke="var(--logo-primary)"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 80 100 Q 100 112 120 100"
        stroke="var(--logo-primary)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 75 120 Q 100 134 125 120"
        stroke="var(--logo-accent)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export function Round3Concept04StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 85 80 Q 100 90 115 80"
        stroke="#001e3c"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 80 100 Q 100 112 120 100"
        stroke="#001e3c"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 75 120 Q 100 134 125 120"
        stroke="#001e3c"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

export function Round3Concept04Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Arcs start as separate vertical lines and transform into arcs */}
      <motion.path
        d="M 85 80 Q 100 90 115 80"
        stroke="var(--logo-primary)"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        initial={{ d: 'M 100 50 Q 100 70 100 90', opacity: 0 }}
        animate={{ d: 'M 85 80 Q 100 90 115 80', opacity: 1 }}
        transition={{ duration: 2, ease: [0.43, 0.13, 0.23, 0.96], delay: 0 }}
      />

      <motion.path
        d="M 80 100 Q 100 112 120 100"
        stroke="var(--logo-primary)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        initial={{ d: 'M 100 70 Q 100 90 100 110', opacity: 0 }}
        animate={{ d: 'M 80 100 Q 100 112 120 100', opacity: 1 }}
        transition={{ duration: 2, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.2 }}
      />

      <motion.path
        d="M 75 120 Q 100 134 125 120"
        stroke="var(--logo-accent)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
        initial={{ d: 'M 100 90 Q 100 110 100 130', opacity: 0 }}
        animate={{ d: 'M 75 120 Q 100 134 125 120', opacity: 0.7 }}
        transition={{ duration: 2, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.4 }}
      />
    </svg>
  )
}
