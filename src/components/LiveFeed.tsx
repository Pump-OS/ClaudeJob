'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  FileText, 
  Send, 
  Mail, 
  Brain, 
  AlertCircle,
  CheckCircle,
  Calendar,
  Radio
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ActivityLog } from '@/lib/types'

interface LiveFeedProps {
  logs: ActivityLog[]
  isLive?: boolean
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search_started: Search,
  job_found: FileText,
  job_analyzed: Brain,
  application_started: FileText,
  cover_letter_generated: FileText,
  application_submitted: Send,
  email_sent: Mail,
  email_received: Mail,
  status_update: CheckCircle,
  interview_scheduled: Calendar,
  error: AlertCircle,
  thinking: Brain
}

const colorMap: Record<string, string> = {
  search_started: 'text-sand border-sand/20 bg-sand/5',
  job_found: 'text-sand border-sand/20 bg-sand/5',
  job_analyzed: 'text-terracotta border-terracotta/20 bg-terracotta/5',
  application_started: 'text-terracotta border-terracotta/20 bg-terracotta/5',
  cover_letter_generated: 'text-sand border-sand/20 bg-sand/5',
  application_submitted: 'text-sand-light border-sand-light/20 bg-sand-light/5',
  email_sent: 'text-sand border-sand/20 bg-sand/5',
  email_received: 'text-terracotta border-terracotta/20 bg-terracotta/5',
  status_update: 'text-sand border-sand/20 bg-sand/5',
  interview_scheduled: 'text-sand-light border-sand-light/20 bg-sand-light/5',
  error: 'text-rust border-rust/20 bg-rust/5',
  thinking: 'text-coal-lighter border-coal-light/20 bg-coal/30'
}

export function LiveFeed({ logs, isLive = false }: LiveFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-coal/50 border border-coal-light/30 backdrop-blur-sm overflow-hidden card-hover flex flex-col w-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-coal-light/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-sand" />
          <h3 className="text-lg font-display font-bold text-sand">Live Activity</h3>
        </div>
        {isLive && (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-terracotta"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-mono text-terracotta uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>

      {/* Feed Content */}
      <div className="h-[920px] overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Brain className="w-12 h-12 mx-auto text-coal-lighter mb-4" />
              <p className="text-coal-lighter font-mono">Waiting for agent activity...</p>
              <p className="text-coal-light text-sm mt-2">Agent will start automatically</p>
            </motion.div>
          ) : (
            logs.map((log, index) => {
              const Icon = iconMap[log.type] || Brain
              const colorClass = colorMap[log.type] || colorMap.thinking
              // Use combination of id and index to ensure uniqueness
              const uniqueKey = `${log.id}-${index}`
              
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className={`p-3 rounded-xl border ${colorClass} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono leading-relaxed break-words">
                        {log.message}
                      </p>
                      <p className="text-xs text-coal-lighter mt-1 font-mono">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Typing indicator when live */}
      {isLive && (
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-coal-lighter"
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-sand"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-sand"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-sand"
            />
            <span className="text-xs font-mono ml-2">Agent is working...</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
