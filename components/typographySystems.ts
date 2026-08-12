// Single source of truth for the wordmark typography exploration and the
// symbol+company-name lockup system. Reused by TypographyLockup.tsx (broad
// side-by-side comparison) and LogoCard.tsx (the selectable preview/export
// that mirrors exactly what downloads) — no separate/duplicated definitions.

export type TypographyDirection = 'scientific' | 'editorial' | 'technical'

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
