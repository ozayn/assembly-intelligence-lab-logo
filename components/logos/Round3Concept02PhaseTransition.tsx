'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

// 8 small squares that transition from disorder to order
const squares = [
  { x: 80, y: 70 },
  { x: 120, y: 90 },
  { x: 95, y: 110 },
  { x: 130, y: 65 },
  { x: 75, y: 130 },
  { x: 115, y: 135 },
  { x: 100, y: 80 },
  { x: 85, y: 100 },
]

// Final ordered positions (2x4 grid)
const orderedSquares = [
  { x: 85, y: 85 },
  { x: 100, y: 85 },
  { x: 115, y: 85 },
  { x: 85, y: 102 },
  { x: 100, y: 102 },
  { x: 115, y: 102 },
  { x: 85, y: 119 },
  { x: 100, y: 119 },
]

export function Round3Concept02Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {orderedSquares.map((sq, i) => (
        <rect
          key={i}
          x={sq.x - 4}
          y={sq.y - 4}
          width="8"
          height="8"
          fill="var(--logo-primary)"
        />
      ))}
      <rect
        x={centerX - 35}
        y={centerY - 20}
        width="70"
        height="50"
        fill="none"
        stroke="var(--logo-accent)"
        strokeWidth="1.5"
        opacity="0.4"
      />
    </svg>
  )
}

export function Round3Concept02StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {orderedSquares.map((sq, i) => (
        <rect
          key={i}
          x={sq.x - 4}
          y={sq.y - 4}
          width="8"
          height="8"
          fill="#001e3c"
        />
      ))}
      <rect
        x={centerX - 35}
        y={centerY - 20}
        width="70"
        height="50"
        fill="none"
        stroke="#001e3c"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  )
}

export function Round3Concept02Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {squares.map((sq, i) => (
        <motion.rect
          key={i}
          x={sq.x - 4}
          y={sq.y - 4}
          width="8"
          height="8"
          fill="var(--logo-primary)"
          initial={{ x: sq.x - 4, y: sq.y - 4, opacity: 0.6 }}
          animate={{
            x: orderedSquares[i % orderedSquares.length].x - 4,
            y: orderedSquares[i % orderedSquares.length].y - 4,
            opacity: 1,
          }}
          transition={{
            duration: 2.2,
            ease: [0.34, 1.56, 0.64, 1],
            delay: i * 0.1,
          }}
        />
      ))}
      <motion.rect
        x={centerX - 35}
        y={centerY - 20}
        width="70"
        height="50"
        fill="none"
        stroke="var(--logo-accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      />
    </svg>
  )
}
