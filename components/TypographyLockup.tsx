'use client'

import { useState } from 'react'
import './typography-lockup.css'

interface TypographyLockupProps {
  symbolComponent: React.ReactNode
  conceptId: number
  conceptName: string
}

type TypographyDirection = 'scientific' | 'editorial' | 'technical'

const TYPOGRAPHY_SYSTEMS = {
  scientific: {
    name: 'Scientific / Precise',
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 1.2,
    description: 'Clean, rational, contemporary. High clarity.',
  },
  editorial: {
    name: 'Editorial / Research',
    fontFamily: '"Newsreader", "Lora", Georgia, serif',
    fontWeight: 400,
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 1.3,
    description: 'Distinctive, intellectual. Contemporary editorial quality.',
  },
  technical: {
    name: 'Technical / Experimental',
    fontFamily: '"Space Mono", "IBM Plex Mono", monospace',
    fontWeight: 400,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    description: 'Geometric, engineered. Deliberate clarity.',
  },
}

const COMPANY_NAME = 'Assembly Intelligence Lab'

export function TypographyLockup({ symbolComponent, conceptId, conceptName }: TypographyLockupProps) {
  const [direction, setDirection] = useState<TypographyDirection>('scientific')

  const typeSystem = TYPOGRAPHY_SYSTEMS[direction]

  return (
    <div className="typography-lockup">
      {/* Direction Toggle */}
      <div className="lockup-controls">
        <div className="direction-toggle">
          {Object.entries(TYPOGRAPHY_SYSTEMS).map(([key, sys]) => (
            <button
              key={key}
              className={`toggle-btn ${direction === key ? 'active' : ''}`}
              onClick={() => setDirection(key as TypographyDirection)}
              title={sys.description}
            >
              {sys.name}
            </button>
          ))}
        </div>
      </div>

      {/* Symbol Only */}
      <div className="lockup-section">
        <h4 className="lockup-label">Symbol Only</h4>
        <div className="symbol-only-container">
          <div className="symbol-only-light">
            {symbolComponent}
          </div>
          <div className="symbol-only-dark">
            {symbolComponent}
          </div>
        </div>
      </div>

      {/* Horizontal Lockup */}
      <div className="lockup-section">
        <h4 className="lockup-label">Horizontal Lockup</h4>

        <div className="horizontal-lockup-container">
          {/* Full size */}
          <div className="lockup-size-group">
            <div className="size-label">Full</div>
            <div className="horizontal-light">
              <div className="symbol-wrapper" style={{ width: '80px', height: '80px' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: `${typeSystem.fontSize}px`,
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing}px`,
                  lineHeight: typeSystem.lineHeight,
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
            <div className="horizontal-dark">
              <div className="symbol-wrapper" style={{ width: '80px', height: '80px' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: `${typeSystem.fontSize}px`,
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing}px`,
                  lineHeight: typeSystem.lineHeight,
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
          </div>

          {/* Header scale */}
          <div className="lockup-size-group">
            <div className="size-label">Header Scale (~32px symbol)</div>
            <div className="horizontal-light-small">
              <div className="symbol-wrapper" style={{ width: '32px', height: '32px' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: '14px',
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing * 0.5}px`,
                  lineHeight: 1.2,
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
            <div className="horizontal-dark-small">
              <div className="symbol-wrapper" style={{ width: '32px', height: '32px' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: '14px',
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing * 0.5}px`,
                  lineHeight: 1.2,
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stacked Lockup */}
      <div className="lockup-section">
        <h4 className="lockup-label">Stacked Lockup</h4>

        <div className="stacked-lockup-container">
          {/* Full size */}
          <div className="lockup-size-group">
            <div className="size-label">Full</div>
            <div className="stacked-light">
              <div className="symbol-wrapper" style={{ width: '120px', height: '120px', marginBottom: '1.5rem' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: `${typeSystem.fontSize}px`,
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing}px`,
                  lineHeight: typeSystem.lineHeight,
                  textAlign: 'center',
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
            <div className="stacked-dark">
              <div className="symbol-wrapper" style={{ width: '120px', height: '120px', marginBottom: '1.5rem' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: `${typeSystem.fontSize}px`,
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing}px`,
                  lineHeight: typeSystem.lineHeight,
                  textAlign: 'center',
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
          </div>

          {/* Compact */}
          <div className="lockup-size-group">
            <div className="size-label">Compact</div>
            <div className="stacked-light-compact">
              <div className="symbol-wrapper" style={{ width: '64px', height: '64px', marginBottom: '1rem' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: '12px',
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing * 0.5}px`,
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
            <div className="stacked-dark-compact">
              <div className="symbol-wrapper" style={{ width: '64px', height: '64px', marginBottom: '1rem' }}>
                {symbolComponent}
              </div>
              <div
                className="wordmark"
                style={{
                  fontFamily: typeSystem.fontFamily,
                  fontSize: '12px',
                  fontWeight: typeSystem.fontWeight,
                  letterSpacing: `${typeSystem.letterSpacing * 0.5}px`,
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                {COMPANY_NAME}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography System Info */}
      <div className="typography-info">
        <p>
          <strong>{typeSystem.name}</strong><br />
          <small>{typeSystem.description}</small>
        </p>
      </div>
    </div>
  )
}
