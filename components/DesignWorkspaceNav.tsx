'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { REVIEW_CONCEPTS, ARCHIVED_CONCEPTS, EXPERIMENTAL_CONCEPTS, FINAL_NOMINEES } from './logos'
import { EXPERIMENT_CONCEPTS } from './experimentsData'
import './DesignWorkspaceNav.css'

function label(item: { label: string; count?: number }) {
  return item.count === undefined ? item.label : `${item.label} (${item.count})`
}

export function DesignWorkspaceNav() {
  const pathname = usePathname() ?? ''

  // On /concept/[id], the relevant section depends on whether that specific
  // concept is currently active, archived, or experimental — not just the
  // URL prefix.
  const conceptMatch = pathname.match(/^\/concept\/(\d+)/)
  const conceptId = conceptMatch ? parseInt(conceptMatch[1], 10) : null
  const isReviewConcept = conceptId !== null && REVIEW_CONCEPTS.some((c) => c.id === conceptId)
  const isArchivedConcept = conceptId !== null && ARCHIVED_CONCEPTS.some((c) => c.id === conceptId)
  const isExperimentalConcept = conceptId !== null && EXPERIMENTAL_CONCEPTS.some((c) => c.id === conceptId)

  const experimentsCount = EXPERIMENT_CONCEPTS.length + EXPERIMENTAL_CONCEPTS.length

  const items: { label: string; href: string; count?: number; current: boolean }[] = [
    { label: 'Final Nominees', href: '/final-nominees', count: FINAL_NOMINEES.length, current: pathname.startsWith('/final-nominees') },
    { label: 'Review', href: '/', count: REVIEW_CONCEPTS.length, current: pathname === '/' || pathname.startsWith('/page/') || isReviewConcept },
    { label: 'Experiments', href: '/experiments', count: experimentsCount, current: pathname.startsWith('/experiments') || isExperimentalConcept },
    { label: 'Archive', href: '/archive', count: ARCHIVED_CONCEPTS.length, current: pathname.startsWith('/archive') || isArchivedConcept },
    // A study rather than a set of concepts, so it carries no count.
    { label: 'Typography', href: '/typography-exploration', current: pathname.startsWith('/typography-exploration') },
  ]

  return (
    <div className="design-workspace-nav">
      <span className="dwn-label">Design Workspace</span>
      <nav className="dwn-links" aria-label="Design workspace navigation">
        {items.map((item, i) => (
          <span key={item.href} className="dwn-item">
            {i > 0 && <span className="dwn-sep" aria-hidden="true">·</span>}
            {item.current ? (
              <span className="dwn-current" aria-current="page">{label(item)}</span>
            ) : (
              <Link href={item.href}>{label(item)}</Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
