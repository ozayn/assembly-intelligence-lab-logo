'use client'

import { motion } from 'framer-motion'

type HexModule = {
  cx: number
  cy: number
  fill: string
  // Where the module enters from, offset outward from the mark's centre so
  // each unit travels along the axis it finally occupies.
  from: { x: number; y: number }
  seat: number
}

// The supplied source contains eight point-up hexagons: 1 / 2 / 3 / 2.
// Their centres sit on one staggered grid, preserving the white channels and
// the open A-shaped lower centre visible in Shiva's selected direction.
// Seating runs base first, then the middle band, then the upper pair, so the
// A silhouette resolves from the ground up.
const modules: HexModule[] = [
  { cx: 100, cy: 34, fill: 'var(--logo-pale)', from: { x: 0, y: -17 }, seat: 1.1 },
  { cx: 80, cy: 69, fill: 'var(--logo-accent)', from: { x: -8, y: -12 }, seat: 0.76 },
  { cx: 120, cy: 69, fill: 'var(--logo-light)', from: { x: 8, y: -12 }, seat: 0.88 },
  { cx: 60, cy: 104, fill: 'var(--logo-secondary)', from: { x: -15, y: 2 }, seat: 0.32 },
  { cx: 100, cy: 104, fill: 'var(--logo-accent)', from: { x: 0, y: 13 }, seat: 0.44 },
  { cx: 140, cy: 104, fill: 'var(--logo-light)', from: { x: 15, y: 2 }, seat: 0.56 },
  { cx: 40, cy: 139, fill: 'var(--logo-primary)', from: { x: -14, y: 9 }, seat: 0.06 },
  { cx: 160, cy: 139, fill: 'var(--logo-pale)', from: { x: 14, y: 9 }, seat: 0.16 },
]

const RADIUS = 20.3
const HALF_WIDTH = RADIUS * Math.sqrt(3) / 2
const DURATION = 0.55
const EASE = [0.16, 1, 0.3, 1] as const

function points(cx: number, cy: number) {
  return [
    `${cx},${cy - RADIUS}`,
    `${cx + HALF_WIDTH},${cy - RADIUS / 2}`,
    `${cx + HALF_WIDTH},${cy + RADIUS / 2}`,
    `${cx},${cy + RADIUS}`,
    `${cx - HALF_WIDTH},${cy + RADIUS / 2}`,
    `${cx - HALF_WIDTH},${cy - RADIUS / 2}`,
  ].join(' ')
}

export function Concept34Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {modules.map((module, index) => (
        <polygon
          key={index}
          points={points(module.cx, module.cy)}
          fill={module.fill}
        />
      ))}
    </svg>
  )
}

export function Concept34Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {modules.map((module, index) => (
        <motion.polygon
          key={index}
          points={points(module.cx, module.cy)}
          fill={module.fill}
          initial={{ x: module.from.x, y: module.from.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: DURATION, delay: module.seat, ease: EASE }}
        />
      ))}
    </svg>
  )
}
