'use client'

import { useState, useEffect } from 'react'
import { LogoCard } from '@/components/LogoCard'
import { ReviewerModal, ReviewerBadge } from '@/components/ReviewerModal'
import { useReviewer } from '@/components/ReviewerContext'
import type { LogoFeedback } from '@/components/FeedbackForm'
import {
  Round3Concept01Static, Round3Concept01Animated,
  Round3Concept02Static, Round3Concept02Animated,
  Round3Concept03Static, Round3Concept03Animated,
  Round3Concept04Static, Round3Concept04Animated,
  Round3Concept05Static, Round3Concept05Animated,
  Round3Concept06Static, Round3Concept06Animated,
  ROUND_3_CONCEPTS,
} from '@/components/logos'
import '../page.css'

const ROUND3_COMPONENTS = [
  { Static: Round3Concept01Static, Animated: Round3Concept01Animated },
  { Static: Round3Concept02Static, Animated: Round3Concept02Animated },
  { Static: Round3Concept03Static, Animated: Round3Concept03Animated },
  { Static: Round3Concept04Static, Animated: Round3Concept04Animated },
  { Static: Round3Concept05Static, Animated: Round3Concept05Animated },
  { Static: Round3Concept06Static, Animated: Round3Concept06Animated },
]

type DisplayMode = 'static' | 'animated'
type SizeMode = 'full' | '64px' | '32px' | '16px'

function Round3Content() {
  const { reviewerName } = useReviewer()
  const [displayMode, setDisplayMode] = useState<DisplayMode>('static')
  const [isDark, setIsDark] = useState(false)
  const [sizeMode, setSizeMode] = useState<SizeMode>('full')
  const [playAll, setPlayAll] = useState(false)
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
          round: 3,
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

  // Auto-reset Play All after animation completes
  useEffect(() => {
    if (playAll) {
      const timer = setTimeout(() => {
        setPlayAll(false)
      }, 2600)
      return () => clearTimeout(timer)
    }
  }, [playAll])

  return (
    <div className={`page ${isDark ? 'dark' : 'light'}`}>
      <header className="page-header">
        <div className="header-container">
          <div className="logo-area">
            <h1>Assembly Intelligence Lab</h1>
            <p className="tagline">Logo Concept Exploration — Round 3</p>
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
          <div className="concepts-intro">
            <p>
              <strong>Round 3 — Experimental Concepts</strong>
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Six creative territories exploring different assembly principles. Each concept prioritizes a strong static mark with intentional motion revealing how the structure comes into being.
            </p>
          </div>

          <div className="concepts-grid">
            {ROUND_3_CONCEPTS.map((concept, index) => {
              const { Static, Animated } = ROUND3_COMPONENTS[index]
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
        <p>
          <a href="/" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>← Back to Round 2</a>
          {' '} · Assembly Intelligence Lab — Logo Exploration Environment
        </p>
      </footer>

      <ReviewerModal />
    </div>
  )
}

export default function Round3Page() {
  return <Round3Content />
}
