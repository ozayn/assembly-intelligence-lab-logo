'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Concept33Static } from '@/components/logos/Concept33FacetedA'
import { Concept34Static } from '@/components/logos/Concept34HexagonalA'
import {
  LINE_1,
  LINE_2,
  type ColorTreatment,
  type Fill,
  type SymbolSpec,
  type TypeDirection,
} from './directions'

const SYMBOL_COMPONENTS = {
  '33': Concept33Static,
  '34': Concept34Static,
}

interface LineMetrics {
  // Advance width with no tracking applied.
  natural: number
  // Distance from the line box's top edge down to the cap line.
  capOffset: number
  // Distance from the baseline down to the line box's bottom edge.
  belowBaseline: number
}

interface FitResult {
  primary: LineMetrics
  secondary: LineMetrics
  trackingPrimary: number
  trackingSecondary: number
}

let sharedContext: CanvasRenderingContext2D | null = null

function getContext(): CanvasRenderingContext2D | null {
  if (sharedContext) return sharedContext
  const canvas = document.createElement('canvas')
  sharedContext = canvas.getContext('2d')
  return sharedContext
}

// Measures a line against the styles actually applied to it, so the numbers
// reflect the loaded webfont rather than an assumed fallback.
function measureLine(el: HTMLElement, text: string): LineMetrics | null {
  const ctx = getContext()
  if (!ctx) return null
  const cs = getComputedStyle(el)
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  const m = ctx.measureText(text)
  const fontSize = parseFloat(cs.fontSize)
  const ascent = m.fontBoundingBoxAscent ?? fontSize * 0.8
  const descent = m.fontBoundingBoxDescent ?? fontSize * 0.2
  const capAscent = m.actualBoundingBoxAscent ?? fontSize * 0.7
  // Line height is 1 on these lines, so the leading is split evenly.
  const halfLeading = (fontSize - (ascent + descent)) / 2
  return {
    natural: m.width,
    capOffset: halfLeading + (ascent - capAscent),
    belowBaseline: halfLeading + descent,
  }
}

