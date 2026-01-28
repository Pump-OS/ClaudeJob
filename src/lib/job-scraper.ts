import { JobListing, JobPlatform } from './types'

// Job search keywords for AI/Technical Assistant positions
const SEARCH_KEYWORDS = [
  'technical assistant remote',
  'virtual assistant remote',
  'AI assistant remote',
  'administrative assistant remote',
  'research assistant remote',
  'data entry assistant remote',
  'executive assistant remote',
  'digital assistant remote'
]

interface ScrapedJob {
  title: string
  company: string
  location: string
  description: string
  url: string
  salary?: string
  platform: JobPlatform
}

// RemoteOK API - Free, no auth required
async function searchRemoteOK(): Promise<ScrapedJob[]> {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'ClawdJob/1.0'
      }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    // Filter for assistant/support roles
    const assistantJobs = data
      .filter((job: Record<string, string>) => {
        if (!job.position) return false
        const title = job.position.toLowerCase()
        return title.includes('assistant') || 
               title.includes('support') || 
               title.includes('coordinator') ||
               title.includes('admin')
      })
      .slice(0, 10)
    
    return assistantJobs.map((job: Record<string, string>) => ({
      title: job.position,
      company: job.company || 'Unknown Company',
      location: job.location || 'Remote',
      description: job.description || '',
      url: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
      salary: job.salary,
      platform: 'remoteok' as JobPlatform
    }))
  } catch (error) {
    console.error('RemoteOK fetch error:', error)
    return []
  }
}

// Arbeitnow API - Free job board API
async function searchArbeitnow(): Promise<ScrapedJob[]> {
  try {
    const response = await fetch(
      'https://www.arbeitnow.com/api/job-board-api?search=assistant&remote=true',
      {
        headers: {
          'User-Agent': 'ClawdJob/1.0'
        }
      }
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data.data || []).slice(0, 10).map((job: Record<string, string>) => ({
      title: job.title,
      company: job.company_name || 'Unknown Company',
      location: job.location || 'Remote',
      description: job.description || '',
      url: job.url,
      platform: 'other' as JobPlatform
    }))
  } catch (error) {
    console.error('Arbeitnow fetch error:', error)
    return []
  }
}

// Jooble widget API
async function searchJooble(keyword: string): Promise<ScrapedJob[]> {
  try {
    // Jooble requires registration for API, so we'll simulate with a search URL
    // In production, you'd register for API access at https://jooble.org/api/about
    return []
  } catch (error) {
    console.error('Jooble fetch error:', error)
    return []
  }
}

// GitHub Jobs alternative - Authentic Jobs
async function searchAuthenticJobs(): Promise<ScrapedJob[]> {
  try {
    const response = await fetch('https://authenticjobs.com/api/?api_key=free&format=json&type=6', {
      headers: {
        'User-Agent': 'ClawdJob/1.0'
      }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return (data.listings?.listing || []).slice(0, 5).map((job: Record<string, any>) => {
      const company = typeof job.company === 'object' ? job.company : { name: job.company, location: job.location }
      return {
        title: job.title || '',
        company: company?.name || job.company || 'Unknown Company',
        location: company?.location || job.location || 'Remote',
        description: job.description || '',
        url: job.url || '',
        platform: 'other' as JobPlatform
      }
    })
  } catch (error) {
    console.error('AuthenticJobs fetch error:', error)
    return []
  }
}

// Convert scraped job to our JobListing format
function toJobListing(scraped: ScrapedJob): JobListing {
  return {
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: scraped.title,
    company: scraped.company,
    location: scraped.location,
    salary: scraped.salary,
    description: scraped.description.substring(0, 2000), // Limit description length
    requirements: extractRequirements(scraped.description),
    platform: scraped.platform,
    url: scraped.url,
    postedAt: new Date(),
    discoveredAt: new Date()
  }
}

// Extract requirements from job description
function extractRequirements(description: string): string[] {
  const requirements: string[] = []
  const lines = description.split(/[.\n]/)
  
  const keywords = [
    'required', 'must have', 'experience', 'skills', 'proficient',
    'knowledge of', 'familiar with', 'ability to', 'years of'
  ]
  
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (keywords.some(kw => lower.includes(kw)) && line.length > 20 && line.length < 200) {
      requirements.push(line.trim())
    }
  }
  
  return requirements.slice(0, 5)
}

// Main search function - aggregates from all sources
export async function searchJobs(): Promise<JobListing[]> {
  console.log('[JobScraper] Starting job search across platforms...')
  
  const results = await Promise.allSettled([
    searchRemoteOK(),
    searchArbeitnow(),
    searchAuthenticJobs()
  ])
  
  const allJobs: ScrapedJob[] = []
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value)
    }
  }
  
  console.log(`[JobScraper] Found ${allJobs.length} jobs total`)
  
  // Convert to JobListing and deduplicate by title+company
  const seen = new Set<string>()
  const uniqueJobs: JobListing[] = []
  
  for (const job of allJobs) {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`
    if (!seen.has(key)) {
      seen.add(key)
      uniqueJobs.push(toJobListing(job))
    }
  }
  
  return uniqueJobs
}

// Simulate finding a specific type of job (for demo purposes when APIs are unavailable)
export function generateMockJobs(count: number = 5): JobListing[] {
  const companies = [
    'TechCorp Solutions', 'Digital Ventures', 'CloudNine Systems', 'InnovateTech',
    'DataFlow Inc', 'RemoteFirst Co', 'Agile Dynamics', 'ByteWise',
    'Quantum Labs', 'NexGen Digital', 'Pixel Perfect', 'CodeCraft'
  ]
  
  const titles = [
    'Remote Technical Assistant',
    'Virtual Assistant - Tech Support',
    'AI Operations Assistant',
    'Digital Administrative Assistant',
    'Remote Research Assistant',
    'Technical Support Coordinator',
    'Executive Virtual Assistant',
    'Data Entry & Admin Assistant'
  ]
  
  const jobs: JobListing[] = []
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    
    jobs.push({
      id: `mock-${Date.now()}-${i}`,
      title,
      company,
      location: 'Remote',
      salary: `$${40 + Math.floor(Math.random() * 30)}k - $${70 + Math.floor(Math.random() * 30)}k/year`,
      description: `We are looking for a ${title} to join our growing team at ${company}. This is a fully remote position with flexible hours. The ideal candidate will have excellent communication skills, attention to detail, and experience with modern productivity tools.`,
      requirements: [
        'Excellent written and verbal communication',
        '2+ years of experience in similar role',
        'Proficiency with Google Workspace or Microsoft 365',
        'Strong organizational skills',
        'Ability to work independently'
      ],
      platform: 'other',
      url: `https://example.com/jobs/${i}`,
      postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      discoveredAt: new Date()
    })
  }
  
  return jobs
}

