'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept12Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <path
        d="M 100 60 L 125 80 L 120 110 L 100 120 L 80 110 L 75 80 Z"
        fill="var(--logo-primary)"
      />
      <circle cx="100" cy="90" r="3" fill="white" opacity="0.5" />
      <circle cx="90" cy="82" r="2" fill="white" opacity="0.5" />
      <circle cx="110" cy="82" r="2" fill="white" opacity="0.5" />
      <circle cx="85" cy="100" r="2" fill="white" opacity="0.5" />
      <circle cx="115" cy="100" r="2" fill="white" opacity="0.5" />
    </svg>
  )
}

export function Concept12Animated() {
  const units = [
    { sx: 50, sy: 50, ex: 100, ey: 60 },
    { sx: 150, sy: 50, ex: 125, ey: 80 },
    { sx: 150, sy: 150, ex: 120, ey: 110 },
    { sx: 100, sy: 170, ex: 100, ey: 120 },
    { sx: 50, sy: 150, ex: 80, ey: 110 },
    { sx: 50, sy: 50, ex: 75, ey: 80 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {units.map((unit, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={unit.sx}
            cy={unit.sy}
            r="5"
            fill="var(--logo-primary)"
            animate={{
              cx: unit.ex,
              cy: unit.ey,
            }}
            transition={{
              duration: 2.5,
              ease: 'easeInOut',
              delay: i * 0.12,
            }}
          />
        </motion.g>
      ))}

      <motion.path
        d="M 100 60 L 125 80 L 120 110 L 100 120 L 80 110 L 75 80 Z"
        fill="var(--logo-primary)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 2.2,
        }}
      />

      {[
        { cx: 100, cy: 90 },
        { cx: 90, cy: 82 },
        { cx: 110, cy: 82 },
        { cx: 85, cy: 100 },
        { cx: 115, cy: 100 },
      ].map((dot, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={i === 0 ? 3 : 2}
          fill="white"
          opacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{
            duration: 0.3,
            delay: 2.4,
          }}
        />
      ))}
    </svg>
  )
}
