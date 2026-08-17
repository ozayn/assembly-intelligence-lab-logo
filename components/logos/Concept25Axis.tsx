'use client'

import { motion } from 'framer-motion'
import { TONE_FILL, TONE_OPACITY, type Tone } from './referenceTones'
import { painter } from './seatedMark'

// Descendant of historical reference 01.
// Proportions are measured off the historical sheet: the chevron's width
// equals its height (26.6° half-angle), stroke is 0.070 of that height, the
// first particle sits at 0.706 of it, and particle radius is 0.081 of it.
// Refinement is the column itself: four evenly pitched dots become three on a
// pitch that tightens toward the apex, with the top one at crossbar height.
const CHEVRON = 'M51.55 134.9 L100 38 L148.45 134.9'
const STROKE = 6.76

const dots: { cy: number; r: number; tone: Tone }[] = [
  { cy: 106.41, r: 7.8, tone: 'navy' },
  { cy: 127.91, r: 7.5, tone: 'blue' },
  { cy: 152.41, r: 6.9, tone: 'teal' },
]

// The two movements the mark is made of, stated once so the component on the
// page and the file written for use off it cannot drift apart.
const DRAW = { duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] as const }
const RISE = { duration: 0.85, stagger: 0.16, lift: 56, ease: [0.16, 1, 0.3, 1] as const }

export function Concept25Static() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <path
        d={CHEVRON}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={100} cy={d.cy} r={d.r} fill={TONE_FILL[d.tone]} opacity={TONE_OPACITY[d.tone]} />
      ))}
    </svg>
  )
}

// The column rising and the chevron drawing outward from its apex, written as
// a file that plays on its own. The chevron is normalised with pathLength so
// the dash can be stated as a fraction of the whole run — the same pair of
// numbers Framer animates on the page — and the run is kept centred on the
// apex by starting it half of what is still missing along the path. Both
// movements rest on the element's own attributes, so the last frame is the
// static mark.
export function buildConcept25Animated(
  colour: (token: string) => string,
  size: number
): string {
  const paint = painter(colour)
  const scope = 'ail-concept-25-animated'

  const column = dots
    .map(
      (dot, index) =>
        `<circle class="dot" cx="100" cy="${dot.cy}" r="${dot.r}"` +
        ` fill="${paint(TONE_FILL[dot.tone])}" opacity="${TONE_OPACITY[dot.tone]}"` +
        ` style="animation-delay:${(index * RISE.stagger).toFixed(2)}s"/>`
    )
    .join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" id="${scope}">` +
    `<style>` +
    `#${scope} .chevron{animation:${scope}-draw ${DRAW.duration}s ` +
    `cubic-bezier(${DRAW.ease.join(',')}) ${DRAW.delay}s backwards}` +
    `#${scope} .dot{animation-name:${scope}-rise;animation-duration:${RISE.duration}s;` +
    `animation-timing-function:cubic-bezier(${RISE.ease.join(',')});animation-fill-mode:backwards}` +
    `@keyframes ${scope}-draw{` +
    `from{stroke-dasharray:0 1;stroke-dashoffset:-0.5}` +
    `to{stroke-dasharray:1 1;stroke-dashoffset:0}}` +
    `@keyframes ${scope}-rise{from{transform:translate(0,${RISE.lift}px);opacity:0}}` +
    `</style>` +
    `<path class="chevron" d="${CHEVRON}" pathLength="1"` +
    ` stroke-dasharray="1 1" stroke-dashoffset="0"` +
    ` fill="none" stroke="${paint('var(--logo-primary)')}" stroke-width="${STROKE}"` +
    ` stroke-linejoin="miter" stroke-linecap="butt"/>` +
    column +
    `</svg>`
  )
}

export function Concept25Animated() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {/* pathOffset tracking pathLength keeps the visible run centred on the
          middle of the path, so the chevron grows outward from its apex. */}
      <motion.path
        d={CHEVRON}
        fill="none"
        stroke="var(--logo-primary)"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeLinecap="butt"
        initial={{ pathLength: 0, pathOffset: 0.5 }}
        animate={{ pathLength: 1, pathOffset: 0 }}
        transition={{ duration: DRAW.duration, delay: DRAW.delay, ease: DRAW.ease }}
      />
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={100}
          r={d.r}
          fill={TONE_FILL[d.tone]}
          initial={{ cy: d.cy + RISE.lift, opacity: 0 }}
          animate={{ cy: d.cy, opacity: TONE_OPACITY[d.tone] }}
          transition={{
            duration: RISE.duration,
            delay: i * RISE.stagger,
            ease: RISE.ease,
          }}
        />
      ))}
    </svg>
  )
}
