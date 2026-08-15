// INTERNAL DEV-ONLY DATA for the /optical-test comparison page.
// These are exploratory geometry variants, NOT production logo definitions.
// Nothing here is imported by production components or the SVG exporter.

export type Role = 'primary' | 'accent'

export type Shape =
  | { kind: 'circle'; cx: number; cy: number; r: number; role: Role; opacity?: number; ring?: boolean; strokeWidth?: number }
  | { kind: 'path'; d: string; strokeWidth: number; role: Role; opacity?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; strokeWidth: number; role: Role; opacity?: number }

export interface Variant {
  label: string
  viewBox: string
  shapes: Shape[]
  changes: string[]
}

export const LIGHT = { primary: '#001e3c', accent: '#0d8b8f' }
export const DARK = { primary: '#e6edf3', accent: '#58a6ff' }

// Scales circle shapes outward from (cx0,cy0) and scales their radius —
// used to widen gaps between packed dots without altering their arrangement.
function nudge(shapes: Shape[], cx0: number, cy0: number, spreadScale: number, radiusScale: number): Shape[] {
  return shapes.map((s) => {
    if (s.kind !== 'circle') return s
    const dx = (s.cx - cx0) * spreadScale
    const dy = (s.cy - cy0) * spreadScale
    return { ...s, cx: cx0 + dx, cy: cy0 + dy, r: s.r * radiusScale }
  })
}

export interface ConceptDef {
  id: number
  name: string
  master: Variant
  proposals: Record<'64' | '32' | '16', Variant>
  // shape indices (into master.shapes / each proposal's shapes, same order) that
  // represent the fragile "key detail" worth isolating for a peak-visibility readout
  keyDetailLabel?: string
  keyDetailIndices?: number[]
  // for concept 18 only: an explicitly optional, non-adopted simplified alternative at 16px
  optionalMicroAlt16?: Variant
  recommendation: string
}

// ---------------------------------------------------------------------------
// CONCEPT 01 — Hexagon Assembly
// ---------------------------------------------------------------------------
const c01Master: Shape[] = [
  { kind: 'circle', cx: 100, cy: 80, r: 8, role: 'primary' },
  { kind: 'circle', cx: 117, cy: 90, r: 8, role: 'primary' },
  { kind: 'circle', cx: 117, cy: 110, r: 8, role: 'primary' },
  { kind: 'circle', cx: 100, cy: 120, r: 8, role: 'primary' },
  { kind: 'circle', cx: 83, cy: 110, r: 8, role: 'primary' },
  { kind: 'circle', cx: 83, cy: 90, r: 8, role: 'primary' },
  { kind: 'circle', cx: 100, cy: 100, r: 4, role: 'accent', opacity: 0.8 },
]

function c01Proposal(spreadScale: number, radiusScale: number, accentR: number, accentOp: number, viewBox: string, changes: string[]): Variant {
  const dots = nudge(c01Master.slice(0, 6), 100, 100, spreadScale, radiusScale)
  const accent: Shape = { kind: 'circle', cx: 100, cy: 100, r: accentR, role: 'accent', opacity: accentOp }
  return { label: '', viewBox, shapes: [...dots, accent], changes }
}

// ---------------------------------------------------------------------------
// CONCEPT 03 — Spiral Core
// ---------------------------------------------------------------------------
const c03Master: Shape[] = [
  { kind: 'circle', cx: 135, cy: 85, r: 8, role: 'primary' },
  { kind: 'circle', cx: 95, cy: 62, r: 8, role: 'primary' },
  { kind: 'circle', cx: 65, cy: 105, r: 8, role: 'primary' },
  { kind: 'circle', cx: 118, cy: 108, r: 7, role: 'primary' },
  { kind: 'circle', cx: 92, cy: 120, r: 7, role: 'primary' },
  { kind: 'circle', cx: 88, cy: 85, r: 7, role: 'primary' },
  { kind: 'circle', cx: 100, cy: 100, r: 5, role: 'accent', opacity: 0.85 },
  { kind: 'path', d: 'M 135 85 Q 128 105 118 108 T 100 100', strokeWidth: 1.5, role: 'accent', opacity: 0.3 },
]

function c03Proposal(coreR: number, coreOp: number, midSpread: number, dotRScale: number, viewBox: string, changes: string[]): Variant {
  const outer = nudge(c03Master.slice(0, 3), 100, 100, 1, dotRScale)
  const mid = nudge(c03Master.slice(3, 6), 100, 100, midSpread, dotRScale)
  const core: Shape = { kind: 'circle', cx: 100, cy: 100, r: coreR, role: 'accent', opacity: coreOp }
  const path = c03Master[7]
  return { label: '', viewBox, shapes: [...outer, ...mid, core, path], changes }
}

