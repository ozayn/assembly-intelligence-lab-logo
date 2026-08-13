import { ExplorationPage } from '@/components/ExplorationPage'
import { FINAL_NOMINEES } from '@/components/logos'

export const metadata = {
  title: 'Final Nominees — Assembly Intelligence Lab',
  description: 'The two remaining logo concepts, Faceted A and Hexagonal A, shown side by side.',
}

// The same collection view the review pages use, given two concepts instead of
// a page of them. Concepts 33 and 34 keep their own pages and their place in
// the review set; this is only a quieter place to compare them.
export default function FinalNomineesPage() {
  return (
    <ExplorationPage
      concepts={FINAL_NOMINEES}
      tagline="Final Nominees"
      showExport={false}
    />
  )
}
