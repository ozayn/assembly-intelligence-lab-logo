// Unified continuous concept numbering (1-18) for reviewer facing
export const ALL_LOGO_CONCEPTS = [
  // Concepts 1-6
  {
    id: 1,
    name: 'Hexagon Assembly',
    description: 'Six particles converge from the perimeter to form a stable hexagonal structure with unified center.',
    active: true,
  },
  {
    id: 2,
    name: 'Dual Crescent',
    description: 'Two asymmetric particle groups approach and organize into complementary curved forms.',
    active: false,
  },
  {
    id: 3,
    name: 'Spiral Core',
    description: 'Particles follow a curved inward trajectory, organizing along a spiral path toward a central core.',
    active: true,
  },
  {
    id: 4,
    name: 'Concentric Rings',
    description: 'Modular particles assemble layer by layer, building a structure from center outward in distinct rings.',
    active: true,
  },
  {
    id: 5,
    name: 'Arc Convergence',
    description: 'Particles arrange in opposing arcs, converging toward a central anchor point.',
    active: false,
  },
  {
    id: 6,
    name: 'Twin Spirals',
    description: 'Two interlocking spiral patterns approach and interleave, creating a unified structure.',
    active: false,
  },
  // Concepts 7-12
  {
    id: 7,
    name: 'Clustered Approach',
    description: 'A tight cluster of particles attracts a joining element into the organized group.',
    active: false,
  },
  {
    id: 8,
    name: 'Radial Bloom',
    description: 'Particles orbit inward from all directions, forming a balanced radial structure around a core.',
    active: false,
  },
  {
    id: 9,
    name: 'Cascading Steps',
    description: 'Particles arrange in a staggered pattern, suggesting layered organizational progression.',
    active: false,
  },
  {
    id: 10,
    name: 'Nested Orbits',
    description: 'Concentric particle rings assemble around a central core in nested layers.',
    active: false,
  },
  {
    id: 11,
    name: 'Asymmetric Fold',
    description: 'Particles organize around a central axis, folding into an asymmetric but balanced form.',
    active: false,
  },
  {
    id: 12,
    name: 'Distributed Lattice',
    description: 'Seven particles assemble into a loosely organized lattice that suggests ongoing structure.',
    active: false,
  },
  // Concepts 13-18 (former Round 3)
  {
    id: 13,
    name: 'Emergence',
    description: 'Three organic curves reveal a unified mark through assembly. Individual pieces suggest nothing until unified.',
    active: false,
  },
  {
    id: 14,
    name: 'Phase Transition',
    description: 'Eight elements transition from disorder to a crystalline grid, suggesting ordered matter through motion.',
    active: false,
  },
  {
    id: 15,
    name: 'Complementarity',
    description: 'A central solid and three curved complements complete one another. Meaning emerges through interaction.',
    active: false,
  },
  {
    id: 16,
    name: 'Fold/Transformation',
    description: 'Vertical elements transform into nested arcs. Reorganization reveals the final structure.',
    active: true,
  },
  {
    id: 17,
    name: 'Negative-Space Assembly',
    description: 'Four segments assemble around a meaningful void. The empty space is the identity.',
    active: true,
  },
  {
    id: 18,
    name: 'Propagating Rule',
    description: 'A center node spawns branches through local connections. Structure grows from simple repeated rules.',
    active: true,
  },
  // Concepts 19-24 — new creative round, experimental status.
  // Not active, not archived: excluded from both until explicitly curated.
  {
    id: 19,
    name: 'Accretion',
    description: 'Discrete units settle against their neighbors through purely local contact, building an asymmetric mound with no single unit directing the outcome.',
    active: false,
    experimental: true,
  },
  {
    id: 20,
    name: 'Nested Groups',
    description: 'Individual units gather into local clusters of varying order, and those clusters arrange into a staggered, asymmetric higher-order structure.',
    active: false,
    experimental: true,
  },
  {
    id: 21,
    name: 'Cascade',
    description: 'Identical elements along an authored, bent trajectory each shift rotation and tone in sequence, each change triggering the next.',
    active: false,
    experimental: true,
  },
  {
    id: 22,
    name: 'Threaded Channel',
    description: 'Bold solid components separate to reveal a single continuous channel of negative space threading between them.',
    active: false,
    experimental: true,
  },
  {
    id: 23,
    name: 'Threshold',
    description: 'One connected form whose boundary shifts from faceted and angular to smooth and flowing along a single continuous edge.',
    active: false,
    experimental: true,
  },
  {
    id: 24,
    name: 'Contour',
    description: 'A single open contour differentiates into several asymmetric, unevenly spaced layers — one structure becoming organized many.',
    active: false,
    experimental: true,
  },
]

export const CONCEPTS_PER_PAGE = 4

export const ACTIVE_CONCEPTS = ALL_LOGO_CONCEPTS.filter(c => c.active)
export const ARCHIVED_CONCEPTS = ALL_LOGO_CONCEPTS.filter(c => !c.active && !c.experimental)
export const EXPERIMENTAL_CONCEPTS = ALL_LOGO_CONCEPTS.filter(c => c.experimental === true)

export function getPageNumber(conceptId: number): number {
  const activeConcepts = ACTIVE_CONCEPTS
  const conceptIndex = activeConcepts.findIndex(c => c.id === conceptId)
  if (conceptIndex === -1) return 1
  return Math.ceil((conceptIndex + 1) / CONCEPTS_PER_PAGE)
}

export function getConceptsForPage(pageNumber: number): typeof ALL_LOGO_CONCEPTS {
  const activeConcepts = ACTIVE_CONCEPTS
  const startIdx = (pageNumber - 1) * CONCEPTS_PER_PAGE
  const endIdx = startIdx + CONCEPTS_PER_PAGE
  return activeConcepts.slice(startIdx, endIdx)
}

export const TOTAL_PAGES = Math.ceil(ACTIVE_CONCEPTS.length / CONCEPTS_PER_PAGE)
