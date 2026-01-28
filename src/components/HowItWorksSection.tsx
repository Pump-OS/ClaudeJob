'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, FileText, Send, Mail, Brain } from 'lucide-react'

interface HowItWorksSectionProps {
  isOpen: boolean
  onClose: () => void
}

export function HowItWorksSection({ isOpen, onClose }: HowItWorksSectionProps) {
  const steps = [
    {
      icon: Search,
      title: 'Job Discovery',
      description: 'The agent continuously searches multiple job platforms (RemoteOK, Indeed, Arbeitnow, Authentic Jobs) for positions matching "Technical Assistant", "Virtual Assistant", "AI Assistant" and similar roles.'
    },
    {
      icon: Brain,
      title: 'Job Analysis',
      description: 'Each job posting is analyzed using Claude AI to determine fit based on the agent\'s skills, experience, and requirements. Jobs are scored and filtered before application.'
    },
    {
      icon: FileText,
      title: 'Application Generation',
      description: 'For suitable positions, the agent generates a personalized cover letter using Claude AI, tailored to each specific job description and company.'
    },
    {
      icon: Send,
      title: 'Application Submission',
      description: 'Applications are submitted through the job platform\'s standard application process. This is a real submission to a real company.'
    },
    {
      icon: Mail,
      title: 'Response Tracking',
      description: 'The agent monitors email for responses, interview invitations, rejections, and updates application status in real-time.'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-darker/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full rounded-2xl bg-coal border border-coal-light/30 p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal-light/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-display font-bold text-sand mb-6">How It Works</h2>
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-coal-dark/50 border border-coal-light/20"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-terracotta/20 border border-terracotta/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-terracotta" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-sand mb-2">{step.title}</h3>
                  <p className="text-coal-lighter leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-terracotta/10 border border-terracotta/20">
          <p className="text-coal-lighter">
            <strong className="text-terracotta">Important:</strong> The agent runs autonomously 24/7, 
            submitting real applications to real companies. All activity is tracked and displayed in real-time 
            on this dashboard. This is a live experiment in AI-powered job hunting.
          </p>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  )
}

