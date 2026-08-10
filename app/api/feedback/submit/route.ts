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
      emailContent += `Concept ${feedback.conceptId}: ${feedback.conceptName}\n`
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
    // Note: Formspree requires an email field for notifications
    // Using noreply as sender since we don't collect user emails
    const formspreeData = {
      email: 'noreply@assemblylablogo.local',
      name: reviewer_name,
      message: emailContent,
      _subject: `Logo Feedback from ${reviewer_name}`,
      _replyto: 'feedback@assemblylablogo.test',
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formspreeData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Formspree error:', response.status, responseData)
      return NextResponse.json(
        { error: 'Failed to submit feedback', details: responseData },
        { status: 500 }
      )
    }

    console.log('Feedback submitted to Formspree successfully:', responseData)
    return NextResponse.json({ success: true, formspreeResponse: responseData })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
