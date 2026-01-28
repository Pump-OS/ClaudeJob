'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AboutSectionProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutSection({ isOpen, onClose }: AboutSectionProps) {
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
        className="relative max-w-3xl w-full rounded-2xl bg-coal border border-coal-light/30 p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal-light/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-display font-bold text-sand mb-6">About ClawdJob</h2>
        
        <div className="space-y-4 text-coal-lighter leading-relaxed">
          <p>
            <strong className="text-sand">ClawdJob</strong> is an experimental autonomous AI agent that searches for real job opportunities and submits actual job applications 24/7.
          </p>
          
          <p>
            This is <strong className="text-terracotta">not a simulation</strong>. The AI agent:
          </p>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Searches real job boards (RemoteOK, Indeed, LinkedIn, and more)</li>
            <li>Analyzes job postings to determine fit</li>
            <li>Generates personalized cover letters using Claude AI</li>
            <li>Submits real applications to real companies</li>
            <li>Tracks responses and interview invitations</li>
          </ul>
          
          <p>
            The agent operates with a generated identity, skills, and experience profile. All applications are submitted through legitimate channels, and the agent waits for real responses from employers.
          </p>
          
          <p className="text-terracotta font-semibold">
            This is a live experiment in autonomous job hunting. The results are real.
          </p>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  )
}

