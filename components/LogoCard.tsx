'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedbackForm, type LogoFeedback } from './FeedbackForm'
import './LogoCard.css'

interface LogoCardProps {
  id: number
  name: string
  description: string
  staticLogo: React.ReactNode
  animatedLogo: React.ReactNode
  onPlayAll?: boolean
  onFeedbackSubmit?: (feedback: LogoFeedback) => void
}

export function LogoCard({
  id,
  name,
  description,
  staticLogo,
  animatedLogo,
  onPlayAll = false,
  onFeedbackSubmit,
}: LogoCardProps) {
  const [isAnimating, setIsAnimating] = useState(onPlayAll)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handlePlay = () => {
    setIsAnimating(true)
    setShowAnimated(true)
  }

  const handleFeedbackSubmit = (feedback: LogoFeedback) => {
    onFeedbackSubmit?.(feedback)
    setShowFeedback(false)
  }

  return (
    <div className="logo-card">
      <div className="logo-card-header">
        <span className="logo-number">{id.toString().padStart(2, '0')}</span>
        <h3 className="logo-name">{name}</h3>
      </div>

      <div className="logo-display">
        <div className="logo-container">
          {showAnimated && isAnimating ? animatedLogo : staticLogo}
        </div>
      </div>

      <p className="logo-description">{description}</p>

      <div className="logo-controls">
        <button
          className="btn-play"
          onClick={handlePlay}
          disabled={isAnimating}
        >
          {isAnimating ? 'Animating...' : 'Play Assembly'}
        </button>
        <button
          className="btn-replay"
          onClick={() => {
            setIsAnimating(false)
            setShowAnimated(false)
            setTimeout(() => handlePlay(), 50)
          }}
          disabled={!showAnimated && !isAnimating}
        >
          Replay
        </button>
      </div>

      <div className="logo-sizes">
        <div className="size-preview size-64">
          <div className="size-label">64px</div>
          <div className="size-container">{staticLogo}</div>
        </div>
        <div className="size-preview size-32">
          <div className="size-label">32px</div>
          <div className="size-container">{staticLogo}</div>
        </div>
        <div className="size-preview size-16">
          <div className="size-label">16px</div>
          <div className="size-container">{staticLogo}</div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackForm
          conceptId={id}
          onSubmit={handleFeedbackSubmit}
          isExpanded={true}
        />
      )}

      {!showFeedback && (
        <button
          className="feedback-link"
          onClick={() => setShowFeedback(true)}
          title="Add feedback for this concept"
        >
          💬 Add Feedback
        </button>
      )}
    </div>
  )
}
