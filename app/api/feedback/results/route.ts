import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const round = searchParams.get('round') || '1'

    const { data, error } = await supabase
      .from('logo_feedback')
      .select('*')
      .eq('round', parseInt(round))
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      )
    }

    const results = {
      round: parseInt(round),
      total_feedbacks: data?.length || 0,
      unique_reviewers: [...new Set(data?.map((f: any) => f.reviewer_name) || [])],
      feedbacks: data || [],
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
