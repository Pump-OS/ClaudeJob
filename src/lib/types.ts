export interface Agent {
  id: string
  name: string
  avatar: string
  personality: string
  skills: string[]
  status: 'idle' | 'searching' | 'applying' | 'waiting' | 'interviewing'
  createdAt: Date
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  description: string
  requirements: string[]
  platform: JobPlatform
  url: string
  postedAt: Date
  discoveredAt: Date
}

export interface Application {
  id: string
  agentId: string
  jobId: string
  job: JobListing
  status: ApplicationStatus
  coverLetter?: string
  appliedAt: Date
  responseAt?: Date
  responseMessage?: string
  interviewDate?: Date
  notes?: string
}

export type ApplicationStatus = 
  | 'applied'
  | 'viewed'
  | 'in_review'
  | 'interview_scheduled'
  | 'interviewed'
  | 'offer_received'
  | 'rejected'
  | 'withdrawn'
  | 'no_response'

export type JobPlatform = 
  | 'linkedin'
  | 'indeed'
  | 'glassdoor'
  | 'remoteok'
  | 'weworkremotely'
  | 'flexjobs'
  | 'upwork'
  | 'wellfound'
  | 'dice'
  | 'monster'
  | 'other'

export interface ActivityLog {
  id: string
  agentId: string
  type: ActivityType
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

export type ActivityType = 
  | 'search_started'
  | 'job_found'
  | 'job_analyzed'
  | 'application_started'
  | 'cover_letter_generated'
  | 'application_submitted'
  | 'email_sent'
  | 'email_received'
  | 'status_update'
  | 'interview_scheduled'
  | 'error'
  | 'thinking'

export interface AgentStats {
  totalApplications: number
  pending: number
  inReview: number
  interviews: number
  offers: number
  rejections: number
  noResponse: number
  successRate: number
}

export interface LiveFeedItem {
  id: string
  type: ActivityType
  message: string
  timestamp: Date
  highlight?: boolean
}

