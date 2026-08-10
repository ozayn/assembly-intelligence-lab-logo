// Unified continuous concept numbering (1-18) for reviewer facing
export const ALL_LOGO_CONCEPTS = [
  // Concepts 1-6
  {
    id: 1,
    name: 'Hexagon Assembly',
    description: 'Six particles converge from the perimeter to form a stable hexagonal structure with unified center.',
  },
  {
    id: 2,
    name: 'Dual Crescent',
    description: 'Two asymmetric particle groups approach and organize into complementary curved forms.',
  },
  {
    id: 3,
    name: 'Spiral Core',
    description: 'Particles follow a curved inward trajectory, organizing along a spiral path toward a central core.',
  },
  {
    id: 4,
    name: 'Concentric Rings',
    description: 'Modular particles assemble layer by layer, building a structure from center outward in distinct rings.',
  },
  {
    id: 5,
    name: 'Arc Convergence',
    description: 'Particles arrange in opposing arcs, converging toward a central anchor point.',
  },
  {
    id: 6,
    name: 'Twin Spirals',
    description: 'Two interlocking spiral patterns approach and interleave, creating a unified structure.',
  },
  // Concepts 7-12
  {
    id: 7,
    name: 'Clustered Approach',
    description: 'A tight cluster of particles attracts a joining element into the organized group.',
  },
  {
    id: 8,
    name: 'Radial Bloom',
    description: 'Particles orbit inward from all directions, forming a balanced radial structure around a core.',
  },
  {
    id: 9,
    name: 'Cascading Steps',
    description: 'Particles arrange in a staggered pattern, suggesting layered organizational progression.',
  },
  {
    id: 10,
    name: 'Nested Orbits',
    description: 'Concentric particle rings assemble around a central core in nested layers.',
  },
  {
    id: 11,
    name: 'Asymmetric Fold',
    description: 'Particles organize around a central axis, folding into an asymmetric but balanced form.',
  },
  {
    id: 12,
    name: 'Distributed Lattice',
    description: 'Seven particles assemble into a loosely organized lattice that suggests ongoing structure.',
  },
  // Concepts 13-18 (former Round 3)
  {
    id: 13,
    name: 'Emergence',
    description: 'Three organic curves reveal a unified mark through assembly. Individual pieces suggest nothing until unified.',
  },
  {
    id: 14,
    name: 'Phase Transition',
    description: 'Eight elements transition from disorder to a crystalline grid, suggesting ordered matter through motion.',
  },
  {
    id: 15,
    name: 'Complementarity',
    description: 'A central solid and three curved complements complete one another. Meaning emerges through interaction.',
  },
  {
    id: 16,
    name: 'Fold/Transformation',
    description: 'Vertical elements transform into nested arcs. Reorganization reveals the final structure.',
  },
  {
    id: 17,
    name: 'Negative-Space Assembly',
    description: 'Four segments assemble around a meaningful void. The empty space is the identity.',
  },
  {
    id: 18,
    name: 'Propagating Rule',
    description: 'A center node spawns branches through local connections. Structure grows from simple repeated rules.',
  },
]

export const CONCEPTS_PER_PAGE = 6

export function getPageNumber(conceptId: number): number {
  return Math.ceil(conceptId / CONCEPTS_PER_PAGE)
}

export function getConceptsForPage(pageNumber: number): typeof ALL_LOGO_CONCEPTS {
  const startIdx = (pageNumber - 1) * CONCEPTS_PER_PAGE
  const endIdx = startIdx + CONCEPTS_PER_PAGE
  return ALL_LOGO_CONCEPTS.slice(startIdx, endIdx)
}

export const TOTAL_PAGES = Math.ceil(ALL_LOGO_CONCEPTS.length / CONCEPTS_PER_PAGE)
