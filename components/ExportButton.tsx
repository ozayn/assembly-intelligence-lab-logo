'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { ExportSheet } from './ExportSheet'

export function ExportButton() {
  const exportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!exportRef.current) return

    setIsExporting(true)
    try {
      // Temporarily make the export sheet visible for rendering
      const originalDisplay = exportRef.current.style.display
      const originalVisibility = exportRef.current.style.visibility
      exportRef.current.style.display = 'block'
      exportRef.current.style.visibility = 'visible'
      exportRef.current.style.position = 'fixed'
      exportRef.current.style.top = '0'
      exportRef.current.style.left = '0'
      exportRef.current.style.zIndex = '9999'

      // Wait for DOM and SVG components to render
      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      // Restore original display
      exportRef.current.style.display = originalDisplay
      exportRef.current.style.visibility = originalVisibility

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'AIL-logo-concepts-all.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isExporting}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          color: '#2d9cdb',
          backgroundColor: 'transparent',
          border: '1px solid #e0e0e0',
          borderRadius: '0.375rem',
          cursor: isExporting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: isExporting ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
            e.currentTarget.style.borderColor = '#2d9cdb'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = '#e0e0e0'
        }}
        title="Export all logo concepts as PNG"
      >
        {isExporting ? '⏳ Exporting...' : '📊 Export All'}
      </button>

      <ExportSheet ref={exportRef} title="Assembly Intelligence Lab — Logo Concepts" includeNames={true} />
    </>
  )
}
