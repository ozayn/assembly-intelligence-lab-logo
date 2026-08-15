'use client'

import { forwardRef } from 'react'
import {
  Concept01Static,
  Concept02Static,
  Concept03Static,
  Concept04Static,
  Concept05Static,
  Concept06Static,
  Concept07Static,
  Concept08Static,
  Concept09Static,
  Concept10Static,
  Concept11Static,
  Concept12Static,
  Round3Concept01Static,
  Round3Concept02Static,
  Round3Concept03Static,
  Round3Concept04Static,
  Round3Concept05Static,
  Round3Concept06Static,
  Concept25Static,
  Concept26Static,
  Concept27Static,
  Concept28Static,
  Concept29Static,
  Concept30Static,
  Concept31Static,
  Concept32Static,
  Concept33Static,
  Concept34Static,
  Concept35AStatic,
  Concept35BStatic,
  Concept35CStatic,
  Concept38Static,
  Concept39Static,
  Concept40Static,
  Concept41Static,
  REVIEW_CONCEPTS,
} from './logos'

const LOGO_COMPONENTS: Record<number, React.ComponentType> = {
  1: Concept01Static,
  2: Concept02Static,
  3: Concept03Static,
  4: Concept04Static,
  5: Concept05Static,
  6: Concept06Static,
  7: Concept07Static,
  8: Concept08Static,
  9: Concept09Static,
  10: Concept10Static,
  11: Concept11Static,
  12: Concept12Static,
  13: Round3Concept01Static,
  14: Round3Concept02Static,
  15: Round3Concept03Static,
  16: Round3Concept04Static,
  17: Round3Concept05Static,
  18: Round3Concept06Static,
  25: Concept25Static,
  26: Concept26Static,
  27: Concept27Static,
  28: Concept28Static,
  29: Concept29Static,
  30: Concept30Static,
  31: Concept31Static,
  32: Concept32Static,
  33: Concept33Static,
  34: Concept34Static,
  35: Concept35AStatic,
  36: Concept35BStatic,
  37: Concept35CStatic,
  38: Concept38Static,
  39: Concept39Static,
  40: Concept40Static,
  41: Concept41Static,
}

interface ExportSheetProps {
  title?: string
  includeNames?: boolean
}

export const ExportSheet = forwardRef<HTMLDivElement, ExportSheetProps>(
  ({ title = 'AIL Logo Concepts', includeNames = true }, ref) => {
    const reviewConcepts = REVIEW_CONCEPTS
    const columns = reviewConcepts.length <= 12 ? 4 : 3
    const conceptsPerColumn = Math.ceil(reviewConcepts.length / columns)

    return (
      <div
        ref={ref}
        style={{
          display: 'block',
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
        }}
      >
        <div
          style={{
            width: columns === 4 ? '1600px' : '1200px',
            padding: '60px',
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Title */}
          <div
            style={{
              marginBottom: '60px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '300',
                margin: '0 0 8px 0',
                color: '#000000',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#666666',
                margin: '0',
              }}
            >
              {reviewConcepts.length} concepts
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '48px',
              justifyItems: 'center',
              alignItems: 'start',
            }}
          >
            {reviewConcepts.map((concept) => {
              const Component = LOGO_COMPONENTS[concept.id]
              if (!Component) return null

              return (
                <div
                  key={concept.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Logo Container */}
                  <div
                    style={{
                      width: '240px',
                      height: '240px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ transform: 'scale(1.5)' }}>
                      <Component />
                    </div>
                  </div>

                  {/* Concept Number */}
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#2d9cdb',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {concept.id.toString().padStart(2, '0')}
                  </div>

                  {/* Concept Name */}
                  {includeNames && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666666',
                        textAlign: 'center',
                        maxWidth: '200px',
                        lineHeight: '1.4',
                      }}
                    >
                      {concept.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

ExportSheet.displayName = 'ExportSheet'
