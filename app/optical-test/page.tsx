'use client'

import { useEffect, useState } from 'react'
import { CONCEPTS, LIGHT, DARK, type Variant, type Shape, type Role } from './proposals'
import './optical-test.css'

const MAG_SIZE = 160

function colorFor(role: Role, bg: 'light' | 'dark'): string {
  const c = bg === 'light' ? LIGHT : DARK
  return role === 'accent' ? c.accent : c.primary
}

function MarkSVG({ variant, size, bg }: { variant: Variant; size: number; bg: 'light' | 'dark' }) {
  return (
    <svg viewBox={variant.viewBox} width={size} height={size} style={{ display: 'block' }}>
      {variant.shapes.map((s, i) => {
        const color = colorFor(s.role, bg)
        if (s.kind === 'circle') {
          if (s.ring) {
            return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke={color} strokeWidth={s.strokeWidth ?? 1} opacity={s.opacity ?? 1} />
          }
          return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={color} opacity={s.opacity ?? 1} />
        }
        if (s.kind === 'path') {
          return <path key={i} d={s.d} stroke={color} strokeWidth={s.strokeWidth} fill="none" strokeLinecap="round" opacity={s.opacity ?? 1} />
        }
        return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth={s.strokeWidth} opacity={s.opacity ?? 1} />
      })}
    </svg>
  )
}

// --- Rasterization helpers for live pixel metrics (mirrors the audit methodology) ---
function serialize(variant: Variant, size: number): string {
  const color = (role: Role) => (role === 'accent' ? '#0d8b8f' : '#001e3c')
  const parts = variant.shapes
    .map((s) => {
      const c = color(s.role)
      if (s.kind === 'circle') {
        if (s.ring) return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="none" stroke="${c}" stroke-width="${s.strokeWidth ?? 1}" opacity="${s.opacity ?? 1}"/>`
        return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${c}" opacity="${s.opacity ?? 1}"/>`
      }
      if (s.kind === 'path') return `<path d="${s.d}" stroke="${c}" stroke-width="${s.strokeWidth}" fill="none" stroke-linecap="round" opacity="${s.opacity ?? 1}"/>`
      return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${c}" stroke-width="${s.strokeWidth}" opacity="${s.opacity ?? 1}"/>`
    })
    .join('')
  return `<svg viewBox="${variant.viewBox}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${parts}</svg>`
}

function rasterize(svgMarkup: string, size: number): Promise<Uint8ClampedArray | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(null); return }
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data
      URL.revokeObjectURL(url)
      resolve(data)
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

function bboxOccupancyPct(data: Uint8ClampedArray, size: number): number {
  let minX = size, minY = size, maxX = -1, maxY = -1
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const a = data[(y * size + x) * 4 + 3]
      if (a > 10) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return 0
  const w = maxX - minX + 1, h = maxY - minY + 1
  return Math.round(((w * h) / (size * size)) * 100)
}

function peakAlphaPct(data: Uint8ClampedArray): number {
  let max = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > max) max = data[i]
  return Math.round((max / 255) * 100)
}

function isolate(variant: Variant, indices: number[]): Variant {
  return { ...variant, shapes: indices.map((i) => variant.shapes[i]).filter(Boolean) as Shape[] }
}

interface Metrics {
  masterOccupancy: number
  proposalOccupancy: number
  masterDetailPeak?: number
  proposalDetailPeak?: number
}

