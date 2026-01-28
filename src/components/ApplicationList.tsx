'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Award,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'
import { Application } from '@/lib/types'

interface ApplicationListProps {
  applications: Application[]
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
  applied: { 
    label: 'Applied', 
    icon: Clock, 
    color: 'text-terracotta', 
    bg: 'bg-terracotta/10',
    border: 'border-terracotta/20'
  },
  viewed: { 
    label: 'Viewed', 
    icon: Eye, 
    color: 'text-sand', 
    bg: 'bg-sand/10',
    border: 'border-sand/20'
  },
  in_review: { 
    label: 'In Review', 
    icon: AlertCircle, 
    color: 'text-sand-light', 
    bg: 'bg-sand-light/10',
    border: 'border-sand-light/20'
  },
  interview_scheduled: { 
    label: 'Interview', 
    icon: Calendar, 
    color: 'text-sand', 
    bg: 'bg-sand/10',
    border: 'border-sand/20'
  },
  interviewed: { 
    label: 'Interviewed', 
    icon: CheckCircle, 
    color: 'text-sand', 
    bg: 'bg-sand/10',
    border: 'border-sand/20'
  },
  offer_received: { 
    label: '🎉 Offer!', 
    icon: Award, 
    color: 'text-sand-light', 
    bg: 'bg-sand-light/10',
    border: 'border-sand-light/20'
  },
  rejected: { 
    label: 'Rejected', 
    icon: XCircle, 
    color: 'text-rust', 
    bg: 'bg-rust/10',
    border: 'border-rust/20'
  },
  withdrawn: { 
    label: 'Withdrawn', 
    icon: XCircle, 
    color: 'text-coal-lighter', 
    bg: 'bg-coal/30',
    border: 'border-coal-light/20'
  },
  no_response: { 
    label: 'No Response', 
    icon: Clock, 
    color: 'text-coal-lighter', 
    bg: 'bg-coal/30',
    border: 'border-coal-light/20'
  }
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-coal/50 border border-coal-light/30 backdrop-blur-sm overflow-hidden card-hover flex flex-col w-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-coal-light/20">
        <h3 className="text-lg font-display font-bold text-sand">Application History</h3>
        <p className="text-sm text-coal-lighter mt-1 font-mono">
          {applications.length} total applications
        </p>
      </div>

      {/* Applications List */}
      <div className="h-[900px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Building2 className="w-12 h-12 mx-auto text-coal-lighter mb-4" />
              <p className="text-coal-lighter font-mono">No applications yet</p>
              <p className="text-coal-light text-sm mt-2">Agent will start applying soon...</p>
            </motion.div>
          ) : (
            applications.map((app, index) => {
              const status = statusConfig[app.status] || statusConfig.applied
              const StatusIcon = status.icon
              // Use combination of id and index to ensure uniqueness
              const uniqueKey = `${app.id}-${index}`
              
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border-b border-coal-light/10 hover:bg-coal/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Job Title & Company */}
                      <div className="flex items-start gap-2">
                        <h4 className="font-semibold text-sand truncate">
                          {app.job.title}
                        </h4>
                        {app.job.url && (
                          <a
                            href={app.job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-coal-lighter hover:text-sand transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      {/* Company & Location */}
                      <div className="flex items-center gap-3 mt-1 text-sm text-coal-lighter">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{app.job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{app.job.location}</span>
                        </div>
                      </div>
                      
                      {/* Platform & Date */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-coal-light font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-coal-dark capitalize">
                          {app.job.platform}
                        </span>
                        <span>
                          Applied {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                        </span>
                      </div>

                      {/* Salary if available */}
                      {app.job.salary && (
                        <p className="mt-2 text-sm text-sand font-mono">
                          💰 {app.job.salary}
                        </p>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${status.bg} ${status.border} border`}>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-xs font-mono ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Response message if any */}
                  {app.responseMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-2 rounded-lg bg-coal-dark/50 border border-coal-light/10"
                    >
                      <p className="text-xs text-coal-lighter font-mono">
                        Response: {app.responseMessage}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
