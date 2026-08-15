'use client'

import { useState, useEffect } from 'react'
import { useReviewer } from './ReviewerContext'
import { ReviewerModal, ReviewerBadge } from './ReviewerModal'
import { LogoCard } from './LogoCard'
import { TypographyLockup } from './TypographyLockup'
import { DesignWorkspaceNav } from './DesignWorkspaceNav'
import { useFeedbackSubmission } from './useFeedbackSubmission'
import Link from 'next/link'
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
  Concept19Static, Concept19Animated,
  Concept20Static, Concept20Animated,
  Concept21Static, Concept21Animated,
  Concept22Static, Concept22Animated,
  Concept23Static, Concept23Animated,
  Concept24Static, Concept24Animated,
  Concept25Static, Concept25Animated,
  Concept26Static, Concept26Animated,
  Concept27Static, Concept27Animated,
  Concept28Static, Concept28Animated,
  Concept29Static, Concept29Animated,
  Concept30Static, Concept30Animated,
  Concept31Static, Concept31Animated,
  Concept32Static, Concept32Animated,
  Concept33Static, Concept33Animated,
  Concept34Static, Concept34Animated,
  Concept35AStatic, Concept35AAnimated,
  Concept35BStatic, Concept35BAnimated,
  Concept35CStatic, Concept35CAnimated,
  Concept38Static, Concept38Animated,
  Concept39Static, Concept39Animated,
  Concept40Static, Concept40Animated,
  Concept41Static, Concept41Animated,
  ALL_LOGO_CONCEPTS,
  REVIEW_CONCEPTS,
  getPageNumber,
} from './logos'
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
  { Static: Concept19Static, Animated: Concept19Animated },
  { Static: Concept20Static, Animated: Concept20Animated },
  { Static: Concept21Static, Animated: Concept21Animated },
  { Static: Concept22Static, Animated: Concept22Animated },
  { Static: Concept23Static, Animated: Concept23Animated },
  { Static: Concept24Static, Animated: Concept24Animated },
  { Static: Concept25Static, Animated: Concept25Animated },
  { Static: Concept26Static, Animated: Concept26Animated },
  { Static: Concept27Static, Animated: Concept27Animated },
  { Static: Concept28Static, Animated: Concept28Animated },
  { Static: Concept29Static, Animated: Concept29Animated },
  { Static: Concept30Static, Animated: Concept30Animated },
  { Static: Concept31Static, Animated: Concept31Animated },
  { Static: Concept32Static, Animated: Concept32Animated },
  { Static: Concept33Static, Animated: Concept33Animated },
  { Static: Concept34Static, Animated: Concept34Animated },
  { Static: Concept35AStatic, Animated: Concept35AAnimated },
  { Static: Concept35BStatic, Animated: Concept35BAnimated },
  { Static: Concept35CStatic, Animated: Concept35CAnimated },
  { Static: Concept38Static, Animated: Concept38Animated },
  { Static: Concept39Static, Animated: Concept39Animated },
  { Static: Concept40Static, Animated: Concept40Animated },
  { Static: Concept41Static, Animated: Concept41Animated },
]

type DisplayMode = 'static' | 'animated'
type SizeMode = 'full' | '64px' | '32px' | '16px'

interface SingleConceptPageProps {
  conceptId: number
}

