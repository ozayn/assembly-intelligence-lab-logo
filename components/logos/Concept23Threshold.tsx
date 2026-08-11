'use client'

import { motion } from 'framer-motion'

// One connected form. Anchor points never move — only the four curve control
// points animate, so the left portion stays angular/faceted throughout while
// the right portion's boundary resolves from flat-ish into a true flowing
// curve. No particles, nothing appears/disappears — the edge itself is what
// transforms.

const STATIC_D =
  'M 45 75 L 70 65 L 100 62 Q 130 60 155 75 Q 175 90 178 100 Q 175 110 155 125 Q 130 140 100 138 L 70 135 L 45 125 Z'

// Same anchor points, but the four Q control points are pulled to roughly
// the midpoint of their start/end anchors — visually much flatter/angular,
// the "before" state the boundary animates out of.
const ANGULAR_D =
  'M 45 75 L 70 65 L 100 62 Q 127.5 68.5 155 75 Q 166.5 87.5 178 100 Q 166.5 112.5 155 125 Q 127.5 131.5 100 138 L 70 135 L 45 125 Z'

const GRADIENT_ID = 'concept23-threshold-gradient'

function Gradient() {
  return (
    <defs>
      <linearGradient id={GRADIENT_ID} x1="45" y1="100" x2="178" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--logo-primary)" />
        <stop offset="100%" stopColor="var(--logo-accent)" />
      </linearGradient>
    </defs>
  )
}

export function Concept23Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <Gradient />
      <path d={STATIC_D} fill={`url(#${GRADIENT_ID})`} />
    </svg>
  )
}

export function Concept23Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <Gradient />
      <motion.path
        fill={`url(#${GRADIENT_ID})`}
        initial={{ d: ANGULAR_D }}
        animate={{ d: STATIC_D }}
        transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
      />
    </svg>
  )
}
