import { createClient } from '@supabase/supabase-js'
import { Analysis } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Save analysis to database
export async function saveAnalysis(analysis: Omit<Analysis, 'id' | 'created_at'>) {
  const { data, error } = await supabaseAdmin
    .from('analizler')
    .insert([analysis])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user's analysis history
export async function getUserAnalyses(userId: string, limit = 50) {
  const { data, error } = await supabaseAdmin
    .from('analizler')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// Get single analysis by ID
export async function getAnalysisById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('analizler')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Get user's subscription
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('abonelikler')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Update user subscription (requires Stripe webhook - placeholder)
export async function updateSubscription(userId: string, plan: 'free' | 'premium') {
  const { data, error } = await supabaseAdmin
    .from('abonelikler')
    .upsert([
      {
        user_id: userId,
        plan,
        status: 'active',
        expires_at: plan === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}