export default function OpticalTestPage() {
  const [bg, setBg] = useState<'light' | 'dark'>('light')
  const [metrics, setMetrics] = useState<Record<string, Metrics>>({})

  useEffect(() => {
    let cancelled = false
    async function run() {
      const next: Record<string, Metrics> = {}
      for (const concept of CONCEPTS) {
        for (const size of [64, 32, 16] as const) {
          const proposal = concept.proposals[String(size) as '64' | '32' | '16']
          const masterData = await rasterize(serialize(concept.master, size), size)
          const proposalData = await rasterize(serialize(proposal, size), size)
          const m: Metrics = {
            masterOccupancy: masterData ? bboxOccupancyPct(masterData, size) : 0,
            proposalOccupancy: proposalData ? bboxOccupancyPct(proposalData, size) : 0,
          }
          if (concept.keyDetailIndices) {
            const masterDetail = isolate(concept.master, concept.keyDetailIndices)
            const proposalDetail = isolate(proposal, concept.keyDetailIndices)
            const masterDetailData = await rasterize(serialize(masterDetail, size), size)
            const proposalDetailData = await rasterize(serialize(proposalDetail, size), size)
            m.masterDetailPeak = masterDetailData ? peakAlphaPct(masterDetailData) : 0
            m.proposalDetailPeak = proposalDetailData ? peakAlphaPct(proposalDetailData) : 0
          }
          next[`${concept.id}-${size}`] = m
        }
      }
      if (!cancelled) setMetrics(next)
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="ot-page">
      <div className="ot-header">
        <h1>Optical Size Calibration — Internal Test</h1>
        <p>
          Visual comparison only. Nothing here touches production logo components, the SVG exporter, or microMark
          hooks. All metrics below are computed by rasterizing the actual geometry shown at its real pixel size —
          same technique as the optical audit.
        </p>
        <div className="ot-toolbar">
          <label>Target Website Background</label>
          <div className="ot-bg-buttons">
            <button className={bg === 'light' ? 'active' : ''} onClick={() => setBg('light')}>Light</button>
            <button className={bg === 'dark' ? 'active' : ''} onClick={() => setBg('dark')}>Dark</button>
          </div>
        </div>
      </div>

      {CONCEPTS.map((concept) => (
        <ConceptSection key={concept.id} concept={concept} bg={bg} metrics={metrics} />
      ))}
    </div>
  )
}

function ConceptSection({ concept, bg, metrics }: { concept: (typeof CONCEPTS)[number]; bg: 'light' | 'dark'; metrics: Record<string, Metrics> }) {
  return (
    <section className="ot-concept">
      <div className="ot-concept-title">
        <span className="num">{concept.id.toString().padStart(2, '0')}</span>
        <h2>{concept.name}</h2>
      </div>

      <div className="ot-master-row">
        <div className={`ot-swatch-box bg-${bg}`} style={{ width: MAG_SIZE, height: MAG_SIZE }}>
          <MarkSVG variant={concept.master} size={MAG_SIZE} bg={bg} />
        </div>
        <div>
          <div className="ot-swatch-label">MASTER (reference, unmodified — magnified {MAG_SIZE}px for inspection)</div>
          <div className="ot-magnify-note">This is the exact production geometry. It is never altered on this page.</div>
        </div>
      </div>

      <div className="ot-tiers">
        {(['64', '32', '16'] as const).map((size) => (
          <SizeTier key={size} concept={concept} size={Number(size) as 64 | 32 | 16} bg={bg} metrics={metrics[`${concept.id}-${size}`]} />
        ))}
      </div>

      <div className="ot-recommendation" dangerouslySetInnerHTML={{ __html: RECOMMENDATIONS[concept.id] }} />
    </section>
  )
}

function SizeTier({
  concept,
  size,
  bg,
  metrics,
}: {
  concept: (typeof CONCEPTS)[number]
  size: 64 | 32 | 16
  bg: 'light' | 'dark'
  metrics?: Metrics
}) {
  const proposal = concept.proposals[String(size) as '64' | '32' | '16']
  const showOptionalAlt = concept.id === 18 && size === 16 && concept.optionalMicroAlt16

  return (
    <div className="ot-tier">
      <div className="ot-tier-heading">{size}PX</div>

      <div className="ot-compare-row">
        <div className="ot-swatch">
          <div className={`ot-swatch-box bg-${bg}`} style={{ width: size, height: size }}>
            <MarkSVG variant={concept.master} size={size} bg={bg} />
          </div>
          <div className="ot-swatch-caption">Original master
            <br />@ {size}px actual size</div>
        </div>
        <div className="ot-swatch">
          <div className={`ot-swatch-box bg-${bg}`} style={{ width: size, height: size }}>
            <MarkSVG variant={proposal} size={size} bg={bg} />
          </div>
          <div className="ot-swatch-caption">Proposal
            <br />@ {size}px actual size</div>
        </div>
      </div>

      <div className="ot-compare-row">
        <div className="ot-swatch">
          <div className={`ot-swatch-box bg-${bg}`} style={{ width: MAG_SIZE * 0.55, height: MAG_SIZE * 0.55 }}>
            <MarkSVG variant={concept.master} size={MAG_SIZE * 0.55} bg={bg} />
          </div>
          <div className="ot-magnify-note">magnified {(MAG_SIZE * 0.55 / size).toFixed(1)}×</div>
        </div>
        <div className="ot-swatch">
          <div className={`ot-swatch-box bg-${bg}`} style={{ width: MAG_SIZE * 0.55, height: MAG_SIZE * 0.55 }}>
            <MarkSVG variant={proposal} size={MAG_SIZE * 0.55} bg={bg} />
          </div>
          <div className="ot-magnify-note">magnified {(MAG_SIZE * 0.55 / size).toFixed(1)}×</div>
        </div>
      </div>

      {metrics && (
        <div className="ot-metric">
          canvas fill: master {metrics.masterOccupancy}% → proposal {metrics.proposalOccupancy}%
          {metrics.masterDetailPeak !== undefined && (
            <>
              <br />
              {concept.keyDetailLabel} peak opacity: master {metrics.masterDetailPeak}% → proposal {metrics.proposalDetailPeak}%
            </>
          )}
        </div>
      )}
      {!metrics && <div className="ot-loading">computing pixel metrics…</div>}

      <ul className="ot-changes">
        {proposal.changes.map((c, i) => <li key={i}>{c}</li>)}
      </ul>

      {showOptionalAlt && concept.optionalMicroAlt16 && (
        <div className="ot-optional">
          <div className="ot-optional-label">{concept.optionalMicroAlt16.label}</div>
          <div className="ot-compare-row">
            <div className="ot-swatch">
              <div className={`ot-swatch-box bg-${bg}`} style={{ width: 16, height: 16 }}>
                <MarkSVG variant={concept.optionalMicroAlt16} size={16} bg={bg} />
              </div>
              <div className="ot-swatch-caption">@ 16px actual size</div>
            </div>
            <div className="ot-swatch">
              <div className={`ot-swatch-box bg-${bg}`} style={{ width: 88, height: 88 }}>
                <MarkSVG variant={concept.optionalMicroAlt16} size={88} bg={bg} />
              </div>
              <div className="ot-magnify-note">magnified 5.5×</div>
            </div>
          </div>
          <ul className="ot-changes">
            {concept.optionalMicroAlt16.changes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

const RECOMMENDATIONS: Record<number, string> = {
  1: `<strong>CONSIDER 32PX OPTICAL VARIANT.</strong> The hexagon's dot-to-dot gaps already touch on several edges at 64px master. Uniformly widening the spread + trimming radius slightly restores clean separation at every size without changing the 6-dot arrangement or center accent's role.`,
  3: `<strong>KEEP MASTER AT 64PX — CONSIDER 32PX OPTICAL VARIANT BELOW THAT.</strong> This concept already performs best of the six at 64px; no change proposed there. Below 64px, nudging the middle ring away from the core and reducing padding meaningfully restores the core accent's contrast.`,
  4: `<strong>CONSIDER 32PX OPTICAL VARIANT; 16PX REMAINS BORDERLINE.</strong> Several of the 9 dots are mathematically tangent even in the master art. Spreading them uniformly (same arrangement, same radii) restores separation at 64/32px, but at 16px the sheer density of 9 elements in a small area keeps recognizability marginal even after correction — this concept may simply have a ceiling for micro-scale use.`,
  16: `<strong>CONSIDER 32PX OPTICAL VARIANT (arcs unchanged).</strong> Arc geometry is never touched in any proposal — only stroke weight, accent opacity, and canvas crop. This alone is enough to bring the accent arc from near-invisible to legible at every size, and to stabilize the primary arc's rendering at 16px.`,
  17: `<strong>KEEP MASTER FOR THE PRIMARY MARK — RING DETAIL IS A SEPARATE QUESTION.</strong> The 4-segment silhouette and negative-space void hold up well through 64/32px without changes. The central ring, however, peaks at only ~27% opacity even at native 200px size — it was never strongly visible by design. The calibrated proposals keep the ring (never removed) and push its stroke/opacity/radius up at each size; check the live metrics above to judge whether the calibrated version crosses a legible threshold for you, or whether the ring is better treated as an intentionally subtle "hint" that isn't expected to read at small sizes.`,
  18: `<strong>CONSIDER 32PX OPTICAL VARIANT; 16PX LIKELY NEEDS THE OPTIONAL ALTERNATE.</strong> Node/connector positions are never altered in any proposal. Strengthening connector stroke + opacity and cropping padding meaningfully helps at 64/32px. At 16px, even maximum conservative strengthening keeps connectors close to the 1px legibility floor — the optional simplified alternate (fewer, thicker connectors) is shown for comparison only, not as a replacement for Concept 18.`,
}
