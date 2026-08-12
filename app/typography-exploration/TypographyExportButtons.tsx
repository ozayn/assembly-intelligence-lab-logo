'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { TypographyExportSheet, type SheetVariant } from './TypographyExportSheet'

// Isolated from components/ExportButton.tsx on purpose: the main concept
// sheet keeps its own implementation untouched.

const FILENAMES: Record<SheetVariant, string> = {
  all: 'AIL-typography-exploration',
  selected: 'AIL-typography-selected',
}

// Two problems are solved together here. The symbols paint through CSS custom
// properties, which do not survive serialisation, and html2canvas does not
// draw inline SVG reliably. So each mark is given resolved fills, serialised
// to a data URL and swapped for a decoded <img> for the length of the capture.
async function rasteriseSymbols(root: HTMLElement): Promise<() => void> {
  const svgs = Array.from(root.querySelectorAll<SVGSVGElement>('.tx-symbol svg'))
  const restores: (() => void)[] = []
  const decoding: Promise<unknown>[] = []

  svgs.forEach(svg => {
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const clone = svg.cloneNode(true) as SVGSVGElement
    const sources = Array.from(svg.querySelectorAll<SVGElement>('[fill]'))
    const targets = Array.from(clone.querySelectorAll<SVGElement>('[fill]'))
    sources.forEach((source, i) => {
      targets[i]?.setAttribute('fill', getComputedStyle(source).fill)
    })
    clone.setAttribute('width', String(rect.width))
    clone.setAttribute('height', String(rect.height))

    const markup = new XMLSerializer().serializeToString(clone)
    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
    img.width = rect.width
    img.height = rect.height
    img.style.display = 'block'
    decoding.push(img.decode().catch(() => undefined))

    const originalDisplay = svg.style.display
    svg.style.display = 'none'
    svg.parentElement?.appendChild(img)

    restores.push(() => {
      img.remove()
      svg.style.display = originalDisplay
    })
  })

  await Promise.all(decoding)
  return () => restores.forEach(restore => restore())
}

// html2canvas cannot clip a background to glyphs, so gradient wordmarks would
// rasterise as invisible text. Each line is rebuilt for the capture as one
// span per character, coloured by sampling the same ramp the browser draws
// from — no colour outside the official stops is introduced.
function expandGradientText(root: HTMLElement): () => void {
  const lines = Array.from(root.querySelectorAll<HTMLElement>('.tx-line'))
  const restores: (() => void)[] = []

  lines.forEach(line => {
    const style = getComputedStyle(line)
    const parentStyle = line.parentElement ? getComputedStyle(line.parentElement) : null
    const ownGradient = style.backgroundImage !== 'none' ? style.backgroundImage : null
    const blockGradient =
      parentStyle && parentStyle.backgroundImage !== 'none' ? parentStyle.backgroundImage : null
    const gradient = ownGradient || blockGradient
    if (!gradient) return

    const stops = gradient.match(/rgba?\([^)]+\)/g)
    if (!stops || stops.length < 2) return

    const text = line.textContent ?? ''
    const originalHTML = line.innerHTML
    const originalColor = line.style.color
    const originalBackground = line.style.backgroundImage

    const parsed = stops.map(stop =>
      stop
        .replace(/rgba?\(|\)/g, '')
        .split(',')
        .map(v => parseFloat(v))
    )

    const sample = (t: number) => {
      const span = (parsed.length - 1) * Math.min(Math.max(t, 0), 1)
      const i = Math.min(Math.floor(span), parsed.length - 2)
      const f = span - i
      const [a, b] = [parsed[i], parsed[i + 1]]
      const mix = (x: number, y: number) => Math.round(x + (y - x) * f)
      return `rgb(${mix(a[0], b[0])}, ${mix(a[1], b[1])}, ${mix(a[2], b[2])})`
    }

    const chars = Array.from(text)
    line.innerHTML = ''
    chars.forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.color = sample(chars.length > 1 ? i / (chars.length - 1) : 0)
      line.appendChild(span)
    })
    line.style.backgroundImage = 'none'
    line.style.color = 'inherit'

    restores.push(() => {
      line.innerHTML = originalHTML
      line.style.color = originalColor
      line.style.backgroundImage = originalBackground
    })
  })

  // Once the ramp has been sampled, the block-level background has to go as
  // well: clipping it to the glyphs is exactly the part html2canvas cannot
  // reproduce, so left in place it rasterises as a filled rectangle.
  Array.from(root.querySelectorAll<HTMLElement>('.tx-wordmark')).forEach(block => {
    if (getComputedStyle(block).backgroundImage === 'none') return
    const originalBackground = block.style.backgroundImage
    block.style.backgroundImage = 'none'
    restores.push(() => {
      block.style.backgroundImage = originalBackground
    })
  })

  return () => restores.forEach(restore => restore())
}

export function TypographyExportButtons() {
  const allRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<SheetVariant | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleExport = async (variant: SheetVariant) => {
    const node = variant === 'all' ? allRef.current : selectedRef.current
    if (!node || busy) return

    setBusy(variant)
    setStatus('Rendering…')
    let restoreSymbols: (() => void) | null = null
    let restoreText: (() => void) | null = null

    try {
      await document.fonts?.ready
      // Let the per-line measurement settle before anything is rasterised.
      await new Promise(resolve => setTimeout(resolve, 400))

      restoreSymbols = await rasteriseSymbols(node)
      restoreText = expandGradientText(node)

      const width = node.scrollWidth
      const height = node.scrollHeight
      // Stay inside the browser's maximum canvas dimension.
      const scale = Math.max(1, Math.min(2, 16000 / Math.max(width, height)))

      const canvas = await html2canvas(node, {
        backgroundColor: '#ffffff',
        scale,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        logging: false,
        onclone: (doc: Document) => {
          const clone = doc.querySelector<HTMLElement>(`[data-export-sheet="${variant}"]`)
          if (clone) {
            clone.style.visibility = 'visible'
            clone.style.zIndex = '0'
          }
        },
      })

      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (!blob) throw new Error('Could not encode PNG')

      const filename = `${FILENAMES[variant]}-${new Date().toISOString().slice(0, 10)}.png`
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setStatus(`Saved ${filename} — ${canvas.width}×${canvas.height}px`)
    } catch (error) {
      console.error('Typography export failed:', error)
      setStatus('Export failed — see console')
    } finally {
      restoreText?.()
      restoreSymbols?.()
      setBusy(null)
    }
  }

  return (
    <>
      <div className="tx-export-bar">
        <button
          className="tx-export-btn"
          onClick={() => handleExport('all')}
          disabled={busy !== null}
        >
          {busy === 'all' ? 'Exporting…' : 'Export All Typography Options'}
        </button>
        <button
          className="tx-export-btn secondary"
          onClick={() => handleExport('selected')}
          disabled={busy !== null}
        >
          {busy === 'selected' ? 'Exporting…' : 'Export Selected Comparison'}
        </button>
        {status && <span className="tx-export-status">{status}</span>}
      </div>

      <TypographyExportSheet ref={allRef} variant="all" />
      <TypographyExportSheet ref={selectedRef} variant="selected" />
    </>
  )
}
