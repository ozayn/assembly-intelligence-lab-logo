import type { Metadata } from 'next'
import {
  IBM_Plex_Sans,
  Newsreader,
  Space_Mono,
  Jost,
  Space_Grotesk,
  Archivo,
  Inter,
} from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ReviewerProvider } from '@/components/ReviewerContext'
import { PasswordGate } from '@/components/PasswordGate'
import './globals.css'
import './password-gate.css'

// Loaded for the wordmark typography exploration (components/typographySystems.ts).
// No font is being chosen here — all three remain equally available options.
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-ibm-plex-sans' })
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-newsreader' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-space-mono' })

// Candidates for the wordmark typography exploration at /typography-exploration.
// Loaded so that page compares real webfonts rather than fallbacks; none of
// them is wired into the production lockup default.
const jost = Jost({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-jost' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-space-grotesk' })
const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-archivo' })
const inter = Inter({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Assembly Intelligence Lab | Logo Exploration',
  description: 'Interactive logo concept exploration for Assembly Intelligence Lab',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        ibmPlexSans.variable,
        newsreader.variable,
        spaceMono.variable,
        jost.variable,
        spaceGrotesk.variable,
        archivo.variable,
        inter.variable,
      ].join(' ')}
    >
      <body>
        <ThemeProvider>
          <PasswordGate>
            <ReviewerProvider>
              {children}
            </ReviewerProvider>
          </PasswordGate>
        </ThemeProvider>
      </body>
    </html>
  )
}
