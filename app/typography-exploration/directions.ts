// Configuration for the wordmark typography exploration. Deliberately
// separate from components/typographySystems.ts: nothing here feeds the
// production lockup, so the current default stays untouched while these
// directions are compared.

export const LINE_1 = 'ASSEMBLY'
export const LINE_2 = 'INTELLIGENCE LAB'

export type DirectionId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface TypeDirection {
  id: DirectionId
  name: string
  fontLabel: string
  cssFamily: string
  weightPrimary: number
  weightSecondary: number
  // ASSEMBLY's size as a fraction of the symbol's ink width, and
  // INTELLIGENCE LAB as a fraction of ASSEMBLY. Tracking is not fixed here —
  // it is solved per line at render time so both lines land on the same
  // measured width, which is what the reference lockups actually do.
  primarySizeRatio: number
  secondarySizeRatio: number
  // Optical gap between the two baselines' ink, in ems of ASSEMBLY.
  lineGapEm: number
  note: string
}

export const DIRECTIONS: TypeDirection[] = [
  {
    id: 'A',
    name: 'Reference / Geometric',
    fontLabel: 'Jost',
    cssFamily: 'var(--font-jost), "Jost", "Futura", "Century Gothic", sans-serif',
    weightPrimary: 400,
    weightSecondary: 400,
    primarySizeRatio: 0.175,
    secondarySizeRatio: 0.5,
    lineGapEm: 0.3,
    note: 'Futura-lineage geometric sans, the closest available match to the reference lockups.',
  },
  {
    id: 'B',
    name: 'Scientific / Humanist',
    fontLabel: 'IBM Plex Sans',
    cssFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", sans-serif',
    weightPrimary: 400,
    weightSecondary: 400,
    primarySizeRatio: 0.165,
    secondarySizeRatio: 0.48,
    lineGapEm: 0.3,
    note: 'Humanist research sans with a slightly narrower, more serious colour on the page.',
  },
  {
    id: 'C',
    name: 'Technical',
    fontLabel: 'Space Grotesk',
    cssFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
    weightPrimary: 500,
    weightSecondary: 400,
    primarySizeRatio: 0.165,
    secondarySizeRatio: 0.48,
    lineGapEm: 0.32,
    note: 'Engineered proportional grotesque — the drawn-to-a-grid feel without a monospaced wordmark.',
  },
  {
    id: 'D',
    name: 'Contemporary Research',
    fontLabel: 'Archivo',
    cssFamily: 'var(--font-archivo), "Archivo", sans-serif',
    weightPrimary: 500,
    weightSecondary: 400,
    primarySizeRatio: 0.16,
    secondarySizeRatio: 0.48,
    lineGapEm: 0.32,
    note: 'Institutional grotesque with sturdier letterforms; reads as an established organisation.',
  },
  {
    id: 'E',
    name: 'Refined Minimal',
    fontLabel: 'Inter',
    cssFamily: 'var(--font-inter), "Inter", sans-serif',
    weightPrimary: 300,
    weightSecondary: 400,
    // Set smaller than the others on purpose: at a wide light weight the
    // fitted tracking only becomes generous once ASSEMBLY stops filling the
    // width on its own.
    primarySizeRatio: 0.15,
    secondarySizeRatio: 0.5,
    lineGapEm: 0.34,
    note: 'Light weight, wide tracking, small solid second line — a design-studio treatment.',
  },
]

export const DIRECTION_BY_ID = Object.fromEntries(
  DIRECTIONS.map(d => [d.id, d])
) as Record<DirectionId, TypeDirection>

// Official palette. No other values are used anywhere on this page.
export const PALETTE = {
  navy: '#08255A',
  blue: '#0B4B70',
  teal: '#109596',
  lightTeal: '#58B7B1',
  paleTeal: '#B7DEDA',
} as const

export type Fill =
  | { kind: 'solid'; color: string }
  | { kind: 'gradient'; stops: string[] }

export interface ColorTreatment {
  id: string
  name: string
  primary: Fill
  secondary: Fill
  // A block gradient spans both lines as one continuous ramp rather than
  // restarting on each line.
  blockGradient?: string[]
  label: string
  note: string
}

