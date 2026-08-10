'use client'

import { useState } from 'react'
import './FeedbackForm.css'

export const FEEDBACK_TAGS = [
  'Strong direction',
  'Like the static mark',
  'Like the motion',
  'Works well small',
  'Too complex',
  'Too generic',
  'Too similar to another brand',
  'Needs refinement',
]

export interface LogoFeedback {
  conceptId: number
  likeStatic: boolean
  likeAnimation: boolean
  tags: string[]
  comment: string
}

interface FeedbackFormProps {
  conceptId: number
  onSubmit: (feedback: LogoFeedback) => void
  isExpanded?: boolean
}

export function FeedbackForm({ conceptId, onSubmit, isExpanded = false }: FeedbackFormProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [likeStatic, setLikeStatic] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    onSubmit({
      conceptId,
      likeStatic,
      likeAnimation,
      tags,
      comment,
    })
    setLikeStatic(false)
    setLikeAnimation(false)
    setTags([])
    setComment('')
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <button
        className="feedback-trigger"
        onClick={() => setExpanded(true)}
        title="Add feedback for this concept"
      >
        💬
      </button>
    )
  }

  return (
    <div className="feedback-form">
      <div className="feedback-header">
        <h4>Feedback for Concept {conceptId.toString().padStart(2, '0')}</h4>
        <button
          className="close-btn"
          onClick={() => setExpanded(false)}
          aria-label="Close feedback form"
        >
          ✕
        </button>
      </div>

      <div className="feedback-section">
        <label className="feedback-label">Static Logo</label>
        <button
          className={`like-btn ${likeStatic ? 'liked' : ''}`}
          onClick={() => setLikeStatic(!likeStatic)}
        >
          {likeStatic ? '👍 Liked' : '👍 Like'}
        </button>
      </div>

      <div className="feedback-section">
        <label className="feedback-label">Animation / Assembly Behavior</label>
        <button
          className={`like-btn ${likeAnimation ? 'liked' : ''}`}
          onClick={() => setLikeAnimation(!likeAnimation)}
        >
          {likeAnimation ? '👍 Liked' : '👍 Like'}
        </button>
      </div>

      <div className="feedback-section">
        <label className="feedback-label">Quick Feedback Tags</label>
        <div className="tags-grid">
          {FEEDBACK_TAGS.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${tags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="feedback-section">
        <label className="feedback-label">Comments (optional)</label>
        <textarea
          className="feedback-textarea"
          placeholder="What do you like or dislike about this direction?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      <button className="submit-feedback-btn" onClick={handleSubmit}>
        Submit Feedback
      </button>
    </div>
  )
}
