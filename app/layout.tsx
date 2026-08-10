import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ReviewerProvider } from '@/components/ReviewerContext'
import { PasswordGate } from '@/components/PasswordGate'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
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
