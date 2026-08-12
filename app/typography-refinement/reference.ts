// Round 2. Everything here is derived from pixel measurements of the two
// supplied reference lockups, not from estimates by eye. The raster sources
// live in public/reference/ and are shown on the page next to the numbers.
//
// Deliberately independent of app/typography-exploration: round 1 stays frozen
// as the record of the broad search. Only the symbol geometry and the palette
// are shared, since those have a single source of truth.

import { PALETTE, SYMBOLS, type SymbolSpec } from '../typography-exploration/directions'

export { PALETTE, SYMBOLS }
export type { SymbolSpec }

export const LINE_1 = 'ASSEMBLY'
export const LINE_2 = 'INTELLIGENCE LAB'

export interface ReferenceMeasurement {
  id: 'faceted' | 'hexagonal'
  label: string
  image: string
  pairedWith: string
  // Pixel bounds of the ink in the 1024×1024 source.
  symbol: { width: number; height: number }
  line1: { width: number; cap: number }
  line2: { width: number; cap: number }
  // Vertical distances between the ink of each element.
  symbolToCap: number
  baselineToBaseline: number
  lineInkGap: number
  // Mean whitespace between adjacent glyphs, in cap heights.
  letterGap1: number
  letterGap2: number
}

export const REFERENCES: ReferenceMeasurement[] = [
  {
    id: 'faceted',
    label: 'Reference for the faceted A',
    image: '/reference/faceted-a.png',
    pairedWith: '33',
    symbol: { width: 652, height: 521 },
    line1: { width: 776, cap: 70 },
    line2: { width: 768, cap: 39 },
    symbolToCap: 99,
    baselineToBaseline: 84,
    lineInkGap: 46,
    letterGap1: 0.653,
    letterGap2: 0.586,
  },
  {
    id: 'hexagonal',
    label: 'Reference for the hexagonal A',
    image: '/reference/hexagonal-a.png',
    pairedWith: '34',
    symbol: { width: 648, height: 610 },
    line1: { width: 714, cap: 60 },
    line2: { width: 599, cap: 24 },
    symbolToCap: 42,
    baselineToBaseline: 57,
    lineInkGap: 34,
    letterGap1: 0.874,
    letterGap2: 0.975,
  },
]

export interface DerivedRatio {
  key: string
  label: string
  faceted: string
  hexagonal: string
  target: string
  note: string
}

function n(value: number, digits = 2) {
  return value.toFixed(digits)
}

const [faceted, hexagonal] = REFERENCES

// The proportions the refinement actually targets. Where the two references
// disagree the midpoint is taken, except for the width of the block, which is
// held to the brief's ceiling rather than the references' own behaviour.
export const TARGET = {
  // ASSEMBLY ink width divided by its cap height. This single number carries
  // most of the reference's character: it is what forces the wide tracking.
  widthPerCap1: 11.5,
  // INTELLIGENCE LAB cap height as a fraction of ASSEMBLY's.
  cap2Ratio: 0.48,
  // Whitespace between the two lines' ink, in ASSEMBLY cap heights.
  lineInkGapCaps: 0.61,
  // Wordmark ink width as a fraction of the symbol's ink width.
  widthFactor: 0.97,
  // Symbol ink bottom to ASSEMBLY cap line, in cap heights. Split per symbol.
  symbolGapCaps: { '33': 0.9, '34': 1.15 } as Record<string, number>,
  // Guard rails. Reached only if a font would need absurd tracking to make the
  // two lines equal; the width target is then reduced instead.
  maxTracking1Em: 0.55,
  maxTracking2Em: 0.68,
}

