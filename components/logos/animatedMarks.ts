import { buildConcept41Animated } from './Concept41HoneycombFacet'

// A concept's animation written as a file that plays on its own: given a way to
// resolve the logo tokens against the ground being exported for, it returns
// self-contained SVG markup with the colours already in it.
export type AnimatedMarkBuilder = (colour: (token: string) => string) => string

// Only the concepts whose animation has been translated. A concept absent from
// here simply has no animated download offered on its card.
export const ANIMATED_MARKS: Partial<Record<number, AnimatedMarkBuilder>> = {
  41: buildConcept41Animated,
}
