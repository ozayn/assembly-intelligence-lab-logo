'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  FULL_INK,
  measureSymbolInk,
  solveFittedLockup,
  type FittedSolution,
  type SymbolInk,
} from './lockupFitting'
import {
  WORDMARK_LINE_1,
  WORDMARK_LINE_2,
  type TypographySystem,
} from './typographySystems'

interface FittedLockupProps {
  /** What to show — may be the animated mark. */
  symbol: React.ReactNode
  system: TypographySystem
  symbolPx: number
  /**
   * Static source to take ink bounds from. Supplied when the displayed mark
   * may be mid-animation, so the layout does not move while it plays.
   */
  measureRef?: RefObject<HTMLElement | null>
  /** Forces re-measurement when the mark changes. */
  symbolKey?: string | number
}

export function FittedLockup({
  symbol,
  system,
  symbolPx,
  measureRef,
  symbolKey,
}: FittedLockupProps) {
  const spec = system.fitted
  const ownRef = useRef<HTMLDivElement>(null)
  const [ink, setInk] = useState<SymbolInk>(FULL_INK)
  const [solved, setSolved] = useState<FittedSolution | null>(null)

  useEffect(() => {
    const measured =
      measureSymbolInk(measureRef?.current ?? null) ?? measureSymbolInk(ownRef.current)
    if (measured) setInk(measured)
  }, [measureRef, symbolKey])

  useEffect(() => {
    if (!spec) return
    let cancelled = false
    const attempt = () => {
      if (cancelled) return
      const next = solveFittedLockup(system, spec, ink, symbolPx)
      if (next) setSolved(next)
    }
    attempt()
    // Measuring before the webfont lands would fit the fallback's widths.
    document.fonts?.ready.then(() => requestAnimationFrame(attempt))
    return () => {
      cancelled = true
    }
  }, [system, spec, ink, symbolPx])

  if (!spec) return null

  const scale = symbolPx / 200
  const inkWidth = (ink.right - ink.left) * scale
  const inkHeight = (ink.bottom - ink.top) * scale

  // Pull the wordmark up by the empty band above the caps, so the specified
  // gap is the distance the eye actually sees.
  const wordmarkOffset = solved ? solved.symbolGap - solved.primary.capOffset : 0
  const secondaryOffset = solved
    ? solved.lineGap - solved.primary.belowBaseline - solved.secondary.capOffset
    : 0

  return (
    <div className="fitted-lockup">
      <div className="fitted-symbol" style={{ width: inkWidth, height: inkHeight }} ref={ownRef}>
        <div
          style={{
            position: 'absolute',
            left: -ink.left * scale,
            top: -ink.top * scale,
            width: symbolPx,
            height: symbolPx,
          }}
        >
          {symbol}
        </div>
      </div>

      <div
        className="fitted-wordmark"
        style={{
          width: solved?.targetWidth,
          marginTop: wordmarkOffset,
          fontFamily: system.fontFamily,
          opacity: solved ? 1 : 0,
        }}
      >
        <span
          className="fitted-line fitted-line-primary"
          style={{
            fontSize: solved?.primarySize,
            fontWeight: spec.primaryWeight,
            letterSpacing: solved?.trackingPrimary,
            marginRight: solved ? -solved.trackingPrimary : 0,
          }}
        >
          {WORDMARK_LINE_1}
        </span>
        <span
          className="fitted-line fitted-line-secondary"
          style={{
            fontSize: solved?.secondarySize,
            fontWeight: spec.secondaryWeight,
            letterSpacing: solved?.trackingSecondary,
            marginRight: solved ? -solved.trackingSecondary : 0,
            marginTop: secondaryOffset,
          }}
        >
          {WORDMARK_LINE_2}
        </span>
      </div>
    </div>
  )
}
