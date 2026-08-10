'use client'

import { useState, useRef, useEffect } from 'react'
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
  displayMode?: 'static' | 'animated'
  logoBackground?: 'light' | 'dark'
  sizeMode?: 'full' | '64px' | '32px' | '16px'
}

export function LogoCard({
  id,
  name,
  description,
  staticLogo,
  animatedLogo,
  onPlayAll = false,
  onFeedbackSubmit,
  displayMode,
  logoBackground,
  sizeMode,
}: LogoCardProps) {
  const [isAnimating, setIsAnimating] = useState(onPlayAll)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false)
  const logoContainerRef = useRef<HTMLDivElement>(null)

  // Handle Play All/Stop All prop changes
  useEffect(() => {
    if (onPlayAll) {
      setIsAnimating(true)
      setShowAnimated(true)
    } else {
      setIsAnimating(false)
    }
  }, [onPlayAll])

  const handlePlay = () => {
    setIsAnimating(true)
    setShowAnimated(true)
  }

  const handleDownloadSVG = () => {
    if (!logoContainerRef.current) return

    const svgElement = logoContainerRef.current.querySelector('svg')
    if (!svgElement) return

    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const svgString = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `AIL-concept-${id.toString().padStart(2, '0')}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFeedbackSubmit = (feedback: LogoFeedback) => {
    onFeedbackSubmit?.(feedback)
    setShowFeedback(false)
  }

  const handleCopyLink = () => {
    const conceptUrl = `${window.location.origin}/concept/${id.toString().padStart(2, '0')}`
    navigator.clipboard.writeText(conceptUrl)
    setCopyLinkFeedback(true)
    setTimeout(() => setCopyLinkFeedback(false), 2000)
  }

  // Determine what to show based on displayMode and animation state
  // On ExplorationPage: onPlayAll triggers animations, displayMode controls if animations are allowed
  // On SingleConceptPage: onPlayAll is false, only individual Play Assembly button matters
  const shouldDisplayAnimated = displayMode === 'animated' && (onPlayAll || (isAnimating && showAnimated))

  const getSizeStyle = (mode: string) => {
    switch (mode) {
      case '64px':
        return { width: '80px', height: '80px' }
      case '32px':
        return { width: '50px', height: '50px' }
      case '16px':
        return { width: '35px', height: '35px' }
      default:
        return {}
    }
  }

  return (
    <div className="logo-card">
      <div className="logo-card-header">
        <span className="logo-number">{id.toString().padStart(2, '0')}</span>
        <h3 className="logo-name">{name}</h3>
      </div>

      <div className={`logo-display logo-background-${logoBackground || 'light'}`} style={sizeMode && sizeMode !== 'full' ? { minHeight: '120px' } : {}}>
        <div className="logo-container" ref={logoContainerRef} style={sizeMode ? getSizeStyle(sizeMode) : {}}>
          {shouldDisplayAnimated ? animatedLogo : staticLogo}
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
        <button
          className="btn-download"
          onClick={handleDownloadSVG}
          title="Download SVG"
        >
          ↓ SVG
        </button>
        <button
          className="btn-copy-link"
          onClick={handleCopyLink}
          style={{ fontSize: '1.1rem', opacity: 0.6 }}
          title="Copy shareable link"
        >
          {copyLinkFeedback ? '✓' : '🔗'}
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
          conceptName={name}
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
