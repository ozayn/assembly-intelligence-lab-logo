import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Supabase credentials not configured. Feedback system will not work until configured.')
  }
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
)

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
)

export interface LogoFeedback {
  id?: string
  round: number
  reviewer_name: string
  concept_id: number
  like_static: boolean
  like_animation: boolean
  tags: string[]
  comment: string
  created_at?: string
}
