import { Application, ActivityLog, JobListing, AgentStats } from './types'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
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
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}

// Applications
export function getApplications(): Application[] {
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

export function saveApplication(application: Application): void {
  const apps = readJsonFile<Application[]>('applications.json', [])
  const existingIndex = apps.findIndex(a => a.id === application.id)
  
  if (existingIndex >= 0) {
    apps[existingIndex] = application
  } else {
    apps.push(application)
  }
  
  writeJsonFile('applications.json', apps)
}

export function updateApplicationStatus(
  applicationId: string, 
  status: Application['status'],
  responseMessage?: string
): Application | null {
  const apps = getApplications()
  const app = apps.find(a => a.id === applicationId)
  
  if (app) {
    app.status = status
    app.responseAt = new Date()
    if (responseMessage) {
      app.responseMessage = responseMessage
    }
    saveApplication(app)
    return app
  }
  
  return null
}

// Activity Logs
export function getActivityLogs(limit: number = 100): ActivityLog[] {
  const logs = readJsonFile<ActivityLog[]>('activity_logs.json', [])
  return logs
    .map(log => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

export function addActivityLog(log: Omit<ActivityLog, 'id'>): ActivityLog {
  const logs = readJsonFile<ActivityLog[]>('activity_logs.json', [])
  // Generate more unique ID with timestamp, random string and counter
  const counter = logs.length
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${counter}`
  }
  
  logs.push(newLog)
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000)
  }
  
  writeJsonFile('activity_logs.json', logs)
  return newLog
}

// Jobs
export function getDiscoveredJobs(): JobListing[] {
  const jobs = readJsonFile<JobListing[]>('discovered_jobs.json', [])
  return jobs.map(job => ({
    ...job,
    postedAt: new Date(job.postedAt),
    discoveredAt: new Date(job.discoveredAt)
  }))
}

export function saveDiscoveredJob(job: JobListing): void {
  const jobs = readJsonFile<JobListing[]>('discovered_jobs.json', [])
  const existingIndex = jobs.findIndex(j => j.id === job.id || j.url === job.url)
  
  if (existingIndex < 0) {
    jobs.push(job)
    writeJsonFile('discovered_jobs.json', jobs)
  }
}

// Stats
export function calculateStats(agentId: string): AgentStats {
  const apps = getApplications().filter(a => a.agentId === agentId)
  
  const stats: AgentStats = {
    totalApplications: apps.length,
    pending: apps.filter(a => a.status === 'applied' || a.status === 'viewed').length,
    inReview: apps.filter(a => a.status === 'in_review').length,
    interviews: apps.filter(a => 
      a.status === 'interview_scheduled' || a.status === 'interviewed'
    ).length,
    offers: apps.filter(a => a.status === 'offer_received').length,
    rejections: apps.filter(a => a.status === 'rejected').length,
    noResponse: apps.filter(a => a.status === 'no_response').length,
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

export function getAgentState(): AgentState {
  return readJsonFile<AgentState>('agent_state.json', {
    status: 'idle',
    lastActive: new Date()
  })
}

export function setAgentState(state: Partial<AgentState>): void {
  const current = getAgentState()
  writeJsonFile('agent_state.json', {
    ...current,
    ...state,
    lastActive: new Date()
  })
}

