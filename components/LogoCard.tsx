'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedbackForm, type LogoFeedback } from './FeedbackForm'
import './LogoCard.css'

type ExportSize = '64' | '32' | '16'

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
  // Optional size-specific micro-mark geometry. When a concept defines a
  // deliberately simplified mark for small sizes, pass it here and export
  // will use it instead of scaling down staticLogo.
  microMark32?: React.ReactNode
  microMark16?: React.ReactNode
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
  microMark32,
  microMark16,
}: LogoCardProps) {
  const [isAnimating, setIsAnimating] = useState(onPlayAll)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false)
  const [selectedExportSize, setSelectedExportSize] = useState<ExportSize>('64')
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const sizeContainerRefs = useRef<Record<ExportSize, HTMLDivElement | null>>({
    '64': null,
    '32': null,
    '16': null,
  })

  // Returns the geometry to render/export for a given target size. Falls
  // back to the full mark when no size-specific micro-mark is defined yet.
  const getLogoForSize = (size: ExportSize): React.ReactNode => {
    if (size === '16' && microMark16) return microMark16
    if (size === '32' && microMark32) return microMark32
    return staticLogo
  }

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
    // Pull geometry from the container matching the selected export size, so
    // that a future size-specific micro-mark is exported instead of the
    // full mark scaled down.
    const sourceContainer = sizeContainerRefs.current[selectedExportSize] || logoContainerRef.current
    if (!sourceContainer) return

    const svgElement = sourceContainer.querySelector('svg')
    if (!svgElement) return

    const svgClone = svgElement.cloneNode(true) as SVGElement
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // SVG is vector — set explicit target dimensions rather than rasterizing.
    // viewBox is preserved from the source so geometry stays scalable/editable.
    const dimension = Number(selectedExportSize)
    svgClone.setAttribute('width', dimension.toString())
    svgClone.setAttribute('height', dimension.toString())

    // Resolve CSS variables to actual colors from the source container, which
    // carries the target website background's logo color scope (see
    // .logo-background-light/.logo-background-dark in LogoCard.css) — not the
    // reviewer's own site theme.
    const computedStyle = getComputedStyle(sourceContainer)
    const primaryColor = computedStyle.getPropertyValue('--logo-primary').trim() || '#001e3c'
    const secondaryColor = computedStyle.getPropertyValue('--logo-secondary').trim() || '#0d8b8f'
    const accentColor = computedStyle.getPropertyValue('--logo-accent').trim() || '#0d8b8f'
    const mutedColor = computedStyle.getPropertyValue('--logo-muted').trim() || '#57606a'
    const colorForVar: Record<string, string> = {
      '--logo-primary': primaryColor,
      '--logo-secondary': secondaryColor,
      '--logo-accent': accentColor,
      '--logo-muted': mutedColor,
    }

    // Replace CSS variables with computed colors on both fill and stroke
    svgClone.querySelectorAll('[fill*="var("], [stroke*="var("]').forEach((el) => {
      ;(['fill', 'stroke'] as const).forEach((attr) => {
        const value = el.getAttribute(attr) || ''
        const match = value.match(/var\((--logo-[a-z]+)/)
        if (match && colorForVar[match[1]]) {
          el.setAttribute(attr, colorForVar[match[1]])
        }
      })
    })

    const svgString = new XMLSerializer().serializeToString(svgClone)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const backgroundVariant = logoBackground || 'light'
    const link = document.createElement('a')
    link.href = url
    link.download = `AIL-concept-${id.toString().padStart(2, '0')}-${selectedExportSize}px-${backgroundVariant}.svg`
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
          title={`Download SVG (${selectedExportSize}px, ${logoBackground || 'light'})`}
        >
          ↓ SVG ({selectedExportSize}px)
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
        {(['64', '32', '16'] as ExportSize[]).map((size) => (
          <button
            key={size}
            type="button"
            className={`size-preview size-${size} ${selectedExportSize === size ? 'active' : ''}`}
            onClick={() => setSelectedExportSize(size)}
            aria-pressed={selectedExportSize === size}
            title={`Select ${size}px for export`}
          >
            <div className="size-label">{size}px</div>
            <div
              className="size-container"
              ref={(el) => {
                sizeContainerRefs.current[size] = el
              }}
            >
              {getLogoForSize(size)}
            </div>
          </button>
        ))}
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
