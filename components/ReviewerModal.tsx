'use client'

import { useState } from 'react'
import { useReviewer } from './ReviewerContext'
import './ReviewerModal.css'

export function ReviewerModal() {
  const { reviewerName, setReviewerName } = useReviewer()
  const [inputValue, setInputValue] = useState('')
  const [showModal, setShowModal] = useState(!reviewerName && !!process.env.NEXT_PUBLIC_SUPABASE_URL)

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
        <p>Please tell us your name so we can track your feedback.</p>
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
            Start Reviewing
          </button>
        </form>
      </div>
    </div>
  )
}
