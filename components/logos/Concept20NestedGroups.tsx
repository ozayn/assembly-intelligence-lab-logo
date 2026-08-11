'use client'

import { motion } from 'framer-motion'

// Two-level hierarchy: units form local clusters first, then the clusters
// (as formed groups) arrange into a staggered, asymmetric macro-structure.
// Deliberately not radially symmetric — no diamond/compass/flower/hub read.

interface Dot {
  cx: number
  cy: number
  r: number
  role: 'primary' | 'secondary' | 'accent'
}

const clusterA: Dot[] = [
  { cx: 52, cy: 52, r: 9, role: 'primary' },
  { cx: 70, cy: 54, r: 9, role: 'primary' },
  { cx: 51, cy: 70, r: 9, role: 'primary' },
  { cx: 69, cy: 71, r: 9, role: 'primary' },
]

const clusterB: Dot[] = [
  { cx: 104, cy: 92, r: 7.5, role: 'secondary' },
  { cx: 122, cy: 95, r: 7.5, role: 'secondary' },
  { cx: 112, cy: 112, r: 7.5, role: 'secondary' },
]

const clusterC: Dot[] = [
  { cx: 142, cy: 136, r: 5.5, role: 'accent' },
  { cx: 158, cy: 142, r: 5.5, role: 'accent' },
]

const clusters = [
  { dots: clusterA, centroid: { x: 60, y: 61.75 } },
  { dots: clusterB, centroid: { x: 112.7, y: 99.7 } },
  { dots: clusterC, centroid: { x: 150, y: 139 } },
]

function colorFor(role: Dot['role']) {
  return `var(--logo-${role})`
}

export function Concept20Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {clusters.flatMap((cluster, ci) =>
        cluster.dots.map((d, di) => (
          <circle key={`${ci}-${di}`} cx={d.cx} cy={d.cy} r={d.r} fill={colorFor(d.role)} />
        ))
      )}
    </svg>
  )
}

const SHARED_CENTER = { x: 100, y: 100 }

export function Concept20Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {clusters.map((cluster, ci) =>
        cluster.dots.map((d, di) => {
          const offsetX = d.cx - cluster.centroid.x
          const offsetY = d.cy - cluster.centroid.y
          // Stage 0: scattered around a shared center (units not yet grouped)
          const scatterX = SHARED_CENTER.x + offsetX * 3.2
          const scatterY = SHARED_CENTER.y + offsetY * 3.2
          // Stage 1: cluster has formed, but all clusters still share one
          // compressed macro-position (local grouping resolved, global not yet)
          const formedAtCenterX = SHARED_CENTER.x + offsetX
          const formedAtCenterY = SHARED_CENTER.y + offsetY
          // Stage 2: cluster keeps its shape, macro-structure resolves
          const finalX = d.cx
          const finalY = d.cy

          return (
            <motion.circle
              key={`${ci}-${di}`}
              r={d.r}
              fill={colorFor(d.role)}
              initial={{ cx: scatterX, cy: scatterY, opacity: 0 }}
              animate={{
                cx: [scatterX, formedAtCenterX, finalX],
                cy: [scatterY, formedAtCenterY, finalY],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 1.8,
                times: [0, 0.4, 1],
                delay: di * 0.06,
                ease: ['easeOut', 'easeInOut'],
              }}
            />
          )
        })
      )}
    </svg>
  )
}
