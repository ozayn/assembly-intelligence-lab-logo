// Five-step tonal ramp shared by the reference-descendant concepts.
// Every step maps to a direct semantic token backed by one exact color from
// Shiva's approved palette. No palette color is simulated through opacity.
export type Tone = 'navy' | 'blue' | 'teal' | 'lteal' | 'pteal'

export const TONE_ORDER: Tone[] = ['navy', 'blue', 'teal', 'lteal', 'pteal']

export const TONE_FILL: Record<Tone, string> = {
  navy: 'var(--logo-primary)',
  blue: 'var(--logo-secondary)',
  teal: 'var(--logo-accent)',
  lteal: 'var(--logo-light)',
  pteal: 'var(--logo-pale)',
}

export const TONE_OPACITY: Record<Tone, number> = {
  navy: 1,
  blue: 1,
  teal: 1,
  lteal: 1,
  pteal: 1,
}
