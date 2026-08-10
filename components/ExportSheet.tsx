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
  ALL_LOGO_CONCEPTS,
} from './logos'

const LOGO_COMPONENTS = [
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
]

interface ExportSheetProps {
  title?: string
  includeNames?: boolean
}

export const ExportSheet = forwardRef<HTMLDivElement, ExportSheetProps>(
  ({ title = 'AIL Logo Concepts', includeNames = true }, ref) => {
    const columns = ALL_LOGO_CONCEPTS.length <= 12 ? 4 : 3
    const conceptsPerColumn = Math.ceil(ALL_LOGO_CONCEPTS.length / columns)

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
              {ALL_LOGO_CONCEPTS.length} concepts
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
            {ALL_LOGO_CONCEPTS.map((concept, idx) => {
              const Component = LOGO_COMPONENTS[idx]
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
