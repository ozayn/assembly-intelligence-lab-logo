'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DesignWorkspaceNav } from '@/components/DesignWorkspaceNav'
import { useReviewer } from '@/components/ReviewerContext'
import { LogoCard } from '@/components/LogoCard'
import { useFeedbackSubmission } from '@/components/useFeedbackSubmission'
import { EXPERIMENT_CONCEPTS } from '@/components/experimentsData'
import {
  NEW_ROUND_CONCEPTS,
  Concept19Static, Concept19Animated,
  Concept20Static, Concept20Animated,
  Concept21Static, Concept21Animated,
  Concept22Static, Concept22Animated,
  Concept23Static, Concept23Animated,
  Concept24Static, Concept24Animated,
  Concept35AStatic, Concept35AAnimated,
  Concept35BStatic, Concept35BAnimated,
  Concept35CStatic, Concept35CAnimated,
} from '@/components/logos'
import '@/app/page.css'
import './experiments.css'

const NEW_ROUND_COMPONENTS: Record<number, { Static: React.ComponentType; Animated: React.ComponentType }> = {
  19: { Static: Concept19Static, Animated: Concept19Animated },
  20: { Static: Concept20Static, Animated: Concept20Animated },
  21: { Static: Concept21Static, Animated: Concept21Animated },
  22: { Static: Concept22Static, Animated: Concept22Animated },
  23: { Static: Concept23Static, Animated: Concept23Animated },
  24: { Static: Concept24Static, Animated: Concept24Animated },
}

// Three structural readings of the same idea, kept deliberately close to each
// other: the question on the table is where the folded plane should end and
// the modules should begin, not which of three logos to pick.
const HYBRID_VARIATIONS = [
  {
    key: '35A',
    name: 'A — Integrated Leg',
    description:
      "Concept 34 with one leg folded. Apex, right-hand run and crossbar unit keep Concept 34's exact positions; the three modules that made up its left leg become a single folded plane occupying the footprint they swept. The crossbar unit is the one piece touching both systems.",
    Static: Concept35AStatic,
    Animated: Concept35AAnimated,
  },
  {
    key: '35B',
    name: 'B — Assembly Transition',
    description:
      'Concept 33 with the lower right leg still resolving. The plane breaks on a line parallel to the face of the module below it, and two units continue on the leg\u2019s own centre line — one structure caught crystallising into the other.',
    Static: Concept35BStatic,
    Animated: Concept35BAnimated,
  },
  {
    key: '35C',
    name: 'C — Molecular Interior',
    description:
      'The outer silhouette stays a solid folded A. The counter is cut as a module rather than a triangle, its lower faces form the crossbar, and one unit is docked at its centre. Nothing hangs off the outside of the letter.',
    Static: Concept35CStatic,
    Animated: Concept35CAnimated,
  },
]

