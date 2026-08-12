'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedbackForm, type LogoFeedback } from './FeedbackForm'
import {
  TYPOGRAPHY_SYSTEMS,
  APPLICATION_TIERS,
  WORDMARK_LINE_1,
  WORDMARK_LINE_2,
  WORDMARK_SECONDARY_SCALE,
  WORDMARK_SECONDARY_TRACKING_SCALE,
  LOCKUP_SYMBOL_SCALE,
  type TypographyDirection,
  type ApplicationTier,
} from './typographySystems'
import { BrandWordmark } from './BrandWordmark'
import { FittedLockup } from './FittedLockup'
import { buildFittedLockupSvg, measureSymbolInk, FULL_INK } from './lockupFitting'
import './LogoCard.css'

type ExportSize = '64' | '32' | '16'
type LogoVersion = 'symbol' | 'lockup'

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
  reviewCandidate?: boolean
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
  reviewCandidate = false,
}: LogoCardProps) {
  const [isAnimating, setIsAnimating] = useState(onPlayAll)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false)
  const [selectedExportSize, setSelectedExportSize] = useState<ExportSize>('64')
  const [logoVersion, setLogoVersion] = useState<LogoVersion>('symbol')
  const [typographyDirection, setTypographyDirection] = useState<TypographyDirection>('scientific')
  const [applicationTier, setApplicationTier] = useState<ApplicationTier>('full')
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const sizeContainerRefs = useRef<Record<ExportSize, HTMLDivElement | null>>({
    '64': null,
    '32': null,
    '16': null,
  })
  // Always-mounted, visually hidden source for the symbol's real SVG markup,
  // used by the lockup export regardless of which mode is currently visible.
  const exportSourceRef = useRef<HTMLDivElement>(null)

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
    const primaryColor = computedStyle.getPropertyValue('--logo-primary').trim() || '#08255A'
    const secondaryColor = computedStyle.getPropertyValue('--logo-secondary').trim() || '#0B4B70'
    const accentColor = computedStyle.getPropertyValue('--logo-accent').trim() || '#109596'
    const lightColor = computedStyle.getPropertyValue('--logo-light').trim() || '#58B7B1'
    const paleColor = computedStyle.getPropertyValue('--logo-pale').trim() || '#B7DEDA'
    const mutedColor = computedStyle.getPropertyValue('--logo-muted').trim() || '#57606a'
    const colorForVar: Record<string, string> = {
      '--logo-primary': primaryColor,
      '--logo-secondary': secondaryColor,
      '--logo-accent': accentColor,
      '--logo-light': lightColor,
      '--logo-pale': paleColor,
      '--logo-muted': mutedColor,
    }

    // Replace CSS variables with computed colors on fill, stroke, and
    // gradient stop-color (some concepts, e.g. Threshold, fill via a
    // <linearGradient> whose stops reference these same tokens)
    svgClone.querySelectorAll('[fill*="var("], [stroke*="var("], [stop-color*="var("]').forEach((el) => {
      ;(['fill', 'stroke', 'stop-color'] as const).forEach((attr) => {
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
    link.download = `AIL-concept-${id.toString().padStart(2, '0')}-${selectedExportSize}px-${backgroundVariant}-symbol.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Measures real rendered text dimensions for the chosen typography so the
  // exported SVG's viewBox/layout matches what getBBox() actually reports —
  // not a guess. Requires the font to be loaded (see app/layout.tsx).
  const measureText = (text: string, fontFamily: string, fontSize: number, fontWeight: number, letterSpacing: number) => {
    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(svgNS, 'svg')
    svg.style.position = 'absolute'
    svg.style.visibility = 'hidden'
    svg.style.pointerEvents = 'none'
    const textEl = document.createElementNS(svgNS, 'text')
    textEl.setAttribute('font-family', fontFamily)
    textEl.setAttribute('font-size', String(fontSize))
    textEl.setAttribute('font-weight', String(fontWeight))
    textEl.setAttribute('letter-spacing', String(letterSpacing))
    textEl.textContent = text
    svg.appendChild(textEl)
    document.body.appendChild(svg)
    const bbox = textEl.getBBox()
    document.body.removeChild(svg)
    return { width: bbox.width, height: bbox.height }
  }

  const downloadSvg = (svg: SVGSVGElement) => {
    const svgString = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const backgroundVariant = logoBackground || 'light'
    const link = document.createElement('a')
    link.href = url
    link.download = `AIL-concept-${id.toString().padStart(2, '0')}-${applicationTier}-${backgroundVariant}-${typographyDirection}-lockup.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadLockupSVG = () => {
    const sourceContainer = exportSourceRef.current
    if (!sourceContainer) return
    const svgElement = sourceContainer.querySelector('svg')
    if (!svgElement) return

    const symbolClone = svgElement.cloneNode(true) as SVGElement

    // Resolve colors from the same target-background-scoped container used
    // by the symbol export, so symbol + wordmark always match the selected
    // Light/Dark variant exactly.
    const computedStyle = getComputedStyle(sourceContainer)
    const primaryColor = computedStyle.getPropertyValue('--logo-primary').trim() || '#08255A'
    const secondaryColor = computedStyle.getPropertyValue('--logo-secondary').trim() || '#0B4B70'
    const accentColor = computedStyle.getPropertyValue('--logo-accent').trim() || '#109596'
    const lightColor = computedStyle.getPropertyValue('--logo-light').trim() || '#58B7B1'
    const paleColor = computedStyle.getPropertyValue('--logo-pale').trim() || '#B7DEDA'
    const mutedColor = computedStyle.getPropertyValue('--logo-muted').trim() || '#57606a'
    const colorForVar: Record<string, string> = {
      '--logo-primary': primaryColor,
      '--logo-secondary': secondaryColor,
      '--logo-accent': accentColor,
      '--logo-light': lightColor,
      '--logo-pale': paleColor,
      '--logo-muted': mutedColor,
    }
    symbolClone.querySelectorAll('[fill*="var("], [stroke*="var("], [stop-color*="var("]').forEach((el) => {
      ;(['fill', 'stroke', 'stop-color'] as const).forEach((attr) => {
        const value = el.getAttribute(attr) || ''
        const match = value.match(/var\((--logo-[a-z]+)/)
        if (match && colorForVar[match[1]]) {
          el.setAttribute(attr, colorForVar[match[1]])
        }
      })
    })

    const tier = APPLICATION_TIERS[applicationTier]
    const typeSystem = TYPOGRAPHY_SYSTEMS[typographyDirection]

    const wordmarkPrimary =
      computedStyle.getPropertyValue('--logo-wordmark-primary').trim() || primaryColor
    const wordmarkSecondary =
      computedStyle.getPropertyValue('--logo-wordmark-secondary').trim() || primaryColor
    const linePrimaryColor = typeSystem.twoTone ? wordmarkPrimary : primaryColor
    const lineSecondaryColor = typeSystem.twoTone ? wordmarkSecondary : primaryColor

    // Width-fitted systems lay out from the symbol's ink, so they build their
    // own file. Stacked only: fitting the wordmark to the symbol's width has
    // no meaning beside it.
    if (typeSystem.fitted && tier.orientation === 'stacked') {
      const fittedSvg = buildFittedLockupSvg({
        symbol: symbolClone,
        ink: measureSymbolInk(sourceContainer) ?? FULL_INK,
        system: typeSystem,
        spec: typeSystem.fitted,
        symbolPx: tier.symbolPx,
        primaryColor: linePrimaryColor,
        secondaryColor: lineSecondaryColor,
      })
      if (fittedSvg) {
        downloadSvg(fittedSvg)
        return
      }
    }

    const fontSize = tier.fontSizeOverride ?? typeSystem.fontSize
    const letterSpacing = typeSystem.letterSpacing * tier.letterSpacingScale
    const secondaryFontSize = fontSize * WORDMARK_SECONDARY_SCALE
    const secondaryLetterSpacing = letterSpacing * WORDMARK_SECONDARY_TRACKING_SCALE

    const { width: primaryTextWidth } = measureText(
      WORDMARK_LINE_1,
      typeSystem.fontFamily,
      fontSize,
      typeSystem.fontWeight,
      letterSpacing
    )
    const { width: secondaryTextWidth } = measureText(
      WORDMARK_LINE_2,
      typeSystem.fontFamily,
      secondaryFontSize,
      typeSystem.fontWeight,
      secondaryLetterSpacing
    )
    const wordmarkWidth = Math.max(primaryTextWidth, secondaryTextWidth)
    const secondaryMargin = secondaryFontSize * 0.18
    const primaryLineHeight = fontSize * typeSystem.lineHeight
    const secondaryLineHeight = secondaryFontSize * typeSystem.lineHeight
    const wordmarkHeight = primaryLineHeight + secondaryMargin + secondaryLineHeight

    const symbolScale = tier.symbolPx / 200
    const padding = 6
    let svgWidth: number
    let svgHeight: number
    let symbolTransform: string
    let textX: number
    let textAnchor: string
    let wordmarkTop: number

    if (tier.orientation === 'stacked') {
      svgWidth = Math.max(tier.symbolPx, wordmarkWidth) + padding * 2
      svgHeight = tier.symbolPx + tier.gap + wordmarkHeight + padding * 2
      const symbolX = (svgWidth - tier.symbolPx) / 2
      symbolTransform =
        `translate(${symbolX + tier.symbolPx / 2}, ${padding + tier.symbolPx / 2}) ` +
        `scale(${symbolScale * LOCKUP_SYMBOL_SCALE}) translate(-100, -100)`
      textX = svgWidth / 2
      textAnchor = 'middle'
      wordmarkTop = padding + tier.symbolPx + tier.gap
    } else {
      svgWidth = tier.symbolPx + tier.gap + wordmarkWidth + padding * 2
      svgHeight = Math.max(tier.symbolPx, wordmarkHeight) + padding * 2
      const symbolY = (svgHeight - tier.symbolPx) / 2
      symbolTransform =
        `translate(${padding + tier.symbolPx / 2}, ${symbolY + tier.symbolPx / 2}) ` +
        `scale(${symbolScale * LOCKUP_SYMBOL_SCALE}) translate(-100, -100)`
      textX = padding + tier.symbolPx + tier.gap
      textAnchor = 'start'
      wordmarkTop = (svgHeight - wordmarkHeight) / 2
    }

    const svgNS = 'http://www.w3.org/2000/svg'
    const outSvg = document.createElementNS(svgNS, 'svg')
    outSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
    outSvg.setAttribute('width', String(Math.round(svgWidth)))
    outSvg.setAttribute('height', String(Math.round(svgHeight)))
    outSvg.setAttribute('xmlns', svgNS)

    const g = document.createElementNS(svgNS, 'g')
    g.setAttribute('transform', symbolTransform)
    Array.from(symbolClone.childNodes).forEach((child) => g.appendChild(child.cloneNode(true)))
    outSvg.appendChild(g)

    const appendTextLine = (
      text: string,
      y: number,
      size: number,
      tracking: number,
      fill: string
    ) => {
      const textEl = document.createElementNS(svgNS, 'text')
      textEl.setAttribute('x', String(textX))
      textEl.setAttribute('y', String(y))
      textEl.setAttribute('text-anchor', textAnchor)
      textEl.setAttribute('font-family', typeSystem.exportFontFamily)
      textEl.setAttribute('font-size', String(size))
      textEl.setAttribute('font-weight', String(typeSystem.fontWeight))
      textEl.setAttribute('letter-spacing', String(tracking))
      textEl.setAttribute('fill', fill)
      // Real editable text: never converted to paths or rasterized.
      textEl.textContent = text
      outSvg.appendChild(textEl)
    }

    const primaryBaseline = wordmarkTop + fontSize * 0.82
    const secondaryBaseline =
      wordmarkTop + primaryLineHeight + secondaryMargin + secondaryFontSize * 0.82
    appendTextLine(
      WORDMARK_LINE_1,
      primaryBaseline,
      fontSize,
      letterSpacing,
      linePrimaryColor
    )
    appendTextLine(
      WORDMARK_LINE_2,
      secondaryBaseline,
      secondaryFontSize,
      secondaryLetterSpacing,
      lineSecondaryColor
    )

    downloadSvg(outSvg)
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

  const tier = APPLICATION_TIERS[applicationTier]
  const typeSystem = TYPOGRAPHY_SYSTEMS[typographyDirection]
  const lockupFontSize = tier.fontSizeOverride ?? typeSystem.fontSize
  const lockupLetterSpacing = typeSystem.letterSpacing * tier.letterSpacingScale

  return (
    <div className="logo-card">
      <div className="logo-card-header">
        <span className="logo-number">{id.toString().padStart(2, '0')}</span>
        <h3 className="logo-name">{name}</h3>
        {reviewCandidate && <span className="candidate-badge">New Candidate</span>}
      </div>

      <div className="logo-version-toggle">
        <span className="version-label">Logo Version</span>
        <div className="button-group-mini">
          <button
            className={logoVersion === 'symbol' ? 'active' : ''}
            onClick={() => setLogoVersion('symbol')}
          >
            Symbol Only
          </button>
          <button
            className={logoVersion === 'lockup' ? 'active' : ''}
            onClick={() => setLogoVersion('lockup')}
          >
            With Company Name
          </button>
        </div>
      </div>

      <div className={`logo-display logo-background-${logoBackground || 'light'}`} style={logoVersion === 'symbol' && sizeMode && sizeMode !== 'full' ? { minHeight: '120px' } : {}}>
        {logoVersion === 'symbol' ? (
          <div className="logo-container" ref={logoContainerRef} style={sizeMode ? getSizeStyle(sizeMode) : {}}>
            {shouldDisplayAnimated ? animatedLogo : staticLogo}
          </div>
        ) : typeSystem.fitted && tier.orientation === 'stacked' ? (
          <div className="lockup-preview lockup-stacked">
            <FittedLockup
              symbol={shouldDisplayAnimated ? animatedLogo : staticLogo}
              system={typeSystem}
              symbolPx={tier.symbolPx}
              measureRef={exportSourceRef}
              symbolKey={id}
            />
          </div>
        ) : (
          <div
            className={`lockup-preview lockup-${tier.orientation}`}
            style={{ gap: `${tier.gap}px` }}
          >
            <div className="lockup-symbol" style={{ width: tier.symbolPx, height: tier.symbolPx }}>
              {shouldDisplayAnimated ? animatedLogo : staticLogo}
            </div>
            <div className="lockup-wordmark">
              <BrandWordmark
                typeSystem={typeSystem}
                fontSize={lockupFontSize}
                letterSpacing={lockupLetterSpacing}
                align={tier.orientation === 'stacked' ? 'center' : 'left'}
              />
            </div>
          </div>
        )}
        {/* Always-mounted hidden source for lockup SVG export, independent of displayed mode */}
        <div ref={exportSourceRef} className="export-source-hidden" aria-hidden="true">
          {staticLogo}
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
        {logoVersion === 'symbol' ? (
          <button
            className="btn-download"
            onClick={handleDownloadSVG}
            title={`Download SVG (${selectedExportSize}px, ${logoBackground || 'light'})`}
          >
            ↓ SVG ({selectedExportSize}px)
          </button>
        ) : (
          <button
            className="btn-download"
            onClick={handleDownloadLockupSVG}
            title={`Download SVG (${tier.label}, ${logoBackground || 'light'}, ${typeSystem.name})`}
          >
            ↓ SVG ({tier.label})
          </button>
        )}
        <button
          className="btn-copy-link"
          onClick={handleCopyLink}
          aria-label={copyLinkFeedback ? 'Concept link copied' : 'Copy concept link'}
          title={copyLinkFeedback ? 'Copied' : 'Copy link'}
        >
          {copyLinkFeedback ? '✓' : '🔗'}
        </button>
      </div>

      {logoVersion === 'lockup' && (
        <div className="lockup-controls-row">
          <div className="lockup-control-group">
            <span className="control-mini-label">Typography</span>
            <div className="button-group-mini">
              {(Object.keys(TYPOGRAPHY_SYSTEMS) as TypographyDirection[]).map((key) => (
                <button
                  key={key}
                  className={typographyDirection === key ? 'active' : ''}
                  onClick={() => setTypographyDirection(key)}
                  title={TYPOGRAPHY_SYSTEMS[key].description}
                >
                  {TYPOGRAPHY_SYSTEMS[key].name}
                </button>
              ))}
            </div>
          </div>
          <div className="lockup-control-group">
            <span className="control-mini-label">Application</span>
            <div className="button-group-mini">
              {(Object.keys(APPLICATION_TIERS) as ApplicationTier[]).map((key) => (
                <button
                  key={key}
                  className={applicationTier === key ? 'active' : ''}
                  onClick={() => setApplicationTier(key)}
                  title={`${APPLICATION_TIERS[key].orientation} lockup`}
                >
                  {APPLICATION_TIERS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {logoVersion === 'symbol' && (
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
      )}

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
