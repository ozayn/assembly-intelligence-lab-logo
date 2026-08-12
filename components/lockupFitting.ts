// Measurement and layout for width-fitted lockups. The preview component and
// the SVG export both solve through here, so what downloads is what the card
// showed.
//
// The arithmetic is the one developed in app/typography-exploration
// (ExplorationLockup.tsx). That page is deliberately frozen as the record of
// the study, so the logic is restated here rather than imported from it.

import {
  WORDMARK_LINE_1,
  WORDMARK_LINE_2,
  type FittedSpec,
  type TypographySystem,
} from './typographySystems'

export interface SymbolInk {
  left: number
  top: number
  right: number
  bottom: number
}

// Fallback when a mark's geometry cannot be measured: the whole 200-unit box.
export const FULL_INK: SymbolInk = { left: 0, top: 0, right: 200, bottom: 200 }

export interface LineMetrics {
  /** Advance width with no tracking applied. */
  natural: number
  /** Cap height at this size. */
  cap: number
  /** Line box top edge down to the cap line. */
  capOffset: number
  /** Baseline down to the line box bottom edge. */
  belowBaseline: number
}

export interface FittedSolution {
  primarySize: number
  secondarySize: number
  trackingPrimary: number
  trackingSecondary: number
  primary: LineMetrics
  secondary: LineMetrics
  /** Width both lines resolve to. */
  targetWidth: number
  inkWidth: number
  inkHeight: number
  symbolGap: number
  lineGap: number
  scale: number
}

let sharedContext: CanvasRenderingContext2D | null = null

function getContext(): CanvasRenderingContext2D | null {
  if (!sharedContext) {
    sharedContext = document.createElement('canvas').getContext('2d')
  }
  return sharedContext
}

// next/font families are hashed at build time and only reachable through their
// CSS variable, so a stack containing var() has to be resolved before it can
// be handed to canvas or measured.
export function resolveFontStack(cssFamily: string): string {
  const root = getComputedStyle(document.documentElement)
  return cssFamily
    .split(',')
    .map(part => {
      const match = part.trim().match(/^var\((--[\w-]+)\)$/)
      if (!match) return part.trim()
      return root.getPropertyValue(match[1]).trim()
    })
    .filter(Boolean)
    .join(', ')
}

export function measureLine(
  text: string,
  fontStack: string,
  weight: number,
  size: number
): LineMetrics | null {
  const ctx = getContext()
  if (!ctx) return null
  ctx.font = `${weight} ${size}px ${fontStack}`
  const m = ctx.measureText(text)
  const ascent = m.fontBoundingBoxAscent ?? size * 0.8
  const descent = m.fontBoundingBoxDescent ?? size * 0.2
  const cap = m.actualBoundingBoxAscent ?? size * 0.7
  // Line height is 1 on both lines, so the leading splits evenly.
  const halfLeading = (size - (ascent + descent)) / 2
  return {
    natural: m.width,
    cap,
    capOffset: halfLeading + (ascent - cap),
    belowBaseline: halfLeading + descent,
  }
}

/**
 * Solves sizes and per-line tracking for a symbol rendered at symbolPx.
 * Returns null until the webfont is available to measure.
 */
export function solveFittedLockup(
  system: TypographySystem,
  spec: FittedSpec,
  ink: SymbolInk,
  symbolPx: number
): FittedSolution | null {
  const scale = symbolPx / 200
  const inkWidth = (ink.right - ink.left) * scale
  const inkHeight = (ink.bottom - ink.top) * scale
  const targetWidth = inkWidth * spec.widthFactor
  const primarySize = inkWidth * spec.primarySizeRatio
  const secondarySize = primarySize * spec.secondarySizeRatio

  const fontStack = resolveFontStack(system.fontFamily)
  const primary = measureLine(WORDMARK_LINE_1, fontStack, spec.primaryWeight, primarySize)
  const secondary = measureLine(WORDMARK_LINE_2, fontStack, spec.secondaryWeight, secondarySize)
  if (!primary || !secondary) return null

  return {
    primarySize,
    secondarySize,
    // Tracking sits between characters; the trailing space is cancelled by the
    // caller, so it divides across n-1 gaps.
    trackingPrimary: (targetWidth - primary.natural) / (WORDMARK_LINE_1.length - 1),
    trackingSecondary: (targetWidth - secondary.natural) / (WORDMARK_LINE_2.length - 1),
    primary,
    secondary,
    targetWidth,
    inkWidth,
    inkHeight,
    symbolGap: symbolPx * spec.symbolGapRatio,
    lineGap: primarySize * spec.lineGapEm,
    scale,
  }
}

