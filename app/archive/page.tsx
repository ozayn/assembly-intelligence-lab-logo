'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReviewer } from '@/components/ReviewerContext'
import { ReviewerModal, ReviewerBadge } from '@/components/ReviewerModal'
import { LogoCard } from '@/components/LogoCard'
import { DesignWorkspaceNav } from '@/components/DesignWorkspaceNav'
import { useFeedbackSubmission } from '@/components/useFeedbackSubmission'
import {
  Concept01Static, Concept01Animated,
  Concept02Static, Concept02Animated,
  Concept03Static, Concept03Animated,
  Concept04Static, Concept04Animated,
  Concept05Static, Concept05Animated,
  Concept06Static, Concept06Animated,
  Concept07Static, Concept07Animated,
  Concept08Static, Concept08Animated,
  Concept09Static, Concept09Animated,
  Concept10Static, Concept10Animated,
  Concept11Static, Concept11Animated,
  Concept12Static, Concept12Animated,
  Round3Concept01Static, Round3Concept01Animated,
  Round3Concept02Static, Round3Concept02Animated,
  Round3Concept03Static, Round3Concept03Animated,
  Round3Concept04Static, Round3Concept04Animated,
  Round3Concept05Static, Round3Concept05Animated,
  Round3Concept06Static, Round3Concept06Animated,
  ARCHIVED_CONCEPTS,
} from '@/components/logos'
import '@/app/page.css'

const ALL_COMPONENTS = [
  { Static: Concept01Static, Animated: Concept01Animated },
  { Static: Concept02Static, Animated: Concept02Animated },
  { Static: Concept03Static, Animated: Concept03Animated },
  { Static: Concept04Static, Animated: Concept04Animated },
  { Static: Concept05Static, Animated: Concept05Animated },
  { Static: Concept06Static, Animated: Concept06Animated },
  { Static: Concept07Static, Animated: Concept07Animated },
  { Static: Concept08Static, Animated: Concept08Animated },
  { Static: Concept09Static, Animated: Concept09Animated },
  { Static: Concept10Static, Animated: Concept10Animated },
  { Static: Concept11Static, Animated: Concept11Animated },
  { Static: Concept12Static, Animated: Concept12Animated },
  { Static: Round3Concept01Static, Animated: Round3Concept01Animated },
  { Static: Round3Concept02Static, Animated: Round3Concept02Animated },
  { Static: Round3Concept03Static, Animated: Round3Concept03Animated },
  { Static: Round3Concept04Static, Animated: Round3Concept04Animated },
  { Static: Round3Concept05Static, Animated: Round3Concept05Animated },
  { Static: Round3Concept06Static, Animated: Round3Concept06Animated },
]

export default function ArchivePage() {
  const { reviewerName } = useReviewer()
  const [logoBackground, setLogoBackground] = useState<'light' | 'dark'>('light')
  const {
    collectedFeedback,
    submittingFeedback,
    feedbackError,
    justSubmittedCount,
    handleFeedbackSubmit,
    submitAllFeedback,
  } = useFeedbackSubmission(reviewerName)

  return (
    <div className="page light">
      <header className="page-header">
        <div className="header-container">
          <div className="logo-area">
            <h1>Archived Concepts</h1>
            <p className="tagline">Concepts removed from the active review set but retained for reference.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {ARCHIVED_CONCEPTS.length} archived concept{ARCHIVED_CONCEPTS.length !== 1 ? 's' : ''}
            </p>
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
            {ARCHIVED_CONCEPTS.map((concept) => {
              const componentIdx = concept.id - 1
              const { Static, Animated } = ALL_COMPONENTS[componentIdx]
              return (
                <div key={concept.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <LogoCard
                    id={concept.id}
                    name={concept.name}
                    description={concept.description}
                    staticLogo={<Static />}
                    animatedLogo={<Animated />}
                    onPlayAll={false}
                    onFeedbackSubmit={handleFeedbackSubmit}
                    displayMode="animated"
                    logoBackground={logoBackground}
                    sizeMode="full"
                  />
                  <Link href={`/concept/${concept.id.toString().padStart(2, '0')}`}>
                    <button
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        background: 'var(--accent-navy)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
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

      {reviewerName && (collectedFeedback.length > 0 || justSubmittedCount !== null) && (
        <section className="feedback-submission-bar">
          <div className="submission-content">
            <div className="submission-info">
              {feedbackError ? (
                <p style={{ color: '#d32f2f' }}>Error: {feedbackError}</p>
              ) : collectedFeedback.length > 0 ? (
                <p>You have {collectedFeedback.length} piece{collectedFeedback.length !== 1 ? 's' : ''} of feedback ready</p>
              ) : (
                <p>✓ {justSubmittedCount} piece{justSubmittedCount !== 1 ? 's' : ''} of feedback submitted</p>
              )}
            </div>
            <button
              className={`btn-submit-all ${submittingFeedback ? 'submitting' : ''} ${feedbackError ? 'error' : ''}`}
              onClick={submitAllFeedback}
              disabled={submittingFeedback || collectedFeedback.length === 0}
            >
              {submittingFeedback ? 'Submitting...' : feedbackError ? 'Retry' : collectedFeedback.length === 0 ? '✓ Submitted!' : 'Submit Feedback'}
            </button>
          </div>
        </section>
      )}

      <footer className="page-footer">
        <p>Assembly Intelligence Lab — Archived Concepts</p>
      </footer>
      <DesignWorkspaceNav />

      <ReviewerModal />
    </div>
  )
}
