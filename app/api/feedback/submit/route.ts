import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Feedback system is not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    const { supabase } = await import('@/lib/supabase')

    const body = await request.json()
    const { round = 1, reviewer_name, feedbacks } = body

    if (!reviewer_name || !feedbacks || feedbacks.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const records = feedbacks.map((feedback: any) => ({
      round,
      reviewer_name,
      concept_id: feedback.conceptId,
      like_static: feedback.likeStatic,
      like_animation: feedback.likeAnimation,
      tags: feedback.tags || [],
      comment: feedback.comment || '',
    }))

    const { error } = await supabase
      .from('logo_feedback')
      .insert(records)

    if (error) {
      console.error('Supabase error:', error)
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
