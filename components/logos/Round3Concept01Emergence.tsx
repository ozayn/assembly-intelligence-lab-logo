'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

export function Round3Concept01Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Three organic curves assemble into a unified circular mark */}
      {/* Top-right curve */}
      <path
        d="M 115 55 Q 135 65 130 95"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      {/* Bottom-left curve */}
      <path
        d="M 85 145 Q 65 135 70 105"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left curve */}
      <path
        d="M 70 75 Q 60 95 75 120"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      {/* Central accent point */}
      <circle cx={centerX} cy={centerY} r="3" fill="var(--logo-accent)" />
    </svg>
  )
}

export function Round3Concept01StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 115 55 Q 135 65 130 95"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 85 145 Q 65 135 70 105"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 70 75 Q 60 95 75 120"
        stroke="#001e3c"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={centerX} cy={centerY} r="3" fill="#001e3c" />
    </svg>
  )
}

export function Round3Concept01Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Curves animate from scattered to organized */}
      <motion.path
        d="M 115 55 Q 135 65 130 95"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 }}
        animate={{ strokeDasharray: 100, strokeDashoffset: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0 }}
      />
      <motion.path
        d="M 85 145 Q 65 135 70 105"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 }}
        animate={{ strokeDasharray: 100, strokeDashoffset: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
      />
      <motion.path
        d="M 70 75 Q 60 95 75 120"
        stroke="var(--logo-primary)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 }}
        animate={{ strokeDasharray: 100, strokeDashoffset: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="3"
        fill="var(--logo-accent)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      />
    </svg>
  )
}
