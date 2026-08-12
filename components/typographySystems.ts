// Single source of truth for the wordmark typography exploration and the
// symbol+company-name lockup system. Reused by TypographyLockup.tsx (broad
// side-by-side comparison) and LogoCard.tsx (the selectable preview/export
// that mirrors exactly what downloads) — no separate/duplicated definitions.

export type TypographyDirection =
  | 'scientific'
  | 'editorial'
  | 'technical'
  | 'contemporary'

// A width-fitted treatment sizes itself from the symbol's ink rather than from
// fixed point sizes, and solves tracking per line so both lines finish on the
// same width. Only systems that carry this spec behave that way; the original
// three are untouched and keep their fixed metrics.
export interface FittedSpec {
  primaryWeight: number
  secondaryWeight: number
  // ASSEMBLY's size as a fraction of the symbol's ink width.
  primarySizeRatio: number
  // INTELLIGENCE LAB's size as a fraction of ASSEMBLY's.
  secondarySizeRatio: number
  // ASSEMBLY baseline to the cap line of INTELLIGENCE LAB, in ems of ASSEMBLY.
  lineGapEm: number
  // Symbol's lowest ink to the cap line of ASSEMBLY, as a fraction of the
  // rendered symbol size.
  symbolGapRatio: number
  // Wordmark width as a fraction of the symbol's ink width.
  widthFactor: number
}

export interface TypographySystem {
  name: string
  // Used for live preview + text measurement — leads with the next/font CSS
  // variable so the actual loaded webfont is used in-page.
  fontFamily: string
  // Used for the embedded SVG font-family attribute — a plain literal stack
  // with no CSS var(), since that variable doesn't exist once the file is
  // opened outside this page. The named font must be installed/available
  // wherever the SVG is opened, or it falls back per this stack.
  exportFontFamily: string
  fontWeight: number
  fontSize: number
  letterSpacing: number
  lineHeight: number
  description: string
  // Present only on width-fitted systems. Stacked tiers render from these
  // measurements; horizontal tiers fall back to the fixed metrics above,
  // since matching the symbol's width is a stacked idea.
  fitted?: FittedSpec
  // Two-tone systems colour the second line separately, through the
  // --logo-wordmark-* tokens rather than a single --logo-primary.
  twoTone?: boolean
}

export const TYPOGRAPHY_SYSTEMS: Record<TypographyDirection, TypographySystem> = {
  scientific: {
    name: 'Scientific / Precise',
    fontFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    exportFontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: 17,
    letterSpacing: 3.5,
    lineHeight: 1,
    description: 'Clean, rational, contemporary. High clarity.',
  },
  editorial: {
    name: 'Editorial / Research',
    fontFamily: 'var(--font-newsreader), "Newsreader", "Lora", Georgia, serif',
    exportFontFamily: '"Newsreader", "Lora", Georgia, serif',
    fontWeight: 400,
    fontSize: 17,
    letterSpacing: 3,
    lineHeight: 1.02,
    description: 'Distinctive, intellectual. Contemporary editorial quality.',
  },
  technical: {
    name: 'Technical / Experimental',
    fontFamily: 'var(--font-space-mono), "Space Mono", "IBM Plex Mono", monospace',
    exportFontFamily: '"Space Mono", "IBM Plex Mono", monospace',
    fontWeight: 400,
    fontSize: 17,
    letterSpacing: 3.5,
    lineHeight: 1,
    description: 'Geometric, engineered. Deliberate clarity.',
  },
  // Shiva's selection from /typography-exploration: Direction D at Tight
  // spacing in the classic two-tone. Every value below is the one that page
  // uses, not a re-derivation — see app/typography-exploration/directions.ts
  // (DIRECTIONS[3], SPACING_STEPS 'tight', LIGHT_TREATMENTS 'two-tone').
  contemporary: {
    name: 'Contemporary Research',
    fontFamily: 'var(--font-archivo), "Archivo", sans-serif',
    exportFontFamily: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 500,
    // Fixed metrics, used only by the horizontal header tier. Matched to the
    // other systems so that fallback stays consistent with them.
    fontSize: 17,
    letterSpacing: 3.5,
    lineHeight: 1,
    description: 'Institutional grotesque, sized and tracked to the symbol. From the typography exploration.',
    fitted: {
      primaryWeight: 500,
      secondaryWeight: 400,
      primarySizeRatio: 0.16,
      secondarySizeRatio: 0.48,
      lineGapEm: 0.32,
      symbolGapRatio: 0.05,
      widthFactor: 1,
    },
    twoTone: true,
  },
}

export const COMPANY_NAME = 'Assembly Intelligence Lab'
export const WORDMARK_LINE_1 = 'ASSEMBLY'
export const WORDMARK_LINE_2 = 'INTELLIGENCE LAB'
export const WORDMARK_SECONDARY_SCALE = 0.48
export const WORDMARK_SECONDARY_TRACKING_SCALE = 0.66
export const LOCKUP_SYMBOL_SCALE = 1.1

// Application tiers for the "With Company Name" lockup. Full/Compact use the
// stacked treatment (primary brand presentation); Header uses horizontal,
// since that's the orientation suited to a website header bar. Sizes reuse
// the exact scale values already established in the stacked/horizontal
// lockup exploration (TypographyLockup) — nothing new invented.
export type ApplicationTier = 'full' | 'header' | 'compact'

export interface TierConfig {
  label: string
  orientation: 'stacked' | 'horizontal'
  symbolPx: number
  fontSizeOverride?: number
  letterSpacingScale: number
  gap: number
}

export const APPLICATION_TIERS: Record<ApplicationTier, TierConfig> = {
  full: { label: 'Full', orientation: 'stacked', symbolPx: 120, letterSpacingScale: 1, gap: 5 },
  header: { label: 'Header', orientation: 'horizontal', symbolPx: 32, fontSizeOverride: 7, letterSpacingScale: 0.55, gap: 8 },
  compact: { label: 'Compact', orientation: 'stacked', symbolPx: 64, fontSizeOverride: 7, letterSpacingScale: 0.6, gap: 3 },
}
