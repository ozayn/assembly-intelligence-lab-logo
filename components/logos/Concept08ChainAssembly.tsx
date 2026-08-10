'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept08Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="60" cy="100" r="6" fill="var(--logo-primary)" />
      <circle cx="85" cy="85" r="6" fill="var(--logo-primary)" />
      <circle cx="110" cy="70" r="6" fill="var(--logo-primary)" />
      <circle cx="135" cy="85" r="6" fill="var(--logo-primary)" />
      <circle cx="140" cy="115" r="6" fill="var(--logo-primary)" />
      <path
        d="M 60 100 Q 72.5 92.5 85 85 T 110 70 T 135 85 T 140 115"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="2"
      />
    </svg>
  )
}

export function Concept08Animated() {
  const nodes = [
    { x: 60, y: 100, sx: 60, sy: 30 },
    { x: 85, y: 85, sx: 85, sy: 20 },
    { x: 110, y: 70, sx: 110, sy: 15 },
    { x: 135, y: 85, sx: 135, sy: 25 },
    { x: 140, y: 115, sx: 140, sy: 150 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.sx}
          cy={node.sy}
          r="6"
          fill="var(--logo-primary)"
          animate={{
            cx: node.x,
            cy: node.y,
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}

      <motion.path
        d="M 60 100 Q 72.5 92.5 85 85 T 110 70 T 135 85 T 140 115"
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth="2"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{
          duration: 1.5,
          delay: 1.5,
          ease: 'easeInOut',
        }}
      />
    </svg>
  )
}
