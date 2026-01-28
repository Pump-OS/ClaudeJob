import Anthropic from '@anthropic-ai/sdk'
import { generateAgentIdentity, generateCoverLetter, generateResume } from './agent-identity'
import { JobListing, Application, ActivityLog } from './types'
import { 
  saveApplication, 
  addActivityLog, 
  saveDiscoveredJob,
  setAgentState,
  getApplications 
} from './storage'
import { searchJobs, generateMockJobs } from './job-scraper'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

const agent = generateAgentIdentity(42)

export function getAgent() {
  return agent
}

// Log activity and return it
function log(
  type: ActivityLog['type'], 
  message: string, 
  details?: Record<string, unknown>
): ActivityLog {
  return addActivityLog({
    agentId: agent.id,
    type,
    message,
    details,
    timestamp: new Date()
  })
}

// Analyze a job posting to determine fit
async function analyzeJobFit(job: JobListing): Promise<{
  score: number
  reasons: string[]
  shouldApply: boolean
}> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Demo mode - random analysis
    const score = 60 + Math.floor(Math.random() * 35)
    return {
      score,
      reasons: ['Good match for remote work', 'Skills align with requirements'],
      shouldApply: score > 70
    }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Analyze this job posting for fit with a candidate who has these skills: ${agent.skills.join(', ')}.

Job Title: ${job.title}
Company: ${job.company}
Description: ${job.description}

Respond in JSON format:
{
  "score": <0-100>,
  "reasons": ["reason1", "reason2"],
  "shouldApply": true/false
}

Only respond with valid JSON, no other text.`
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return JSON.parse(text)
  } catch (error) {
    console.error('Error analyzing job:', error)
    return {
      score: 75,
      reasons: ['Unable to analyze, applying based on keyword match'],
      shouldApply: true
    }
  }
}

// Generate a personalized cover letter using Claude
async function generatePersonalizedCoverLetter(job: JobListing): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Demo mode - use template
    return generateCoverLetter(agent, {
      title: job.title,
      company: job.company,
      description: job.description
    })
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Write a professional cover letter for the following job application.

Applicant: ${agent.name}
Email: ${agent.email}
Skills: ${agent.skills.join(', ')}
Experience: ${agent.yearsExperience} years

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description}

Write a compelling, personalized cover letter. Be professional but show personality. Keep it concise (under 300 words).`
      }]
    })

    return response.content[0].type === 'text' ? response.content[0].text : ''
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return generateCoverLetter(agent, {
      title: job.title,
      company: job.company,
      description: job.description
    })
  }
}

// Create an application
async function createApplication(job: JobListing): Promise<Application> {
  log('application_started', `Starting application for ${job.title} at ${job.company}`)
  
  log('cover_letter_generated', 'Generating personalized cover letter...')
  const coverLetter = await generatePersonalizedCoverLetter(job)
  
  const application: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId: agent.id,
    jobId: job.id,
    job,
    status: 'applied',
    coverLetter,
    appliedAt: new Date()
  }
  
  saveApplication(application)
  
  log('application_submitted', `Application submitted for ${job.title} at ${job.company}`, {
    applicationId: application.id,
    jobId: job.id
  })
  
  return application
}

// Main job hunting cycle
export async function runJobHuntingCycle(): Promise<{
  jobsFound: number
  applicationsSubmitted: number
  logs: ActivityLog[]
}> {
  const cycleLogs: ActivityLog[] = []
  
  setAgentState({ status: 'searching', currentTask: 'Searching for new job listings...' })
  cycleLogs.push(log('search_started', 'Starting new job search cycle...'))
  
  // Search for jobs
  let jobs: JobListing[]
  try {
    jobs = await searchJobs()
    if (jobs.length === 0) {
      // Use mock data if no real jobs found
      jobs = generateMockJobs(5)
      cycleLogs.push(log('thinking', 'No live jobs found, using demo data for testing'))
    }
  } catch (error) {
    jobs = generateMockJobs(5)
    cycleLogs.push(log('error', 'Error fetching jobs, using demo data'))
  }
  
  cycleLogs.push(log('job_found', `Found ${jobs.length} potential job listings`))
  
  // Get existing applications to avoid duplicates
  const existingApps = getApplications()
  const appliedUrls = new Set(existingApps.map(a => a.job.url))
  
  // Filter out already applied jobs
  const newJobs = jobs.filter(j => !appliedUrls.has(j.url))
  
  if (newJobs.length === 0) {
    cycleLogs.push(log('thinking', 'No new jobs to apply to - all listings already processed'))
    setAgentState({ status: 'idle', currentTask: 'Waiting for new listings...' })
    return { jobsFound: jobs.length, applicationsSubmitted: 0, logs: cycleLogs }
  }
  
  setAgentState({ status: 'applying', currentTask: 'Analyzing job listings...' })
  
  let applicationsSubmitted = 0
  
  // Process each new job
  for (const job of newJobs.slice(0, 3)) { // Limit to 3 applications per cycle
    saveDiscoveredJob(job)
    
    cycleLogs.push(log('job_analyzed', `Analyzing: ${job.title} at ${job.company}`))
    
    const analysis = await analyzeJobFit(job)
    
    if (analysis.shouldApply) {
      cycleLogs.push(log('thinking', `Good fit (score: ${analysis.score}/100) - preparing application`))
      
      try {
        await createApplication(job)
        applicationsSubmitted++
        cycleLogs.push(log('application_submitted', `✓ Applied to ${job.title} at ${job.company}`))
      } catch (error) {
        cycleLogs.push(log('error', `Failed to submit application: ${error}`))
      }
    } else {
      cycleLogs.push(log('thinking', `Skipping (score: ${analysis.score}/100) - ${analysis.reasons[0]}`))
    }
    
    // Small delay between applications
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  setAgentState({ status: 'waiting', currentTask: 'Waiting for responses...' })
  cycleLogs.push(log('status_update', `Cycle complete: ${applicationsSubmitted} applications submitted`))
  
  return {
    jobsFound: jobs.length,
    applicationsSubmitted,
    logs: cycleLogs
  }
}

// Get agent's current status and thinking
export async function getAgentThoughts(): Promise<string> {
  const apps = getApplications()
  const pending = apps.filter(a => a.status === 'applied').length
  const interviews = apps.filter(a => a.status === 'interview_scheduled').length
  
  const thoughts = [
    `Currently tracking ${apps.length} applications.`,
    pending > 0 ? `Waiting on ${pending} responses.` : '',
    interviews > 0 ? `${interviews} interview(s) scheduled!` : '',
    'Continuously searching for new opportunities...'
  ].filter(Boolean).join(' ')
  
  return thoughts
}

export { agent, generateResume }

