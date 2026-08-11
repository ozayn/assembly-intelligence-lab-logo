'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReviewer } from '@/components/ReviewerContext'
import { ReviewerModal, ReviewerBadge } from '@/components/ReviewerModal'
import {
  Concept01Static, Concept02Static, Concept03Static, Concept04Static, Concept05Static, Concept06Static,
  Concept07Static, Concept08Static, Concept09Static, Concept10Static, Concept11Static, Concept12Static,
  Round3Concept01Static, Round3Concept02Static, Round3Concept03Static, Round3Concept04Static,
  Round3Concept05Static, Round3Concept06Static,
  ALL_LOGO_CONCEPTS,
} from '@/components/logos'
import '@/app/page.css'

const ALL_COMPONENTS = [
  Concept01Static, Concept02Static, Concept03Static, Concept04Static, Concept05Static, Concept06Static,
  Concept07Static, Concept08Static, Concept09Static, Concept10Static, Concept11Static, Concept12Static,
  Round3Concept01Static, Round3Concept02Static, Round3Concept03Static, Round3Concept04Static,
  Round3Concept05Static, Round3Concept06Static,
]

export default function ArchivePage() {
  const { reviewerName } = useReviewer()
  const [logoBackground, setLogoBackground] = useState<'light' | 'dark'>('light')

  const archivedConcepts = ALL_LOGO_CONCEPTS.filter(c => !c.active)

  return (
    <div className="page light">
      <header className="page-header">
        <div className="header-container">
          <div className="logo-area">
            <h1>Archived Concepts</h1>
            <p className="tagline">These concepts are not part of the current reviewer-facing selection but are retained for reference and may be restored.</p>
          </div>

          <div className="controls">
            <div className="control-group">
              <label>Website Preview</label>
              <div className="button-group">
                <button
                  className={logoBackground === 'light' ? 'active' : ''}
                  onClick={() => setLogoBackground('light')}
                >
                  Light
                </button>
                <button
                  className={logoBackground === 'dark' ? 'active' : ''}
                  onClick={() => setLogoBackground('dark')}
                >
                  Dark
                </button>
              </div>
            </div>

            <Link href="/">
              <button style={{ marginLeft: '1rem' }}>← Back to Active Concepts</button>
            </Link>
          </div>

          <ReviewerBadge />
        </div>
      </header>

      <main className="page-main">
        <section className="concepts-section">
          <div className="concepts-grid">
            {archivedConcepts.map((concept) => {
              const Component = ALL_COMPONENTS[concept.id - 1]
              if (!Component) return null

              return (
                <div
                  key={concept.id}
                  className="archive-concept-card"
                  style={{
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#666',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {concept.id.toString().padStart(2, '0')} — Archived
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0.5rem 0 0 0' }}>
                      {concept.name}
                    </h3>
                  </div>

                  {/* Logo Display */}
                  <div
                    className={`logo-display logo-background-${logoBackground}`}
                    style={{
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    <Component />
                  </div>

                  {/* Direct Link */}
                  <Link href={`/concept/${concept.id.toString().padStart(2, '0')}`}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        background: '#2d5a7b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: 'auto',
                      }}
                    >
                      View Full Details →
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <p>Assembly Intelligence Lab — Archived Concepts</p>
      </footer>

      <ReviewerModal />
    </div>
  )
}
