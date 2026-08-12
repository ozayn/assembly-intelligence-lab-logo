// Four related refinements rather than four unrelated fonts. Every direction
// is held to the same measured proportions from reference.ts — size, line gap
// and symbol gap are derived, not chosen — so the only real variable between
// them is the letterform and its weight.

export type RefinementId = 'A' | 'B' | 'C' | 'D'

export interface RefinementDirection {
  id: RefinementId
  name: string
  fontLabel: string
  cssFamily: string
  weightPrimary: number
  weightSecondary: number
  // Multiplier on the derived cap height. Below 1 the type shrinks and the
  // solved tracking widens to keep the block on the same width.
  capScale: number
  lineGapScale: number
  note: string
}

const JOST = 'var(--font-jost), "Jost", "Futura", "Century Gothic", sans-serif'
const PLEX = 'var(--font-ibm-plex-sans), "IBM Plex Sans", sans-serif'
const INTER = 'var(--font-inter), "Inter", sans-serif'
const GROTESK = 'var(--font-space-grotesk), "Space Grotesk", sans-serif'

export const DIRECTIONS: RefinementDirection[] = [
  {
    id: 'A',
    name: 'Reference closest',
    fontLabel: 'Jost 400',
    cssFamily: JOST,
    weightPrimary: 400,
    weightSecondary: 400,
    capScale: 1,
    lineGapScale: 1,
    note: 'The control. Jost at the measured proportions exactly — nothing tuned by preference.',
  },
  {
    id: 'B',
    name: 'Reference lighter',
    fontLabel: 'Jost 300 / 400',
    cssFamily: JOST,
    weightPrimary: 300,
    weightSecondary: 400,
    // Smaller caps push more of the fixed width into tracking, which is what
    // makes this read as lighter without thinning the second line.
    capScale: 0.94,
    lineGapScale: 1.08,
    note: 'Same skeleton, less ink. The second line stays at 400 so it survives its small size.',
  },
  {
    id: 'C',
    name: 'Research / humanist',
    fontLabel: 'IBM Plex Sans 400',
    cssFamily: PLEX,
    weightPrimary: 400,
    weightSecondary: 400,
    capScale: 1,
    lineGapScale: 1,
    note: 'Tests whether a research-lab voice survives the reference proportions.',
  },
  {
    id: 'D',
    name: 'Refined modern',
    fontLabel: 'Inter 300 / 400',
    cssFamily: INTER,
    weightPrimary: 300,
    weightSecondary: 400,
    capScale: 0.98,
    lineGapScale: 1,
    note: 'A quiet modernisation of A, chosen over Space Grotesk on the rendered evidence in section 2.',
  },
]

// Kept for the side-by-side that decides direction D. Space Grotesk is the
// alternative candidate the brief allows for that slot.
export const D_CANDIDATES: RefinementDirection[] = [
  { ...DIRECTIONS[3], id: 'D', name: 'Inter', fontLabel: 'Inter 300 / 400', note: '' },
  {
    ...DIRECTIONS[3],
    id: 'D',
    name: 'Space Grotesk',
    fontLabel: 'Space Grotesk 400',
    cssFamily: GROTESK,
    weightPrimary: 400,
    weightSecondary: 400,
    note: '',
  },
]
