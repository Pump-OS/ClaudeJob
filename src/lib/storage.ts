import { Application, ActivityLog, JobListing, AgentStats } from './types'
import { getSupabase, isSupabaseConfigured } from './supabase'

const USE_DATABASE = isSupabaseConfigured()

function getDb() {
  return getSupabase()
}

// File-based storage (for local dev without database)
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!USE_DATABASE && typeof window === 'undefined' && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  if (USE_DATABASE || typeof window !== 'undefined') return defaultValue
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
  }
  return defaultValue
}

function writeJsonFile<T>(filename: string, data: T): void {
  if (USE_DATABASE || typeof window !== 'undefined') return
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}

// Applications
export async function getApplications(): Promise<Application[]> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return []
      
      const { data: rows, error } = await db
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching applications:', error)
        return []
      }

      if (!rows) return []

      return rows.map(row => ({
        id: row.id,
        agentId: row.agent_id,
        jobId: row.job_id,
        job: {
          id: row.job_id,
          title: row.job_title,
          company: row.job_company,
          location: row.job_location,
          url: row.job_url,
          description: row.job_description || '',
          requirements: row.job_data?.requirements || [],
          platform: row.job_data?.platform || 'other',
          salary: row.job_data?.salary,
          postedAt: new Date(row.job_data?.posted_at || Date.now()),
          discoveredAt: new Date(row.job_data?.discovered_at || Date.now())
        },
        status: row.status as Application['status'],
        coverLetter: row.cover_letter,
        appliedAt: new Date(row.applied_at),
        responseAt: row.response_at ? new Date(row.response_at) : undefined,
        responseMessage: row.response_message,
        interviewDate: row.interview_date ? new Date(row.interview_date) : undefined,
        notes: row.job_data?.notes
      }))
    } catch (error) {
      console.error('Error fetching applications from database:', error)
      return []
    }
  }

  const apps = readJsonFile<Application[]>('applications.json', [])
  return apps.map(app => ({
    ...app,
    appliedAt: new Date(app.appliedAt),
    responseAt: app.responseAt ? new Date(app.responseAt) : undefined,
    interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
    job: {
      ...app.job,
      postedAt: new Date(app.job.postedAt),
      discoveredAt: new Date(app.job.discoveredAt)
    }
  }))
}

export async function saveApplication(application: Application): Promise<void> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) throw new Error('Database not configured')
      
      const { error } = await db
        .from('applications')
        .upsert({
          id: application.id,
          agent_id: application.agentId,
          job_id: application.jobId,
          job_title: application.job.title,
          job_company: application.job.company,
          job_location: application.job.location,
          job_url: application.job.url,
          job_description: application.job.description,
          status: application.status,
          applied_at: application.appliedAt.toISOString(),
          response_at: application.responseAt?.toISOString() || null,
          response_message: application.responseMessage || null,
          interview_date: application.interviewDate?.toISOString() || null,
          cover_letter: application.coverLetter || null,
          job_data: {
            requirements: application.job.requirements,
            platform: application.job.platform,
            salary: application.job.salary,
            posted_at: application.job.postedAt.toISOString(),
            discovered_at: application.job.discoveredAt.toISOString(),
            notes: application.notes
          }
        }, { onConflict: 'id' })

      if (error) {
        console.error('Supabase error saving application:', error)
        throw error
      }
      return
    } catch (error) {
      console.error('Error saving application to database:', error)
      throw error
    }
  }

  const apps = readJsonFile<Application[]>('applications.json', [])
  const existingIndex = apps.findIndex(a => a.id === application.id)
  
  if (existingIndex >= 0) {
    apps[existingIndex] = application
  } else {
    apps.push(application)
  }
  
  writeJsonFile('applications.json', apps)
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: Application['status'],
  responseMessage?: string
): Promise<Application | null> {
  const apps = await getApplications()
  const app = apps.find(a => a.id === applicationId)
  
  if (app) {
    app.status = status
    app.responseAt = new Date()
    if (responseMessage) {
      app.responseMessage = responseMessage
    }
    await saveApplication(app)
    return app
  }
  
  return null
}

