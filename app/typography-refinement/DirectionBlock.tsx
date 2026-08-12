'use client'

import { useState } from 'react'
import { RefinementLockup, SpecTable, type Solved } from './RefinementLockup'
import type { RefinementDirection } from './directions'
import { TREATMENTS, type SymbolSpec } from './reference'

interface DirectionBlockProps {
  direction: RefinementDirection
  symbol: SymbolSpec
  symbolPx?: number
  background?: 'light' | 'dark'
}

// One direction against one symbol, in both approved colour treatments. The
// two treatments share every measurement, so the specification is reported
// once for the pair.
export function DirectionBlock({
  direction,
  symbol,
  symbolPx = 230,
  background = 'light',
}: DirectionBlockProps) {
  const [solved, setSolved] = useState<Solved | null>(null)
  const inkWidth = ((symbol.ink.right - symbol.ink.left) * symbolPx) / 200

  return (
    <div className="rf-block">
      <p className="rf-block-head">
        <span className="rf-badge">{direction.id}</span>
        {symbol.label}
        <em>{direction.fontLabel}</em>
      </p>
      <div className="rf-pair">
        {TREATMENTS.map((treatment, i) => (
          <RefinementLockup
            key={treatment.id}
            symbol={symbol}
            direction={direction}
            treatment={treatment}
            symbolPx={symbolPx}
            background={background}
            caption={treatment.name}
            onSolved={i === 0 ? setSolved : undefined}
          />
        ))}
      </div>
      <SpecTable solved={solved} direction={direction} symbolInkWidth={inkWidth} />
    </div>
  )
}
