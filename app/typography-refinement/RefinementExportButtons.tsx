'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { RefinementExportSheet } from './RefinementExportSheet'

// Kept separate from the round-1 exporter so that study stays frozen. There
// are no gradients in this round, so the only preparation the capture needs is
// the symbols: html2canvas does not draw inline SVG, and the CSS custom
// properties the marks paint through do not survive serialisation.
async function rasteriseSymbols(root: HTMLElement): Promise<() => void> {
  const svgs = Array.from(root.querySelectorAll<SVGSVGElement>('.rf-symbol svg'))
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

    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(clone)
    )}`
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

export function RefinementExportButtons() {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleExport = async () => {
    const node = sheetRef.current
    if (!node || busy) return

    setBusy(true)
    setStatus('Rendering…')
    let restoreSymbols: (() => void) | null = null

    try {
      await document.fonts?.ready
      // Let the solved sizes and tracking settle before rasterising.
      await new Promise(resolve => setTimeout(resolve, 400))
      restoreSymbols = await rasteriseSymbols(node)

      const width = node.scrollWidth
      const height = node.scrollHeight
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
          const clone = doc.querySelector<HTMLElement>('[data-refinement-sheet="all"]')
          if (clone) {
            clone.style.visibility = 'visible'
            clone.style.zIndex = '0'
          }
        },
      })

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Could not encode PNG')

      const filename = `AIL-typography-refinement-${new Date().toISOString().slice(0, 10)}.png`
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
      console.error('Refinement export failed:', error)
      setStatus('Export failed — see console')
    } finally {
      restoreSymbols?.()
      setBusy(false)
    }
  }

  return (
    <>
      <div className="rf-export-bar">
        <button className="rf-export-btn" onClick={handleExport} disabled={busy}>
          {busy ? 'Exporting…' : 'Export All Refinements'}
        </button>
        {status && <span className="rf-export-status">{status}</span>}
      </div>

      <RefinementExportSheet ref={sheetRef} />
    </>
  )
}