export function SingleConceptPage({ conceptId }: SingleConceptPageProps) {
  const { reviewerName } = useReviewer()
  const [displayMode, setDisplayMode] = useState<DisplayMode>('animated')
  const [logoBackground, setLogoBackground] = useState<'light' | 'dark'>('light')
  const [sizeMode, setSizeMode] = useState<SizeMode>('full')
  const {
    collectedFeedback,
    submittingFeedback,
    feedbackError,
    justSubmittedCount,
    handleFeedbackSubmit,
    submitAllFeedback,
  } = useFeedbackSubmission(reviewerName)

  const concept = ALL_LOGO_CONCEPTS[conceptId - 1]
  if (!concept) {
    return <div>Concept not found</div>
  }

  const componentIdx = conceptId - 1
  const { Static, Animated } = ALL_COMPONENTS[componentIdx]

  const currentPage = getPageNumber(conceptId)
  const reviewIndex = REVIEW_CONCEPTS.findIndex(c => c.id === conceptId)
  const previousConceptId = reviewIndex >= 0
    ? REVIEW_CONCEPTS[reviewIndex - 1]?.id ?? null
    : conceptId > 1 ? conceptId - 1 : null
  const nextConceptId = reviewIndex >= 0
    ? REVIEW_CONCEPTS[reviewIndex + 1]?.id ?? null
    : conceptId < ALL_LOGO_CONCEPTS.length ? conceptId + 1 : null

  return (
    <div className="page light">
      <header className="page-header">
        <div className="header-container">
          <div className="logo-area">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ margin: 0 }}>Assembly Intelligence Lab</h1>
              {concept.reviewCandidate && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#e4f3f1',
                    color: '#0B4B70',
                    borderRadius: '4px',
                  }}
                >
                  New Candidate
                </span>
              )}
              {concept.experimental && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#ede4f7',
                    color: '#6b3fa0',
                    borderRadius: '4px',
                  }}
                >
                  Experimental Concept
                </span>
              )}
              {!concept.active && !concept.experimental && !concept.reviewCandidate && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#f5e6e6',
                    color: '#8b4513',
                    borderRadius: '4px',
                  }}
                >
                  Archived
                </span>
              )}
            </div>
            <p className="tagline">Logo Exploration</p>
          </div>

          <div className="controls">
            {/* Hidden for the same reason as on the collection pages: the card's
                own Play Assembly and Replay cover it. displayMode keeps its
                Animated value, so nothing about the motion changes. */}
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

            <div className="control-group">
              <label>Size</label>
              <div className="button-group">
                <button
                  className={sizeMode === 'full' ? 'active' : ''}
                  onClick={() => setSizeMode('full')}
                >
                  Full
                </button>
                <button
                  className={sizeMode === '64px' ? 'active' : ''}
                  onClick={() => setSizeMode('64px')}
                >
                  64px
                </button>
                <button
                  className={sizeMode === '32px' ? 'active' : ''}
                  onClick={() => setSizeMode('32px')}
                >
                  32px
                </button>
                <button
                  className={sizeMode === '16px' ? 'active' : ''}
                  onClick={() => setSizeMode('16px')}
                >
                  16px
                </button>
              </div>
            </div>
          </div>
          <ReviewerBadge />
        </div>
      </header>

      <main className="page-main">
        <section className="concepts-section">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <LogoCard
              id={conceptId}
              name={concept.name}
              description={concept.description}
              staticLogo={<Static />}
              animatedLogo={<Animated />}
              onPlayAll={false}
              onFeedbackSubmit={handleFeedbackSubmit}
              displayMode={displayMode}
              logoBackground={logoBackground}
              sizeMode={sizeMode}
              reviewCandidate={concept.reviewCandidate === true}
            />

            {/* Typography Lockup Exploration */}
            <TypographyLockup
              symbolComponent={<Static />}
              conceptId={conceptId}
              conceptName={concept.name}
            />
          </div>
        </section>
      </main>

      <section style={{ padding: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/"><button style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>← All Concepts</button></Link>
          {previousConceptId && (
            <Link href={`/concept/${previousConceptId}`}><button style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>← Previous Concept</button></Link>
          )}
          {nextConceptId && (
            <Link href={`/concept/${nextConceptId}`}><button style={{ padding: '0.5rem 1rem' }}>Next Concept →</button></Link>
          )}
        </div>
      </section>

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
        <p>Assembly Intelligence Lab — Logo Exploration</p>
      </footer>
      <DesignWorkspaceNav />

      <ReviewerModal />
    </div>
  )
}
