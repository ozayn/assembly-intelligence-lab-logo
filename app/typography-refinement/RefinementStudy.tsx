'use client'

import { DirectionBlock } from './DirectionBlock'
import { RefinementLockup } from './RefinementLockup'
import { DIRECTIONS, D_CANDIDATES } from './directions'
import { DERIVED, REFERENCES, SYMBOLS, TARGET, TREATMENTS } from './reference'

const FINALISTS = [
  {
    heading: 'Concept 33 — Faceted A',
    pick: 'A · Jost 400 · navy + teal',
    body: 'B was built for this pairing on the theory that the heaviest symbol in the set needs a quieter wordmark, and the rendering says the opposite. At these proportions the wordmark is already small and tracked to half an em, so its overall colour is light before any weight is removed; taking ASSEMBLY to 300 turns it from a partner into a caption under those four saturated planes. Jost at 400 holds, and its geometric skeleton — pointed A, circular S — echoes the straight-edged facets.',
    runnerUp: 'Runner-up: D. Inter carries more presence per glyph at 300, but it does not answer the symbol’s geometry the way Jost does.',
  },
  {
    heading: 'Concept 34 — Hexagonal A',
    pick: 'A · Jost 400 · navy + teal',
    body: 'The hexagonal A has a narrower ink width than 33 (147 px against 162 px at the same symbol size), so its wordmark comes out around 9 per cent smaller and needs robustness rather than delicacy — which rules B out here for a different reason than it was ruled out above. Jost’s circular geometry sits well against the hexagons, and the wider symbol gap (1.15 caps against 0.90) keeps the type clear of the two detached lower modules without breaking the lockup.',
    runnerUp: 'Runner-up: D. Inter’s wider letterforms need less tracking (0.451 em against 0.492 em), so INTELLIGENCE LAB survives small sizes slightly better. Worth taking if the lockup has to work below about 120 px.',
  },
  {
    heading: 'One system for both',
    pick: 'A · Jost 400 · navy + teal',
    body: 'Nothing in the rendering supports splitting the typeface. The two symbols do need different treatment, but the differences that matter — symbol gap and the width the wordmark solves to — are already handled per symbol, and both land on the same font. C is the one clear elimination: IBM Plex Sans draws its capital I with crossbars, which changes the texture of a second line containing three I letters and two L letters, and its humanist letterforms drift from the reference skeleton.',
    runnerUp: 'On colour: navy + teal matches the references and is the recommendation. All navy is measurably safer on the second line at small sizes, where teal at this tracking starts to go faint — worth keeping as the small-use alternate.',
  },
]

interface RefinementStudyProps {
  /** Rendered size of the symbol inside each lockup. */
  symbolPx?: number
}

export function RefinementStudy({ symbolPx = 230 }: RefinementStudyProps) {
  const blockWidth = DERIVED.find(d => d.key === 'blockwidth')

  return (
    <>
      <section className="rf-section">
        <h2>1 · The measured reference</h2>
        <p className="rf-note">
          Ink bounds of the symbol and of each text line, read off the 1024 px sources. The two
          references are not one system: the faceted lockup sets both lines to the same width and
          keeps line 2 relatively large, while the hexagonal one tracks much wider, shrinks line 2
          further and lets it run short. Where they disagree the target takes the midpoint.
        </p>
        <div className="rf-reference-row">
          {REFERENCES.map(reference => (
            <figure className="rf-reference" key={reference.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reference.image} alt={reference.label} />
              <figcaption>
                {reference.label} · measured against Concept {reference.pairedWith}
              </figcaption>
            </figure>
          ))}
        </div>
        <table className="rf-table">
          <thead>
            <tr>
              <th>Relationship</th>
              <th>Faceted reference</th>
              <th>Hexagonal reference</th>
              <th>Target used here</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {DERIVED.map(row => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                <td>{row.faceted}</td>
                <td>{row.hexagonal}</td>
                <td className="rf-target">{row.target}</td>
                <td className="rf-table-note">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="rf-note">
          Two deliberate departures. Both references place the wordmark wider than the symbol (
          {blockWidth?.faceted} and {blockWidth?.hexagonal} times its ink width); the brief caps
          that at 1.00, so {TARGET.widthFactor} is used throughout. And the symbol gap is split per
          symbol rather than averaged — tighter under 33, airier under 34 — which is the opposite
          of what the two references happen to do.
        </p>
      </section>

      <section className="rf-section">
        <h2>2 · Deciding direction D</h2>
        <p className="rf-note">
          The brief allows either Inter or Space Grotesk for the modern slot. Both are shown at
          identical proportions, so the letterforms are the only difference.
        </p>
        <div className="rf-pair rf-pair-wide">
          {D_CANDIDATES.map(candidate => (
            <RefinementLockup
              key={candidate.fontLabel}
              symbol={SYMBOLS[0]}
              direction={candidate}
              treatment={TREATMENTS[0]}
              symbolPx={symbolPx}
              caption={candidate.fontLabel}
            />
          ))}
        </div>
        <p className="rf-note">
          Inter takes the slot. At this tracking Space Grotesk&rsquo;s narrower, squared-off
          letterforms and its distinctive G and S read as a deliberate tech voice, which is the
          different branding direction the brief rules out. Inter modernises A without announcing
          itself.
        </p>
      </section>

      <section className="rf-section">
        <h2>3 · Four refinements</h2>
        <p className="rf-note">
          Each direction against both symbols, in navy + teal and all navy. Size, line gap and
          symbol gap are derived from the targets above, so the numbers under each pair are solved
          rather than chosen. One consequence to note: matching the reference means INTELLIGENCE
          LAB lands at roughly half the cap height of ASSEMBLY and over half an em of tracking, so
          it is deliberately small. It reads at the sizes shown here and above, and starts to
          thin out below them.
        </p>
        {DIRECTIONS.map(direction => (
          <div className="rf-direction" key={direction.id}>
            <div className="rf-direction-head">
              <span className="rf-badge">{direction.id}</span>
              <h3>{direction.name}</h3>
              <em>{direction.fontLabel}</em>
              <p>{direction.note}</p>
            </div>
            <div className="rf-grid">
              {SYMBOLS.map(symbol => (
                <DirectionBlock
                  key={symbol.id}
                  direction={direction}
                  symbol={symbol}
                  symbolPx={symbolPx}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rf-section">
        <h2>4 · Recommended finalists</h2>
        <div className="rf-finalists">
          {FINALISTS.map(finalist => (
            <div className="rf-finalist" key={finalist.heading}>
              <h3>{finalist.heading}</h3>
              <p className="rf-pick">{finalist.pick}</p>
              <p>{finalist.body}</p>
              <p className="rf-runner-up">{finalist.runnerUp}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