export const DERIVED: DerivedRatio[] = [
  {
    key: 'w1',
    label: 'ASSEMBLY ink width',
    faceted: `${faceted.line1.width} px`,
    hexagonal: `${hexagonal.line1.width} px`,
    target: '—',
    note: 'Measured left edge of A to right edge of Y.',
  },
  {
    key: 'w2',
    label: 'INTELLIGENCE LAB ink width',
    faceted: `${faceted.line2.width} px`,
    hexagonal: `${hexagonal.line2.width} px`,
    target: '—',
    note: 'Same method on the second line.',
  },
  {
    key: 'wratio',
    label: 'Line 2 width ÷ line 1 width',
    faceted: n(faceted.line2.width / faceted.line1.width),
    hexagonal: n(hexagonal.line2.width / hexagonal.line1.width),
    target: '1.00',
    note: 'The faceted reference sets them equal; the hexagonal one lets line 2 run short.',
  },
  {
    key: 'capratio',
    label: 'Line 2 cap ÷ line 1 cap',
    faceted: n(faceted.line2.cap / faceted.line1.cap),
    hexagonal: n(hexagonal.line2.cap / hexagonal.line1.cap),
    target: n(TARGET.cap2Ratio),
    note: 'The largest disagreement between the two references. The midpoint is used.',
  },
  {
    key: 'wpercap1',
    label: 'ASSEMBLY width ÷ its cap height',
    faceted: n(faceted.line1.width / faceted.line1.cap),
    hexagonal: n(hexagonal.line1.width / hexagonal.line1.cap),
    target: n(TARGET.widthPerCap1),
    note: 'The tracking driver. No sans reaches 11.5 untracked — Jost sits at 6.6.',
  },
  {
    key: 'wpercap2',
    label: 'INTELLIGENCE LAB width ÷ its cap height',
    faceted: n(faceted.line2.width / faceted.line2.cap),
    hexagonal: n(hexagonal.line2.width / hexagonal.line2.cap),
    target: n(TARGET.widthPerCap1 / TARGET.cap2Ratio),
    note: 'Follows from equal line widths and the cap ratio above.',
  },
  {
    key: 'track1',
    label: 'Letter gap on ASSEMBLY (cap heights)',
    faceted: n(faceted.letterGap1),
    hexagonal: n(hexagonal.letterGap1),
    target: '0.65 – 0.87',
    note: 'Whitespace between glyph ink, averaged. Solved per font rather than fixed.',
  },
  {
    key: 'track2',
    label: 'Letter gap on INTELLIGENCE LAB (cap heights)',
    faceted: n(faceted.letterGap2),
    hexagonal: n(hexagonal.letterGap2),
    target: '0.59 – 0.98',
    note: 'Word space excluded from the average.',
  },
  {
    key: 'lines',
    label: 'Gap between the two lines ÷ line 1 cap',
    faceted: n(faceted.lineInkGap / faceted.line1.cap),
    hexagonal: n(hexagonal.lineInkGap / hexagonal.line1.cap),
    target: n(TARGET.lineInkGapCaps),
    note: 'Ink to ink, not baseline to baseline.',
  },
  {
    key: 'baselines',
    label: 'Baseline to baseline ÷ line 1 cap',
    faceted: n(faceted.baselineToBaseline / faceted.line1.cap),
    hexagonal: n(hexagonal.baselineToBaseline / hexagonal.line1.cap),
    target: '≈ 1.09',
    note: 'Follows from the cap ratio and the ink gap.',
  },
  {
    key: 'symgap',
    label: 'Symbol to ASSEMBLY cap ÷ line 1 cap',
    faceted: n(faceted.symbolToCap / faceted.line1.cap),
    hexagonal: n(hexagonal.symbolToCap / hexagonal.line1.cap),
    target: '0.90 / 1.15',
    note: 'The references disagree by 2×. Split per symbol, tighter under 33.',
  },
  {
    key: 'blockwidth',
    label: 'Wordmark width ÷ symbol ink width',
    faceted: n(faceted.line1.width / faceted.symbol.width),
    hexagonal: n(hexagonal.line1.width / hexagonal.symbol.width),
    target: n(TARGET.widthFactor),
    note: 'Both references run wider than their symbol. The brief caps this at 1.00.',
  },
]

export type Fill = { color: string }

export interface Treatment {
  id: string
  name: string
  primary: Fill
  secondary: Fill
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'navy-teal',
    name: 'Navy + teal',
    primary: { color: PALETTE.navy },
    secondary: { color: PALETTE.teal },
  },
  {
    id: 'all-navy',
    name: 'All navy',
    primary: { color: PALETTE.navy },
    secondary: { color: PALETTE.navy },
  },
]