export const LIGHT_TREATMENTS: ColorTreatment[] = [
  {
    id: 'two-tone',
    name: 'Classic two-tone',
    primary: { kind: 'solid', color: PALETTE.navy },
    secondary: { kind: 'solid', color: PALETTE.teal },
    label: 'Navy + teal',
    note: 'Baseline. Closest to the supplied references.',
  },
  {
    id: 'all-navy',
    name: 'All navy',
    primary: { kind: 'solid', color: PALETTE.navy },
    secondary: { kind: 'solid', color: PALETTE.navy },
    label: 'Navy + navy',
    note: 'Most institutional; hierarchy carried by size alone.',
  },
  {
    id: 'navy-blue',
    name: 'Navy + blue',
    primary: { kind: 'solid', color: PALETTE.navy },
    secondary: { kind: 'solid', color: PALETTE.blue },
    label: 'Navy + blue',
    note: 'A quieter step than navy + teal.',
  },
  {
    id: 'gradient-line',
    name: 'Gradient ASSEMBLY',
    primary: { kind: 'gradient', stops: [PALETTE.navy, PALETTE.blue, PALETTE.teal] },
    secondary: { kind: 'solid', color: PALETTE.teal },
    label: 'Gradient line 1 + solid teal',
    note: 'Experiment: ramp on the dominant line only.',
  },
  {
    id: 'gradient-full',
    name: 'Full wordmark gradient',
    primary: { kind: 'solid', color: 'inherit' },
    secondary: { kind: 'solid', color: 'inherit' },
    blockGradient: [PALETTE.navy, PALETTE.blue, PALETTE.teal, PALETTE.lightTeal],
    label: 'Continuous ramp, both lines',
    note: 'Experiment: one ramp travelling across the whole block.',
  },
]

export const DARK_TREATMENTS: ColorTreatment[] = [
  {
    id: 'dark-two-tone',
    name: 'Classic two-tone (dark)',
    primary: { kind: 'solid', color: PALETTE.paleTeal },
    secondary: { kind: 'solid', color: PALETTE.lightTeal },
    label: 'Pale teal + light teal',
    note: 'Same hierarchy as the light baseline, roles remapped for contrast.',
  },
  {
    id: 'dark-single',
    name: 'Single tone (dark)',
    primary: { kind: 'solid', color: PALETTE.paleTeal },
    secondary: { kind: 'solid', color: PALETTE.paleTeal },
    label: 'Pale teal + pale teal',
    note: 'The restrained institutional option on dark.',
  },
  {
    id: 'dark-gradient',
    name: 'Full gradient (dark)',
    primary: { kind: 'solid', color: 'inherit' },
    secondary: { kind: 'solid', color: 'inherit' },
    blockGradient: [PALETTE.paleTeal, PALETTE.lightTeal, PALETTE.teal],
    label: 'Continuous ramp, both lines',
    note: 'Experiment, for comparison with the flat dark options.',
  },
]

export type SpacingId = 'tight' | 'balanced' | 'airy'

export interface SpacingStep {
  id: SpacingId
  name: string
  // Optical distance from the symbol's lowest ink to the cap line of
  // ASSEMBLY, as a fraction of the symbol's rendered size.
  gapRatio: number
}

export const SPACING_STEPS: SpacingStep[] = [
  { id: 'tight', name: 'Tight', gapRatio: 0.05 },
  { id: 'balanced', name: 'Balanced', gapRatio: 0.09 },
  { id: 'airy', name: 'Airy', gapRatio: 0.15 },
]

export const SPACING_BY_ID = Object.fromEntries(
  SPACING_STEPS.map(s => [s.id, s])
) as Record<SpacingId, SpacingStep>

export interface SymbolSpec {
  id: '33' | '34'
  label: string
  // Extent of actual ink inside the 200×200 viewBox, taken from each mark's
  // geometry. Used to crop the empty margin so spacing and width comparisons
  // are made against the visible mark rather than its bounding box.
  ink: { left: number; right: number; top: number; bottom: number }
}

const HEX_HALF_WIDTH = (20.3 * Math.sqrt(3)) / 2

export const SYMBOLS: SymbolSpec[] = [
  {
    id: '33',
    label: '33 — Faceted A',
    ink: { left: 15, right: 185, top: 25, bottom: 169 },
  },
  {
    id: '34',
    label: '34 — Hexagonal A',
    ink: {
      left: 40 - HEX_HALF_WIDTH,
      right: 160 + HEX_HALF_WIDTH,
      top: 13.7,
      bottom: 159.3,
    },
  },
]
