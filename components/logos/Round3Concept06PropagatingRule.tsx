'use client'

import { motion } from 'framer-motion'

const size = 200
const centerX = size / 2
const centerY = size / 2

// Spiral/branching structure built from simple connections
const nodes = [
  { x: 100, y: 100, r: 6 },     // central node
  { x: 115, y: 95, r: 4 },      // branch 1
  { x: 125, y: 85, r: 3 },      // extends from 1
  { x: 85, y: 95, r: 4 },       // branch 2
  { x: 70, y: 95, r: 3 },       // extends from 2
  { x: 105, y: 120, r: 4 },     // branch 3
  { x: 105, y: 138, r: 3 },     // extends from 3
]

const connections = [
  { x1: 100, y1: 100, x2: 115, y2: 95 },
  { x1: 115, y1: 95, x2: 125, y2: 85 },
  { x1: 100, y1: 100, x2: 85, y2: 95 },
  { x1: 85, y1: 95, x2: 70, y2: 95 },
  { x1: 100, y1: 100, x2: 105, y2: 120 },
  { x1: 105, y1: 120, x2: 105, y2: 138 },
]

export function Round3Concept06Static() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Draw connections first (appear behind) */}
      {connections.map((conn, i) => (
        <line
          key={`line-${i}`}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="var(--logo-primary)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}

      {/* Draw nodes */}
      {nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={i === 0 ? 'var(--logo-accent)' : 'var(--logo-primary)'}
          opacity={i === 0 ? 0.9 : 0.7}
        />
      ))}
    </svg>
  )
}

export function Round3Concept06StaticMonochrome() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {connections.map((conn, i) => (
        <line
          key={`line-${i}`}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="#001e3c"
          strokeWidth="1.5"
          opacity="0.4"
        />
      ))}

      {nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill="#001e3c"
          opacity={i === 0 ? 0.8 : 0.6}
        />
      ))}
    </svg>
  )
}

export function Round3Concept06Animated() {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Center node appears first */}
      <motion.circle
        cx={nodes[0].x}
        cy={nodes[0].y}
        r={nodes[0].r}
        fill="var(--logo-accent)"
        opacity="0.9"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: nodes[0].r, opacity: 0.9 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Branches grow outward, each rule determines placement of next node */}
      {nodes.slice(1).map((node, i) => (
        <motion.g key={`branch-${i}`}>
          {/* Connection line grows */}
          <motion.line
            x1={connections[i].x1}
            y1={connections[i].y1}
            x2={connections[i].x2}
            y2={connections[i].y2}
            stroke="var(--logo-primary)"
            strokeWidth="1.5"
            opacity="0.5"
            initial={{
              x2: connections[i].x1,
              y2: connections[i].y1,
            }}
            animate={{
              x2: connections[i].x2,
              y2: connections[i].y2,
            }}
            transition={{
              duration: 1.4,
              ease: 'easeInOut',
              delay: 0.4 + i * 0.2,
            }}
          />

          {/* Node appears at end of connection */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="var(--logo-primary)"
            opacity="0.7"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: node.r, opacity: 0.7 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              delay: 1.2 + i * 0.2,
            }}
          />
        </motion.g>
      ))}
    </svg>
  )
}