// ---------------------------------------------------------------------------
// CONCEPT 04 — Concentric Rings
// ---------------------------------------------------------------------------
const c04Master: Shape[] = [
  { kind: 'circle', cx: 100, cy: 88, r: 6, role: 'primary' },
  { kind: 'circle', cx: 110, cy: 106, r: 6, role: 'primary' },
  { kind: 'circle', cx: 90, cy: 106, r: 6, role: 'primary' },
  { kind: 'circle', cx: 118, cy: 90, r: 7, role: 'primary' },
  { kind: 'circle', cx: 115, cy: 118, r: 7, role: 'primary' },
  { kind: 'circle', cx: 85, cy: 118, r: 7, role: 'primary' },
  { kind: 'circle', cx: 82, cy: 90, r: 7, role: 'primary' },
  { kind: 'circle', cx: 128, cy: 102, r: 7, role: 'accent', opacity: 0.8 },
  { kind: 'circle', cx: 72, cy: 102, r: 7, role: 'accent', opacity: 0.8 },
]

function c04Proposal(spreadScale: number, viewBox: string, changes: string[]): Variant {
  const shapes = nudge(c04Master, 100, 101, spreadScale, 1)
  return { label: '', viewBox, shapes, changes }
}

// ---------------------------------------------------------------------------
// CONCEPT 16 — Fold/Transformation (arcs kept identical — crop + stroke only)
// ---------------------------------------------------------------------------
const c16Paths = [
  'M 85 80 Q 100 90 115 80',
  'M 80 100 Q 100 112 120 100',
  'M 75 120 Q 100 134 125 120',
]

function c16Variant(sw: [number, number, number], accentOp: number, viewBox: string, changes: string[]): Variant {
  const shapes: Shape[] = [
    { kind: 'path', d: c16Paths[0], strokeWidth: sw[0], role: 'primary' },
    { kind: 'path', d: c16Paths[1], strokeWidth: sw[1], role: 'primary' },
    { kind: 'path', d: c16Paths[2], strokeWidth: sw[2], role: 'accent', opacity: accentOp },
  ]
  return { label: '', viewBox, shapes, changes }
}

// ---------------------------------------------------------------------------
// CONCEPT 17 — Negative-Space Assembly (segments + ring kept identical shape;
// only stroke/opacity/radius of the ring and canvas crop are ever varied)
// ---------------------------------------------------------------------------
const c17Segs = [
  'M 90 75 Q 100 85 110 75',
  'M 125 90 Q 115 100 125 110',
  'M 110 125 Q 100 115 90 125',
  'M 75 110 Q 85 100 75 90',
]

function c17Variant(segSW: number, ringR: number, ringSW: number, ringOp: number, viewBox: string, changes: string[]): Variant {
  const shapes: Shape[] = [
    ...c17Segs.map((d): Shape => ({ kind: 'path', d, strokeWidth: segSW, role: 'primary' })),
    { kind: 'circle', cx: 100, cy: 100, r: ringR, role: 'accent', opacity: ringOp, ring: true, strokeWidth: ringSW },
  ]
  return { label: '', viewBox, shapes, changes }
}

// ---------------------------------------------------------------------------
// CONCEPT 18 — Propagating Rule (node positions & connections NEVER move —
// only stroke width, opacity, radius, and canvas crop are ever varied)
// ---------------------------------------------------------------------------
const c18Nodes = [
  { x: 100, y: 100, r: 6 },
  { x: 115, y: 95, r: 4 },
  { x: 125, y: 85, r: 3 },
  { x: 85, y: 95, r: 4 },
  { x: 70, y: 95, r: 3 },
  { x: 105, y: 120, r: 4 },
  { x: 105, y: 138, r: 3 },
]
const c18Connections = [
  { x1: 100, y1: 100, x2: 115, y2: 95 },
  { x1: 115, y1: 95, x2: 125, y2: 85 },
  { x1: 100, y1: 100, x2: 85, y2: 95 },
  { x1: 85, y1: 95, x2: 70, y2: 95 },
  { x1: 100, y1: 100, x2: 105, y2: 120 },
  { x1: 105, y1: 120, x2: 105, y2: 138 },
]