// Activity Logs
export async function getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return []
      
      const { data: rows, error } = await db
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Supabase error fetching activity logs:', error)
        return []
      }

      if (!rows) return []

      return rows.map(row => ({
        id: row.id,
        agentId: row.agent_id,
        type: row.type as ActivityLog['type'],
        message: row.message,
        details: row.metadata || {},
        timestamp: new Date(row.timestamp)
      }))
    } catch (error) {
      console.error('Error fetching activity logs from database:', error)
      return []
    }
  }

  const logs = readJsonFile<ActivityLog[]>('activity_logs.json', [])
  return logs
    .map(log => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

export async function addActivityLog(log: Omit<ActivityLog, 'id'>): Promise<ActivityLog> {
  const counter = Date.now()
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${counter}`
  }

  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return newLog
      
      const { error } = await db
        .from('activity_logs')
        .insert({
          id: newLog.id,
          agent_id: newLog.agentId,
          type: newLog.type,
          message: newLog.message,
          timestamp: newLog.timestamp.toISOString(),
          metadata: newLog.details || {}
        })

      if (error) {
        console.error('Supabase error saving activity log:', error)
      }
      
      return newLog
    } catch (error) {
      console.error('Error saving activity log to database:', error)
    }
  }

  const logs = readJsonFile<ActivityLog[]>('activity_logs.json', [])
  logs.push(newLog)
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000)
  }
  
  writeJsonFile('activity_logs.json', logs)
  return newLog
}

// Jobs
export async function getDiscoveredJobs(): Promise<JobListing[]> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return []
      
      const { data: rows, error } = await db
        .from('discovered_jobs')
        .select('*')
        .order('discovered_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching discovered jobs:', error)
        return []
      }

      if (!rows) return []

      return rows.map(row => ({
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        url: row.url,
        description: row.description || '',
        salary: row.salary,
        requirements: row.requirements || [],
        platform: row.platform as JobListing['platform'],
        postedAt: new Date(row.posted_at || row.discovered_at),
        discoveredAt: new Date(row.discovered_at)
      }))
    } catch (error) {
      console.error('Error fetching discovered jobs from database:', error)
      return []
    }
  }

  const jobs = readJsonFile<JobListing[]>('discovered_jobs.json', [])
  return jobs.map(job => ({
    ...job,
    postedAt: new Date(job.postedAt),
    discoveredAt: new Date(job.discoveredAt)
  }))
}

export async function saveDiscoveredJob(job: JobListing): Promise<void> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return
      
      const { error } = await db
        .from('discovered_jobs')
        .upsert({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          description: job.description,
          salary: job.salary || null,
          requirements: job.requirements,
          platform: job.platform,
          posted_at: job.postedAt.toISOString(),
          discovered_at: job.discoveredAt.toISOString(),
          job_data: job
        }, { onConflict: 'url', ignoreDuplicates: true })

      if (error && !error.message.includes('duplicate')) {
        console.error('Supabase error saving discovered job:', error)
      }
      return
    } catch (error) {
      console.error('Error saving discovered job to database:', error)
    }
  }

  const jobs = readJsonFile<JobListing[]>('discovered_jobs.json', [])
  const existingIndex = jobs.findIndex(j => j.id === job.id || j.url === job.url)
  
  if (existingIndex < 0) {
    jobs.push(job)
    writeJsonFile('discovered_jobs.json', jobs)
  }
}

// Stats
export async function calculateStats(agentId: string): Promise<AgentStats> {
  const apps = await getApplications()
  const filteredApps = apps.filter(a => a.agentId === agentId)
  
  const stats: AgentStats = {
    totalApplications: filteredApps.length,
    pending: filteredApps.filter(a => a.status === 'applied' || a.status === 'viewed').length,
    inReview: filteredApps.filter(a => a.status === 'in_review').length,
    interviews: filteredApps.filter(a => 
      a.status === 'interview_scheduled' || a.status === 'interviewed'
    ).length,
    offers: filteredApps.filter(a => a.status === 'offer_received').length,
    rejections: filteredApps.filter(a => a.status === 'rejected').length,
    noResponse: filteredApps.filter(a => a.status === 'no_response').length,
    successRate: 0
  }
  
  if (stats.totalApplications > 0) {
    stats.successRate = ((stats.interviews + stats.offers) / stats.totalApplications) * 100
  }
  
  return stats
}

// Agent State
interface AgentState {
  status: 'idle' | 'searching' | 'applying' | 'waiting' | 'interviewing'
  lastActive: Date
  currentTask?: string
}

export async function getAgentState(): Promise<AgentState> {
  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return readJsonFile<AgentState>('agent_state.json', { status: 'idle', lastActive: new Date() })
      
      const { data: rows, error } = await db
        .from('agent_state')
        .select('*')
        .eq('agent_id', 'default')
        .limit(1)

      if (error) {
        console.error('Supabase error fetching agent state:', error)
      }

      if (rows && rows.length > 0) {
        const row = rows[0]
        return {
          status: row.status as AgentState['status'],
          lastActive: new Date(row.last_active),
          currentTask: row.current_task || undefined
        }
      }
    } catch (error) {
      console.error('Error fetching agent state from database:', error)
    }
  }

  return readJsonFile<AgentState>('agent_state.json', {
    status: 'idle',
    lastActive: new Date()
  })
}

export async function setAgentState(state: Partial<AgentState>): Promise<void> {
  const current = await getAgentState()
  const newState = {
    ...current,
    ...state,
    lastActive: new Date()
  }

  if (USE_DATABASE) {
    try {
      const db = getDb()
      if (!db) return
      
      const { error } = await db
        .from('agent_state')
        .upsert({
          agent_id: 'default',
          status: newState.status,
          last_active: newState.lastActive.toISOString(),
          current_task: newState.currentTask || null,
          state_data: newState
        }, { onConflict: 'agent_id' })

      if (error) {
        console.error('Supabase error saving agent state:', error)
      }
      return
    } catch (error) {
      console.error('Error saving agent state to database:', error)
    }
  }

  writeJsonFile('agent_state.json', newState)
}
