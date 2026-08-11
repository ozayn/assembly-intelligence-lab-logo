'use client'

import { useState } from 'react'
import type { LogoFeedback } from './FeedbackForm'

export function useFeedbackSubmission(reviewerName: string | null) {
  const [collectedFeedback, setCollectedFeedback] = useState<LogoFeedback[]>([])
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [justSubmittedCount, setJustSubmittedCount] = useState<number | null>(null)

  const handleFeedbackSubmit = (feedback: LogoFeedback) => {
    setCollectedFeedback((prev) => {
      const filtered = prev.filter((f) => f.conceptId !== feedback.conceptId)
      return [...filtered, feedback]
    })
  }

  const submitAllFeedback = async () => {
    if (!reviewerName || collectedFeedback.length === 0 || submittingFeedback) return

    // Snapshot exactly what's being sent. Success only clears these specific
    // items — anything queued for a different concept while this request is
    // in flight is preserved, not wiped by a blanket reset.
    const toSubmit = collectedFeedback
    setSubmittingFeedback(true)
    setFeedbackError(null)
    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: reviewerName,
          round: 1,
          feedbacks: toSubmit,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const submittedIds = new Set(toSubmit.map((f) => f.conceptId))
        setCollectedFeedback((prev) => prev.filter((f) => !submittedIds.has(f.conceptId)))
        setJustSubmittedCount(toSubmit.length)
        setTimeout(() => setJustSubmittedCount(null), 2000)
      } else {
        setFeedbackError(data.error || 'Failed to submit feedback')
      }
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Network error')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  return {
    collectedFeedback,
    submittingFeedback,
    feedbackError,
    justSubmittedCount,
    handleFeedbackSubmit,
    submitAllFeedback,
  }
}