function c18Variant(lineSW: number, lineOp: number, nodeRBoost: number, viewBox: string, changes: string[]): Variant {
  const shapes: Shape[] = [
    ...c18Connections.map((c): Shape => ({ kind: 'line', ...c, strokeWidth: lineSW, role: 'primary', opacity: lineOp })),
    ...c18Nodes.map((n, i): Shape => ({
      kind: 'circle',
      cx: n.x,
      cy: n.y,
      r: n.r + nodeRBoost,
      role: i === 0 ? 'accent' : 'primary',
      opacity: i === 0 ? Math.min(1, 0.9 + lineOp - 0.5) : Math.min(1, 0.7 + lineOp - 0.5),
    })),
  ]
  return { label: '', viewBox, shapes, changes }
}

// Optional, explicitly non-adopted simplified alternative — shown ONLY beside
// the 16px original for comparison, per the "if simplification seems necessary,
// show it only as an optional alternative" instruction. Drops the three
// smallest terminal nodes and thickens the three primary connectors.
function c18OptionalMicroAlt(): Variant {
  const primaryConnections = c18Connections.filter((_, i) => [0, 2, 4].includes(i))
  const primaryNodes = c18Nodes.filter((_, i) => [0, 1, 3, 5].includes(i))
  const shapes: Shape[] = [
    ...primaryConnections.map((c): Shape => ({ kind: 'line', ...c, strokeWidth: 5, role: 'primary', opacity: 0.9 })),
    ...primaryNodes.map((n, i): Shape => ({
      kind: 'circle',
      cx: n.x,
      cy: n.y,
      r: n.r + 2,
      role: i === 0 ? 'accent' : 'primary',
      opacity: i === 0 ? 1 : 0.9,
    })),
  ]
  return {
    label: 'OPTIONAL ALTERNATE (not proposed)',
    viewBox: '65 75 70 70',
    shapes,
    changes: [
      'DROPS the 3 smallest terminal nodes (r3)',
      'keeps only the 3 primary connectors, thickened 1.5→5',
      'primary nodes enlarged +2',
      'shown only for comparison — not a proposed replacement',
    ],
  }
}