/** Ink bounds of a mark in its own 200-unit user space. */
export function measureSymbolInk(container: HTMLElement | null): SymbolInk | null {
  const svg = container?.querySelector('svg')
  if (!svg) return null
  try {
    const box = (svg as SVGGraphicsElement).getBBox()
    if (!box.width || !box.height) return null
    return {
      left: box.x,
      top: box.y,
      right: box.x + box.width,
      bottom: box.y + box.height,
    }
  } catch {
    return null
  }
}

export interface FittedExportOptions {
  symbol: SVGElement
  ink: SymbolInk
  system: TypographySystem
  spec: FittedSpec
  symbolPx: number
  primaryColor: string
  secondaryColor: string
  padding?: number
}

/**
 * Builds the downloadable lockup: the symbol cropped to its ink, with two real
 * <text> lines placed on the same measurements the preview uses.
 */
export function buildFittedLockupSvg({
  symbol,
  ink,
  system,
  spec,
  symbolPx,
  primaryColor,
  secondaryColor,
  padding = 6,
}: FittedExportOptions): SVGSVGElement | null {
  const solved = solveFittedLockup(system, spec, ink, symbolPx)
  if (!solved) return null

  const baselinePrimary = padding + solved.inkHeight + solved.symbolGap + solved.primary.cap
  const baselineSecondary = baselinePrimary + solved.lineGap + solved.secondary.cap
  const width = Math.max(solved.inkWidth, solved.targetWidth) + padding * 2
  const height = baselineSecondary + padding

  const svgNS = 'http://www.w3.org/2000/svg'
  const out = document.createElementNS(svgNS, 'svg')
  out.setAttribute('viewBox', `0 0 ${width} ${height}`)
  out.setAttribute('width', String(Math.round(width)))
  out.setAttribute('height', String(Math.round(height)))
  out.setAttribute('xmlns', svgNS)

  const group = document.createElementNS(svgNS, 'g')
  group.setAttribute(
    'transform',
    `translate(${padding - ink.left * solved.scale}, ${padding - ink.top * solved.scale}) ` +
      `scale(${solved.scale})`
  )
  Array.from(symbol.childNodes).forEach(child => group.appendChild(child.cloneNode(true)))
  out.appendChild(group)

  const centre = padding + solved.targetWidth / 2

  const appendLine = (
    text: string,
    baseline: number,
    size: number,
    weight: number,
    tracking: number,
    fill: string
  ) => {
    const el = document.createElementNS(svgNS, 'text')
    // SVG applies letter-spacing after the last character too, so a centred
    // line would sit half a tracking step to the left without this nudge.
    el.setAttribute('x', String(centre + tracking / 2))
    el.setAttribute('y', String(baseline))
    el.setAttribute('text-anchor', 'middle')
    el.setAttribute('font-family', system.exportFontFamily)
    el.setAttribute('font-size', String(size))
    el.setAttribute('font-weight', String(weight))
    el.setAttribute('letter-spacing', String(tracking))
    el.setAttribute('fill', fill)
    // Real editable text: never converted to paths or rasterized.
    el.textContent = text
    out.appendChild(el)
  }

  appendLine(
    WORDMARK_LINE_1,
    baselinePrimary,
    solved.primarySize,
    spec.primaryWeight,
    solved.trackingPrimary,
    primaryColor
  )
  appendLine(
    WORDMARK_LINE_2,
    baselineSecondary,
    solved.secondarySize,
    spec.secondaryWeight,
    solved.trackingSecondary,
    secondaryColor
  )

  return out
}
