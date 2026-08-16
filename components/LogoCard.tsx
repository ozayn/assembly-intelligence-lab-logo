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
import { downloadMark, downloadMarkup, markMarkup, type ExportFormat } from './logoExport'
import { ANIMATED_MARKS } from './logos/animatedMarks'
import './LogoCard.css'

type ExportSize = '16' | '32' | '64' | '128' | '256' | '512' | '1024' | '2048'
type LogoVersion = 'symbol' | 'lockup'

// What a symbol can be written at. The first three are the legibility sizes
// the strip at the foot of the card shows at true size; the rest are for
// raster assets, where a mark has to be drawn well above the size it is shown
// at — the Squarespace header stands it at about 102 CSS pixels, which a 64px
// PNG cannot serve on a retina screen, and Concept 41's channels are a little
// over a hundredth of the mark across and need the room besides. The last two
// are for the lockup, whose wordmark asks for far more width than the symbol
// does before its type holds up in print or on a banner.
const EXPORT_SIZES: ExportSize[] = ['16', '32', '64', '128', '256', '512', '1024', '2048']
const PREVIEW_SIZES: ExportSize[] = ['64', '32', '16']

// What a token falls back to if the scope it is read from has not been styled.
const LOGO_COLOURS: Record<string, string> = {
  '--logo-primary': '#08255A',
  '--logo-secondary': '#0B4B70',
  '--logo-accent': '#109596',
  '--logo-light': '#58B7B1',
  '--logo-pale': '#B7DEDA',
  '--logo-muted': '#57606a',
}

// Resolve the logo tokens against the container the mark is exported from,
// which carries the target website background's scope (see
// .logo-background-light/.logo-background-dark in LogoCard.css) — not the
// reviewer's own site theme.
const resolveLogoColours = (container: HTMLElement): Record<string, string> => {
  const computed = getComputedStyle(container)
  return Object.fromEntries(
    Object.entries(LOGO_COLOURS).map(([token, fallback]) => [
      token,
      computed.getPropertyValue(token).trim() || fallback,
    ])
  )
}

// The older selection-based copy, which is the one that still goes through in a
// browser that will not give the page the clipboard permission. It is written
// the long way — a field that can genuinely hold a selection, selected by range
// as well as by index — because the short way silently copies nothing on iOS
// and Safari, and a copy that quietly does not happen is worse than one that
// says so: the reviewer pastes what they copied the time before.
const copyBySelection = (text: string): boolean => {
  const holder = document.createElement('textarea')
  holder.value = text
  holder.setAttribute('aria-hidden', 'true')
  holder.style.cssText =
    'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;opacity:0'
  document.body.appendChild(holder)

  const previous = document.activeElement as HTMLElement | null
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(holder)
  selection?.removeAllRanges()
  selection?.addRange(range)
  holder.focus()
  holder.setSelectionRange(0, text.length)

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }

  selection?.removeAllRanges()
  holder.remove()
  previous?.focus?.()
  return copied
}

