// The seating language several of the marks are built on: a set of pieces,
// each arriving from a short offset along the axis it finally occupies, fading
// up as it travels, one after another. On the page Framer animates it; here the
// same thing is written out as a file that plays on its own, so a concept whose
// animation is stated this way needs only to hand over its pieces.

// What a token resolves to on the ground being exported for, applied to a fill
// that may name one. A literal colour passes through untouched.
export function painter(colour: (token: string) => string) {
  return (fill: string) =>
    fill.replace(/var\((--logo-[a-z]+)\)/, (whole, token: string) => colour(token) || whole)
}

export type SeatedPiece = {
  points: string
  fill: string
  /** Offset the piece enters from, along the axis it finally occupies. */
  from: { x: number; y: number }
  seat: number
}

export type Seating = {
  /** The file's own id, which every selector in it is held inside. */
  scope: string
  pieces: SeatedPiece[]
  duration: number
  ease: readonly number[]
}

// Selectors are held inside the mark's own id so that pasting the file into a
// page cannot reach anything else on it. `backwards` rather than `both`: the
// offset is wanted before a piece's turn comes and gone once it has landed,
// leaving the polygon with no transform of its own at rest — so the frame the
// animation settles on is the static drawing itself rather than a copy of it
// held in place.
export function buildSeatedMark(
  seating: Seating,
  colour: (token: string) => string,
  size: number
): string {
  const { scope, pieces, duration, ease } = seating
  const paint = painter(colour)

  const seats = pieces
    .map(
      (piece, index) =>
        `@keyframes ${scope}-seat-${index}{from{` +
        `transform:translate(${piece.from.x}px,${piece.from.y}px);opacity:0}}`
    )
    .join('')

  const planes = pieces
    .map(
      (piece, index) =>
        `<polygon class="plane" points="${piece.points}" fill="${paint(piece.fill)}"` +
        ` style="animation-name:${scope}-seat-${index};animation-delay:${piece.seat}s"/>`
    )
    .join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" id="${scope}">` +
    `<style>` +
    `#${scope} .plane{animation-duration:${duration}s;` +
    `animation-timing-function:cubic-bezier(${ease.join(',')});animation-fill-mode:backwards}` +
    seats +
    `</style>` +
    planes +
    `</svg>`
  )
}
