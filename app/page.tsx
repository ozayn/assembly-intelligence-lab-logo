'use client'

import { useState } from 'react'
import { LogoCard } from '@/components/LogoCard'
import { ReviewerModal, ReviewerBadge } from '@/components/ReviewerModal'
import { useReviewer } from '@/components/ReviewerContext'
import type { LogoFeedback } from '@/components/FeedbackForm'
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
  LOGO_CONCEPTS,
} from '@/components/logos'
import './page.css'

const LOGO_COMPONENTS = [
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
]

type DisplayMode = 'static' | 'animated'
type SizeMode = 'full' | '64px' | '32px' | '16px'

function HomeContent() {
  const { reviewerName } = useReviewer()
  const [displayMode, setDisplayMode] = useState<DisplayMode>('static')
  const [isDark, setIsDark] = useState(false)
  const [sizeMode, setSizeMode] = useState<SizeMode>('full')
  const [playAll, setPlayAll] = useState(false)
  const [selectedConcepts, setSelectedConcepts] = useState<number[]>([])
  const [collectedFeedback, setCollectedFeedback] = useState<LogoFeedback[]>([])
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleFeedbackSubmit = (feedback: LogoFeedback) => {
    setCollectedFeedback((prev) => {
      const filtered = prev.filter((f) => f.conceptId !== feedback.conceptId)
      return [...filtered, feedback]
    })
  }

  const submitAllFeedback = async () => {
    if (!reviewerName || collectedFeedback.length === 0) return

    setSubmittingFeedback(true)
    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewer_name: reviewerName,
          round: 1,
          feedbacks: collectedFeedback,
        }),
      })

      if (response.ok) {
        setFeedbackSubmitted(true)
        setTimeout(() => {
          setCollectedFeedback([])
          setFeedbackSubmitted(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const togglePlayAll = () => {
    setPlayAll(!playAll)
  }

  const toggleConceptSelection = (id: number) => {
    setSelectedConcepts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className={`page ${isDark ? 'dark' : 'light'}`}>
      <header className="page-header">
        <div className="header-container">
          <div className="logo-area">
            <h1>Assembly Intelligence Lab</h1>
            <p className="tagline">Logo Concept Exploration</p>
          </div>

          <div className="controls">
            <div className="control-group">
              <label>Display</label>
              <div className="button-group">
                <button
                  className={displayMode === 'static' ? 'active' : ''}
                  onClick={() => setDisplayMode('static')}
                >
                  Static
                </button>
                <button
                  className={displayMode === 'animated' ? 'active' : ''}
                  onClick={() => setDisplayMode('animated')}
                >
                  Animated
                </button>
              </div>
            </div>

            <div className="control-group">
              <label>Theme</label>
              <div className="button-group">
                <button
                  className={!isDark ? 'active' : ''}
                  onClick={() => setIsDark(false)}
                >
                  Light
                </button>
                <button
                  className={isDark ? 'active' : ''}
                  onClick={() => setIsDark(true)}
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

            <div className="control-group">
              <button className="btn-play-all" onClick={togglePlayAll}>
                {playAll ? 'Stop All' : 'Play All'}
              </button>
            </div>
          </div>
          <ReviewerBadge />
        </div>
      </header>

      <main className="page-main">
        <section className="concepts-section">
          <div className="concepts-grid">
            {LOGO_CONCEPTS.map((concept, index) => {
              const { Static, Animated } = LOGO_COMPONENTS[index]
              return (
                <LogoCard
                  key={concept.id}
                  id={concept.id}
                  name={concept.name}
                  description={concept.description}
                  staticLogo={<Static />}
                  animatedLogo={<Animated />}
                  onPlayAll={playAll}
                  onFeedbackSubmit={handleFeedbackSubmit}
                />
              )
            })}
          </div>
        </section>

        <section className="shortlist-section">
          <div className="shortlist-container">
            <h2>Shortlist</h2>
            <p className="shortlist-intro">
              Select 2–4 concepts to compare side-by-side across themes and sizes.
            </p>

            <div className="selection-grid">
              {LOGO_CONCEPTS.map((concept, index) => (
                <button
                  key={concept.id}
                  className={`concept-selector ${
                    selectedConcepts.includes(concept.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleConceptSelection(concept.id)}
                >
                  <span className="selector-number">{concept.id.toString().padStart(2, '0')}</span>
                  <span className="selector-name">{concept.name}</span>
                </button>
              ))}
            </div>

            {selectedConcepts.length > 0 && (
              <div className="comparison-section">
                <div className="comparison-grid">
                  {selectedConcepts.map((conceptId, index) => {
                    const concept = LOGO_CONCEPTS[conceptId - 1]
                    const { Static, Animated } = LOGO_COMPONENTS[conceptId - 1]

                    return (
                      <div key={conceptId} className="comparison-item">
                        <h3>
                          {conceptId.toString().padStart(2, '0')} · {concept.name}
                        </h3>

                        <div className="comparison-variants">
                          <div className="variant-column">
                            <label>Static</label>
                            <div className="variant-box full">
                              <Static />
                            </div>
                            <div className="variant-row">
                              <div className="variant-box size-64">
                                <Static />
                              </div>
                              <div className="variant-box size-32">
                                <Static />
                              </div>
                              <div className="variant-box size-16">
                                <Static />
                              </div>
                            </div>
                          </div>

                          <div className="variant-column">
                            <label>Animated</label>
                            <div className="variant-box full">
                              <Animated />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {reviewerName && collectedFeedback.length > 0 && (
        <section className="feedback-submission-bar">
          <div className="submission-content">
            <div className="submission-info">
              <p>You have {collectedFeedback.length} piece{collectedFeedback.length !== 1 ? 's' : ''} of feedback ready</p>
            </div>
            <button
              className={`btn-submit-all ${submittingFeedback ? 'submitting' : ''} ${feedbackSubmitted ? 'submitted' : ''}`}
              onClick={submitAllFeedback}
              disabled={submittingFeedback || feedbackSubmitted}
            >
              {feedbackSubmitted ? '✓ Submitted!' : submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </section>
      )}

      <footer className="page-footer">
        <p>Assembly Intelligence Lab — Logo Exploration Environment</p>
      </footer>

      <ReviewerModal />
    </div>
  )
}

export default function Home() {
  return <HomeContent />
}
