'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { DIRECTIONS } from './directions'
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
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(rect.width))
    clone.setAttribute('height', String(rect.height))

    const markup = new XMLSerializer().serializeToString(clone)
    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
    img.width = rect.width
    img.height = rect.height
    img.style.display = 'block'
    img.style.width = `${rect.width}px`
    img.style.height = `${rect.height}px`
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

function resolveFamily(cssFamily: string): string {
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

// fonts.ready resolves once nothing is pending, which on a page that has not
// yet painted a given family can be true before that family is fetched. Each
// direction's font is requested explicitly, at the weights the wordmark uses.
async function loadDirectionFonts(): Promise<string[]> {
  const requests = DIRECTIONS.flatMap(direction => {
    const family = resolveFamily(direction.cssFamily).split(',')[0]
    return [direction.weightPrimary, direction.weightSecondary].map(weight =>
      document.fonts
        .load(`${weight} 40px ${family}`, 'ASSEMBLY INTELLIGENCE LAB')
        .then(faces => ({ family, weight, ok: faces.length > 0 }))
        .catch(() => ({ family, weight, ok: false }))
    )
  })
  const results = await Promise.all(requests)
  await document.fonts.ready
  return results.filter(r => !r.ok).map(r => `${r.family} ${r.weight}`)
}

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

// Every lockup solves its own tracking after measuring the loaded font, and
// stays transparent until it has. Capturing before that would rasterise empty
// wordmarks, so the sheet is not photographed until all of them are up.
async function waitForFittedWordmarks(root: HTMLElement, timeoutMs = 8000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const wordmarks = Array.from(root.querySelectorAll<HTMLElement>('.tx-wordmark'))
    const settled =
      wordmarks.length > 0 &&
      wordmarks.every(w => parseFloat(getComputedStyle(w).opacity || '0') > 0.99)
    if (settled) return true
    await frame()
  }
  return false
}

// Browsers cap canvas size, and Safari's cap is on total area rather than a
// single dimension — over it, the context still accepts draw calls but keeps
// nothing, which is how an export turns into a blank or shifted sheet. Probing
// the far corner is the only reliable way to know the size will hold.
function canAllocate(width: number, height: number): boolean {
  const probe = document.createElement('canvas')
  probe.width = width
  probe.height = height
  const ctx = probe.getContext('2d')
  if (!ctx) return false
  try {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(width - 1, height - 1, 1, 1)
    const pixel = ctx.getImageData(width - 1, height - 1, 1, 1).data
    return pixel[0] === 255 && pixel[3] === 255
  } catch {
    return false
  } finally {
    probe.width = 0
    probe.height = 0
  }
}

const SCALE_STEPS = [2, 1.75, 1.5, 1.25, 1]

function chooseScale(width: number, height: number): number {
  for (const scale of SCALE_STEPS) {
    if (canAllocate(Math.round(width * scale), Math.round(height * scale))) return scale
  }
  return 1
}

export function TypographyExportButtons() {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState<SheetVariant | null>(null)
  const [busy, setBusy] = useState<SheetVariant | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const capture = useCallback(async (variant: SheetVariant, node: HTMLElement) => {
    let restoreSymbols: (() => void) | null = null
    let restoreText: (() => void) | null = null

    try {
      setStatus('Loading fonts…')
      const missing = await loadDirectionFonts()
      if (missing.length) console.warn('Typography export — fonts unavailable:', missing)

      setStatus('Measuring wordmarks…')
      const fitted = await waitForFittedWordmarks(node)
      if (!fitted) console.warn('Typography export — some wordmarks had not solved in time')
      // One more frame so the final measured widths are in the layout.
      await frame()
      await frame()

      setStatus('Rendering…')
      restoreSymbols = await rasteriseSymbols(node)
      restoreText = expandGradientText(node)

      const sheet = node.firstElementChild as HTMLElement
      const width = Math.ceil(sheet.scrollWidth)
      const height = Math.ceil(sheet.scrollHeight)
      const scale = chooseScale(width, height)

      const canvas = await html2canvas(sheet, {
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

      // If the browser handed back something smaller than asked for, the
      // capture is not what it claims to be and should not be saved.
      const expected = { w: Math.round(width * scale), h: Math.round(height * scale) }
      if (canvas.width < expected.w - 2 || canvas.height < expected.h - 2) {
        throw new Error(
          `Canvas was clamped to ${canvas.width}×${canvas.height} (asked ${expected.w}×${expected.h})`
        )
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
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

      setStatus(
        `Saved ${filename} — ${canvas.width}×${canvas.height}px at ${scale}× (${width}×${height} CSS)`
      )
    } catch (error) {
      console.error('Typography export failed:', error)
      setStatus(`Export failed — ${error instanceof Error ? error.message : 'see console'}`)
    } finally {
      restoreText?.()
      restoreSymbols?.()
    }
  }, [])

  // The sheet is mounted only for the capture: keeping several thousand pixels
  // of hidden lockups in the live page permanently is both wasteful and a way
  // for the page to affect what gets exported.
  useEffect(() => {
    if (!pending) return
    let cancelled = false
    const run = async () => {
      await frame()
      const node = sheetRef.current
      if (!node || cancelled) return
      await capture(pending, node)
      if (!cancelled) {
        setPending(null)
        setBusy(null)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [pending, capture])

  const start = (variant: SheetVariant) => {
    if (busy) return
    setBusy(variant)
    setStatus('Preparing sheet…')
    setPending(variant)
  }

  return (
    <>
      <div className="tx-export-bar">
        <button className="tx-export-btn" onClick={() => start('all')} disabled={busy !== null}>
          {busy === 'all' ? 'Exporting…' : 'Export All Typography Options'}
        </button>
        <button
          className="tx-export-btn secondary"
          onClick={() => start('selected')}
          disabled={busy !== null}
        >
          {busy === 'selected' ? 'Exporting…' : 'Export Selected Comparison'}
        </button>
        {status && <span className="tx-export-status">{status}</span>}
      </div>

      {pending && <TypographyExportSheet ref={sheetRef} variant={pending} />}
    </>
  )
}
