'use client'

import { useEffect, useState } from 'react'
import { LOGO_CONCEPTS } from '@/components/logos'
import './admin.css'

interface Feedback {
  id: string
  round: number
  reviewer_name: string
  concept_id: number
  like_static: boolean
  like_animation: boolean
  tags: string[]
  comment: string
  created_at: string
}

interface AdminResults {
  round: number
  total_feedbacks: number
  unique_reviewers: string[]
  feedbacks: Feedback[]
}

export default function AdminPage() {
  const [results, setResults] = useState<AdminResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [round, setRound] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [round])

  const fetchResults = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/feedback/results?round=${round}`)
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <h1>Feedback Results</h1>
        </header>
        <main className="admin-main">
          <section style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              Feedback is collected via Formspree.
            </p>
            <p style={{ color: 'var(--text-light-secondary)', marginBottom: '1.5rem' }}>
              To view submitted feedback, check the Formspree dashboard at:
            </p>
            <p>
              <a href="https://formspree.io/forms/meajayba/submissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--logo-primary)', textDecoration: 'none', fontWeight: '500' }}>
                formspree.io/forms/meajayba/submissions
              </a>
            </p>
            <p style={{ color: 'var(--text-light-secondary)', marginTop: '1rem', fontSize: '0.9rem' }}>
              (You'll need to log in with the account that created the form)
            </p>
          </section>
        </main>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="admin-page">
        <div className="admin-empty">No feedback data available</div>
      </div>
    )
  }

  const conceptStats = LOGO_CONCEPTS.map((concept) => {
    const conceptFeedback = results.feedbacks.filter(
      (f) => f.concept_id === concept.id
    )

    return {
      ...concept,
      totalFeedback: conceptFeedback.length,
      staticLikes: conceptFeedback.filter((f) => f.like_static).length,
      animationLikes: conceptFeedback.filter((f) => f.like_animation).length,
      allTags: conceptFeedback.flatMap((f) => f.tags),
      comments: conceptFeedback.filter((f) => f.comment),
    }
  })

  const sortedByStaticLikes = [...conceptStats].sort(
    (a, b) => b.staticLikes - a.staticLikes
  )

  const tagFrequency: Record<string, number> = {}
  conceptStats.forEach((concept) => {
    concept.allTags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
    })
  })

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Logo Feedback Results</h1>
        <div className="admin-controls">
          <label>
            Round:
            <select value={round} onChange={(e) => setRound(parseInt(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
        </div>
      </header>

      <main className="admin-main">
        <section className="summary-section">
          <h2>Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-value">{results.unique_reviewers.length}</div>
              <div className="summary-label">Reviewers</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{results.total_feedbacks}</div>
              <div className="summary-label">Total Feedbacks</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{(results.total_feedbacks / results.unique_reviewers.length).toFixed(1)}</div>
              <div className="summary-label">Avg per Reviewer</div>
            </div>
          </div>
        </section>

        <section className="reviewers-section">
          <h2>Reviewers</h2>
          <div className="reviewers-list">
            {results.unique_reviewers.map((name) => (
              <div key={name} className="reviewer-item">
                {name}
              </div>
            ))}
          </div>
        </section>

        <section className="concepts-section">
          <h2>Concepts by Static Likes</h2>
          <div className="concepts-table">
            <table>
              <thead>
                <tr>
                  <th>Concept</th>
                  <th>Feedback Count</th>
                  <th>Static Likes</th>
                  <th>Animation Likes</th>
                  <th>Like Rate (Static)</th>
                </tr>
              </thead>
              <tbody>
                {sortedByStaticLikes.map((concept) => (
                  <tr key={concept.id}>
                    <td className="concept-name">
                      <span className="concept-number">
                        {concept.id.toString().padStart(2, '0')}
                      </span>
                      {concept.name}
                    </td>
                    <td>{concept.totalFeedback}</td>
                    <td>{concept.staticLikes}</td>
                    <td>{concept.animationLikes}</td>
                    <td>
                      {concept.totalFeedback > 0
                        ? ((concept.staticLikes / concept.totalFeedback) * 100).toFixed(0)
                        : '-'}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="tags-section">
          <h2>Tag Frequency</h2>
          <div className="tags-cloud">
            {Object.entries(tagFrequency)
              .sort(([, a], [, b]) => b - a)
              .map(([tag, count]) => (
                <div
                  key={tag}
                  className="tag-item"
                  style={{ fontSize: `${0.9 + (count / 20) * 0.5}rem` }}
                >
                  <span className="tag-name">{tag}</span>
                  <span className="tag-count">{count}</span>
                </div>
              ))}
          </div>
        </section>

        <section className="comments-section">
          <h2>Comments</h2>
          <div className="comments-list">
            {results.feedbacks
              .filter((f) => f.comment)
              .map((feedback, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-header">
                    <strong>{feedback.reviewer_name}</strong> on Concept{' '}
                    {feedback.concept_id.toString().padStart(2, '0')} ·{' '}
                    {LOGO_CONCEPTS.find((c) => c.id === feedback.concept_id)?.name}
                  </div>
                  <p>{feedback.comment}</p>
                </div>
              ))}
          </div>
        </section>

        <section className="matrix-section">
          <h2>Preference Matrix</h2>
          <div className="matrix-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th></th>
                  {results.unique_reviewers.map((name) => (
                    <th key={name} className="reviewer-header">
                      {name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOGO_CONCEPTS.map((concept) => (
                  <tr key={concept.id}>
                    <td className="concept-header">
                      <span className="concept-number">
                        {concept.id.toString().padStart(2, '0')}
                      </span>
                      <span className="concept-label">{concept.name}</span>
                    </td>
                    {results.unique_reviewers.map((reviewerName) => {
                      const feedback = results.feedbacks.find(
                        (f) =>
                          f.concept_id === concept.id &&
                          f.reviewer_name === reviewerName
                      )
                      return (
                        <td key={`${concept.id}-${reviewerName}`} className="matrix-cell">
                          {feedback ? (
                            <div className="likes">
                              {feedback.like_static && <span className="like-badge">S</span>}
                              {feedback.like_animation && <span className="like-badge anim">A</span>}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="matrix-legend">
            <strong>Legend:</strong> S = Static Like, A = Animation Like
          </p>
        </section>
      </main>
    </div>
  )
}
