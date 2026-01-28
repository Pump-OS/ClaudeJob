// Database initialization for Supabase
// Tables are created via SQL in Supabase dashboard

import { getSupabase, isSupabaseConfigured } from './supabase'

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured')
    return false
  }

  const supabase = getSupabase()
  if (!supabase) {
    console.log('Supabase client not available')
    return false
  }

  try {
    const { error } = await supabase.from('agent_state').select('agent_id').limit(1)
    if (error) {
      console.warn('Database check failed:', error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('Error checking database:', error)
    return false
  }
}
