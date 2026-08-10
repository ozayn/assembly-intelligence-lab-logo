'use client'

import { motion } from 'framer-motion'

const size = 200

export function Concept04Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx="60" cy="100" r="7" fill="var(--logo-primary)" />
      <circle cx="85" cy="85" r="7" fill="var(--logo-primary)" />
      <circle cx="100" cy="60" r="7" fill="var(--logo-primary)" />
      <circle cx="130" cy="70" r="7" fill="var(--logo-primary)" />
      <circle cx="145" cy="100" r="7" fill="var(--logo-primary)" />
      <line x1="60" y1="100" x2="85" y2="85" stroke="var(--logo-primary)" strokeWidth="1.5" />
      <line x1="85" y1="85" x2="100" y2="60" stroke="var(--logo-primary)" strokeWidth="1.5" />
      <line x1="100" y1="60" x2="130" y2="70" stroke="var(--logo-primary)" strokeWidth="1.5" />
      <line x1="130" y1="70" x2="145" y2="100" stroke="var(--logo-primary)" strokeWidth="1.5" />
    </svg>
  )
}

export function Concept04Animated() {
  const nodes = [
    { x: 60, y: 100, sx: 60, sy: 20 },
    { x: 85, y: 85, sx: 65, sy: 30 },
    { x: 100, y: 60, sx: 70, sy: 40 },
    { x: 130, y: 70, sx: 120, sy: 50 },
    { x: 145, y: 100, sx: 140, sy: 140 },
  ]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.sx}
          cy={node.sy}
          r="7"
          fill="var(--logo-primary)"
          animate={{
            cx: node.x,
            cy: node.y,
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: i * 0.25,
          }}
        />
      ))}

      {nodes.map((node, i) => {
        if (i === nodes.length - 1) return null
        const nextNode = nodes[i + 1]
        return (
          <motion.line
            key={`line-${i}`}
            x1={node.x}
            y1={node.y}
            x2={nextNode.x}
            y2={nextNode.y}
            stroke="var(--logo-primary)"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: i * 0.25 + 0.3,
            }}
          />
        )
      })}
    </svg>
  )
}
