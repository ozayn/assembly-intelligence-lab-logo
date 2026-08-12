'use client'

import { forwardRef } from 'react'
import { RefinementStudy } from './RefinementStudy'
import { PALETTE } from './reference'

// The sheet is the same study at a fixed 1800 px width, so the exported PNG
// carries the identical content rather than a summary of it.
export const RefinementExportSheet = forwardRef<HTMLDivElement>(
  function RefinementExportSheet(_props, ref) {
    const today = new Date().toISOString().slice(0, 10)

    return (
      <div className="rfe-frame" ref={ref} data-refinement-sheet="all">
        <div className="rfe-sheet">
          <header className="rf-header">
            <p className="rf-eyebrow">
              Assembly Intelligence Lab · typography refinement · round 2 · {today}
            </p>
            <h1>Matching the reference wordmark</h1>
            <p className="rf-lede">
              Four related refinements of the two-line wordmark, held to proportions measured from
              the supplied reference lockups rather than chosen. Size, tracking, line gap and
              symbol gap are solved per font so the relationships stay constant and the letterform
              is the only variable. Flat colour only: navy ASSEMBLY with teal INTELLIGENCE LAB,
              and an all-navy alternate.
            </p>
            <div className="rf-swatches">
              {Object.entries(PALETTE).map(([name, hex]) => (
                <span key={hex}>
                  <i style={{ background: hex }} />
                  {name} {hex}
                </span>
              ))}
            </div>
          </header>

          <RefinementStudy symbolPx={190} />

          <footer className="rfe-footer">
            Assembly Intelligence Lab — company-name typography refinement · {today} · symbols are
            Concepts 33 and 34, unchanged · exploration only, production lockup untouched
          </footer>
        </div>
      </div>
    )
  }
)
