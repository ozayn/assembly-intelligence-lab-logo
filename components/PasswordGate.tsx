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
    const checkAuth = () => {
      if (typeof window === 'undefined') return false
      // Check for auth marker cookie (client-readable marker for httpOnly session cookie)
      const cookies = document.cookie.split(';')
      return cookies.some(cookie => cookie.trim().startsWith('_auth_marker='))
    }
    setIsAuthenticated(checkAuth())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include', // Include cookies in request
      })

      const data = await response.json()

      if (data.success) {
        // Server has set the auth marker cookie; check for it
        const cookies = document.cookie.split(';')
        const isAuthCookieSet = cookies.some(cookie => cookie.trim().startsWith('_auth_marker='))
        if (isAuthCookieSet) {
          setIsAuthenticated(true)
          setPassword('')
        } else {
          setError('Authentication failed. Please try again.')
        }
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