// The clipboard proper is asked first, from inside the click so the gesture it
// wants is still standing. It refuses a document that does not hold focus, and
// Safari refuses it outside a gesture it recognises, which is what the
// selection copy is behind it for.
const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return copyBySelection(text)
  }
}

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
  // Opening state only. Both remain fully switchable by the reviewer, and the
  // defaults are what every existing page already shows.
  initialLogoVersion?: LogoVersion
  initialTypography?: TypographyDirection
  // Set once for the page, so every download on it writes the same format.
  exportFormat?: ExportFormat
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
  initialLogoVersion = 'symbol',
  initialTypography = 'scientific',
  exportFormat = 'png',
}: LogoCardProps) {
  const [isAnimating, setIsAnimating] = useState(onPlayAll)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false)
  const [animationCodeState, setAnimationCodeState] = useState<'idle' | 'copied' | 'failed'>(
    'idle'
  )
  const [svgCodeState, setSvgCodeState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [selectedExportSize, setSelectedExportSize] = useState<ExportSize>('64')
  const [logoVersion, setLogoVersion] = useState<LogoVersion>(initialLogoVersion)
  const [typographyDirection, setTypographyDirection] =
    useState<TypographyDirection>(initialTypography)
  const [applicationTier, setApplicationTier] = useState<ApplicationTier>('full')
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const [descriptionRunsOn, setDescriptionRunsOn] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const animatedMark = ANIMATED_MARKS[id]
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const sizeContainerRefs = useRef<Partial<Record<ExportSize, HTMLDivElement | null>>>({})
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

  // The description is clamped to three lines, and only a description that
  // actually runs past them is given something to click. Whether it does
  // depends on how wide the card is, so it is measured rather than guessed at.
  useEffect(() => {
    const paragraph = descriptionRef.current
    if (!paragraph) return
    const measure = () => {
      if (descriptionOpen) return // an open one always overflows its clamp
      setDescriptionRunsOn(paragraph.scrollHeight - paragraph.clientHeight > 1)
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(paragraph)
    return () => watch.disconnect()
  }, [description, descriptionOpen])

  // A vector file has no resolution to pick. The viewBox carries the geometry
  // and the proportions; a width of 100% and no height lets the artwork take
  // the width of whatever it is dropped into, with the height following from
  // the ratio — which is what a paste into a page's own markup wants, and what
  // an editor opening the file reads anyway.
  const unframed = (svg: SVGSVGElement) => {
    svg.setAttribute('width', '100%')
    svg.removeAttribute('height')
    return svg
  }

  const composeSymbolSvg = (format: ExportFormat): SVGSVGElement | null => {
    // Pull geometry from the container matching the selected export size, so
    // that a future size-specific micro-mark is exported instead of the
    // full mark scaled down. The sizes above the legibility strip have no
    // container of their own and come off the hidden source, which holds the
    // full mark whether or not the card is mid-animation.
    const sourceContainer =
      sizeContainerRefs.current[selectedExportSize] ||
      exportSourceRef.current ||
      logoContainerRef.current
    if (!sourceContainer) return null

    const svgElement = sourceContainer.querySelector('svg')
    if (!svgElement) return null

    const svgClone = svgElement.cloneNode(true) as SVGSVGElement
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // A symbol is square, so the size chosen is both its sides — and it is the
    // raster frame only: the vector goes out unframed, and the size still
    // decides which mark is taken, since 16 and 32 may hold a micro-mark of
    // their own rather than the full one shrunk.
    if (format === 'png') {
      const dimension = Number(selectedExportSize)
      svgClone.setAttribute('width', dimension.toString())
      svgClone.setAttribute('height', dimension.toString())
    } else {
      unframed(svgClone)
    }

    const colorForVar = resolveLogoColours(sourceContainer)

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

    return svgClone
  }

  // The size belongs in a raster's name, where it is a fact about the file.
  // A vector has no size to state, so its name says what it is and leaves the
  // measurement to whoever places it.
  const measured = (format: ExportFormat) =>
    format === 'png' ? `${selectedExportSize}px-` : ''

  const handleDownloadSymbol = (format: ExportFormat) => {
    const svg = composeSymbolSvg(format)
    if (!svg) return
    const backgroundVariant = logoBackground || 'light'
    downloadMark(
      svg,
      `AIL-concept-${id.toString().padStart(2, '0')}-${measured(format)}${backgroundVariant}-symbol`,
      format
    )
  }

  // The animation as markup that plays by itself. It is built from the
  // concept's own geometry rather than taken off the page, so the reviewer's
  // React has no part in what is written; the ground selected here decides the
  // colours, which go into it as literal values, and the selected size the side
  // it is written at — as with the still exports. Saving it and copying it both
  // come through here, so a downloaded file and a pasted one cannot differ.
  const composeAnimated = (): string | null => {
    const sourceContainer = exportSourceRef.current || logoContainerRef.current
    if (!sourceContainer || !animatedMark) return null
    const colours = resolveLogoColours(sourceContainer)
    return animatedMark((token) => colours[token], Number(selectedExportSize))
  }

  const handleDownloadAnimated = () => {
    const markup = composeAnimated()
    if (!markup) return
    const backgroundVariant = logoBackground || 'light'
    downloadMarkup(
      markup,
      `AIL-concept-${id.toString().padStart(2, '0')}-${selectedExportSize}px-${backgroundVariant}-animated`
    )
  }

  // The same markup on the clipboard, bare, for pasting into a page's own
  // custom-code block.
  const handleCopyAnimated = async () => {
    const markup = composeAnimated()
    const copied = markup ? await copyText(markup) : false
    setAnimationCodeState(copied ? 'copied' : 'failed')
    setTimeout(() => setAnimationCodeState('idle'), 2400)
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

  const framedLockup = (svg: SVGSVGElement, format: ExportFormat) => {
    if (format !== 'png') return unframed(svg)
    // A lockup is laid out at its tier's own measurements, which are far too
    // small for a raster asset. A lockup is not square and is placed by how
    // wide it is, so the export size is its width; the height comes off the
    // artwork's own proportions, and the viewBox is left alone so nothing is
    // stretched to reach it.
    const laidOutWidth = Number(svg.getAttribute('width'))
    const laidOutHeight = Number(svg.getAttribute('height'))
    const width = Number(selectedExportSize)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(Math.round((width * laidOutHeight) / laidOutWidth)))
    return svg
  }

  const composeLockupSvg = (format: ExportFormat): SVGSVGElement | null => {
    const sourceContainer = exportSourceRef.current
    if (!sourceContainer) return null
    const svgElement = sourceContainer.querySelector('svg')
    if (!svgElement) return null

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
      if (fittedSvg) return framedLockup(fittedSvg, format)
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

    return framedLockup(outSvg, format)
  }

  const handleDownloadLockup = (format: ExportFormat) => {
    const svg = composeLockupSvg(format)
    if (!svg) return
    const backgroundVariant = logoBackground || 'light'
    downloadMark(
      svg,
      `AIL-concept-${id.toString().padStart(2, '0')}-${applicationTier}-${measured(format)}${backgroundVariant}-${typographyDirection}-lockup`,
      format
    )
  }

  // What the card is showing, written in the format asked for. The page's
  // Format choice sets the raster button; the vector is offered whichever way
  // that is set, since a vector answers to no size and there is nothing to
  // choose before taking one.
  const handleDownload = (format: ExportFormat) =>
    logoVersion === 'symbol' ? handleDownloadSymbol(format) : handleDownloadLockup(format)

  // The very file the SVG download writes, on the clipboard instead: the same
  // composed artwork, serialised the same way, fonts and all, so it can go
  // straight into a page's own markup.
  const handleCopySvg = async () => {
    const svg = logoVersion === 'symbol' ? composeSymbolSvg('svg') : composeLockupSvg('svg')
    const markup = svg ? await markMarkup(svg) : null
    const copied = markup ? await copyText(markup) : false
    setSvgCodeState(copied ? 'copied' : 'failed')
    setTimeout(() => setSvgCodeState('idle'), 2400)
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

      <div className="logo-description-block">
        <p
          ref={descriptionRef}
          className={`logo-description${descriptionOpen ? ' open' : ''}`}
        >
          {description}
        </p>
        {descriptionRunsOn && (
          <button
            className="description-toggle"
            onClick={() => setDescriptionOpen(!descriptionOpen)}
            aria-expanded={descriptionOpen}
          >
            {descriptionOpen ? 'Less' : 'More…'}
          </button>
        )}
      </div>

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
        {exportFormat === 'png' && (
          <button
            className="btn-download"
            onClick={() => handleDownload('png')}
            title={
              logoVersion === 'symbol'
                ? `Download PNG (${selectedExportSize} × ${selectedExportSize}, ${logoBackground || 'light'})`
                : `Download PNG (${tier.label} at ${selectedExportSize}px wide, height to match, ${logoBackground || 'light'}, ${typeSystem.name})`
            }
          >
            ↓ PNG ({logoVersion === 'symbol' ? `${selectedExportSize}px` : tier.label})
          </button>
        )}
        <button
          className="btn-download"
          onClick={() => handleDownload('svg')}
          title={
            logoVersion === 'symbol'
              ? `Download the vector symbol — it carries no size (${logoBackground || 'light'})`
              : `Download the vector ${tier.label.toLowerCase()} lockup — it carries no size (${logoBackground || 'light'}, ${typeSystem.name})`
          }
        >
          ↓ SVG{logoVersion === 'symbol' ? '' : ` (${tier.label})`}
        </button>
        <button
          className={`btn-download${svgCodeState === 'failed' ? ' failed' : ''}`}
          onClick={handleCopySvg}
          title={`Copy the vector markup of this ${
            logoVersion === 'symbol' ? 'symbol' : 'lockup'
          } to the clipboard (${logoBackground || 'light'})`}
        >
          {svgCodeState === 'copied'
            ? 'Copied!'
            : svgCodeState === 'failed'
              ? 'Copy failed'
              : 'Copy SVG'}
        </button>
        {/* The animation belongs to the symbol, so it is offered in either
            mode rather than only alongside the symbol download — Final
            Nominees opens its cards on the lockup. */}
        {animatedMark && (
          <button
            className="btn-download"
            onClick={handleDownloadAnimated}
            title={`Download the symbol's animation as a self-contained SVG (${logoBackground || 'light'})`}
          >
            ↓ Animated SVG
          </button>
        )}
        {animatedMark && (
          <button
            className={`btn-download${animationCodeState === 'failed' ? ' failed' : ''}`}
            onClick={handleCopyAnimated}
            title={`Copy the same markup to the clipboard (${selectedExportSize}px, ${logoBackground || 'light'})`}
          >
            {animationCodeState === 'copied'
              ? 'Copied!'
              : animationCodeState === 'failed'
                ? 'Copy failed'
                : 'Copy Animation Code'}
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

      {/* Pixels are only ever chosen for something rastered. With the page set
          to SVG there is nothing to choose, and the row goes — except on a
          concept whose animation is written as a file at a stated size, where
          it stays and says so. */}
      {(exportFormat === 'png' || animatedMark) && (
        <div className="symbol-controls-row">
          <div className="symbol-control-group">
            <span className="control-mini-label">
              {exportFormat !== 'png'
                ? 'Animation Size'
                : logoVersion === 'symbol'
                  ? 'Export Size'
                  : 'Export Width'}
            </span>
            <div className="button-group-mini">
              {EXPORT_SIZES.map((size) => (
                <button
                  key={size}
                  className={selectedExportSize === size ? 'active' : ''}
                  onClick={() => setSelectedExportSize(size)}
                  title={
                    exportFormat !== 'png'
                      ? `Write the animated SVG at ${size}px`
                      : logoVersion === 'symbol'
                        ? `Export the symbol at ${size} × ${size}`
                        : `Export the lockup ${size}px wide, its height following the lockup's own proportions`
                  }
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {logoVersion === 'symbol' && (
      <div className="logo-sizes">
        {PREVIEW_SIZES.map((size) => (
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
