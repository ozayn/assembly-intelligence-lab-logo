'use client'

import { useState, useEffect } from 'react'

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Check authentication on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('_auth') : null
    setIsAuthenticated(stored === 'true')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem('_auth', 'true')
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError('Incorrect password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="pwd-gate-outer">
        <div className="pwd-gate-inner">
          <h1>Assembly Intelligence Lab</h1>
          <p>Identity Exploration — Private Review</p>

          <form onSubmit={handleSubmit} className="pwd-gate-form">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pwd-gate-input"
              autoFocus
            />
            <button type="submit" className="pwd-gate-button">
              Enter Review
            </button>
          </form>

          {error && <p className="pwd-gate-error">{error}</p>}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
