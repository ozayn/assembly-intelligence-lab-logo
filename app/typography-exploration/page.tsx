'use client'

import { ExplorationLockup } from './ExplorationLockup'
import { TypographyExportButtons } from './TypographyExportButtons'
import { DesignWorkspaceNav } from '@/components/DesignWorkspaceNav'
import {
  DARK_TREATMENTS,
  DIRECTIONS,
  DIRECTION_BY_ID,
  LIGHT_TREATMENTS,
  PALETTE,
  SPACING_BY_ID,
  SPACING_STEPS,
  SYMBOLS,
} from './directions'
import './typography-exploration.css'

const BALANCED = SPACING_BY_ID.balanced.gapRatio
const REFERENCE = DIRECTION_BY_ID.A
const HUMANIST = DIRECTION_BY_ID.B
const TWO_TONE = LIGHT_TREATMENTS[0]

const SWATCHES: [string, string][] = [
  ['navy', PALETTE.navy],
  ['blue', PALETTE.blue],
  ['teal', PALETTE.teal],
  ['light teal', PALETTE.lightTeal],
  ['pale teal', PALETTE.paleTeal],
]

export default function TypographyExplorationPage() {
  return (
    <div className="tx-page">
      <div className="tx-container">
        <header className="tx-header">
          <p className="tx-eyebrow">Exploration only — production default unchanged</p>
          <h1>Company-name typography</h1>
          <p className="tx-lede">
            Five typography directions for the two-line wordmark, each shown under both
            Concept 33 and Concept 34. Nothing here is wired into the live lockup: the
            production system still uses its current settings.
          </p>
          <p className="tx-lede">
            Tracking is not hand-set. For every candidate both lines are measured in the
            loaded webfont and their letter-spacing is solved so each line finishes on the
            symbol&rsquo;s ink width, which is what makes ASSEMBLY and INTELLIGENCE LAB
            share an optical width. Spacing is measured the same way: the symbol gap is the
            distance from the mark&rsquo;s lowest ink to the cap line, not to the top of an
            empty text box.
          </p>
          <div className="tx-swatches">
            {SWATCHES.map(([name, hex]) => (
              <span className="tx-swatch" key={hex}>
                <i style={{ background: hex }} />
                {name} {hex}
              </span>
            ))}
          </div>
          <TypographyExportButtons />
        </header>

        <section className="tx-section">
          <div className="tx-section-head">
            <h2>1 · Five typography directions</h2>
            <p>
              Baseline conditions throughout: navy ASSEMBLY, teal INTELLIGENCE LAB, balanced
              symbol gap, wordmark set to the full ink width of the symbol above it.
            </p>
          </div>

          {DIRECTIONS.map(direction => (
            <div className="tx-direction" key={direction.id}>
              <div className="tx-direction-head">
                <span className="tx-badge">{direction.id}</span>
                <h3>{direction.name}</h3>
                <span className="tx-font">
                  {direction.fontLabel} · {direction.weightPrimary}/{direction.weightSecondary}
                </span>
                <p className="tx-direction-note">{direction.note}</p>
              </div>
              <div className="tx-grid tx-grid-2">
                {SYMBOLS.map(symbol => (
                  <ExplorationLockup
                    key={symbol.id}
                    symbol={symbol}
                    direction={direction}
                    treatment={TWO_TONE}
                    gapRatio={BALANCED}
                    caption={symbol.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="tx-section">
          <div className="tx-section-head">
            <h2>2 · Symbol-to-wordmark distance</h2>
            <p>
              Three steps, measured from the lowest ink of the mark to the cap line of
              ASSEMBLY. Set in Direction A so the only variable is the gap. Concept 34
              carries more open space inside its lower corners, so the same numeric gap can
              read differently under each symbol.
            </p>
          </div>

          {SYMBOLS.map(symbol => (
            <div className="tx-direction" key={symbol.id}>
              <div className="tx-direction-head">
                <h3>{symbol.label}</h3>
                <span className="tx-font">Direction A · navy + teal</span>
              </div>
              <div className="tx-grid tx-grid-3">
                {SPACING_STEPS.map(step => (
                  <ExplorationLockup
                    key={step.id}
                    symbol={symbol}
                    direction={REFERENCE}
                    treatment={TWO_TONE}
                    gapRatio={step.gapRatio}
                    symbolPx={170}
                    caption={`${step.name} — ${(step.gapRatio * 100).toFixed(0)}% of symbol`}
                    spec="none"
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="tx-section">
          <div className="tx-section-head">
            <h2>3 · Colour treatments</h2>
            <p>
              The same typography in five colour treatments, shown across both symbols. The
              two gradient rows are experiments included for comparison, not proposals.
            </p>
          </div>

          <div className="tx-callout">
            <p>
              What to watch: whether the ramp on the wordmark competes with the facets or
              modules above it, and whether the second line stays legible once its colour
              stops being a single flat value.
            </p>
          </div>

          {[REFERENCE, HUMANIST].map(direction => (
            <div className="tx-direction" key={direction.id}>
              <div className="tx-direction-head">
                <span className="tx-badge">{direction.id}</span>
                <h3>{direction.name}</h3>
                <span className="tx-font">{direction.fontLabel}</span>
              </div>
              {LIGHT_TREATMENTS.map(treatment => (
                <div className="tx-grid tx-grid-2" key={treatment.id} style={{ marginBottom: '1.25rem' }}>
                  {SYMBOLS.map(symbol => (
                    <ExplorationLockup
                      key={symbol.id}
                      symbol={symbol}
                      direction={direction}
                      treatment={treatment}
                      gapRatio={BALANCED}
                      symbolPx={165}
                      caption={`${treatment.name} · ${symbol.label} — ${treatment.note}`}
                      spec="none"
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="tx-section">
          <div className="tx-section-head">
            <h2>4 · Dark background</h2>
            <p>
              The strongest flat directions on the dark target background, with the gradient
              experiment repeated for comparison. Symbol roles are remapped exactly as the
              concept cards do on dark, and the wordmark uses approved palette values only.
            </p>
          </div>

          {[REFERENCE, HUMANIST].map(direction => (
            <div className="tx-direction" key={direction.id}>
              <div className="tx-direction-head">
                <span className="tx-badge">{direction.id}</span>
                <h3>{direction.name}</h3>
                <span className="tx-font">{direction.fontLabel} on #151b34</span>
              </div>
              {DARK_TREATMENTS.map(treatment => (
                <div className="tx-grid tx-grid-2" key={treatment.id} style={{ marginBottom: '1.25rem' }}>
                  {SYMBOLS.map(symbol => (
                    <ExplorationLockup
                      key={symbol.id}
                      symbol={symbol}
                      direction={direction}
                      treatment={treatment}
                      gapRatio={BALANCED}
                      symbolPx={165}
                      background="dark"
                      caption={`${treatment.name} · ${symbol.label} — ${treatment.label}`}
                      spec="none"
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>

        <a className="tx-back" href="/">
          ← Back to the concept collection
        </a>

        <DesignWorkspaceNav />
      </div>
    </div>
  )
}
