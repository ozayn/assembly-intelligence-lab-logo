'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { REVIEW_CONCEPTS, ARCHIVED_CONCEPTS, EXPERIMENTAL_CONCEPTS } from './logos'
import { EXPERIMENT_CONCEPTS } from './experimentsData'
import './DesignWorkspaceNav.css'

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

  const items = [
    { label: 'Review', href: '/', count: REVIEW_CONCEPTS.length, current: pathname === '/' || pathname.startsWith('/page/') || isReviewConcept },
    { label: 'Experiments', href: '/experiments', count: experimentsCount, current: pathname.startsWith('/experiments') || isExperimentalConcept },
    { label: 'Archive', href: '/archive', count: ARCHIVED_CONCEPTS.length, current: pathname.startsWith('/archive') || isArchivedConcept },
  ]

  return (
    <div className="design-workspace-nav">
      <span className="dwn-label">Design Workspace</span>
      <nav className="dwn-links" aria-label="Design workspace navigation">
        {items.map((item, i) => (
          <span key={item.href} className="dwn-item">
            {i > 0 && <span className="dwn-sep" aria-hidden="true">·</span>}
            {item.current ? (
              <span className="dwn-current" aria-current="page">{item.label} ({item.count})</span>
            ) : (
              <Link href={item.href}>{item.label} ({item.count})</Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
