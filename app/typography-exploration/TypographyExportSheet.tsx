'use client'

import { forwardRef } from 'react'
import { ExplorationLockup } from './ExplorationLockup'
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

// A contact sheet built for rasterising. It carries the same studies as the
// page, in the same order, but laid out at one fixed desktop width with fixed
// column tracks — the page's responsive grid would otherwise reflow to
// whatever window the export was started from.

const BALANCED = SPACING_BY_ID.balanced.gapRatio
const REFERENCE = DIRECTION_BY_ID.A
const HUMANIST = DIRECTION_BY_ID.B
const TWO_TONE = LIGHT_TREATMENTS[0]
const DARK_TWO_TONE = DARK_TREATMENTS[0]

export type SheetVariant = 'all' | 'selected'

interface TypographyExportSheetProps {
  variant: SheetVariant
}

function SectionTitle({ index, title, note }: { index: string; title: string; note: string }) {
  return (
    <div className="txe-section-title">
      <h2>
        {index} · {title}
      </h2>
      <p>{note}</p>
    </div>
  )
}

// The shortlist: the two directions that hold up best, in the baseline colour
// treatment, on both backgrounds and under both symbols.
const SHORTLIST = [REFERENCE, HUMANIST].flatMap(direction =>
  SYMBOLS.map(symbol => ({ direction, symbol }))
)

function ShortlistRow({
  background,
  treatment,
}: {
  background: 'light' | 'dark'
  treatment: typeof TWO_TONE
}) {
  return (
    <div className="txe-row txe-cols-4">
      {SHORTLIST.map(({ direction, symbol }) => (
        <div className="txe-col" key={`${direction.id}-${symbol.id}`}>
          <div className="txe-col-head">
            <span className="txe-badge">{direction.id}</span>
            <strong>{direction.fontLabel}</strong>
            <em>{symbol.label}</em>
          </div>
          <ExplorationLockup
            symbol={symbol}
            direction={direction}
            treatment={treatment}
            gapRatio={BALANCED}
            symbolPx={240}
            background={background}
            spec="compact"
            compact
          />
        </div>
      ))}
    </div>
  )
}

