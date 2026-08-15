// One writer for both file formats. The caller builds the artwork exactly as
// it always did — a clone of the mark, or a lockup assembled around it, with
// the CSS variables already resolved against the chosen ground — and this
// either serialises that SVG or draws the very same markup into a canvas. The
// PNG is therefore a rendering of the vector file rather than a second copy of
// the artwork, and the two cannot drift apart.

export type ExportFormat = 'svg' | 'png'

// Long enough for print comps and retina web use. The short side follows from
// the artwork's own proportions, so nothing is ever stretched to fill it.
export const PNG_LONGEST_EDGE = 2048

const svgNS = 'http://www.w3.org/2000/svg'

const save = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// The artwork's own dimensions, preferring the viewBox: it is what the mark is
// drawn in, and it is what keeps a rasterised symbol square.
const proportions = (svg: SVGSVGElement) => {
  const viewBox = svg.getAttribute('viewBox')
  if (viewBox) {
    const [, , width, height] = viewBox.split(/[\s,]+/).map(Number)
    if (width > 0 && height > 0) return { width, height }
  }
  const width = Number(svg.getAttribute('width')) || 200
  const height = Number(svg.getAttribute('height')) || 200
  return { width, height }
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
  const { width, height } = proportions(svg)
  const scale = PNG_LONGEST_EDGE / Math.max(width, height)
  const pixelWidth = Math.round(width * scale)
  const pixelHeight = Math.round(height * scale)

  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', svgNS)
  // The viewBox is left alone and only the frame grows, so the artwork is
  // rendered at size rather than scaled up from a small bitmap.
  clone.setAttribute('width', String(pixelWidth))
  clone.setAttribute('height', String(pixelHeight))

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
  canvas.width = pixelWidth
  canvas.height = pixelHeight
  const context = canvas.getContext('2d')
  if (!context) return null
  // Nothing is painted underneath: the ground stays transparent unless the
  // artwork itself carries one.
  context.drawImage(image, 0, 0, pixelWidth, pixelHeight)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// `name` is the filename without its extension.
export async function downloadMark(svg: SVGSVGElement, name: string, format: ExportFormat) {
  if (format === 'png') {
    const png = await rasterise(svg)
    if (png) save(png, `${name}.png`)
    return
  }
  const markup = new XMLSerializer().serializeToString(svg)
  save(new Blob([markup], { type: 'image/svg+xml' }), `${name}.svg`)
}
