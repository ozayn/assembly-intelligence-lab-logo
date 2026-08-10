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

    const response = NextResponse.json({
      success: isCorrect,
    })

    // Set authentication cookies if password is correct
    if (isCorrect) {
      // HttpOnly cookie for secure server-side validation
      response.cookies.set('_auth_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })

      // Non-HttpOnly marker cookie for client-side detection
      response.cookies.set('_auth_marker', 'true', {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
    }

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
