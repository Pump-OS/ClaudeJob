import { getSupabase, isSupabaseConfigured } from './supabase'

// Initialize database tables (Supabase version)
export async function initDatabase() {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, skipping database initialization')
    return
  }

  const supabase = getSupabase()
  if (!supabase) {
    console.log('Supabase client not available')
    return
  }

  try {
    // Check if tables exist by trying to query them
    const { error: appsError } = await supabase.from('applications').select('id').limit(1)
    const { error: logsError } = await supabase.from('activity_logs').select('id').limit(1)
    const { error: jobsError } = await supabase.from('discovered_jobs').select('id').limit(1)
    const { error: stateError } = await supabase.from('agent_state').select('agent_id').limit(1)

    if (appsError || logsError || jobsError || stateError) {
      console.warn('Some tables may not exist. Please run the SQL migration in Supabase dashboard.')
      console.warn('Errors:', { appsError, logsError, jobsError, stateError })
    } else {
      console.log('Database connection verified successfully')
    }
  } catch (error) {
    console.error('Error checking database:', error)
  }
}

// Call init on import (will run once per serverless function instance)
if (typeof window === 'undefined') {
  initDatabase().catch(console.error)
}
