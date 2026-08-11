'use client'

import { motion } from 'framer-motion'

// Asymmetric mound built from local settling — each unit's final position
// depends only on the units already settled near it, never on a global plan.
const dots = [
  { cx: 63, cy: 137, r: 12, role: 'primary' as const },
  { cx: 51, cy: 121, r: 11, role: 'primary' as const },
  { cx: 73, cy: 113, r: 10, role: 'primary' as const },
  { cx: 57, cy: 97, r: 9, role: 'primary' as const },
  { cx: 77, cy: 87, r: 8, role: 'secondary' as const },
  { cx: 63, cy: 75, r: 7, role: 'secondary' as const },
  { cx: 47, cy: 103, r: 7, role: 'secondary' as const },
  { cx: 85, cy: 103, r: 6.5, role: 'secondary' as const },
  { cx: 97, cy: 111, r: 5.5, role: 'accent' as const },
  { cx: 110, cy: 116, r: 4.5, role: 'accent' as const },
  { cx: 123, cy: 120, r: 3.6, role: 'accent' as const },
  { cx: 135, cy: 123, r: 2.8, role: 'accent' as const, opacity: 0.85 },
  { cx: 146, cy: 125, r: 2.1, role: 'accent' as const, opacity: 0.6 },
  { cx: 156, cy: 126.5, r: 1.5, role: 'accent' as const, opacity: 0.4 },
]

function colorFor(role: 'primary' | 'secondary' | 'accent') {
  return `var(--logo-${role})`
}

export function Concept19Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={colorFor(d.role)} opacity={d.opacity ?? 1} />
      ))}
    </svg>
  )
}

export function Concept19Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => {
        const fallX = d.cx + (d.cx > 100 ? 18 : -18)
        return (
          <motion.circle
            key={i}
            r={d.r}
            fill={colorFor(d.role)}
            initial={{ cx: fallX, cy: d.cy - 55, opacity: 0, scale: 0.5 }}
            animate={{ cx: d.cx, cy: d.cy, opacity: d.opacity ?? 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: i * 0.1,
              ease: [0.34, 1.4, 0.64, 1],
            }}
          />
        )
      })}
    </svg>
  )
}
