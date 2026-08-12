'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Concept33Static } from '@/components/logos/Concept33FacetedA'
import { Concept34Static } from '@/components/logos/Concept34HexagonalA'
import type { RefinementDirection } from './directions'
import { LINE_1, LINE_2, TARGET, type SymbolSpec, type Treatment } from './reference'

const SYMBOL_COMPONENTS = {
  '33': Concept33Static,
  '34': Concept34Static,
}

const PROBE_SIZE = 100

interface FontProbe {
  capPerEm: number
  ascentPerEm: number
  descentPerEm: number
  ink1PerEm: number
  ink2PerEm: number
}

let sharedContext: CanvasRenderingContext2D | null = null
const probeCache = new Map<string, FontProbe>()

function getContext() {
  if (!sharedContext) {
    sharedContext = document.createElement('canvas').getContext('2d')
  }
  return sharedContext
}

// Everything is solved from one measurement of the real webfont at a fixed
// probe size: text metrics scale linearly, so a single probe describes the
// font at any size.
function probeFont(family: string, weight: number): FontProbe | null {
  const key = `${weight} ${family}`
  const cached = probeCache.get(key)
  if (cached) return cached

  const ctx = getContext()
  if (!ctx) return null
  ctx.font = `${weight} ${PROBE_SIZE}px ${family}`

  const h = ctx.measureText('H')
  const cap = h.actualBoundingBoxAscent
  if (!cap) return null

  const inkWidth = (text: string) => {
    const m = ctx.measureText(text)
    return m.actualBoundingBoxRight + m.actualBoundingBoxLeft
  }

  const probe: FontProbe = {
    capPerEm: cap / PROBE_SIZE,
    ascentPerEm: (h.fontBoundingBoxAscent ?? PROBE_SIZE * 0.8) / PROBE_SIZE,
    descentPerEm: (h.fontBoundingBoxDescent ?? PROBE_SIZE * 0.2) / PROBE_SIZE,
    ink1PerEm: inkWidth(LINE_1) / PROBE_SIZE,
    ink2PerEm: inkWidth(LINE_2) / PROBE_SIZE,
  }
  probeCache.set(key, probe)
  return probe
}

export interface Solved {
  size1: number
  size2: number
  cap1: number
  cap2: number
  tracking1: number
  tracking2: number
  /** Ink width both lines actually resolve to. */
  width: number
  targetWidth: number
  clamped: boolean
  lineGap: number
  symbolGap: number
  capOffset1: number
  capOffset2: number
  belowBaseline1: number
}

function solve(
  probe1: FontProbe,
  probe2: FontProbe,
  direction: RefinementDirection,
  symbolInkWidth: number,
  symbolId: string
): Solved {
  const targetWidth = symbolInkWidth * TARGET.widthFactor
  const cap1 = (targetWidth / TARGET.widthPerCap1) * direction.capScale
  const cap2 = cap1 * TARGET.cap2Ratio
  const size1 = cap1 / probe1.capPerEm
  const size2 = cap2 / probe2.capPerEm

  const natural1 = probe1.ink1PerEm * size1
  const natural2 = probe2.ink2PerEm * size2
  const gaps1 = LINE_1.length - 1
  const gaps2 = LINE_2.length - 1

  // Optical quality wins over mathematical equality: if a font would need
  // absurd tracking to reach the target, the block gets narrower instead.
  const ceiling1 = natural1 + gaps1 * TARGET.maxTracking1Em * size1
  const ceiling2 = natural2 + gaps2 * TARGET.maxTracking2Em * size2
  const width = Math.min(targetWidth, ceiling1, ceiling2)

  return {
    size1,
    size2,
    cap1,
    cap2,
    tracking1: (width - natural1) / gaps1,
    tracking2: (width - natural2) / gaps2,
    width,
    targetWidth,
    clamped: width < targetWidth - 0.01,
    lineGap: cap1 * TARGET.lineInkGapCaps * direction.lineGapScale,
    symbolGap: cap1 * (TARGET.symbolGapCaps[symbolId] ?? 1),
    capOffset1: capOffset(probe1, size1),
    capOffset2: capOffset(probe2, size2),
    belowBaseline1: belowBaseline(probe1, size1),
  }
}

// Line height is 1 on both lines, so the leading is split evenly above and
// below. These two offsets turn the specified optical gaps into the margins
// the browser actually needs.
function capOffset(probe: FontProbe, size: number) {
  const ascent = probe.ascentPerEm * size
  const descent = probe.descentPerEm * size
  const halfLeading = (size - (ascent + descent)) / 2
  return halfLeading + (ascent - probe.capPerEm * size)
}

function belowBaseline(probe: FontProbe, size: number) {
  const ascent = probe.ascentPerEm * size
  const descent = probe.descentPerEm * size
  return (size - (ascent + descent)) / 2 + descent
}

export interface RefinementLockupProps {
  symbol: SymbolSpec
  direction: RefinementDirection
  treatment: Treatment
  symbolPx?: number
  background?: 'light' | 'dark'
  caption?: string
  onSolved?: (solved: Solved) => void
}

