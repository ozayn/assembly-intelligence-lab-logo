import { buildConcept25Animated } from './Concept25Axis'
import { buildConcept33Animated } from './Concept33FacetedA'
import { buildConcept34Animated } from './Concept34HexagonalA'
import { buildConcept36Animated } from './Concept35HybridA'
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
// here simply has no animated download offered on its card, which is the right
// answer for one that has no animation to write rather than a reason to invent
// one. Adding a concept is adding a line: the card, the filenames, the ground
// and the clipboard all follow from the builder being here.
export const ANIMATED_MARKS: Partial<Record<number, AnimatedMarkBuilder>> = {
  25: buildConcept25Animated,
  33: buildConcept33Animated,
  34: buildConcept34Animated,
  // The exploration's 36 is the second of the hybrid variations.
  36: buildConcept36Animated,
  41: buildConcept41Animated,
}
