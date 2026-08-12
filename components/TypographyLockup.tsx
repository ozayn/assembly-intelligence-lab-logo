'use client'

import { useState } from 'react'
import { TYPOGRAPHY_SYSTEMS, type TypographyDirection } from './typographySystems'
import { BrandWordmark } from './BrandWordmark'
import { FittedLockup } from './FittedLockup'
import './typography-lockup.css'

interface TypographyLockupProps {
  symbolComponent: React.ReactNode
  conceptId: number
  conceptName: string
}

export function TypographyLockup({ symbolComponent, conceptId, conceptName }: TypographyLockupProps) {
  const [direction, setDirection] = useState<TypographyDirection>('scientific')

  const typeSystem = TYPOGRAPHY_SYSTEMS[direction]
  const wordmark = (fontSize: number, trackingScale: number, align: 'center' | 'left') => (
    <BrandWordmark
      typeSystem={typeSystem}
      fontSize={fontSize}
      letterSpacing={typeSystem.letterSpacing * trackingScale}
      align={align}
    />
  )

  // Width-fitted systems own the whole stacked composition: the symbol is
  // cropped to its ink and the wordmark is solved against that width, so the
  // fixed symbol wrapper and wordmark box are replaced rather than restyled.
  const stacked = (
    symbolPx: number,
    marginBottom: number,
    fontSize: number,
    trackingScale: number,
    wordmarkStyle: React.CSSProperties
  ) =>
    typeSystem.fitted ? (
      <FittedLockup
        symbol={symbolComponent}
        system={typeSystem}
        symbolPx={symbolPx}
        symbolKey={conceptId}
      />
    ) : (
      <>
        <div className="symbol-wrapper" style={{ width: `${symbolPx}px`, height: `${symbolPx}px`, marginBottom: `${marginBottom}px` }}>
          {symbolComponent}
        </div>
        <div
          className="wordmark"
          style={{
            fontFamily: typeSystem.fontFamily,
            fontWeight: typeSystem.fontWeight,
            textAlign: 'center',
            ...wordmarkStyle,
          }}
        >
          {wordmark(fontSize, trackingScale, 'center')}
        </div>
      </>
    )

  const stackedFull = () =>
    stacked(120, 5, typeSystem.fontSize, 1, {
      fontSize: `${typeSystem.fontSize}px`,
      letterSpacing: `${typeSystem.letterSpacing}px`,
      lineHeight: typeSystem.lineHeight,
    })

  const stackedCompact = () =>
    stacked(64, 3, 7, 0.6, {
      fontSize: '12px',
      letterSpacing: `${typeSystem.letterSpacing * 0.5}px`,
      lineHeight: 1.3,
    })

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
                {wordmark(typeSystem.fontSize, 1, 'left')}
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
                {wordmark(typeSystem.fontSize, 1, 'left')}
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
                {wordmark(7, 0.55, 'left')}
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
                {wordmark(7, 0.55, 'left')}
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
            <div className="stacked-light">{stackedFull()}</div>
            <div className="stacked-dark">{stackedFull()}</div>
          </div>

          {/* Compact */}
          <div className="lockup-size-group">
            <div className="size-label">Compact</div>
            <div className="stacked-light-compact">{stackedCompact()}</div>
            <div className="stacked-dark-compact">{stackedCompact()}</div>
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