export const TypographyExportSheet = forwardRef<HTMLDivElement, TypographyExportSheetProps>(
  function TypographyExportSheet({ variant }, ref) {
    const colourDirections = [REFERENCE, HUMANIST]
    const today = new Date().toISOString().slice(0, 10)

    return (
      <div className="txe-frame" ref={ref} data-export-sheet={variant}>
        <div className="txe-sheet">
          <header className="txe-header">
            <p className="txe-eyebrow">Assembly Intelligence Lab · exploration, not a decision</p>
            <h1>Company-name typography</h1>
            <p className="txe-lede">
              {variant === 'all'
                ? 'Five typography directions for the two-line wordmark, each paired with Concept 33 and Concept 34, plus the spacing, colour and dark-background studies.'
                : 'The two strongest typography directions in the baseline colour treatment, on light and dark backgrounds.'}
            </p>
            <p className="txe-lede">
              Both lines are measured in the loaded webfont and their letter-spacing is solved so
              each line finishes on the symbol&rsquo;s ink width — that is what gives ASSEMBLY and
              INTELLIGENCE LAB the same optical width. The symbol gap is measured from the
              mark&rsquo;s lowest ink to the cap line.
            </p>
            <div className="txe-swatches">
              {Object.entries(PALETTE).map(([name, hex]) => (
                <span key={hex}>
                  <i style={{ background: hex }} />
                  {hex}
                </span>
              ))}
              <span className="txe-date">{today}</span>
            </div>
          </header>

          {variant === 'selected' && (
            <>
              <section className="txe-section">
                <SectionTitle
                  index="1"
                  title="Shortlist on light"
                  note="Directions A and B in navy ASSEMBLY / teal INTELLIGENCE LAB, balanced symbol gap."
                />
                <ShortlistRow background="light" treatment={TWO_TONE} />
              </section>
              <section className="txe-section">
                <SectionTitle
                  index="2"
                  title="Shortlist on dark"
                  note="The same four lockups on the dark target background, with symbol roles remapped as the concept cards do."
                />
                <ShortlistRow background="dark" treatment={DARK_TWO_TONE} />
              </section>
            </>
          )}

          {variant === 'all' && (
            <>
              <section className="txe-section">
                <SectionTitle
                  index="1"
                  title="Typography directions"
                  note="Navy ASSEMBLY, teal INTELLIGENCE LAB, balanced symbol gap, wordmark set to the full ink width of the symbol. Each column carries the same direction under both marks."
                />
                <div className="txe-row txe-cols-5">
                  {DIRECTIONS.map(direction => (
                    <div className="txe-col" key={direction.id}>
                      <div className="txe-col-head">
                        <span className="txe-badge">{direction.id}</span>
                        <strong>{direction.name}</strong>
                        <em>{direction.fontLabel}</em>
                      </div>
                      {SYMBOLS.map(symbol => (
                        <ExplorationLockup
                          key={symbol.id}
                          symbol={symbol}
                          direction={direction}
                          treatment={TWO_TONE}
                          gapRatio={BALANCED}
                          symbolPx={200}
                          caption={symbol.label}
                          spec="compact"
                          compact
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              <section className="txe-section">
                <SectionTitle
                  index="2"
                  title="Symbol-to-wordmark distance"
                  note="Measured from the lowest ink of the mark to the cap line of ASSEMBLY. Set in Direction A so the gap is the only variable."
                />
                {SYMBOLS.map(symbol => (
                  <div className="txe-subblock" key={symbol.id}>
                    <p className="txe-sublabel">{symbol.label} · Direction A · navy + teal</p>
                    <div className="txe-row txe-cols-3">
                      {SPACING_STEPS.map(step => (
                        <ExplorationLockup
                          key={step.id}
                          symbol={symbol}
                          direction={REFERENCE}
                          treatment={TWO_TONE}
                          gapRatio={step.gapRatio}
                          symbolPx={230}
                          caption={`${step.name} — ${(step.gapRatio * 100).toFixed(0)}% of symbol`}
                          spec="none"
                          compact
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <section className="txe-section">
                <SectionTitle
                  index="3"
                  title="Colour treatments"
                  note="Flat treatments and the two gradient experiments, across both symbols. Only official palette values are used; the gradients interpolate between those stops."
                />
                {colourDirections.map(direction => (
                  <div className="txe-subblock" key={direction.id}>
                    <p className="txe-sublabel">
                      Direction {direction.id} · {direction.name} · {direction.fontLabel}
                    </p>
                    <div className="txe-row txe-cols-5">
                      {LIGHT_TREATMENTS.map(treatment => (
                        <div className="txe-col" key={treatment.id}>
                          <p className="txe-treatment">
                            {treatment.name}
                            <span>{treatment.label}</span>
                          </p>
                          {SYMBOLS.map(symbol => (
                            <ExplorationLockup
                              key={symbol.id}
                              symbol={symbol}
                              direction={direction}
                              treatment={treatment}
                              gapRatio={BALANCED}
                              symbolPx={170}
                              caption={symbol.label}
                              spec="none"
                              compact
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <section className="txe-section">
                <SectionTitle
                  index="4"
                  title="Dark background"
                  note="Symbol roles remapped exactly as the concept cards do on dark; wordmark colours remain approved palette values."
                />
                {colourDirections.map(direction => (
                  <div className="txe-subblock" key={direction.id}>
                    <p className="txe-sublabel">
                      Direction {direction.id} · {direction.name} · {direction.fontLabel} on #151b34
                    </p>
                    <div className="txe-row txe-cols-3">
                      {DARK_TREATMENTS.map(treatment => (
                        <div className="txe-col" key={treatment.id}>
                          <p className="txe-treatment">
                            {treatment.name}
                            <span>{treatment.label}</span>
                          </p>
                          {SYMBOLS.map(symbol => (
                            <ExplorationLockup
                              key={symbol.id}
                              symbol={symbol}
                              direction={direction}
                              treatment={treatment}
                              gapRatio={BALANCED}
                              symbolPx={200}
                              background="dark"
                              caption={symbol.label}
                              spec="none"
                              compact
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}

          <footer className="txe-footer">
            Assembly Intelligence Lab — company-name typography exploration · {today} · symbols are
            Concepts 33 and 34, unchanged
          </footer>
        </div>
      </div>
    )
  }
)
