import { ExplorationPage } from '@/components/ExplorationPage'
import { FINAL_NOMINEES } from '@/components/logos'

export const metadata = {
  title: 'Final Nominees — Assembly Intelligence Lab',
  description: 'The four remaining logo concepts — Axis, Faceted A, Hexagonal A and the Assembly Transition hybrid — shown together.',
}

// The same collection view the review pages use, given the nominees instead of
// a page of concepts. Each of them keeps its own page and its place in the
// review set; this is only a quieter place to compare them.
export default function FinalNomineesPage() {
  return (
    <ExplorationPage
      concepts={FINAL_NOMINEES}
      tagline="Final Nominees"
      showExport={false}
      initialLockup="contemporary"
    />
  )
}