export const CONCEPTS: ConceptDef[] = [
  {
    id: 1,
    name: 'Hexagon Assembly',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: c01Master, changes: [] },
    proposals: {
      '64': c01Proposal(1, 1, 5, 0.9, '60 60 80 80', [
        'canvas padding reduced (viewBox 200→80)',
        'center accent enlarged r4→5, opacity 0.8→0.9',
        'dot positions/radius unchanged',
      ]),
      '32': c01Proposal(1.15, 0.875, 5, 0.95, '65 65 70 70', [
        'dot radius 8→7 (–12.5%)',
        'hex spread +15% (widens inter-dot gaps)',
        'center accent r4→5, opacity 0.8→0.95',
        'canvas padding reduced (viewBox 200→70)',
      ]),
      '16': c01Proposal(1.25, 0.8125, 5.5, 1, '67 67 66 66', [
        'dot radius 8→6.5 (–19%)',
        'hex spread +25% (largest gap correction)',
        'center accent r4→5.5, opacity 0.8→1.0',
        'canvas padding reduced (viewBox 200→66)',
      ]),
    },
    recommendation: '',
  },
  {
    id: 3,
    name: 'Spiral Core',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: c03Master, changes: [] },
    proposals: {
      '64': { label: '', viewBox: '0 0 200 200', shapes: c03Master, changes: ['No changes — master already reads cleanly at 64px per audit'] },
      '32': c03Proposal(6, 1.0, 1.1, 1, '45 40 110 115', [
        'core accent enlarged r5→6, opacity 0.85→1.0',
        'middle-ring dots nudged 10% further from core (avoids core overlap)',
        'canvas padding reduced (viewBox 200→110)',
      ]),
      '16': c03Proposal(7, 1.0, 1.18, 0.93, '52 47 96 100', [
        'core accent enlarged r5→7, opacity 0.85→1.0',
        'middle-ring dots nudged 18% further from core',
        'outer/middle dot radius trimmed ~7% for cleaner separation',
        'canvas padding reduced (viewBox 200→96)',
      ]),
    },
    recommendation: '',
  },
  {
    id: 4,
    name: 'Concentric Rings',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: c04Master, changes: [] },
    proposals: {
      '64': c04Proposal(1.12, '55 50 90 100', [
        'all 9 dots spread +12% from center (fixes tangent/overlapping pairs)',
        'dot radii unchanged',
        'canvas padding reduced (viewBox 200→90)',
      ]),
      '32': c04Proposal(1.2, '50 44 100 112', [
        'all 9 dots spread +20% from center',
        'dot radii unchanged',
        'canvas padding reduced (viewBox 200→100)',
      ]),
      '16': c04Proposal(1.3, '45 38 110 124', [
        'all 9 dots spread +30% from center (max correction tested)',
        'dot radii unchanged — arrangement preserved',
        'canvas padding reduced (viewBox 200→110)',
      ]),
    },
    recommendation: '',
  },
  {
    id: 16,
    name: 'Fold/Transformation',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: [
      { kind: 'path', d: c16Paths[0], strokeWidth: 9, role: 'primary' },
      { kind: 'path', d: c16Paths[1], strokeWidth: 7, role: 'primary' },
      { kind: 'path', d: c16Paths[2], strokeWidth: 5, role: 'accent', opacity: 0.7 },
    ], changes: [] },
    proposals: {
      '64': c16Variant([9, 7, 5], 0.85, '60 60 80 85', [
        'arc geometry (d) unchanged',
        'accent arc opacity 0.7→0.85',
        'canvas padding reduced (viewBox 200→80/85)',
      ]),
      '32': c16Variant([10, 8, 6.5], 0.9, '60 60 80 85', [
        'arc geometry (d) unchanged',
        'stroke widths 9/7/5 → 10/8/6.5',
        'accent arc opacity 0.7→0.9',
        'canvas padding reduced (viewBox 200→80/85)',
      ]),
      '16': c16Variant([11, 9, 7], 0.95, '65 62 70 75', [
        'arc geometry (d) unchanged',
        'stroke widths 9/7/5 → 11/9/7',
        'accent arc opacity 0.7→0.95',
        'canvas padding reduced further (viewBox 200→70/75)',
      ]),
    },
    recommendation: '',
  },
  {
    id: 17,
    name: 'Negative-Space Assembly',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: [
      ...c17Segs.map((d): Shape => ({ kind: 'path', d, strokeWidth: 10, role: 'primary' })),
      { kind: 'circle', cx: 100, cy: 100, r: 8, role: 'accent', opacity: 0.3, ring: true, strokeWidth: 1 },
    ], changes: [] },
    proposals: {
      '64': c17Variant(10, 8, 1.2, 0.4, '55 55 90 90', [
        'segment geometry unchanged, ring KEPT and unchanged in position',
        'ring stroke 1→1.2, opacity 0.3→0.4',
        'canvas padding reduced (viewBox 200→90)',
      ]),
      '32': c17Variant(10, 9, 1.6, 0.55, '55 55 90 90', [
        'segment geometry unchanged, ring KEPT',
        'ring stroke 1→1.6, opacity 0.3→0.55, radius 8→9',
        'canvas padding reduced (viewBox 200→90)',
      ]),
      '16': c17Variant(10, 10, 2, 0.7, '60 60 80 80', [
        'segment geometry unchanged, ring KEPT — not removed',
        'ring stroke 1→2, opacity 0.3→0.7, radius 8→10',
        'canvas padding reduced further (viewBox 200→80)',
      ]),
    },
    keyDetailLabel: 'Central ring detail',
    keyDetailIndices: [4],
    recommendation: '',
  },
  {
    id: 18,
    name: 'Propagating Rule',
    master: { label: 'MASTER', viewBox: '0 0 200 200', shapes: [
      ...c18Connections.map((c): Shape => ({ kind: 'line', ...c, strokeWidth: 1.5, role: 'primary', opacity: 0.5 })),
      ...c18Nodes.map((n, i): Shape => ({ kind: 'circle', cx: n.x, cy: n.y, r: n.r, role: i === 0 ? 'accent' : 'primary', opacity: i === 0 ? 0.9 : 0.7 })),
    ], changes: [] },
    proposals: {
      '64': c18Variant(2, 0.65, 0, '60 70 80 80', [
        'node positions & connections UNCHANGED',
        'connector stroke 1.5→2, opacity 0.5→0.65',
        'canvas padding reduced (viewBox 200→80)',
      ]),
      '32': c18Variant(2.5, 0.75, 0.5, '60 70 80 80', [
        'node positions & connections UNCHANGED',
        'connector stroke 1.5→2.5, opacity 0.5→0.75',
        'node radii +0.5 (uniform, arrangement preserved)',
        'canvas padding reduced (viewBox 200→80)',
      ]),
      '16': c18Variant(3.5, 0.85, 1, '62 72 66 70', [
        'node positions & connections UNCHANGED',
        'connector stroke 1.5→3.5, opacity 0.5→0.85',
        'node radii +1 (uniform, arrangement preserved)',
        'canvas padding reduced further (viewBox 200→66/70)',
      ]),
    },
    keyDetailLabel: 'Connector lines',
    keyDetailIndices: [0, 1, 2, 3, 4, 5],
    optionalMicroAlt16: c18OptionalMicroAlt(),
    recommendation: '',
  },
]
