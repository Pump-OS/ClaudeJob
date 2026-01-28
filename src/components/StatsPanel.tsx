'use client'

import { motion } from 'framer-motion'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Award,
  TrendingUp
} from 'lucide-react'

interface StatsPanelProps {
  stats: {
    totalApplications: number
    pending: number
    inReview: number
    interviews: number
    offers: number
    rejections: number
    noResponse: number
    successRate: number
  }
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: Send,
      color: 'text-sand',
      bgColor: 'bg-sand/10',
      borderColor: 'border-sand/20'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      borderColor: 'border-terracotta/20'
    },
    {
      label: 'In Review',
      value: stats.inReview,
      icon: TrendingUp,
      color: 'text-sand-light',
      bgColor: 'bg-sand-light/10',
      borderColor: 'border-sand-light/20'
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      icon: Calendar,
      color: 'text-sand',
      bgColor: 'bg-sand/10',
      borderColor: 'border-sand/20'
    },
    {
      label: 'Offers',
      value: stats.offers,
      icon: Award,
      color: 'text-sand-light',
      bgColor: 'bg-sand-light/10',
      borderColor: 'border-sand-light/20'
    },
    {
      label: 'Rejections',
      value: stats.rejections,
      icon: XCircle,
      color: 'text-rust',
      bgColor: 'bg-rust/10',
      borderColor: 'border-rust/20'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-coal/50 border border-coal-light/30 backdrop-blur-sm p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-sand">
          Application Stats
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-coal-lighter font-mono">Success Rate</span>
          <motion.span
            className="text-xl font-bold text-sand"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          >
            {stats.successRate.toFixed(1)}%
          </motion.span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl ${item.bgColor} border ${item.borderColor} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-coal-lighter font-mono">{item.label}</span>
            </div>
            <motion.p
              className={`text-2xl font-bold ${item.color}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {item.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-coal-lighter mb-2 font-mono">
          <span>Application Progress</span>
          <span>{stats.totalApplications} total</span>
        </div>
        <div className="h-3 bg-coal-dark rounded-full overflow-hidden flex">
          {stats.totalApplications > 0 && (
            <>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.interviews / stats.totalApplications) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-sand h-full"
                title={`Interviews: ${stats.interviews}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.inReview / stats.totalApplications) * 100}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-terracotta h-full"
                title={`In Review: ${stats.inReview}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.pending / stats.totalApplications) * 100}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-sand-dark h-full"
                title={`Pending: ${stats.pending}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.rejections / stats.totalApplications) * 100}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="bg-rust h-full"
                title={`Rejections: ${stats.rejections}`}
              />
            </>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-sand" />
            <span className="text-coal-lighter">Interviews</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="text-coal-lighter">In Review</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-sand-dark" />
            <span className="text-coal-lighter">Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rust" />
            <span className="text-coal-lighter">Rejected</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
