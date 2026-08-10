'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ReviewerContextType {
  reviewerName: string | null
  setReviewerName: (name: string) => void
}

const ReviewerContext = createContext<ReviewerContextType | null>(null)

export function ReviewerProvider({ children }: { children: React.ReactNode }) {
  const [reviewerName, setReviewerName] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('reviewer_name')
    if (stored) {
      setReviewerName(stored)
    }
  }, [])

  const handleSetReviewerName = (name: string) => {
    setReviewerName(name)
    localStorage.setItem('reviewer_name', name)
  }

  return (
    <ReviewerContext.Provider value={{ reviewerName, setReviewerName: handleSetReviewerName }}>
      {children}
    </ReviewerContext.Provider>
  )
}

export function useReviewer() {
  const context = useContext(ReviewerContext)
  if (!context) {
    return { reviewerName: null, setReviewerName: () => {} }
  }
  return context
}
