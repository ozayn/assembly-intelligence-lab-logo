'use client'

import {
  WORDMARK_LINE_1,
  WORDMARK_LINE_2,
  WORDMARK_SECONDARY_SCALE,
  WORDMARK_SECONDARY_TRACKING_SCALE,
  type TypographySystem,
} from './typographySystems'

interface BrandWordmarkProps {
  typeSystem: TypographySystem
  fontSize: number
  letterSpacing: number
  align?: 'center' | 'left'
}

export function BrandWordmark({
  typeSystem,
  fontSize,
  letterSpacing,
  align = 'center',
}: BrandWordmarkProps) {
  return (
    <span
      className="brand-wordmark"
      style={{
        fontFamily: typeSystem.fontFamily,
        fontWeight: typeSystem.fontWeight,
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <span
        className="brand-wordmark-primary"
        style={{
          fontSize: `${fontSize}px`,
          letterSpacing: `${letterSpacing}px`,
          lineHeight: typeSystem.lineHeight,
        }}
      >
        {WORDMARK_LINE_1}
      </span>
      <span
        className="brand-wordmark-secondary"
        style={{
          fontSize: `${fontSize * WORDMARK_SECONDARY_SCALE}px`,
          letterSpacing: `${letterSpacing * WORDMARK_SECONDARY_TRACKING_SCALE}px`,
          lineHeight: typeSystem.lineHeight,
        }}
      >
        {WORDMARK_LINE_2}
      </span>
    </span>
  )
}
