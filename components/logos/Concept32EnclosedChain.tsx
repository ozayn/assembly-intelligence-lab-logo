'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, type Tone } from './referenceTones'

// Close descendant of historical reference 12. It keeps the split outer
// hexagonal enclosure, two isolated axial nodes outside the openings, and the
// original six-node internal assembly: a small upper cell sharing its centre
// node with a larger lower diamond.
const LEFT_ENCLOSURE = 'M82 49 L50 67 L50 133 L82 151'
const RIGHT_ENCLOSURE = 'M118 49 L150 67 L150 133 L118 151'
const UPPER_CELL = 'M100 66 L84 83 L100 100 L122 83 Z'
const LOWER_CELL = 'M100 100 L78 124 L100 151 L122 124 Z'
const OUTER_STROKE = 5.2
const INNER_STROKE = 3

type Node = { cx: number; cy: number; r: number; tone: Tone }

const nodes: Node[] = [
  { cx: 100, cy: 31, r: 7.5, tone: 'navy' },
  { cx: 100, cy: 66, r: 7, tone: 'navy' },
  { cx: 122, cy: 83, r: 6.5, tone: 'lteal' },
  { cx: 100, cy: 100, r: 7, tone: 'navy' },
  { cx: 78, cy: 124, r: 7, tone: 'teal' },
  { cx: 122, cy: 124, r: 7, tone: 'blue' },
  { cx: 100, cy: 151, r: 7, tone: 'navy' },
  { cx: 100, cy: 177, r: 7.5, tone: 'navy' },
]

function StaticStructure() {
  return (
    <>
      <path d={LEFT_ENCLOSURE} fill="none" stroke="var(--logo-primary)" strokeWidth={OUTER_STROKE} strokeLinejoin="miter" strokeLinecap="butt" />
      <path d={RIGHT_ENCLOSURE} fill="none" stroke="var(--logo-primary)" strokeWidth={OUTER_STROKE} strokeLinejoin="miter" strokeLinecap="butt" />
      <path d={UPPER_CELL} fill="none" stroke="var(--logo-light)" strokeWidth={INNER_STROKE} strokeLinejoin="round" />
      <path d={LOWER_CELL} fill="none" stroke="var(--logo-light)" strokeWidth={INNER_STROKE} strokeLinejoin="round" />
      {nodes.map((node, i) => (
        <circle key={i} cx={node.cx} cy={node.cy} r={node.r} fill={TONE_FILL[node.tone]} />
      ))}
    </>
  )
}

export function Concept32Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <StaticStructure />
    </svg>
  )
}

export function Concept32Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {[LEFT_ENCLOSURE, RIGHT_ENCLOSURE].map((path, i) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke="var(--logo-primary)"
          strokeWidth={OUTER_STROKE}
          strokeLinejoin="miter"
          strokeLinecap="butt"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {[UPPER_CELL, LOWER_CELL].map((path, i) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke="var(--logo-light)"
          strokeWidth={INNER_STROKE}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 + i * 0.18, ease: 'easeInOut' }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          r={node.r}
          fill={TONE_FILL[node.tone]}
          initial={{ cy: 100, opacity: 0 }}
          animate={{ cy: node.cy, opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  )
}
