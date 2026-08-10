import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const correctPassword = process.env.SITE_PASSWORD

    if (!correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Password not configured' },
        { status: 500 }
      )
    }

    const isCorrect = password === correctPassword

    return NextResponse.json({
      success: isCorrect,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
