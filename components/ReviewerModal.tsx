'use client'

import { useState } from 'react'
import { useReviewer } from './ReviewerContext'
import './ReviewerModal.css'

export function ReviewerModal() {
  const { reviewerName, setReviewerName } = useReviewer()
  const [inputValue, setInputValue] = useState('')
  const [showModal, setShowModal] = useState(!reviewerName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setReviewerName(inputValue.trim())
      setShowModal(false)
    }
  }

  if (!showModal) return null

  return (
    <div className="reviewer-modal-overlay">
      <div className="reviewer-modal">
        <h2>Welcome to Logo Review</h2>
        <p>This helps us understand who provided each piece of feedback.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" disabled={!inputValue.trim()}>
            Start Review
          </button>
        </form>
      </div>
    </div>
  )
}

export function ReviewerBadge() {
  const { reviewerName, setReviewerName } = useReviewer()
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [inputValue, setInputValue] = useState(reviewerName || '')

  const handleChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setReviewerName(inputValue.trim())
      setShowChangeModal(false)
    }
  }

  if (!reviewerName) return null

  return (
    <>
      <div className="reviewer-badge">
        Reviewing as <strong>{reviewerName}</strong>
        <button onClick={() => setShowChangeModal(true)} className="change-btn">
          Change
        </button>
      </div>

      {showChangeModal && (
        <div className="reviewer-modal-overlay">
          <div className="reviewer-modal">
            <h2>Change Reviewer</h2>
            <form onSubmit={handleChange}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowChangeModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={!inputValue.trim()}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
