import { NextRequest, NextResponse } from 'next/server'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meajayba'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewer_name, feedbacks } = body

    if (!reviewer_name || !feedbacks || feedbacks.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format feedback for email
    let emailContent = `New Logo Feedback Submission\n\n`
    emailContent += `Reviewer: ${reviewer_name}\n`
    emailContent += `Timestamp: ${new Date().toISOString()}\n\n`
    emailContent += `---\n\n`

    feedbacks.forEach((feedback: any) => {
      emailContent += `Concept ${feedback.conceptId}:\n`
      emailContent += `  Static Logo Like: ${feedback.likeStatic ? 'Yes' : 'No'}\n`
      emailContent += `  Animation Like: ${feedback.likeAnimation ? 'Yes' : 'No'}\n`

      if (feedback.tags && feedback.tags.length > 0) {
        emailContent += `  Tags: ${feedback.tags.join(', ')}\n`
      }

      if (feedback.comment) {
        emailContent += `  Comment: ${feedback.comment}\n`
      }

      emailContent += `\n`
    })

    // Submit to Formspree
    const formspreeData = {
      email: reviewer_name,
      message: emailContent,
      _subject: `Logo Feedback from ${reviewer_name}`,
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formspreeData),
    })

    if (!response.ok) {
      console.error('Formspree error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
