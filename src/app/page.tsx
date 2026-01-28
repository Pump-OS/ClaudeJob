'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { AgentCard } from '@/components/AgentCard'
import { StatsPanel } from '@/components/StatsPanel'
import { LiveFeed } from '@/components/LiveFeed'
import { ApplicationList } from '@/components/ApplicationList'
import { AboutSection } from '@/components/AboutSection'
import { HowItWorksSection } from '@/components/HowItWorksSection'
import { HelpClawdjobForm } from '@/components/HelpClawdjobForm'
import { ActivityLog, Application, AgentStats } from '@/lib/types'

interface AgentData {
  agent: {
    name: string
    avatar: string
    skills: string[]
    personality: string
    status: string
    currentTask?: string
  }
  stats: AgentStats
  thoughts: string
}

// Интервал между циклами поиска работы (в мс)
const HUNT_INTERVAL = 60000 // 1 минута
const POLL_INTERVAL = 5000  // 5 секунд для обновления UI

export default function Home() {
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isHunting, setIsHunting] = useState(false)
  const huntingRef = useRef(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showHelpForm, setShowHelpForm] = useState(false)

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      const [agentRes, appsRes, logsRes] = await Promise.all([
        fetch('/api/agent'),
        fetch('/api/applications'),
        fetch('/api/activity?limit=50')
      ])

      if (agentRes.ok) {
        const data = await agentRes.json()
        setAgentData(data)
      }

      if (appsRes.ok) {
        const data = await appsRes.json()
        setApplications(data.applications || [])
      }

      if (logsRes.ok) {
        const data = await logsRes.json()
        setActivityLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  // Run a single job hunting cycle
  const runHuntCycle = useCallback(async () => {
    if (huntingRef.current) return // Prevent overlapping cycles
    
    huntingRef.current = true
    setIsHunting(true)

    try {
      const response = await fetch('/api/hunt', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Hunt cycle complete:', data)
        
        if (data.logs) {
          setActivityLogs(prev => [...data.logs, ...prev].slice(0, 50))
        }
      }
    } catch (error) {
      console.error('Error running job hunt:', error)
    } finally {
      huntingRef.current = false
      setIsHunting(false)
      await fetchData()
    }
  }, [fetchData])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Autonomous job hunting - runs on interval
  useEffect(() => {
    // Start first hunt cycle after 3 seconds
    const initialTimeout = setTimeout(() => {
      runHuntCycle()
    }, 3000)

    // Then run every HUNT_INTERVAL
    const huntInterval = setInterval(() => {
      runHuntCycle()
    }, HUNT_INTERVAL)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(huntInterval)
    }
  }, [runHuntCycle])

  // Polling for UI updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchData()
    }, POLL_INTERVAL)

    return () => clearInterval(pollInterval)
  }, [fetchData])

  // Default stats if not loaded
  const defaultStats: AgentStats = {
    totalApplications: 0,
    pending: 0,
    inReview: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
    noResponse: 0,
    successRate: 0
  }

  const defaultAgent = {
    name: 'Loading...',
    avatar: '',
    skills: [],
    personality: '',
    status: 'idle',
    currentTask: undefined
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onAboutClick={() => setShowAbout(true)}
        onHowItWorksClick={() => setShowHowItWorks(true)}
        onHelpClick={() => setShowHelpForm(true)}
      />
      
      <AboutSection isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <HowItWorksSection isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <HelpClawdjobForm isOpen={showHelpForm} onClose={() => setShowHelpForm(false)} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div className="flex justify-center mb-6">
            <h1 className="pixel-letters ml-6 md:ml-8">
              CLAUDEJOB
            </h1>
          </motion.div>
          <p className="text-coal-lighter max-w-2xl mx-auto">
            Watch an AI agent search for real job opportunities and submit applications 
            in real-time. An experiment in autonomous job hunting.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column - Agent Info */}
          <div className="flex flex-col gap-6">
            <AgentCard 
              agent={agentData?.agent || defaultAgent}
              thoughts={agentData?.thoughts || 'Initializing agent...'}
            />
            <StatsPanel stats={agentData?.stats || defaultStats} />
          </div>

          {/* Center Column - Live Feed */}
          <div className="lg:col-span-1">
            <LiveFeed 
              logs={activityLogs}
              isLive={isHunting}
            />
          </div>

          {/* Right Column - Applications */}
          <div>
            <ApplicationList applications={applications} />
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-coal-lighter text-sm">
            Powered by Claude
          </p>
        </motion.div>
      </main>
    </div>
  )
}
