'use client'

import { motion } from 'framer-motion'

// Close descendant of historical reference 05. The two equal open hexagons,
// their facing openings, overlap depth and horizontal offset are preserved.
// Refinement is limited to a common stroke, true 60-degree turns and optical
// centring of the combined silhouette.
const LEFT = 'M92 55 L70 42 L38 61 L38 105 L70 124 L99 107 L99 89'
const RIGHT = 'M91 89 L91 74 L131 56 L163 74 L163 118 L131 136 L106 121'
const STROKE = 6

function PathPair({ animated = false }: { animated?: boolean }) {
  if (!animated) {
    return (
      <>
        <path d={LEFT} fill="none" stroke="var(--logo-primary)" strokeWidth={STROKE} strokeLinejoin="miter" strokeLinecap="butt" />
        <path d={RIGHT} fill="none" stroke="var(--logo-accent)" strokeWidth={STROKE} strokeLinejoin="miter" strokeLinecap="butt" />
      </>
    )
  }

  return (
    <>
      <motion.path
        d={LEFT}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
        initial={{ x: -24, pathLength: 0, opacity: 0 }}
        animate={{ x: 0, pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d={RIGHT}
        fill="none"
        stroke="var(--logo-accent)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
        initial={{ x: 24, pathLength: 0, opacity: 0 }}
        animate={{ x: 0, pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  )
}

export function Concept31Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <PathPair />
    </svg>
  )
}

export function Concept31Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <PathPair animated />
    </svg>
  )
}
