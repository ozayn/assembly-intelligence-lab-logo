// One writer for both file formats. The caller builds the artwork exactly as
// it always did — a clone of the mark, or a lockup assembled around it, with
// the CSS variables already resolved against the chosen ground — and this
// either serialises that SVG or draws the very same markup into a canvas. The
// PNG is therefore a rendering of the vector file rather than a second copy of
// the artwork, and the two cannot drift apart.

export type ExportFormat = 'svg' | 'png'

const svgNS = 'http://www.w3.org/2000/svg'

const save = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Some browsers read the blob after the click returns, and revoking it in
  // the same tick leaves them writing an empty file. A tick later is safe.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// The size the caller asked the file to be — 16, 32 or 64 for a symbol, the
// tier's own measurements for a lockup — which is what the PNG is rasterised
// at. A side the caller left open is taken from the viewBox's proportions, so
// a lockup keeps its shape instead of being squared off.
const dimensions = (svg: SVGSVGElement) => {
  const box = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number)
  const ratio = box[2] > 0 && box[3] > 0 ? box[2] / box[3] : 1
  const asked = { width: Number(svg.getAttribute('width')), height: Number(svg.getAttribute('height')) }
  const width = asked.width || (asked.height ? asked.height * ratio : box[2] || 200)
  const height = asked.height || (asked.width ? asked.width / ratio : box[3] || 200)
  return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) }
}

const base64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  }
  return btoa(binary)
}

const plain = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

// A font file is the same for every export on the page, so it is read once.
const fetched = new Map<string, Promise<string | null>>()

const fontData = (url: string) => {
  const already = fetched.get(url)
  if (already) return already
  const reading = fetch(url)
    .then(async (file) => (file.ok ? base64(await file.arrayBuffer()) : null))
    .catch(() => null)
  fetched.set(url, reading)
  return reading
}

// An SVG drawn into an image is its own little document: it cannot reach the
// page's webfonts, so a lockup would rasterise in whatever the browser fell
// back to. The faces the page already loaded are found in its own stylesheets,
// fetched, and written back into the file as data URLs under the names the
// artwork asks for, which leaves the text as the vector file has it.
async function embeddedFonts(svg: SVGSVGElement): Promise<string> {
  const wanted = new Set<string>()
  svg.querySelectorAll('text').forEach((text) => {
    ;(text.getAttribute('font-family') ?? '')
      .split(',')
      .forEach((name) => wanted.add(name.trim().replace(/^["']|["']$/g, '')))
  })
  if (wanted.size === 0) return ''

  const faces: CSSFontFaceRule[] = []
  Array.from(document.styleSheets).forEach((sheet) => {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      return // another origin's stylesheet, which never holds our fonts
    }
    Array.from(rules).forEach((rule) => {
      if (rule instanceof CSSFontFaceRule) faces.push(rule)
    })
  })

  const written = await Promise.all(
    faces.map(async (face) => {
      const loaded = face.style.getPropertyValue('font-family').replace(/^["']|["']$/g, '')
      // Next's generated names carry the readable one: __IBM_Plex_Sans_1a2b3c.
      const asked = [...wanted].find((name) => plain(loaded).startsWith(plain(name)))
      if (!asked) return ''
      const source = face.style.getPropertyValue('src').match(/url\((['"]?)([^'")]+)\1\)/)
      if (!source) return '' // a local() fallback face, with nothing to embed
      const data = await fontData(source[2])
      if (!data) return '' // the mark still exports; only the fallback face is used
      // A family arrives as one face per character range, so that descriptor
      // has to come across with it or the last file read would answer for
      // every letter.
      const range = face.style.getPropertyValue('unicode-range')
      return (
        `@font-face{font-family:"${asked}";` +
        `src:url(data:font/woff2;base64,${data}) format("woff2");` +
        `font-weight:${face.style.getPropertyValue('font-weight') || '400'};` +
        `font-style:${face.style.getPropertyValue('font-style') || 'normal'};` +
        (range ? `unicode-range:${range};` : '') +
        `font-display:block;}`
      )
    })
  )

  return [...new Set(written)].join('')
}

async function rasterise(svg: SVGSVGElement): Promise<Blob | null> {
  const { width, height } = dimensions(svg)

  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', svgNS)
  // The viewBox is left alone and the frame is stated in whole pixels, so the
  // browser draws the vector at the export size rather than resampling a
  // bitmap made at some other one.
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))

  const fonts = await embeddedFonts(svg)
  if (fonts) {
    const style = document.createElementNS(svgNS, 'style')
    style.textContent = fonts
    clone.insertBefore(style, clone.firstChild)
  }

  const markup = new XMLSerializer().serializeToString(clone)
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  await image.decode()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return null
  // Nothing is painted underneath: the ground stays transparent unless the
  // artwork itself carries one.
  context.drawImage(image, 0, 0, width, height)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Writes markup that is already a finished file — an animated mark, say, which
// is built as text rather than taken off the page. `name` has no extension.
export function downloadMarkup(markup: string, name: string) {
  save(new Blob([markup], { type: 'image/svg+xml' }), `${name}.svg`)
}

// `name` is the filename without its extension.
export async function downloadMark(svg: SVGSVGElement, name: string, format: ExportFormat) {
  if (format === 'png') {
    const png = await rasterise(svg)
    if (png) save(png, `${name}.png`)
    return
  }
  downloadMarkup(new XMLSerializer().serializeToString(svg), name)
}