export function RefinementLockup({
  symbol,
  direction,
  treatment,
  symbolPx = 240,
  background = 'light',
  caption,
  onSolved,
}: RefinementLockupProps) {
  const Symbol = SYMBOL_COMPONENTS[symbol.id]
  const primaryRef = useRef<HTMLSpanElement>(null)
  const secondaryRef = useRef<HTMLSpanElement>(null)
  const [solved, setSolved] = useState<Solved | null>(null)

  const scale = symbolPx / 200
  const inkWidth = (symbol.ink.right - symbol.ink.left) * scale
  const inkHeight = (symbol.ink.bottom - symbol.ink.top) * scale

  const run = useCallback(() => {
    if (!primaryRef.current || !secondaryRef.current) return
    const primaryStyle = getComputedStyle(primaryRef.current)
    const secondaryStyle = getComputedStyle(secondaryRef.current)
    const probe1 = probeFont(primaryStyle.fontFamily, direction.weightPrimary)
    const probe2 = probeFont(secondaryStyle.fontFamily, direction.weightSecondary)
    if (!probe1 || !probe2) return
    const next = solve(probe1, probe2, direction, inkWidth, symbol.id)
    setSolved(next)
    onSolved?.(next)
  }, [direction, inkWidth, symbol.id, onSolved])

  useEffect(() => {
    let cancelled = false
    const attempt = () => {
      if (!cancelled) run()
    }
    attempt()
    document.fonts?.ready.then(() => requestAnimationFrame(attempt))
    return () => {
      cancelled = true
    }
  }, [run])

  const secondaryOffset = solved
    ? solved.lineGap - solved.belowBaseline1 - solved.capOffset2
    : 0

  return (
    <figure className={`rf-lockup rf-lockup-${background}`}>
      <div className="rf-stage">
        <div className="rf-symbol" style={{ width: inkWidth, height: inkHeight }}>
          <div
            style={{
              position: 'absolute',
              left: -symbol.ink.left * scale,
              top: -symbol.ink.top * scale,
              width: symbolPx,
              height: symbolPx,
            }}
          >
            <Symbol />
          </div>
        </div>

        <div
          className="rf-wordmark"
          style={{
            fontFamily: direction.cssFamily,
            marginTop: solved ? solved.symbolGap - solved.capOffset1 : 0,
            opacity: solved ? 1 : 0,
          }}
        >
          <span
            ref={primaryRef}
            className="rf-line"
            style={{
              fontSize: solved?.size1,
              fontWeight: direction.weightPrimary,
              letterSpacing: solved?.tracking1,
              marginRight: solved ? -solved.tracking1 : 0,
              color: treatment.primary.color,
            }}
          >
            {LINE_1}
          </span>
          <span
            ref={secondaryRef}
            className="rf-line"
            style={{
              fontSize: solved?.size2,
              fontWeight: direction.weightSecondary,
              letterSpacing: solved?.tracking2,
              marginRight: solved ? -solved.tracking2 : 0,
              marginTop: secondaryOffset,
              color: treatment.secondary.color,
            }}
          >
            {LINE_2}
          </span>
        </div>
      </div>
      {caption && <figcaption className="rf-caption">{caption}</figcaption>}
    </figure>
  )
}

export function SpecTable({ solved, direction, symbolInkWidth }: {
  solved: Solved | null
  direction: RefinementDirection
  symbolInkWidth: number
}) {
  if (!solved) return <div className="rf-spec rf-spec-empty" />
  const rows: [string, string][] = [
    ['Font', direction.fontLabel.replace(/\s\d.*$/, '')],
    ['Weight', `${direction.weightPrimary} / ${direction.weightSecondary}`],
    ['ASSEMBLY size', `${solved.size1.toFixed(1)} px · cap ${solved.cap1.toFixed(1)} px`],
    [
      'ASSEMBLY tracking',
      `${solved.tracking1.toFixed(2)} px · ${(solved.tracking1 / solved.size1).toFixed(3)} em`,
    ],
    ['INTELLIGENCE LAB size', `${solved.size2.toFixed(1)} px · cap ${solved.cap2.toFixed(1)} px`],
    [
      'INTELLIGENCE LAB tracking',
      `${solved.tracking2.toFixed(2)} px · ${(solved.tracking2 / solved.size2).toFixed(3)} em`,
    ],
    [
      'Line gap',
      `${solved.lineGap.toFixed(1)} px · ${(solved.lineGap / solved.cap1).toFixed(2)} caps`,
    ],
    [
      'Symbol gap',
      `${solved.symbolGap.toFixed(1)} px · ${(solved.symbolGap / solved.cap1).toFixed(2)} caps`,
    ],
    ['Wordmark width', `${solved.width.toFixed(0)} px${solved.clamped ? ' (reduced)' : ''}`],
    ['Symbol ink width', `${symbolInkWidth.toFixed(0)} px`],
    ['Wordmark ÷ symbol', (solved.width / symbolInkWidth).toFixed(3)],
  ]
  return (
    <dl className="rf-spec">
      {rows.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
