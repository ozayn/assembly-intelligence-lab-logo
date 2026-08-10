'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept05Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="100" cy="70" r="6" fill="var(--logo-primary)" />
      <circle cx="125" cy="95" r="6" fill="var(--logo-primary)" />
      <circle cx="100" cy="120" r="6" fill="var(--logo-primary)" />
      <circle cx="75" cy="95" r="6" fill="var(--logo-primary)" />
      <circle cx="100" cy="95" r="4" fill="var(--logo-primary)" opacity="0.6" />
    </svg>
  )
}

export function Concept05Animated() {
  const containerVariants = {
    animate: {
      rotate: 0,
      transition: {
        duration: 2.5,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <motion.g
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          times: [0, 0.6, 1],
          keyframes: [0, 180, 0],
        }}
        style={{ originX: '100px', originY: '95px' }}
      >
        <circle cx="100" cy="50" r="6" fill="var(--logo-primary)" />
      </motion.g>

      <motion.circle
        cx="125"
        cy="95"
        r="6"
        fill="var(--logo-primary)"
        animate={{
          cx: 125,
        }}
        transition={{
          delay: 0.8,
          duration: 1.5,
          ease: 'easeInOut',
        }}
      />

      <motion.circle
        cx="100"
        cy="140"
        r="6"
        fill="var(--logo-primary)"
        animate={{
          cy: 120,
        }}
        transition={{
          delay: 1.2,
          duration: 1.5,
          ease: 'easeInOut',
        }}
      />

      <motion.circle
        cx="75"
        cy="95"
        r="6"
        fill="var(--logo-primary)"
        animate={{
          cx: 75,
        }}
        transition={{
          delay: 0.4,
          duration: 1.5,
          ease: 'easeInOut',
        }}
      />

      <motion.circle
        cx="100"
        cy="95"
        r="4"
        fill="var(--logo-primary)"
        opacity="0.6"
      />
    </svg>
  )
}
