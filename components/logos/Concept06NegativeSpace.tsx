'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept06Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="75" cy="65" r="8" fill="var(--logo-primary)" />
      <circle cx="125" cy="65" r="8" fill="var(--logo-primary)" />
      <circle cx="80" cy="110" r="8" fill="var(--logo-primary)" />
      <circle cx="120" cy="110" r="8" fill="var(--logo-primary)" />
      <circle cx="100" cy="87" r="10" fill="none" stroke="var(--logo-primary)" strokeWidth="2" />
    </svg>
  )
}

export function Concept06Animated() {
  const particles = [
    { sx: 30, sy: 50 },
    { sx: 170, sy: 50 },
    { sx: 40, sy: 150 },
    { sx: 160, sy: 150 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={particles[i].sx}
          cy={particles[i].sy}
          r="8"
          fill="var(--logo-primary)"
          animate={{
            cx: [75, 125, 80, 120][i],
            cy: [65, 65, 110, 110][i],
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}

      <motion.circle
        cx="100"
        cy="87"
        r="10"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="2"
        initial={{ opacity: 0, r: 0 }}
        animate={{ opacity: 1, r: 10 }}
        transition={{
          duration: 0.5,
          delay: 1.8,
        }}
      />
    </svg>
  )
}
