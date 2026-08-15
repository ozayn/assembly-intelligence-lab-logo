import { buildConcept33Animated } from './Concept33FacetedA'
import { buildConcept41Animated } from './Concept41HoneycombFacet'

// A concept's animation written as a file that plays on its own: given a way to
// resolve the logo tokens against the ground being exported for, and the side
// the file should present itself at, it returns self-contained SVG markup with
// the colours already in it. The side is the document's width and height only —
// the viewBox and the geometry inside it are the mark's own, whatever the file
// is asked to be drawn at.
export type AnimatedMarkBuilder = (
  colour: (token: string) => string,
  size: number
) => string

// Only the concepts whose animation has been translated. A concept absent from
// here simply has no animated download offered on its card.
export const ANIMATED_MARKS: Partial<Record<number, AnimatedMarkBuilder>> = {
  33: buildConcept33Animated,
  41: buildConcept41Animated,
}
