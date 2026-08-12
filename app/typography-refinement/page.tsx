import type { Metadata } from 'next'
import { DesignWorkspaceNav } from '@/components/DesignWorkspaceNav'
import { RefinementStudy } from './RefinementStudy'
import { RefinementExportButtons } from './RefinementExportButtons'
import { DERIVED, PALETTE } from './reference'
import './typography-refinement.css'

export const metadata: Metadata = {
  title: 'Typography refinement | Assembly Intelligence Lab',
}

export default function TypographyRefinementPage() {
  const widthPerCap = DERIVED.find(d => d.key === 'wpercap1')

  return (
    <div className="rf-page">
      <div className="rf-container">
        <header className="rf-header">
          <p className="rf-eyebrow">Round 2 · refinement · nothing here is wired into the site</p>
          <h1>Matching the reference wordmark</h1>
          <p className="rf-lede">
            Round 1 compared five fonts. This round fixes the proportions first and lets the
            typeface be the only variable. Every measurement below was taken from the pixels of the
            two supplied reference lockups, so the four directions are held to the
            reference&rsquo;s relationships rather than to a description of them.
          </p>
          <p className="rf-lede">
            The headline finding: the references are tracked far wider than round 1 assumed.
            ASSEMBLY runs {widthPerCap?.faceted} to {widthPerCap?.hexagonal} times its own cap
            height, where untracked Jost sits at 6.6. Reaching that needs roughly 0.45–0.5 em of
            tracking and a noticeably smaller type size; round 1 was using 0.157 em.
          </p>
          <div className="rf-swatches">
            {Object.entries(PALETTE).map(([name, hex]) => (
              <span key={hex}>
                <i style={{ background: hex }} />
                {name} {hex}
              </span>
            ))}
          </div>
          <RefinementExportButtons />
        </header>

        <RefinementStudy />

        <a className="rf-back" href="/typography-exploration">
          ← Round 1, the broad exploration
        </a>

        <DesignWorkspaceNav />
      </div>
    </div>
  )
}