function fillStyle(fill: Fill): React.CSSProperties {
  if (fill.kind === 'gradient') {
    return {
      backgroundImage: `linear-gradient(90deg, ${fill.stops.join(', ')})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }
  }
  return { color: fill.color }
}

export interface ExplorationLockupProps {
  symbol: SymbolSpec
  direction: TypeDirection
  treatment: ColorTreatment
  // Optical distance from the symbol's lowest ink to the cap line of
  // ASSEMBLY, as a fraction of the rendered symbol size.
  gapRatio: number
  symbolPx?: number
  // Wordmark width as a fraction of the symbol's ink width.
  widthFactor?: number
  background?: 'light' | 'dark'
  caption?: string
  // 'compact' collapses the specification to a single line, for the export
  // sheet where vertical space is at a premium.
  spec?: 'full' | 'compact' | 'none'
  compact?: boolean
}

export function ExplorationLockup({
  symbol,
  direction,
  treatment,
  gapRatio,
  symbolPx = 190,
  widthFactor = 1,
  background = 'light',
  caption,
  spec = 'full',
  compact = false,
}: ExplorationLockupProps) {
  const Symbol = SYMBOL_COMPONENTS[symbol.id]
  const primaryRef = useRef<HTMLSpanElement>(null)
  const secondaryRef = useRef<HTMLSpanElement>(null)
  const [fit, setFit] = useState<FitResult | null>(null)

  const scale = symbolPx / 200
  const inkWidth = (symbol.ink.right - symbol.ink.left) * scale
  const inkHeight = (symbol.ink.bottom - symbol.ink.top) * scale
  const targetWidth = inkWidth * widthFactor
  const primarySize = inkWidth * direction.primarySizeRatio
  const secondarySize = primarySize * direction.secondarySizeRatio
  const symbolGap = symbolPx * gapRatio
  const lineGap = primarySize * direction.lineGapEm

  const runFit = useCallback(() => {
    if (!primaryRef.current || !secondaryRef.current) return
    const primary = measureLine(primaryRef.current, LINE_1)
    const secondary = measureLine(secondaryRef.current, LINE_2)
    if (!primary || !secondary) return
    setFit({
      primary,
      secondary,
      // Tracking sits between characters only; the trailing space is removed
      // below with a negative margin, so it is divided across n-1 gaps.
      trackingPrimary: (targetWidth - primary.natural) / (LINE_1.length - 1),
      trackingSecondary: (targetWidth - secondary.natural) / (LINE_2.length - 1),
    })
  }, [targetWidth])

  useEffect(() => {
    let cancelled = false
    const attempt = () => {
      if (!cancelled) runFit()
    }
    attempt()
    document.fonts?.ready.then(() => {
      requestAnimationFrame(attempt)
    })
    return () => {
      cancelled = true
    }
  }, [runFit, direction.id, primarySize, secondarySize])

  const trackingPrimary = fit?.trackingPrimary ?? 0
  const trackingSecondary = fit?.trackingSecondary ?? 0
  // Pull the wordmark up by the empty band above the caps so the specified
  // gap is the distance the eye actually sees.
  const wordmarkOffset = symbolGap - (fit?.primary.capOffset ?? 0)
  const secondaryOffset =
    lineGap - (fit?.primary.belowBaseline ?? 0) - (fit?.secondary.capOffset ?? 0)

  const blockGradientStyle: React.CSSProperties = treatment.blockGradient
    ? {
        backgroundImage: `linear-gradient(90deg, ${treatment.blockGradient.join(', ')})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }
    : {}

  return (
    <figure
      className={`tx-lockup tx-lockup-${background}${compact ? ' tx-lockup-compact' : ''}`}
    >
      <div className="tx-stage">
        <div
          className="tx-symbol"
          style={{ width: inkWidth, height: inkHeight }}
        >
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
          className="tx-wordmark"
          style={{
            width: targetWidth,
            marginTop: wordmarkOffset,
            fontFamily: direction.cssFamily,
            opacity: fit ? 1 : 0,
            ...blockGradientStyle,
          }}
        >
          <span
            ref={primaryRef}
            className="tx-line"
            style={{
              fontSize: primarySize,
              fontWeight: direction.weightPrimary,
              letterSpacing: trackingPrimary,
              marginRight: -trackingPrimary,
              ...(treatment.blockGradient ? {} : fillStyle(treatment.primary)),
            }}
          >
            {LINE_1}
          </span>
          <span
            ref={secondaryRef}
            className="tx-line"
            style={{
              fontSize: secondarySize,
              fontWeight: direction.weightSecondary,
              letterSpacing: trackingSecondary,
              marginRight: -trackingSecondary,
              marginTop: secondaryOffset,
              ...(treatment.blockGradient ? {} : fillStyle(treatment.secondary)),
            }}
          >
            {LINE_2}
          </span>
        </div>
      </div>

      {caption && <figcaption className="tx-caption">{caption}</figcaption>}

      {spec === 'compact' && (
        <p className="tx-spec-line">
          {direction.fontLabel} {direction.weightPrimary}/{direction.weightSecondary} ·
          ASSEMBLY {primarySize.toFixed(1)}px /{' '}
          {(trackingPrimary / primarySize).toFixed(3)}em · INTELLIGENCE LAB{' '}
          {secondarySize.toFixed(1)}px / {(trackingSecondary / secondarySize).toFixed(3)}em ·
          line gap {lineGap.toFixed(1)}px · symbol gap {symbolGap.toFixed(1)}px (
          {(gapRatio * 100).toFixed(0)}%) · width {targetWidth.toFixed(0)}px = symbol ink ·{' '}
          {treatment.label}
        </p>
      )}

      {spec === 'full' && (
        <dl className="tx-spec">
          <div>
            <dt>Font</dt>
            <dd>
              {direction.fontLabel} {direction.weightPrimary}/{direction.weightSecondary}
            </dd>
          </div>
          <div>
            <dt>ASSEMBLY</dt>
            <dd>
              {primarySize.toFixed(1)}px · tracking {trackingPrimary.toFixed(2)}px (
              {(trackingPrimary / primarySize).toFixed(3)}em)
            </dd>
          </div>
          <div>
            <dt>INTELLIGENCE LAB</dt>
            <dd>
              {secondarySize.toFixed(1)}px · tracking {trackingSecondary.toFixed(2)}px (
              {(trackingSecondary / secondarySize).toFixed(3)}em)
            </dd>
          </div>
          <div>
            <dt>Line gap</dt>
            <dd>
              {lineGap.toFixed(1)}px ({direction.lineGapEm}em)
            </dd>
          </div>
          <div>
            <dt>Symbol gap</dt>
            <dd>
              {symbolGap.toFixed(1)}px ({(gapRatio * 100).toFixed(0)}% of symbol)
            </dd>
          </div>
          <div>
            <dt>Widths</dt>
            <dd>
              text {targetWidth.toFixed(0)}px · symbol ink {inkWidth.toFixed(0)}px
            </dd>
          </div>
          <div>
            <dt>Colour</dt>
            <dd>{treatment.label}</dd>
          </div>
        </dl>
      )}
    </figure>
  )
}