export default function ExperimentsPage() {
  const { reviewerName } = useReviewer()
  const [newRoundBackground, setNewRoundBackground] = useState<'light' | 'dark'>('light')
  const [hybridBackground, setHybridBackground] = useState<'light' | 'dark'>('light')
  const {
    collectedFeedback,
    submittingFeedback,
    feedbackError,
    justSubmittedCount,
    handleFeedbackSubmit,
    submitAllFeedback,
  } = useFeedbackSubmission(reviewerName)

  const [displayMode, setDisplayMode] = useState<'static' | 'monochrome'>('static')
  const [animating, setAnimating] = useState<{ [key: string]: boolean }>({})

  const concepts = EXPERIMENT_CONCEPTS

  const triggerAnimation = (id: string) => {
    setAnimating(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setAnimating(prev => ({ ...prev, [id]: false }))
    }, 2600)
  }

  return (
    <div className="page light">
      <header className="experiments-header">
        <div>
          <h1>Concept Experiments</h1>
          <p className="subtitle">Internal workspace — not part of the active reviewer collection</p>
        </div>
        <div className="controls">
          <Link href="/">
            <button>← Back to Main</button>
          </Link>
        </div>
      </header>

      <section style={{ padding: '0 2rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          Concept 35 — Faceted + Molecular A — 35A–35C
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '62ch' }}>
          One A holding both languages: the folded planes of Concept 33 and the hexagonal
          modules of Concept 34. In all three, the modules keep Concept 34&rsquo;s geometry, each
          module is cut to the width of the leg it belongs to, and every plane edge facing a
          module runs parallel to that module&rsquo;s face across Concept 34&rsquo;s own channel — so a
          plane and a module read as one material in two states. Three structural variations
          of the same idea.
        </p>
        <div className="control-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginRight: '0.75rem' }}>
            Website Preview
          </label>
          <div className="button-group" style={{ display: 'inline-flex' }}>
            <button
              className={hybridBackground === 'light' ? 'active' : ''}
              onClick={() => setHybridBackground('light')}
            >
              Light
            </button>
            <button
              className={hybridBackground === 'dark' ? 'active' : ''}
              onClick={() => setHybridBackground('dark')}
            >
              Dark
            </button>
          </div>
        </div>
        <div className="concepts-grid">
          {HYBRID_VARIATIONS.map((variation) => (
            <LogoCard
              key={variation.key}
              id={35}
              name={variation.name}
              description={variation.description}
              staticLogo={<variation.Static />}
              animatedLogo={<variation.Animated />}
              onPlayAll={false}
              onFeedbackSubmit={handleFeedbackSubmit}
              displayMode="animated"
              logoBackground={hybridBackground}
              sizeMode="full"
            />
          ))}
        </div>
      </section>

      <section style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem', borderTop: '1px solid #e0e0e0', paddingTop: '2rem' }}>
          New Creative Round — 19–24
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Six new experimental concepts, one per creative territory. Not active, not archived.
        </p>
        <div className="control-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginRight: '0.75rem' }}>
            Website Preview
          </label>
          <div className="button-group" style={{ display: 'inline-flex' }}>
            <button
              className={newRoundBackground === 'light' ? 'active' : ''}
              onClick={() => setNewRoundBackground('light')}
            >
              Light
            </button>
            <button
              className={newRoundBackground === 'dark' ? 'active' : ''}
              onClick={() => setNewRoundBackground('dark')}
            >
              Dark
            </button>
          </div>
        </div>
        <div className="concepts-grid">
          {NEW_ROUND_CONCEPTS.map((concept) => {
            const { Static, Animated } = NEW_ROUND_COMPONENTS[concept.id]
            return (
              <div key={concept.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <LogoCard
                  id={concept.id}
                  name={concept.name}
                  description={concept.description}
                  staticLogo={<Static />}
                  animatedLogo={<Animated />}
                  onPlayAll={false}
                  onFeedbackSubmit={handleFeedbackSubmit}
                  displayMode="animated"
                  logoBackground={newRoundBackground}
                  sizeMode="full"
                />
                <Link href={`/concept/${concept.id}`}>
                  <button
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      fontSize: '0.85rem',
                      background: 'var(--accent-navy)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                    }}
                  >
                    View Full Details →
                  </button>
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <section style={{ padding: '0 2rem', marginTop: '3rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem', borderTop: '1px solid #e0e0e0', paddingTop: '2rem' }}>
          Earlier Descendant Studies — 17A–18C
        </h2>
        <p className="subtitle" style={{ marginBottom: '1rem' }}>Visual prototypes for Territory A and Territory B descendants</p>
        <div className="controls" style={{ marginBottom: '1.5rem' }}>
          <button
            className={displayMode === 'static' ? 'active' : ''}
            onClick={() => setDisplayMode('static')}
          >
            Color
          </button>
          <button
            className={displayMode === 'monochrome' ? 'active' : ''}
            onClick={() => setDisplayMode('monochrome')}
          >
            Monochrome
          </button>
        </div>

        <div className="experiments-grid">
          {concepts.map(concept => (
            <ConceptExperiment
              key={concept.id}
              id={concept.id}
              name={concept.name}
              category={concept.category}
              isAnimating={animating[concept.id] || false}
              onPlayAssembly={() => triggerAnimation(concept.id)}
              displayMode={displayMode}
            />
          ))}
        </div>
      </section>

      {reviewerName && (collectedFeedback.length > 0 || justSubmittedCount !== null) && (
        <section className="feedback-submission-bar">
          <div className="submission-content">
            <div className="submission-info">
              {feedbackError ? (
                <p style={{ color: '#d32f2f' }}>Error: {feedbackError}</p>
              ) : collectedFeedback.length > 0 ? (
                <p>You have {collectedFeedback.length} piece{collectedFeedback.length !== 1 ? 's' : ''} of feedback ready</p>
              ) : (
                <p>✓ {justSubmittedCount} piece{justSubmittedCount !== 1 ? 's' : ''} of feedback submitted</p>
              )}
            </div>
            <button
              className={`btn-submit-all ${submittingFeedback ? 'submitting' : ''} ${feedbackError ? 'error' : ''}`}
              onClick={submitAllFeedback}
              disabled={submittingFeedback || collectedFeedback.length === 0}
            >
              {submittingFeedback ? 'Submitting...' : feedbackError ? 'Retry' : collectedFeedback.length === 0 ? '✓ Submitted!' : 'Submit Feedback'}
            </button>
          </div>
        </section>
      )}

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
        <p>Development experiments only. Do not add to production collection.</p>
      </footer>
      <DesignWorkspaceNav />
    </div>
  )
}

function ConceptExperiment({
  id,
  name,
  category,
  isAnimating,
  onPlayAssembly,
  displayMode,
}: {
  id: string
  name: string
  category: string
  isAnimating: boolean
  onPlayAssembly: () => void
  displayMode: 'static' | 'monochrome'
}) {
  const getComponent = () => {
    switch (id) {
      case '17A':
        return <Concept17A isAnimating={isAnimating} displayMode={displayMode} />
      case '17B':
        return <Concept17B isAnimating={isAnimating} displayMode={displayMode} />
      case '17C':
        return <Concept17C isAnimating={isAnimating} displayMode={displayMode} />
      case '18A':
        return <Concept18A isAnimating={isAnimating} displayMode={displayMode} />
      case '18B':
        return <Concept18B isAnimating={isAnimating} displayMode={displayMode} />
      case '18C':
        return <Concept18C isAnimating={isAnimating} displayMode={displayMode} />
      default:
        return null
    }
  }

  return (
    <article className="experiment-card">
      <div className="experiment-header">
        <div>
          <span className="experiment-id">{id}</span>
          <h2>{name}</h2>
          <p className="experiment-category">{category}</p>
        </div>
        <div className="experiment-controls">
          <button className="btn-play" onClick={onPlayAssembly} disabled={isAnimating}>
            {isAnimating ? 'Playing...' : 'Play Assembly'}
          </button>
        </div>
      </div>

      {/* Large static */}
      <div className="view-section">
        <div className="view-label">Large Static</div>
        <div className="view-large">
          {getComponent()}
        </div>
      </div>

      {/* Sizes */}
      <div className="view-section">
        <div className="view-label">Sizes: 64px / 32px / 16px</div>
        <div className="view-sizes">
          <div className="size-slot">
            <svg viewBox="0 0 200 200" width="64" height="64">
              {getComponent()}
            </svg>
          </div>
          <div className="size-slot">
            <svg viewBox="0 0 200 200" width="32" height="32">
              {getComponent()}
            </svg>
          </div>
          <div className="size-slot">
            <svg viewBox="0 0 200 200" width="16" height="16">
              {getComponent()}
            </svg>
          </div>
        </div>
      </div>

      {/* Light background */}
      <div className="view-section">
        <div className="view-label">Light Background</div>
        <div className="view-background light-bg">
          <svg viewBox="0 0 200 200" width="120" height="120">
            {getComponent()}
          </svg>
        </div>
      </div>

      {/* Dark background */}
      <div className="view-section">
        <div className="view-label">Dark Background</div>
        <div className="view-background dark-bg">
          <svg viewBox="0 0 200 200" width="120" height="120">
            {getComponent()}
          </svg>
        </div>
      </div>
    </article>
  )
}

// TERRITORY A COMPONENTS

function Concept17A({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes voronoi-cell-1 {
            0% { transform: translate(-40px, -40px); opacity: 0.3; }
            80% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes voronoi-cell-2 {
            0% { transform: translate(40px, -40px); opacity: 0.3; }
            80% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes voronoi-cell-3 {
            0% { transform: translate(40px, 40px); opacity: 0.3; }
            80% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes voronoi-cell-4 {
            0% { transform: translate(-40px, 40px); opacity: 0.3; }
            80% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes void-fade {
            0% { opacity: 0; }
            70% { opacity: 0; }
            100% { opacity: 1; }
          }
          .voronoi-animated {
            animation: ${isAnimating ? '2.4s ease-in-out' : '0s'} forwards;
          }
          .cell-1 { animation-name: ${isAnimating ? 'voronoi-cell-1' : 'none'}; }
          .cell-2 { animation-name: ${isAnimating ? 'voronoi-cell-2' : 'none'}; animation-delay: 0.1s; }
          .cell-3 { animation-name: ${isAnimating ? 'voronoi-cell-3' : 'none'}; animation-delay: 0.2s; }
          .cell-4 { animation-name: ${isAnimating ? 'voronoi-cell-4' : 'none'}; animation-delay: 0.3s; }
          .void { animation: ${isAnimating ? 'void-fade 2.4s ease-in-out' : '0s'} forwards; }
        `}</style>
      </defs>

      {/* Four polygonal cells */}
      <g className="voronoi-animated cell-1">
        <polygon points="100,100 75,85 65,105 85,120" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="2.5" strokeLinejoin="miter"/>
      </g>
      <g className="voronoi-animated cell-2">
        <polygon points="100,100 125,85 135,105 115,120" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="2.5" strokeLinejoin="miter"/>
      </g>
      <g className="voronoi-animated cell-3">
        <polygon points="100,100 115,125 135,115 125,95" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="2.5" strokeLinejoin="miter"/>
      </g>
      <g className="voronoi-animated cell-4">
        <polygon points="100,100 85,125 65,115 75,95" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="2.5" strokeLinejoin="miter"/>
      </g>

      {/* Central void */}
      <circle cx="100" cy="100" r="5" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="1.5" className="void"/>
    </svg>
  )
}

function Concept17B({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes arc-rotate-1 {
            0% { transform-origin: 100px 100px; transform: rotate(-90deg) translateY(35px) rotate(90deg); opacity: 0.2; }
            100% { transform-origin: 100px 100px; transform: rotate(0deg); opacity: 1; }
          }
          @keyframes arc-rotate-2 {
            0% { transform-origin: 100px 100px; transform: rotate(-90deg) translateY(35px) rotate(90deg); opacity: 0.2; }
            100% { transform-origin: 100px 100px; transform: rotate(90deg); opacity: 1; }
          }
          @keyframes arc-rotate-3 {
            0% { transform-origin: 100px 100px; transform: rotate(-90deg) translateY(35px) rotate(90deg); opacity: 0.2; }
            100% { transform-origin: 100px 100px; transform: rotate(180deg); opacity: 1; }
          }
          @keyframes arc-rotate-4 {
            0% { transform-origin: 100px 100px; transform: rotate(-90deg) translateY(35px) rotate(90deg); opacity: 0.2; }
            100% { transform-origin: 100px 100px; transform: rotate(270deg); opacity: 1; }
          }
          .arc-animated {
            animation: ${isAnimating ? '2.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : '0s'} forwards;
          }
          .arc-1 { animation-name: ${isAnimating ? 'arc-rotate-1' : 'none'}; }
          .arc-2 { animation-name: ${isAnimating ? 'arc-rotate-2' : 'none'}; animation-delay: 0.2s; }
          .arc-3 { animation-name: ${isAnimating ? 'arc-rotate-3' : 'none'}; animation-delay: 0.4s; }
          .arc-4 { animation-name: ${isAnimating ? 'arc-rotate-4' : 'none'}; animation-delay: 0.6s; }
        `}</style>
      </defs>

      {/* Four interlocking arcs */}
      <g className="arc-animated arc-1">
        <path d="M 70 100 A 30 30 0 0 1 130 100" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g className="arc-animated arc-2">
        <path d="M 100 70 A 30 30 0 0 1 100 130" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g className="arc-animated arc-3">
        <path d="M 130 100 A 30 30 0 0 1 70 100" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g className="arc-animated arc-4">
        <path d="M 100 130 A 30 30 0 0 1 100 70" fill="none" stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} strokeWidth="3" strokeLinecap="round"/>
      </g>

      {/* Central void indicator */}
      <circle cx="100" cy="100" r="4" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity={isAnimating ? 1 : 0.6}/>
    </svg>
  )
}

function Concept17C({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes petal-expand-0 {
            0% { transform: translate(0, 60px); opacity: 0; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes petal-expand-1 {
            0% { transform: translate(43px, 30px); opacity: 0; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes petal-expand-2 {
            0% { transform: translate(43px, -30px); opacity: 0; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes petal-expand-3 {
            0% { transform: translate(-43px, 30px); opacity: 0; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes petal-expand-4 {
            0% { transform: translate(-43px, -30px); opacity: 0; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          .petal-animated {
            animation: ${isAnimating ? '2.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : '0s'} forwards;
            transform-origin: 100px 100px;
          }
          .petal-0 { animation-name: ${isAnimating ? 'petal-expand-0' : 'none'}; }
          .petal-1 { animation-name: ${isAnimating ? 'petal-expand-1' : 'none'}; animation-delay: 0.15s; }
          .petal-2 { animation-name: ${isAnimating ? 'petal-expand-2' : 'none'}; animation-delay: 0.3s; }
          .petal-3 { animation-name: ${isAnimating ? 'petal-expand-3' : 'none'}; animation-delay: 0.2s; }
          .petal-4 { animation-name: ${isAnimating ? 'petal-expand-4' : 'none'}; animation-delay: 0.25s; }
        `}</style>
      </defs>

      {/* Five tapered wedges */}
      <g className="petal-animated petal-0">
        <path d="M 100 100 L 105 60 L 95 60 Z" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity="0.8"/>
      </g>
      <g className="petal-animated petal-1">
        <path d="M 100 100 L 143 75 L 128 88 Z" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity="0.8"/>
      </g>
      <g className="petal-animated petal-2">
        <path d="M 100 100 L 143 125 L 128 112 Z" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity="0.8"/>
      </g>
      <g className="petal-animated petal-3">
        <path d="M 100 100 L 57 75 L 72 88 Z" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity="0.8"/>
      </g>
      <g className="petal-animated petal-4">
        <path d="M 100 100 L 57 125 L 72 112 Z" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} opacity="0.8"/>
      </g>
    </svg>
  )
}

// TERRITORY B COMPONENTS

function Concept18A({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes module-rotate-0 {
            0% { transform: rotate(0deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }
          @keyframes module-rotate-1 {
            0% { transform: rotate(-22deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }
          @keyframes module-rotate-2 {
            0% { transform: rotate(-44deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }
          @keyframes module-rotate-3 {
            0% { transform: rotate(-66deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }
          @keyframes module-rotate-4 {
            0% { transform: rotate(-88deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }
          .module-animated {
            animation: ${isAnimating ? '2.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : '0s'} forwards;
          }
          .module-0 { animation-name: ${isAnimating ? 'module-rotate-0' : 'none'}; }
          .module-1 { animation-name: ${isAnimating ? 'module-rotate-1' : 'none'}; animation-delay: 0.4s; }
          .module-2 { animation-name: ${isAnimating ? 'module-rotate-2' : 'none'}; animation-delay: 0.8s; }
          .module-3 { animation-name: ${isAnimating ? 'module-rotate-3' : 'none'}; animation-delay: 1.2s; }
          .module-4 { animation-name: ${isAnimating ? 'module-rotate-4' : 'none'}; animation-delay: 1.6s; }
        `}</style>
      </defs>

      {/* Five stacked rectangles with progressive rotation */}
      <g className="module-animated module-0">
        <rect x="85" y="65" width="30" height="18" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
      </g>
      <g className="module-animated module-1">
        <rect x="85" y="85" width="30" height="18" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
      </g>
      <g className="module-animated module-2">
        <rect x="85" y="105" width="30" height="18" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
      </g>
      <g className="module-animated module-3">
        <rect x="85" y="125" width="30" height="18" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
      </g>
      <g className="module-animated module-4">
        <rect x="85" y="145" width="30" height="18" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
      </g>
    </svg>
  )
}

function Concept18B({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes module-spiral-0 {
            0% { transform: translate(0, -60px) scale(0.3); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes module-spiral-1 {
            0% { transform: translate(43px, -30px) scale(0.3); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes module-spiral-2 {
            0% { transform: translate(43px, 30px) scale(0.3); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes module-spiral-3 {
            0% { transform: translate(-43px, 30px) scale(0.3); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes module-spiral-4 {
            0% { transform: translate(-43px, -30px) scale(0.3); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          .lock-animated {
            animation: ${isAnimating ? '2.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : '0s'} forwards;
            transform-origin: 100px 100px;
          }
          .lock-0 { animation-name: ${isAnimating ? 'module-spiral-0' : 'none'}; }
          .lock-1 { animation-name: ${isAnimating ? 'module-spiral-1' : 'none'}; animation-delay: 0.4s; }
          .lock-2 { animation-name: ${isAnimating ? 'module-spiral-2' : 'none'}; animation-delay: 0.8s; }
          .lock-3 { animation-name: ${isAnimating ? 'module-spiral-3' : 'none'}; animation-delay: 1.2s; }
          .lock-4 { animation-name: ${isAnimating ? 'module-spiral-4' : 'none'}; animation-delay: 1.6s; }
        `}</style>
      </defs>

      {/* Five modules in pentagon arrangement */}
      <g className="lock-animated lock-0">
        <rect x="85" y="60" width="30" height="30" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
        <circle cx="100" cy="75" r="2.5" fill={displayMode === 'monochrome' ? '#F3F0ED' : '#FFFFFF'}/>
      </g>
      <g className="lock-animated lock-1" style={{ transform: 'rotate(72deg)', transformOrigin: '100px 100px' }}>
        <rect x="85" y="60" width="30" height="30" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
        <circle cx="100" cy="75" r="2.5" fill={displayMode === 'monochrome' ? '#F3F0ED' : '#FFFFFF'}/>
      </g>
      <g className="lock-animated lock-2" style={{ transform: 'rotate(144deg)', transformOrigin: '100px 100px' }}>
        <rect x="85" y="60" width="30" height="30" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
        <circle cx="100" cy="75" r="2.5" fill={displayMode === 'monochrome' ? '#F3F0ED' : '#FFFFFF'}/>
      </g>
      <g className="lock-animated lock-3" style={{ transform: 'rotate(216deg)', transformOrigin: '100px 100px' }}>
        <rect x="85" y="60" width="30" height="30" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
        <circle cx="100" cy="75" r="2.5" fill={displayMode === 'monochrome' ? '#F3F0ED' : '#FFFFFF'}/>
      </g>
      <g className="lock-animated lock-4" style={{ transform: 'rotate(288deg)', transformOrigin: '100px 100px' }}>
        <rect x="85" y="60" width="30" height="30" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'} rx="2"/>
        <circle cx="100" cy="75" r="2.5" fill={displayMode === 'monochrome' ? '#F3F0ED' : '#FFFFFF'}/>
      </g>

      {/* Center anchor */}
      <circle cx="100" cy="100" r="5" fill={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'}/>
    </svg>
  )
}

function Concept18C({ isAnimating, displayMode }: { isAnimating: boolean; displayMode: string }) {
  return (
    <svg viewBox="0 0 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes curve-draw {
            0% { stroke-dasharray: 500; stroke-dashoffset: 500; }
            100% { stroke-dasharray: 500; stroke-dashoffset: 0; }
          }
          .curve-animated {
            animation: ${isAnimating ? 'curve-draw 2.2s ease-in-out' : '0s'} forwards;
          }
        `}</style>
      </defs>

      {/* Continuous spiral curve */}
      <path
        className="curve-animated"
        d="M 100 170 Q 88 145 100 120 Q 110 100 100 80 Q 85 65 70 58 Q 55 52 45 65"
        fill="none"
        stroke={displayMode === 'monochrome' ? '#1A1A18' : '#5BA3C7'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
